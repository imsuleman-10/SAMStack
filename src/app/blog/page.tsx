import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  Tag,
  Code2,
  Cpu,
  Zap,
} from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "../components/AnimateOnScroll";

export const revalidate = 3600;

export default async function BlogIndexPage() {
  let posts: Awaited<ReturnType<typeof db.posts.list>> = [];
  try {
    posts = await db.posts.list();
  } catch {
    posts = [];
  }

  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];
  const regularPosts = posts.filter((p) => p.id !== featuredPost?.id);

  const getCoverImage = (index: number) => {
    const images = [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=1200",
    ];
    return images[index % images.length];
  };

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 225);
  };

  return (
    <div className="flex-1 w-full">

      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-cyan-500/8 dark:bg-cyan-500/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/8 dark:bg-indigo-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-5">
          <AnimateOnScroll variant="fadeUp">
            <div className="section-label mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              SAMStack Insights
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-heading leading-[1.05] tracking-tight">
              Systems Architecture<br />
              <span className="text-gradient-brand">
                &amp; Engineering Logs
              </span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              Deep dives into full-stack architecture, high-throughput serverless systems, obsidian interface components, and edge pipeline systems.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.3}>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {["Next.js", "DevOps", "Serverless", "AI & Agents", "Architecture", "TypeScript"].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── FEATURED / EMPTY STATE ───────────────────── */}
      {posts.length === 0 ? (
        <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white dark:bg-neutral-950">
          <AnimateOnScroll variant="scaleUp">
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="w-20 h-20 bg-cyan-50 dark:bg-cyan-950/40 rounded-3xl flex items-center justify-center mx-auto border border-cyan-200 dark:border-cyan-900/50">
                <BookOpen className="w-9 h-9 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">No logs published yet</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Our engineering team is currently drafting new architecture logs and system deep-dives. Check back soon.
              </p>
              <Link href="/contact" className="btn-primary">
                Get Notified <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </section>
      ) : (
        <>
          {/* ─── FEATURED ARTICLE ─────────────────────── */ }
          {featuredPost && (
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950 border-y border-slate-100 dark:border-neutral-900">
              <div className="max-w-6xl mx-auto w-full space-y-8">
                <AnimateOnScroll variant="fadeUp">
                  <div className="flex items-center gap-4">
                    <div className="section-label"><Sparkles className="w-3.5 h-3.5" /> Featured Article</div>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll variant="fadeUp" delay={0.1}>
                  <div className="group hover-lift rounded-2xl border border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 overflow-hidden relative hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-500 flex flex-col md:flex-row">
                    <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-cyan-500 to-indigo-600 z-20" />
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-brand-500 to-indigo-500 z-20" />

                    <div className="md:w-1/2 relative min-h-[220px] sm:min-h-[280px] md:min-h-[320px] border-b md:border-b-0 md:border-r border-slate-200 dark:border-neutral-800 bg-black overflow-hidden">
                      <Image src={getCoverImage(0)} alt={featuredPost.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap gap-1.5 z-10">
                        {featuredPost.tags.map((t) => (
                          <span key={t} className="text-[10px] font-mono bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-md text-white shadow-lg uppercase tracking-wider">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="md:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-10 space-y-5">
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-500" />
                          {formatDate(featuredPost.publishedAt)}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-500" />
                          {featuredPost.author.name}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors leading-snug font-heading">
                          <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{featuredPost.excerpt}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-neutral-800">
                        <Link href={`/blog/${featuredPost.slug}`} className="btn-primary">
                          Read Article <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>
            </section>
          )}

          {/* ─── ARTICLES GRID ─────────────────────────── */}
          {regularPosts.length > 0 && (
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-black">
              <div className="max-w-6xl mx-auto w-full space-y-10">
                <AnimateOnScroll variant="fadeUp">
                  <div className="flex items-center gap-4">
                    <div className="section-label"><BookOpen className="w-3.5 h-3.5" /> Engineering Logs Index</div>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{regularPosts.length} articles</span>
                  </div>
                </AnimateOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {regularPosts.map((post, index) => (
                    <AnimateOnScroll key={post.id} delay={0.07 * index} variant="fadeUp">
                      <article className="group hover-lift rounded-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 flex flex-col hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-500">
                        <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-slate-100 dark:bg-neutral-900 border-b border-slate-100 dark:border-neutral-800">
                          <Image src={getCoverImage(index + 1)} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <div className="flex flex-col flex-1 p-5 space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-cyan-600 dark:text-cyan-500" />
                              {formatDate(post.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1 shrink-0">
                              <Zap className="w-3 h-3" />
                              {getReadingTime(post.contentMarkdown)} Min Read
                            </span>
                          </div>

                          <div className="space-y-2 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors leading-snug font-heading">
                              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-neutral-800">
                            <div className="flex gap-1.5 flex-wrap">
                              {post.tags.map((t) => (
                                <span key={t} className="text-[9px] font-mono bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 flex items-center gap-0.5">
                                  <Tag className="w-2.5 h-2.5" />{t}
                                </span>
                              ))}
                            </div>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-1 text-[10px] font-bold font-mono uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors shrink-0"
                            >
                              Read <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ─── FINAL CTA ─────────────────────────────── */}
          <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
            
            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <AnimateOnScroll variant="scaleUp">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em]">
                  <Cpu className="w-3.5 h-3.5" />
                  Ready to Build?
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll variant="fadeUp" delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading leading-tight">
                  Turn Knowledge Into Product
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll variant="fadeUp" delay={0.15}>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                  The patterns you read about in SAMStack Insights are the same ones we implement for our enterprise clients. Ready to put them to work for your business?
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll variant="fadeUp" delay={0.2}>
                <Link href="/contact" className="btn-primary !bg-white !text-brand-700 hover:!bg-slate-50 !shadow-2xl">
                  Start a Project <ArrowRight className="w-4 h-4" />
                </Link>
              </AnimateOnScroll>
            </div>
          </section>
        </>
      )}

    </div>
  );
}
