"use client";

import React, { useState } from "react";
import { 
  Terminal, 
  GitBranch, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ChevronRight, 
  Undo2,
  FileText,
  Rocket
} from "lucide-react";
import { tracks } from "@/lib/curriculum";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

const FigmaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 9h3.5a3.5 3.5 0 1 1 0 7H12V9z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
  </svg>
);

interface InternInfo {
  fullName: string;
  email: string;
  track: 'PYTHON' | 'UI_UX' | 'CPP' | 'WEB_DEV' | 'REACT' | 'NEXT_JS' | 'MERN';
  status: 'APPLIED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  submission: null | {
    githubRepositoryUrl: string;
    liveDeploymentUrl?: string;
    figmaProjectUrl?: string;
    studentNotes: string;
    completedTasks: number[];
  };
}

export default function WorkSubmissionPortal() {
  const [emailInput, setEmailInput] = useState("");
  const [rollInput, setRollInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [intern, setIntern] = useState<InternInfo | null>(null);
  
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [checkedTaskIndices, setCheckedTaskIndices] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !rollInput) {
      setError("Please complete all credential fields.");
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      const response = await fetch(`/api/internship/info?email=${encodeURIComponent(emailInput.trim())}&rollNumber=${encodeURIComponent(rollInput.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to locate applicant.");
      }

      setIntern(data);
      
      if (data.submission) {
        setGithubUrl(data.submission.githubRepositoryUrl || "");
        setLiveUrl(data.submission.liveDeploymentUrl || "");
        setFigmaUrl(data.submission.figmaProjectUrl || "");
        setNotes(data.submission.studentNotes || "");
        setCheckedTaskIndices(data.submission.completedTasks || []);
      }
    } catch (err: any) {
      setError(err.message || "Credential authentication failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleToggleTask = (index: number) => {
    setCheckedTaskIndices((prev) => 
      prev.includes(index) 
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleSubmitWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intern) return;

    setError(null);
    
    if (!githubUrl.trim().toLowerCase().startsWith("https://github.com/")) {
      setError("GitHub Repository URL must start with 'https://github.com/'");
      return;
    }

    if (intern.track === "UI_UX") {
      if (!figmaUrl.trim().startsWith("https://")) {
        setError("Figma Project URL must start with 'https://'");
        return;
      }
    } else {
      if (!liveUrl.trim().startsWith("https://")) {
        setError("Live Staging Deployment URL must start with 'https://'");
        return;
      }
    }

    if (checkedTaskIndices.length < 3) {
      setError("Honor Covenant Violation: You must complete and check at least 3 tasks.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/internship/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: intern.email,
          rollNumber: rollInput.trim(),
          githubUrl,
          liveUrl: intern.track !== "UI_UX" ? liveUrl : undefined,
          figmaUrl: intern.track === "UI_UX" ? figmaUrl : undefined,
          notes,
          completedTasks: checkedTaskIndices
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetGate = () => {
    setIntern(null);
    setSuccess(false);
    setEmailInput("");
    setRollInput("");
    setGithubUrl("");
    setLiveUrl("");
    setFigmaUrl("");
    setNotes("");
    setCheckedTaskIndices([]);
    setError(null);
  };

  const activeTrackInfo = intern ? tracks[intern.track] : null;

  return (
    <div className="py-20 sm:py-28 flex items-center justify-center relative pt-32 sm:pt-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-neutral-950 dark:to-black">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/8 dark:bg-brand-500/5 rounded-full filter blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/8 dark:bg-indigo-500/5 rounded-full filter blur-[150px] pointer-events-none -z-10" />

      <AnimateOnScroll variant="fadeInScale" className="max-w-3xl w-full">
        <div className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-650 via-brand-500 to-indigo-500" />
          
          <div className="p-4 sm:p-12">
            
            {error && (
              <AnimateOnScroll variant="fadeIn">
                <div className="mb-8 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 dark:border-rose-500/30 flex items-start gap-3 text-rose-700 dark:text-rose-250 text-sm font-sans">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Credential block check:</span> {error}
                  </div>
                </div>
              </AnimateOnScroll>
            )}

            {!intern && (
              <AnimateOnScroll key="gate1" variant="fadeInScale">
                <div className="space-y-6">
                  <div className="space-y-2 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/30 text-brand-600 dark:text-brand-400 mx-auto mb-3">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
                      Secure Submission Access
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                      Verify applicant registration records to open task templates workspace fields. 
                    </p>
                  </div>

                  <form onSubmit={handleVerify} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                        Registered Developer Email
                      </label>
                      <input 
                        type="email" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="e.g. developer@samstack.com"
                        className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-neutral-800 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder-slate-400 transition-all font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                        SAMStack Roll Number
                      </label>
                      <input 
                        type="text" 
                        value={rollInput}
                        onChange={(e) => setRollInput(e.target.value)}
                        placeholder="e.g. SAM-2026-0001"
                        className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-955/30 border border-slate-200 dark:border-neutral-800 text-slate-955 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder-slate-400 transition-all font-mono tracking-wider"
                        required
                      />
                      <p className="text-[10px] text-slate-500 font-mono">Issued atomically during the intake process.</p>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={isVerifying}
                        className="btn-primary w-full cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isVerifying ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Resolving Applicant Node...
                          </>
                        ) : (
                          <>
                            Open Submission Portal
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </AnimateOnScroll>
            )}

            {intern && !success && (
              <AnimateOnScroll key="gate2" variant="fadeInScale">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-brand-600 dark:text-brand-400 uppercase font-bold">
                        Applicant Authorized Node • {rollInput.trim()}
                      </span>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
                        Developer Workspace: {intern.fullName}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Specialization Track: <strong className="text-slate-800 dark:text-slate-200">{activeTrackInfo?.title}</strong>
                      </p>
                    </div>

                    <button 
                      onClick={handleResetGate}
                      className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  </div>

                  <form onSubmit={handleSubmitWorkspace} className="space-y-6">
                    
                    <div className="space-y-3">
                      <label className="block text-xs font-mono uppercase tracking-widest text-brand-600 dark:text-brand-400 font-semibold">
                        Specialized Tasks Verification Checklist (Select min 3 of 5):
                      </label>

                      <div className="space-y-2.5">
                        {activeTrackInfo?.tasks.map((task, index) => {
                          const isChecked = checkedTaskIndices.includes(index);
                          return (
                            <div 
                              key={task.id}
                              onClick={() => handleToggleTask(index)}
                              className={`hover-lift p-4 rounded-xl border text-xs font-mono transition-all duration-200 cursor-pointer select-none ${
                                isChecked 
                                  ? "bg-brand-50 dark:bg-brand-950/10 border-brand-300 dark:border-brand-500/40 text-slate-900 dark:text-white" 
                                  : "bg-slate-50/50 dark:bg-black/40 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="mt-0.5 accent-brand-500 w-4 h-4 rounded shrink-0 cursor-pointer"
                                />
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-brand-600 dark:text-brand-400 font-bold">{task.id}</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans leading-normal">{task.scope}</p>
                                  <p className="text-[9px] text-slate-500 dark:text-slate-500 font-sans italic">Success Criteria: {task.criteria}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-500">
                        <span>Tasks Completed Checked: <strong className={checkedTaskIndices.length >= 3 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>{checkedTaskIndices.length} / 5</strong></span>
                        <span>Min Required: 3 Tasks</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                          GitHub Repository URL
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <GitBranch className="w-4 h-4" />
                          </div>
                          <input 
                            type="text"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/username/repository"
                            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-neutral-800 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder-slate-400 transition-all font-mono"
                            required
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">Ensure the repository is public and contains your documentation.</p>
                      </div>

                      {intern.track === "UI_UX" ? (
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                            Figma Workspace Project URL
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                              <FigmaIcon className="w-4 h-4 text-rose-500" />
                            </div>
                            <input 
                              type="text"
                              value={figmaUrl}
                              onChange={(e) => setFigmaUrl(e.target.value)}
                              placeholder="https://figma.com/file/project-id"
                              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-neutral-800 text-slate-955 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder-slate-400 transition-all font-mono"
                              required
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">Provide the interactive prototype share link.</p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                            Live Staging Deployment URL
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
                            </div>
                            <input 
                              type="text"
                              value={liveUrl}
                              onChange={(e) => setLiveUrl(e.target.value)}
                              placeholder="https://your-app.vercel.app"
                              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-neutral-800 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder-slate-400 transition-all font-mono"
                              required
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">Required: Live staging endpoint (e.g. Vercel, Netlify, or similar).</p>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                          System Architect Engineering Notes
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Detail architecture challenges, technology highlights, optimizations, or details about the tasks."
                          className="w-full p-4 text-sm rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-neutral-800 text-slate-955 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder-slate-400 transition-all h-28 resize-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <span className="text-[10px] font-mono text-slate-500 max-w-sm">
                        *By submitting, you certify that all completed tasks satisfy the honor guidelines.
                      </span>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Transmitting Code Deck...
                          </>
                        ) : (
                          <>
                            Commit Work Submission
                            <Rocket className="w-4 h-4 text-brand-300" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </AnimateOnScroll>
            )}

            {success && (
              <AnimateOnScroll key="gate3" variant="fadeInScale">
                <div className="space-y-5 text-center py-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-600 dark:text-emerald-400 mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-3">
                    <div className="text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
                      TRANSMISSION SUCCESSFUL • WORK ARCHIVED
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
                      Submission Registry Created
                    </h2>
                    <p className="text-slate-655 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                      Your completed technical projects have been integrated into our testing index. 
                      Your status has been updated to <strong className="text-slate-800 dark:text-white font-semibold">SUBMITTED</strong>. 
                    </p>
                  </div>

                  <div className="hover-lift p-5 rounded-xl bg-slate-50 dark:bg-black/80 border border-slate-200 dark:border-neutral-800 text-left text-xs max-w-md mx-auto space-y-3 font-mono">
                    <span className="block text-[10px] text-brand-600 dark:text-brand-400 tracking-wider uppercase font-bold">
                      Next System Lifecycle Phase:
                    </span>
                    <div className="space-y-2 text-slate-600 dark:text-slate-300">
                      <p className="flex gap-2">
                        <span className="text-brand-500 font-bold">•</span>
                        <span><strong>Manual Audit:</strong> SAMStack System Administrators will audit your code repositories and live endpoints.</span>
                      </p>
                      <p className="flex gap-2">
                        <span className="text-brand-500 font-bold">•</span>
                        <span><strong>Email Dispatch:</strong> Approved metrics will automatically lock the UI and trigger secure workflows to email your Certificate and Letter of Recommendation.</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={handleResetGate}
                      className="btn-secondary cursor-pointer"
                    >
                      View / Modify Submission
                    </button>
                  </div>
                </div>
              </AnimateOnScroll>
            )}

          </div>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
