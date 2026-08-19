import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SkillCategory } from '../data/portfolio-data';
import { SKILLS, EXPERIENCES } from '../data/portfolio-data';
import type { SkillUsage } from '../hooks/useSkillUsage';
import { computeSkillUsage } from '../hooks/useSkillUsage';
import { useDebounce } from '../hooks/useDebounce';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useReveal } from '../hooks/useReveal';
import { getSkillIcon } from './skillIcons';
import { WaveVisualizerCanvas } from './WaveVisualizerCanvas';

/* ─── Embedded Stylesheet ────────────────────────────────── */
const styles = `
/* ─── Skills — Orbital Peek Carousel ───────────────────────

   Motion model (this is the part that used to break):
   · .orbit-ring       spins the whole ring         → rotate: 0 → 360deg
   · .orbit-node       is placed on the ring with
                       rotate(a) translateX(r) rotate(-a)
                       so the tile arrives upright at its slot
   · .orbit-node-spin  runs the ring animation in reverse, which
                       cancels the ring's rotation frame for frame
   · .orbit-node-face  is left free for hover transforms only

   Because each element owns exactly one transform channel, nothing
   overrides anything else — icons stay upright and hover never fights
   the orbit. Playback is driven by the inherited --play custom property.
   ────────────────────────────────────────────────────────── */

/* ─── Section Layout ─────────────────────────────────────── */
.skills-grid-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 12vh 6vw 10vh;
  display: flex;
  flex-direction: column;
  gap: 34px;
  background: var(--bg);
  color: var(--ink);
  box-sizing: border-box;
  transition: background 0.4s ease, color 0.4s ease;
}

/* ─── Header ─────────────────────────────────────────────── */
.skills-grid-header {
  max-width: 720px;
}

.skills-grid-designation {
  color: var(--accent);
  margin-bottom: 14px;
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.skills-grid-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 4.6vw, 3.6rem);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin-bottom: 16px;
}

.skills-grid-title em {
  font-style: italic;
  color: var(--accent);
}

.skills-grid-note {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--muted);
  max-width: 52ch;
}

.skills-grid-note kbd {
  font-family: monospace;
  font-size: 0.72rem;
  padding: 1px 6px;
  margin: 0 2px;
  border-radius: 5px;
  border: 1px solid var(--line-strong);
  background: var(--accent-soft);
  color: var(--ink);
}

/* ─── Carousel Viewport ──────────────────────────────────── */
.skills-peek-viewport {
  --card-pad: 18px;
  --visual-w: calc(var(--card-w) - var(--card-pad) * 2);

  position: relative;
  width: 100%;
  height: var(--viewport-h);
  border-radius: 26px;
  overflow: hidden;
  isolation: isolate;
  background: var(--card-bg-solid);
  border: 1px solid var(--line);
  box-shadow: 0 30px 80px var(--shadow-color);
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
}

.skills-peek-viewport:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.skills-peek-viewport.is-dragging {
  cursor: grabbing;
}

.skills-peek-viewport.is-dragging .peek-card {
  transition: none;
}

.peek-viewport-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.7;
}

/* Soft edge fades so peeking cards dissolve instead of being sliced */
.viewport-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 14%;
  z-index: 6;
  pointer-events: none;
}

.viewport-fade.is-left {
  left: 0;
  background: linear-gradient(90deg, var(--card-bg-solid) 8%, transparent 100%);
}

.viewport-fade.is-right {
  right: 0;
  background: linear-gradient(270deg, var(--card-bg-solid) 8%, transparent 100%);
}

/* ─── Cards ──────────────────────────────────────────────── */
.peek-cards {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.peek-card {
  --domain: var(--accent);

  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--card-w);
  height: var(--card-h);
  margin-left: calc(var(--card-w) / -2);
  margin-top: calc(var(--card-h) / -2);
  padding: var(--card-pad);
  box-sizing: border-box;
  border-radius: 22px;
  background: var(--card-bg);
  border: 1px solid var(--line);
  box-shadow: 0 26px 70px var(--shadow-color);
  display: flex;
  flex-direction: column;
  text-align: left;

  transform-origin: center center;
  transform: translate3d(calc(var(--offset) * var(--card-step) + var(--drag-px, 0px)), 0, 0)
             scale(var(--scale, 1));
  opacity: var(--fade, 1);
  filter: blur(var(--blur, 0px));
  z-index: calc(10 - var(--abs-offset, 0));

  transition: transform 0.62s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.45s ease,
              filter 0.45s ease,
              border-color 0.35s ease,
              box-shadow 0.45s ease;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.peek-card.domain-lang { --domain: #38bdf8; }
.peek-card.domain-fw { --domain: #f59e0b; }
.peek-card.domain-db { --domain: #a855f7; }
.peek-card.domain-devops { --domain: #34d399; }

.peek-card.is-active {
  border-color: color-mix(in srgb, var(--domain) 45%, var(--line));
  background: var(--card-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 30px 80px var(--shadow-color),
              0 0 0 1px color-mix(in srgb, var(--domain) 28%, transparent),
              0 0 60px -22px var(--domain);
  animation: cardFloat 7s ease-in-out infinite;
  animation-play-state: var(--play, running);
}

.peek-card.is-peeking {
  cursor: pointer;
}

.peek-card.is-peeking:hover {
  --fade: 0.62;
  --blur: 0.8px;
  --scale: 0.9;
}

.peek-card.is-hidden {
  pointer-events: none;
  visibility: hidden;
}

@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
}

/* ─── Card Visual (orbit stage) ──────────────────────────── */
.peek-card-visual {
  position: relative;
  width: 100%;
  height: calc(var(--visual-w) * 0.8);
  flex: none;
  border-radius: 18px;
  overflow: visible;
  background:
    radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--domain) 8%, transparent), transparent 70%),
    var(--card-bg-solid);
  border: 1px solid var(--line);
  box-shadow: inset 0 0 40px var(--shadow-color);
}

.orbit-stage {
  position: absolute;
  inset: 0;
  --node: 44px;
  --orbit-r-solo: calc(var(--visual-w) * 0.30);
  --orbit-r-inner: calc(var(--visual-w) * 0.235);
  --orbit-r-outer: calc(var(--visual-w) * 0.40);
  display: grid;
  place-items: center;
}

.orbit-grid {
  position: absolute;
  inset: 0;
  border-radius: 17px;
  opacity: 0.6;
  background-image:
    linear-gradient(90deg, var(--line) 1px, transparent 1px),
    linear-gradient(var(--line) 1px, transparent 1px);
  background-size: 18px 18px;
  -webkit-mask-image: radial-gradient(ellipse at center, #000 40%, transparent 88%);
  mask-image: radial-gradient(ellipse at center, #000 40%, transparent 88%);
  pointer-events: none;
}

/* ─── Orbit tracks (the thin circles) ────────────────────── */
.orbit-track {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--track-d);
  height: var(--track-d);
  margin-left: calc(var(--track-d) / -2);
  margin-top: calc(var(--track-d) / -2);
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--domain) 28%, var(--line));
  background: radial-gradient(circle, transparent 62%, color-mix(in srgb, var(--domain) 7%, transparent) 100%);
  pointer-events: none;
  z-index: 2;
  animation: trackBreathe 7s ease-in-out infinite;
  animation-play-state: var(--play, running);
}

.orbit-track.is-outer {
  animation-delay: -2.4s;
  border-style: dashed;
  opacity: 0.75;
}

@keyframes trackBreathe {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 0.95; }
}

/* ─── Orbit core (category hub) ──────────────────────────── */
.orbit-core {
  position: relative;
  z-index: 4;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: var(--card-bg-solid);
  border: 1px solid color-mix(in srgb, var(--domain) 35%, var(--line-strong));
  box-shadow: 0 16px 40px var(--shadow-color),
              0 0 34px -10px var(--domain);
}

.orbit-core-glow {
  position: absolute;
  inset: -38px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--domain) 0%, transparent 68%);
  opacity: 0.4;
  filter: blur(18px);
  pointer-events: none;
  animation: corePulse 6s ease-in-out infinite;
  animation-play-state: var(--play, running);
}

@keyframes corePulse {
  0%, 100% { opacity: 0.32; scale: 1; }
  50% { opacity: 0.55; scale: 1.08; }
}

.orbit-core-emoji {
  font-size: 30px;
  line-height: 1;
  filter: drop-shadow(0 4px 12px var(--shadow-color));
}

/* ─── Rings & nodes ──────────────────────────────────────── */
.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  z-index: 3;
  animation: orbitSpin var(--dur, 34s) linear infinite;
  animation-direction: var(--dir, normal);
  animation-play-state: var(--play, running);
}

/* Lift the whole ring while one of its nodes is being read,
   so the tooltip is never covered by the other ring. */
.orbit-ring:has(.orbit-node:hover),
.orbit-ring:has(.orbit-node:focus-visible),
.orbit-ring:has(.orbit-node.is-pinned) {
  z-index: 12;
}

@keyframes orbitSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orbit-node {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--node);
  height: var(--node);
  margin: calc(var(--node) / -2);
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  /* place on the ring, then pre-cancel the slot angle so the tile is upright */
  transform: rotate(var(--angle)) translateX(var(--radius)) rotate(calc(-1 * var(--angle)));
}

.orbit-node:focus {
  outline: none;
}

.orbit-node-spin {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  animation: orbitSpin var(--dur, 34s) linear infinite;
  animation-direction: var(--dir-counter, reverse);
  animation-play-state: var(--play, running);
}

.orbit-node-face {
  position: relative;
  width: var(--node);
  height: var(--node);
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--pill-bg);
  border: 1px solid var(--line-strong);
  color: var(--ink);
  box-shadow: 0 8px 20px var(--shadow-color);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s ease,
              box-shadow 0.25s ease,
              background 0.25s ease;
}

.orbit-node:hover .orbit-node-face,
.orbit-node:focus-visible .orbit-node-face {
  transform: scale(1.3);
  border-color: var(--domain);
  box-shadow: 0 14px 30px var(--shadow-color), 0 0 26px -4px var(--domain);
}

.orbit-node.is-pinned .orbit-node-face {
  border-color: var(--domain);
  box-shadow: 0 0 22px -3px var(--domain);
  transform: scale(1.12);
}

.orbit-node.is-pinned:hover .orbit-node-face {
  transform: scale(1.3);
}

.orbit-icon {
  width: 22px;
  height: 22px;
  display: block;
}

/* ─── Node tooltip ───────────────────────────────────────── */
.orbit-tip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 13px);
  width: max-content;
  max-width: 186px;
  padding: 7px 12px;
  border-radius: 11px;
  background: var(--pill-bg);
  border: 1px solid var(--line-strong);
  box-shadow: 0 16px 34px var(--shadow-color);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 5px);
  transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s;
  z-index: 40;
}

.orbit-tip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: var(--pill-bg);
  border-right: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);
  transform: translate(-50%, -55%) rotate(45deg);
}

.orbit-node:hover .orbit-tip,
.orbit-node:focus-visible .orbit-tip,
.orbit-node.is-pinned .orbit-tip {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}

.orbit-tip-name {
  font-family: monospace;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}

.orbit-tip-reach {
  font-family: monospace;
  font-size: 0.62rem;
  line-height: 1.35;
  color: var(--muted);
}

/* ─── Card body ──────────────────────────────────────────── */
.peek-card-divider {
  width: 100%;
  height: 1px;
  flex: none;
  background: linear-gradient(90deg, transparent, var(--line-strong), transparent);
  margin: 14px 0 12px;
}

.peek-card-body {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.peek-card-badge {
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: 9999px;
  font-family: monospace;
  font-size: 0.64rem;
  letter-spacing: 0.1em;
  color: var(--ink);
  background: color-mix(in srgb, var(--domain) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--domain) 32%, var(--line));
}

.peek-card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--ink);
  margin: 2px 0 0;
}

.peek-card-description {
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--muted);
  margin: 0 0 4px;
}

.peek-card-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.schema-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font-family: monospace;
  font-size: 0.66rem;
  letter-spacing: 0.02em;
  color: var(--muted);
  background: var(--accent-soft);
  border: 1px solid var(--line);
  border-radius: 9999px;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.schema-chip-used {
  color: var(--ink);
  border-color: color-mix(in srgb, var(--domain) 40%, var(--line));
}

.schema-chip-indicator {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--domain);
  box-shadow: 0 0 8px var(--domain);
}

.schema-chip-more {
  color: var(--muted);
  border-style: dashed;
}

/* ─── Card footer ────────────────────────────────────────── */
.peek-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex: none;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--line);
}

.peek-card-next-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 10px;
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--ink);
  background: color-mix(in srgb, var(--domain) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--domain) 30%, var(--line));
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.peek-card-next-btn svg {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.peek-card-next-btn:hover {
  background: color-mix(in srgb, var(--domain) 20%, transparent);
  border-color: var(--domain);
}

.peek-card-next-btn:hover svg {
  transform: translateX(3px);
}

.peek-card-status {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 11px;
  border-radius: 9999px;
  background: var(--accent-soft);
  border: 1px solid var(--line);
}

.live-signal-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: signalPulse 2.4s ease-in-out infinite;
  animation-play-state: var(--play, running);
}

@keyframes signalPulse {
  0%, 100% { opacity: 0.75; scale: 1; }
  50% { opacity: 1; scale: 1.35; }
}

.live-signal-label {
  font-family: monospace;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: var(--muted);
}

/* ─── Autoplay progress bar ──────────────────────────────── */
.carousel-timer {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  border-radius: 0 0 22px 22px;
  background: var(--domain);
  box-shadow: 0 0 12px -1px var(--domain);
  animation: timerProgress 5s linear forwards;
}

@keyframes timerProgress {
  from { width: 0; }
  to { width: 100%; }
}

/* ─── Controls ───────────────────────────────────────────── */
.skills-carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.carousel-arrow {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--ink);
  background: var(--card-bg);
  border: 1px solid var(--line);
  cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
}

.carousel-arrow:hover {
  border-color: var(--accent);
  transform: scale(1.06);
}

.skills-carousel-dots {
  display: flex;
  align-items: center;
  gap: 9px;
}

.carousel-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: var(--line-strong);
  cursor: pointer;
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, box-shadow 0.3s ease;
}

.carousel-dot:hover {
  background: var(--muted);
}

.carousel-dot.is-active {
  width: 28px;
  border-radius: 6px;
  background: var(--accent);
  box-shadow: 0 0 14px -2px var(--accent);
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 860px) {
  .orbit-stage { --node: 38px; }
  .orbit-core { width: 62px; height: 62px; border-radius: 17px; }
  .orbit-core-emoji { font-size: 25px; }
  .orbit-icon { width: 19px; height: 19px; }
  .peek-card-title { font-size: 1.25rem; }
}

@media (max-width: 620px) {
  .skills-grid-section { padding: 70px 5vw; gap: 26px; }
  .skills-peek-viewport { --card-pad: 15px; border-radius: 20px; }
  .orbit-stage { --node: 34px; }
  .orbit-core { width: 54px; height: 54px; border-radius: 15px; }
  .orbit-core-emoji { font-size: 22px; }
  .orbit-icon { width: 17px; height: 17px; }
  .peek-card { border-radius: 18px; }
  .peek-card-description { font-size: 0.74rem; }
  .viewport-fade { width: 10%; }
}

/* ─── Reduced motion ─────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .orbit-ring,
  .orbit-node-spin,
  .orbit-core-glow,
  .orbit-track,
  .live-signal-pulse,
  .peek-card.is-active,
  .carousel-timer {
    animation: none !important;
  }

  .peek-card {
    transition-duration: 0.001s;
  }
}
`;

