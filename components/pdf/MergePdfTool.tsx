"use client";

import { useState } from "react";
import type { UploadedFile } from "@/types/upload";
import type { ProcessingError, ProcessingResult } from "@/types/pdf";
import { getToolBySlug } from "@/config/tools";
import { validateFiles } from "@/lib/validation/pdf";
import { mergePdfs } from "@/lib/pdf/merge";

import FileDropzone from "@/components/upload/FileDropzone";
import FileList from "@/components/upload/FileList";
import ProcessingIndicator from "@/components/ui/ProcessingIndicator";
import ErrorMessage from "@/components/ui/ErrorMessage";
import DownloadButton from "@/components/download/DownloadButton";

export default function MergePdfTool() {
  const toolConfig = getToolBySlug("merge-pdf");
  
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState<"idle" | "ready" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<ProcessingError | string | null>(null);
  const [result, setResult] = useState<ProcessingResult<Blob> | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    // Validate newly selected combined with existing files
    const allFiles = [...files.map(f => f.file), ...newFiles];
    
    const validationError = validateFiles(allFiles, {
      maxSizeMB: 50,
      maxFiles: 20,
      minFiles: 1, // Let them upload one at a time if they want
    });

    if (validationError && allFiles.length > 20) {
      setError(validationError);
      setStatus("error");
      return;
    }
    
    const newUploadedFiles = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size
    }));
    
    setFiles(prev => [...prev, ...newUploadedFiles].slice(0, 20));
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
    
    const validationError = validateFiles(filesToProcess, {
      minFiles: 2,
      maxFiles: 20,
      maxSizeMB: 50,
    });

    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setStatus("processing");
    setError(null);

    const processResult = await mergePdfs(filesToProcess);

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
    setStatus("ready");
    setError(null);
  };

  if (status === "processing") {
    return <ProcessingIndicator message="Merging your PDFs..." />;
  }

  if (status === "done" && result?.data) {
    return (
      <DownloadButton
        blob={result.data}
        filename="merged_document.pdf"
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
            accept={toolConfig?.acceptedInputs || ["application/pdf"]}
            multiple={true}
            maxSizeMB={50}
            maxFiles={20}
            onFilesSelected={handleFilesSelected}
            label={files.length > 0 ? "Add more files" : "Select PDF files to merge"}
          />

          <FileList
            files={files}
            onRemove={handleRemoveFile}
            onReorder={handleReorder}
          />

          {files.length > 0 && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleProcess}
                disabled={files.length < 2}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Merge PDFs
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
