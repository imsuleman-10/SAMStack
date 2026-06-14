"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  CheckCircle,
  Copy,
  Clock,
  FileDown,
  ShieldCheck
} from "lucide-react";

interface Certificate {
  certificateNumber: string;
  associatedRollNumber: string;
  recipientName: string;
  trackTitle: string;
  issuanceDate: string;
  isValid: boolean;
}

interface CertificateClientProps {
  certificate: Certificate;
  certHash: string;
}

export default function CertificateClient({ certificate, certHash }: CertificateClientProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
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
    const element = certificateRef.current;
    if (!element) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: 0,
        filename: `SAMStack_Certificate_${certificate.recipientName.replace(/\s+/g, "_")}.pdf`,
        image: { type: "jpeg" as const, quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: "#ffffff"
        },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" as const }
      };

      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Failed to download PDF", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-100 text-slate-900 py-12 px-4 sm:px-6 flex flex-col justify-center items-center font-sans">

      <style jsx global>{`
        @media print {
          body, html, main {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          .certificate-print-box {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 297mm !important; height: 210mm !important;
            padding: 0 !important; margin: 0 !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
          }
          @page { size: A4 landscape; margin: 0; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap');
      `}</style>

      <div className="max-w-5xl mx-auto space-y-8 w-full">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
          <Link href="/internship" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Internship
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleDownloadPDF} disabled={downloading} className="px-6 py-2.5 bg-black hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-md cursor-pointer disabled:opacity-50 transition-all flex items-center gap-2">
              {downloading ? <><Clock className="w-4 h-4 animate-spin" /> Generating...</> : <><FileDown className="w-4 h-4" /> Download PDF</>}
            </button>
            <button onClick={handlePrint} className="px-6 py-2.5 bg-white border border-slate-200 hover:border-blue-600 text-black text-xs font-bold uppercase tracking-widest rounded-md transition-all flex items-center gap-2 shadow-sm cursor-pointer">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>

        {/* Modern Professional Certificate Panel */}
        <div
          ref={certificateRef}
          className="certificate-print-box relative bg-white overflow-hidden shadow-2xl aspect-[1.414/1] w-full p-8 flex flex-col justify-center"
        >
          {/* Minimalist Geometric Accents */}
          <div className="absolute top-0 left-0 w-full h-3 bg-black z-10" />
          <div className="absolute top-3 left-0 w-full h-1 bg-blue-600 z-10" />

          <div className="absolute bottom-0 left-0 w-full h-3 bg-black z-10" />
          <div className="absolute bottom-3 left-0 w-full h-1 bg-blue-600 z-10" />

          {/* Thin internal border structure */}
          <div className="absolute inset-0 border border-slate-200 m-12 pointer-events-none z-10" />
          <div className="absolute inset-0 border border-slate-100 m-[50px] pointer-events-none z-10" />

          {/* Subtle Watermark Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none z-0">
            <img src="/logo.png" alt="Watermark" className="w-[600px] h-[600px] object-contain filter grayscale" />
          </div>

          <div className="relative z-20 flex flex-col items-center text-center h-full justify-between py-12 px-16">

            {/* Header */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-black flex items-center justify-center p-3">
                <img src="/logo.png" alt="SAMStack Logo" className="w-full h-full object-contain filter invert brightness-0" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-black tracking-[0.3em] uppercase">SAMStack Tech</h1>
                <p className="text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase mt-2">Software Systems Studio</p>
              </div>
            </div>

            {/* Main Body */}
            <div className="space-y-6 w-full">
              <p className="text-sm text-slate-500 tracking-widest uppercase font-semibold">
                Certificate of Completion
              </p>

              <h2 className="text-5xl md:text-6xl font-bold text-black" style={{ fontFamily: "'Playfair Display', serif" }}>
                {certificate.recipientName}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 tracking-wide max-w-2xl mx-auto px-4 leading-relaxed">
                has successfully fulfilled the rigorous architectural and engineering requirements for the
              </p>

              <div className="text-2xl md:text-3xl font-black text-blue-600 uppercase tracking-widest py-2">
                {certificate.trackTitle}
              </div>

              <p className="text-[10px] sm:text-xs text-slate-500 max-w-xl mx-auto leading-loose">
                Demonstrating outstanding technical proficiency, system design excellence, and dedication to enterprise-grade software development.
              </p>
            </div>

            {/* Footer / Signatures */}
            <div className="flex justify-between items-end w-full px-8 relative">
              {/* ID & Date */}
              <div className="text-left flex-1 border-l-2 border-blue-600 pl-4 py-1">
                <p className="text-[10px] text-slate-500 font-mono mb-1">ISSUED: <span className="font-bold text-black">{formatDate(certificate.issuanceDate)}</span></p>
                <p className="text-[10px] text-slate-500 font-mono mb-1">CREDENTIAL ID: <span className="font-bold text-black">{certificate.certificateNumber}</span></p>
                <p className="text-[8px] text-slate-400 font-mono">HASH: {certHash.substring(0, 32)}...</p>
              </div>

              {/* Digital Seal */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-24 bg-white flex flex-col items-center justify-center z-30">
                <div className="w-full h-full border-[2px] border-black flex flex-col items-center justify-center relative">
                  <div className="absolute inset-1 border border-blue-600 flex flex-col items-center justify-center bg-slate-50">
                    <ShieldCheck className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="text-[7px] font-black text-black tracking-[0.2em] uppercase">Verified</span>
                    <span className="text-[5px] text-blue-600 uppercase tracking-widest mt-0.5 font-bold">Credential</span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="text-right flex-1 flex flex-col items-end">
                <div className="relative">
                  <img src="/logo.png" alt="Signature" className="w-28 h-10 object-contain opacity-20 grayscale mix-blend-multiply absolute bottom-2 right-0" />
                  <div className="w-56 h-[1px] bg-black mb-2 relative z-10" />
                </div>
                <p className="text-[11px] font-black text-black uppercase tracking-widest">Suleman Zaheer</p>
                <p className="text-[8px] text-blue-600 font-bold uppercase tracking-[0.1em] mt-1">
                  Founder | Full-Stack Engineer | Industrial Entrepreneur
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Share buttons (Screen Only) */}
        <div className="flex justify-center gap-4 pt-4 no-print">
          <button onClick={handleCopyLink} className="px-8 py-3 bg-white border border-slate-200 hover:border-black text-xs font-bold uppercase tracking-widest text-black transition-all shadow-sm flex items-center gap-2 cursor-pointer rounded-md">
            {copied ? <><CheckCircle className="w-4 h-4 text-blue-600" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Public Link</>}
          </button>
        </div>

      </div>
    </div>
  );
}