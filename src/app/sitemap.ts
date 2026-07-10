import { MetadataRoute } from 'next';
import { services } from '@/lib/data/services';
import { blogPosts } from '@/lib/data/blog-posts';
import { teamData } from '@/lib/data/team';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://samstack-tech.vercel.app';

  // ── Tier 1: Homepage (1.0) ──────────────────────────────────────────────
  const homePage: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      images: [`${baseUrl}/logo.png`, `${baseUrl}/images/img-server-rack.jpg`, `${baseUrl}/images/img-team-meeting.jpg`],
    },
  ];

  // ── Tier 2: Core conversion pages (0.95) ───────────────────────────────
  const conversionPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/services`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.95 },
    { url: `${baseUrl}/contact`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9  },
  ];

  // ── Tier 3: Brand / trust pages (0.85) ─────────────────────────────────
  const brandPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/about`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
  ];

  // ── Tier 4: Content / blog (0.8 index, 0.7 posts) ──────────────────────
  const blogIndex: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  // ── Tier 5: Programme pages (0.75) ─────────────────────────────────────
  const programmePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/internship`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/internship/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/verify`,            lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5  },
  ];

  // ── Tier 6: Legal / utility pages (0.3) ────────────────────────────────
  const legalPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`,   lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // ── Dynamic: Service detail pages (0.9) ────────────────────────────────
  const serviceSitemaps: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // ── Dynamic: Blog post pages (0.7) ─────────────────────────────────────
  const blogSitemaps: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateISO),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  // ── Dynamic: Team portfolio pages (0.7) ────────────────────────────────
  const teamSitemaps: MetadataRoute.Sitemap = teamData.map((member) => ({
    url: `${baseUrl}/team/${member.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const teamIndex: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  return [
    ...homePage,
    ...conversionPages,
    ...brandPages,
    ...blogIndex,
    ...teamIndex,
    ...programmePages,
    ...legalPages,
    ...serviceSitemaps,
    ...blogSitemaps,
    ...teamSitemaps,
  ];
}
