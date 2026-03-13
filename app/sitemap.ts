import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jung-euihyun.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: '2026-03-14',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
