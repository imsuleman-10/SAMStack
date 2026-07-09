"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  GitBranch,
  Globe,
  Sparkles,
  Code2,
  Layers,
  BrainCircuit,
  Server,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "../components/AnimateOnScroll";

const CATEGORIES = ["All", "MERN Stack", "Next.js", "Full-Stack", "Enterprise"] as const;
type Category = (typeof CATEGORIES)[number];

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  category: Category[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  from: string;
  to: string;
  icon: React.ElementType;
  metrics?: { label: string; value: string }[];
}

const PROJECTS: Project[] = [
  {
    id: "elearning",
    title: "E-Learning Platform",
    subtitle: "Educational System",
    description: "A comprehensive learning management system with user enrollment, video course management, progress tracking, and automated certification issuance. Engineered for high concurrent user loads.",
    stack: ["Next.js", "Node.js", "MongoDB", "Express.js", "Firebase", "Tailwind CSS"],
    category: ["MERN Stack", "Full-Stack", "Enterprise"],
    liveUrl: "https://suleman-zaheer.vercel.app/projects",
    githubUrl: "https://github.com/imsuleman-10",
    featured: true,
    from: "from-blue-600",
    to: "to-cyan-500",
    icon: Globe,
    metrics: [
      { label: "Enrolled Users", value: "500+" },
      { label: "Courses Live", value: "24" },
      { label: "Completion Rate", value: "78%" },
    ],
  },
  {
    id: "airline",
    title: "Airline Reservation System",
    subtitle: "Enterprise Booking",
    description: "Advanced full-stack airline booking platform with real-time seat selection, user account management, automated ticket generation, and admin reporting dashboards.",
    stack: ["Next.js", "React.js", "Node.js", "MongoDB", "Tailwind CSS"],
    category: ["Next.js", "Full-Stack", "Enterprise"],
    liveUrl: "https://suleman-zaheer.vercel.app/projects",
    githubUrl: "https://github.com/imsuleman-10",
    featured: true,
    from: "from-indigo-600",
    to: "to-blue-600",
    icon: Layers,
    metrics: [
      { label: "Bookings", value: "1,200+" },
      { label: "Routes", value: "30+" },
      { label: "Uptime", value: "99.8%" },
    ],
  },
  {
    id: "samstack-tech",
    title: "SAMStack Tech Platform",
    subtitle: "Agency Architecture",
    description: "This very platform — a full-stack Next.js agency site featuring a Firestore-backed internship management system, automated email pipelines, and a secured admin console.",
    stack: ["Next.js 15", "TypeScript", "Firebase", "Firestore", "Tailwind CSS", "Apps Script"],
    category: ["Next.js", "Full-Stack", "Enterprise"],
    liveUrl: "https://samstack-tech.vercel.app",
    featured: false,
    from: "from-brand-600",
    to: "to-cyan-600",
    icon: Code2,
    metrics: [
      { label: "Applications", value: "Live" },
      { label: "Emails", value: "100% Auto" },
      { label: "DB Entries", value: "Real-Time" },
    ],
  },
  {
    id: "ai-automation",
    title: "AI Content Pipeline",
    subtitle: "Agentic Automation",
    description: "An automated content pipeline using Google Apps Script and AI APIs to generate, format, and deliver personalized technical content at scale without manual intervention.",
    stack: ["Google Apps Script", "Firebase", "REST APIs", "JavaScript", "Node.js"],
    category: ["Full-Stack", "Enterprise"],
    liveUrl: "https://samstack-tech.vercel.app/internship",
    githubUrl: "https://github.com/imsuleman-10",
    featured: false,
    from: "from-emerald-600",
    to: "to-teal-500",
    icon: BrainCircuit,
    metrics: [
      { label: "Emails", value: "Automated" },
      { label: "Time", value: "< 5s" },
      { label: "Manual", value: "Zero" },
    ],
  },
  {
    id: "mern-dashboard",
    title: "Enterprise MERN Dashboard",
    subtitle: "Analytics Console",
    description: "A full-featured analytics and operations dashboard built on the MERN stack with real-time data visualization, role-based access controls, and performance monitoring.",
    stack: ["MongoDB", "Express.js", "React.js", "Node.js", "Chart.js", "JWT"],
    category: ["MERN Stack", "Full-Stack", "Enterprise"],
    liveUrl: "https://suleman-zaheer.vercel.app/projects",
    githubUrl: "https://github.com/imsuleman-10",
    featured: false,
    from: "from-amber-500",
    to: "to-orange-500",
    icon: Server,
    metrics: [
      { label: "Data Points", value: "10K+" },
      { label: "Roles", value: "4 Levels" },
      { label: "Load", value: "< 2s" },
    ],
  },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category.includes(activeCategory));

  const featured = PROJECTS.filter((p) => p.featured);

  const getCoverImage = (id: string) => {
    const images = [
      "/images/img-analytics.jpg",
      "/images/img-code-editor.jpg",
      "/images/img-analytics.jpg",
      "/images/img-matrix-code.jpg",
      "/images/img-server-rack.jpg",
      "/images/img-matrix-code.jpg",
    ];
    const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return images[hash % images.length];
  };

  return (
    <div className="flex-1 w-full bg-white/80 dark:bg-black text-slate-900 dark:text-white" style={{ overflowX: "clip" }}>

      {/* ══════════════════════════════════════════
          SLIDE 1: HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full snap-start flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden group/section">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Image
            src="/images/img-code-editor.jpg"
            alt="Portfolio hero background"
            fill
            className="object-cover opacity-80 group-hover/section:opacity-90 transition-opacity duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-blue-50/70 dark:from-black/85 dark:via-neutral-950/80 dark:to-black/80" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-7 w-full">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/40 text-brand-700 dark:text-brand-400 text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" />
              Proof of Work — Real Impact
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.08}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white font-heading leading-[1.02] tracking-tight">
              Engineering{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 dark:from-brand-400 dark:via-brand-300 dark:to-cyan-400">
                Excellence.
              </span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.14}>
            <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Every project showcased here is a live deployment engineered by our core team. 
              No mockups. No hypotheticals. Just production-grade systems built to scale.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="https://suleman-zaheer.vercel.app/projects" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 dark:bg-white/80 text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-lg group">
                Full GitHub Archive <ExternalLink className="w-4 h-4" />
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-brand-400 dark:hover:border-brand-600 transition-colors group">
                Start Your Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 2 & 3: FLAGSHIP PROJECTS
          Each featured project gets its own full slide.
      ══════════════════════════════════════════ */}
      {featured.map((project, i) => (
        <section key={project.id} className="z-0 relative min-h-[100dvh] w-full snap-start flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-neutral-950 border-t border-slate-100 dark:border-neutral-900 overflow-hidden group/section">

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <AnimateOnScroll variant="fadeUp">
              <div className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16`}>
                
                {/* Content */}
                <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
                  
                  {/* Subtle heading to remind we are in Case Studies */}
                  {i === 0 && (
                    <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                      Featured Case Study
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.from} ${project.to} flex items-center justify-center shadow-lg`}>
                        <project.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${project.from} ${project.to}`}>
                        {project.subtitle}
                      </span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 dark:text-white font-heading">{project.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-base lg:text-lg leading-relaxed">{project.description}</p>
                  </div>

                  {project.metrics && (
                    <div className="grid grid-cols-3 gap-4 py-4 sm:py-6 border-y border-slate-100 dark:border-neutral-800">
                      {project.metrics.map((m) => (
                        <div key={m.label}>
                          <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-mono">{m.value}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mt-1">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span key={tech} className="px-3 py-1.5 rounded-md bg-slate-50/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-brand-500/20 group">
                        View Live <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-widest transition-colors">
                        Source Code <GitBranch className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 dark:border-neutral-800 shadow-2xl group max-h-[50vh] lg:max-h-none">
                    <Image 
                      src={getCoverImage(project.id)} 
                      alt={project.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

              </div>
            </AnimateOnScroll>
          </div>
        </section>
      ))}

      {/* ══════════════════════════════════════════
          SLIDE 4+: PROJECT ARCHIVE
          Minimum 1 screen height, expands if needed.
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full snap-start flex flex-col justify-start pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-slate-50/80 dark:bg-black overflow-hidden group/section">

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-10 lg:space-y-16">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Project Archive
              </h2>
              
              <div className="flex flex-wrap items-center justify-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      activeCategory === cat
                        ? "text-white bg-slate-900 dark:bg-white/80 dark:text-slate-900 shadow-md"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-neutral-900 bg-transparent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filtered.map((project, i) => (
              <AnimateOnScroll key={project.id} delay={0.05 * i} variant="fadeUp" className="h-full">
                <div className="group/card flex flex-col h-full rounded-3xl bg-white/80 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 overflow-hidden hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-xl transition-all duration-500">
                  
                  <div className="relative h-48 sm:h-56 w-full bg-slate-100 dark:bg-neutral-950 overflow-hidden shrink-0">
                    <Image src={getCoverImage(project.id)} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                          <GitBranch className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    
                    <div className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-gradient-to-r ${project.from} ${project.to}`}>
                      {project.subtitle}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 gap-5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">{project.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">{project.description}</p>
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-100 dark:border-neutral-800">
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.slice(0, 3).map((tech) => (
                          <span key={tech} className="px-2.5 py-1 rounded-md bg-slate-50/80 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {tech}
                          </span>
                        ))}
                        {project.stack.length > 3 && (
                          <span className="px-2.5 py-1 rounded-md bg-slate-50/80 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            +{project.stack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL SLIDE: CTA
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full snap-start flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900 dark:bg-neutral-950 border-t-8 border-brand-500 group/section">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 w-full">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Start Your Project
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.08}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-heading leading-tight tracking-tight">
              Have a Project in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand-400">Mind?</span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.12}>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              From idea to deployment, SAMStack Tech engineers solutions that scale. Submit your project brief and we&apos;ll respond within 12 hours.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.16}>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/80 hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-2xl group">
                Initiate a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold text-sm transition-all group">
                View Services <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
