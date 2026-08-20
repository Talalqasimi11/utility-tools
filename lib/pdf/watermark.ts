import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { ErrorCode, type ProcessingResult } from '@/types/pdf';

export interface WatermarkOptions {
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  position: 'top-left' | 'top-center' | 'center' | 'bottom-center' | 'bottom-right';
  scope: 'all' | 'selected';
  selectedPages?: number[];
}

export async function watermarkPdf(file: File, options: WatermarkOptions): Promise<ProcessingResult<Blob>> {
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

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    const rad = (options.rotation * Math.PI) / 180;
    const margin = 30;

    for (let i = 0; i < totalPages; i++) {
      if (options.scope === 'selected' && options.selectedPages && !options.selectedPages.includes(i)) {
        continue;
      }

      const page = pages[i];
      const { width, height } = page.getSize();
      
      const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);
      const textHeight = font.heightAtSize(options.fontSize);

      let Cx = width / 2;
      let Cy = height / 2;

      if (options.position === 'top-left') {
        Cx = margin + textWidth / 2;
        Cy = height - margin - textHeight / 2;
      } else if (options.position === 'top-center') {
        Cx = width / 2;
        Cy = height - margin - textHeight / 2;
      } else if (options.position === 'bottom-center') {
        Cx = width / 2;
        Cy = margin + textHeight / 2;
      } else if (options.position === 'bottom-right') {
        Cx = width - margin - textWidth / 2;
        Cy = margin + textHeight / 2;
      }

      // Constrain Cx and Cy to keep text inside bounds roughly (if it's larger than page)
      Cx = Math.max(0, Math.min(width, Cx));
      Cy = Math.max(0, Math.min(height, Cy));

      const C_rot_x = (textWidth / 2) * Math.cos(rad) - (textHeight / 2) * Math.sin(rad);
      const C_rot_y = (textWidth / 2) * Math.sin(rad) + (textHeight / 2) * Math.cos(rad);

      const x = Cx - C_rot_x;
      const y = Cy - C_rot_y;

      page.drawText(options.text, {
        x,
        y,
        size: options.fontSize,
        font,
        color: rgb(0, 0, 0),
        opacity: options.opacity,
        rotate: degrees(options.rotation)
      });
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
        message: 'An unexpected error occurred while applying the watermark.'
      }
    };
  }
}
