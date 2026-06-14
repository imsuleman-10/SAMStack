"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Globe, 
  Mail, 
  Terminal,
  Printer,
  ShieldCheck,
  CheckCircle,
  FileDown
} from "lucide-react";

interface Intern {
  rollNumber: string;
  fullName: string;
  email: string;
  university: string;
  trackSelected: string;
  applicationTimestamp: string;
  status: string;
}

interface OfferLetterClientProps {
  intern: Intern;
  trackTitle: string;
}

export default function OfferLetterClient({ intern, trackTitle }: OfferLetterClientProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    if (downloading) return;
    const element = printAreaRef.current;
    if (!element) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      
      const opt = {
        margin: 0.2,
        filename: `SAMStack_OfferLetter_${intern.rollNumber}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          backgroundColor: "#ffffff"
        },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const }
      };

      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Failed to download PDF", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#070b13] text-slate-100 py-12 px-4 sm:px-6 relative">
      {/* Immersive Floating Cyber Gradients (Screen Only) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none no-print" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full filter blur-[120px] pointer-events-none no-print" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full filter blur-[160px] pointer-events-none no-print" />
      
      {/* Decorative Grid Overlay (Screen Only) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10 no-print" />

      {/* Dynamic Print CSS Injector */}
      <style jsx global>{`
        @media print {
          header, footer, .no-print, nav, button, .global-nav, .bg-orbs {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          body, html, main {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-letterhead {
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
            padding: 20mm 15mm !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          @page {
            size: letter portrait;
            margin: 0;
          }

          .print-text-dark { color: #0f172a !important; }
          .print-text-muted { color: #475569 !important; }
          .print-border-cyan { border-color: #0891b2 !important; }
          .print-border-light { border-color: #cbd5e1 !important; }
          .print-bg-slate { background-color: #f8fafc !important; }
          .print-brand-text { color: #0f172a !important; }
          .print-accent-text { color: #0891b2 !important; }
          .print-watermark { opacity: 0.05 !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation Breadcrumbs & Dynamic Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10 no-print">
          <div className="space-y-1">
            <Link 
              href="/internship" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400/80 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Internship Portal
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mt-1">
              <FileText className="w-5 h-5 text-cyan-400" />
              Verified Onboarding Credentials
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:from-cyan-600 active:to-blue-700 text-xs font-bold uppercase tracking-wider text-white rounded-lg shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>
            <button 
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Letter
            </button>
          </div>
        </div>

        {/* 10000x BETTER DESIGNED LETTERHEAD CONTAINER */}
        <div 
          ref={printAreaRef}
          id="printable-area"
          className="print-letterhead relative rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] bg-[#0c121e]/90 p-8 sm:p-12 md:p-16 space-y-12"
        >
          {/* Subtle Cyber Grid Watermark (Screen Only) */}
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none no-print" />
          
          {/* Glowing Vector Brand Ornament (Screen Only) */}
          <div className="absolute right-[-100px] top-[150px] w-[350px] h-[350px] border border-cyan-500/10 rounded-full flex items-center justify-center pointer-events-none no-print">
            <div className="w-[280px] h-[280px] border border-cyan-500/5 rounded-full flex items-center justify-center animate-[spin_40s_linear_infinite]">
              <div className="w-8 h-8 bg-cyan-500/10 rounded-full" />
            </div>
          </div>

          {/* Premium Top Corporate Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-cyan-500 pb-8 print-border-cyan">
            {/* Elegant Brand Logo & Typography */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#090e17] border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.25)] print-border-cyan">
                <img 
                  src="/logo.png" 
                  alt="SAMStack Tech Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white uppercase print-brand-text">
                  SAMStack <span className="text-cyan-400 print-accent-text">Tech</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-mono font-bold print-text-muted">
                  SOFTWARE SYSTEMS STUDIO
                </span>
              </div>
            </div>

            {/* Structured Executive Metadata Address */}
            <div className="flex flex-col text-left sm:text-right font-mono text-[10px] text-slate-400 space-y-1.5 print-text-muted">
              <div className="flex items-center sm:justify-end gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse no-print" />
                <span className="font-semibold text-slate-300 print-text-dark">SAMStack Corporate Office</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400 print-accent-text" />
                <span>www.samstack.tech</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400 print-accent-text" />
                <span>support@samstack.tech</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 print-accent-text" />
                <span>Remote Operations Headquarters</span>
              </div>
            </div>
          </div>

          {/* Letter Info Block / Recipient-Document Index */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 px-6 rounded-xl bg-white/[0.01] border border-white/5 print-bg-slate print-border-light text-slate-300 print-text-dark">
            <div className="space-y-2">
              <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold print-accent-text">RECIPIENT DOSSIER</div>
              <div className="text-base font-extrabold text-white print-brand-text">{intern.fullName}</div>
              <div className="font-mono text-xs text-slate-400 print-text-muted">{intern.email}</div>
              <div className="text-xs text-slate-300 print-text-dark font-medium flex items-center gap-1.5">
                <span>🏛️</span> {intern.university}
              </div>
            </div>

            <div className="space-y-2 text-left md:text-right">
              <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold print-accent-text">REGISTRY PROTOCOL</div>
              <div className="text-xs">Registry ID: <span className="font-mono font-bold text-cyan-400 print-accent-text">{intern.rollNumber}</span></div>
              <div className="text-xs">Date of Issue: <span className="font-semibold text-slate-100 print-brand-text">{formatDate(intern.applicationTimestamp)}</span></div>
              <div className="text-xs">Specialization Track: <span className="font-semibold text-slate-100 print-brand-text">{trackTitle}</span></div>
            </div>
          </div>

          {/* Luxury Typography Content Body */}
          <div className="space-y-6 text-sm sm:text-base text-slate-300 leading-relaxed text-justify font-sans print-text-dark">
            <p className="font-bold text-white print-brand-text text-lg">
              Dear {intern.fullName.split(" ")[0]},
            </p>

            <p>
              On behalf of <strong className="text-white print-brand-text">SAMStack Tech</strong>, I am pleased to formally extend this invitation to join our digital systems engineering residency as an Intern specializing in <span className="text-cyan-400 font-extrabold print-accent-text">{trackTitle}</span>.
            </p>

            <p>
              SAMStack Tech operates as a premium software systems studio, architecting robust scalable platforms, advanced cloud networks, and elegant user environments. We pride ourselves on pushing technical boundaries, utilizing optimized methodologies, and maintaining absolute codebase excellence.
            </p>

            {/* Masterclass Highlight Banner for Rules */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-950/20 to-blue-950/10 border border-cyan-500/20 space-y-4 print-bg-slate print-border-light relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-cyan-500/5 rounded-full filter blur-xl pointer-events-none no-print" />
              
              <h4 className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2 print-accent-text">
                <Terminal className="w-4 h-4" />
                Cohort Operations & Specialization Standards:
              </h4>
              <ul className="space-y-3 pl-1 text-slate-400 print-text-dark text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 print-accent-text font-bold mt-0.5">•</span>
                  <span><strong className="text-slate-200 print-brand-text">Self-Paced Decentralization:</strong> This cohort operates asynchronously. You will navigate structural engineering milestones independently with complete workflow control.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 print-accent-text font-bold mt-0.5">•</span>
                  <span><strong className="text-slate-200 print-brand-text">Production Level Vetting:</strong> Your deliverables must strictly meet architectural requirements. Submission parameters include functional git source repositories and live server deployments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 print-accent-text font-bold mt-0.5">•</span>
                  <span><strong className="text-slate-200 print-brand-text">Secure Credentials Ledger:</strong> Upon validation of all specialized tracks by our system operators, your profile will be registered in our cryptographic ledger, issuing a dynamic digital certificate.</span>
                </li>
              </ul>
            </div>

            <p>
              This educational residency is designed to accelerate your technical skills, establish an advanced professional portfolio, and replicate state-of-the-art startup pipelines. The recommended duration for cohort completion is between 4 and 8 weeks.
            </p>

            <p>
              We are excited to witness your execution throughout the curriculum. To accept this offer, please save this verified copy of your onboarding credentials and launch your initial system module from your student workspace.
            </p>
          </div>

          {/* Premium Bottom Sign-off Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end pt-10 border-t border-white/10 print-border-light gap-6">
            {/* Dynamic Cryptographic Ledger Stamp */}
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest print-accent-text">
                <ShieldCheck className="w-4 h-4 text-cyan-400 print-accent-text" />
                Cryptographic Authority Proof
              </span>
              <div className="font-mono text-[9px] text-slate-400 bg-[#090e17] px-4 py-2.5 rounded-lg border border-cyan-500/20 shadow-inner print-bg-slate print-border-light print-text-muted">
                SHA256::OFFER_INT_REG{intern.rollNumber.split("-").pop()}::SECURE_LEDGER
              </div>
            </div>

            {/* Signature Block */}
            <div className="text-center sm:text-right shrink-0">
              <div className="font-serif italic text-2xl text-cyan-400 select-none print-accent-text pr-2">
                Suleman Zaheer
              </div>
              <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-cyan-400 to-transparent my-1.5 print-border-cyan" />
              <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold print-text-muted">
                Founder & Lead Engineer, SAMStack Tech
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Screen Action Bar */}
        <div className="glass-panel p-6 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs no-print shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3 text-slate-400 text-center sm:text-left">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              This digital document has been verified. You can print or download the PDF layout of this credential at any time for verification.
            </span>
          </div>
          <button 
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold uppercase tracking-wider text-black rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <Download className="w-4 h-4 text-black" />
            Download PDF Now
          </button>
        </div>
      </div>
    </div>
  );
}
