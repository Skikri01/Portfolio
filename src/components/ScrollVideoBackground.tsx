/**
 * ScrollVideoBackground
 * ─────────────────────────────────────────────────────────────────────────────
 * Apple-style image-sequence scroll animation.
 *
 * Facts confirmed before writing:
 *   • 300 JPEG frames in /public/smothVedeo/
 *   • Named ezgif-frame-001.jpg … ezgif-frame-300.jpg  (3-digit zero-padded)
 *   • Loaded via sequential public URLs — zero bundler overhead
 *   • GSAP ScrollTrigger (scrub: 0.5) drives frame index
 *   • Lenis smooth-scroll synced to gsap.ticker
 *   • object-fit: cover math keeps portrait centred on every viewport
 *   • devicePixelRatio-aware canvas → crisp on Retina / HiDPI
 *   • Dark vignette overlay preserves foreground text readability
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ─── Frame metadata (confirmed by inspection) ────────────────────────────────
const TOTAL_FRAMES = 300;
const BASE_URL     = '/smothVedeo/';
const PREFIX       = 'ezgif-frame-';
const SUFFIX       = '.jpg';

/** Zero-pad a number to 3 digits: 1 → "001" */
function pad3(n: number): string {
  return String(n).padStart(3, '0');
}

/** Build the public URL for frame index i (0-based → file starts at 001) */
function frameUrl(i: number): string {
  return `${BASE_URL}${PREFIX}${pad3(i + 1)}${SUFFIX}`;
}

// ─── Cover-fit draw ──────────────────────────────────────────────────────────
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cssW: number,
  cssH: number,
): void {
  const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
  const dw = img.naturalWidth  * scale;
  const dh = img.naturalHeight * scale;
  const dx = (cssW - dw) / 2;
  const dy = (cssH - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ScrollVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // ── Shared mutable state ────────────────────────────────────────────────
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    const loaded: boolean[]          = new Array(TOTAL_FRAMES).fill(false);
    let   loadedCount                = 0;

    // GSAP tweens this single object
    const frameState = { index: 0 };
    let   lastDrawn  = -1;
    let   rafPending = false;

    let cssW = window.innerWidth;
    let cssH = window.innerHeight;

    // ── Resize: pixel-perfect canvas at any DPR ─────────────────────────────
    function resize(): void {
      const dpr = window.devicePixelRatio || 1;
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width  = cssW * dpr;
      canvas.height = cssH * dpr;
      // Reset transform so every subsequent draw scales correctly
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Redraw current frame at new size immediately
      const i = Math.round(frameState.index);
      if (loaded[i]) {
        ctx.clearRect(0, 0, cssW, cssH);
        drawCover(ctx, images[i], cssW, cssH);
        lastDrawn = i;
      }
    }

    // ── RAF-gated draw: only paints when index actually changes ─────────────
    function scheduleRender(): void {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        const i = Math.round(frameState.index);
        if (i === lastDrawn) return;
        if (!loaded[i])      return;
        ctx.clearRect(0, 0, cssW, cssH);
        drawCover(ctx, images[i], cssW, cssH);
        lastDrawn = i;
      });
    }

    // ── Preload all 300 frames ───────────────────────────────────────────────
    function preload(): void {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = frameUrl(i);
        const idx = i; // capture for closure

        img.onload = () => {
          loaded[idx] = true;
          loadedCount++;

          // Paint frame 0 the instant it arrives so the canvas is never blank
          if (idx === 0) {
            resize();            // sets correct canvas dimensions
            scheduleRender();
          }
        };

        img.onerror = () => {
          console.warn(`[ScrollBg] failed to load frame ${idx + 1}`);
        };

        images[idx] = img;
      }
    }

    // ── Lenis smooth scroll ──────────────────────────────────────────────────
    const lenis = new Lenis({
      duration:           1.4,
      easing:             (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation:        'vertical',
      gestureOrientation: 'vertical',
      smoothWheel:        true,
      wheelMultiplier:    0.9,
      touchMultiplier:    1.5,
    });

    // Sync Lenis RAF into GSAP ticker so ScrollTrigger scrub stays in phase
    function lenisRaf(time: number) { lenis.raf(time * 1000); }
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', () => ScrollTrigger.update());

    // ── GSAP ScrollTrigger frame tween ──────────────────────────────────────
    // Scrubs frameState.index 0 → 299 across the full page scroll range.
    const tween = gsap.to(frameState, {
      index: TOTAL_FRAMES - 1,
      ease:  'none',                 // linear; scrub handles the easing feel
      scrollTrigger: {
        trigger: document.documentElement,
        start:   'top top',
        end:     'bottom bottom',
        scrub:   0.5,                // 0.5 s weighted catch-up — buttery Apple lag
        onUpdate: scheduleRender,
      },
    });

    // ── Bootstrap ───────────────────────────────────────────────────────────
    resize();
    preload();
    window.addEventListener('resize', resize, { passive: true });

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', resize);
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* ── Layer 0: The animated frame canvas ─────────────────────────── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '100vw',
          height:        '100vh',
          zIndex:        0,
          pointerEvents: 'none',
          display:       'block',
          backgroundColor: '#0a0a0d',
        }}
      />

      {/* ── Layer 1: Subtle vignette overlay ────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        1,
          pointerEvents: 'none',
          background: `
            radial-gradient(
              ellipse 85% 65% at 50% 50%,
              transparent 35%,
              rgba(10, 10, 13, 0.45) 100%
            ),
            linear-gradient(
              to bottom,
              rgba(10, 10, 13, 0.3) 0%,
              transparent 20%,
              transparent 80%,
              rgba(10, 10, 13, 0.5) 100%
            )
          `,
        }}
      />
    </>
  );
}
