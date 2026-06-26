import { MetadataRoute } from 'next';
import { services } from '@/lib/data/services';
import { blogPosts } from '@/lib/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://samstack.tech';

  // Core static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/services',
    '/internship',
    '/internship/submit',
    '/verify',
    '/blog',
    '/careers',
    '/privacy',
    '/terms'
  ];

  const staticRouteSitemaps = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'weekly' : 'monthly') as "weekly" | "monthly",
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Service Pages
  const serviceSitemaps = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Dynamic Blog Pages
  const blogSitemaps = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateISO),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  return [...staticRouteSitemaps, ...serviceSitemaps, ...blogSitemaps];
}
