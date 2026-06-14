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
    default: "SAMStack Tech | Elite Software Engineering Agency",
    template: "%s | SAMStack Tech",
  },
  description: "SAMStack Tech is an elite software engineering agency based in Lahore, Pakistan. We build high-performance enterprise web apps, AI-powered systems, and scalable cloud infrastructure for businesses worldwide.",
  keywords: ["software agency Pakistan", "web development Lahore", "enterprise software", "MERN stack", "Next.js development", "SAMStack Tech"],
  authors: [{ name: "Suleman Zaheer", url: "https://suleman-zaheer.vercel.app" }],
  creator: "SAMStack Tech",
  openGraph: {
    title: "SAMStack Tech | Elite Software Engineering Agency",
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
    title: "SAMStack Tech | Elite Software Engineering Agency",
    description: "Elite software agency specializing in enterprise solutions, custom web apps, and cloud infrastructure.",
    images: ["/logo.png"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "SAMStack Tech",
  "description": "Elite software engineering agency based in Lahore, Pakistan, specializing in enterprise web applications, AI-powered systems, and cloud infrastructure.",
  "url": "https://samstack.tech",
  "logo": "https://samstack.tech/logo.png",
  "founder": {
    "@type": "Person",
    "name": "Suleman Zaheer",
    "url": "https://suleman-zaheer.vercel.app",
    "jobTitle": "Founder & Lead Engineer",
    "alumniOf": { "@type": "CollegeOrUniversity", "name": "University of Engineering and Technology (UET), Lahore" }
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lahore",
    "addressRegion": "Punjab",
    "addressCountry": "PK"
  },
  "areaServed": [{ "@type": "Place", "name": "Worldwide" }],
  "serviceType": ["Web Application Development", "Enterprise Software", "AI & Machine Learning", "DevOps & Cloud Infrastructure", "UI/UX Design"],
  "email": "samstacktechs@gmail.com",
  "telephone": "+923285778715",
  "sameAs": [
    "https://github.com/imsuleman-10",
    "https://www.linkedin.com/in/suleman-zaheer-mughal"
  ]
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
