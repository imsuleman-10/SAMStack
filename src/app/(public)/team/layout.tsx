import React from "react";
import type { Metadata } from "next";
import { teamData } from "@/lib/data/team";

const BASE_URL = "https://samstack-tech.vercel.app";

export const metadata: Metadata = {
  title: "Our Engineering Team | SAMStack Tech — Lahore, Pakistan",
  description:
    "Meet the engineers behind SAMStack Tech. Suleman Zaheer (Founder & Lead Engineer), Saqib Javed (Frontend Engineer), and Syed Abdullah (Backend Engineer) — building world-class software from Lahore, Pakistan.",
  keywords: [
    "SAMStack Tech team",
    "Suleman Zaheer developer",
    "Saqib Javed frontend engineer",
    "Syed Abdullah backend engineer",
    "software engineers Lahore",
    "Pakistani software developers",
    "SAMStack Tech engineers",
    "UET Lahore developers",
    "Next.js developers Pakistan",
    "full stack engineers Pakistan",
  ],
  authors: teamData.map(m => ({ name: m.name, url: `${BASE_URL}/team/${m.id}` })),
  publisher: "SAMStack Tech",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: `${BASE_URL}/team`,
    languages: { en: `${BASE_URL}/team` },
  },
  openGraph: {
    title: "Our Engineering Team | SAMStack Tech",
    description:
      "Meet Suleman Zaheer, Saqib Javed, and Syed Abdullah — the core engineers building enterprise software solutions at SAMStack Tech in Lahore, Pakistan.",
    url: `${BASE_URL}/team`,
    type: "website",
    siteName: "SAMStack Tech",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "SAMStack Tech Engineering Team — Lahore, Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Engineering Team | SAMStack Tech",
    description:
      "Suleman Zaheer, Saqib Javed & Syed Abdullah — building enterprise-grade software from Lahore, Pakistan.",
    images: [`${BASE_URL}/logo.png`],
    site: "@SAMStackTech",
  },
};

// ── JSON-LD: ItemList of team + Organization ──────────────────────────────
const teamPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // WebPage
    {
      "@type": "CollectionPage",
      "@id": `${BASE_URL}/team#webpage`,
      "url": `${BASE_URL}/team`,
      "name": "Our Engineering Team | SAMStack Tech",
      "description":
        "The engineers, designers, and developers building enterprise-grade software solutions at SAMStack Tech, Lahore, Pakistan.",
      "inLanguage": "en-US",
      "isPartOf": { "@type": "WebSite", "url": BASE_URL, "name": "SAMStack Tech" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Team", "item": `${BASE_URL}/team` },
        ],
      },
    },

    // Organization
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "SAMStack Tech",
      "url": BASE_URL,
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/logo.png` },
      "description":
        "Elite software engineering agency based in Lahore, Pakistan, specializing in enterprise web applications, AI systems, and cloud infrastructure.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lahore",
        "addressRegion": "Punjab",
        "addressCountry": "PK",
        "addressCountryName": "Pakistan",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "samstacktechs@gmail.com",
        "telephone": "+923285778715",
        "areaServed": "Worldwide",
        "availableLanguage": ["English", "Urdu"],
      },
      "employee": teamData.map(m => ({
        "@type": "Person",
        "name": m.name,
        "jobTitle": m.jobTitle,
        "url": `${BASE_URL}/team/${m.id}`,
        "image": `${BASE_URL}${m.avatarUrl}`,
        "sameAs": Object.values(m.socialLinks).filter(Boolean),
      })),
    },

    // ItemList of team member profiles
    {
      "@type": "ItemList",
      "name": "SAMStack Tech Engineering Team",
      "description": "All team members at SAMStack Tech",
      "numberOfItems": teamData.length,
      "itemListElement": teamData.map((m, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": m.name,
        "description": m.bio,
        "url": `${BASE_URL}/team/${m.id}`,
        "item": {
          "@type": "Person",
          "name": m.name,
          "jobTitle": m.jobTitle,
          "url": `${BASE_URL}/team/${m.id}`,
          "worksFor": { "@type": "Organization", "name": "SAMStack Tech" },
        },
      })),
    },
  ],
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamPageJsonLd) }}
      />
      {children}
    </>
  );
}
