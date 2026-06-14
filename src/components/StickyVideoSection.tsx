"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";

export default function StickyVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Add spring physics for buttery smooth scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform video width from 100vw to 45vw
  const videoWidth = useTransform(smoothProgress, [0, 0.5], ["100vw", "45vw"]);
  // Transform video height from 100vh to 60vh
  const videoHeight = useTransform(smoothProgress, [0, 0.5], ["100vh", "65vh"]);
  // Transform video x to shift it to the left side of the screen
  const videoX = useTransform(smoothProgress, [0, 0.5], ["0vw", "-18vw"]);
  
  // Border radius starts at 0 (square full screen), becomes 24px ONLY when it shrinks
  const videoBorderRadius = useTransform(smoothProgress, [0, 0.3, 0.5], ["0px", "0px", "24px"]);
  
  // Opacity and slide for the text container
  const textOpacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1]);
  const textY = useTransform(smoothProgress, [0.4, 0.6], [50, 0]);

  // Loop only first 4 seconds
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 4) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-white dark:bg-black">
      <div className="sticky top-[80px] h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden w-full">
        
        {/* Animated Video Container */}
        <motion.div 
          style={{ 
            width: videoWidth, 
            height: videoHeight,
            x: videoX,
            borderRadius: videoBorderRadius
          }}
          className="relative z-10 overflow-hidden shadow-2xl flex-shrink-0"
        >
          <video
            ref={videoRef}
            src="/2nd-vid.mp4"
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        {/* Text Container that appears on the right */}
        <motion.div 
          style={{ 
            opacity: textOpacity,
            y: textY,
            position: 'absolute',
            right: 'max(4vw, calc((100vw - 80rem) / 2))',
            width: '40%',
            maxWidth: '500px'
          }}
          className="hidden md:flex flex-col justify-center space-y-6 z-20 pointer-events-auto"
        >
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-500">
              Careers
            </p>
            <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
              Human-first is our<br />foundation.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md">
              Join a culture that celebrates excellence and diversity, Globally!
            </p>
          </div>
          <div>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#1bc2cd] hover:bg-[#15aab4] text-white font-bold text-sm transition-colors shadow-lg shadow-[#1bc2cd]/30">
              Join Us
            </Link>
          </div>
        </motion.div>

        {/* Mobile Text Container (shows below video on mobile) */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="md:hidden absolute bottom-10 left-4 right-4 flex flex-col items-center text-center space-y-4 p-6 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10"
        >
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Human-first is our foundation.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Join a culture that celebrates excellence and diversity, Globally!
          </p>
          <Link href="/contact" className="px-6 py-2.5 rounded-full bg-[#1bc2cd] text-white font-bold text-xs">
            Join Us
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
