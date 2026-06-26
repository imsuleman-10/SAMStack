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
  TrendingUp,
  Rocket,
  Layers,
  Star,
  Bot,
} from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "../components/AnimateOnScroll";

const values = [
  {
    icon: Zap,
    title: "Performance First",
    desc: "Optimization at every layer. We build systems designed to scale gracefully under extreme loads without compromising response times.",
    iconBg: "from-blue-500/20 to-blue-600/20",
    iconBorder: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: Shield,
    title: "Security by Design",
    desc: "Zero-trust architecture implemented from day one. Enterprise-grade security is a foundational requirement, never an afterthought.",
    iconBg: "from-emerald-500/20 to-emerald-600/20",
    iconBorder: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    icon: Target,
    title: "Precision Execution",
    desc: "Surgical deployment methodologies. We utilize advanced CI/CD pipelines to ensure flawless, continuous delivery of complex features.",
    iconBg: "from-violet-500/20 to-violet-600/20",
    iconBorder: "border-violet-500/30",
    iconColor: "text-violet-400",
  },
  {
    icon: Globe,
    title: "Global Standards",
    desc: "Adhering strictly to international best practices. Our codebases are designed to be universally understood by elite engineering teams worldwide.",
    iconBg: "from-amber-500/20 to-amber-600/20",
    iconBorder: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
];

const milestones = [
  {
    year: "2025",
    title: "Foundation Established",
    event: "SAMStack Tech incorporated in Lahore. Initial team assembled focusing on bespoke enterprise architecture.",
    icon: Rocket,
    color: "border-brand-500",
    labelColor: "text-brand-500",
  },
  {
    year: "EARLY 2026",
    title: "SaaS & Mentorship",
    event: "Delivered first enterprise SaaS platform and launched the structured elite internship protocol.",
    icon: TrendingUp,
    color: "border-indigo-500",
    labelColor: "text-indigo-400",
  },
  {
    year: "LATE 2026",
    title: "Agentic AI & Next-Gen DevOps",
    event: "Integration of autonomous agentic AI workflows into core DevOps pipelines for unprecedented deployment velocity.",
    icon: Bot,
    color: "border-violet-500",
    labelColor: "text-violet-400",
  },
];

const stats = [
  { value: "14+", label: "Enterprise Projects", icon: Layers },
  { value: "9.9", label: "Avg NPS Score", icon: Star },
  { value: "50+", label: "Interns Mentored", icon: Users },
  { value: "100%", label: "On-Time Delivery", icon: Award },
];

const team = [
  {
    name: "Suleman Zaheer",
    role: "System Architecture & AI",
    image: "/founder.png",
    badge: "Founder & Lead",
    badgeBg: "bg-blue-500/20 border-blue-500/30",
    badgeText: "text-blue-400",
    skills: ["Next.js", "DevOps", "AI Agents", "System Design"],
    phone: "+923285778715",
    whatsapp: "https://wa.me/923285778715",
    email: "samstacktechs@gmail.com",
    linkedin: "https://www.linkedin.com/in/suleman-zaheer-mughal",
    github: "https://github.com/imsuleman-10",
    bio: "Founder of SAMStack Tech. Full Stack Engineer & DevOps Lead specializing in cloud-native systems, CI/CD pipelines, and AI-powered applications. Based in Lahore, Pakistan.",
  },
  {
    name: "Saqib Javed",
    role: "UI/UX & Client Logic",
    image: "/team-1.png",
    badge: "Frontend Engineering",
    badgeBg: "bg-emerald-500/20 border-emerald-500/30",
    badgeText: "text-emerald-400",
    skills: ["React", "TypeScript", "Framer Motion", "Figma"],
    phone: null,
    whatsapp: null,
    email: null,
    linkedin: null,
    github: null,
    bio: null,
  },
  {
    name: "Syed Abdullah",
    role: "Database & APIs",
    image: "/team-3.png",
    badge: "Backend Engineering",
    badgeBg: "bg-violet-500/20 border-violet-500/30",
    badgeText: "text-violet-400",
    skills: ["Node.js", "PostgreSQL", "GraphQL", "Firebase"],
    phone: null,
    whatsapp: null,
    email: null,
    linkedin: null,
    github: null,
    bio: null,
  },
];

export default function AboutPage() {
  return (
    <div className="w-full overflow-x-hidden bg-zinc-950 text-zinc-50">

      {/* ═══ 01 · HERO ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 pt-32 pb-24 overflow-hidden dot-bg">
        {/* Top-center radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <AnimateOnScroll variant="fadeIn">
            <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-300">
                Established 2025 &bull; Lahore, Pakistan
              </span>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <h1 className="font-heading font-black text-6xl md:text-8xl tracking-[-0.04em] leading-[1.05] mb-6">
              Engineering the{" "}
              <span className="text-gradient-industrial">Extraordinary</span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl mb-12 leading-relaxed">
              A premium software engineering studio crafting enterprise-grade digital products,
              intelligent systems, and future-ready infrastructure.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 brand-gradient rounded-xl font-heading font-bold text-white tracking-wide hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
              >
                Start a Project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#values"
                className="px-8 py-4 bg-transparent border border-zinc-700 rounded-xl font-heading font-bold text-white tracking-wide hover:bg-zinc-800/50 transition-all duration-300"
              >
                Our Values
              </Link>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Section label */}
        <div className="absolute bottom-10 left-10 section-number">01 // Hero</div>
      </section>

      {/* ═══ 02 · MISSION & STATS ═══════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-zinc-800 relative bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <AnimateOnScroll variant="fadeUp">
            <div className="relative">
              <div className="text-8xl font-black text-zinc-800 absolute -top-10 -left-4 opacity-50 select-none leading-none">&ldquo;</div>
              <blockquote className="relative z-10 font-heading font-black text-4xl md:text-5xl tracking-tight leading-tight mb-8">
                Democratizing elite engineering for ambitious builders worldwide.
              </blockquote>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-1 brand-gradient rounded-full" />
                  <span className="font-mono text-sm uppercase tracking-wider text-zinc-400">
                    Suleman Zaheer, Founder
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="https://wa.me/923285778715"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.824 11.824 0 0012.05 0zm0 21.785a9.864 9.864 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/></svg>
                    WhatsApp
                  </a>
                  <a
                    href="tel:+923285778715"
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 hover:bg-blue-500/25 transition-colors"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                    +92 328 577 8715
                  </a>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <AnimateOnScroll key={stat.label} variant="fadeUp" delay={0.08 * i}>
                <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-brand-500/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.1)] transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                    <stat.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="font-heading font-black text-5xl text-white group-hover:text-brand-400 transition-colors mb-2">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                    {stat.label}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
        <div className="absolute top-10 left-10 section-number">02 // Mission</div>
      </section>

      {/* ═══ 03 · CORE VALUES ═══════════════════════════════════════════ */}
      <section id="values" className="py-32 px-6 border-t border-zinc-800 relative bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll variant="fadeUp">
            <div className="mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-[11px] font-mono uppercase tracking-widest mb-5">
                <Shield className="w-3.5 h-3.5" /> What We Believe
              </div>
              <h2 className="font-heading font-black text-4xl md:text-5xl tracking-[-0.04em] mb-4">
                Core Architecture
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl">
                The fundamental principles that govern our engineering processes and dictate our standard of delivery.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <AnimateOnScroll key={value.title} variant="fadeUp" delay={0.08 * i}>
                <div className="p-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-6 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.iconBg} flex items-center justify-center border ${value.iconBorder} shrink-0`}>
                    <value.icon className={`w-7 h-7 ${value.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-2xl mb-3 text-white">{value.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
        <div className="absolute top-10 left-10 section-number">03 // Values</div>
      </section>

      {/* ═══ 04 · TEAM ══════════════════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-zinc-800 relative bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-[11px] font-mono uppercase tracking-widest mb-5">
                <Users className="w-3.5 h-3.5" /> The Team
              </div>
              <h2 className="font-heading font-black text-4xl md:text-5xl tracking-[-0.04em] mb-4">
                The Engineering Core
              </h2>
              <p className="text-zinc-400 text-lg">Senior engineers only. No juniors. No compromise.</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <AnimateOnScroll key={member.name} variant="fadeUp" delay={0.1 * i}>
                <div className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[3/4] hover:border-zinc-700 transition-all duration-500">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className={`${member.badgeBg} ${member.badgeText} font-mono text-[10px] uppercase px-3 py-1 rounded-full w-fit mb-4 border`}>
                      {member.badge}
                    </div>
                    <h3 className="font-heading font-black text-2xl mb-1 text-white">{member.name}</h3>
                    <p className="text-zinc-400 mb-4 font-medium text-sm">{member.role}</p>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {member.skills.map((skill) => (
                        <span key={skill} className="text-xs font-mono uppercase text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded border border-zinc-700/50">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Contact links — only shown for members who have them */}
                    {member.phone && (
                      <div className="pt-4 border-t border-zinc-700/50 space-y-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {member.bio && (
                          <p className="text-zinc-400 text-xs leading-relaxed mb-3">{member.bio}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {member.whatsapp && (
                            <a
                              href={member.whatsapp}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.824 11.824 0 0012.05 0zm0 21.785a9.864 9.864 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/></svg>
                              WhatsApp
                            </a>
                          )}
                          {member.phone && (
                            <a
                              href={`tel:${member.phone}`}
                              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 hover:bg-blue-500/25 transition-colors"
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                              {member.phone}
                            </a>
                          )}
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400 hover:bg-brand-500/25 transition-colors"
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                              Email
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:bg-sky-500/25 transition-colors"
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                              LinkedIn
                            </a>
                          )}
                          {member.github && (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg bg-zinc-500/15 border border-zinc-500/30 text-zinc-300 hover:bg-zinc-500/25 transition-colors"
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
        <div className="absolute top-10 left-10 section-number">04 // Team</div>
      </section>

      {/* ═══ 05 · TIMELINE ══════════════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-zinc-800 relative bg-zinc-950/50 overflow-hidden">
        <div className="max-w-4xl mx-auto relative">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-[11px] font-mono uppercase tracking-widest mb-5">
                <TrendingUp className="w-3.5 h-3.5" /> Our Journey
              </div>
              <h2 className="font-heading font-black text-4xl md:text-5xl tracking-[-0.04em]">
                Evolution Protocol
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="relative pl-8 md:pl-0">
            {/* Center line */}
            <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-500 via-indigo-500 to-transparent -translate-x-1/2 rounded-full opacity-50" />

            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <AnimateOnScroll key={m.year} variant="fadeUp" delay={0.1 * i}>
                  <div className={`relative mb-16 md:mb-24 flex items-center w-full md:w-1/2 ${isLeft ? "md:justify-end md:pr-12" : "md:justify-start md:pl-12 md:ml-auto"}`}>
                    <div className={`absolute left-[-4px] md:left-auto ${isLeft ? "md:right-[-16px]" : "md:left-[-16px]"} w-8 h-8 rounded-full bg-zinc-950 ${m.color} border-4 z-10 flex items-center justify-center`}>
                      <m.icon className="w-3.5 h-3.5 text-zinc-300" />
                    </div>
                    <div className={`ml-12 md:ml-0 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 w-full hover:border-zinc-700 transition-colors ${isLeft ? "md:text-right" : "md:text-left"}`}>
                      <div className={`font-mono font-bold tracking-widest mb-2 text-sm ${m.labelColor}`}>{m.year}</div>
                      <h3 className="font-heading font-bold text-xl mb-2 text-white">{m.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
        <div className="absolute top-10 left-10 section-number">05 // Timeline</div>
      </section>

      {/* ═══ 06 · CTA BANNER ════════════════════════════════════════════ */}
      <section className="py-28 px-6 border-t border-zinc-800 relative overflow-hidden dot-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 to-zinc-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/60 backdrop-blur-sm text-zinc-300 text-[11px] font-mono uppercase tracking-[0.2em] mb-8">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Ready to Build?
            </div>
            <h2 className="font-heading font-black text-5xl md:text-7xl tracking-[-0.04em] mb-6 leading-tight">
              Ready to build something{" "}
              <br />
              <span className="text-gradient bg-gradient-to-r from-zinc-100 to-zinc-500">
                legendary?
              </span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto">
              Let&apos;s turn your vision into a scalable, production-grade reality.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/contact"
                className="px-10 py-4 bg-white text-zinc-950 rounded-xl font-heading font-bold tracking-wide hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                Initiate Project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                className="px-10 py-4 bg-zinc-900 border border-zinc-700 text-white rounded-xl font-heading font-bold tracking-wide hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                View Portfolio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>

        <div className="absolute bottom-10 left-10 section-number">06 // CTA</div>
      </section>

    </div>
  );
}
