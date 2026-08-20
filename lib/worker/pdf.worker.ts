import { mergePdfs } from '../pdf/merge';
import { splitPdf } from '../pdf/split';
import { compressPdf } from '../pdf/compress';
import { imagesToPdf } from '../pdf/images-to-pdf';
import { rotatePdf } from '../pdf/rotate';
import { watermarkPdf } from '../pdf/watermark';

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
      default:
        throw new Error('Unknown action: ' + action);
    }
    self.postMessage({ id, result });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Worker error';
    self.postMessage({ id, error: errorMsg });
  }
};
