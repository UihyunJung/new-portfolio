import type { MetadataRoute } from 'next';
import { SITE_URL } from '@lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: '2026-03-14',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
