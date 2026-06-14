import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://samstack.tech';

  // Core static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/services',
    '/services/web',
    '/services/mobile',
    '/services/enterprise',
    '/services/ui-ux',
    '/internship',
    '/internship/submit',
    '/verify',
    '/blog',
    '/careers',
    '/privacy',
    '/terms'
  ];

  return staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
