"use client";

import { useState } from "react";
import type { UploadedFile } from "@/types/upload";
import type { ProcessingError } from "@/types/pdf";
import { getToolBySlug } from "@/config/tools";
import { validateFiles } from "@/lib/validation/pdf";
import { imagesToPdf, type PageSizeOption, type OrientationOption } from "@/lib/pdf/images-to-pdf";

import FileDropzone from "@/components/upload/FileDropzone";
import FileList from "@/components/upload/FileList";
import ProcessingIndicator from "@/components/ui/ProcessingIndicator";
import ErrorMessage from "@/components/ui/ErrorMessage";
import DownloadButton from "@/components/download/DownloadButton";

export default function JpgToPdfTool() {
  const toolConfig = getToolBySlug("jpg-to-pdf");

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeOption>("a4");
  const [orientation, setOrientation] = useState<OrientationOption>("auto");

  const [status, setStatus] = useState<"idle" | "ready" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<ProcessingError | string | null>(null);
  
  const [result, setResult] = useState<{ data?: Blob; metadata?: { fileCount?: number } } | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    const allFiles = [...files.map(f => f.file), ...newFiles];

    const validationErr = validateFiles(allFiles, {
      maxSizeMB: 20, // Images usually shouldn't be larger than 20MB
      maxFiles: 50,
      minFiles: 1,
      allowedTypes: ["image/jpeg", "image/png"],
    });

    if (validationErr && allFiles.length > 50) {
      setError(validationErr);
      setStatus("error");
      return;
    }

    const newUploadedFiles = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size
    }));

    setFiles(prev => [...prev, ...newUploadedFiles].slice(0, 50));
    setStatus("ready");
    setError(null);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => {
      const next = prev.filter(f => f.id !== id);
      if (next.length === 0) setStatus("idle");
      return next;
    });
  };

  const handleReorder = (reorderedFiles: UploadedFile[]) => {
    setFiles(reorderedFiles);
  };

  const handleProcess = async () => {
    const filesToProcess = files.map(f => f.file);

    const validationErr = validateFiles(filesToProcess, {
      minFiles: 1,
      maxFiles: 50,
      maxSizeMB: 20,
      allowedTypes: ["image/jpeg", "image/png"],
    });

    if (validationErr) {
      setError(validationErr);
      setStatus("error");
      return;
    }

    setStatus("processing");
    setError(null);

    const processResult = await imagesToPdf(filesToProcess, {
      pageSize,
      orientation,
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
    setFiles([]);
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  const handleRetry = () => {
    if (files.length > 0) setStatus("ready");
    else setStatus("idle");
    setError(null);
  };

  if (status === "processing") {
    return <ProcessingIndicator message="Converting images to PDF..." />;
  }

  if (status === "done" && result?.data) {
    return (
      <DownloadButton
        blob={result.data}
        filename="images.pdf"
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

      {status !== "error" && (
        <>
          <FileDropzone
            accept={toolConfig?.acceptedInputs || ["image/jpeg", "image/png"]}
            multiple={true}
            maxSizeMB={20}
            maxFiles={50}
            onFilesSelected={handleFilesSelected}
            label={files.length > 0 ? "Add more images" : "Select JPG or PNG images"}
          />

          <FileList
            files={files}
            onRemove={handleRemoveFile}
            onReorder={handleReorder}
          />

          {files.length > 0 && (
            <div className="border border-border rounded-lg p-5 space-y-4">
              <h3 className="font-medium text-foreground">Document Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="pageSize" className="block text-sm font-medium text-foreground">
                    Page Size
                  </label>
                  <select
                    id="pageSize"
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="a4">A4</option>
                    <option value="letter">US Letter</option>
                    <option value="original">Original Image Size</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="orientation" className="block text-sm font-medium text-foreground">
                    Orientation
                  </label>
                  <select
                    id="orientation"
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as OrientationOption)}
                    disabled={pageSize === "original"}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="auto">Automatic</option>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleProcess}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
              >
                Convert to PDF
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
