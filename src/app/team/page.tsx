"use client";

import React from "react";
import Link from "next/link";
import { teamData } from "@/lib/data/team";
import { ArrowRight, Globe, Users } from "lucide-react";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-brand-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-24 left-8 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-24 right-8 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <AnimateOnScroll variant="fadeUp">
            <span className="section-label justify-center">
              <Users className="w-3.5 h-3.5" /> The Collective
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.05}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase leading-tight">
              Meet Our{" "}
              <span className="text-gradient-brand">Engineers</span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              The architects, designers, and developers building the next generation of scalable software solutions at SAMStack Tech.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.15}>
            <div className="flex items-center justify-center gap-8 pt-4 text-sm font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {teamData.length} Team Members
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span>Lahore, Pakistan</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span>Est. 2024</span>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Team Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamData.map((member, index) => (
            <AnimateOnScroll key={member.id} variant="fadeUp" delay={index * 0.08}>
              <Link href={`/team/${member.id}`} className="block group h-full">
                <article className="glass-card rounded-2xl h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-200/50 dark:border-white/5 hover:border-brand-500/30 dark:hover:border-brand-500/30 overflow-hidden">

                  {/* Card Top - Gradient Banner */}
                  <div className="h-24 w-full bg-gradient-to-br from-brand-500/20 via-indigo-500/10 to-transparent relative overflow-hidden shrink-0">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl" />
                    <div className="absolute top-2 right-2 text-[10px] font-mono font-bold uppercase tracking-widest text-brand-600/60 dark:text-brand-400/60">
                      SAMStack Tech
                    </div>
                  </div>

                  <div className="px-6 pb-6 flex flex-col flex-grow -mt-10 relative">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl bg-gradient-to-br from-brand-500/20 to-indigo-500/20 flex items-center justify-center mb-4 shrink-0">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = document.createElement("span");
                              fallback.className = "text-2xl font-black text-brand-600 dark:text-brand-400";
                              fallback.textContent = member.name.charAt(0);
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                          {member.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Name & Role */}
                    <div className="mb-4">
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors tracking-tight uppercase">
                        {member.name}
                      </h2>
                      <p className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                        {member.role}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-5 flex-grow leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {member.skills.slice(0, 4).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-[10px] font-mono font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 4 && (
                        <span className="px-2 py-1 text-[10px] font-mono font-bold bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-md border border-brand-200 dark:border-brand-500/20">
                          +{member.skills.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                        {member.socialLinks.linkedin && (
                          <svg className="w-4 h-4 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        )}
                        {member.socialLinks.github && (
                          <svg className="w-4 h-4 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                        )}
                        {member.socialLinks.twitter && (
                          <svg className="w-4 h-4 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        )}
                        {member.socialLinks.website && (
                          <Globe className="w-4 h-4 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Portfolio <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>

        {/* CTA Section */}
        <AnimateOnScroll variant="fadeUp" delay={0.2}>
          <div className="mt-20 glass-card rounded-2xl p-10 text-center border border-slate-200/50 dark:border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-indigo-500/5" />
            <div className="relative z-10 space-y-4">
              <span className="section-label justify-center">Join the Collective</span>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                Want to Build With Us?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
                We are always looking for talented engineers and creatives to join the SAMStack mission. Apply to our internship programme and start your journey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link href="/internship" className="btn-primary px-6 py-3 text-sm">
                  Apply for Internship
                </Link>
                <Link href="/contact" className="btn-secondary px-6 py-3 text-sm">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
