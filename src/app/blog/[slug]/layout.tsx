import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAMStack Insights | Engineering Logs",
  description: "Read in-depth engineering logs and architecture articles from SAMStack Tech.",
};

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  // This layout intentionally does NOT include the Header component
  // allowing blog posts to have a full-screen reading experience
  return <>{children}</>;
}
