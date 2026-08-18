import JSZip from 'jszip';
import { ErrorCode, type ProcessingResult } from '@/types/pdf';
import { parseRanges } from '@/lib/pdf/split';

export type ImageQuality = 'low' | 'medium' | 'high';

export interface PdfToJpgOptions {
  mode: 'all' | 'selected';
  rangesStr?: string;
  quality: ImageQuality;
}

const getQualityValue = (quality: ImageQuality): number => {
  switch (quality) {
    case 'low': return 0.5;
    case 'high': return 1.0;
    case 'medium':
    default:
      return 0.8;
  }
};

export async function convertPdfToJpg(file: File, options: PdfToJpgOptions): Promise<ProcessingResult<Blob>> {
  try {
    // Dynamically import pdfjs-dist to avoid SSR issues
    // @ts-expect-error
    const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
    
    // Set the worker source to the unpkg CDN to avoid complex bundler configurations
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    
    let pdf;
    try {
      // Load the PDF document
      pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.toLowerCase().includes('password')) {
         return {
           success: false,
           error: {
             code: ErrorCode.PASSWORD_PROTECTED,
             message: `File "${file.name}" is password protected. Please unlock it first.`
           }
         }
      }
      return {
        success: false,
        error: {
          code: ErrorCode.CORRUPTED_FILE,
          message: `File "${file.name}" is corrupted or not a valid PDF.`
        }
      };
    }

    const totalPages = pdf.numPages;
    let targetPages: number[] = [];

    if (options.mode === 'all') {
      for (let i = 1; i <= totalPages; i++) {
        targetPages.push(i);
      }
    } else {
      if (!options.rangesStr) {
        return {
          success: false,
          error: { code: ErrorCode.INVALID_PAGE_RANGE, message: 'No pages specified.' }
        };
      }
      const parsedGroups = parseRanges(options.rangesStr, totalPages);
      if (!parsedGroups) {
        return {
          success: false,
          error: { code: ErrorCode.INVALID_PAGE_RANGE, message: `Invalid page range syntax. Pages must be between 1 and ${totalPages}.` }
        };
      }
      // Flatten and remove duplicates, sorting numerically
      targetPages = Array.from(new Set(parsedGroups.flat())).sort((a, b) => a - b);
    }

    if (targetPages.length === 0) {
      return {
        success: false,
        error: { code: ErrorCode.INVALID_PAGE_RANGE, message: 'No pages selected.' }
      };
    }

    const qualityValue = getQualityValue(options.quality);
    const scale = 2.0; // Render at 2x scale for good quality output

    if (targetPages.length === 1) {
      // Single page extraction -> return a single JPG Blob
      const pageNum = targetPages[0];
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: ctx, viewport }).promise;
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas toBlob failed'));
        }, 'image/jpeg', qualityValue);
      });

      return {
        success: true,
        data: blob,
        metadata: {
          originalSize: file.size,
          outputSize: blob.size,
          pageCount: 1,
          fileCount: 1,
        }
      };
    }

    // Multiple pages -> create a ZIP file
    const zip = new JSZip();

    for (const pageNum of targetPages) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: ctx, viewport }).promise;
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas toBlob failed'));
        }, 'image/jpeg', qualityValue);
      });

      const arrayBuffer = await blob.arrayBuffer();
      
      // Zero-pad the filename based on the max page number length
      const paddedNum = String(pageNum).padStart(String(totalPages).length, '0');
      zip.file(`page-${paddedNum}.jpg`, arrayBuffer);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    return {
      success: true,
      data: zipBlob,
      metadata: {
        originalSize: file.size,
        outputSize: zipBlob.size,
        pageCount: targetPages.length,
        fileCount: targetPages.length,
      }
    };

  } catch {
    return {
      success: false,
      error: {
        code: ErrorCode.PROCESSING_FAILED,
        message: 'An unexpected error occurred while converting the PDF to JPG.'
      }
    };
  }
}
