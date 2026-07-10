import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://samstack-tech.vercel.app';

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
        crawlDelay: 2,
      },
      {
        // AI Crawlers — full access for GEO
      userAgent: [
        'GPTBot',
        'PerplexityBot',
        'ClaudeBot',
        'Google-Extended',
        'anthropic-ai',
        'Omgilibot',
        'YouBot',
        'cohere-ai',
        'CCBot',
        'ChatGPT-User',
        'ia_archiver',
      ],
      allow: ['/'],
      disallow: ['/admin/', '/api/'],
    },
  ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
