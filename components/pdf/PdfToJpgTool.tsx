"use client";

import { useState } from "react";
import type { UploadedFile } from "@/types/upload";
import type { ProcessingError } from "@/types/pdf";
import { getToolBySlug } from "@/config/tools";
import { validateFiles } from "@/lib/validation/pdf";
import { formatFileSize } from "@/lib/utils/format";
import { convertPdfToJpg, type ImageQuality } from "@/lib/pdf/pdf-to-jpg";
import { parseRanges } from "@/lib/pdf/split";

import FileDropzone from "@/components/upload/FileDropzone";
import ProcessingIndicator from "@/components/ui/ProcessingIndicator";
import ErrorMessage from "@/components/ui/ErrorMessage";
import DownloadButton from "@/components/download/DownloadButton";

export default function PdfToJpgTool() {
  const toolConfig = getToolBySlug("pdf-to-jpg");

  const [file, setFile] = useState<UploadedFile | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  
  const [mode, setMode] = useState<"all" | "selected">("all");
  const [ranges, setRanges] = useState("");
  const [quality, setQuality] = useState<ImageQuality>("medium");

  const [status, setStatus] = useState<"idle" | "ready" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<ProcessingError | string | null>(null);
  const [result, setResult] = useState<{ data?: Blob; metadata?: { fileCount?: number } } | null>(null);

  const handleFilesSelected = async (newFiles: File[]) => {
    const selectedFile = newFiles[0];

    const validationErr = validateFiles([selectedFile], {
      maxSizeMB: 50,
      maxFiles: 1,
    });

    if (validationErr) {
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
    
    setStatus("processing"); // Show spinner while extracting page count

    try {
      // @ts-expect-error
      const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
      setStatus("ready");
    } catch {
      // If we can't load it for preview, just proceed and let the actual processing step fail safely
      setPageCount(null);
      setStatus("ready");
    }
    
    setError(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPageCount(null);
    setRanges("");
    setStatus("idle");
  };

  const handleProcess = async () => {
    if (!file) return;

    if (mode === "selected") {
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

    const processResult = await convertPdfToJpg(file.file, {
      mode,
      rangesStr: ranges,
      quality,
    });

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
    setMode("all");
    setQuality("medium");
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
    return <ProcessingIndicator message="Converting PDF to Image... This may take a moment for large files." />;
  }

  if (status === "done" && result?.data) {
    // Determine output filename
    let filename = "pdf-pages.zip";
    if (mode === "selected") {
       // if we can tell it's a single file based on the mime type, or fileCount metadata
       if (result.metadata?.fileCount === 1) {
         filename = "page.jpg";
       }
    } else if (pageCount === 1) {
       filename = "page.jpg";
    }

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
          label="Select PDF file to convert"
        />
      )}

      {status !== "error" && file && (
        <>
          <div className="bg-background border border-border p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground truncate max-w-sm" title={file.name}>
                {file.name}
              </p>
              <p className="text-sm text-muted">
                {formatFileSize(file.size)} {pageCount ? `• ${pageCount} pages` : ''}
              </p>
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

          <div className="border border-border rounded-lg p-5 space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-3">Pages to convert:</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pageMode"
                    value="all"
                    checked={mode === "all"}
                    onChange={() => setMode("all")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">All pages</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pageMode"
                    value="selected"
                    checked={mode === "selected"}
                    onChange={() => setMode("selected")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Select pages or range</span>
                </label>
              </div>

              {mode === "selected" && (
                <div className="mt-3 pl-7">
                  <input
                    type="text"
                    placeholder="e.g. 1-3, 5, 7-10"
                    value={ranges}
                    onChange={(e) => setRanges(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-background text-foreground"
                  />
                  <p className="text-xs text-muted mt-1">
                    Use commas to separate pages or ranges.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="font-medium text-foreground mb-3">Image Quality:</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="quality"
                    value="low"
                    checked={quality === "low"}
                    onChange={() => setQuality("low")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Low (Smaller file)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="quality"
                    value="medium"
                    checked={quality === "medium"}
                    onChange={() => setQuality("medium")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Medium (Good balance)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="quality"
                    value="high"
                    checked={quality === "high"}
                    onChange={() => setQuality("high")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">High (Best visual quality)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleProcess}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              Convert to Image
            </button>
          </div>
        </>
      )}
    </div>
  );
}
