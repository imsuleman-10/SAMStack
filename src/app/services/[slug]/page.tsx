import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/data/services";
import { ArrowLeft, CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Clock } from "lucide-react";
import AnimateOnScroll from "../../components/AnimateOnScroll";

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | SAMStack Tech`,
    description: service.description,
  };
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;
  const relatedServices = services.filter((s) => s.id !== service.id);

  return (
    <div className="flex-1 w-full bg-white dark:bg-black">

      {/* ═══ HERO ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden h-[100dvh]">
        <div className="absolute inset-0">
          <Image src={service.image} alt={service.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Back button — top left */}
        <div className="absolute top-6 left-5 sm:top-8 sm:left-8 z-20">
          <AnimateOnScroll variant="fadeLeft">
            <Link href="/services" className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 px-4 py-2 rounded-xl transition-all duration-200 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              All Services
            </Link>
          </AnimateOnScroll>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pb-16 sm:pb-20">
            <AnimateOnScroll variant="fadeUp" delay={0.05}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-mono bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white/80 uppercase tracking-widest">
                  {service.subtitle}
                </span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading leading-[1.1] tracking-tight max-w-3xl">
                {service.title}
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.15}>
              <p className="text-sm sm:text-base lg:text-lg text-slate-300/90 max-w-2xl leading-relaxed">
                {service.description}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.2}>
              <div className="pt-2">
                <Link href={`/contact?service=${service.id}`} className="btn-primary inline-flex group text-sm">
                  Start a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══ CONTENT ════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 px-5 sm:px-8">
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-32 w-[300px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* ── Main Content ── */}
          <div className="lg:col-span-8 space-y-12">
            <AnimateOnScroll variant="fadeUp">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight mb-6">
                  Core Capabilities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, i) => (
                    <AnimateOnScroll key={feature} delay={0.05 * i} variant="fadeInScale">
                      <div className="hover-lift flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/40 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium pt-1">{feature}</span>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="reveal">
              <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950/30 dark:to-indigo-950/30 border border-brand-200/50 dark:border-brand-900/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-[80px]" />
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading mb-3">Why partner with SAMStack?</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-sm sm:text-base max-w-2xl">
                    Our approach to {service.title.toLowerCase()} goes beyond simply writing code. We architect systems designed for the future—prioritizing scalability, zero-downtime, and elite performance from day one. Every project is handled exclusively by senior specialists.
                  </p>
                  <Link href={`/contact?service=${service.id}`} className="btn-primary inline-flex group text-sm">
                    Start a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-8 lg:self-start">
            <AnimateOnScroll variant="fadeRight">
              <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-900 dark:text-white font-heading uppercase tracking-widest mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {service.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeRight" delay={0.08}>
              <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-900 dark:text-white font-heading uppercase tracking-widest mb-2">Need Guidance?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">Book a discovery call with our architects.</p>
                <Link href="/contact" className="btn-secondary w-full text-xs justify-center group">
                  Consult an Engineer <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeRight" delay={0.12}>
              <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm space-y-3">
                {[
                  { icon: Clock, label: "< 12h Response" },
                  { icon: Shield, label: "NDA Protected" },
                  { icon: Zap, label: "Fast Turnaround" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/40 flex items-center justify-center shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

        </div>
      </section>

      {/* ═══ RELATED SERVICES ═══════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 px-5 sm:px-8 bg-slate-50 dark:bg-black">
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-brand-600/10 dark:bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-[300px] h-[300px] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-10">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="flex justify-center">
                <div className="section-label"><Sparkles className="w-3.5 h-3.5" />Explore More</div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Other Services
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
                Discover our full range of engineering capabilities designed for scale.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedServices.map((rsvc, i) => (
              <AnimateOnScroll key={rsvc.id} delay={0.06 * i} variant="fadeInScale">
                <Link href={`/services/${rsvc.slug}`} className="hover-lift block h-full rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden group">
                  <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-slate-100 dark:bg-neutral-900">
                    <Image src={rsvc.image} alt={rsvc.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <rsvc.icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">{rsvc.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{rsvc.description}</p>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="text-center">
              <Link href="/contact" className="btn-primary group text-sm inline-flex">
                Discuss Your Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading leading-tight tracking-tight">
              Let&apos;s Engineer{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-200">
                Your Next System
              </span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.12}>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Send us your project brief and one of our lead engineers will reach out with an architectural consultation within 12 hours.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.16}>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-white hover:bg-slate-50 text-brand-700 font-bold text-xs uppercase tracking-widest shadow-2xl transition-all duration-200 group">
                Contact Our Team
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 group">
                All Services
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
