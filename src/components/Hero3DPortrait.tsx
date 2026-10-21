import React, { useEffect, useRef, useState, useCallback } from 'react';
import solaImage from '../assets/sola.jpg';

interface Hero3DPortraitProps {
  onOpenCv?: () => void;
}

export const Hero3DPortrait: React.FC<Hero3DPortraitProps> = ({ onOpenCv }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chassisRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Smooth lerp states (current interpolated vs target values)
  const current = useRef({
    x: 0,
    y: 0,
    shiftX: 0,
    shiftY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const target = useRef({
    x: 0,
    y: 0,
    shiftX: 0,
    shiftY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  // Handle pointer tracking with high responsiveness
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const chassis = chassisRef.current;
    if (!chassis) return;

    const rect = chassis.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 .. 0.5

    // Satisfying, tactile 3D tilt angles (up to ±16 deg)
    target.current = {
      x: -ny * 18,
      y: nx * 18,
      shiftX: nx * 20,
      shiftY: ny * 20,
      glareX: (nx + 0.5) * 100,
      glareY: (ny + 0.5) * 100,
      glareOpacity: 0.95,
    };

    if (!isHovered) setIsHovered(true);
  }, [isHovered]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const chassis = chassisRef.current;
    if (!chassis) return;

    const rect = chassis.getBoundingClientRect();
    const nx = (touch.clientX - rect.left) / rect.width - 0.5;
    const ny = (touch.clientY - rect.top) / rect.height - 0.5;

    target.current = {
      x: -ny * 12,
      y: nx * 12,
      shiftX: nx * 14,
      shiftY: ny * 14,
      glareX: (nx + 0.5) * 100,
      glareY: (ny + 0.5) * 100,
      glareOpacity: 0.75,
    };
    if (!isHovered) setIsHovered(true);
  }, [isHovered]);

  const handlePointerLeave = useCallback(() => {
    target.current = {
      x: 0,
      y: 0,
      shiftX: 0,
      shiftY: 0,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    };
    setIsHovered(false);
    setIsPressed(false);
  }, []);

  const handlePointerDown = () => setIsPressed(true);
  const handlePointerUp = () => setIsPressed(false);

  // High performance 60/120fps RAF lerp loop
  useEffect(() => {
    let running = true;

    const animate = () => {
      if (!running) return;

      const chassis = chassisRef.current;
      if (chassis) {
        // Fast tracking when active, smooth settling on leave
        const factor = isHovered ? 0.16 : 0.08;
        const cur = current.current;
        const tgt = target.current;

        cur.x += (tgt.x - cur.x) * factor;
        cur.y += (tgt.y - cur.y) * factor;
        cur.shiftX += (tgt.shiftX - cur.shiftX) * factor;
        cur.shiftY += (tgt.shiftY - cur.shiftY) * factor;
        cur.glareX += (tgt.glareX - cur.glareX) * factor;
        cur.glareY += (tgt.glareY - cur.glareY) * factor;
        cur.glareOpacity += (tgt.glareOpacity - cur.glareOpacity) * factor;

        chassis.style.setProperty('--tilt-x', `${cur.x.toFixed(2)}deg`);
        chassis.style.setProperty('--tilt-y', `${cur.y.toFixed(2)}deg`);
        chassis.style.setProperty('--shift-x', `${cur.shiftX.toFixed(2)}px`);
        chassis.style.setProperty('--shift-y', `${cur.shiftY.toFixed(2)}px`);
        chassis.style.setProperty('--glare-x', `${cur.glareX.toFixed(1)}%`);
        chassis.style.setProperty('--glare-y', `${cur.glareY.toFixed(1)}%`);
        chassis.style.setProperty('--glare-opacity', `${cur.glareOpacity.toFixed(3)}`);
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isHovered]);

  return (
    <div
      className={`p3d-stage ${isHovered ? 'is-active' : ''}`}
      ref={containerRef}
    >
      <style>{`
        /* ─── 3D Portrait Stage ─────────────────────────────── */
        .p3d-stage {
          position: relative;
          width: min(100%, 390px);
          aspect-ratio: 3 / 4;
          perspective: 1200px;
          user-select: none;
          touch-action: pan-y;
        }

        /* Ambient 3D Backlight Halo (Layer -2) */
        .p3d-ambient-halo {
          position: absolute;
          inset: -18%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            var(--accent-glow) 0%,
            rgba(217, 164, 65, 0.12) 38%,
            transparent 72%
          );
          opacity: 0.75;
          filter: blur(28px);
          transform: translate3d(
            calc(var(--shift-x, 0px) * -0.6),
            calc(var(--shift-y, 0px) * -0.6),
            -70px
          );
          transition: transform 0.2s ease-out, opacity 0.5s ease;
          pointer-events: none;
        }

        .p3d-stage.is-active .p3d-ambient-halo {
          opacity: 1;
        }

        /* 3D Gyroscope Orbital Rings (Layer -1) */
        .p3d-orbitals {
          position: absolute;
          inset: -14%;
          pointer-events: none;
          transform-style: preserve-3d;
          transform: translate3d(0, 0, -35px) rotateX(62deg) rotateY(-18deg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .p3d-ring {
          position: absolute;
          border-radius: 50%;
        }

        .p3d-ring-outer {
          width: 124%;
          height: 124%;
          border: 1px dashed var(--line-strong);
          opacity: 0.5;
          animation: p3dSpin 48s linear infinite;
        }

        .p3d-ring-inner {
          width: 95%;
          height: 95%;
          border: 1px solid var(--accent-glow);
          opacity: 0.35;
          animation: p3dSpinReverse 32s linear infinite;
        }

        .p3d-sat-node {
          position: absolute;
          top: -4px;
          left: 50%;
          width: 8px;
          height: 8px;
          margin-left: -4px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 16px 2px var(--accent);
        }

        .p3d-sat-node-secondary {
          position: absolute;
          bottom: -3px;
          left: 30%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ink);
          opacity: 0.8;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
        }

        @keyframes p3dSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes p3dSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        /* Floating Experience Pill (Top-Right Parallax Badge) */
        .p3d-floating-pill {
          position: absolute;
          top: -12px;
          right: -14px;
          z-index: 12;
          transform: translate3d(
            calc(var(--shift-x, 0px) * 1.3),
            calc(var(--shift-y, 0px) * 1.3),
            68px
          );
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 999px;
          background: var(--pill-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--accent);
          color: var(--accent);
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          box-shadow: 0 14px 28px -6px var(--shadow-color), 0 0 16px -4px var(--accent-glow);
          pointer-events: none;
          transition: border-color 0.3s ease;
        }

        .p3d-pill-sparkle {
          color: var(--accent);
          font-size: 0.85rem;
          animation: p3dPulse 2.4s ease-in-out infinite alternate;
        }

        /* ─── Main 3D Card Chassis ───────────────────────────── */
        .p3d-chassis {
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          --shift-x: 0px;
          --shift-y: 0px;
          --glare-x: 50%;
          --glare-y: 50%;
          --glare-opacity: 0;

          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 24px;
          transform-style: preserve-3d;
          transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) ${
            isPressed ? 'scale(0.985)' : 'scale(1)'
          };
          transition: ${isHovered ? 'none' : 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)'};
          will-change: transform;
          cursor: crosshair;
        }

        /* Organic Idle 3D Sway when idle */
        .p3d-stage:not(.is-active) .p3d-chassis {
          animation: p3dIdleFloat 9s ease-in-out infinite;
        }

        @keyframes p3dIdleFloat {
          0%, 100% {
            transform: rotateX(0deg) rotateY(0deg) translateY(0px);
          }
          25% {
            transform: rotateX(2.8deg) rotateY(-3.4deg) translateY(-5px);
          }
          50% {
            transform: rotateX(-2deg) rotateY(2.6deg) translateY(3px);
          }
          75% {
            transform: rotateX(2.2deg) rotateY(3deg) translateY(-3px);
          }
        }

        /* Layer 0: Card Substrate Plate */
        .p3d-substrate {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          overflow: hidden;
          background: var(--card-bg-solid);
          border: 1px solid var(--line-strong);
          box-shadow:
            0 42px 95px -26px var(--shadow-color),
            0 16px 36px -12px rgba(0, 0, 0, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.04) inset,
            0 2px 0 rgba(255, 255, 255, 0.08) inset;
          transform: translateZ(0px);
          transition: box-shadow 0.5s ease, border-color 0.5s ease;
        }

        .p3d-stage.is-active .p3d-substrate {
          border-color: var(--accent);
          box-shadow:
            0 52px 120px -26px var(--shadow-color),
            0 0 40px -10px var(--accent-glow),
            0 0 0 1px var(--accent-glow) inset;
        }

        /* Cyber Matrix Grid in Card Background */
        .p3d-bg-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(var(--line) 1.2px, transparent 1.2px);
          background-size: 22px 22px;
          opacity: 0.65;
          pointer-events: none;
        }

        /* Studio Spotlight behind subject */
        .p3d-spotlight {
          position: absolute;
          top: 8%;
          left: 50%;
          width: 130%;
          height: 85%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 32%,
            var(--accent-glow) 0%,
            var(--accent-soft) 38%,
            transparent 72%
          );
          opacity: 0.65;
          filter: blur(24px);
          pointer-events: none;
          transition: opacity 0.4s ease;
        }

        .p3d-stage.is-active .p3d-spotlight {
          opacity: 0.95;
        }

        /* Technical Watermark Background Metadata */
        .p3d-watermark {
          position: absolute;
          top: 18px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--faint);
          pointer-events: none;
        }

        /* Layer 1: Cutout Subject with Physical 3D Cast Shadow */
        .p3d-subject-layer {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          transform: translateZ(36px);
          pointer-events: none;
          border-radius: 24px;
          overflow: hidden;
        }

        .p3d-subject-img {
          position: absolute;
          bottom: 0;
          left: 50%;
          /* Calibrated horizontal center of Mohammed in sola.jpg (69.5%) */
          transform: translateX(-69.5%);
          height: 104%;
          width: auto;
          max-width: none;
          display: block;
          object-fit: contain;
          pointer-events: none;
          /* High-definition Studio Grading + Dynamic 3D Cast Shadow */
          filter:
            contrast(1.08)
            brightness(1.03)
            saturate(1.08)
            drop-shadow(
              calc(var(--shift-x, 0px) * -0.55 - 4px)
              calc(var(--shift-y, 0px) * -0.55 + 16px)
              22px
              rgba(0, 0, 0, 0.72)
            )
            drop-shadow(0 0 22px var(--accent-glow));
          transition: filter 0.4s ease;
        }

        .p3d-stage.is-active .p3d-subject-img {
          filter:
            contrast(1.11)
            brightness(1.04)
            saturate(1.12)
            drop-shadow(
              calc(var(--shift-x, 0px) * -0.65 - 6px)
              calc(var(--shift-y, 0px) * -0.65 + 20px)
              28px
              rgba(0, 0, 0, 0.8)
            )
            drop-shadow(0 0 28px var(--accent-glow));
        }

        /* Layer 2: Specular Holographic Glare & Light Sheen */
        .p3d-glare-layer {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          overflow: hidden;
          pointer-events: none;
          transform: translateZ(48px);
          opacity: var(--glare-opacity, 0);
          transition: opacity 0.35s ease;
          mix-blend-mode: screen;
        }

        .p3d-glare-radial {
          position: absolute;
          inset: -20%;
          background: radial-gradient(
            circle 340px at var(--glare-x, 50%) var(--glare-y, 50%),
            rgba(255, 255, 255, 0.42) 0%,
            rgba(217, 164, 65, 0.22) 32%,
            transparent 68%
          );
        }

        .p3d-glare-foil {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 25%,
            rgba(255, 255, 255, 0.12) 48%,
            rgba(217, 164, 65, 0.2) 52%,
            rgba(255, 255, 255, 0.1) 56%,
            transparent 78%
          );
          transform: translateY(calc(var(--shift-y, 0px) * 1.4));
          opacity: 0.85;
        }

        /* Layer 3: Precision Laser HUD Brackets & Framing */
        .p3d-hud {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          pointer-events: none;
          transform: translateZ(58px);
        }

        .p3d-bracket {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 1.5px solid var(--accent);
          opacity: 0.95;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .p3d-bracket.tl {
          top: -10px;
          left: -10px;
          border-right: none;
          border-bottom: none;
        }
        .p3d-bracket.tr {
          top: -10px;
          right: -10px;
          border-left: none;
          border-bottom: none;
        }
        .p3d-bracket.bl {
          bottom: -10px;
          left: -10px;
          border-right: none;
          border-top: none;
        }
        .p3d-bracket.br {
          bottom: -10px;
          right: -10px;
          border-left: none;
          border-top: none;
        }

        .p3d-stage.is-active .p3d-bracket.tl { transform: translate(-3px, -3px); }
        .p3d-stage.is-active .p3d-bracket.tr { transform: translate(3px, -3px); }
        .p3d-stage.is-active .p3d-bracket.bl { transform: translate(-3px, 3px); }
        .p3d-stage.is-active .p3d-bracket.br { transform: translate(3px, 3px); }

        /* Top HUD Header Tags */
        .p3d-hud-header {
          position: absolute;
          top: 18px;
          left: 18px;
          right: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: monospace;
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .p3d-hud-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 6px;
          background: var(--pill-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--line);
          color: var(--ink);
        }

        .p3d-hud-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
        }

        .p3d-hud-badge-3d {
          padding: 4px 8px;
          border-radius: 6px;
          background: var(--accent-soft);
          border: 1px solid var(--accent);
          color: var(--accent);
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        /* Bottom Editorial Caption */
        .p3d-caption {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-family: monospace;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink);
          background: var(--pill-bg);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid var(--line-strong);
        }

        .p3d-caption-rule {
          flex: 1;
          height: 1px;
          background: var(--line);
        }

        /* Layer 4: Floating Primary Status Badge */
        .p3d-status-badge {
          position: absolute;
          left: 50%;
          bottom: -22px;
          z-index: 15;
          transform: translate3d(
            calc(-50% + var(--shift-x, 0px) * 1.35),
            calc(var(--shift-y, 0px) * 1.35),
            82px
          );
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 11px 24px;
          border-radius: 999px;
          background: var(--pill-bg);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid var(--accent-glow);
          color: var(--ink);
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
          box-shadow:
            0 18px 38px -10px var(--shadow-color),
            0 0 16px -4px var(--accent-glow);
          pointer-events: auto;
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
          outline: none;
        }

        .p3d-status-badge:hover {
          border-color: var(--accent);
          box-shadow:
            0 20px 42px -8px var(--shadow-color),
            0 0 24px -2px var(--accent-glow);
        }

        /* Live Pulsing Emerald Status Dot */
        .p3d-beacon {
          position: relative;
          width: 9px;
          height: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .p3d-beacon-core {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .p3d-beacon-ping {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid #10b981;
          opacity: 0.85;
          animation: p3dPing 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes p3dPing {
          0% { transform: scale(0.6); opacity: 0.95; }
          75%, 100% { transform: scale(2.4); opacity: 0; }
        }

        @keyframes p3dPulse {
          from { opacity: 0.65; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1.1); }
        }

        /* ─── Responsive & Accessibility ────────────────────── */
        @media (max-width: 980px) {
          .p3d-stage {
            width: min(100%, 320px);
          }
          .p3d-orbitals {
            display: none;
          }
          .p3d-floating-pill {
            right: -6px;
            top: -10px;
            font-size: 0.66rem;
            padding: 6px 12px;
          }
          .p3d-status-badge {
            font-size: 0.76rem;
            padding: 9px 18px;
            bottom: -18px;
          }
        }

        @media (max-width: 620px) {
          .p3d-stage {
            width: min(100%, 290px);
          }
          .p3d-floating-pill {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .p3d-stage:not(.is-active) .p3d-chassis {
            animation: none;
          }
          .p3d-ring-outer,
          .p3d-ring-inner,
          .p3d-beacon-ping,
          .p3d-pill-sparkle {
            animation: none;
          }
          .p3d-chassis {
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Layer -2: Deep Ambient 3D Backlight Halo */}
      <div className="p3d-ambient-halo" aria-hidden="true" />

      {/* Layer -1: 3D Celestial Orbital Gyroscope */}
      <div className="p3d-orbitals" aria-hidden="true">
        <div className="p3d-ring p3d-ring-outer">
          <span className="p3d-sat-node" />
        </div>
        <div className="p3d-ring p3d-ring-inner">
          <span className="p3d-sat-node-secondary" />
        </div>
      </div>

      {/* Floating Experience Pill (Top-Right Parallax Badge) */}
      <div className="p3d-floating-pill">
        <span className="p3d-pill-sparkle">✦</span>
        <span>Full-Stack Dev</span>
      </div>

      {/* Main 3D Card Chassis */}
      <div
        className="p3d-chassis"
        ref={chassisRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handlePointerLeave}
      >
        {/* Layer 0: Card Substrate Plate */}
        <div className="p3d-substrate">
          <div className="p3d-bg-grid" aria-hidden="true" />
          <div className="p3d-spotlight" aria-hidden="true" />
          <div className="p3d-watermark" aria-hidden="true">
       
            <span>PORTFOLIO</span>
          </div>
        </div>

        {/* Layer 1: Cutout Subject with Dynamic 3D Cast Shadow */}
        <div className="p3d-subject-layer">
          <img
            src={solaImage}
            alt="Mohammed Skikri"
            className="p3d-subject-img"
            loading="eager"
          />
        </div>

        {/* Layer 2: Specular Holographic Glare & Light Sheen */}
        <div className="p3d-glare-layer" aria-hidden="true">
          <div className="p3d-glare-radial" />
          <div className="p3d-glare-foil" />
        </div>

        {/* Layer 3: Precision Laser HUD Brackets & Metadata */}
        <div className="p3d-hud" aria-hidden="true">
          <span className="p3d-bracket tl" />
          <span className="p3d-bracket tr" />
          <span className="p3d-bracket bl" />
          <span className="p3d-bracket br" />

          <div className="p3d-hud-header">
            <span className="p3d-hud-tag">
              <span className="p3d-hud-dot" />
              <span>CORE ARCHITECT</span>
            </span>
            
          </div>

          <div className="p3d-caption">
            <span>Plate I</span>
            <span className="p3d-caption-rule" />
            <span>M. Skikri</span>
          </div>
        </div>

        {/* Layer 4: Floating Primary Status Badge */}
        <button
          type="button"
          className="p3d-status-badge"
          onClick={onOpenCv}
          title="Click to preview Mohammed's CV"
        >
          <span className="p3d-beacon" aria-hidden="true">
            <span className="p3d-beacon-ping" />
            <span className="p3d-beacon-core" />
          </span>
          <span>Available for new positions</span>
        </button>
      </div>
    </div>
  );
};

export default Hero3DPortrait;
