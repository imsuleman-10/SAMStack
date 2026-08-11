import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Engineering Portfolio | SAMStack Tech Projects",
  description: "Explore SAMStack Tech's portfolio of enterprise software projects — high-performance web applications, AI-powered systems, mobile apps, and cloud infrastructure built for global clients from Lahore, Pakistan.",
  keywords: [
    "software engineering portfolio Pakistan",
    "SAMStack Tech projects",
    "enterprise web app portfolio",
    "web development portfolio Lahore",
    "Next.js project showcase",
    "AI system portfolio",
    "software agency case studies",
  ],
  alternates: {
    canonical: "https://samstack-tech.vercel.app/portfolio",
    languages: { 'en': 'https://samstack-tech.vercel.app/portfolio' },
  },
  openGraph: {
    title: "Software Engineering Portfolio | SAMStack Tech",
    description: "Explore enterprise software projects, AI systems, mobile apps, and cloud infrastructure built by SAMStack Tech for global clients.",
    url: "https://samstack-tech.vercel.app/portfolio",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "SAMStack Tech Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Engineering Portfolio | SAMStack Tech",
    description: "Enterprise apps, AI systems, mobile apps, and cloud infrastructure — see what SAMStack Tech builds for global clients.",
    images: ["/logo.png"],
  },
};

const portfolioJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://samstack-tech.vercel.app/portfolio",
      "url": "https://samstack-tech.vercel.app/portfolio",
      "name": "SAMStack Tech Portfolio",
      "description": "Showcase of enterprise software projects built by SAMStack Tech.",
      "isPartOf": { "@type": "WebSite", "url": "https://samstack-tech.vercel.app" },
      "publisher": {
        "@type": "Organization",
        "name": "SAMStack Tech",
        "url": "https://samstack-tech.vercel.app"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://samstack-tech.vercel.app" },
        { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://samstack-tech.vercel.app/portfolio" }
      ]
    }
  ]
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioJsonLd) }}
      />
      {children}
    </>
  );
}
