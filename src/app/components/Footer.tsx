import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-neutral-800/60 bg-slate-50 dark:bg-neutral-950 relative z-10 transition-colors duration-300 mt-auto">
      {/* Top accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-brand-500 via-cyan-400 to-indigo-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-200 dark:border-neutral-800/60">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-md bg-white border border-slate-200 dark:border-neutral-800">
                <img src="/logo.png" alt="SAMStack Tech Logo" className="w-full h-full object-contain p-1" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                SAMStack <span className="text-brand-600 dark:text-brand-400">Tech</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Empowering businesses with cutting-edge software solutions and accelerating careers through our elite internship ecosystem.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-600 font-mono">
            &copy; {new Date().getFullYear()} SAMStack Tech. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-slate-500 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-slate-500 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
