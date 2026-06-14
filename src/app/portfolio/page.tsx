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
    subtitle: "Full-Stack Educational System",
    description: "A comprehensive learning management system with user enrollment, video course management, progress tracking, and automated certification issuance.",
    stack: ["Next.js", "Node.js", "MongoDB", "Express.js", "Firebase", "Tailwind CSS"],
    category: ["MERN Stack", "Full-Stack", "Enterprise"],
    liveUrl: "https://suleman-zaheer.vercel.app/projects",
    githubUrl: "https://github.com/imsuleman-10",
    featured: true,
    from: "from-blue-600",
    to: "to-cyan-600",
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
    subtitle: "Enterprise Booking & Ticketing",
    description: "Advanced full-stack airline booking platform with real-time seat selection, user account management, automated ticket generation, and admin reporting dashboards.",
    stack: ["Next.js", "React.js", "Node.js", "MongoDB", "Tailwind CSS"],
    category: ["Next.js", "Full-Stack", "Enterprise"],
    liveUrl: "https://suleman-zaheer.vercel.app/projects",
    githubUrl: "https://github.com/imsuleman-10",
    featured: true,
    from: "from-indigo-600",
    to: "to-purple-600",
    icon: Layers,
    metrics: [
      { label: "Bookings Processed", value: "1,200+" },
      { label: "Routes Covered", value: "30+" },
      { label: "Uptime", value: "99.8%" },
    ],
  },
  {
    id: "samstack-tech",
    title: "SAMStack Tech Platform",
    subtitle: "Agency Website & Internship Portal",
    description: "This very platform — a full-stack Next.js agency site featuring a Firestore-backed internship management system, automated email pipelines, and a secured admin console.",
    stack: ["Next.js 15", "TypeScript", "Firebase", "Firestore", "Tailwind CSS", "Google Apps Script"],
    category: ["Next.js", "Full-Stack", "Enterprise"],
    liveUrl: "https://samstack.tech",
    featured: true,
    from: "from-brand-600",
    to: "to-teal-600",
    icon: Code2,
    metrics: [
      { label: "Applications Managed", value: "Live" },
      { label: "Automated Emails", value: "100%" },
      { label: "DB Entries", value: "Real-Time" },
    ],
  },
  {
    id: "ai-automation",
    title: "AI Content Automation Pipeline",
    subtitle: "Agentic Workflow System",
    description: "An automated content pipeline using Google Apps Script and AI APIs to generate, format, and deliver personalized technical content at scale without manual intervention.",
    stack: ["Google Apps Script", "Firebase", "REST APIs", "JavaScript", "Node.js"],
    category: ["Full-Stack", "Enterprise"],
    liveUrl: "https://samstack.tech/internship",
    githubUrl: "https://github.com/imsuleman-10",
    featured: false,
    from: "from-emerald-600",
    to: "to-green-600",
    icon: BrainCircuit,
    metrics: [
      { label: "Emails Dispatched", value: "Automated" },
      { label: "Processing Time", value: "< 5s" },
      { label: "Manual Work", value: "Zero" },
    ],
  },
  {
    id: "mern-dashboard",
    title: "Enterprise MERN Dashboard",
    subtitle: "Analytics & Operations Console",
    description: "A full-featured analytics and operations dashboard built on the MERN stack with real-time data visualization, role-based access controls, and performance monitoring.",
    stack: ["MongoDB", "Express.js", "React.js", "Node.js", "Chart.js", "JWT"],
    category: ["MERN Stack", "Full-Stack", "Enterprise"],
    liveUrl: "https://suleman-zaheer.vercel.app/projects",
    githubUrl: "https://github.com/imsuleman-10",
    featured: false,
    from: "from-amber-600",
    to: "to-orange-600",
    icon: Server,
    metrics: [
      { label: "Data Points", value: "10K+" },
      { label: "User Roles", value: "4 Levels" },
      { label: "Load Time", value: "< 2s" },
    ],
  },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category.includes(activeCategory));

  const featured = PROJECTS.filter((p) => p.featured).slice(0, 2);

  const getCoverImage = (id: string) => {
    const images = [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    ];
    const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return images[hash % images.length];
  };

  return (
    <div className="flex-1 w-full">

      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[500px] bg-brand-500/8 dark:bg-brand-500/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-5">
          <AnimateOnScroll variant="fadeUp">
            <div className="section-label mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              Proof of Work — Real Projects, Real Impact
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-heading leading-[1.05] tracking-tight">
              Our{" "}
              <span className="text-gradient-brand">Work Portfolio</span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              Every project here is a live deployment built and engineered by{" "}
              <a href="https://suleman-zaheer.vercel.app" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline font-semibold">Suleman Zaheer</a>
              , Founder of SAMStack Tech. No mockups. No hypotheticals. All real.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.3}>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://suleman-zaheer.vercel.app/projects" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Full Portfolio <ExternalLink className="w-4 h-4" />
              </a>
              <Link href="/contact" className="btn-secondary">
                Start a Project <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS ─────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950 border-y border-slate-100 dark:border-neutral-900">
        <div className="max-w-6xl mx-auto w-full space-y-10">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="section-label mx-auto"><Sparkles className="w-3.5 h-3.5" /> Featured Case Studies</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">Flagship Projects</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
                Deep-dive into our most impactful enterprise builds, each with real metrics.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.map((project, i) => (
              <AnimateOnScroll key={project.id} delay={0.1 * i} variant="fadeUp" className="h-full">
                <div className="group hover-lift relative rounded-2xl border border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 overflow-hidden flex flex-col h-full hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-500">
                  <div className="relative h-44 sm:h-52 w-full bg-slate-100 dark:bg-neutral-900 overflow-hidden">
                    <Image src={getCoverImage(project.id)} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                      <project.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                      {project.category.map((cat) => (
                        <span key={cat} className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[9px] font-bold text-white uppercase tracking-wider">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 uppercase tracking-widest font-bold">{project.subtitle}</span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">{project.title}</h2>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <GitBranch className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{project.description}</p>

                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-3">
                        {project.metrics.map((m) => (
                          <div key={m.label} className="text-center p-3 rounded-xl bg-white dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800">
                            <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">{m.value}</div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-2 mt-auto border-t border-slate-100 dark:border-neutral-800">
                      {project.stack.map((tech) => (
                        <span key={tech} className="px-2.5 py-1 rounded-full bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ALL PROJECTS ─────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-black">
        <div className="max-w-6xl mx-auto w-full space-y-10">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="section-label mx-auto"><Code2 className="w-3.5 h-3.5" /> All Projects</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">Project Archive</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
                Browse our complete portfolio of enterprise applications and platforms.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 shadow-sm">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      activeCategory === cat
                        ? "text-white"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {activeCategory === cat && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute inset-0 bg-brand-600 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((project, i) => (
              <AnimateOnScroll key={project.id} delay={0.07 * i} variant="fadeUp" className="h-full">
                <div className="group hover-lift relative rounded-2xl bg-white dark:bg-neutral-900/40 border border-slate-100 dark:border-neutral-800 overflow-hidden flex flex-col hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-500 h-full">

                  <div className="relative h-36 sm:h-44 w-full bg-slate-100 dark:bg-neutral-900 overflow-hidden shrink-0">
                    <Image src={getCoverImage(project.id)} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-sm">
                      <project.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:text-brand-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                          <GitBranch className="w-3 h-3" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:text-brand-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="space-y-1.5 flex-1">
                      <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 uppercase tracking-widest font-bold">{project.subtitle}</span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">{project.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{project.description}</p>
                    </div>

                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-2">
                        {project.metrics.map((m) => (
                          <div key={m.label} className="text-center p-2 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800">
                            <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">{m.value}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800 text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800 text-[9px] font-mono text-slate-500 dark:text-slate-400">
                          +{project.stack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────── */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.10)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <AnimateOnScroll variant="scaleUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              Let&apos;s Build Together
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="scaleUp" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading leading-tight">
              Have a Project in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-200">Mind?</span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.15}>
            <p className="text-white/75 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              From idea to deployment, SAMStack Tech engineers solutions that scale. Submit your project brief and we&apos;ll respond within 12 hours.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="flex flex-wrap justify-center pt-2 gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-brand-700 font-bold text-xs uppercase tracking-widest shadow-2xl transition-all">
                Initiate a Project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest transition-all">
                View Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
