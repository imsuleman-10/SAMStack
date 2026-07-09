"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useAnimation, Variants } from "framer-motion";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: "fadeUp" | "fadeIn" | "fadeLeft" | "fadeRight" | "scaleUp" | "fadeInScale" | "slideUp" | "stagger" | "reveal";
}

const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] } },
  },
  fadeInScale: {
    hidden: { opacity: 0, scale: 0.88, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  },
  stagger: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  },
  reveal: {
    hidden: { opacity: 0, y: 20, clipPath: "inset(0 0 100% 0)" },
    visible: { opacity: 1, y: 0, clipPath: "inset(0 0 0 0)", transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
  },
};

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  duration,
  variant = "fadeUp",
}: AnimateOnScrollProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safety fallback: if observer never fires, show content after 1.5s
    const fallbackTimer = setTimeout(() => {
      controls.start("visible");
    }, 1500);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallbackTimer);
          controls.start("visible");
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 0px 0px" }
    );

    if (ref.current) {
      // If already in viewport on mount, show immediately
      const rect = ref.current.getBoundingClientRect();
      const inViewport =
        rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) {
        clearTimeout(fallbackTimer);
        controls.start("visible");
      } else {
        observer.observe(ref.current);
      }
    }

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [controls]);

  const selectedVariant = variants[variant];
  const transition = { delay, ...(duration ? { duration } : {}) };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={selectedVariant}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
