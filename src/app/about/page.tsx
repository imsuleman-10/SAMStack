"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Users,
  Target,
  Award,
  Bot,
  ServerCog,
  TrendingUp,
  Star,
  Layers,
  Heart,
  Rocket,
  Eye,
} from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "../components/AnimateOnScroll";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

const values = [
  { icon: Zap,    title: "Performance First",    desc: "Every system is engineered for speed, scalability, and efficiency from the ground up.", color: "from-brand-500 to-indigo-600", bg: "bg-brand-50 dark:bg-brand-950/20" },
  { icon: Shield, title: "Security by Design",   desc: "Enterprise-grade security, encryption, and compliance built into every solution.", color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  { icon: Target, title: "Precision Execution",  desc: "Clear scoping, transparent communication, and on-time delivery — always.", color: "from-violet-500 to-purple-600", bg: "bg-violet-50 dark:bg-violet-950/20" },
  { icon: Globe,  title: "Global Standards",     desc: "Built to international accessibility, performance, and design standards.", color: "from-amber-500 to-orange-600", bg: "bg-amber-50 dark:bg-amber-950/20" },
];

const milestones = [
  { year: "2025", event: "SAMStack Tech founded by Suleman Zaheer in Lahore, Pakistan.", icon: Rocket },
  { year: "2026", event: "Delivered first enterprise SaaS platform and launched structured internship program.", icon: TrendingUp },
  { year: "2026", event: "Expanded into Agentic AI and advanced DevOps & Cloud Orchestration.", icon: Bot },
];

const team = [
  {
    name: "Suleman Zaheer", role: "Founder & Lead Architect",
    bio: "Full-stack architect with deep expertise in cloud-native systems, AI automation, and technical strategy.",
    image: "/founder.png", badge: "Vision & Architecture", badgeColor: "bg-brand-600",
    skills: ["Next.js", "DevOps", "AI Agents", "System Design"],
    linkedin: "https://www.linkedin.com/in/suleman-zaheer-mughal",
    github: "https://github.com/imsuleman-10",
  },
  {
    name: "Saqib Javed", role: "Frontend Engineer",
    bio: "Specialist in crafting immersive, high-performance user interfaces with refined aesthetics and smooth interactions.",
    image: "/team-1.png", badge: "UI/UX Systems", badgeColor: "bg-emerald-600",
    skills: ["React", "Tailwind", "Framer Motion", "Figma"],
    linkedin: "", github: "",
  },
  {
    name: "Syed Abdullah", role: "Backend Engineer",
    bio: "Expert in building scalable, secure, and maintainable backend architectures and APIs.",
    image: "/team-3.png", badge: "Backend & Data", badgeColor: "bg-violet-600",
    skills: ["Node.js", "PostgreSQL", "GraphQL", "Firebase"],
    linkedin: "", github: "",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full overflow-x-hidden">

      {/* ═══ HERO ═══════════════════════════════════════════════════ */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 overflow-hidden">
        {/* Refined background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-brand-500/8 dark:bg-brand-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/8 dark:bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#7c3aed_0.5px,transparent_1px)] dark:bg-[radial-gradient(#a78bfa_0.5px,transparent_1px)] bg-[length:48px_48px] opacity-[0.07] dark:opacity-[0.05]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimateOnScroll variant="fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 dark:border-brand-400/15 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm text-[11px] font-mono uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Established 2025 &bull; Lahore, Pakistan
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <h1 className="mt-7 text-[clamp(42px,7vw,82px)] font-black font-heading leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white">
              Engineering the{" "}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">Extraordinary</span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <p className="mt-5 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A premium software studio crafting enterprise-grade digital products, 
              intelligent systems, and future-ready infrastructure.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.3}>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="btn-primary px-8 py-3.5 text-sm">
                Start a Project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#values" className="btn-secondary px-8 py-3.5 text-sm">
                Our Values
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══ MISSION & STATS ═══════════════════════════════════════ */}
      <section id="mission" className="relative py-20 sm:py-28 bg-white dark:bg-neutral-950 border-y border-slate-100 dark:border-neutral-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-14 items-center">
            <div className="lg:col-span-6">
              <AnimateOnScroll variant="fadeUp">
                <div className="section-label mb-5"><Target className="w-3.5 h-3.5" /> Our Mission</div>
                <blockquote className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-heading leading-[1.15] tracking-tight text-slate-900 dark:text-white">
                  Democratizing elite engineering for ambitious builders worldwide.
                </blockquote>
                <p className="mt-6 text-base text-slate-500 dark:text-slate-400 flex items-center gap-3">
                  <span className="w-8 h-px bg-brand-500" />
                  Suleman Zaheer, Founder
                </p>
              </AnimateOnScroll>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {[
                { value: "14+", label: "Enterprise Projects", icon: Layers },
                { value: "9.9", label: "Avg. Client NPS", icon: Star },
                { value: "50+", label: "Interns Mentored", icon: Users },
                { value: "100%", label: "On-Time Delivery", icon: Award },
              ].map((stat, i) => (
                <AnimateOnScroll key={i} variant="fadeUp" delay={0.08 * i}>
                  <div className="group p-6 rounded-2xl border border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-500 hover-lift">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <stat.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading">{stat.value}</p>
                    <p className="mt-1.5 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CORE VALUES ═══════════════════════════════════════════ */}
      <section id="values" className="py-20 sm:py-28 bg-slate-50/50 dark:bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center mb-14">
              <div className="section-label mx-auto"><Shield className="w-3.5 h-3.5" /> What We Believe</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-4 tracking-tight">Core Values</h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-lg mx-auto">The principles that guide every line of code we write and every system we architect.</p>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-5">
            {values.map((value, i) => (
              <AnimateOnScroll key={i} variant="fadeInScale" delay={0.08 * i}>
                <div className="group p-7 rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-500 hover-lift">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-brand-500/10`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-heading">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{value.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TEAM ══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <AnimateOnScroll variant="fadeUp">
              <div className="section-label mx-auto"><Users className="w-3.5 h-3.5" /> The Team</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-4 tracking-tight">Built by Specialists</h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md mx-auto">Senior engineers only. No juniors. No compromise.</p>
            </AnimateOnScroll>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <AnimateOnScroll key={i} variant="fadeUp" delay={0.1 * i}>
                <div className="group relative rounded-2xl overflow-hidden h-full border border-slate-100 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-500 hover-lift bg-white dark:bg-neutral-900/40">
                  <div className="relative h-72">
                    <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full text-white ${member.badgeColor} shadow-lg`}>{member.badge}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-brand-300 text-sm font-medium">{member.role}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{member.bio}</p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {member.skills.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-neutral-800">
                      {member.github && (
                        <a href={member.github} target="_blank" className="p-2 rounded-lg bg-slate-100 dark:bg-neutral-800 hover:text-brand-500 transition-colors">
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" className="p-2 rounded-lg bg-slate-100 dark:bg-neutral-800 hover:text-blue-500 transition-colors">
                          <LinkedinIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ JOURNEY / TIMELINE ════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-slate-50/50 dark:bg-black border-y border-slate-100 dark:border-neutral-900">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center mb-14">
              <div className="section-label mx-auto"><TrendingUp className="w-3.5 h-3.5" /> Our Journey</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-4 tracking-tight">Milestones</h2>
            </div>
          </AnimateOnScroll>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500 via-violet-500 to-transparent dark:from-brand-400 dark:via-violet-400" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <AnimateOnScroll key={i} variant="fadeUp" delay={0.1 * i}>
                  <div className="flex gap-6 items-start">
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border-2 border-brand-300 dark:border-brand-600 flex items-center justify-center shrink-0 shadow-md">
                      <m.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="pt-1">
                      <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">{m.year}</span>
                      <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.1)_0%,transparent_60%)]" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <AnimateOnScroll variant="fadeUp">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-tight text-white tracking-tight">
              Ready to build<br />something legendary?
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <p className="mt-5 text-slate-400 text-base sm:text-lg max-w-lg mx-auto">Let&apos;s turn your vision into a scalable, production-grade reality.</p>
          </AnimateOnScroll>
          <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary !bg-white !text-slate-900 hover:!bg-slate-100 text-sm px-8 py-4">
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-xl text-sm font-medium transition-all">
              View Portfolio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
