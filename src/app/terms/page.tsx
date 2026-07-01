import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Scale, ArrowRight, Sparkles, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";
import AnimateOnScroll from "../components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Terms of Service | SAMStack Tech",
  description: "Read SAMStack Tech's terms of service governing the use of our website and software engineering services.",
};

export default function TermsPage() {
  const sections = [
    { icon: CheckCircle2, title: "Services Agreement", anchor: "services" },
    { icon: AlertCircle, title: "Liability & Disclaimers", anchor: "liability" },
    { icon: BookOpen, title: "IP Rights", anchor: "ip" },
  ];

  return (
    <div className="flex-1 w-full bg-white dark:bg-black">
      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="z-0 overflow-hidden relative py-24 sm:py-32 flex flex-col items-center justify-center pt-32 sm:pt-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black group">
        <div className="z-10 relative absolute top-1/4 -left-32 w-[350px] h-[350px] bg-brand-600/8 dark:bg-brand-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-[300px] h-[300px] bg-indigo-600/8 dark:bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.07] dark:opacity-[0.05]" />

        <AnimateOnScroll variant="fadeUp">
          <div className="relative z-10 max-w-5xl mx-auto space-y-6">
            <div className="space-y-4">
              <div className="section-label w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                Legal & Compliance
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
                Terms of<br />
                <span className="text-gradient-brand">Service</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
                Clear, straightforward terms governing our relationship with clients and platform users. No hidden clauses.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ═══ MAIN CONTENT WITH SIDEBAR ═══════════════════════════════ */}
      <section className="z-0 overflow-hidden relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-neutral-900 group">
        <div className="z-10 relative max-w-6xl mx-auto flex gap-8 lg:gap-12">

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-32 bg-white dark:bg-neutral-950 rounded-xl p-5 space-y-2 border border-slate-200 dark:border-neutral-800 shadow-sm">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold px-3 mb-3">Quick Links</p>
              {sections.map((section) => (
                <a key={section.anchor} href={`#${section.anchor}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all group"
                >
                  <section.icon className="z-0 overflow-hidden relative w-4 h-4 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-semibold">{section.title}</span>
                </a>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="max-w-3xl space-y-12">

              {/* Header */}
              <AnimateOnScroll variant="fadeInScale">
                <div className="space-y-4 border-b border-slate-200 dark:border-neutral-800 pb-10">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">Terms of Service</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Last updated: June 2025 — Effective immediately</p>
                </div>
              </AnimateOnScroll>

              {/* Sections */}
              <AnimateOnScroll variant="fadeUp" delay={0.05}>
                <section id="services" className="z-0 overflow-hidden relative space-y-5 scroll-mt-20 group">
        <div className="z-10 relative flex items-center gap-3">
                    <div className="w-2 h-2 bg-brand-600 dark:bg-brand-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">1. Acceptance of Terms</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    By accessing or using the SAMStack Tech website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>
                </section>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.1}>
                <section className="z-0 overflow-hidden relative space-y-5 scroll-mt-20 group">
        <div className="z-10 relative flex items-center gap-3">
                    <div className="w-2 h-2 bg-brand-600 dark:bg-brand-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">2. Our Services</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    SAMStack Tech provides custom software engineering, SaaS development, DevOps consulting, AI integrations, and related digital services. All services are delivered pursuant to a separate, signed service agreement or statement of work (SOW). These terms apply to all services unless explicitly superseded by a signed agreement.
                  </p>
                </section>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.15}>
                <section id="ip" className="z-0 overflow-hidden relative space-y-5 scroll-mt-20 group">
        <div className="z-10 relative flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">3. Intellectual Property Rights</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      All content on this website — including text, graphics, logos, images, and code — is the property of SAMStack Tech and protected by applicable copyright laws.
                    </p>
                    <div className="space-y-4">
                      {[
                        { title: "Website Content", desc: "You may not reproduce, distribute, or transmit any content from our website without written permission." },
                        { title: "Client Deliverables", desc: "For client engagements, deliverables are governed by the signed project agreement. Typically, clients receive full ownership of custom code and deliverables." },
                        { title: "Pre-Existing IP", desc: "We retain ownership of any tools, frameworks, libraries, or methodologies developed prior to or independent of your project." },
                      ].map((item, i) => (
                        <div key={i} className="hover-lift p-5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm hover:shadow-md">
                          <h4 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.2}>
                <section id="liability" className="z-0 overflow-hidden relative space-y-5 scroll-mt-20 group">
        <div className="z-10 relative flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">4. Limitations of Liability</h3>
                  </div>
                  <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAMStack TECH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, REVENUE, DATA, OR USE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                    </p>
                  </div>
                </section>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.25}>
                <section className="z-0 overflow-hidden relative space-y-5 scroll-mt-20 group">
        <div className="z-10 relative flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">5. Disclaimers</h3>
                  </div>
                  <ul className="space-y-3 ml-4">
                    {[
                      "Website and services are provided \"as-is\" without warranties of any kind.",
                      "We do not guarantee uninterrupted service or error-free operation.",
                      "Third-party integrations (APIs, libraries) are beyond our direct control.",
                      "Client is responsible for backup, security, and compliance with applicable laws.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.3}>
                <section className="z-0 overflow-hidden relative space-y-5 group">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">6. Payment & Billing</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    All invoices are due within 30 days of issuance unless otherwise stated in the SOW. Overdue payments may incur interest at 1.5% per month or the maximum rate allowed by law, whichever is less.
                  </p>
                </section>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.35}>
                <section className="z-0 overflow-hidden relative space-y-5 group">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">7. Termination</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Either party may terminate an engagement with written notice as specified in the SOW. Upon termination, client must pay all fees incurred through the termination date.
                  </p>
                </section>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.4}>
                <section className="z-0 overflow-hidden relative space-y-5 group">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">8. Governing Law</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    These terms are governed by the laws of the jurisdiction in which SAMStack Tech is registered, without regard to its conflict of law provisions.
                  </p>
                </section>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.45}>
                <section className="z-0 overflow-hidden relative space-y-5 group">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">9. Contact for Disputes</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    If you have questions or disputes regarding these terms, please contact:
                  </p>
                  <div className="bg-white dark:bg-neutral-950 rounded-xl p-5 border border-slate-200 dark:border-neutral-800 shadow-sm">
                    <p className="font-mono text-sm text-slate-900 dark:text-slate-100">legal@samstack.tech</p>
                  </div>
                </section>
              </AnimateOnScroll>

              {/* CTA */}
              <AnimateOnScroll variant="fadeInScale" delay={0.3}>
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-neutral-800">
                  <div className="bg-gradient-to-r from-brand-50 dark:from-brand-950/20 to-indigo-50 dark:to-indigo-950/20 rounded-2xl p-6 sm:p-8 border border-brand-200/50 dark:border-brand-800/30">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">Ready to Work Together?</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Let's discuss your project and clarify any terms.</p>
                      </div>
                      <Link href="/contact" className="btn-primary whitespace-nowrap text-xs sm:text-sm">
                        Start a Project <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
