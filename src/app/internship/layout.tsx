import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Engineering Internship in Lahore | SAMStack Tech",
  description: "Apply for a real-world software engineering internship at SAMStack Tech in Lahore, Pakistan. Work on live enterprise projects, earn a verified certificate, and build your professional portfolio with industry mentors.",
  keywords: [
    "software engineering internship Pakistan",
    "internship Lahore 2026",
    "web development internship Pakistan",
    "SAMStack Tech internship",
    "IT internship Lahore",
    "Next.js internship Pakistan",
    "engineering internship certificate",
    "UET Lahore internship",
  ],
  alternates: {
    canonical: "https://samstack.tech/internship",
    languages: { 'en': 'https://samstack.tech/internship' },
  },
  openGraph: {
    title: "Software Engineering Internship in Lahore | SAMStack Tech",
    description: "Join SAMStack Tech's elite internship program. Work on live enterprise products, gain hands-on experience with Next.js, DevOps, and AI, and earn a verified certificate.",
    url: "https://samstack.tech/internship",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "SAMStack Tech Internship Program" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Engineering Internship in Lahore | SAMStack Tech",
    description: "Real-world internship at SAMStack Tech — work on live enterprise projects, earn a verified certificate. Based in Lahore, Pakistan.",
    images: ["/logo.png"],
  },
};

const internshipJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOccupationalProgram",
      "name": "SAMStack Tech Software Engineering Internship",
      "description": "A hands-on software engineering internship program where interns work on live enterprise products using Next.js, React, Node.js, DevOps, and AI systems.",
      "provider": {
        "@type": "Organization",
        "name": "SAMStack Tech",
        "url": "https://samstack.tech",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lahore",
          "addressRegion": "Punjab",
          "addressCountry": "PK"
        }
      },
      "educationalProgramMode": "in-person",
      "occupationalCategory": "Software Engineering",
      "url": "https://samstack.tech/internship",
      "applicationStartDate": "2026-01-01",
      "offers": {
        "@type": "Offer",
        "category": "Internship",
        "url": "https://samstack.tech/internship"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://samstack.tech" },
        { "@type": "ListItem", "position": 2, "name": "Internship", "item": "https://samstack.tech/internship" }
      ]
    }
  ]
};

export default function InternshipLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(internshipJsonLd) }}
      />
      {children}
    </>
  );
}
