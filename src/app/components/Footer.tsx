import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-neutral-800/60 bg-slate-50 dark:bg-neutral-950 relative z-10 transition-colors duration-300 mt-auto">
      {/* Top accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-brand-500 via-cyan-400 to-indigo-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-200 dark:border-neutral-800/60">
          {/* Brand & NAP (Name, Address, Phone) Microdata */}
          <div className="space-y-4 lg:col-span-1" itemScope itemType="https://schema.org/LocalBusiness">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-md bg-white border border-slate-200 dark:border-neutral-800">
                <img src="/logo.png" alt="SAMStack Tech Logo" className="w-full h-full object-contain p-1" itemProp="image" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-heading" itemProp="name">
                SAMStack <span className="text-brand-600 dark:text-brand-400">Tech</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed" itemProp="description">
              Empowering businesses with cutting-edge software solutions and accelerating careers through our elite internship ecosystem.
            </p>
            
            {/* Visible NAP Data */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-200 dark:border-neutral-800/60">
              <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <span itemProp="addressLocality">Lahore</span>, <span itemProp="addressRegion">Punjab</span>, <span itemProp="addressCountry">Pakistan</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                <a href="tel:+923285778715" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors" itemProp="telephone">+92 328 5778715</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                <a href="mailto:samstacktechs@gmail.com" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors" itemProp="email">samstacktechs@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-900 dark:text-white font-heading uppercase tracking-widest">Services</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/services/web-serverless-apps" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Web Development</Link>
              <Link href="/services/custom-enterprise-software" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Enterprise Systems</Link>
              <Link href="/services/agentic-ai-integrations" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">AI &amp; Automation</Link>
              <Link href="/services/devops-cloud-architectures" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">DevOps &amp; Cloud</Link>
              <Link href="/services/mobile-app-development" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Mobile Apps</Link>
              <Link href="/services/ui-ux-design-systems" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">UI/UX Design</Link>
              <Link href="/services/data-analytics-bi" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Data &amp; Analytics</Link>
            </div>
          </div>

          {/* Company links */}
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-900 dark:text-white font-heading uppercase tracking-widest">Company</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About Us</Link>
              <Link href="/contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact</Link>
              <Link href="/portfolio" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Portfolio</Link>
              <Link href="/blog" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Blog &amp; Insights</Link>
            </div>
          </div>

          {/* Internship links */}
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-900 dark:text-white font-heading uppercase tracking-widest">Internship</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/internship" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Apply Now</Link>
              <Link href="/internship/submit" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Submit Project</Link>
              <Link href="/verify" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Verify Certificate</Link>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <p className="text-xs text-slate-500 dark:text-slate-600 font-mono">
              &copy; {new Date().getFullYear()} SAMStack Tech. All rights reserved.
            </p>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-neutral-800" />
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-slate-500 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-slate-500 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Terms</Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="https://github.com/imsuleman-10" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/suleman-zaheer-mughal" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://x.com/samstacktech" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

