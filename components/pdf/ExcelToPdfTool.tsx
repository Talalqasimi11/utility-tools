"use client";

import { useState } from 'react';
import FileDropzone from '@/components/upload/FileDropzone';
import { runInWorker } from '@/lib/worker/client';
import type { UploadedFile } from '@/types/upload';
import type { ProcessingResult } from '@/types/pdf';
import { 
  trackFileSelected, 
  trackProcessingStarted, 
  trackProcessingCompleted, 
  trackProcessingFailed, 
  trackDownloadClicked 
} from '@/lib/analytics';
import DownloadButton from '@/components/download/DownloadButton';
import ProcessingIndicator from '@/components/ui/ProcessingIndicator';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function ExcelToPdfTool() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  const handleFileAccepted = (files: File[]) => {
    if (files.length > 0) {
      const f = files[0];
      setFile({ id: crypto.randomUUID(), file: f, name: f.name, size: f.size });
      setResult(null);
      setError(null);
      trackFileSelected('excel_to_pdf');
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    trackProcessingStarted('excel_to_pdf');

    const startTime = performance.now();

    try {
      const response = await runInWorker<ProcessingResult<Blob>>('excelToPdf', { 
        file: file.file 
      });

      if (response.success && response.data) {
        setResult(response.data);
        trackProcessingCompleted('excel_to_pdf', performance.now() - startTime);
      } else {
        throw new Error(response.error?.message || 'Processing failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      trackProcessingFailed('excel_to_pdf', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getOutputFilename = (originalName: string) => {
    return originalName.replace(/\.[^/.]+$/, "") + ".pdf";
  };

  return (
    <div className="space-y-8">
      {!file && !result && (
        <FileDropzone 
          accept={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.xlsx', 'application/vnd.ms-excel', '.xls']}
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
              <h3 className="font-medium text-foreground text-lg mb-2">Ready to convert</h3>
              <div className="bg-muted/10 border border-border rounded-lg p-4 inline-flex flex-col gap-1 min-w-[250px]">
                <p className="text-sm font-medium text-foreground truncate max-w-[300px]" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center text-xs text-muted gap-3">
                  <span>{formatFileSize(file.size)}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={reset}
              className="text-sm px-3 py-1.5 rounded bg-error/10 hover:bg-error/20 text-error transition-colors"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage error={error} />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
            >
              Convert to PDF
            </button>
          </div>
        </div>
      )}

      {isProcessing && <ProcessingIndicator message="Parsing workbook and rendering PDF..." />}

      {result && file && (
        <DownloadButton 
          blob={result} 
          filename={getOutputFilename(file.name)} 
          onReset={reset}
          onDownload={() => trackDownloadClicked('excel_to_pdf')}
        />
      )}
    </div>
  );
}
