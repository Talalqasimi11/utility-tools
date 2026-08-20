"use client";

import { useState, useEffect } from 'react';
import FileDropzone from '@/components/upload/FileDropzone';
import PdfPageGrid from '@/components/pdf/PdfPageGrid';
import { runInWorker } from '@/lib/worker/client';
import type { UploadedFile } from '@/types/upload';
import type { ProcessingResult } from '@/types/pdf';
import { trackFileSelected, trackProcessingStarted, trackProcessingCompleted, trackProcessingFailed, trackDownloadClicked } from '@/lib/analytics';
import DownloadButton from '@/components/download/DownloadButton';
import ProcessingIndicator from '@/components/ui/ProcessingIndicator';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function RemovePagesTool() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [removedPages, setRemovedPages] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  useEffect(() => {
    trackFileSelected('remove_pages');
  }, []);

  const handleFileAccepted = (files: File[]) => {
    if (files.length > 0) {
      const f = files[0];
      setFile({ id: crypto.randomUUID(), file: f, name: f.name, size: f.size });
      setRemovedPages([]);
      setTotalPages(0);
      setResult(null);
      setError(null);
      trackFileSelected('remove_pages');
    }
  };

  const togglePage = (pageIndex: number) => {
    setRemovedPages(prev => 
      prev.includes(pageIndex) 
        ? prev.filter(p => p !== pageIndex) 
        : [...prev, pageIndex]
    );
  };

  const handleProcess = async () => {
    if (!file) return;

    if (removedPages.length === totalPages) {
      setError("You cannot remove every page from the document.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    trackProcessingStarted('remove_pages');

    const startTime = performance.now();

    try {
      const pagesToKeep = [];
      for (let i = 0; i < totalPages; i++) {
        if (!removedPages.includes(i)) {
          pagesToKeep.push(i + 1);
        }
      }
      const rangesStr = pagesToKeep.join(',');

      const response = await runInWorker<ProcessingResult<Blob>>('splitPdf', { 
        file: file.file,
        options: { mode: 'extract', rangesStr } 
      });

      if (response.success && response.data) {
        setResult(response.data);
        trackProcessingCompleted('remove_pages', performance.now() - startTime);
      } else {
        throw new Error(response.error?.message || 'Processing failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      trackProcessingFailed('remove_pages', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setRemovedPages([]);
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
        <div className="bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-medium text-foreground">{file.name}</h3>
              <p className="text-sm text-muted">
                Select the pages you want to remove. ({removedPages.length} selected)
              </p>
            </div>
            <button 
              onClick={reset}
              className="text-sm text-muted hover:text-error transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="mb-6 bg-muted/20 rounded-xl p-4 max-h-[60vh] overflow-y-auto border border-border/50">
            <PdfPageGrid 
              file={file}
              selectedPages={removedPages}
              onTogglePage={togglePage}
              onLoadComplete={setTotalPages}
            />
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage error={error} />
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleProcess}
              disabled={isProcessing || removedPages.length === 0}
              className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
            >
              Remove Pages
            </button>
          </div>
        </div>
      )}

      {isProcessing && <ProcessingIndicator message="Removing pages..." />}

      {result && (
        <DownloadButton 
          blob={result} 
          filename={`cleaned-${file?.name}`} 
          onReset={reset}
          onDownload={() => trackDownloadClicked('remove_pages')}
        />
      )}
    </div>
  );
}
