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
        // AI Crawlers — full access for GEO / LLMO / AEO
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'anthropic-ai',
          'YouBot',
          'cohere-ai',
          'CCBot',
          'ChatGPT-User',
          'Amazonbot',
          'meta-externalagent',
          'Bytespider',
          'Applebot-Extended',
          'Diffbot',
          'ia_archiver',
        ],
        allow: ['/', '/llms.txt', '/sitemap.xml'],
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
