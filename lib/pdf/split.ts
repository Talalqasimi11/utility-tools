import { PDFDocument } from 'pdf-lib';
import { Zip, ZipPassThrough } from 'fflate';
import { ErrorCode, type ProcessingResult } from '@/types/pdf';

export type SplitMode = 'extract' | 'split-all' | 'split-ranges';

export interface SplitOptions {
  mode: SplitMode;
  rangesStr?: string; 
}

/**
 * Parses "1-3, 5, 7-9" into an array of number arrays:
 * [[1, 2, 3], [5], [7, 8, 9]]
 */
export function parseRanges(input: string, maxPages: number): number[][] | null {
  const chunks = input.split(',').map(s => s.trim()).filter(Boolean);
  if (chunks.length === 0) return null;

  const result: number[][] = [];
  
  for (const chunk of chunks) {
    if (chunk.includes('-')) {
      const parts = chunk.split('-');
      if (parts.length !== 2) return null;
      
      const start = parseInt(parts[0], 10);
      const end = parseInt(parts[1], 10);
      
      if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > maxPages) {
        return null;
      }
      
      const range = [];
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      result.push(range);
    } else {
      const page = parseInt(chunk, 10);
      if (isNaN(page) || page < 1 || page > maxPages) {
        return null;
      }
      result.push([page]);
    }
  }
  
  return result;
}

export async function splitPdf(file: File, options: SplitOptions): Promise<ProcessingResult<Blob>> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    let sourcePdf: PDFDocument;
    
    try {
      sourcePdf = await PDFDocument.load(arrayBuffer);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.toLowerCase().includes('encrypted')) {
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

    const totalPages = sourcePdf.getPageCount();
    
    if (options.mode === 'split-all') {
      const zipBlob = await new Promise<Blob>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        const zip = new Zip((err, data, final) => {
          if (err) return reject(err);
          chunks.push(data);
          if (final) {
            resolve(new Blob(chunks as BlobPart[], { type: 'application/zip' }));
          }
        });

        (async () => {
          try {
            for (let i = 0; i < totalPages; i++) {
              const doc = await PDFDocument.create();
              const [copiedPage] = await doc.copyPages(sourcePdf, [i]);
              doc.addPage(copiedPage);
              const bytes = await doc.save();
              
              // Zero-padded filename, e.g. page-001.pdf
              const pageNum = String(i + 1).padStart(String(totalPages).length, '0');
              const file = new ZipPassThrough(`page-${pageNum}.pdf`);
              zip.add(file);
              file.push(bytes, true);
            }
            zip.end();
          } catch (e) {
            reject(e);
          }
        })();
      });

      return {
        success: true,
        data: zipBlob,
        metadata: {
          originalSize: file.size,
          outputSize: zipBlob.size,
          pageCount: totalPages,
          fileCount: totalPages
        }
      };
    } 
    
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
        error: { code: ErrorCode.INVALID_PAGE_RANGE, message: 'Invalid page range syntax or page out of bounds.' }
      };
    }

    if (options.mode === 'extract') {
      // Flatten all groups into a single array of 0-indexed pages
      const allPages = parsedGroups.flat().map(p => p - 1);
      const doc = await PDFDocument.create();
      const copiedPages = await doc.copyPages(sourcePdf, allPages);
      copiedPages.forEach(p => doc.addPage(p));
      
      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      
      return {
        success: true,
        data: blob,
        metadata: {
          originalSize: file.size,
          outputSize: blob.size,
          pageCount: allPages.length,
          fileCount: 1
        }
      };
    } 
    
    if (options.mode === 'split-ranges') {
      const zipBlob = await new Promise<Blob>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        const zip = new Zip((err, data, final) => {
          if (err) return reject(err);
          chunks.push(data);
          if (final) {
            resolve(new Blob(chunks as BlobPart[], { type: 'application/zip' }));
          }
        });

        (async () => {
          try {
            for (let i = 0; i < parsedGroups.length; i++) {
              const pages = parsedGroups[i].map(p => p - 1);
              const doc = await PDFDocument.create();
              const copiedPages = await doc.copyPages(sourcePdf, pages);
              copiedPages.forEach(p => doc.addPage(p));
              
              const bytes = await doc.save();
              const file = new ZipPassThrough(`split-part-${i + 1}.pdf`);
              zip.add(file);
              file.push(bytes, true);
            }
            zip.end();
          } catch (e) {
            reject(e);
          }
        })();
      });

      return {
        success: true,
        data: zipBlob,
        metadata: {
          originalSize: file.size,
          outputSize: zipBlob.size,
          pageCount: parsedGroups.flat().length,
          fileCount: parsedGroups.length
        }
      };
    }

    return {
      success: false,
      error: { code: ErrorCode.UNKNOWN_ERROR, message: 'Unknown split mode.' }
    };

  } catch {
    return {
      success: false,
      error: {
        code: ErrorCode.PROCESSING_FAILED,
        message: 'An unexpected error occurred while splitting the PDF.'
      }
    };
  }
}
