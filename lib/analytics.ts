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
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, parameters);
  }
};
