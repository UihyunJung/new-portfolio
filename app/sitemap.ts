import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jung-euihyun.vercel.app';

  return [
    {
      url: `${baseUrl}/ko`,
      lastModified: '2026-03-13',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: '2026-03-13',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
