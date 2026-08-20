import { MetadataRoute } from 'next';
import { tools } from '@/config/tools';

const LAST_MODIFIED_DATES: Record<string, string> = {
  '/': '2026-08-01T00:00:00.000Z',
  '/tools': '2026-08-01T00:00:00.000Z',
  '/tools/merge-pdf': '2026-08-20T00:00:00.000Z',
  '/tools/split-pdf': '2026-08-20T00:00:00.000Z',
  '/tools/compress-pdf': '2026-08-20T00:00:00.000Z',
  '/tools/jpg-to-pdf': '2026-08-20T00:00:00.000Z',
  '/tools/pdf-to-jpg': '2026-08-20T00:00:00.000Z',
  '/tools/remove-pages': '2026-08-20T00:00:00.000Z',
  '/tools/extract-pages': '2026-08-20T00:00:00.000Z',
  '/tools/rotate-pdf': '2026-08-20T00:00:00.000Z',
  '/tools/reorder-pdf': '2026-08-20T00:00:00.000Z',
  '/tools/watermark-pdf': '2026-08-20T00:00:00.000Z',
  '/about': '2026-08-20T00:00:00.000Z',
  '/contact': '2026-08-20T00:00:00.000Z',
  '/privacy-policy': '2026-08-20T00:00:00.000Z',
  '/terms': '2026-08-20T00:00:00.000Z',
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Ensure the base URL does not have a trailing slash
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pdf-toolboxx.vercel.app';
  const baseUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;

  const toolEntries = tools.map((tool) => ({
    url: `${baseUrl}${tool.url}`,
    lastModified: LAST_MODIFIED_DATES[tool.url] ? new Date(LAST_MODIFIED_DATES[tool.url]) : new Date('2026-08-01T00:00:00.000Z'),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(LAST_MODIFIED_DATES['/']!),
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(LAST_MODIFIED_DATES['/tools']!),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(LAST_MODIFIED_DATES['/about']!),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(LAST_MODIFIED_DATES['/contact']!),
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(LAST_MODIFIED_DATES['/privacy-policy']!),
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(LAST_MODIFIED_DATES['/terms']!),
    },
    ...toolEntries,
  ];
}
