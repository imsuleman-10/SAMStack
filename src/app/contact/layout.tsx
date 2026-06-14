import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact SAMStack Tech | Start Your Enterprise Project",
  description: "Ready to build something great? Contact SAMStack Tech to discuss your enterprise software project, get a quote, or schedule a technical consultation with our engineering team.",
  openGraph: {
    title: "Contact SAMStack Tech | Start Your Enterprise Project",
    description: "Get in touch with SAMStack Tech. We respond to enterprise inquiries within 24 hours. Let's build your next high-performance software solution.",
    url: "https://samstack.tech/contact",
    type: "website",
  },
  keywords: ["hire software agency Pakistan", "contact SAMStack Tech", "enterprise project quote", "web development consultation Lahore"],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
