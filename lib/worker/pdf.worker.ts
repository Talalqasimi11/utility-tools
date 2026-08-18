import { mergePdfs } from '../pdf/merge';
import { splitPdf } from '../pdf/split';
import { compressPdf } from '../pdf/compress';
import { imagesToPdf } from '../pdf/images-to-pdf';

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
      default:
        throw new Error('Unknown action: ' + action);
    }
    self.postMessage({ id, result });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Worker error';
    self.postMessage({ id, error: errorMsg });
  }
};
