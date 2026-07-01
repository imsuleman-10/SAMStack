import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact SAMStack Tech | Start Your Enterprise Software Project",
  description: "Ready to build something great? Contact SAMStack Tech in Lahore, Pakistan to discuss your enterprise software project, get a free quote, or schedule a technical consultation within 12 hours.",
  keywords: [
    "hire software agency Pakistan",
    "contact SAMStack Tech",
    "enterprise project quote",
    "web development consultation Lahore",
    "software development agency contact",
    "outsource software Pakistan contact",
    "free software consultation",
  ],
  alternates: {
    canonical: "https://samstack.tech/contact",
    languages: { 'en': 'https://samstack.tech/contact' },
  },
  openGraph: {
    title: "Contact SAMStack Tech | Start Your Enterprise Software Project",
    description: "Get in touch with SAMStack Tech. We respond to enterprise inquiries within 12 hours. Let's build your next high-performance software solution from Lahore, Pakistan.",
    url: "https://samstack.tech/contact",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Contact SAMStack Tech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact SAMStack Tech | Start Your Enterprise Software Project",
    description: "Reach out to SAMStack Tech for enterprise software development, AI systems, and DevOps consulting. Based in Lahore — serving clients worldwide.",
    images: ["/logo.png"],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://samstack.tech#business",
      "name": "SAMStack Tech",
      "description": "Elite software engineering agency specializing in enterprise web applications, AI-powered automation, and cloud infrastructure.",
      "url": "https://samstack.tech",
      "logo": "https://samstack.tech/logo.png",
      "image": "https://samstack.tech/logo.png",
      "email": "samstacktechs@gmail.com",
      "telephone": "+923285778715",
      "priceRange": "$$",
      "openingHours": "Mo-Su 00:00-23:59",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lahore",
        "addressRegion": "Punjab",
        "addressCountry": "PK",
        "addressCountryCode": "PK"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "31.5204",
        "longitude": "74.3587"
      },
      "areaServed": [
        { "@type": "Country", "name": "Pakistan" },
        { "@type": "Place", "name": "Worldwide" }
      ],
      "sameAs": [
        "https://github.com/imsuleman-10",
        "https://www.linkedin.com/in/suleman-zaheer-mughal"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+923285778715",
        "contactType": "customer service",
        "email": "samstacktechs@gmail.com",
        "availableLanguage": ["English", "Urdu"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        }
      }
    },
    {
      "@type": "ContactPage",
      "@id": "https://samstack.tech/contact",
      "url": "https://samstack.tech/contact",
      "name": "Contact SAMStack Tech",
      "description": "Get in touch with SAMStack Tech to start your enterprise software project.",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://samstack.tech" },
          { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://samstack.tech/contact" }
        ]
      }
    }
  ]
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {children}
    </>
  );
}
