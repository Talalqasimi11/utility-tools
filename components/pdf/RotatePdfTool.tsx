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

export default function RotatePdfTool() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [totalPages, setTotalPages] = useState(0);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  useEffect(() => {
    trackFileSelected('rotate_pdf');
  }, []);

  const handleFileAccepted = (files: File[]) => {
    if (files.length > 0) {
      const f = files[0];
      setFile({ id: crypto.randomUUID(), file: f, name: f.name, size: f.size });
      setSelectedPages([]);
      setRotations({});
      setTotalPages(0);
      setResult(null);
      setError(null);
      trackFileSelected('rotate_pdf');
    }
  };

  const togglePageSelection = (pageIndex: number) => {
    setSelectedPages(prev => 
      prev.includes(pageIndex) 
        ? prev.filter(p => p !== pageIndex) 
        : [...prev, pageIndex]
    );
  };

  const rotatePage = (pageIndex: number, direction: 1 | -1) => {
    setRotations(prev => {
      const current = prev[pageIndex] || 0;
      let newRot = (current + direction * 90) % 360;
      if (newRot < 0) newRot += 360;
      return { ...prev, [pageIndex]: newRot };
    });
  };

  const rotateSelected = (direction: 1 | -1) => {
    if (selectedPages.length === 0) return;
    setRotations(prev => {
      const next = { ...prev };
      for (const idx of selectedPages) {
        const current = next[idx] || 0;
        let newRot = (current + direction * 90) % 360;
        if (newRot < 0) newRot += 360;
        next[idx] = newRot;
      }
      return next;
    });
  };

  const rotateAll = (direction: 1 | -1) => {
    setRotations(prev => {
      const next = { ...prev };
      for (let i = 0; i < totalPages; i++) {
        const current = next[i] || 0;
        let newRot = (current + direction * 90) % 360;
        if (newRot < 0) newRot += 360;
        next[i] = newRot;
      }
      return next;
    });
  };

  const resetRotations = () => {
    setRotations({});
  };

  const hasAnyRotations = Object.values(rotations).some(r => r !== 0);

  const handleProcess = async () => {
    if (!file) return;

    if (!hasAnyRotations) {
      setError("No pages have been rotated.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    trackProcessingStarted('rotate_pdf');

    const startTime = performance.now();

    try {
      const response = await runInWorker<ProcessingResult<Blob>>('rotatePdf', { 
        file: file.file,
        options: { rotations } 
      });

      if (response.success && response.data) {
        setResult(response.data);
        trackProcessingCompleted('rotate_pdf', performance.now() - startTime);
      } else {
        throw new Error(response.error?.message || 'Processing failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      trackProcessingFailed('rotate_pdf', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setSelectedPages([]);
    setRotations({});
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4 border-b border-border/50 pb-6">
            <div>
              <h3 className="font-medium text-foreground">{file.name}</h3>
              <p className="text-sm text-muted">
                {selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'} selected
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-muted/20 rounded border border-border/50 p-1">
                <button
                  onClick={() => rotateSelected(-1)}
                  disabled={selectedPages.length === 0}
                  className="text-xs px-2 py-1.5 rounded hover:bg-background text-foreground transition-colors disabled:opacity-50 flex items-center gap-1"
                  title="Rotate Selected Left"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Selected L
                </button>
                <button
                  onClick={() => rotateSelected(1)}
                  disabled={selectedPages.length === 0}
                  className="text-xs px-2 py-1.5 rounded hover:bg-background text-foreground transition-colors disabled:opacity-50 flex items-center gap-1"
                  title="Rotate Selected Right"
                >
                  Selected R
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center bg-muted/20 rounded border border-border/50 p-1">
                <button
                  onClick={() => rotateAll(-1)}
                  className="text-xs px-2 py-1.5 rounded hover:bg-background text-foreground transition-colors flex items-center gap-1"
                  title="Rotate All Left"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  All L
                </button>
                <button
                  onClick={() => rotateAll(1)}
                  className="text-xs px-2 py-1.5 rounded hover:bg-background text-foreground transition-colors flex items-center gap-1"
                  title="Rotate All Right"
                >
                  All R
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                  </svg>
                </button>
              </div>

              <button
                onClick={resetRotations}
                disabled={!hasAnyRotations}
                className="text-xs px-3 py-1.5 rounded bg-muted/20 hover:bg-muted/30 text-foreground transition-colors disabled:opacity-50 border border-border/50"
              >
                Reset
              </button>

              <button 
                onClick={reset}
                className="text-xs px-3 py-1.5 rounded bg-error/10 hover:bg-error/20 text-error transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="mb-6 bg-muted/10 rounded-xl p-4 max-h-[60vh] overflow-y-auto border border-border/50">
            <PdfPageGrid 
              file={file}
              selectedPages={selectedPages}
              onTogglePage={togglePageSelection}
              onLoadComplete={setTotalPages}
              selectionMode="rotate"
              rotations={rotations}
              onRotatePage={rotatePage}
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
              disabled={isProcessing || !hasAnyRotations}
              className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
            >
              Download Rotated PDF
            </button>
          </div>
        </div>
      )}

      {isProcessing && <ProcessingIndicator message="Rotating pages..." />}

      {result && (
        <DownloadButton 
          blob={result} 
          filename={`rotated-${file?.name}`} 
          onReset={reset}
          onDownload={() => trackDownloadClicked('rotate_pdf')}
        />
      )}
    </div>
  );
}
