import React from "react";
import type { Metadata } from "next";
import { getBlogPost } from "@/lib/data/blog-posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://samstack.tech";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | SAMStack Tech",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...post.tags, "SAMStack Tech blog", "software engineering Pakistan", "enterprise development"],
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${BASE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.dateISO,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) return <>{children}</>;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${BASE_URL}/blog/${post.slug}#article`,
        "headline": post.title,
        "description": post.excerpt,
        "image": {
          "@type": "ImageObject",
          "url": post.image,
          "width": 1200,
          "height": 630
        },
        "datePublished": post.dateISO,
        "dateModified": post.dateISO,
        "author": {
          "@type": "Person",
          "name": post.author,
          "worksFor": { "@type": "Organization", "name": "SAMStack Tech" }
        },
        "publisher": {
          "@type": "Organization",
          "name": "SAMStack Tech",
          "url": "https://samstack.tech",
          "logo": { "@type": "ImageObject", "url": "https://samstack.tech/logo.png" }
        },
        "url": `${BASE_URL}/blog/${post.slug}`,
        "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE_URL}/blog/${post.slug}` },
        "keywords": post.tags.join(", "),
        "articleSection": post.category,
        "inLanguage": "en-US",
        "isPartOf": { "@type": "Blog", "url": `${BASE_URL}/blog` }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}` },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": `${BASE_URL}/blog/${post.slug}` }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {children}
    </>
  );
}
