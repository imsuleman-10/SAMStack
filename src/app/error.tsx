"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global system error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black relative overflow-hidden px-4 sm:px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/8 dark:bg-rose-500/4 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-indigo-500/5 dark:bg-indigo-500/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-500/5 dark:bg-brand-500/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        <AnimateOnScroll variant="scaleUp">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-3xl animate-pulse" />
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full glass-card border-rose-200 dark:border-rose-900/50 flex items-center justify-center shadow-2xl">
                <AlertOctagon className="w-12 h-12 sm:w-14 sm:h-14 text-rose-500" />
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fadeUp" delay={0.1}>
          <div className="space-y-4">
            <span className="section-label !bg-rose-500/10 !border-rose-500/20 !text-rose-600 dark:!text-rose-400">
              <Sparkles className="w-3.5 h-3.5" />
              System Error — 500
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Something Went<br />
              <span className="text-gradient-brand !bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-500 dark:to-orange-500">Wrong</span>
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              We encountered an unexpected system error. Our engineering team has been notified and is working on a fix. Please try again shortly.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fadeUp" delay={0.2}>
          {error?.message && (
            <div className="glass-card rounded-xl p-4 max-w-md mx-auto border-rose-500/20">
              <p className="text-xs sm:text-sm font-mono text-rose-700 dark:text-rose-300 text-left break-words">
                {error.message}
              </p>
            </div>
          )}
        </AnimateOnScroll>

        <AnimateOnScroll variant="fadeUp" delay={0.25}>
          {error?.digest && (
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Error ID: <span className="text-slate-700 dark:text-slate-300 font-semibold">{error.digest}</span>
            </div>
          )}
        </AnimateOnScroll>

        <AnimateOnScroll variant="fadeUp" delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
            <button
              onClick={() => reset()}
              className="btn-primary"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Connection
            </button>

            <Link
              href="/"
              className="btn-secondary"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
