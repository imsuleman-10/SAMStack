"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  User,
  Mail,
  Phone,
  Layers,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Code,
  MapPin,
  FileText,
  GraduationCap,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  Send,
  Building2,
  Upload,
  X,
} from "lucide-react";
import { tracks } from "@/lib/curriculum";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type EducationEntry = { degree: string; school: string; year: string };
type ExperienceEntry = { title: string; company: string; duration: string; desc: string };

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 pb-5 border-b border-slate-100 dark:border-neutral-800">
      <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
      </div>
      <div>
        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

const inputClass = "w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 font-medium";
const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5";

// ─────────────────────────────────────────────
// Main Form Component
// ─────────────────────────────────────────────
function ApplyForm() {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track");

  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [github, setGithub] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("PYTHON");
  const [covenantChecked, setCovenantChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successData, setSuccessData] = useState<{
    rollNumber: string; fullName: string; email: string; track: string;
  } | null>(null);

  // Collapsible sections
  const [openSection, setOpenSection] = useState<string | null>("personal");
  const toggle = (s: string) => setOpenSection((prev) => (prev === s ? null : s));

  useEffect(() => {
    if (trackParam && tracks[trackParam.toUpperCase()]) {
      setSelectedTrack(trackParam.toUpperCase());
    }
  }, [trackParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!covenantChecked) { setError("You must accept the Honor Covenant to submit."); return; }
    if (!firstName.trim() || !lastName.trim()) { setError("Please enter your full name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    if (!city.trim()) { setError("Please enter your city/location."); return; }

    setIsSubmitting(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const response = await fetch("/api/internship/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, track: selectedTrack }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to process application.");
      setSuccessData({ rollNumber: data.rollNumber, fullName: data.fullName, email: data.email, track: data.track });
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : null) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!successData) return;
    navigator.clipboard.writeText(successData.rollNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTrackInfo = tracks[selectedTrack] || tracks["PYTHON"];

  if (successData) {
    return (
      <div className="flex-1 min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg text-center space-y-8">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-3">
            <div className="text-brand-600 dark:text-brand-400 font-mono text-[10px] font-bold uppercase tracking-[0.25em]">
              Application Accepted
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              Welcome to SAMStack Tech!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
              Your application has been recorded. Check <strong className="text-slate-700 dark:text-slate-200">{successData.email}</strong> for your offer letter and task deck.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 shadow-lg">
            <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Your Roll Number</div>
            <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-wider mb-4">{successData.rollNumber}</div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-800/40 text-brand-700 dark:text-brand-400 text-xs font-mono font-bold hover:bg-brand-100 dark:hover:bg-brand-950/50 transition-colors cursor-pointer"
            >
              <Clipboard className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy Roll Number"}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 text-left space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Next Steps</div>
            {[
              `Check ${successData.email} for your offer letter.`,
              "Review 5 projects mapped to your track and start building.",
              "Submit your work via the Submission Portal.",
            ].map((item, i) => (
              <div key={i} className="flex gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="text-brand-500 font-bold shrink-0">{i + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link href="/internship/submit" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-lg">
            Go to Submission Portal <CheckCircle2 className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white" style={{ overflowX: "clip" }}>

      {/* ─── STICKY TOP HEADER (Devsinc-style) ─── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-slate-100 dark:border-neutral-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Link href="/internship" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <div className="w-px h-5 bg-slate-200 dark:bg-neutral-700 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-sm font-extrabold text-slate-900 dark:text-white font-heading truncate">
                  SAMStack Tech — Engineering Internship
                </h1>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Open
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    <Globe className="w-3 h-3" /> Remote
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    <Clock className="w-3 h-3" /> Part-time / Full-time
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    <Building2 className="w-3 h-3" /> Engineering Division
                  </span>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-800/40 text-brand-700 dark:text-brand-400 text-[10px] font-bold">
                <Sparkles className="w-3 h-3" /> Free • Zero Cost
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── TWO-COLUMN LAYOUT ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

        {/* ─── LEFT: Sticky Job Info Panel ─── */}
        <aside className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 space-y-4">
          
          {/* Position Info Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-cyan-500 to-indigo-500" />
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Position</div>
                <div className="text-xl font-extrabold font-heading text-slate-900 dark:text-white leading-tight">{selectedTrackInfo.title}</div>
                <div className="text-xs text-brand-600 dark:text-brand-400 font-bold">Engineering Internship</div>
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: Globe, label: "Remote (Async)" },
                  { icon: Clock, label: "3–6 Months" },
                  { icon: Building2, label: "SAMStack Tech, Lahore" },
                  { icon: GraduationCap, label: "Students & Fresh Grads" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <item.icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Track Selector */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-5 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Select Track</div>
              <div className="space-y-1.5">
                {Object.values(tracks).map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => setSelectedTrack(track.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      selectedTrack === track.id
                        ? "bg-brand-50 dark:bg-brand-950/40 border border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300"
                        : "border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span>{track.title}</span>
                    {selectedTrack === track.id && <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* What You'll Do */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-5 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {selectedTrackInfo.title} — Tasks
              </div>
              <div className="space-y-2">
                {selectedTrackInfo.tasks.map((task, i) => (
                  <div key={task.id} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-800/40 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400">{i + 1}</span>
                    </div>
                    <span className="font-medium leading-relaxed">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Covenant */}
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-800/30 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Honor Covenant</span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              All work must be original. Plagiarism results in immediate ban. Your credential is cryptographically signed and publicly verifiable.
            </p>
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={covenantChecked}
                onChange={(e) => setCovenantChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-brand-500 rounded cursor-pointer shrink-0"
              />
              <span className="text-xs text-amber-800 dark:text-amber-300 font-medium select-none">
                I accept the SAMStack Engineering Honor Covenant
              </span>
            </label>
          </div>
        </aside>

        {/* ─── RIGHT: Application Form ─── */}
        <main className="flex-1 min-w-0 space-y-4">
          
          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div><span className="font-bold">Validation Error: </span>{error}</div>
              <button onClick={() => setError(null)} className="ml-auto shrink-0 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── SECTION: Personal Information ── */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggle("personal")}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Personal Information</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Name, email, phone & location</div>
                  </div>
                </div>
                {openSection === "personal" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSection === "personal" && (
                <div className="px-6 pb-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>First Name <span className="text-rose-500">*</span></label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ali" className={inputClass} required />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name <span className="text-rose-500">*</span></label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Hassan" className={inputClass} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Email Address <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={`${inputClass} pl-10`} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 300 0000000" className={`${inputClass} pl-10`} required />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>City / Location <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lahore, Pakistan" className={`${inputClass} pl-10`} required />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION: Education ── */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggle("education")}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/50 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Education</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">University, degree & graduation year</div>
                  </div>
                </div>
                {openSection === "education" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSection === "education" && (
                <div className="px-6 pb-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>University / Institute</label>
                      <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="LUMS, NUST, FAST..." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Degree / Program</label>
                      <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="BS Computer Science" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Graduation Year</label>
                      <input type="text" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="2025 or 2026" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>CGPA (Optional)</label>
                      <input type="text" value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="3.5 / 4.0" className={inputClass} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION: Online Presence ── */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggle("links")}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/50 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Online Presence</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">LinkedIn, portfolio & GitHub</div>
                  </div>
                </div>
                {openSection === "links" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSection === "links" && (
                <div className="px-6 pb-6 space-y-5">
                  <div>
                    <label className={labelClass}>LinkedIn Profile URL</label>
                    <input type="url" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} placeholder="https://linkedin.com/in/yourname" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Portfolio / Website URL</label>
                    <input type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://yourportfolio.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>GitHub Profile URL</label>
                    <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/yourhandle" className={inputClass} />
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION: Summary ── */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggle("summary")}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Cover Letter / Summary</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Why do you want to join? What are your goals?</div>
                  </div>
                </div>
                {openSection === "summary" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSection === "summary" && (
                <div className="px-6 pb-6">
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={6}
                    placeholder="Tell us about your background, why you're interested in this track, and what you hope to build during the internship..."
                    className={`${inputClass} resize-y min-h-[140px]`}
                  />
                  <div className="flex justify-end text-[10px] text-slate-400 font-mono mt-1.5">{summary.length}/800</div>
                </div>
              )}
            </div>

            {/* ── SUBMIT ── */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Ready to apply?</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    You&apos;ll receive your Roll Number instantly after submission.
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !covenantChecked}
                  className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:shadow-brand-500/25 cursor-pointer"
                >
                  {isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    <>Submit Application <Send className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              {!covenantChecked && (
                <p className="mt-3 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  Accept the Honor Covenant in the sidebar to enable submission.
                </p>
              )}

              <p className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                Your data is secured and used only for application processing.
              </p>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
export default function InternshipApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ApplyForm />
    </Suspense>
  );
}
