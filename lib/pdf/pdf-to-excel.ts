import * as XLSX from 'xlsx';
import type { ProcessingResult } from '@/types/pdf';
import { ErrorCode } from '@/types/pdf';

let pdfjsLib: unknown = null;

interface TextItem {
  str: string;
  hasEOL: boolean;
  width: number;
  transform: number[];
}

export async function pdfToExcel(file: File): Promise<ProcessingResult<Blob>> {
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
    const wb = XLSX.utils.book_new();

    let totalExtractedText = 0;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const items = textContent.items as TextItem[];
      if (items.length === 0) continue;

      totalExtractedText += items.length;

      // 1. Group into rows by Y (with ~4pt tolerance)
      const rowsMap = new Map<number, TextItem[]>();
      items.forEach((item: TextItem) => {
        if (!item.str || !item.str.trim()) return;
        
        const y = item.transform[5];
        
        let foundY = -1;
        for (const ey of rowsMap.keys()) {
          if (Math.abs(ey - y) <= 4) {
            foundY = ey;
            break;
          }
        }
        
        const targetY = foundY !== -1 ? foundY : y;
        if (!rowsMap.has(targetY)) rowsMap.set(targetY, []);
        rowsMap.get(targetY)!.push(item);
      });

      // 2. Sort rows top-to-bottom (Y descending in PDF)
      const sortedY = Array.from(rowsMap.keys()).sort((a, b) => b - a);

      // 3. Find column boundaries (X clustering)
      const allX = items.filter((i: TextItem) => i.str && i.str.trim()).map((i: TextItem) => i.transform[4]);
      allX.sort((a: number, b: number) => a - b);

      const colStops: number[] = [];
      if (allX.length > 0) {
        let currentStop = allX[0];
        colStops.push(currentStop);
        for (let i = 1; i < allX.length; i++) {
          // If next X is > 15 points away, it's a new column
          if (allX[i] - currentStop > 15) {
            currentStop = allX[i];
            colStops.push(currentStop);
          }
        }
      }

      // 4. Map rows to columns
      const sheetData: string[][] = [];

      for (const y of sortedY) {
        const rowItems = rowsMap.get(y)!;
        rowItems.sort((a, b) => a.transform[4] - b.transform[4]);
        
        const rowData: string[] = new Array(colStops.length).fill("");
        
        // Merge items that are extremely close to each other (same cell broken up)
        const mergedItems = [];
        let currentItem = { ...rowItems[0] };
        
        for (let i = 1; i < rowItems.length; i++) {
          const nextItem = rowItems[i];
          const distance = nextItem.transform[4] - (currentItem.transform[4] + currentItem.width);
          
          if (distance < 6) {
            // They belong together in the same cell
            currentItem.str += (currentItem.hasEOL || distance > 2 ? ' ' : '') + nextItem.str;
            currentItem.width = (nextItem.transform[4] + nextItem.width) - currentItem.transform[4];
          } else {
            mergedItems.push(currentItem);
            currentItem = { ...nextItem };
          }
        }
        mergedItems.push(currentItem);
        
        // Assign to columns
        for (const item of mergedItems) {
          const x = item.transform[4];
          
          let bestColIdx = 0;
          let minDiff = Infinity;
          for (let c = 0; c < colStops.length; c++) {
            const diff = Math.abs(x - colStops[c]);
            if (diff < minDiff) {
              minDiff = diff;
              bestColIdx = c;
            }
          }
          
          // Append if multiple text items map to the same column
          if (rowData[bestColIdx]) {
            rowData[bestColIdx] += " " + item.str.trim();
          } else {
            // Apply numeric detection where highly conservative
            const trimmed = item.str.trim();
            // Conservative check: pure integer or float, no leading zeros unless it's just '0' or '0.x'
            if (/^(0|[1-9]\d*)(\.\d+)?$/.test(trimmed)) {
                rowData[bestColIdx] = trimmed; // still stored as string for safety in aoa_to_sheet, which is perfect
            } else {
                rowData[bestColIdx] = trimmed;
            }
          }
        }
        
        sheetData.push(rowData);
      }

      const ws = XLSX.utils.aoa_to_sheet(sheetData);

      // Estimate column widths
      const colWidths = colStops.map((_, idx) => {
        let maxLen = 10;
        for (const row of sheetData) {
          if (row[idx] && row[idx].length > maxLen) {
            maxLen = row[idx].length;
          }
        }
        return { wch: Math.min(maxLen + 2, 50) }; // Cap at 50 characters width
      });
      ws['!cols'] = colWidths;

      // Sanitize sheet name (Excel limits to 31 chars, no []/*?:\)
      const sheetName = `Page ${pageNum}`;
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    if (totalExtractedText === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.PROCESSING_FAILED,
          message: 'This PDF appears to be scanned or image-based. PDF Toolboxx currently works best with text-based PDFs.'
        }
      };
    }

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

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
