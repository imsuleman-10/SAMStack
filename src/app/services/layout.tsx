import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Engineering Services | Web, AI & Enterprise Solutions",
  description: "SAMStack Tech offers world-class software services: custom enterprise web applications, AI-powered automation, serverless cloud infrastructure, and full-stack MERN/Next.js development.",
  openGraph: {
    title: "Software Engineering Services | SAMStack Tech",
    description: "Explore our core services: enterprise web development, AI automation, DevOps, and UI/UX design. Built for high-growth businesses.",
    url: "https://samstack.tech/services",
    type: "website",
  },
  keywords: ["web development services", "enterprise software Pakistan", "AI automation", "Next.js developer", "MERN stack agency", "DevOps Lahore"],
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
