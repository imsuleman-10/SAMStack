"use client";
import React, { useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  User,
  Mail,
  Building,
  DollarSign,
  Cpu,
  MessageSquare,
  Zap,
  Shield,
  CheckCircle2,
  Code2,
  Users,
  Award,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "../components/AnimateOnScroll";
import { toast } from "sonner";

const SERVICE_LABELS: Record<string, string> = {
  CUSTOM_SOFTWARE: "Custom Enterprise Software",
  SERVERLESS_WEB: "Web & Serverless Apps",
  AGENTIC_AI: "Agentic AI & Integrations",
  DEVOPS_CLOUD: "DevOps & Cloud Architectures",
  MOBILE_APPS: "Mobile App Development",
  UI_UX_DESIGN: "UI/UX Design Systems",
  DATA_ANALYTICS: "Data Analytics & BI",
};

function ContactForm() {
  const searchParams = useSearchParams();
  const preSelectedService = searchParams.get("service") || "CUSTOM_SOFTWARE";

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [serviceType, setServiceType] = useState(preSelectedService);
  const [budget, setBudget] = useState("$5,000 - $10,000");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (message.trim().length < 30) {
      toast.error("Message Too Short", {
        description: "Please describe your project in at least 30 characters.",
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/services/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail,
          organization,
          serviceType,
          budget,
          message,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit request.");

      toast.success("Inquiry Transmitted!", {
        description:
          "Your project inquiry has been successfully transmitted. We will contact you within 12 hours.",
        duration: 6000,
      });

      setClientName("");
      setClientEmail("");
      setOrganization("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("Transmission Failed", { description: msg, duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 text-sm rounded-xl bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-700/70 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-300 hover:border-slate-300 dark:hover:border-neutral-600";

  return (
    <div className="w-full overflow-x-hidden">

      {/* ═══ HERO ═══════════════════════════════════════════════════ */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black" />
        <div className="absolute top-0 left-1/3 w-[700px] h-[500px] bg-brand-500/8 dark:bg-brand-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/8 dark:bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#7c3aed_0.5px,transparent_1px)] dark:bg-[radial-gradient(#a78bfa_0.5px,transparent_1px)] bg-[length:48px_48px] opacity-[0.07] dark:opacity-[0.05]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full">
          <AnimateOnScroll variant="fadeIn" className="mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/20 dark:border-emerald-400/15 bg-emerald-50/80 dark:bg-emerald-950/30 backdrop-blur-sm text-emerald-700 dark:text-emerald-400 text-[11px] font-mono uppercase tracking-[0.15em] shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Accepting New Projects
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <h1 className="font-heading text-[clamp(42px,7vw,82px)] font-black leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white mb-5">
              We Engineer{" "}
              <span className="bg-gradient-to-r from-brand-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
                What Matters
              </span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Bespoke software solutions for ambitious enterprises. 
              From vision to scalable reality — delivered with precision and speed.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.3}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary px-8 py-3.5 text-sm cursor-pointer"
              >
                Start a Conversation <ArrowRight className="w-4 h-4" />
              </button>
              <Link href="#services-preview" className="btn-secondary px-8 py-3.5 text-sm">
                Our Expertise
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══ SERVICES TEASER ═══════════════════════════════════════ */}
      <section id="services-preview" className="py-20 sm:py-24 bg-white dark:bg-neutral-950 border-y border-slate-100 dark:border-neutral-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-14 items-start">
            <div className="lg:w-5/12">
              <AnimateOnScroll variant="fadeRight">
                <div className="section-label mb-4"><Cpu className="w-3.5 h-3.5" /> Our Expertise</div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-slate-900 dark:text-white">
                  Domains We Master
                </h2>
                <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  From enterprise backends to AI agents, we engineer systems that scale.
                </p>
              </AnimateOnScroll>
            </div>

            <div className="lg:w-7/12 grid md:grid-cols-2 gap-4">
              {Object.entries(SERVICE_LABELS).map(([key, label], index) => (
                <AnimateOnScroll key={key} variant="fadeUp" delay={index * 0.05} className="group">
                  <Link
                    href={`/services?service=${key}`}
                    className="block p-6 bg-slate-50/80 dark:bg-neutral-900/40 rounded-2xl border border-slate-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-800 hover:-translate-y-0.5 transition-all duration-500 h-full"
                  >
                    <div className="text-brand-500 mb-4">
                      <Cpu className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors font-heading">
                      {label}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      Enterprise-ready solutions tailored for performance and longevity.
                    </p>
                    <div className="mt-5 text-xs flex items-center gap-2 text-brand-500 group-hover:gap-3 transition-all font-bold uppercase tracking-widest">
                      Learn More <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT FORM ══════════════════════════════════════════ */}
      <section ref={formRef} className="relative py-20 sm:py-28 bg-slate-50/50 dark:bg-black">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-28">
            <AnimateOnScroll variant="fadeLeft">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium mb-5">
                  <Clock className="w-3.5 h-3.5" /> Response in &lt;12 Hours
                </div>
                <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
                  Start Your<br />Project Today
                </h2>
                <p className="mt-5 text-base text-slate-500 dark:text-slate-400 max-w-md">
                  Every inquiry is reviewed personally by our founder and lead architect.
                </p>
              </div>
            </AnimateOnScroll>

            <div className="space-y-6">
              {[
                { icon: Shield, title: "NDA Signed by Default", desc: "Your IP and ideas are protected from the first message." },
                { icon: Users, title: "Senior Team Only", desc: "No juniors. Only 8+ years experienced architects." },
                { icon: Award, title: "Fixed or Milestone Pricing", desc: "Transparent budgets with clear deliverables." },
              ].map((item, i) => (
                <AnimateOnScroll key={i} variant="fadeUp" delay={0.08 * i}>
                  <div className="flex gap-5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/10 to-violet-500/10 flex items-center justify-center flex-shrink-0 border border-brand-200/30 dark:border-brand-800/20">
                      <item.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <AnimateOnScroll variant="fadeInScale" className="relative">
              <div className="bg-white dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/30 rounded-2xl p-8 lg:p-12">
                <div className="h-1 w-20 bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full mb-8" />

                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium tracking-widest text-slate-500 dark:text-neutral-400 uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Alex Rivera"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium tracking-widest text-slate-500 dark:text-neutral-400 uppercase">Work Email</label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="you@company.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium tracking-widest text-slate-500 dark:text-neutral-400 uppercase">Organization</label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Acme Corp"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium tracking-widest text-slate-500 dark:text-neutral-400 uppercase">Budget Range</label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className={inputClass}
                      >
                        <option value="<$5,000">Under $5,000</option>
                        <option value="$5,000 - $10,000">$5K – $10K</option>
                        <option value="$10,000 - $25,000">$10K – $25K</option>
                        <option value="$25,000 - $50,000">$25K – $50K</option>
                        <option value="$50,000+">$50K+</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium tracking-widest text-slate-500 dark:text-neutral-400 uppercase">Service Type</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className={inputClass}
                    >
                      {Object.entries(SERVICE_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium tracking-widest text-slate-500 dark:text-neutral-400 uppercase">Project Brief</label>
                    <textarea
                      required
                      minLength={30}
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your goals, timeline, current challenges, and what success looks like..."
                      className={`${inputClass} resize-y min-h-[130px]`}
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span className={message.length > 0 && message.length < 30 ? "text-rose-500" : ""}>
                        {message.length > 0 && message.length < 30 ? `${30 - message.length} chars needed` : ""}
                      </span>
                      <span>{message.length}/800</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-700 hover:to-violet-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2.5 text-sm tracking-wide transition-all duration-300 active:scale-[0.985] shadow-lg shadow-brand-500/20"
                  >
                    {isSubmitting ? (
                      <>Transmitting Secure Brief...</>
                    ) : (
                      <>
                        Send Project Brief
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400 dark:text-neutral-500 flex items-center justify-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> End-to-end encrypted &bull; NDA by default
                  </p>
                </form>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.1)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <AnimateOnScroll variant="fadeIn">
            <div className="text-brand-400 text-xs tracking-[0.25em] uppercase mb-5 font-mono">Ready to Begin?</div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-white font-heading">
              Let&apos;s architect<br />something legendary.
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-slate-900 rounded-xl font-medium hover:bg-slate-100 transition-colors text-sm cursor-pointer"
              >
                Start Conversation
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/5 text-white rounded-xl transition-colors text-sm font-medium">
                Explore Our Work <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading experience...</div>}>
      <ContactForm />
    </Suspense>
  );
}
