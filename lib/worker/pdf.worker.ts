import { mergePdfs } from '../pdf/merge';
import { splitPdf } from '../pdf/split';
import { compressPdf } from '../pdf/compress';
import { imagesToPdf } from '../pdf/images-to-pdf';
import { rotatePdf } from '../pdf/rotate';
import { watermarkPdf } from '../pdf/watermark';
import { pdfToWord } from '../pdf/pdf-to-word';
import { wordToPdf } from '../pdf/word-to-pdf';
import { pdfToExcel } from '../pdf/pdf-to-excel';
import { excelToPdf } from '../pdf/excel-to-pdf';
import { pdfToPowerpoint } from '../pdf/pdf-to-powerpoint';

self.onmessage = async (e: MessageEvent) => {
  const { id, action, args } = e.data;
  
  try {
    let result;
    switch (action) {
      case 'mergePdfs':
        result = await mergePdfs(args.files);
        break;
      case 'splitPdf':
        result = await splitPdf(args.file, args.options);
        break;
      case 'compressPdf':
        result = await compressPdf(args.file);
        break;
      case 'imagesToPdf':
        result = await imagesToPdf(args.files, args.options);
        break;
      case 'rotatePdf':
        result = await rotatePdf(args.file, args.options);
        break;
      case 'watermarkPdf':
        result = await watermarkPdf(args.file, args.options);
        break;
      case 'pdfToWord':
        result = await pdfToWord(args.file);
        break;
      case 'wordToPdf':
        result = await wordToPdf(args.file);
        break;
      case 'pdfToExcel':
        result = await pdfToExcel(args.file);
        break;
      case 'excelToPdf':
        result = await excelToPdf(args.file);
        break;
      case 'pdfToPowerpoint':
        result = await pdfToPowerpoint(args.file);
        break;
      default:
        throw new Error('Unknown action: ' + action);
    }
    self.postMessage({ id, result });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Worker error';
    self.postMessage({ id, error: errorMsg });
  }
};
