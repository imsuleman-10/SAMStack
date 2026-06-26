import React from "react";
import HomeClient from "./home-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAMStack Tech | Elite Software Engineering Agency",
  description: "SAMStack Tech is an elite software engineering agency based in Lahore, Pakistan. We build high-performance enterprise web apps, AI-powered systems, and scalable cloud infrastructure.",
  keywords: ["software agency Pakistan", "enterprise web development", "DevOps consulting", "SAMStack Tech", "Suleman Zaheer", "MERN stack agency"],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://samstack.tech",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
