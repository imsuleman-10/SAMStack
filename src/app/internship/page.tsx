"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  Terminal,
  User,
  Mail,
  Layers,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Code,
  Zap,
  BrainCircuit,
  Globe,
  GitBranch,
  Cpu,
  Code2,
  Users,
  Trophy,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { tracks } from "@/lib/curriculum";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

function InternshipFormSection() {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track");

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("PYTHON");
  const [covenantChecked, setCovenantChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    rollNumber: string;
    fullName: string;
    email: string;
    track: string;
    appliedAt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (trackParam && tracks[trackParam.toUpperCase()]) {
      setSelectedTrack(trackParam.toUpperCase());
    }
  }, [trackParam]);

  const nextStep = () => {
    setError(null);
    if (step === 1 && !covenantChecked) {
      setError("You must accept the SAMStack Tech Honor Covenant to proceed.");
      return;
    }
    if (step === 2) {
      if (!fullName.trim()) { setError("Please enter your full engineering name."); return; }
      if (!email.trim() || !email.includes("@")) { setError("Please enter a valid developer email address."); return; }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => { setError(null); setStep((prev) => prev - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/internship/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, track: selectedTrack }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to process application.");
      setSuccessData({ rollNumber: data.rollNumber, fullName: data.fullName, email: data.email, track: data.track, appliedAt: data.appliedAt });
      setStep(5);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : null) || "An unexpected system error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRoll = () => {
    if (!successData) return;
    navigator.clipboard.writeText(successData.rollNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTrackInfo = tracks[selectedTrack] || tracks["PYTHON"];

  return (
    <div className="bg-white dark:bg-neutral-950 w-full flex flex-col lg:flex-row">
      <div className="relative hidden lg:flex lg:w-1/2 min-h-[100dvh] bg-black flex-col justify-end p-12 xl:p-20">
        <Image 
          src="/internship-hero.png" 
          alt="SAMStack Elite Residency" 
          fill 
          className="object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <AnimateOnScroll variant="fadeUp" className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] uppercase tracking-widest mb-6 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Elite Engineering Residency
          </div>
          <h1 className="text-4xl xl:text-5xl font-black text-white font-heading leading-tight tracking-tight mb-4 drop-shadow-lg">
            Build systems that <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">power the future.</span>
          </h1>
          <p className="text-slate-300 text-sm xl:text-base leading-relaxed mb-8 drop-shadow-md">
            Join our intense, zero-cost, highly-automated residency. Commit code to production, build scalable architectures, and earn an immutable cryptographic credential.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[10px] xl:text-xs font-mono text-cyan-100 uppercase tracking-wider font-bold">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400"/> Remote</div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400"/> Asynchronous</div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400"/> High-Impact</div>
          </div>
        </AnimateOnScroll>
      </div>

      <div id="apply-now" className="relative w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 overflow-y-auto bg-slate-50 dark:bg-neutral-950">
        <div className="w-full max-w-xl mx-auto space-y-6 sm:space-y-8">
          
          <AnimateOnScroll variant="fadeUp" className="flex items-center gap-3 sm:gap-4 mb-2 lg:hidden">
            <div className="section-label inline-flex"><Terminal className="w-3.5 h-3.5" />Application Portal</div>
            <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
          </AnimateOnScroll>

          {step < 5 && (
            <AnimateOnScroll variant="fadeUp">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono tracking-widest text-slate-500 uppercase mb-2 sm:mb-3">
                  <span>Stage {step} of 4</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {step === 1 && "Honor Covenant"}
                    {step === 2 && "Developer profile"}
                    {step === 3 && "Track specialization"}
                    {step === 4 && "Final Review"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-neutral-900 rounded-full overflow-hidden border border-slate-300/30 dark:border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>
            </AnimateOnScroll>
          )}

        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden relative bg-white dark:bg-black flex-1 sm:flex-none max-h-[80vh] overflow-y-auto">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-500 via-cyan-400 to-indigo-500" />
          <div className="p-4 sm:p-6 lg:p-10">
            {error && (
              <AnimateOnScroll variant="fadeInScale">
                <div className="mb-6 p-3 sm:p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-700 dark:text-rose-200 text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div><span className="font-bold">System Validation Blocked:</span> {error}</div>
                </div>
              </AnimateOnScroll>
            )}

            {step === 1 && (
              <AnimateOnScroll key="step1" variant="fadeInScale">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="section-label w-fit">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />Proprietary Pipeline
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-heading line-clamp-2">
                      SAMStack Tech{" "}
                      <span className="text-gradient-brand">Internship Intake Portal</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3">
                      Welcome to the core automated gateway of SAMStack Tech. We build high-performance systems, enterprise-grade dashboards, and automated AI pipelines. Our application is zero-cost, high-automation, and cryptographically verified.
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-2 sm:space-y-3">
                    <h3 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-brand-700 dark:text-brand-400 flex items-center gap-1.5 sm:gap-2 font-heading">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />System Honor Rules & Guidelines
                    </h3>
                    <ul className="space-y-2 sm:space-y-3 text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                      {[
                        { title: "Dynamic Assignments:", text: "Selecting a specialization track locks you into 5 advanced projects." },
                        { title: "Immutable Registry:", text: "Successful completion issues an unforgeable public credential. Plagiarism triggers immediate system ban." },
                        { title: "Asynchronous Systems:", text: "You will instantly receive your Roll Number and automated task deck." },
                      ].map((item) => (
                        <li key={item.title} className="flex items-start gap-2">
                          <span className="text-brand-600 dark:text-brand-400 mt-0.5">•</span>
                          <span><strong>{item.title}</strong> {item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <label className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-brand-50 dark:bg-brand-950/10 border border-brand-500/20 cursor-pointer group hover:bg-brand-100/50 dark:hover:bg-brand-950/20 transition-colors">
                    <input type="checkbox" checked={covenantChecked} onChange={(e) => setCovenantChecked(e.target.checked)} className="mt-0.5 sm:mt-1 accent-brand-500 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded cursor-pointer" />
                    <div className="text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 select-none">
                      <span className="font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-400 transition-colors">I Accept the SAMStack Engineering Honor Covenant.</span> I certify that I will author only pure code, utilize best practices, and adhere to strict guidelines.
                    </div>
                  </label>
                  <div className="pt-2 sm:pt-4 flex justify-end">
                    <button onClick={nextStep} className="btn-primary cursor-pointer text-xs">
                      Initiate Intake Form <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </AnimateOnScroll>
            )}

            {step === 2 && (
              <AnimateOnScroll key="step2" variant="fadeInScale">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading line-clamp-1">Tell us about your Engineering Background</h2>
                    <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-2">Input your real professional developer identity. This data will compile into your immutable credentials.</p>
                  </div>
                  <div className="space-y-4 sm:space-y-5">
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">Full Legal & Professional Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Suleman Zaheer"
                          className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg sm:rounded-xl border border-slate-200 dark:border-neutral-700 bg-transparent text-slate-900 dark:text-white outline-none transition-colors" required />
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">Exactly as it should appear on your public certification and letter of recommendation.</p>
                    </div>
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">Primary Engineering Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. suleman@samstack.com"
                          className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg sm:rounded-xl border border-slate-200 dark:border-neutral-700 bg-transparent text-slate-900 dark:text-white outline-none transition-colors" required />
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">Essential for dynamic task distribution, repository setups, and system notifications.</p>
                    </div>
                  </div>
                  <div className="pt-4 sm:pt-6 flex items-center justify-between border-t border-slate-200 dark:border-neutral-800">
                    <button onClick={prevStep} className="btn-secondary cursor-pointer text-xs">
                      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Covenant
                    </button>
                    <button onClick={nextStep} className="btn-primary cursor-pointer text-xs">
                      Select Specialization <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </AnimateOnScroll>
            )}

            {step === 3 && (
              <AnimateOnScroll key="step3" variant="fadeInScale">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading line-clamp-1">Select Your Specialization Pipeline</h2>
                    <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-2">Each track unlocks 5 specific advanced projects. Click a track to analyze its structural curriculum details.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                    <div className="space-y-1.5 sm:space-y-2 lg:col-span-1 max-h-[140px] sm:max-h-[180px] lg:max-h-none overflow-y-auto pr-1">
                      {Object.values(tracks).map((trackInfo) => (
                        <button key={trackInfo.id} onClick={() => setSelectedTrack(trackInfo.id)}
                          className={`w-full text-left p-2.5 sm:p-3 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs transition-all duration-200 flex items-center justify-between font-mono cursor-pointer ${selectedTrack === trackInfo.id
                            ? "bg-brand-500/10 border-brand-500 text-brand-700 dark:text-brand-400 shadow-sm font-semibold"
                            : "bg-slate-50 dark:bg-black/40 border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-700"}`}>
                          <span>{trackInfo.title.split(" ")[0]} {trackInfo.title.includes("UI/UX") ? "UI/UX" : trackInfo.title.split(" ")[1] === "Development" ? "Specialist" : trackInfo.title.split(" ")[1]}</span>
                          <Code className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${selectedTrack === trackInfo.id ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-600"}`} />
                        </button>
                      ))}
                    </div>
                    <div className="lg:col-span-2 relative overflow-hidden p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-black/80 border border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-4">
                      <div className={`absolute -bottom-10 -right-10 w-48 h-48 sm:w-64 sm:h-64 opacity-[0.04] dark:opacity-[0.07] rotate-[-15deg] pointer-events-none transition-all duration-500 z-0 ${selectedTrack === "fullstack" ? "dark:invert" : ""}`}>
                        <Image 
                          src={`https://cdn.simpleicons.org/${
                            selectedTrack === "frontend" ? "react" : 
                            selectedTrack === "backend" ? "nodedotjs" : 
                            selectedTrack === "fullstack" ? "nextdotjs" : 
                            selectedTrack === "devops" ? "docker" : 
                            selectedTrack === "ai" ? "python" : "react"
                          }`} 
                          alt="track icon" 
                          fill 
                          className="object-contain" 
                          unoptimized 
                        />
                      </div>
                      
                      <div className="relative z-10">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2 font-heading">
                          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-600 dark:text-brand-400" />{selectedTrackInfo.title}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">{selectedTrackInfo.desc}</p>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <span className="block text-[9px] sm:text-[10px] font-mono tracking-widest text-brand-700 dark:text-brand-400 uppercase font-bold">Core Task Curriculum:</span>
                        <div className="space-y-2 sm:space-y-2.5 max-h-[140px] sm:max-h-[160px] lg:max-h-[200px] overflow-y-auto pr-1">
                          {selectedTrackInfo.tasks.map((task) => (
                            <div key={task.id} className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                                <span className="text-brand-600 dark:text-brand-400 font-bold">{task.id}</span>
                                <span className="text-slate-800 dark:text-slate-300 font-semibold line-clamp-1 text-right ml-2">{task.title}</span>
                              </div>
                              <p className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 leading-normal line-clamp-2">{task.scope}</p>
                              <p className="text-[8px] sm:text-[9px] text-slate-500 italic line-clamp-1">Criteria: {task.criteria}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 sm:pt-6 flex items-center justify-between border-t border-slate-200 dark:border-neutral-800">
                    <button onClick={prevStep} className="btn-secondary cursor-pointer text-xs">
                      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Developer Info
                    </button>
                    <button onClick={nextStep} className="btn-primary cursor-pointer text-xs">
                      Verify & Review <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </AnimateOnScroll>
            )}

            {step === 4 && (
              <AnimateOnScroll key="step4" variant="fadeInScale">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading line-clamp-1">Confirm Internship Application Specs</h2>
                    <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-2">Verify candidate profile variables. These metrics write to active database records and cannot be altered.</p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-[10px] sm:text-xs font-mono">
                      <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
                        <span className="block text-slate-500 uppercase text-[8px] sm:text-[9px] tracking-wider mb-0.5">Applicant Name</span>
                        <span className="text-slate-900 dark:text-white font-bold line-clamp-1">{fullName}</span>
                      </div>
                      <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
                        <span className="block text-slate-500 uppercase text-[8px] sm:text-[9px] tracking-wider mb-0.5">Active Gateway Email</span>
                        <span className="text-slate-900 dark:text-white font-bold line-clamp-1">{email}</span>
                      </div>
                      <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 sm:col-span-2">
                        <span className="block text-slate-500 uppercase text-[8px] sm:text-[9px] tracking-wider mb-0.5">Specialization Track</span>
                        <span className="text-brand-700 dark:text-brand-400 font-bold line-clamp-1">{selectedTrackInfo.title}</span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/30 flex gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] text-brand-900 dark:text-brand-200 leading-normal">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                      <div><strong>Systems Operation Confirm:</strong> On submission, database sequence algorithms will atomically lock transaction rows to generate your unique Roll Number, sending background Apps Script integrations instantly.</div>
                    </div>
                  </div>
                  <div className="pt-4 sm:pt-6 flex items-center justify-between border-t border-slate-200 dark:border-neutral-800">
                    <button onClick={prevStep} disabled={isSubmitting} className="btn-secondary cursor-pointer text-xs disabled:opacity-50">
                      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Change Track
                    </button>
                    <button onClick={handleSubmit} disabled={isSubmitting}
                      className="btn-primary cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmitting ? (<><span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating Credentials...</>) : (<>Commit Application <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></>)}
                    </button>
                  </div>
                </div>
              </AnimateOnScroll>
            )}

            {step === 5 && successData && (
              <AnimateOnScroll key="step5" variant="fadeInScale">
                <div className="space-y-4 sm:space-y-5 text-center py-2 sm:py-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-500/10 border border-brand-400/30 text-brand-600 dark:text-brand-400 mb-1 sm:mb-2">
                    <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-brand-700 dark:text-brand-400 font-mono text-[9px] sm:text-xs uppercase tracking-widest font-bold">SYSTEMS INTAKE COMPLETE • SECURE GATEWAY OPENED</div>
                    <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading line-clamp-2">Candidate Profile Registered Successfully</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed line-clamp-2">Welcome to the engineering division of SAMStack Tech. Your identity has been recorded into our active database.</p>
                  </div>
                  <div className="max-w-md mx-auto p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-black/80 border border-brand-500/20 relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                    <span className="block text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-1">Your Immutable Roll Number</span>
                    <div className="text-2xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-wider my-2 sm:my-3 flex items-center justify-center line-clamp-1">{successData.rollNumber}</div>
                    <button onClick={handleCopyRoll} className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-500 transition-all text-[10px] sm:text-xs text-brand-700 dark:text-brand-400 font-mono cursor-pointer">
                      <Clipboard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{copied ? "COPIED TO SYSTEM" : "COPY TO CLIPBOARD"}
                    </button>
                  </div>
                  <div className="max-w-lg mx-auto p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 text-left text-[10px] sm:text-xs font-mono space-y-2 sm:space-y-3">
                    <span className="block text-[9px] sm:text-[10px] tracking-widest text-brand-700 dark:text-brand-400 uppercase font-bold">Next Immediate Actions Required:</span>
                    <div className="space-y-1.5 sm:space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                      <p className="flex gap-1.5 sm:gap-2"><span className="text-brand-600 dark:text-brand-400 font-bold">1.</span><span className="line-clamp-2">Check your engineering email inbox (<strong>{successData.email}</strong>) for your dynamically drafted Offer Letter containing task guidelines.</span></p>
                      <p className="flex gap-1.5 sm:gap-2"><span className="text-brand-600 dark:text-brand-400 font-bold">2.</span><span className="line-clamp-2">Review the 5 specialized tasks mapped to your track. Develop at least 3 high-performance projects.</span></p>
                      <p className="flex gap-1.5 sm:gap-2"><span className="text-brand-600 dark:text-brand-400 font-bold">3.</span><span className="line-clamp-2">Submit your repository links, live staging coordinates, and progress checklists using the <a href="/internship/submit" className="underline text-brand-600 hover:text-brand-500 dark:text-brand-400 font-semibold">Work Submission Portal</a>.</span></p>
                    </div>
                  </div>
                  <div className="pt-2 sm:pt-4 flex justify-center">
                    <a href="/internship/submit" className="btn-primary cursor-pointer text-xs">
                      Go to Submission Portal <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>
                  </div>
                </div>
              </AnimateOnScroll>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

const TRACKS_PREVIEW = [
  { id: "PYTHON", icon: <BrainCircuit className="w-5 h-5" />, label: "Python", color: "from-yellow-500 to-amber-500" },
  { id: "UI_UX", icon: <Sparkles className="w-5 h-5" />, label: "UI/UX Design", color: "from-pink-500 to-rose-500" },
  { id: "CPP", icon: <Cpu className="w-5 h-5" />, label: "C++ Systems", color: "from-slate-500 to-slate-700" },
  { id: "WEB_DEV", icon: <Globe className="w-5 h-5" />, label: "Web Dev", color: "from-cyan-500 to-sky-500" },
  { id: "REACT", icon: <Code className="w-5 h-5" />, label: "React", color: "from-blue-500 to-cyan-500" },
  { id: "NEXT_JS", icon: <GitBranch className="w-5 h-5" />, label: "Next.js", color: "from-neutral-600 to-neutral-900" },
  { id: "MERN", icon: <Zap className="w-5 h-5" />, label: "MERN Stack", color: "from-emerald-500 to-teal-500" },
];

const STATS = [
  { val: "7", label: "Specialization Tracks", icon: <Layers className="w-5 h-5" /> },
  { val: "5", label: "Projects Per Track", icon: <Code2 className="w-5 h-5" /> },
  { val: "100+", label: "Interns Enrolled", icon: <Users className="w-5 h-5" /> },
  { val: "Free", label: "Zero Cost to Apply", icon: <Trophy className="w-5 h-5" /> },
];

export default function InternshipPage() {
  return (
    <div className="flex-1 w-full">

      <section className="relative py-24 sm:py-32 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black pt-32 sm:pt-40">
        <div className="absolute inset-0 w-full h-full lg:w-1/2 lg:left-1/2 overflow-hidden hidden lg:block border-l border-slate-200 dark:border-neutral-800">
          <Image src="/internship-hero.png" alt="Engineers collaborating" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 dark:from-black via-slate-50/50 dark:via-black/50 to-transparent" />
        </div>
        
        <div className="absolute inset-0 w-full h-full block lg:hidden opacity-20">
          <Image src="/internship-hero.png" alt="Engineers collaborating" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-black via-slate-50/80 dark:via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <AnimateOnScroll variant="fadeUp" className="max-w-2xl space-y-4 sm:space-y-5">
            <div className="section-label w-fit">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />Elite Engineering Internship
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
              Build Real Systems.<br />
              <span className="text-gradient-brand">
                Earn a Verified Credential.
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm lg:text-base leading-relaxed">
              Join SAMStack Tech&apos;s elite internship program. Ship 5 real-world production projects, get mentored by senior engineers, and walk away with a cryptographically-verified certificate.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2">
              {TRACKS_PREVIEW.map((track) => (
                <a key={track.id} href="#apply-now"
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-brand-400 transition-all shadow-sm">
                {track.icon}
                {track.label}
              </a>
            ))}
          </div>

            <div className="flex flex-wrap gap-3 sm:gap-4 pt-3 sm:pt-6">
              <a href="#apply-now" className="btn-primary group">
                Apply Now <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link href="/verify" className="btn-secondary group">
                Verify Certificate <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-20 sm:py-28 flex flex-col items-center justify-center px-4 sm:px-6 bg-white dark:bg-neutral-950 border-y border-slate-100 dark:border-neutral-900">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 w-full">
          <AnimateOnScroll variant="stagger" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="hover-lift group p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-brand-400 dark:hover:border-brand-600 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">{stat.val}</p>
                <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 mt-1 font-mono">{stat.label}</p>
              </div>
            ))}
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" className="flex items-center gap-3 sm:gap-4">
            <div className="section-label inline-flex"><GitBranch className="w-3.5 h-3.5" />Specialization Tracks</div>
            <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">Choose Your Engineering Path</h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">7 production-grade specialization tracks. Each one comes with 5 real projects, expert guidance, and a verifiable credential upon completion.</p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="stagger" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Object.values(tracks).map((track, i) => (
              <a key={track.id} href="#apply-now" className="hover-lift group p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-brand-400 dark:hover:border-brand-600 flex flex-col gap-2 sm:gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${TRACKS_PREVIEW[i % TRACKS_PREVIEW.length].color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {TRACKS_PREVIEW[i % TRACKS_PREVIEW.length].icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-heading group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{track.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{track.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-brand-600 dark:text-brand-400 uppercase tracking-widest pt-1">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{track.tasks.length} projects
                </div>
              </a>
            ))}
          </AnimateOnScroll>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 flex flex-col items-center justify-center bg-slate-50 dark:bg-black px-4 sm:px-6">
        <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-brand-600/8 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 -right-32 w-[350px] h-[350px] bg-indigo-600/8 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.07] dark:opacity-[0.05]" />

        <AnimateOnScroll variant="fadeInScale" className="relative z-10 text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div className="section-label mx-auto w-fit">
            <Code2 className="w-3.5 h-3.5" />Real Production Projects
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight max-w-4xl mx-auto">
            Don&apos;t Just Learn.{" "}
            <span className="text-gradient-brand">
              Build & Ship.
            </span>{" "}
            Get{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Verified.
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Every project in the SAMStack internship program is built on real-world enterprise patterns. You don&apos;t get homework — you get production specs, architecture briefs, and deployment targets.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center pt-2">
            <a href="#apply-now" className="btn-primary group">
              Apply Now <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/verify" className="btn-secondary group">
              Verify a Certificate <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </AnimateOnScroll>
      </section>

      <Suspense fallback={<div className="py-32 flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>
        <InternshipFormSection />
      </Suspense>

    </div>
  );
}
