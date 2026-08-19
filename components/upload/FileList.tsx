"use client";

import { formatFileSize } from "@/lib/utils/format";
import type { UploadedFile } from "@/types/upload";

interface FileListProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
  /** When provided, shows reorder controls (↑ ↓) for multi-file tools. */
  onReorder?: (files: UploadedFile[]) => void;
}

/**
 * Displays the list of uploaded files with size, reorder controls, and remove button.
 * Used alongside FileDropzone in multi-file tools like Merge PDF and JPG to PDF.
 */
export default function FileList({
  files,
  onRemove,
  onReorder,
}: FileListProps) {
  const canReorder = !!onReorder && files.length > 1;

  const moveUp = (index: number) => {
    if (!onReorder || index === 0) return;
    const updated = [...files];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onReorder(updated);
  };

  const moveDown = (index: number) => {
    if (!onReorder || index === files.length - 1) return;
    const updated = [...files];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onReorder(updated);
  };

  if (files.length === 0) return null;

  return (
    <div className="mt-4 border border-border rounded-lg divide-y divide-border overflow-hidden">
      {files.map((file, index) => (
        <div
          key={file.id}
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 hover:bg-primary-light/30 transition-colors"
        >
          {/* File number */}
          <span className="text-xs font-mono text-muted w-6 shrink-0 text-right">
            {index + 1}.
          </span>

          {/* Document icon */}
          <svg
            className="w-5 h-5 text-muted shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
          </div>

          {/* Reorder controls */}
          {canReorder && (
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-1 rounded text-muted hover:text-foreground hover:bg-border/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label={`Move ${file.name} up`}
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
                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === files.length - 1}
                className="p-1 rounded text-muted hover:text-foreground hover:bg-border/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label={`Move ${file.name} down`}
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
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            className="p-1 rounded text-muted hover:text-error hover:bg-error-light transition-colors shrink-0"
            aria-label={`Remove ${file.name}`}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
