"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert, Terminal, Sparkles, ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid operator credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] pb-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <AnimateOnScroll variant="fadeUp">
          <div className="text-center space-y-3">
            <span className="section-label mx-auto">
              <Lock className="w-3.5 h-3.5" />
              Restricted Operator Console
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              System <span className="text-gradient-brand">Administrator</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              Provide system cryptokey credentials to gain administrative permissions.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fadeUp" delay={0.1}>
          <div className="glass-card rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-500 via-indigo-500 to-brand-400" />

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 dark:border-rose-500/30 flex items-start gap-3 text-rose-700 dark:text-rose-200 text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Access Blocked:</span> {error}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  Operator Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@samstack.tech"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white/70 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 placeholder-slate-400 transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  Authorization Key
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white/70 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 placeholder-slate-400 transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3.5 text-xs disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Authenticate operator
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-200 dark:border-white/5 pt-4">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-brand-500" />
                Secure SSL TLS 1.3
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                SAMStack Core
              </span>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fadeUp" delay={0.2}>
          <div className="text-center p-4 rounded-xl glass-card border border-brand-500/15 text-[11px] font-mono text-brand-700 dark:text-brand-300 max-w-sm mx-auto">
            <p className="font-bold mb-1.5 uppercase tracking-wider">🔒 Admin Operator Credentials:</p>
            <p className="mb-0.5">Email: <code className="text-brand-900 dark:text-white bg-brand-100 dark:bg-black/40 px-1.5 py-0.5 rounded-md font-bold">samstacktechs@gmail.com</code></p>
            <p>Pass: <code className="text-brand-900 dark:text-white bg-brand-100 dark:bg-black/40 px-1.5 py-0.5 rounded-md font-bold">Salman123@</code></p>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
