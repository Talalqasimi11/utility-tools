"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import type { UploadedFile } from "@/types/upload";
import type { ProcessingError } from "@/types/pdf";
import { getToolBySlug } from "@/config/tools";
import { validateFiles } from "@/lib/validation/pdf";
import { runInWorker } from "@/lib/worker/client";
import { parseRanges, type SplitMode } from "@/lib/pdf/split";

import FileDropzone from "@/components/upload/FileDropzone";
import ProcessingIndicator from "@/components/ui/ProcessingIndicator";
import ErrorMessage from "@/components/ui/ErrorMessage";
import DownloadButton from "@/components/download/DownloadButton";

export default function SplitPdfTool() {
  const toolConfig = getToolBySlug("split-pdf");

  const [file, setFile] = useState<UploadedFile | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<ProcessingError | string | null>(null);
  const [result, setResult] = useState<{ data?: Blob; metadata?: { fileCount?: number } } | null>(null);

  const [mode, setMode] = useState<SplitMode>("extract");
  const [ranges, setRanges] = useState("");

  const handleFilesSelected = async (newFiles: File[]) => {
    const selectedFile = newFiles[0];

    const validationErr = await validateFiles([selectedFile], {
      maxSizeMB: 50,
      maxFiles: 1,
    });

    if (validationErr) {
      setError(validationErr);
      setStatus("error");
      return;
    }

    const newUploadedFile = {
      id: crypto.randomUUID(),
      file: selectedFile,
      name: selectedFile.name,
      size: selectedFile.size,
    };

    setFile(newUploadedFile);
    setStatus("processing"); // Show spinner while extracting page count
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true }); // We just need page count, don't crash if encrypted yet
      setPageCount(pdfDoc.getPageCount());
      setStatus("ready");
    } catch {
      // If we can't load it, let the processing step handle it later, just guess 1 page
      setPageCount(null);
      setStatus("ready");
    }
    setError(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPageCount(null);
    setStatus("idle");
    setRanges("");
  };

  const handleProcess = async () => {
    if (!file) return;

    if (mode !== "split-all") {
      if (!ranges.trim()) {
        setError("Please enter page ranges (e.g., 1-5, 8).");
        setStatus("error");
        return;
      }
      if (pageCount !== null) {
        const parsed = parseRanges(ranges, pageCount);
        if (!parsed) {
          setError(`Invalid page range syntax. Pages must be between 1 and ${pageCount}.`);
          setStatus("error");
          return;
        }
      }
    }

    setStatus("processing");
    setError(null);

    const processResult = await runInWorker<ProcessingResult<Blob>>('splitPdf', { file: file.file, options: { mode, rangesStr: ranges } });

    if (processResult.success && processResult.data) {
      setResult(processResult);
      setStatus("done");
    } else {
      setError(processResult.error || "An unknown error occurred.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(null);
    setRanges("");
    setMode("extract");
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  const handleRetry = () => {
    if (file) setStatus("ready");
    else setStatus("idle");
    setError(null);
  };

  if (status === "processing" && !file) {
    return <ProcessingIndicator message="Loading PDF..." />;
  }
  
  if (status === "processing" && file) {
    return <ProcessingIndicator message="Splitting your PDF..." />;
  }

  if (status === "done" && result?.data) {
    const isZip = mode !== "extract";
    const filename = isZip ? "split-pages.zip" : "extracted-pages.pdf";
    return (
      <DownloadButton
        blob={result.data}
        filename={filename}
        onReset={handleReset}
        fileCount={result.metadata?.fileCount}
      />
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
          label="Select PDF file to split"
        />
      )}

      {status !== "error" && file && (
        <>
          <div className="bg-background border border-border p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground truncate max-w-sm" title={file.name}>
                {file.name}
              </p>
              {pageCount && (
                <p className="text-sm text-muted">{pageCount} pages</p>
              )}
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
            <h3 className="font-medium text-foreground">Split mode:</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  value="extract"
                  checked={mode === "extract"}
                  onChange={() => setMode("extract")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Extract pages (one PDF)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  value="split-ranges"
                  checked={mode === "split-ranges"}
                  onChange={() => setMode("split-ranges")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Split by ranges (multiple PDFs in ZIP)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  value="split-all"
                  checked={mode === "split-all"}
                  onChange={() => setMode("split-all")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Split every page (multiple PDFs in ZIP)</span>
              </label>
            </div>

            {mode !== "split-all" && (
              <div className="pt-4 border-t border-border space-y-2 mt-4">
                <label htmlFor="ranges" className="block text-sm font-medium text-foreground">
                  Page Selection:
                </label>
                <input
                  id="ranges"
                  type="text"
                  placeholder="e.g. 1-3, 5, 7-10"
                  value={ranges}
                  onChange={(e) => setRanges(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-background text-foreground"
                />
                <p className="text-xs text-muted">
                  Use commas to separate pages or ranges.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleProcess}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              {mode === "extract" ? "Extract Pages" : "Split PDF"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
