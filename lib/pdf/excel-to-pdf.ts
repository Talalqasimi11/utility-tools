import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import * as XLSX from 'xlsx';
import type { ProcessingResult } from '@/types/pdf';
import { ErrorCode } from '@/types/pdf';

export async function excelToPdf(file: File): Promise<ProcessingResult<Blob>> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    let wb: XLSX.WorkBook;
    try {
      wb = XLSX.read(arrayBuffer, { type: 'array' });
    } catch {
      return {
        success: false,
        error: {
          code: ErrorCode.INVALID_FILE,
          message: `Unable to read this Excel file. Please make sure it is a valid .xlsx or .xls file.`
        }
      };
    }

    if (wb.SheetNames.length === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.PROCESSING_FAILED,
          message: 'This workbook appears to have no worksheets.'
        }
      };
    }

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // A4 Landscape
    const pageWidth = 841.89;
    const pageHeight = 595.28;
    const margin = 40;
    const usableWidth = pageWidth - margin * 2;
    const fontSize = 10;
    const padding = 4;
    const lineHeight = fontSize * 1.2;

    const wrapText = (text: string, maxWidth: number, textFont: PDFFont): string[] => {
      // Split by newlines first
      const rawLines = text.split(/\r?\n/);
      const finalLines: string[] = [];

      for (const rawLine of rawLines) {
        if (!rawLine.trim()) {
          finalLines.push('');
          continue;
        }
        
        const words = rawLine.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          const testWidth = textFont.widthOfTextAtSize(testLine, fontSize);
          
          if (testWidth > maxWidth && currentLine) {
            finalLines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) finalLines.push(currentLine);
      }
      return finalLines.length > 0 ? finalLines : [''];
    };

    let totalCellsExtracted = 0;

    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];
      const data: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });

      if (data.length === 0) {
        continue;
      }

      // Find max columns
      const numCols = Math.max(...data.map(row => row.length));
      if (numCols === 0) continue;

      totalCellsExtracted += data.reduce((acc, row) => acc + row.length, 0);

      const colWidths: number[] = new Array(numCols).fill(0);

      // Estimate max widths without wrapping
      for (const row of data) {
        for (let i = 0; i < numCols; i++) {
          const text = String(row[i] ?? '').trim();
          if (text) {
            const w = font.widthOfTextAtSize(text, fontSize);
            if (w > colWidths[i]) colWidths[i] = w;
          }
        }
      }

      // Add padding
      for (let i = 0; i < numCols; i++) {
        colWidths[i] += padding * 2;
      }

      // Scale down if it exceeds usable width
      const totalMax = colWidths.reduce((a, b) => a + b, 0);
      if (totalMax > usableWidth) {
        const scale = usableWidth / totalMax;
        for (let i = 0; i < numCols; i++) {
          colWidths[i] = Math.max(25, colWidths[i] * scale); // 25pt minimum
        }
        // If still exceeding, distribute evenly
        const totalNow = colWidths.reduce((a, b) => a + b, 0);
        if (totalNow > usableWidth) {
          const eq = usableWidth / numCols;
          for (let i = 0; i < numCols; i++) colWidths[i] = eq;
        }
      }

      // Render Sheet
      let page: PDFPage | null = null;
      let y = 0;

      const newPage = () => {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      };

      newPage();

      // Draw Worksheet Title
      page!.drawText(sheetName, { x: margin, y, size: 14, font: fontBold });
      y -= 25;

      const headerRow = data.length > 0 ? data[0].map(c => String(c ?? '').trim()) : null;

      const drawRow = (rowCells: string[], isHeader: boolean) => {
        const textFont = isHeader ? fontBold : font;
        
        // Compute wrapping
        const cellLinesArr: string[][] = rowCells.map((cell, i) => {
          const maxW = Math.max(10, colWidths[i] - padding * 2);
          return wrapText(cell, maxW, textFont);
        });

        const maxLines = Math.max(1, ...cellLinesArr.map(l => l.length));
        const rowHeight = (maxLines * lineHeight) + (padding * 2);

        // Page break
        if (y - rowHeight < margin) {
          newPage();
          if (!isHeader && headerRow) {
            // Re-draw header
            const hCellLinesArr = headerRow.map((cell, i) => {
              const maxW = Math.max(10, colWidths[i] - padding * 2);
              return wrapText(cell, maxW, fontBold);
            });
            const hMaxLines = Math.max(1, ...hCellLinesArr.map(l => l.length));
            const hRowHeight = (hMaxLines * lineHeight) + (padding * 2);
            drawRowInternal(headerRow, hCellLinesArr, hRowHeight, true);
          }
        }
        
        drawRowInternal(rowCells, cellLinesArr, rowHeight, isHeader);
      };

      const drawRowInternal = (rowCells: string[], cellLinesArr: string[][], rowHeight: number, isHeader: boolean) => {
        let x = margin;
        const textFont = isHeader ? fontBold : font;
        const bgColor = isHeader ? rgb(0.9, 0.9, 0.9) : undefined;
        
        for (let i = 0; i < numCols; i++) {
          const cw = colWidths[i];
          const lines = cellLinesArr[i] || [];

          // Background
          if (bgColor) {
            page!.drawRectangle({
              x,
              y: y - rowHeight,
              width: cw,
              height: rowHeight,
              color: bgColor
            });
          }

          // Borders
          page!.drawRectangle({
            x,
            y: y - rowHeight,
            width: cw,
            height: rowHeight,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 1
          });

          // Text
          let textY = y - padding - fontSize;
          for (const line of lines) {
            page!.drawText(line, {
              x: x + padding,
              y: textY,
              size: fontSize,
              font: textFont,
              color: rgb(0, 0, 0)
            });
            textY -= lineHeight;
          }

          x += cw;
        }

        y -= rowHeight;
      };

      for (let r = 0; r < data.length; r++) {
        // Pad row to ensure it has all columns
        const rowCells = [];
        for(let i=0; i<numCols; i++) {
          rowCells.push(String(data[r][i] ?? '').trim());
        }
        drawRow(rowCells, r === 0);
      }
    }

    if (totalCellsExtracted === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.PROCESSING_FAILED,
          message: 'The Excel file contains no readable data.'
        }
      };
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

    return {
      success: true,
      data: blob,
      metadata: {
        originalSize: file.size,
        outputSize: blob.size,
        pageCount: pdfDoc.getPageCount(),
        fileCount: 1
      }
    };
  } catch (err) {
    return {
      success: false,
      error: {
        code: ErrorCode.PROCESSING_FAILED,
        message: err instanceof Error ? err.message : 'An unexpected error occurred while converting the Excel file.'
      }
    };
  }
}
