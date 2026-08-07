import { source } from '@/lib/source';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: 'https://oprogress.oimmi.com',
      lastModified: new Date().toISOString(),
    },
    ...source.getPages().map((page) => ({
      url: `https://oprogress.oimmi.com${page.url}`,
      lastModified: new Date().toISOString(),
    })),
  ];
}
