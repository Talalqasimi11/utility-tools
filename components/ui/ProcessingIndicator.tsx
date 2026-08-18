interface ProcessingIndicatorProps {
  message?: string;
  /** Progress percentage (0–100). Omit for an indeterminate spinner. */
  progress?: number;
}

/**
 * Displays a spinner and optional progress bar while a tool is processing.
 * Pure presentational component — no client-side hooks required.
 */
export default function ProcessingIndicator({
  message = "Processing…",
  progress,
}: ProcessingIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-8" role="status" aria-live="polite">
      <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" aria-hidden="true" />
      <p className="text-sm text-muted">{message}</p>

      {progress !== undefined && (
        <div className="w-full max-w-xs">
          <div className="bg-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted text-center mt-1">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}
