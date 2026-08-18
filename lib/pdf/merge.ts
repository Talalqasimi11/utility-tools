import { PDFDocument } from 'pdf-lib';
import { ErrorCode, type ProcessingResult } from '@/types/pdf';

export async function mergePdfs(files: File[]): Promise<ProcessingResult<Blob>> {
  try {
    const mergedPdf = await PDFDocument.create();
    let totalOriginalSize = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      totalOriginalSize += file.size;
      const arrayBuffer = await file.arrayBuffer();
      
      let pdf: PDFDocument;
      try {
        pdf = await PDFDocument.load(arrayBuffer);
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

      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes as BlobPart], { type: 'application/pdf' });

    return {
      success: true,
      data: blob,
      metadata: {
        originalSize: totalOriginalSize,
        outputSize: blob.size,
        pageCount: mergedPdf.getPageCount(),
        fileCount: files.length,
      }
    };
  } catch {
    return {
      success: false,
      error: {
        code: ErrorCode.PROCESSING_FAILED,
        message: 'An unexpected error occurred while merging the PDFs.'
      }
    };
  }
}
