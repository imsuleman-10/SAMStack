"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 40;

// Generates the frame filename like "ezgif-frame-001.jpg"
function getFrameUrl(index: number): string {
  const padded = String(index + 1).padStart(3, "0");
  return `/vid_frames1/ezgif-frame-${padded}.jpg`;
}

export default function ScrollVideoPlayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
          // Draw first frame immediately
          drawFrame(0, images);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      images.push(img);
    }
  }, []);

  function drawFrame(index: number, images?: HTMLImageElement[]) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgs = images || imagesRef.current;
    const img = imgs[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const { width, height } = canvas;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawW = width;
    let drawH = height;
    let drawX = 0;
    let drawY = 0;

    if (imgAspect > canvasAspect) {
      drawH = height;
      drawW = height * imgAspect;
      drawX = (width - drawW) / 2;
    } else {
      drawW = width;
      drawH = width / imgAspect;
      drawY = (height - drawH) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  // Handle scroll-driven frame updates
  useEffect(() => {
    if (!loaded) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Fast playback: Scrub 40 frames over just 600px of scrolling
      const scrollDistance = 600; 
      let progress = scrollY / scrollDistance;
      progress = Math.max(0, Math.min(1, progress));

      const targetFrame = Math.round(progress * (TOTAL_FRAMES - 1));

      // Parallax effect: Move canvas down slightly as user scrolls down
      if (canvasRef.current) {
        canvasRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(targetFrame));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial frame

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);

  // Resize canvas to match display size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      // Get parent dimensions
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        drawFrame(currentFrameRef.current);
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    return () => resizeObserver.disconnect();
  }, [loaded]);

  return (
    <div className="absolute top-0 left-0 w-full h-[125vh] -z-10 overflow-hidden pointer-events-none">
      {/* Loading indicator */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 gap-4">
          <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all duration-300 rounded-full"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Canvas renders the frames */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-50"
        style={{ display: loaded ? "block" : "none" }}
      />
      
      {/* Gradients to blend video smoothly into the background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-transparent to-[var(--background)]" />
      <div className="absolute inset-0 bg-[var(--background)]/30" />
    </div>
  );
}
