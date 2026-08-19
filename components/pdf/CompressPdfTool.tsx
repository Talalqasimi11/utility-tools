"use client";

import { useState, useEffect } from "react";
import type { UploadedFile } from "@/types/upload";
import type { ProcessingError, ProcessingResult } from "@/types/pdf";
import { getToolBySlug } from "@/config/tools";
import { validateFiles } from "@/lib/validation/pdf";
import { formatFileSize } from "@/lib/utils/format";
import { runInWorker } from "@/lib/worker/client";
import { trackToolView, trackFileSelected, trackProcessingStarted, trackProcessingCompleted, trackProcessingFailed, trackDownloadClicked } from "@/lib/analytics";
import type { CompressionLevel } from "@/lib/pdf/compress";
import { triggerDownload } from "@/lib/utils/download";

import FileDropzone from "@/components/upload/FileDropzone";
import ProcessingIndicator from "@/components/ui/ProcessingIndicator";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function CompressPdfTool() {
  useEffect(() => { trackToolView("compress-pdf"); }, []);
  const toolConfig = getToolBySlug("compress-pdf");

  const [file, setFile] = useState<UploadedFile | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  
  const [status, setStatus] = useState<"idle" | "ready" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<ProcessingError | string | null>(null);
  
  const [result, setResult] = useState<{
    blob: Blob;
    originalSize: number;
    outputSize: number;
    savedBytes: number;
    reductionPercent: string;
  } | null>(null);

  const handleFilesSelected = async (newFiles: File[]) => {
    const selectedFile = newFiles[0];

    const validationErr = await validateFiles([selectedFile], {
      maxSizeMB: 50,
      maxFiles: 1,
    });

    if (validationErr) {
      trackProcessingFailed("compress-pdf", validationErr?.code || "VALIDATION_ERROR");
      setError(validationErr);
      setStatus("error");
      return;
    }

    setFile({
      id: crypto.randomUUID(),
      file: selectedFile,
      name: selectedFile.name,
      size: selectedFile.size,
    });
    setStatus("ready");
    setError(null);
    trackFileSelected("compress-pdf");
  };

  const handleRemoveFile = () => {
    setFile(null);
    setStatus("idle");
  };

  const handleProcess = async () => {
    if (!file) return;

    trackProcessingStarted("compress-pdf");
    setStatus("processing");
    setError(null);
    const _startTime = performance.now();

    const processResult = await runInWorker<ProcessingResult<Blob>>('compressPdf', { file: file.file });

    if (
      processResult.success && 
      processResult.data && 
      processResult.metadata &&
      processResult.metadata.originalSize !== undefined &&
      processResult.metadata.outputSize !== undefined
    ) {
      const { originalSize, outputSize } = processResult.metadata;
      
      // Spec Requirement: Do not falsely claim successful compression
      if (outputSize >= originalSize) {
        setError("This PDF could not be reduced further.");
        setStatus("error");
        return;
      }

      const savedBytes = originalSize - outputSize;
      const reductionPercent = ((savedBytes / originalSize) * 100).toFixed(1);

      trackProcessingCompleted("compress-pdf", Math.round(performance.now() - _startTime));
      setResult({
        blob: processResult.data,
        originalSize,
        outputSize,
        savedBytes,
        reductionPercent,
      });
      setStatus("done");
    } else {
      trackProcessingFailed("compress-pdf", processResult.error?.code || "UNKNOWN");
      setError(processResult.error || "An unknown error occurred.");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    trackDownloadClicked("compress-pdf");
    if (result && file) {
      // Add '-compressed' before the extension
      const filename = file.name.replace(/\.pdf$/i, "-compressed.pdf");
      triggerDownload(result.blob, filename);
    }
  };

  const handleReset = () => {
    setFile(null);
    setLevel("medium");
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  const handleRetry = () => {
    if (file) setStatus("ready");
    else setStatus("idle");
    setError(null);
  };

  if (status === "processing") {
    return <ProcessingIndicator message="Compressing your PDF..." />;
  }

  if (status === "done" && result && file) {
    return (
      <div className="bg-background border border-border rounded-xl p-8 text-center max-w-md mx-auto shadow-sm">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-2">Done!</h3>
        <p className="text-muted mb-6">Your file is ready.</p>

        <div className="bg-muted/30 rounded-lg p-4 mb-6 text-sm grid grid-cols-2 gap-2 text-left">
          <div className="text-muted">Original size:</div>
          <div className="font-medium text-foreground text-right">{formatFileSize(result.originalSize)}</div>
          
          <div className="text-muted">New size:</div>
          <div className="font-medium text-success text-right">{formatFileSize(result.outputSize)}</div>
          
          <div className="text-muted">Saved:</div>
          <div className="font-medium text-foreground text-right">{formatFileSize(result.savedBytes)}</div>
          
          <div className="text-muted">Reduction:</div>
          <div className="font-medium text-success text-right">{result.reductionPercent}%</div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button
            onClick={handleReset}
            className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
          >
            Process another file
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {status === "error" && error && (
        <ErrorMessage error={error} onRetry={handleRetry} />
      )}

      {status !== "error" && !file && (
        <FileDropzone
          accept={toolConfig?.acceptedInputs || ["application/pdf"]}
          multiple={false}
          maxSizeMB={50}
          maxFiles={1}
          onFilesSelected={handleFilesSelected}
          label="Select PDF file to compress"
        />
      )}

      {status !== "error" && file && (
        <>
          <div className="bg-background border border-border p-4 rounded-lg flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-sm text-muted">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-muted hover:text-error transition-colors p-2"
              title="Remove file"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-medium text-foreground">Compression level:</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="compressionLevel"
                  value="low"
                  checked={level === "low"}
                  onChange={() => setLevel("low")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Low (Less compression, high quality)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="compressionLevel"
                  value="medium"
                  checked={level === "medium"}
                  onChange={() => setLevel("medium")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Medium (Good balance)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="compressionLevel"
                  value="high"
                  checked={level === "high"}
                  onChange={() => setLevel("high")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">High (Max compression, lower quality)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleProcess}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              Compress PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
