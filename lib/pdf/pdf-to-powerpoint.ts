import pptxgen from 'pptxgenjs';
import type { ProcessingResult } from '@/types/pdf';
import { ErrorCode } from '@/types/pdf';

let pdfjsLib: unknown = null;

interface PdfTextItem {
  str: string;
  hasEOL: boolean;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
}

export async function pdfToPowerpoint(file: File): Promise<ProcessingResult<Blob>> {
  try {
    if (!pdfjsLib) {
      // @ts-expect-error - pdfjs-dist build files lack .d.ts declarations
      pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
      // @ts-expect-error - dynamic load
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();

    let pdf;
    try {
      // @ts-expect-error - dynamic load
      pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.toLowerCase().includes('password')) {
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

    const numPages = pdf.numPages;
    const pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches

    const pptxWidth = 10;
    const pptxHeight = 5.625;

    let totalExtractedText = 0;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1.0 });

      const pdfWidth = viewport.width;
      const pdfHeight = viewport.height;

      const slide = pres.addSlide();

      const items = textContent.items as PdfTextItem[];
      if (items.length === 0) continue;

      totalExtractedText += items.length;

      // Group items into lines by Y coordinate
      const linesMap = new Map<number, PdfTextItem[]>();
      items.forEach((item) => {
        if (!item.str || !item.str.trim()) return;

        const y = item.transform[5];
        let foundY = -1;
        for (const ey of linesMap.keys()) {
          // 4 points tolerance
          if (Math.abs(ey - y) <= 4) {
            foundY = ey;
            break;
          }
        }
        const targetY = foundY !== -1 ? foundY : y;
        if (!linesMap.has(targetY)) linesMap.set(targetY, []);
        linesMap.get(targetY)!.push(item);
      });

      const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a); // Top to bottom

      for (const y of sortedY) {
        const rowItems = linesMap.get(y)!;
        rowItems.sort((a, b) => a.transform[4] - b.transform[4]); // Left to right

        // Merge adjacent items
        const mergedItems: PdfTextItem[] = [];
        let currentItem = { ...rowItems[0] };

        for (let i = 1; i < rowItems.length; i++) {
          const nextItem = rowItems[i];
          const distance = nextItem.transform[4] - (currentItem.transform[4] + currentItem.width);

          // If within ~5 points, merge them
          if (distance < 5) {
            currentItem.str += (currentItem.hasEOL || distance > 1.5 ? ' ' : '') + nextItem.str;
            currentItem.width = (nextItem.transform[4] + nextItem.width) - currentItem.transform[4];
            currentItem.transform[0] = Math.max(currentItem.transform[0], nextItem.transform[0]);
          } else {
            mergedItems.push(currentItem);
            currentItem = { ...nextItem };
          }
        }
        mergedItems.push(currentItem);

        for (const item of mergedItems) {
          const textStr = item.str.trim();
          if (!textStr) continue;

          const itemX = item.transform[4];
          const itemY = item.transform[5];
          const fontSizePt = item.transform[0] || 12; // approximate font height in pt
          const itemW = item.width;
          const itemH = fontSizePt; // safe heuristic for text height

          // Map PDF coordinates to PPTX inches
          const xInch = (itemX / pdfWidth) * pptxWidth;
          // PDF Y is bottom-up, PPTX is top-down
          const pdfYTop = pdfHeight - itemY - itemH;
          const yInch = (pdfYTop / pdfHeight) * pptxHeight;
          const wInch = Math.max((itemW / pdfWidth) * pptxWidth + 0.5, 0.5); // Provide slight padding
          const hInch = (itemH / pdfHeight) * pptxHeight + 0.2;

          const isBold = item.fontName ? item.fontName.toLowerCase().includes('bold') : false;
          const isItalic = item.fontName ? item.fontName.toLowerCase().includes('italic') : false;
          
          // Constrain font size safely for PowerPoint
          const safeFontSize = Math.max(8, Math.min(Math.round(fontSizePt), 72));

          slide.addText(textStr, {
            x: xInch,
            y: yInch,
            w: wInch,
            h: hInch,
            fontSize: safeFontSize,
            bold: isBold,
            italic: isItalic,
            color: '000000',
            fontFace: 'Arial', // Fallback universal font
            margin: 0,
            valign: 'top'
          });
        }
      }
    }

    if (totalExtractedText === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.PROCESSING_FAILED,
          message: 'This PDF appears to be scanned or image-based. Text extraction is not available for scanned PDFs yet.'
        }
      };
    }

    // Export the presentation as an ArrayBuffer, then create a Blob
    const pptxBuffer = await pres.write({ outputType: 'arraybuffer' }) as ArrayBuffer;
    const blob = new Blob([pptxBuffer], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });

    return {
      success: true,
      data: blob,
      metadata: {
        originalSize: file.size,
        outputSize: blob.size,
        pageCount: numPages,
        fileCount: 1
      }
    };

  } catch (err) {
    return {
      success: false,
      error: {
        code: ErrorCode.PROCESSING_FAILED,
        message: err instanceof Error ? err.message : 'An unexpected error occurred while converting the PDF.'
      }
    };
  }
}
