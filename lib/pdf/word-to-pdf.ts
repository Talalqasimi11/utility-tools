import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';
import * as mammoth from 'mammoth';
import { DOMParser } from '@xmldom/xmldom';
import type { ProcessingResult } from '@/types/pdf';
import { ErrorCode } from '@/types/pdf';

export async function wordToPdf(file: File): Promise<ProcessingResult<Blob>> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract semantic HTML from DOCX using mammoth
    let result;
    try {
      result = await mammoth.convertToHtml({ arrayBuffer }, {
        includeDefaultStyleMap: true,
      });
    } catch {
      return {
        success: false,
        error: {
          code: ErrorCode.INVALID_FILE,
          message: 'The file is not a valid DOCX document or is corrupted.'
        }
      };
    }

    let html = result.value;
    if (!html.trim()) {
      html = '<p>No readable text found in this document.</p>';
    }

    // Wrap in a root element for xmldom parsing
    html = `<root>${html}</root>`;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/xml");
    
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    
    const margin = 50;
    const width = 595.28; // A4 width
    const height = 841.89; // A4 height
    const maxWidth = width - margin;
    
    let page = pdfDoc.addPage([width, height]);
    let y = height - margin;
    let x = margin;
    let isNewLine = true;
    
    const addPage = () => {
      page = pdfDoc.addPage([width, height]);
      y = height - margin;
      x = margin;
      isNewLine = true;
    };
    
    const advanceLine = (size: number, isList: boolean = false) => {
      y -= size * 1.5;
      x = isList ? margin + 20 : margin;
      if (y < margin) addPage();
      isNewLine = true;
    };
    
    const renderText = (text: string, font: PDFFont, size: number, isList = false) => {
      if (!text) return;
      
      // Split by spaces but keep them to measure accurately
      const words = text.split(/(\s+)/);
      
      for (const word of words) {
        if (!word) continue;
        
        const wordWidth = font.widthOfTextAtSize(word, size);
        
        if (x + wordWidth > maxWidth && word.trim() !== '') {
          advanceLine(size, isList);
        }
        
        // Skip leading whitespace on new lines
        if (isNewLine && word.trim() === '') {
          continue;
        }
        
        page.drawText(word, { x, y, size, font, color: rgb(0,0,0) });
        x += wordWidth;
        isNewLine = false;
      }
    };

    const processNode = (node: Node | null, options: { size: number, font: PDFFont, isList?: boolean, listDepth?: number }) => {
      if (!node) return;

      if (node.nodeType === 3) { // Text node
        // Replace newlines in HTML text nodes with spaces to avoid breaking flow
        const text = (node.nodeValue || '').replace(/[\r\n]+/g, ' ');
        renderText(text, options.font, options.size, options.isList);
      } else if (node.nodeType === 1) { // Element node
        const tag = node.nodeName.toLowerCase();
        const newOptions = { ...options };
        let isBlock = false;
        let isListBlock = false;

        if (tag === 'h1') {
          newOptions.size = 24;
          newOptions.font = helveticaBold;
          isBlock = true;
        } else if (tag === 'h2') {
          newOptions.size = 18;
          newOptions.font = helveticaBold;
          isBlock = true;
        } else if (tag === 'h3' || tag === 'h4') {
          newOptions.size = 14;
          newOptions.font = helveticaBold;
          isBlock = true;
        } else if (tag === 'p') {
          isBlock = true;
        } else if (tag === 'strong' || tag === 'b') {
          newOptions.font = helveticaBold;
        } else if (tag === 'em' || tag === 'i') {
          newOptions.font = helveticaOblique;
        } else if (tag === 'ul' || tag === 'ol') {
          isBlock = true;
          newOptions.listDepth = (newOptions.listDepth || 0) + 1;
        } else if (tag === 'li') {
          isBlock = true;
          isListBlock = true;
          newOptions.isList = true;
        } else if (tag === 'br') {
          advanceLine(newOptions.size, newOptions.isList);
        }

        // Before Block
        if (isBlock && !isNewLine) {
          advanceLine(newOptions.size, newOptions.isList);
        }
        
        // List Item Bullet
        if (isListBlock) {
          const indent = (newOptions.listDepth || 1) * 15;
          x = margin + indent - 15;
          page.drawText('•', { x, y, size: newOptions.size, font: newOptions.font, color: rgb(0,0,0) });
          x = margin + indent;
        }

        // Children
        for (let i = 0; i < node.childNodes.length; i++) {
          processNode(node.childNodes[i], newOptions);
        }

        // After Block
        if (isBlock && !isNewLine) {
          advanceLine(newOptions.size, false);
          // extra space for paragraphs/headings
          if (tag === 'p' || tag.startsWith('h')) {
             y -= newOptions.size * 0.5; 
             if (y < margin) addPage();
          }
        }
      }
    };
    
    // Start processing from root
    processNode(doc.documentElement as unknown as Node, { size: 12, font: helvetica, listDepth: 0 });
    
    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
    
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
        message: err instanceof Error ? err.message : 'An unexpected error occurred while converting the document.'
      }
    };
  }
}
