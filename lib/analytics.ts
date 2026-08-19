declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
  }
}

export const pageview = (url: string, gaId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', gaId, {
      page_path: url,
    });
  }
};

export const trackEvent = (
  name: string,
  parameters?: Record<string, unknown>
) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, parameters);
    }
  } catch (e) {
    // Analytics failures must never break the UI
    console.error('Analytics error:', e);
  }
};

export const trackToolView = (tool: string) => trackEvent('tool_view', { tool });
export const trackFileSelected = (tool: string) => trackEvent('file_selected', { tool });
export const trackProcessingStarted = (tool: string) => trackEvent('processing_started', { tool });
export const trackProcessingCompleted = (tool: string, durationMs?: number) => {
  trackEvent('processing_completed', { 
    tool, 
    ...(durationMs !== undefined && { processing_duration_ms: durationMs })
  });
};
export const trackProcessingFailed = (tool: string, errorType?: string) => {
  trackEvent('processing_failed', { 
    tool,
    ...(errorType && { error_type: errorType })
  });
};
export const trackDownloadClicked = (tool: string) => trackEvent('download_clicked', { tool });