/* ─── Ring geometry ──────────────────────────────────────── */
interface RingSpec {
  items: string[];
  radius: string;
  trackDiameter: string;
  duration: number;
  direction: 'normal' | 'reverse';
  startAngle: number;
  isOuter: boolean;
}

/** Categories with more than this many tools get split across two rings. */
const SINGLE_RING_MAX = 5;

function buildRings(items: string[]): RingSpec[] {
  if (items.length <= SINGLE_RING_MAX) {
    return [
      {
        items,
        radius: 'var(--orbit-r-solo)',
        trackDiameter: 'calc(var(--orbit-r-solo) * 2)',
        duration: 38,
        direction: 'normal',
        startAngle: -90,
        isOuter: false,
      },
    ];
  }

  const split = Math.ceil(items.length / 2);
  const inner = items.slice(0, split);
  const outer = items.slice(split);

  return [
    {
      items: inner,
      radius: 'var(--orbit-r-inner)',
      trackDiameter: 'calc(var(--orbit-r-inner) * 2)',
      duration: 32,
      direction: 'normal',
      startAngle: -90,
      isOuter: false,
    },
    {
      items: outer,
      radius: 'var(--orbit-r-outer)',
      trackDiameter: 'calc(var(--orbit-r-outer) * 2)',
      duration: 46,
      direction: 'reverse',
      // half-step offset so the two rings never line up into a spoke
      startAngle: -90 + 180 / outer.length,
      isOuter: true,
    },
  ];
}

