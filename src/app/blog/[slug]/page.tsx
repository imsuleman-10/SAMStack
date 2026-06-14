import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import type { BlogPost } from "@/lib/db";
import { Calendar, User, ArrowLeft, Clock, Tag, BookOpen } from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "../../components/AnimateOnScroll";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await db.posts.getBySlug(slug);
    if (!post) return { title: "Post Not Found" };
    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch {
    return { title: "SAMStack Insights" };
  }
}

export async function generateStaticParams() {
  try {
    const posts = await db.posts.list();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

type RenderedNode = React.ReactNode;

function renderMarkdown(markdown: string): RenderedNode[] {
  const result: RenderedNode[] = [];

  const rawLines = markdown.split("\n");
  const blocks: ({ type: "code"; lang: string; content: string } | { type: "line"; text: string })[] = [];

  let inCode = false;
  let codeLang = "";
  let codeLines: string[] = [];

  for (const line of rawLines) {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", lang: codeLang, content: codeLines.join("\n") });
        codeLines = [];
        codeLang = "";
        inCode = false;
      } else {
        inCode = true;
        codeLang = line.replace(/^```/, "").trim();
      }
    } else if (inCode) {
      codeLines.push(line);
    } else {
      blocks.push({ type: "line", text: line });
    }
  }

  if (inCode && codeLines.length > 0) {
    blocks.push({ type: "code", lang: codeLang, content: codeLines.join("\n") });
  }

  blocks.forEach((block, i) => {
    const key = `block-${i}`;

    if (block.type === "code") {
      result.push(
        <pre
          key={key}
          className="relative p-5 rounded-2xl bg-slate-900 dark:bg-black border border-slate-700 dark:border-white/5 font-mono text-xs sm:text-sm overflow-x-auto text-cyan-300 my-8 shadow-xl"
        >
          {block.lang && (
            <span className="absolute top-3 right-4 text-[9px] text-slate-500 uppercase tracking-widest font-mono">
              {block.lang}
            </span>
          )}
          <code className="leading-relaxed">{block.content}</code>
        </pre>
      );
      return;
    }

    const text = block.text;
    const trimmed = text.trim();

    if (trimmed === "") {
      result.push(<div key={key} className="h-4" />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      result.push(
        <h3 key={key} className="text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-10 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      result.push(
        <h2 key={key} className="text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-12 mb-4 pb-3 border-b border-slate-200 dark:border-white/5">
          {trimmed.slice(3)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      result.push(
        <h1 key={key} className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight mt-14 mb-6">
          {trimmed.slice(2)}
        </h1>
      );
      return;
    }

    if (/^[-*] /.test(trimmed)) {
      result.push(
        <div key={key} className="flex items-start gap-3 my-2">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {renderInline(trimmed.slice(2))}
          </span>
        </div>
      );
      return;
    }

    const numberedMatch = trimmed.match(/^(\d+)\. (.+)/);
    if (numberedMatch) {
      result.push(
        <div key={key} className="flex items-start gap-3 my-2">
          <span className="mt-0.5 w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 flex items-center justify-center text-[10px] font-bold text-brand-700 dark:text-brand-400 shrink-0 font-mono">
            {numberedMatch[1]}
          </span>
          <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pt-0.5">
            {renderInline(numberedMatch[2])}
          </span>
        </div>
      );
      return;
    }

    result.push(
      <p key={key} className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed my-4">
        {renderInline(trimmed)}
      </p>
    );
  });

  return result;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const boldSplit = text.split(/(\*\*[^*]+\*\*)/g);

  boldSplit.forEach((segment, si) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      parts.push(
        <strong key={`b-${si}`} className="text-slate-900 dark:text-white font-semibold">
          {renderInlineCode(segment.slice(2, -2), `b-${si}`)}
        </strong>
      );
    } else {
      parts.push(...renderInlineCode(segment, `s-${si}`));
    }
  });

  return parts;
}

function renderInlineCode(text: string, keyPrefix: string): React.ReactNode[] {
  const codeSplit = text.split(/(`[^`]+`)/g);
  return codeSplit.map((chunk, ci) => {
    if (chunk.startsWith("`") && chunk.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-c-${ci}`}
          className="bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-white/5 px-1.5 py-0.5 rounded text-cyan-700 dark:text-cyan-400 font-mono text-[12px]"
        >
          {chunk.slice(1, -1)}
        </code>
      );
    }
    return chunk ? <React.Fragment key={`${keyPrefix}-t-${ci}`}>{chunk}</React.Fragment> : null;
  }).filter(Boolean) as React.ReactNode[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let post: BlogPost | null = null;
  try {
    post = await db.posts.getBySlug(slug);
  } catch {
    post = null;
  }

  if (post === null) {
    notFound();
  }

  const {
    title,
    excerpt,
    tags,
    publishedAt,
    contentMarkdown,
    author,
  } = post;

  const initials = getInitials(author.name);
  const readingTime = getReadingTime(contentMarkdown);
  const publishDate = formatDate(publishedAt);
  const renderedContent = renderMarkdown(contentMarkdown);

  const getCoverImage = (s: string) => {
    const images = [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=1200",
    ];
    const hash = Array.from(s).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return images[hash % images.length];
  };

  return (
    <article className="flex-1 w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black">

      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="relative overflow-hidden w-full">
        <div className="relative h-[55vh] sm:h-[60vh]">
          <Image src={getCoverImage(slug)} alt={title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 to-transparent" />
        </div>

        {/* Back button — top left */}
        <div className="absolute top-6 left-5 sm:top-8 sm:left-8 z-20">
          <AnimateOnScroll variant="fadeLeft">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 px-4 py-2 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Articles
            </Link>
          </AnimateOnScroll>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pb-12 sm:pb-16">
            <AnimateOnScroll variant="fadeUp" delay={0.05}>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-white/80 uppercase tracking-widest"
                  >
                    <Tag className="w-3 h-3" />
                    {t}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] font-heading max-w-3xl mb-4">
                {title}
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.15}>
              <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed max-w-2xl mb-5">
                {excerpt}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.2}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-white/10">
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  {publishDate}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {readingTime} Min Read
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <User className="w-3.5 h-3.5 text-cyan-500" />
                  {author.name}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
                  {author.role}
                </span>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── ARTICLE BODY ──────────────────────────────── */}
      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll variant="fadeUp">
            <div className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-6 sm:p-10 lg:p-12 rounded-3xl shadow-sm">
              {renderedContent}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── AUTHOR CARD ───────────────────────────────── */}
      <section className="pb-20 sm:pb-28 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto w-full">
          <AnimateOnScroll variant="fadeUp">
            <div className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white font-heading shrink-0 shadow-lg">
                  {initials}
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">{author.name}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{author.role}</span>
                </div>
              </div>
              <Link
                href="/blog"
                className="btn-secondary shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                More Articles
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </article>
  );
}
