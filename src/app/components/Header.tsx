"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  FileCheck,
  UserCheck,
  Menu,
  X,
  Mail,
  GraduationCap,
  ChevronDown,
  Sun,
  Moon,
  Layers,
  BookOpen,
  Briefcase,
  Info,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/services", label: "Services", icon: Briefcase },
  { href: "/portfolio", label: "Portfolio", icon: Layers },
  { href: "/about", label: "About", icon: Info },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/contact", label: "Contact", icon: Mail },
];

const internshipLinks = [
  { href: "/internship", label: "Apply Now", icon: UserCheck },
  { href: "/internship/submit", label: "Submit Work", icon: FileCheck },
  { href: "/verify", label: "Verify Certificate", icon: Shield },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [internOpen, setInternOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isInternActive = pathname?.startsWith("/internship") || pathname?.startsWith("/verify");
  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isHome && !scrolled
          ? "bg-transparent"
          : "bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-neutral-800/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-black flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-brand-500/30 transition-all duration-300 border border-slate-200 dark:border-neutral-800">
            <img 
              src="/logo.png" 
              alt="SAMStack Tech" 
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white font-heading tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
              SAMStack <span className="text-brand-600 dark:text-brand-400">Tech</span>
            </span>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-medium leading-none">
              Software Systems
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
                    : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Internship Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setInternOpen(true)}
            onMouseLeave={() => setInternOpen(false)}
          >
            <button
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                isInternActive
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
                  : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Internship
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${internOpen ? "rotate-180" : ""}`} />
            </button>

            <div className="absolute top-full left-0 w-full h-3" />

            <AnimatePresence>
              {internOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-48 z-50"
                >
                  <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xl shadow-black/5 overflow-hidden py-1">
                    <div className="px-4 py-1.5 mb-1 border-b border-slate-100 dark:border-neutral-800">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Internship Portal
                      </span>
                    </div>
                    {internshipLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setInternOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          pathname === link.href
                            ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/5"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <link.icon className="w-4 h-4 text-brand-600 dark:text-brand-500" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          {mounted ? (
            <button
              onClick={toggleTheme}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          )}

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-widest text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-all shadow-md hover:shadow-lg hover:shadow-brand-500/25"
          >
            Get a Quote
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-black overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <link.icon className="w-4 h-4 text-brand-600 dark:text-brand-500" />
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-neutral-800">
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Internship Portal
                </p>
                {internshipLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <link.icon className="w-4 h-4 text-brand-600 dark:text-brand-500" />
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-neutral-800">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-3 text-xs font-bold uppercase tracking-widest text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
