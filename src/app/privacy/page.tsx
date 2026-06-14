import Link from "next/link";
import type { Metadata } from "next";
import { Shield, ArrowRight, Sparkles, Lock, Eye, CheckCircle2 } from "lucide-react";
import AnimateOnScroll from "../components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Privacy Policy | SAMStack Tech",
  description: "Read SAMStack Tech's privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  const sections = [
    { icon: Eye, title: "Information Collection", anchor: "collection" },
    { icon: Lock, title: "Data Protection", anchor: "protection" },
    { icon: CheckCircle2, title: "Your Rights", anchor: "rights" },
  ];

  return (
    <div className="flex-1 w-full bg-white dark:bg-black">
      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 flex flex-col items-center justify-center pt-32 sm:pt-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black">
        <div className="absolute top-1/4 -left-32 w-[350px] h-[350px] bg-brand-600/8 dark:bg-brand-600/8 rounded-full blur-[120px]" />
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
                Your Privacy,<br />
                <span className="text-gradient-brand">Our Responsibility</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
                At SAMStack Tech, we take your privacy seriously. Transparency, security, and user control are core to everything we build.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-sm font-mono text-slate-600 dark:text-slate-400">
                <Shield className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Enterprise-Grade Security
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-sm font-mono text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                GDPR & Privacy Compliant
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ═══ MAIN CONTENT WITH SIDEBAR ═══════════════════════════════ */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-neutral-900">
        <div className="max-w-6xl mx-auto flex gap-8 lg:gap-12">

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-32 bg-white dark:bg-neutral-950 rounded-xl p-5 space-y-2 border border-slate-200 dark:border-neutral-800 shadow-sm">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold px-3 mb-3">Quick Links</p>
              {sections.map((section) => (
                <a key={section.anchor} href={`#${section.anchor}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all group"
                >
                  <section.icon className="w-4 h-4 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform" />
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
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">Privacy Policy</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Last updated: June 2025 — Effective immediately</p>
                </div>
              </AnimateOnScroll>

              {/* Section 1 */}
              <AnimateOnScroll variant="fadeUp" delay={0.05}>
                <section id="collection" className="space-y-5 scroll-mt-20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-brand-600 dark:bg-brand-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">1. Information We Collect</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">We collect information that you voluntarily provide to us, including when you:</p>
                  <ul className="space-y-3 ml-4">
                    {[
                      "Submit a project inquiry or contact form",
                      "Apply for an internship position",
                      "Request a certificate verification",
                      "Subscribe to updates or newsletters",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    This may include your name, email address, company name, phone number, and any details about your project requirements.
                  </p>
                </section>
              </AnimateOnScroll>

              {/* Section 2 */}
              <AnimateOnScroll variant="fadeUp" delay={0.1}>
                <section id="protection" className="space-y-5 scroll-mt-20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">2. How We Protect Your Data</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Encryption", desc: "All data in transit and at rest is encrypted using industry-standard TLS 1.3+ protocols." },
                      { title: "Access Controls", desc: "Strict role-based access controls limit data exposure to authorized personnel only." },
                      { title: "Regular Audits", desc: "We conduct routine security audits and penetration testing to identify and fix vulnerabilities." },
                    ].map((item, i) => (
                      <div key={i} className="hover-lift p-5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm hover:shadow-md">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </AnimateOnScroll>

              {/* Section 3 */}
              <AnimateOnScroll variant="fadeUp" delay={0.15}>
                <section id="rights" className="space-y-5 scroll-mt-20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">3. Your Rights</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Under GDPR and other privacy regulations, you have the right to:
                  </p>
                  <ul className="space-y-3 ml-4">
                    {[
                      "Access your personal data",
                      "Request corrections to inaccurate information",
                      "Request deletion of your data",
                      "Withdraw consent at any time",
                      "Data portability in standard formats",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                        <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </AnimateOnScroll>

              {/* Section 4 */}
              <AnimateOnScroll variant="fadeUp" delay={0.2}>
                <section className="space-y-5">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">4. Third-Party Services</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    We use trusted third-party services for email delivery (Resend), database hosting (Firebase), and analytics. All third parties are bound by strict data protection agreements.
                  </p>
                </section>
              </AnimateOnScroll>

              {/* Section 5 */}
              <AnimateOnScroll variant="fadeUp" delay={0.25}>
                <section className="space-y-5">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">5. Contact Us</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    If you have questions about this privacy policy or your data, please contact us at:
                  </p>
                  <div className="bg-white dark:bg-neutral-950 rounded-xl p-5 border border-slate-200 dark:border-neutral-800 shadow-sm">
                    <p className="font-mono text-sm text-slate-900 dark:text-slate-100">privacy@samstack.tech</p>
                  </div>
                </section>
              </AnimateOnScroll>

              {/* CTA */}
              <AnimateOnScroll variant="fadeInScale" delay={0.2}>
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-neutral-800">
                  <div className="bg-gradient-to-r from-brand-50 dark:from-brand-950/20 to-indigo-50 dark:to-indigo-950/20 rounded-2xl p-6 sm:p-8 border border-brand-200/50 dark:border-brand-800/30">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">Have More Questions?</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Our privacy team is ready to help clarify any concerns.</p>
                      </div>
                      <Link href="/contact" className="btn-primary whitespace-nowrap text-xs sm:text-sm">
                        Contact Us <ArrowRight className="w-4 h-4" />
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
