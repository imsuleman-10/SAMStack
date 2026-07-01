import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, Terminal, Home, MessageSquare } from "lucide-react";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "404 — Page Not Found | SAMStack Tech",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black relative overflow-hidden px-4 sm:px-6">

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        <AnimateOnScroll variant="scaleUp">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full glass-card border-amber-200 dark:border-amber-900/50 flex items-center justify-center shadow-2xl">
                <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 text-amber-500" />
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fadeUp" delay={0.1}>
          <div className="space-y-4">
            <span className="section-label !bg-amber-500/10 !border-amber-500/20 !text-amber-600 dark:!text-amber-400">
              <Terminal className="w-3.5 h-3.5" />
              Error 404 — Route Undefined
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Page Not<br />
              <span className="text-gradient-brand !bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500">Found</span>
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track with our platform.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fadeUp" delay={0.15}>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl glass-card border-slate-200 dark:border-neutral-800">
            <span className="text-3xl sm:text-4xl font-black text-amber-500">404</span>
            <div className="w-px h-8 bg-slate-300 dark:bg-neutral-700" />
            <span className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">Subroutine Undefined</span>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fadeUp" delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
            <Link href="/" className="btn-primary">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link href="/contact" className="btn-secondary">
              <MessageSquare className="w-4 h-4" />
              Contact Support
            </Link>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fadeUp" delay={0.25}>
          <div className="pt-8 border-t border-slate-200 dark:border-neutral-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider mb-4 font-semibold">Quick Navigation</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: "About", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Blog", href: "/blog" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="px-3 py-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
