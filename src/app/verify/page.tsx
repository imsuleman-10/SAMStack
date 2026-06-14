"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Terminal, 
  Calendar, 
  GitBranch, 
  GraduationCap, 
  Check, 
  Award,
  Lock,
  ArrowRight
} from "lucide-react";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

interface VerificationResult {
  isValid: boolean;
  certificateNumber: string;
  recipientName: string;
  trackTitle: string;
  issuanceDate: string;
  rollNumber: string;
  internData: {
    university: string;
    track: string;
    completedTaskCount: number;
    githubRepositoryUrl: string;
    appliedAt: string;
  } | null;
}

export default function VerificationPortal() {
  const [certId, setCertId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerifySearch = async (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    const idToSearch = customId || certId;
    
    if (!idToSearch.trim()) {
      setError("Please input a valid Certificate ID.");
      return;
    }

    setError(null);
    setIsSearching(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/verify?id=${encodeURIComponent(idToSearch.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setResult({
            isValid: false,
            certificateNumber: idToSearch.trim().toUpperCase(),
            recipientName: "",
            trackTitle: "",
            issuanceDate: "",
            rollNumber: "",
            internData: null
          });
          return;
        }
        throw new Error(data.error || "Verification query failed.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during query execution.");
      setResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickTest = (token: string) => {
    setCertId(token);
    handleVerifySearch(undefined, token);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="py-20 sm:py-28 flex flex-col items-center justify-center relative pt-32 sm:pt-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/8 dark:bg-cyan-500/5 rounded-full filter blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/8 dark:bg-emerald-500/5 rounded-full filter blur-[150px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10 opacity-[0.07] dark:opacity-[0.05]" />

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        
        <AnimateOnScroll variant="fadeInScale">
          <div className="text-center space-y-4">
            <div className="section-label mx-auto w-fit">
              <Lock className="w-3.5 h-3.5" />
              Immutable Verification Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Immutable Public{" "}
              <span className="text-gradient-brand">Registry Portal</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              Verify academic credentials, specialization certifications, and letters of recommendation issued by SAMStack Tech.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="slideUp" delay={0.15}>
          <div className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 rounded-2xl shadow-lg space-y-4">
            <form onSubmit={(e) => handleVerifySearch(e)} className="flex gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="e.g. SAM-CERT-2026-A1B2C3D4"
                  className="w-full pl-10 pr-4 py-3 text-sm font-mono tracking-wider placeholder:font-sans uppercase bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent rounded-xl"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSearching}
                className="btn-primary shrink-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSearching ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Verify Token
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span>Try these demo tokens:</span>
              <button 
                onClick={() => handleQuickTest("SAM-CERT-2026-A1B2C3D4")}
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-semibold hover:underline cursor-pointer"
              >
                [Jane Smith (Next.js)]
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button 
                onClick={() => handleQuickTest("SAM-CERT-2026-F3A9B2E1")}
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-semibold hover:underline cursor-pointer"
              >
                [Sarah Connor (Python)]
              </button>
            </div>
          </div>
        </AnimateOnScroll>

        {error && (
          <AnimateOnScroll variant="fadeInScale">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex gap-3 text-xs text-rose-800 dark:text-rose-200">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <div>
                <strong className="text-rose-950 dark:text-rose-100">Database Search Error:</strong> {error}
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {searched && result && (
          <AnimateOnScroll variant="fadeInScale" delay={0.1}>
            {result.isValid ? (
              <div className="hover-lift bg-white dark:bg-neutral-950/80 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-xl dark:shadow-[0_0_50px_rgba(16,185,129,0.05)] relative overflow-hidden p-8 sm:p-10 space-y-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full filter blur-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500" />

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Check className="w-3.5 h-3.5" />
                      Verified Authentic Credential
                    </div>
                    <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase mt-1">
                      Token ID: {result.certificateNumber}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-450">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1 border-b border-slate-100 dark:border-neutral-800 pb-5">
                  <span className="block text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase">Graduate Developer</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{result.recipientName}</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase">Specialization Specialty</span>
                    <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{result.trackTitle}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
                      <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Issued: {formatDate(result.issuanceDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
                      <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{result.internData?.university || "SAMStack Academy"}</span>
                    </div>
                  </div>
                </div>

                {result.internData && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-neutral-800/80 space-y-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                    <span className="block text-[10px] text-cyan-600 dark:text-cyan-400 uppercase font-bold tracking-wider">
                      Archived Verification Metrics:
                    </span>
                    <div className="space-y-2">
                      <p className="flex justify-between">
                        <span className="text-slate-400 dark:text-slate-500">Roll Number:</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{result.rollNumber}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-slate-400 dark:text-slate-500">Intake Track Tasks Checked:</span>
                        <span className="text-emerald-600 dark:text-emerald-450 font-bold">{result.internData.completedTaskCount} of 5 verified</span>
                      </p>
                      {result.internData.githubRepositoryUrl && (
                        <p className="flex justify-between items-center gap-4">
                          <span className="text-slate-400 dark:text-slate-500 shrink-0">Repository:</span>
                          <a 
                            href={result.internData.githubRepositoryUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline truncate inline-flex items-center gap-1 max-w-[240px] text-[11px]"
                          >
                            <GitBranch className="w-3.5 h-3.5 shrink-0" />
                            {result.internData.githubRepositoryUrl.replace("https://github.com/", "")}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hover-lift bg-white dark:bg-neutral-950/80 border border-slate-200 dark:border-rose-500/20 rounded-2xl shadow-xl dark:shadow-[0_0_50px_rgba(244,63,94,0.05)] relative overflow-hidden p-8 sm:p-10 space-y-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 dark:bg-rose-500/10 rounded-full filter blur-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500" />

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-450 text-[10px] font-mono font-bold uppercase tracking-wider animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      CRITICAL: UNAUTHORIZED CREDENTIAL
                    </div>
                    <span className="block text-[10px] font-mono text-rose-600/80 dark:text-rose-450 uppercase mt-1">
                      Queried Token: {result.certificateNumber}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-3 font-sans">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Security Alert Raised</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    The token ID query <strong className="text-rose-600 dark:text-rose-450">{result.certificateNumber}</strong> was completed 
                    against all database indexes, returning exactly 0 matches. This means the queried credential is
                    <span className="text-rose-600 dark:text-rose-400 font-bold"> unauthenticated, forged, or has been revoked</span> due to 
                    Honor Covenant violations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900/30 text-[10px] font-mono text-rose-850 dark:text-slate-400 leading-normal">
                  <strong>operator advisory:</strong> Please verify the spelling of the certificate verification number, or report credential fraud to our engineering security node.
                </div>
              </div>
            )}
          </AnimateOnScroll>
        )}

      </div>
    </div>
  );
}
