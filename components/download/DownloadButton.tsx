"use client";

import { useCallback } from "react";
import { triggerDownload } from "@/lib/utils/download";

interface DownloadButtonProps {
  blob: Blob | null;
  filename: string;
  onReset?: () => void;
  /** Number of files in the output (shows "X files created" when > 1). */
  fileCount?: number;
}

/**
 * Result card shown after successful processing.
 * Displays a success message with download and "process another file" actions.
 * Handles blob download via triggerDownload utility.
 */
export default function DownloadButton({
  blob,
  filename,
  onReset,
  fileCount = 1,
}: DownloadButtonProps) {
  const handleDownload = useCallback(() => {
    if (!blob) return;
    triggerDownload(blob, filename);
  }, [blob, filename]);

  if (!blob) return null;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Success icon */}
      <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center">
        <svg
          className="w-6 h-6 text-success"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">Done!</h3>
        <p className="text-sm text-muted mt-1">
          {fileCount > 1
            ? `${fileCount} files created.`
            : "Your file is ready."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          {filename.endsWith(".zip") ? "Download ZIP" : "Download"}
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground hover:bg-primary-light transition-colors"
          >
            Process another file
          </button>
        )}
      </div>
    </div>
  );
}