/* ─── Sub-Component: SkillOrbit ──────────────────────────── */
interface SkillOrbitProps {
  category: SkillCategory;
  usageMap: Map<string, SkillUsage>;
  /** Only the focused card animates — peeking cards stay frozen (and cheap). */
  isActive?: boolean;
  prefersReducedMotion?: boolean;
}

export const SkillOrbit: React.FC<SkillOrbitProps> = ({
  category,
  usageMap,
  isActive = true,
  prefersReducedMotion = false,
}) => {
  const [pinned, setPinned] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const rings = useMemo(() => buildRings(category.items), [category.items]);

  // Orbit pauses if reduced motion is preferred, card is inactive,
  // or a specific skill node is pinned or hovered (to read tooltip easily).
  const paused = prefersReducedMotion || !isActive || pinned !== null || hoveredSkill !== null;

  const stageStyle = { '--play': paused ? 'paused' : 'running' } as React.CSSProperties;

  return (
    <div
      className="orbit-stage"
      style={stageStyle}
    >
      <span className="orbit-grid" aria-hidden="true" />

      {rings.map((ring) => (
        <span
          key={`track-${ring.isOuter ? 'outer' : 'inner'}`}
          className={`orbit-track${ring.isOuter ? ' is-outer' : ''}`}
          style={{ '--track-d': ring.trackDiameter } as React.CSSProperties}
          aria-hidden="true"
        />
      ))}

      <span className="orbit-core">
        <span className="orbit-core-glow" aria-hidden="true" />
        <span className="orbit-core-emoji" role="img" aria-hidden="true">
          {category.icon}
        </span>
      </span>

      {rings.map((ring) => (
        <div
          key={`ring-${ring.isOuter ? 'outer' : 'inner'}`}
          className="orbit-ring"
          style={
            {
              '--dur': `${ring.duration}s`,
              '--dir': ring.direction,
              '--dir-counter': ring.direction === 'normal' ? 'reverse' : 'normal',
            } as React.CSSProperties
          }
        >
          {ring.items.map((skill, idx) => {
            const angle = ring.startAngle + (idx / ring.items.length) * 360;
            const usage = usageMap.get(`${category.id}:${skill}`);
            const reach =
              usage && usage.usageCount > 0 ? `Used at ${usage.usedIn.join(' · ')}` : 'Core skill';
            const IconComponent = getSkillIcon(skill);
            const isPinned = pinned === skill;

            return (
              <button
                key={skill}
                type="button"
                className={`orbit-node${isPinned ? ' is-pinned' : ''}`}
                style={
                  {
                    '--angle': `${angle}deg`,
                    '--radius': ring.radius,
                  } as React.CSSProperties
                }
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setPinned((prev) => (prev === skill ? null : skill));
                }}
                aria-pressed={isPinned}
                aria-label={`${skill}. ${reach}. ${isPinned ? 'Release orbit' : 'Hold orbit'}`}
                tabIndex={isActive ? 0 : -1}
              >
                <span className="orbit-node-spin">
                  <span className="orbit-node-face">
                    <IconComponent className="orbit-icon" aria-hidden="true" />
                  </span>
                  <span className="orbit-tip" aria-hidden="true">
                    <span className="orbit-tip-name">{skill}</span>
                    <span className="orbit-tip-reach">{reach}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ─── Carousel sizing ────────────────────────────────────── */
interface CarouselConfig {
  cardWidth: number;
  cardHeight: number;
  cardStep: number;
  visibleRange: number;
}

const CAROUSEL_BREAKPOINTS: Array<{ minWidth: number } & CarouselConfig> = [
  { minWidth: 1440, cardWidth: 400, cardHeight: 622, cardStep: 452, visibleRange: 1 },
  { minWidth: 1100, cardWidth: 372, cardHeight: 600, cardStep: 420, visibleRange: 1 },
  { minWidth: 860, cardWidth: 344, cardHeight: 576, cardStep: 386, visibleRange: 1 },
  { minWidth: 620, cardWidth: 320, cardHeight: 548, cardStep: 352, visibleRange: 1 },
  { minWidth: 0, cardWidth: 282, cardHeight: 512, cardStep: 300, visibleRange: 1 },
];

function getCarouselConfig(width: number): CarouselConfig {
  return (
    CAROUSEL_BREAKPOINTS.find((bp) => width >= bp.minWidth) ??
    CAROUSEL_BREAKPOINTS[CAROUSEL_BREAKPOINTS.length - 1]
  );
}

const AUTOPLAY_MS = 5000;
const DRAG_START_PX = 6;
const DRAG_COMMIT_PX = 70;

const USAGE_MAP = new Map(
  computeSkillUsage(SKILLS, EXPERIENCES).map((u) => [`${u.categoryId}:${u.skill}`, u]),
);

/* ─── Main Component: SkillsGrid ─────────────────────────── */
export const SkillsGrid: React.FC = () => {
  const N = SKILLS.length;
  const HALF = Math.floor(N / 2);
  const MAX_CHIPS = 6;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [config, setConfig] = useState<CarouselConfig>(() =>
    getCarouselConfig(typeof window !== 'undefined' ? window.innerWidth : 1440),
  );

  const prefersReducedMotion = usePrefersReducedMotion();
  const titleRef = useReveal<HTMLHeadingElement>();
  const cardsRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, dx: 0, moved: false });
  /** True for the click that immediately follows a swipe, so it doesn't select a card. */
  const swallowClick = useRef(false);

  const goTo = useCallback((index: number) => setActiveIndex(((index % N) + N) % N), [N]);
  const goNext = useCallback(() => setActiveIndex((prev) => (prev + 1) % N), [N]);
  const goPrev = useCallback(() => setActiveIndex((prev) => (prev - 1 + N) % N), [N]);

  /* Responsive sizing */
  const handleResize = useCallback(() => setConfig(getCarouselConfig(window.innerWidth)), []);
  const debouncedResize = useDebounce(handleResize, 150);

  useEffect(() => {
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [debouncedResize]);

  /* Autoplay — restarts on every slide change, holds while hovered or dragged */
  useEffect(() => {
    if (isPaused || isDragging || prefersReducedMotion) return undefined;
    const timer = setTimeout(goNext, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, isDragging, prefersReducedMotion, goNext]);

  /* Drag — written straight to a CSS variable so a swipe never re-renders */
  const setDragPx = (px: number) => {
    cardsRef.current?.style.setProperty('--drag-px', `${px}px`);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    swallowClick.current = false;
    drag.current = { active: true, startX: e.clientX, dx: 0, moved: false };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;

    const dx = e.clientX - d.startX;

    if (!d.moved) {
      if (Math.abs(dx) < DRAG_START_PX) return;
      d.moved = true;
      setIsDragging(true);
      // Capture only once it is a real drag, so plain clicks still reach the nodes.
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    d.dx = dx;
    setDragPx(dx);
  };

  const endDrag = (commit: boolean) => {
    const d = drag.current;
    if (!d.active) return;

    if (d.moved) {
      if (commit && d.dx <= -DRAG_COMMIT_PX) goNext();
      else if (commit && d.dx >= DRAG_COMMIT_PX) goPrev();
      swallowClick.current = true;
      setIsDragging(false);
    }

    drag.current = { active: false, startX: 0, dx: 0, moved: false };
    setDragPx(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
  };

  return (
    <section className="skills-grid-section" id="skills" data-section="skills">
      <style>{styles}</style>

      <header className="skills-grid-header">
        <p className="chart-label skills-grid-designation">
          CHART III · TECHNICAL TOOLKIT · {N} DOMAINS
        </p>
        <h2 ref={titleRef} className="skills-grid-title reveal-mask">
          The stack, <em>visualized</em>.
        </h2>
        <p className="skills-grid-note">
          Every tool orbits its domain. Hover the stage to hold the rotation, click a tile to pin it,
          drag the deck or use <kbd>←</kbd> <kbd>→</kbd> to move between domains.
        </p>
      </header>

      <div
        className={`skills-peek-viewport${isDragging ? ' is-dragging' : ''}`}
        style={
          {
            '--card-w': `${config.cardWidth}px`,
            '--card-h': `${config.cardHeight}px`,
            '--card-step': `${config.cardStep}px`,
            '--viewport-h': `${config.cardHeight + 110}px`,
          } as React.CSSProperties
        }
        role="group"
        aria-roledescription="carousel"
        aria-label="Skill domains"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => endDrag(true)}
        onPointerCancel={() => endDrag(false)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          endDrag(false);
          setIsPaused(false);
        }}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <WaveVisualizerCanvas className="peek-viewport-canvas" />
        <span className="viewport-fade is-left" aria-hidden="true" />
        <span className="viewport-fade is-right" aria-hidden="true" />

        <div className="peek-cards" ref={cardsRef}>
          {SKILLS.map((cat, idx) => {
            let offset = idx - activeIndex;
            if (offset > HALF) offset -= N;
            if (offset < -HALF) offset += N;

            const absOffset = Math.abs(offset);
            const isActive = offset === 0;
            const isHidden = absOffset > config.visibleRange;
            const usedCount = cat.items.filter(
              (skill) => (USAGE_MAP.get(`${cat.id}:${skill}`)?.usageCount ?? 0) > 0,
            ).length;
            const visibleChips = cat.items.slice(0, MAX_CHIPS);
            const overflowChips = cat.items.length - visibleChips.length;

            return (
              <article
                key={cat.id}
                className={[
                  'peek-card',
                  `domain-${cat.id}`,
                  isActive ? 'is-active' : isHidden ? 'is-hidden' : 'is-peeking',
                ].join(' ')}
                style={
                  {
                    '--offset': offset,
                    '--abs-offset': absOffset,
                    '--scale': isActive ? 1 : isHidden ? 0.76 : 0.86,
                    '--fade': isActive ? 1 : isHidden ? 0 : 0.36,
                    '--blur': isActive ? '0px' : isHidden ? '5px' : '2.4px',
                    '--play': prefersReducedMotion ? 'paused' : 'running',
                  } as React.CSSProperties
                }
                aria-hidden={isHidden}
                aria-roledescription="slide"
                aria-label={`${cat.name} — ${cat.items.length} tools`}
                onClick={() => {
                  if (!isActive && !isHidden && !swallowClick.current) goTo(idx);
                }}
              >
                <div className="peek-card-visual">
                  <SkillOrbit
                    category={cat}
                    usageMap={USAGE_MAP}
                    isActive={isActive}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </div>

                <div className="peek-card-divider" />

                <div className="peek-card-body">
                  <span className="peek-card-badge">Skill Domain</span>
                  <h3 className="peek-card-title">{cat.name}</h3>
                  <p className="peek-card-description">{cat.description}</p>

                  <div className="peek-card-chips">
                    {visibleChips.map((skill) => {
                      const isUsed = (USAGE_MAP.get(`${cat.id}:${skill}`)?.usageCount ?? 0) > 0;
                      return (
                        <span
                          key={skill}
                          className={`schema-chip${isUsed ? ' schema-chip-used' : ''}`}
                        >
                          {isUsed && <span className="schema-chip-indicator" />}
                          {skill}
                        </span>
                      );
                    })}
                    {overflowChips > 0 && (
                      <span className="schema-chip schema-chip-more">+{overflowChips}</span>
                    )}
                  </div>
                </div>

                <div className="peek-card-footer">
                  <button
                    type="button"
                    className="peek-card-next-btn"
                    tabIndex={isActive ? 0 : -1}
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                  >
                    <span>Next domain</span>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <span className="peek-card-status">
                    <span className="live-signal-pulse" />
                    <span className="live-signal-label">
                      {String(usedCount).padStart(2, '0')}/{String(cat.items.length).padStart(2, '0')} SHIPPED
                    </span>
                  </span>
                </div>

                {isActive && !prefersReducedMotion && (
                  <span
                    key={`timer-${activeIndex}`}
                    className="carousel-timer"
                    style={{ animationPlayState: isPaused || isDragging ? 'paused' : 'running' }}
                    aria-hidden="true"
                  />
                )}
              </article>
            );
          })}
        </div>
      </div>

      <div className="skills-carousel-controls">
        <button type="button" className="carousel-arrow" onClick={goPrev} aria-label="Previous domain">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="skills-carousel-dots" role="tablist" aria-label="Skill domain selector">
          {SKILLS.map((cat, idx) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              className={`carousel-dot${idx === activeIndex ? ' is-active' : ''}`}
              aria-selected={idx === activeIndex}
              aria-label={cat.name}
              onClick={() => goTo(idx)}
            />
          ))}
        </div>

        <button type="button" className="carousel-arrow" onClick={goNext} aria-label="Next domain">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default SkillsGrid;
