import { PDFDocument, PageSizes } from 'pdf-lib';
import { ErrorCode, type ProcessingResult } from '@/types/pdf';

export type PageSizeOption = 'a4' | 'letter' | 'original';
export type OrientationOption = 'auto' | 'portrait' | 'landscape';

export interface JpgToPdfOptions {
  pageSize: PageSizeOption;
  orientation: OrientationOption;
}

export async function imagesToPdf(files: File[], options: JpgToPdfOptions): Promise<ProcessingResult<Blob>> {
  try {
    const pdfDoc = await PDFDocument.create();
    let totalOriginalSize = 0;

    for (const file of files) {
      totalOriginalSize += file.size;
      const arrayBuffer = await file.arrayBuffer();
      
      let image;
      const fileType = file.type.toLowerCase();
      try {
        if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (fileType === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          return {
            success: false,
            error: {
              code: ErrorCode.UNSUPPORTED_FORMAT,
              message: `File "${file.name}" is not a supported image format. Only JPG and PNG are allowed.`
            }
          };
        }
      } catch {
        return {
          success: false,
          error: {
            code: ErrorCode.CORRUPTED_FILE,
            message: `Failed to process "${file.name}". The image may be corrupted.`
          }
        };
      }

      const imgDims = image.scale(1);
      
      let targetWidth: number;
      let targetHeight: number;

      if (options.pageSize === 'original') {
        targetWidth = imgDims.width;
        targetHeight = imgDims.height;
      } else {
        const standardDims = options.pageSize === 'a4' ? PageSizes.A4 : PageSizes.Letter;
        const [ptWidth, ptHeight] = standardDims;
        
        // Determine orientation
        let isLandscape = false;
        if (options.orientation === 'landscape') {
          isLandscape = true;
        } else if (options.orientation === 'portrait') {
          isLandscape = false;
        } else {
          // auto
          isLandscape = imgDims.width > imgDims.height;
        }

        targetWidth = isLandscape ? Math.max(ptWidth, ptHeight) : Math.min(ptWidth, ptHeight);
        targetHeight = isLandscape ? Math.min(ptWidth, ptHeight) : Math.max(ptWidth, ptHeight);
      }

      const page = pdfDoc.addPage([targetWidth, targetHeight]);

      if (options.pageSize === 'original') {
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: targetWidth,
          height: targetHeight,
        });
      } else {
        // Fit within page, preserve aspect ratio
        const scale = Math.min(targetWidth / imgDims.width, targetHeight / imgDims.height);
        
        // Don't upscale if the image is smaller than the page
        const finalScale = scale > 1 ? 1 : scale;
        
        const fitWidth = imgDims.width * finalScale;
        const fitHeight = imgDims.height * finalScale;
        
        // Center the image
        const x = (targetWidth - fitWidth) / 2;
        const y = (targetHeight - fitHeight) / 2;

        page.drawImage(image, {
          x,
          y,
          width: fitWidth,
          height: fitHeight,
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

    return {
      success: true,
      data: blob,
      metadata: {
        originalSize: totalOriginalSize,
        outputSize: blob.size,
        pageCount: files.length,
        fileCount: files.length,
      }
    };

  } catch {
    return {
      success: false,
      error: {
        code: ErrorCode.PROCESSING_FAILED,
        message: 'An unexpected error occurred while converting images to PDF.'
      }
    };
  }
}
