"use client";

import { useState, useEffect } from 'react';
import FileDropzone from '@/components/upload/FileDropzone';
import PdfPageGrid from '@/components/pdf/PdfPageGrid';
import { runInWorker } from '@/lib/worker/client';
import type { UploadedFile } from '@/types/upload';
import type { ProcessingResult } from '@/types/pdf';
import { trackFileSelected, trackProcessingStarted, trackProcessingCompleted, trackProcessingFailed, trackDownloadClicked, trackEvent } from '@/lib/analytics';
import DownloadButton from '@/components/download/DownloadButton';
import ProcessingIndicator from '@/components/ui/ProcessingIndicator';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function WatermarkPdfTool() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  
  // Watermark Options
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.5);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState<'top-left' | 'top-center' | 'center' | 'bottom-center' | 'bottom-right'>('center');
  const [scope, setScope] = useState<'all' | 'selected'>('all');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  useEffect(() => {
    trackFileSelected('watermark_pdf');
  }, []);

  const handleFileAccepted = (files: File[]) => {
    if (files.length > 0) {
      const f = files[0];
      setFile({ id: crypto.randomUUID(), file: f, name: f.name, size: f.size });
      setTotalPages(0);
      setSelectedPages([]);
      setResult(null);
      setError(null);
      trackFileSelected('watermark_pdf');
    }
  };

  const handleLoadComplete = (total: number) => {
    setTotalPages(total);
    setSelectedPages(Array.from({ length: total }, (_, i) => i)); // select all by default
  };

  const togglePage = (pageIndex: number) => {
    if (scope === 'all') {
      setScope('selected');
      setSelectedPages([pageIndex]);
    } else {
      setSelectedPages(prev => 
        prev.includes(pageIndex) 
          ? prev.filter(p => p !== pageIndex) 
          : [...prev, pageIndex]
      );
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    if (!text.trim()) {
      setError("Please enter watermark text.");
      return;
    }

    if (scope === 'selected' && selectedPages.length === 0) {
      setError("Please select at least one page to watermark.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    trackProcessingStarted('watermark_pdf');

    const startTime = performance.now();

    try {
      const options = {
        text,
        fontSize,
        opacity,
        rotation,
        position,
        scope,
        selectedPages
      };

      const response = await runInWorker<ProcessingResult<Blob>>('watermarkPdf', { 
        file: file.file,
        options 
      });

      if (response.success && response.data) {
        setResult(response.data);
        trackEvent('watermark_applied', { tool: 'watermark_pdf', watermark_type: 'text', apply_scope: scope });
        trackProcessingCompleted('watermark_pdf', performance.now() - startTime);
      } else {
        throw new Error(response.error?.message || 'Processing failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      trackProcessingFailed('watermark_pdf', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setSelectedPages([]);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-4 bg-background border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-1 text-lg">Settings</h3>
              <p className="text-xs text-muted mb-4 truncate">{file.name}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Watermark Text</label>
                <input 
                  type="text" 
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="CONFIDENTIAL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Font Size: {fontSize}px</label>
                <input 
                  type="range" 
                  min="12" max="144" 
                  value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Opacity: {Math.round(opacity * 100)}%</label>
                <input 
                  type="range" 
                  min="0.1" max="1" step="0.1"
                  value={opacity}
                  onChange={e => setOpacity(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rotation: {rotation}°</label>
                <input 
                  type="range" 
                  min="0" max="360" step="15"
                  value={rotation}
                  onChange={e => setRotation(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <select 
                  value={position}
                  onChange={e => setPosition(e.target.value as any)}
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="center">Center</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Apply To</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setScope('all');
                      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i));
                    }}
                    className={`flex-1 py-1.5 text-sm rounded border ${scope === 'all' ? 'bg-primary text-white border-primary' : 'bg-transparent border-border text-foreground hover:bg-muted/10'}`}
                  >
                    All Pages
                  </button>
                  <button 
                    onClick={() => setScope('selected')}
                    className={`flex-1 py-1.5 text-sm rounded border ${scope === 'selected' ? 'bg-primary text-white border-primary' : 'bg-transparent border-border text-foreground hover:bg-muted/10'}`}
                  >
                    Selected
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <button
                onClick={handleProcess}
                disabled={isProcessing || !text.trim() || (scope === 'selected' && selectedPages.length === 0)}
                className="w-full rounded bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Watermark
              </button>
              <button
                onClick={reset}
                className="w-full mt-2 rounded px-4 py-2 text-sm font-medium text-muted hover:text-error transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-8 bg-muted/10 border border-border rounded-xl p-6 shadow-sm overflow-hidden flex flex-col h-full">
            <h3 className="font-medium text-foreground mb-4">Preview</h3>
            <div className="flex-1 overflow-y-auto pr-2">
              <PdfPageGrid 
                file={file}
                selectedPages={scope === 'all' ? [] : selectedPages}
                onTogglePage={togglePage}
                onLoadComplete={handleLoadComplete}
                selectionMode="watermark"
                watermarkPreview={{
                  text,
                  fontSize,
                  opacity,
                  rotation,
                  position
                }}
              />
            </div>
            {error && (
              <div className="mt-4">
                <ErrorMessage error={error} />
              </div>
            )}
          </div>
        </div>
      )}

      {isProcessing && <ProcessingIndicator message="Applying watermark..." />}

      {result && (
        <DownloadButton 
          blob={result} 
          filename={`watermarked-${file?.name}`} 
          onReset={reset}
          onDownload={() => trackDownloadClicked('watermark_pdf')}
        />
      )}
    </div>
  );
}
