"use client";

import type { ProcessingError } from "@/types/pdf";

interface ErrorMessageProps {
  error: ProcessingError | string;
  onRetry?: () => void;
}

/**
 * User-friendly error display with optional retry button.
 * Maps internal ProcessingErrors to safe messages — never exposes stack traces.
 */
export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const message = typeof error === "string" ? error : error.message;

  return (
    <div className="rounded-lg border border-error/20 bg-error-light p-6 text-center">
      {/* Error icon */}
      <div className="flex justify-center mb-3">
        <svg
          className="w-8 h-8 text-error"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-1">
        Something went wrong
      </h3>
      <p className="text-sm text-muted">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-primary-light transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
