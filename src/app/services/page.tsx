"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "../components/AnimateOnScroll";
import { services } from "@/lib/data/services";

const trustItems = [
  { icon: Clock,  label: "< 12h Response",      desc: "Every inquiry gets a personalised reply within 12 business hours from a senior engineer." },
  { icon: Shield, label: "Full NDA Protection", desc: "All submitted project ideas are protected under a strict mutual NDA before any discussion." },
  { icon: Star,   label: "Quality Guaranteed",  desc: "We stand behind every line of code. Unlimited revisions until you are 100% satisfied." },
];

export default function ServicesPage() {
  return (
    <div className="flex-1 w-full">

      {/* ═══ HERO ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-500/8 dark:bg-brand-500/12 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/8 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          <AnimateOnScroll variant="fadeUp">
            <div className="section-label mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              SAMStack Tech
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.08}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-heading leading-[1.05] tracking-tight">
              Engineering Services{" "}
              <span className="text-gradient-brand">Built for Scale</span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.14}>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
              Premium digital systems — from enterprise backends and AI agents to cloud infrastructure.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Link href="/contact" className="btn-primary group text-sm">
                Start a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#services-grid" className="btn-secondary group text-sm">
                View All Services
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══ SERVICES GRID ══════════════════════════════════════════ */}
      <section id="services-grid" className="relative py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-neutral-950 border-y border-slate-100 dark:border-neutral-900">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                What We Engineer
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Each service delivered by a specialist team using battle-tested frameworks.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((svc, i) => (
              <AnimateOnScroll key={svc.id} delay={0.06 * i} variant="fadeUp" className={i === services.length - 1 ? "md:col-span-2" : ""}>
                <Link href={`/services/${svc.slug}`} className="hover-lift group flex flex-col sm:flex-row rounded-2xl border border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 overflow-hidden transition-all duration-300 hover:border-brand-300 dark:hover:border-brand-800 hover:shadow-lg h-full relative">
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 w-[3px] h-full bg-gradient-to-b from-brand-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                  <div className="relative w-full sm:w-48 h-40 sm:auto shrink-0 overflow-hidden bg-slate-100 dark:bg-neutral-900">
                    <Image src={svc.image} alt={svc.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 sm:bg-gradient-to-r sm:from-transparent sm:to-black/30" />
                    <div className="absolute top-3 left-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                        <svc.icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="text-[10px] font-mono font-bold text-white/60">0{i + 1}</span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {svc.title}
                      </h3>
                      <span className="text-[9px] font-mono bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/40 px-2 py-0.5 rounded text-brand-700 dark:text-brand-400 uppercase tracking-widest shrink-0">
                        {svc.subtitle}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {svc.description}
                    </p>

                    <ul className="space-y-1.5 flex-1">
                      {svc.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5">
                      {svc.techStack.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded-full bg-white dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800 text-[9px] font-mono text-slate-500 dark:text-slate-400">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 pt-3 border-t border-slate-100 dark:border-neutral-800">
                      Explore Service
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50/50 dark:bg-black">
        <div className="max-w-5xl mx-auto space-y-10">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Why SAMStack?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Built for businesses that demand elite engineering.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {trustItems.map((item, i) => (
              <AnimateOnScroll key={item.label} delay={0.08 * i} variant="fadeUp">
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/40 border border-slate-100 dark:border-neutral-800 text-center space-y-4 hover-lift">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/40 flex items-center justify-center mx-auto">
                    <item.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">{item.label}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-neutral-950 border-y border-slate-100 dark:border-neutral-900">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="section-label mx-auto"><Zap className="w-3.5 h-3.5" /> How We Work</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Our Delivery Process
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Every project follows a structured, transparent engineering workflow.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: "01", title: "Discovery", desc: "Deep-dive into your requirements, goals, and technical landscape.", icon: Shield },
              { step: "02", title: "Architecture", desc: "System design, tech stack selection, and detailed project roadmap.", icon: Zap },
              { step: "03", title: "Engineering", desc: "Agile sprints with weekly demos and continuous integration.", icon: Clock },
              { step: "04", title: "Deployment", desc: "Production launch, monitoring setup, and ongoing support.", icon: Star },
            ].map((phase, i) => (
              <AnimateOnScroll key={phase.step} delay={0.08 * i} variant="fadeUp">
                <div className="relative p-6 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-500 hover-lift group overflow-hidden">
                  <span className="text-5xl font-black text-slate-100 dark:text-neutral-800 font-mono absolute top-3 right-4 group-hover:text-brand-100 dark:group-hover:text-brand-950/50 transition-colors">{phase.step}</span>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/40 flex items-center justify-center mb-4">
                      <phase.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading mb-2">{phase.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ══════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.10)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              Ready to Build?
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.08}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading leading-tight tracking-tight">
              Let&apos;s Engineer Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-200">
                Extraordinary
              </span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.12}>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Send us your project brief and one of our lead engineers will reach out within 12 hours.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.16}>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-brand-700 font-bold text-xs uppercase tracking-widest shadow-2xl transition-all duration-200 group">
                Contact Our Team
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/portfolio" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 group">
                View Our Work
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-5 border-t border-white/15">
              {["14+ Deployments", "9.9 NPS Score", "NDA Protected", "Free Consultation"].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-white/70 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-cyan-300 shrink-0" />
                  {badge}
                </span>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
