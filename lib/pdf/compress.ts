import { PDFDocument } from 'pdf-lib';
import { ErrorCode, type ProcessingResult } from '@/types/pdf';

export type CompressionLevel = 'low' | 'medium' | 'high';

export async function compressPdf(file: File): Promise<ProcessingResult<Blob>> {
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

    // Simplest reliable compression for V1 browser-side:
    // 1. Create a fresh document (drops orphaned objects/incremental update bloat)
    // 2. Copy all pages
    // 3. Save with useObjectStreams to compress structural data
    const compressedPdf = await PDFDocument.create();
    const copiedPages = await compressedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    copiedPages.forEach(page => compressedPdf.addPage(page));
    
    const compressedBytes = await compressedPdf.save({ useObjectStreams: true });
    
    const blob = new Blob([compressedBytes as BlobPart], { type: 'application/pdf' });

    return {
      success: true,
      data: blob,
      metadata: {
        originalSize: file.size,
        outputSize: blob.size,
        pageCount: compressedPdf.getPageCount(),
        fileCount: 1
      }
    };
  } catch {
    return {
      success: false,
      error: {
        code: ErrorCode.PROCESSING_FAILED,
        message: 'An unexpected error occurred while compressing the PDF.'
      }
    };
  }
}
