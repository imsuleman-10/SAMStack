import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAMStack Tech Engineering Blog | Systems Architecture & DevOps Logs",
  description: "Deep dives into full-stack architecture, high-throughput serverless systems, Edge computing, AI agents, and enterprise DevOps pipelines by the SAMStack Tech engineering team.",
  openGraph: {
    title: "SAMStack Tech Engineering Blog | Systems Architecture & DevOps Logs",
    description: "Deep dives into full-stack architecture, high-throughput serverless systems, Edge computing, AI agents, and enterprise DevOps pipelines.",
    url: "https://samstack.tech/blog",
    type: "website",
  },
  keywords: ["software engineering blog", "system architecture", "DevOps best practices", "Next.js performance", "TypeScript DDD", "SAMStack Tech insights"],
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
