import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAMStack Tech Engineering Blog | Systems Architecture & DevOps Insights",
  description: "Deep dives into full-stack architecture, high-throughput serverless systems, Edge computing, AI agents, and enterprise DevOps pipelines by the SAMStack Tech engineering team in Lahore, Pakistan.",
  keywords: [
    "software engineering blog Pakistan",
    "system architecture blog",
    "DevOps best practices 2026",
    "Next.js performance tips",
    "enterprise software engineering blog",
    "AI agents development blog",
    "TypeScript DDD patterns",
    "SAMStack Tech insights",
  ],
  alternates: {
    canonical: "https://samstack-tech.vercel.app/blog",
    languages: { 'en': 'https://samstack-tech.vercel.app/blog' },
  },
  openGraph: {
    title: "SAMStack Tech Engineering Blog | Systems Architecture & DevOps Insights",
    description: "Deep dives into full-stack architecture, high-throughput serverless systems, Edge computing, AI agents, and enterprise DevOps pipelines.",
    url: "https://samstack-tech.vercel.app/blog",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "SAMStack Tech Engineering Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SAMStack Tech Engineering Blog",
    description: "Deep dives into Next.js, DevOps, AI agents, and enterprise software engineering from the SAMStack Tech team.",
    images: ["/logo.png"],
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": "https://samstack-tech.vercel.app/blog",
      "url": "https://samstack-tech.vercel.app/blog",
      "name": "SAMStack Tech Engineering Blog",
      "description": "Deep dives into full-stack architecture, serverless systems, AI agents, and DevOps by the SAMStack Tech team.",
      "publisher": {
        "@type": "Organization",
        "name": "SAMStack Tech",
        "url": "https://samstack-tech.vercel.app",
        "logo": { "@type": "ImageObject", "url": "https://samstack-tech.vercel.app/logo.png" }
      },
      "inLanguage": "en-US"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://samstack-tech.vercel.app" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://samstack-tech.vercel.app/blog" }
      ]
    }
  ]
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      {children}
    </>
  );
}
