import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

import Shell from "./components/Shell";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://samstack.tech'),
  title: {
    default: "SAMStack Tech | Software Engineering Agency — Lahore, Pakistan",
    template: "%s | SAMStack Tech",
  },
  description: "SAMStack Tech is an elite software engineering agency based in Lahore, Pakistan. We build high-performance enterprise web apps, AI-powered systems, and scalable cloud infrastructure for businesses worldwide.",
  keywords: [
    "software agency Pakistan",
    "software engineering agency Lahore",
    "enterprise software development Pakistan",
    "web development Lahore",
    "hire software developers Pakistan",
    "outsource software development Pakistan",
    "Next.js development agency",
    "MERN stack agency",
    "DevOps consulting Pakistan",
    "AI development agency Pakistan",
    "SAMStack Tech",
    "Suleman Zaheer",
  ],
  authors: [{ name: "Suleman Zaheer", url: "https://suleman-zaheer.vercel.app" }],
  creator: "SAMStack Tech",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://samstack.tech',
    languages: { 'en': process.env.NEXT_PUBLIC_SITE_URL || 'https://samstack.tech' },
  },
  openGraph: {
    title: "SAMStack Tech | Elite Software Engineering Agency — Lahore, Pakistan",
    description: "SAMStack Tech is an elite software engineering agency. We build high-performance enterprise web apps, AI systems, and scalable cloud infrastructure.",
    url: "https://samstack.tech",
    siteName: "SAMStack Tech",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "SAMStack Tech — Elite Software Engineering Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAMStack Tech | Elite Software Engineering Agency — Lahore, Pakistan",
    description: "Elite software agency specializing in enterprise solutions, custom web apps, and cloud infrastructure. Based in Lahore, Pakistan. Serving clients globally.",
    images: ["/logo.png"],
    creator: "@samstacktech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/logo.png',
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "Organization"],
  "name": "SAMStack Tech",
  "description": "Elite software engineering agency based in Lahore, Pakistan, specializing in enterprise web applications, AI-powered systems, and cloud infrastructure.",
  "url": "https://samstack.tech",
  "logo": "https://samstack.tech/logo.png",
  "image": "https://samstack.tech/logo.png",
  "email": "samstacktechs@gmail.com",
  "telephone": "+923285778715",
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+923285778715",
      "contactType": "customer service",
      "availableLanguage": ["English", "Urdu"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    },
    {
      "@type": "ContactPoint",
      "contactType": "technical support",
      "email": "samstacktechs@gmail.com",
      "url": "https://wa.me/923285778715",
      "availableLanguage": ["English", "Urdu"]
    }
  ],
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
  "areaServed": [{ "@type": "Place", "name": "Worldwide" }],
  "serviceType": ["Web Application Development", "Enterprise Software", "AI & Machine Learning", "DevOps & Cloud Infrastructure", "UI/UX Design", "Mobile App Development"],
  "priceRange": "$$",
  "openingHours": "Mo-Su 00:00-23:59",
  "founder": {
    "@type": "Person",
    "name": "Suleman Zaheer",
    "givenName": "Suleman",
    "familyName": "Zaheer",
    "url": "https://suleman-zaheer.vercel.app",
    "jobTitle": "Full Stack Engineer & DevOps Lead",
    "worksFor": { "@type": "Organization", "name": "SAMStack Tech" },
    "telephone": "+923285778715",
    "email": "samstacktechs@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lahore",
      "addressRegion": "Punjab",
      "addressCountry": "PK"
    },
    "sameAs": [
      "https://github.com/imsuleman-10",
      "https://www.linkedin.com/in/suleman-zaheer-mughal",
      "https://wa.me/923285778715"
    ],
    "knowsAbout": ["Next.js", "React", "DevOps", "Docker", "Kubernetes", "AWS", "AI Agents", "System Architecture", "TypeScript", "Node.js"],
    "alumniOf": { "@type": "CollegeOrUniversity", "name": "University of Engineering and Technology (UET), Lahore" }
  },
  "sameAs": [
    "https://github.com/imsuleman-10",
    "https://www.linkedin.com/in/suleman-zaheer-mughal"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Software Engineering Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Enterprise Software Development" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web & Serverless App Development" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Agentic AI & LLM Integrations" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "DevOps & Cloud Architecture" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile App Development" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "UI/UX Design Systems" }}
    ]
  }
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Suleman Zaheer",
  "givenName": "Suleman",
  "familyName": "Zaheer",
  "alternateName": "Suleman Zaheer Mughal",
  "url": "https://suleman-zaheer.vercel.app",
  "image": "https://samstack.tech/suleman.jpg",
  "jobTitle": "Full Stack Engineer & DevOps Lead",
  "description": "Founder of SAMStack Tech — an elite software engineering studio based in Lahore, Pakistan. Specializes in Next.js, DevOps, cloud architecture, and AI agent systems.",
  "telephone": "+923285778715",
  "email": "samstacktechs@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lahore",
    "addressRegion": "Punjab",
    "addressCountry": "PK"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "SAMStack Tech",
    "url": "https://samstack.tech"
  },
  "sameAs": [
    "https://github.com/imsuleman-10",
    "https://www.linkedin.com/in/suleman-zaheer-mughal",
    "https://wa.me/923285778715",
    "https://samstack.tech"
  ],
  "knowsAbout": ["Software Engineering", "Next.js", "React", "TypeScript", "DevOps", "Docker", "Kubernetes", "AWS", "Agentic AI", "System Architecture", "Node.js", "PostgreSQL"],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "University of Engineering and Technology (UET), Lahore"
  }
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SAMStack Tech",
  "url": "https://samstack.tech",
  "description": "Elite software engineering agency based in Lahore, Pakistan. Enterprise web apps, AI systems, and cloud infrastructure.",
  "publisher": {
    "@type": "Organization",
    "name": "SAMStack Tech",
    "url": "https://samstack.tech",
    "logo": {
      "@type": "ImageObject",
      "url": "https://samstack.tech/logo.png"
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://samstack.tech/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative selection:bg-brand-500/30 selection:text-brand-700 dark:selection:text-brand-300 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>

          {/* Global Toast Notifications */}
          <Toaster position="top-right" richColors closeButton theme="system" />

          <Shell>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
