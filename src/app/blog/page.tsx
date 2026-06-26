"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, Sparkles, BookOpen } from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "../components/AnimateOnScroll";
import { blogPosts, getFeaturedPost } from "@/lib/data/blog-posts";

const tags = ["All Logs", "Next.js", "DevOps", "Serverless", "AI & Agents", "Architecture", "TypeScript"];

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState("All Logs");

  const featuredArticle = getFeaturedPost();
  
  const filteredArticles = activeTag === "All Logs" 
    ? blogPosts.filter(p => p.slug !== featuredArticle.slug)
    : blogPosts.filter(p => p.tags.includes(activeTag) && p.slug !== featuredArticle.slug);

  return (
    <div className="w-full overflow-x-hidden bg-zinc-950 text-zinc-50 min-h-screen">
      
      {/* ═══ 01 · HERO ══════════════════════════════════════════════════ */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-24 px-4 sm:px-6 dot-bg border-b border-zinc-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 backdrop-blur-sm text-cyan-400 text-[11px] font-mono uppercase tracking-widest mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              SAMStack Insights
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black font-heading leading-tight tracking-[-0.04em] mb-6">
              Systems Architecture <br />
              <span className="text-gradient-industrial">&amp; Engineering Logs</span>
            </h1>
            
            <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed mb-10 font-medium">
              Deep dives into full-stack architecture, high-throughput serverless systems, and edge pipeline engineering.
            </p>
          </AnimateOnScroll>

          {/* Tags Filter */}
          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <div className="flex flex-wrap items-center gap-3">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 border ${
                    activeTag === tag
                      ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "bg-zinc-900/80 border-zinc-700/50 text-zinc-400 hover:text-white hover:border-zinc-500"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
        <div className="absolute top-10 right-10 section-number">01 // Logs</div>
      </section>

      {/* ═══ 02 · FEATURED ARTICLE ══════════════════════════════════════ */}
      {activeTag === "All Logs" && featuredArticle && (
        <section className="py-20 sm:py-24 px-4 sm:px-6 bg-zinc-950 relative">
          <div className="max-w-6xl mx-auto">
            <AnimateOnScroll variant="fadeUp">
              <h2 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-6">Featured Entry</h2>
              
              <div className="group relative rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-cyan-500/40 transition-colors duration-500 shadow-2xl flex flex-col lg:flex-row">
                {/* Accents */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 z-20" />
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-indigo-500 z-20 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Left Image */}
                <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-800">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 lg:from-transparent lg:bg-gradient-to-r lg:to-transparent lg:via-zinc-900/50 lg:from-zinc-950 opacity-80" />
                  
                  <div className="absolute bottom-6 left-6 z-10 flex flex-wrap gap-2 pr-4">
                    {featuredArticle.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-zinc-700/50 rounded text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Content */}
                <div className="relative w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs font-mono text-zinc-400 mb-6">
                    <span className="text-cyan-400">{featuredArticle.category}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {featuredArticle.date}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}</span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-heading font-black leading-tight text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {featuredArticle.title}
                  </h3>
                  
                  <p className="text-zinc-400 leading-relaxed mb-8 text-base md:text-lg">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="mt-auto pt-6 border-t border-zinc-800 flex items-center justify-between">
                    <div className="font-medium text-sm text-zinc-300">By {featuredArticle.author}</div>
                    <Link href={`/blog/${featuredArticle.slug}`} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ═══ 03 · ARTICLES GRID ═════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 border-t border-zinc-800 bg-zinc-950/50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
            <h2 className="text-3xl font-heading font-black text-white">Engineering Logs Index</h2>
            <div className="font-mono text-sm text-zinc-500">[{filteredArticles.length} Logs]</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {filteredArticles.map((article, i) => (
              <AnimateOnScroll key={article.slug} delay={0.05 * i} variant="fadeUp">
                <Link href={`/blog/${article.slug}`} className="group flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-colors hover:-translate-y-1 shadow-lg">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 border-b border-zinc-800">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover opacity-50 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-80" />
                  </div>
                  
                  <div className="flex flex-col flex-1 p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs font-mono text-zinc-400 mb-4">
                      <span className="text-cyan-400">{article.category}</span>
                      <span>&bull;</span>
                      <span>{article.date}</span>
                      <span>&bull;</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-black text-white mb-3 group-hover:text-cyan-400 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-5 border-t border-zinc-800/60 mt-auto">
                      <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500">
                        {article.author}
                      </span>
                      <span className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-cyan-400 group-hover:translate-x-1 transition-transform">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
            
            {filteredArticles.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-20 text-zinc-500 font-mono">
                No logs found for tag [{activeTag}]
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 04 · CTA BANNER ════════════════════════════════════════════ */}
      <section className="relative py-28 sm:py-36 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-cyan-600 to-indigo-700 border-t border-zinc-800">
        <div className="absolute inset-0 grid-bg mix-blend-overlay opacity-30" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-md mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Apply the Knowledge
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white font-heading tracking-[-0.04em] mb-6">
              Turn Knowledge <br className="hidden sm:block" /> Into Product
            </h2>
            <p className="text-white/80 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              We apply these engineering patterns daily to build enterprise software that performs at scale. Let's build yours.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-zinc-950 rounded-xl font-heading font-bold tracking-wide hover:bg-zinc-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
