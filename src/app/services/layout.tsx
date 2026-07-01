import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Engineering Services | Web, AI & Enterprise Solutions",
  description: "SAMStack Tech offers world-class software services from Lahore, Pakistan: custom enterprise web applications, AI-powered automation, serverless cloud infrastructure, mobile apps, and full-stack MERN/Next.js development for global clients.",
  keywords: [
    "software development services Pakistan",
    "enterprise web development Lahore",
    "AI automation services Pakistan",
    "Next.js development agency",
    "MERN stack agency Pakistan",
    "DevOps consulting Lahore",
    "mobile app development Pakistan",
    "UI/UX design agency Pakistan",
    "outsource software development",
  ],
  alternates: {
    canonical: "https://samstack.tech/services",
    languages: { 'en': 'https://samstack.tech/services' },
  },
  openGraph: {
    title: "Software Engineering Services | SAMStack Tech",
    description: "Explore our core services: enterprise web development, AI automation, DevOps, mobile apps, and UI/UX design. Built for high-growth businesses. Based in Lahore, Pakistan.",
    url: "https://samstack.tech/services",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "SAMStack Tech Software Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Engineering Services | SAMStack Tech — Lahore, Pakistan",
    description: "Enterprise software, AI automation, DevOps, mobile apps & UI/UX design. World-class services from Lahore, Pakistan for global clients.",
    images: ["/logo.png"],
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://samstack.tech" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://samstack.tech/services" }
      ]
    },
    {
      "@type": "ItemList",
      "name": "SAMStack Tech Software Engineering Services",
      "description": "Full range of software engineering services offered by SAMStack Tech",
      "itemListElement": [
        {
          "@type": "ListItem", "position": 1,
          "item": {
            "@type": "Service",
            "name": "Custom Enterprise Software Development",
            "description": "Low-latency systems architecture, dynamic database configurations, high-throughput backend services, and multithreaded logic engines tailored for scale.",
            "provider": { "@type": "Organization", "name": "SAMStack Tech", "url": "https://samstack.tech" },
            "url": "https://samstack.tech/services/custom-enterprise-software",
            "serviceType": "Software Development"
          }
        },
        {
          "@type": "ListItem", "position": 2,
          "item": {
            "@type": "Service",
            "name": "Web & Serverless Application Development",
            "description": "Ultra-fast Next.js App Router pages, server-side pre-rendered HTML, optimised cloud edge routes, and zero-cost scaling solutions.",
            "provider": { "@type": "Organization", "name": "SAMStack Tech", "url": "https://samstack.tech" },
            "url": "https://samstack.tech/services/web-serverless-apps",
            "serviceType": "Web Development"
          }
        },
        {
          "@type": "ListItem", "position": 3,
          "item": {
            "@type": "Service",
            "name": "Agentic AI & LLM Integrations",
            "description": "Custom AI autonomous workflow agents, semantic vector indexing, retrieval-augmented systems (RAG), and smart pipeline automations.",
            "provider": { "@type": "Organization", "name": "SAMStack Tech", "url": "https://samstack.tech" },
            "url": "https://samstack.tech/services/agentic-ai-integrations",
            "serviceType": "Artificial Intelligence"
          }
        },
        {
          "@type": "ListItem", "position": 4,
          "item": {
            "@type": "Service",
            "name": "DevOps & Cloud Architecture",
            "description": "Containerised docker registries, CI/CD pipeline automation, and cloud serverless monitoring for highly available production systems.",
            "provider": { "@type": "Organization", "name": "SAMStack Tech", "url": "https://samstack.tech" },
            "url": "https://samstack.tech/services/devops-cloud-architectures",
            "serviceType": "DevOps Consulting"
          }
        },
        {
          "@type": "ListItem", "position": 5,
          "item": {
            "@type": "Service",
            "name": "Mobile App Development",
            "description": "Native-performance iOS and Android applications built with React Native and Expo, featuring offline-first architecture.",
            "provider": { "@type": "Organization", "name": "SAMStack Tech", "url": "https://samstack.tech" },
            "url": "https://samstack.tech/services/mobile-app-development",
            "serviceType": "Mobile Development"
          }
        },
        {
          "@type": "ListItem", "position": 6,
          "item": {
            "@type": "Service",
            "name": "UI/UX Design Systems",
            "description": "Research-driven interface design, scalable design systems, interactive prototyping, and user experience audits.",
            "provider": { "@type": "Organization", "name": "SAMStack Tech", "url": "https://samstack.tech" },
            "url": "https://samstack.tech/services/ui-ux-design-systems",
            "serviceType": "UI/UX Design"
          }
        },
        {
          "@type": "ListItem", "position": 7,
          "item": {
            "@type": "Service",
            "name": "Data Analytics & Business Intelligence",
            "description": "Real-time data pipelines, interactive dashboards, predictive analytics models, and business intelligence systems.",
            "provider": { "@type": "Organization", "name": "SAMStack Tech", "url": "https://samstack.tech" },
            "url": "https://samstack.tech/services/data-analytics-bi",
            "serviceType": "Data Analytics"
          }
        }
      ]
    }
  ]
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      {children}
    </>
  );
}
