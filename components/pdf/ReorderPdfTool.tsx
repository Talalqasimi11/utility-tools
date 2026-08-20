"use client";

import { useState, useEffect, useCallback } from 'react';
import FileDropzone from '@/components/upload/FileDropzone';
import PdfPageGrid from '@/components/pdf/PdfPageGrid';
import { runInWorker } from '@/lib/worker/client';
import type { UploadedFile } from '@/types/upload';
import type { ProcessingResult } from '@/types/pdf';
import { trackFileSelected, trackProcessingStarted, trackProcessingCompleted, trackProcessingFailed, trackDownloadClicked, trackEvent } from '@/lib/analytics';
import DownloadButton from '@/components/download/DownloadButton';
import ProcessingIndicator from '@/components/ui/ProcessingIndicator';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function ReorderPdfTool() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  useEffect(() => {
    trackFileSelected('reorder_pdf');
  }, []);

  const handleFileAccepted = (files: File[]) => {
    if (files.length > 0) {
      const f = files[0];
      setFile({ id: crypto.randomUUID(), file: f, name: f.name, size: f.size });
      setPageOrder([]);
      setTotalPages(0);
      setResult(null);
      setError(null);
      trackFileSelected('reorder_pdf');
    }
  };

  const handleLoadComplete = useCallback((total: number) => {
    setTotalPages(total);
    // Initialize sequential order
    setPageOrder(Array.from({ length: total }, (_, i) => i));
  }, []);

  const handleReorder = (newOrder: number[]) => {
    setPageOrder(newOrder);
    trackEvent('page_reordered', { tool: 'reorder_pdf', pages_count: newOrder.length });
  };

  const resetOrder = () => {
    setPageOrder(Array.from({ length: totalPages }, (_, i) => i));
  };

  const isOrderChanged = () => {
    return pageOrder.some((val, i) => val !== i);
  };

  const handleProcess = async () => {
    if (!file) return;

    if (!isOrderChanged()) {
      setError("The page order has not been changed.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    trackProcessingStarted('reorder_pdf');

    const startTime = performance.now();

    try {
      // Map to 1-indexed for the worker
      const pagesToKeep = pageOrder.map(p => p + 1);
      const rangesStr = pagesToKeep.join(',');

      // We reuse the existing splitPdf logic in extract mode
      const response = await runInWorker<ProcessingResult<Blob>>('splitPdf', { 
        file: file.file,
        options: { mode: 'extract', rangesStr } 
      });

      if (response.success && response.data) {
        setResult(response.data);
        trackProcessingCompleted('reorder_pdf', performance.now() - startTime);
      } else {
        throw new Error(response.error?.message || 'Processing failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      trackProcessingFailed('reorder_pdf', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setPageOrder([]);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {!file && !result && (
        <FileDropzone 
          accept={['application/pdf']}
          multiple={false}
          maxSizeMB={50}
          maxFiles={1}
          onFilesSelected={handleFileAccepted}
        />
      )}

      {file && !result && !isProcessing && (
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-border/50 pb-6">
            <div>
              <h3 className="font-medium text-foreground">{file.name}</h3>
              <p className="text-sm text-muted">
                Drag and drop pages to reorder them.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={resetOrder}
                disabled={!isOrderChanged()}
                className="text-sm px-3 py-1.5 rounded bg-muted/20 hover:bg-muted/30 text-foreground transition-colors disabled:opacity-50"
              >
                Reset Order
              </button>
              <button 
                onClick={reset}
                className="text-sm px-3 py-1.5 rounded bg-error/10 hover:bg-error/20 text-error transition-colors ml-2"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="mb-6 bg-muted/10 rounded-xl p-4 max-h-[60vh] overflow-y-auto border border-border/50">
            <PdfPageGrid 
              file={file}
              pageOrder={pageOrder.length > 0 ? pageOrder : undefined}
              onReorder={handleReorder}
              onLoadComplete={handleLoadComplete}
              selectionMode="reorder"
            />
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage error={error} />
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-border/50">
            <button
              onClick={handleProcess}
              disabled={isProcessing || !isOrderChanged()}
              className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
            >
              Download Reordered PDF
            </button>
          </div>
        </div>
      )}

      {isProcessing && <ProcessingIndicator message="Reordering pages..." />}

      {result && (
        <DownloadButton 
          blob={result} 
          filename={`reordered-${file?.name}`} 
          onReset={reset}
          onDownload={() => trackDownloadClicked('reorder_pdf')}
        />
      )}
    </div>
  );
}
