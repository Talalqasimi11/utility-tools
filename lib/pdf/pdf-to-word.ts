import { Document, Packer, Paragraph, TextRun } from 'docx';
import type { ProcessingResult } from '@/types/pdf';
import { ErrorCode } from '@/types/pdf';

export async function pdfToWord(file: File): Promise<ProcessingResult<Blob>> {
  try {
    // @ts-expect-error - pdfjs-dist build files lack .d.ts declarations
    const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    
    let pdf;
    try {
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
    const docxParagraphs: Paragraph[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const lineMap = new Map<number, any[]>();
      
      textContent.items.forEach((item: any) => {
        if (!item.str || item.str.trim() === '') return;
        
        const y = Math.round(item.transform[5]); 
        
        let foundY = -1;
        for (const existingY of lineMap.keys()) {
          if (Math.abs(existingY - y) <= 3) {
            foundY = existingY;
            break;
          }
        }
        
        const targetY = foundY !== -1 ? foundY : y;
        if (!lineMap.has(targetY)) {
          lineMap.set(targetY, []);
        }
        lineMap.get(targetY)!.push(item);
      });
      
      const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
      
      let currentParagraphLines: any[][] = [];
      let lastY = -1;
      
      const processParagraph = (lines: any[][]) => {
        if (lines.length === 0) return;
        
        const runs: TextRun[] = [];
        
        lines.forEach((line, index) => {
          line.sort((a, b) => a.transform[4] - b.transform[4]);
          
          let currentStr = "";
          let currentStyle = { bold: false, italic: false, size: 24 };
          let firstItem = true;
          
          line.forEach((item, i) => {
            const fontName = (item.fontName || '').toLowerCase();
            const isBold = fontName.includes('bold') || fontName.includes('black');
            const isItalic = fontName.includes('italic') || fontName.includes('oblique');
            const size = Math.max(16, Math.round(item.transform[3] * 2)); // Docx sizes are half-points
            
            // basic gap detection to add spaces if PDF items are separated
            const prevItem = i > 0 ? line[i-1] : null;
            let gap = 0;
            if (prevItem) {
              const prevEndX = prevItem.transform[4] + prevItem.width;
              gap = item.transform[4] - prevEndX;
            }
            
            if (!firstItem && (isBold !== currentStyle.bold || isItalic !== currentStyle.italic || Math.abs(size - currentStyle.size) > 4 || gap > 4)) {
              runs.push(new TextRun({
                text: currentStr + (gap > 4 ? ' ' : ''),
                bold: currentStyle.bold,
                italics: currentStyle.italic,
                size: currentStyle.size
              }));
              currentStr = item.str;
              currentStyle = { bold: isBold, italic: isItalic, size };
            } else {
              if (gap > 4) currentStr += ' ';
              currentStr += item.str;
              if (item.hasEOL) currentStr += ' ';
              if (firstItem) {
                currentStyle = { bold: isBold, italic: isItalic, size };
                firstItem = false;
              }
            }
          });
          
          if (currentStr) {
            if (index < lines.length - 1) currentStr += ' ';
            runs.push(new TextRun({
              text: currentStr,
              bold: currentStyle.bold,
              italics: currentStyle.italic,
              size: currentStyle.size
            }));
          }
        });
        
        docxParagraphs.push(new Paragraph({
          children: runs,
          spacing: { after: 200 }
        }));
      };
      
      for (const y of sortedYs) {
        const line = lineMap.get(y)!;
        const approxFontSize = line.length > 0 ? line[0].transform[3] : 12;
        const gap = lastY !== -1 ? lastY - y : 0;
        
        if (lastY !== -1 && gap > approxFontSize * 1.5) {
          processParagraph(currentParagraphLines);
          currentParagraphLines = [];
        }
        
        currentParagraphLines.push(line);
        lastY = y;
      }
      
      processParagraph(currentParagraphLines);
      
      if (pageNum < numPages && docxParagraphs.length > 0) {
        docxParagraphs.push(new Paragraph({
          pageBreakBefore: true,
        }));
      }
    }

    if (docxParagraphs.length === 0) {
      docxParagraphs.push(new Paragraph({
        children: [new TextRun("No readable text found in this document.")],
      }));
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: docxParagraphs,
      }],
    });

    const blob = await Packer.toBlob(doc);

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
