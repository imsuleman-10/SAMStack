import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { blogPosts, getBlogPost } from "@/lib/data/blog-posts";
import { Calendar, User, ArrowLeft, Clock, Tag, BookOpen } from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "../../components/AnimateOnScroll";
import type { Metadata } from "next";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://samstack.tech";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Try static data first
  const staticPost = getBlogPost(slug);
  if (staticPost) {
    return {
      title: staticPost.title,
      description: staticPost.excerpt,
      keywords: staticPost.tags,
      authors: [{ name: staticPost.author }],
      openGraph: {
        title: staticPost.title,
        description: staticPost.excerpt,
        url: `${BASE_URL}/blog/${slug}`,
        type: "article",
        publishedTime: staticPost.dateISO,
        authors: [staticPost.author],
        tags: staticPost.tags,
        images: [{ url: staticPost.image, width: 1200, height: 630, alt: staticPost.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: staticPost.title,
        description: staticPost.excerpt,
        images: [staticPost.image],
      },
      alternates: { canonical: `${BASE_URL}/blog/${slug}` },
    };
  }

  // Fallback to DB
  try {
    const post = await db.posts.getBySlug(slug);
    if (!post) return { title: "Post Not Found" };
    return {
      title: post.title,
      description: post.excerpt,
      alternates: { canonical: `${BASE_URL}/blog/${slug}` },
    };
  } catch {
    return { title: "SAMStack Insights" };
  }
}

export async function generateStaticParams() {
  // Static blog post slugs
  const staticSlugs = blogPosts.map((p) => ({ slug: p.slug }));
  // Also include DB slugs if available
  try {
    const posts = await db.posts.list();
    const dbSlugs = posts.map((post) => ({ slug: post.slug }));
    return [...staticSlugs, ...dbSlugs];
  } catch {
    return staticSlugs;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

const getCoverImage = (slug: string, fallback?: string) => {
  if (fallback) return fallback;
  const images = [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=1200",
  ];
  const hash = Array.from(slug).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Try static blog posts first
  const staticPost = getBlogPost(slug);

  if (staticPost) {
    const initials = getInitials(staticPost.author);
    const coverImage = getCoverImage(slug, staticPost.image);

    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: staticPost.title,
      description: staticPost.excerpt,
      image: staticPost.image,
      datePublished: staticPost.dateISO,
      dateModified: staticPost.dateISO,
      author: {
        "@type": "Person",
        name: staticPost.author,
        jobTitle: staticPost.authorTitle,
        url: `${BASE_URL}/about`,
      },
      publisher: {
        "@type": "Organization",
        name: "SAMStack Tech",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
      keywords: staticPost.tags.join(", "),
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: staticPost.title, item: `${BASE_URL}/blog/${slug}` },
      ],
    };

    return (
      <article className="flex-1 w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        {/* ─── HERO ──────────────────────────────────────── */}
        <section className="relative overflow-hidden w-full">
          <div className="relative h-[55vh] sm:h-[60vh]">
            <Image src={coverImage} alt={staticPost.title} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 to-transparent" />
          </div>

          <div className="absolute top-6 left-5 sm:top-8 sm:left-8 z-20">
            <AnimateOnScroll variant="fadeLeft">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 px-4 py-2 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Articles
              </Link>
            </AnimateOnScroll>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pb-12 sm:pb-16">
              <AnimateOnScroll variant="fadeUp" delay={0.05}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {staticPost.tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-white/80 uppercase tracking-widest">
                      <Tag className="w-3 h-3" />{t}
                    </span>
                  ))}
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.1}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] font-heading max-w-3xl mb-4">
                  {staticPost.title}
                </h1>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.15}>
                <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed max-w-2xl mb-5">
                  {staticPost.excerpt}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.2}>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-white/10">
                  <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />{staticPost.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />{staticPost.readTime}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <User className="w-3.5 h-3.5 text-cyan-500" />{staticPost.author}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-500" />{staticPost.authorTitle}
                  </span>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ─── ARTICLE BODY ──────────────────────────────── */}
        <section className="py-16 sm:py-24 px-5 sm:px-8">
          <div className="max-w-3xl mx-auto">
            <AnimateOnScroll variant="fadeUp">
              <div className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-6 sm:p-10 lg:p-12 rounded-3xl shadow-sm prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-h2:text-2xl prose-h2:font-bold prose-h2:border-b prose-h2:border-slate-200 prose-h2:dark:border-white/5 prose-h2:pb-3 prose-h2:mt-12 prose-h2:mb-4 prose-p:text-slate-700 prose-p:dark:text-slate-300 prose-li:text-slate-700 prose-li:dark:text-slate-300 prose-strong:text-slate-900 prose-strong:dark:text-white">
                <div dangerouslySetInnerHTML={{ __html: staticPost.content }} />
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ─── AUTHOR CARD ───────────────────────────────── */}
        <section className="pb-20 sm:pb-28 px-5 sm:px-8">
          <div className="max-w-3xl mx-auto w-full">
            <AnimateOnScroll variant="fadeUp">
              <div className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white font-heading shrink-0 shadow-lg">
                    {initials}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">{staticPost.author}</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{staticPost.authorTitle}</span>
                  </div>
                </div>
                <Link href="/blog" className="btn-secondary shrink-0">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  More Articles
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

      </article>
    );
  }

  // Fallback: try DB
  let dbPost = null;
  try {
    dbPost = await db.posts.getBySlug(slug);
  } catch {
    dbPost = null;
  }

  if (dbPost === null) notFound();

  const { title, excerpt, tags, publishedAt, contentMarkdown, author } = dbPost!;
  const initials = getInitials(author.name);
  const coverImage = getCoverImage(slug);
  const publishDate = formatDate(publishedAt);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: coverImage,
    datePublished: publishedAt,
    author: { "@type": "Person", name: author.name },
    publisher: { "@type": "Organization", name: "SAMStack Tech", logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
  };

  return (
    <article className="flex-1 w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <section className="relative overflow-hidden w-full">
        <div className="relative h-[55vh] sm:h-[60vh]">
          <Image src={coverImage} alt={title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/20" />
        </div>

        <div className="absolute top-6 left-5 sm:top-8 sm:left-8 z-20">
          <AnimateOnScroll variant="fadeLeft">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 px-4 py-2 rounded-xl transition-all duration-200">
              <ArrowLeft className="w-3.5 h-3.5" />All Articles
            </Link>
          </AnimateOnScroll>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pb-12 sm:pb-16">
            <AnimateOnScroll variant="fadeUp" delay={0.05}>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((t: string) => (
                  <span key={t} className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-white/80 uppercase tracking-widest">
                    <Tag className="w-3 h-3" />{t}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll variant="fadeUp" delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] font-heading max-w-3xl mb-4">{title}</h1>
            </AnimateOnScroll>
            <AnimateOnScroll variant="fadeUp" delay={0.15}>
              <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed max-w-2xl mb-5">{excerpt}</p>
            </AnimateOnScroll>
            <AnimateOnScroll variant="fadeUp" delay={0.2}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-white/10">
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400"><Calendar className="w-3.5 h-3.5 text-cyan-400" />{publishDate}</span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400"><User className="w-3.5 h-3.5 text-cyan-500" />{author.name}</span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400"><BookOpen className="w-3.5 h-3.5 text-cyan-500" />{author.role}</span>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll variant="fadeUp">
            <div className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-6 sm:p-10 lg:p-12 rounded-3xl shadow-sm prose prose-slate dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: contentMarkdown }} />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="pb-20 sm:pb-28 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto w-full">
          <AnimateOnScroll variant="fadeUp">
            <div className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white font-heading shrink-0 shadow-lg">{initials}</div>
                <div>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">{author.name}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{author.role}</span>
                </div>
              </div>
              <Link href="/blog" className="btn-secondary shrink-0"><ArrowLeft className="w-3.5 h-3.5" />More Articles</Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </article>
  );
}
