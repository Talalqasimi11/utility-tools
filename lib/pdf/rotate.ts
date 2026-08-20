import { PDFDocument, degrees } from 'pdf-lib';
import { ErrorCode, type ProcessingResult } from '@/types/pdf';

export interface RotateOptions {
  rotations: Record<number, number>; // index -> additional clockwise rotation in degrees
}

export async function rotatePdf(file: File, options: RotateOptions): Promise<ProcessingResult<Blob>> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    let pdfDoc: PDFDocument;

    try {
      pdfDoc = await PDFDocument.load(arrayBuffer);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.toLowerCase().includes('encrypted')) {
         return {
           success: false,
           error: {
             code: ErrorCode.PASSWORD_PROTECTED,
             message: `File "${file.name}" is password protected. Please unlock it first.`
           }
         };
      }
      return {
        success: false,
        error: {
          code: ErrorCode.CORRUPTED_FILE,
          message: `File "${file.name}" is corrupted or not a valid PDF.`
        }
      };
    }

    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    for (let i = 0; i < totalPages; i++) {
      const addedRotation = options.rotations[i];
      if (addedRotation) {
        const page = pages[i];
        const currentRotation = page.getRotation().angle;
        // Calculate new rotation, normalizing to 0, 90, 180, 270 clockwise
        let newRotation = (currentRotation + addedRotation) % 360;
        if (newRotation < 0) newRotation += 360;
        page.setRotation(degrees(newRotation));
      }
    }

    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });

    return {
      success: true,
      data: blob,
      metadata: {
        originalSize: file.size,
        outputSize: blob.size,
        pageCount: totalPages,
        fileCount: 1
      }
    };
  } catch (err) {
    return {
      success: false,
      error: {
        code: ErrorCode.PROCESSING_FAILED,
        message: 'An unexpected error occurred while rotating the PDF.'
      }
    };
  }
}
