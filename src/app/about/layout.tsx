import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SAMStack Tech | Our Mission, Team & Story",
  description: "Learn about SAMStack Tech — an elite software engineering agency founded by Suleman Zaheer at UET Lahore. We build enterprise-grade web apps and AI systems for global clients.",
  openGraph: {
    title: "About SAMStack Tech | Our Mission, Team & Story",
    description: "Meet the team behind SAMStack Tech. Founded by engineers from UET Lahore, we deliver enterprise software, AI automation, and cloud solutions for businesses worldwide.",
    url: "https://samstack.tech/about",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
