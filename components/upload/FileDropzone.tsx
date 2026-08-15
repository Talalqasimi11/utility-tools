"use client";

import { useCallback, useRef, useState } from "react";

interface FileDropzoneProps {
  /** MIME types to accept (e.g. ["application/pdf"]) */
  accept: string[];
  multiple?: boolean;
  maxSizeMB?: number;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

const MIME_TO_EXTENSIONS: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg,.jpeg",
  "image/png": ".png",
};

/**
 * Drag-and-drop file upload zone with click-to-browse fallback.
 * Performs basic client-side filtering by MIME type and file size.
 * Deeper validation (PDF structure, page count) is handled by lib/validation.
 */
export default function FileDropzone({
  accept,
  multiple = false,
  maxSizeMB = 50,
  maxFiles = 20,
  onFilesSelected,
  disabled = false,
  label,
  description,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptString = accept
    .map((mime) => MIME_TO_EXTENSIONS[mime] || mime)
    .join(",");

  const processSelectedFiles = useCallback(
    (fileList: File[]) => {
      const maxBytes = maxSizeMB * 1024 * 1024;
      const filtered = fileList.filter(
        (f) => accept.includes(f.type) && f.size <= maxBytes,
      );
      const limited = multiple
        ? filtered.slice(0, maxFiles)
        : filtered.slice(0, 1);
      if (limited.length > 0) {
        onFilesSelected(limited);
      }
    },
    [accept, maxSizeMB, maxFiles, multiple, onFilesSelected],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      processSelectedFiles(Array.from(e.dataTransfer.files));
    },
    [disabled, processSelectedFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processSelectedFiles(Array.from(e.target.files || []));
      // Reset so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    },
    [processSelectedFiles],
  );

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    [disabled],
  );

  // Build a human-readable description of accepted formats
  const extensionsList = accept
    .map((mime) => {
      const ext = MIME_TO_EXTENSIONS[mime];
      return ext
        ? ext.replace(/\./g, "").replace(",", ", ").toUpperCase()
        : mime;
    })
    .join(", ");

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label || "Upload files"}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={[
        "relative border-2 border-dashed rounded-xl p-10 sm:p-12",
        "flex flex-col items-center justify-center gap-4",
        "cursor-pointer transition-all duration-200",
        isDragging
          ? "border-primary bg-primary-light scale-[1.01]"
          : "border-border hover:border-primary/50 hover:bg-primary-light/30",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {/* Upload icon */}
      <svg
        className={`w-10 h-10 transition-colors ${isDragging ? "text-primary" : "text-muted"}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>

      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {label || "Drag & drop files here, or click to browse"}
        </p>
        <p className="text-xs text-muted mt-1">
          {description || `${extensionsList} files, up to ${maxSizeMB} MB`}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
