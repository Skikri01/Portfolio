import React, { useEffect, useRef, useState } from 'react';
import CvModal from './CvModal';
import Hero3DPortrait from './Hero3DPortrait';

const ROLES = ['Full Stack Developer', 'Digital Solutions Technician', 'Software Engineering Student'];

const STATS = [
  { index: '01', label: 'Years building', value: '3+' },
  { index: '02', label: 'Projects shipped', value: '12+' },
  { index: '03', label: 'Core stack', value: 'React · Node · PHP' },
];

const GREETINGS = [
  { text: 'Hello', lang: 'English', code: 'EN', phonetic: '/həˈloʊ/' },
  { text: 'مرحباً', lang: 'Arabic', code: 'AR', phonetic: '/marħaban/' },
  { text: 'Bonjour', lang: 'French', code: 'FR', phonetic: '/bɔ̃.ʒuʁ/' },
  { text: 'Hola', lang: 'Spanish', code: 'ES', phonetic: '/ˈo.la/' },
  { text: 'Hallo', lang: 'German', code: 'DE', phonetic: '/ˈhalo/' },
  { text: 'こんにちは', lang: 'Japanese', code: 'JA', phonetic: '/koɲ.ɲi.tɕi.wa/' },
];

const STACK = [
  'React',
  'TypeScript',
  'Node.js',
  'Express',
  'Laravel',
  'MongoDB',
  'MySQL',
  'Tailwind',
  'REST APIs',
  'JWT',
  'Git',
  'Vite',
];

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mohamed-skikri-467862299/',
    path: 'M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Skikri-mohammed',
    path: 'M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z',
  },
  {
    label: 'Email',
    href: 'mailto:mohamedskikri44@gmail.com',
    path: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.13L4.6 6.5h14.8L12 12.13zM4 8.24V17h16V8.24l-8 6.1-8-6.1z',
  },
];

const Home: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [introIdx, setIntroIdx] = useState(0);
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isIntroExiting, setIsIntroExiting] = useState(false);
  const [heroGreetingIdx, setHeroGreetingIdx] = useState(0);
  const [isCvPreviewOpen, setIsCvPreviewOpen] = useState(false);
  const cvButtonRef = useRef<HTMLButtonElement>(null);
  const cvCardRef = useRef<HTMLDivElement>(null);
  const cvTimerRef = useRef<number | null>(null);

  const clearCvTimer = () => {
    if (cvTimerRef.current) {
      clearTimeout(cvTimerRef.current);
      cvTimerRef.current = null;
    }
  };

  const openCv = () => {
    clearCvTimer();
    setIsCvPreviewOpen(true);
  };

  const scheduleCloseCv = (delay = 280) => {
    clearCvTimer();
    cvTimerRef.current = window.setTimeout(() => {
      setIsCvPreviewOpen(false);
    }, delay);
  };

  const handleButtonMouseLeave = (e: React.MouseEvent) => {
    const btn = cvButtonRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const isStillInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (isStillInside) return;
    }
    scheduleCloseCv(350);
  };

  // Continuous pointer tracker to ensure smooth transitions without flickering
  useEffect(() => {
    if (!isCvPreviewOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      const btn = cvButtonRef.current;
      const card = cvCardRef.current;

      const isInside = (el: HTMLElement | null) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
      };

      const overBtn = isInside(btn);
      const overCard = isInside(card);

      if (overBtn || overCard) {
        clearCvTimer();
      } else if (!cvTimerRef.current) {
        scheduleCloseCv(280);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isCvPreviewOpen]);

  const handleDownloadCV = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const cvUrl = `${import.meta.env.BASE_URL}Mohammed_Skikri_CV.pdf`;

    try {
      const response = await fetch(cvUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      if (!blob || blob.size === 0) throw new Error('Received empty blob');

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'Mohammed_Skikri_CV.pdf');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // IMPORTANT: Delay DOM removal and URL revocation to allow Chromium (Chrome/Edge)
      // to fully process the download stream without truncating it to a 0 KB empty file.
      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (err) {
      console.warn('Blob download failed, using direct download link:', err);
      // Fallback: direct browser navigation/download
      const fallbackLink = document.createElement('a');
      fallbackLink.href = cvUrl;
      fallbackLink.setAttribute('download', 'Mohammed_Skikri_CV.pdf');
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      setTimeout(() => {
        if (fallbackLink.parentNode) {
          document.body.removeChild(fallbackLink);
        }
      }, 1000);
    }
  };

  // Preloader step sequence
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (introIdx < GREETINGS.length - 1) {
      timeoutId = setTimeout(() => {
        setIntroIdx((prev) => prev + 1);
      }, 380);
    } else {
      timeoutId = setTimeout(() => {
        setIsIntroExiting(true);
        setTimeout(() => setIsIntroActive(false), 850);
      }, 600);
    }
    return () => clearTimeout(timeoutId);
  }, [introIdx]);

  // Hero greeting loop
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroGreetingIdx((prev) => (prev + 1) % GREETINGS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Role roller
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const interval = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 3200);
    return () => clearInterval(interval);
  }, []);

  const handleSkipIntro = () => {
    setIsIntroExiting(true);
    setTimeout(() => setIsIntroActive(false), 700);
  };


  const renderWord = (word: string, className: string, baseDelay: number) =>
    word.split('').map((char, i) => (
      <span
        key={`${className}-${i}`}
        className="name-char"
        style={{ '--i': i, '--base': `${baseDelay}s` } as React.CSSProperties}
        aria-hidden="true"
      >
        {char}
      </span>
    ));

  const activeIntroGreeting = GREETINGS[introIdx];
  const currentHeroGreeting = GREETINGS[heroGreetingIdx];
  const progressPercent = Math.round(((introIdx + 1) / GREETINGS.length) * 100);

  return (
    <>
      {/* --- FULL-SCREEN EDITORIAL PRELOADER --- */}
      {isIntroActive && (
        <aside
          className={`greeting-preloader${isIntroExiting ? ' is-exiting' : ''}`}
          onClick={handleSkipIntro}
          role="button"
          tabIndex={0}
          aria-label="Welcome screen. Click to enter portfolio"
          onKeyDown={(e) => e.key === 'Enter' && handleSkipIntro()}
        >
          <div className="preloader-ambient-glow" aria-hidden="true" />

          <div className="greeting-loader-card">
            <div className="greeting-pill-badge">
              <span className="greeting-indicator-dot" />
              <span className="lang-name">{activeIntroGreeting.lang}</span>
              <span className="lang-code-tag">{activeIntroGreeting.code}</span>
            </div>

            <div className="greeting-stage">
              <h2 className="greeting-main-word" key={activeIntroGreeting.code}>
                {activeIntroGreeting.text}
              </h2>
              <span className="greeting-phonetic" key={`p-${activeIntroGreeting.code}`}>
                {activeIntroGreeting.phonetic}
              </span>
            </div>

            <div className="greeting-progress-track">
              <div
                className="greeting-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="greeting-loader-skip-hint">
            <span>Press anywhere to enter</span>
            <span className="hint-arrow">→</span>
          </div>
        </aside>
      )}

      <style>{`
        /* ─── Preloader Styles ────────────────────────────────── */
        .greeting-preloader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: #0b0c10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: transform 0.85s cubic-bezier(0.85, 0, 0.15, 1), opacity 0.6s ease;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
        }

        .greeting-preloader.is-exiting {
          transform: translateY(-100%);
          opacity: 0.98;
          pointer-events: none;
        }

        .preloader-ambient-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(184, 132, 47, 0.18) 0%, rgba(184, 132, 47, 0.03) 50%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
          animation: auraDrift 6s ease-in-out infinite alternate;
        }

        .greeting-loader-card {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          text-align: center;
          padding: 40px;
        }

        .greeting-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .greeting-indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #b8842f;
          box-shadow: 0 0 8px #b8842f;
        }

        .greeting-pill-badge .lang-name {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
        }

        .greeting-pill-badge .lang-code-tag {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: #b8842f;
          background: rgba(184, 132, 47, 0.12);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .greeting-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 110px;
        }

        .greeting-main-word {
          margin: 0;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(3.2rem, 7vw, 5.2rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #f7f7f8;
          animation: floatIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .greeting-phonetic {
          font-family: monospace;
          font-size: 0.8rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.08em;
          margin-top: 6px;
          animation: rise 0.4s ease forwards;
        }

        .greeting-progress-track {
          width: 180px;
          height: 2px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 99px;
          overflow: hidden;
        }

        .greeting-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #b8842f, #f1c27d);
          transition: width 0.38s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .greeting-loader-skip-hint {
          position: absolute;
          bottom: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.3s ease;
        }

        .greeting-loader-skip-hint .hint-arrow {
          transition: transform 0.3s ease;
        }

        .greeting-preloader:hover .greeting-loader-skip-hint {
          color: #b8842f;
        }

        .greeting-preloader:hover .hint-arrow {
          transform: translateX(4px);
        }

        /* ─── Hero Core ───────────────────────────────────────── */
        .hero {
          --hero-rule: var(--line);
          --hero-gap: clamp(40px, 5vw, 84px);

          position: relative;
          min-height: 100vh;
          width: 100%;
          background: var(--bg);
          padding: clamp(104px, 13vh, 132px) 6% 0 110px;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
          grid-template-rows: 1fr auto;
          align-items: center;
          column-gap: var(--hero-gap);
          overflow: hidden;
          transition: background 0.4s ease;
        }

        .hero-aura {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(90px);
          background: radial-gradient(circle, var(--accent-glow) 0%, var(--accent-soft) 55%, transparent 72%);
        }

        .hero-aura.is-left {
          top: 8%;
          left: -12%;
          width: 520px;
          height: 520px;
          animation: auraDrift 16s ease-in-out infinite alternate;
        }

        .hero-aura.is-right {
          bottom: 4%;
          right: -8%;
          width: 620px;
          height: 620px;
          animation: auraDrift 21s ease-in-out infinite alternate-reverse;
        }

        .hero-mesh {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.45;
          background-image:
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 76px 76px;
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 10%, transparent 80%);
          mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 10%, transparent 80%);
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.05;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .hero-content {
          position: relative;
          z-index: 3;
          max-width: 660px;
          padding: clamp(10px, 2.4vh, 26px) 0;
        }

        /* Dynamic Hero Greeting Badge */
        .hero-greeting-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          border-radius: 999px;
          background: var(--card-bg);
          border: 1px solid var(--line-strong);
          margin-bottom: 20px;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px var(--shadow-color);
          opacity: 0;
          animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.02s forwards;
        }

        .hero-greeting-word {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.94rem;
          font-weight: 600;
          color: var(--accent);
        }

        .hero-greeting-divider {
          width: 1px;
          height: 12px;
          background: var(--line-strong);
        }

        .hero-greeting-sub {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .hero-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 14px;
          margin-bottom: 26px;
          border-bottom: 1px solid var(--hero-rule);
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          opacity: 0;
          animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.08s forwards;
        }

        .hero-meta-sep {
          flex: 1;
          height: 1px;
          background: var(--hero-rule);
        }

        .hero-meta-live {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--ink);
        }

        .hero-meta-dot {
          position: relative;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4caf6d;
          box-shadow: 0 0 10px #4caf6d;
        }

        .hero-meta-dot::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid #4caf6d;
          animation: pulseRing 2.4s ease-out infinite;
        }

        .hero-nameplate {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.4rem, 10.4vw, 6rem);
          font-weight: 500;
          line-height: 1.08;
          letter-spacing: -0.028em;
          color: var(--ink);
          margin: 0;
        }

        .name-line {
          display: block;
          white-space: nowrap;
          overflow: visible;
        }

        .name-line.is-last {
          font-style: italic;
          font-weight: 400;
        }

        .name-line.is-last .name-char {
          background: linear-gradient(102deg, var(--ink) 0%, var(--accent) 55%, #f5d77f 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: var(--accent);
          padding: 0.22em 0.14em 0.1em 0.02em;
          margin: -0.22em -0.14em -0.1em -0.02em;
        }

        .name-char {
          display: inline-block;
          overflow: visible;
          opacity: 0;
          animation: charRise 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: calc(var(--base, 0s) + var(--i) * 0.038s);
        }

        .hero-role {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: clamp(16px, 2.6vh, 26px) 0;
          opacity: 0;
          animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.62s forwards;
        }

        .hero-role-rule {
          width: 56px;
          height: 1px;
          flex: none;
          background: linear-gradient(90deg, var(--accent), transparent);
        }

        .role-window {
          position: relative;
          height: 1.5em;
          flex: 1;
          overflow: hidden;
        }

        .role-item {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          font-family: monospace;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          white-space: nowrap;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.62s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
        }

        .role-item.is-active {
          transform: translateY(0);
          opacity: 1;
        }

        .role-item.is-prev {
          transform: translateY(-110%);
          opacity: 0;
        }

        .hero-tagline {
          font-size: 1.02rem;
          line-height: 1.75;
          color: var(--muted);
          max-width: 48ch;
          margin: 0 0 clamp(24px, 3.4vh, 38px);
          opacity: 0;
          animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.72s forwards;
        }

        .hero-tagline strong {
          color: var(--ink);
          font-weight: 600;
        }

        .hero-cta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: clamp(26px, 4vh, 44px);
          opacity: 0;
          animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.8s forwards;
        }

        .btn-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 15px 30px;
          border-radius: 999px;
          overflow: hidden;
          isolation: isolate;
          background: var(--accent);
          color: #12100b;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          border: 1px solid transparent;
          box-shadow: 0 14px 34px -14px var(--accent);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.45) 50%, transparent 80%);
          transform: translateX(-110%);
          transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 44px -14px var(--accent);
        }

        .btn-primary:hover::after {
          transform: translateX(110%);
        }

        .btn-primary svg {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .btn-primary:hover svg {
          transform: translateX(4px);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 26px;
          border-radius: 999px;
          background: transparent;
          color: var(--ink);
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          border: 1px solid var(--line-strong);
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .btn-ghost:hover {
          border-color: var(--accent);
          background: var(--accent-soft);
          transform: translateY(-3px);
        }

        .btn-ghost svg {
          transition: transform 0.3s ease;
        }

        .btn-ghost:hover svg {
          transform: translateY(2px);
        }


        .hero-index {
          display: flex;
          align-items: stretch;
          gap: 0;
          border-top: 1px solid var(--hero-rule);
          padding-top: 22px;
          opacity: 0;
          animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.88s forwards;
        }

        .hero-index-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 26px;
          border-left: 1px solid var(--hero-rule);
        }

        .hero-index-cell:first-child {
          padding-left: 0;
          border-left: none;
        }

        .hero-index-no {
          font-family: monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--accent);
        }

        .hero-index-val {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1;
          color: var(--ink);
        }

        .hero-index-lbl {
          font-size: 0.74rem;
          color: var(--muted);
        }

        .hero-socials {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: clamp(18px, 3vh, 30px);
          opacity: 0;
          animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.96s forwards;
        }

        .social-link {
          display: inline-grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: var(--card-bg);
          color: var(--muted);
          text-decoration: none;
          transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .social-link:hover {
          color: var(--accent);
          border-color: var(--accent);
          background: var(--accent-soft);
          transform: translateY(-3px);
        }

        /* ─── Portrait Plate ──────────────────────────────────── */
        .hero-plate-col {
          position: relative;
          z-index: 3;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px 0;
          perspective: 1200px;
          opacity: 0;
          animation: rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
        }

        /* ─── Footer Marquee ──────────────────────────────────── */
        .hero-footer {
          grid-column: 1 / -1;
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 28px;
          margin-top: 18px;
          padding: 12px 0 16px;
          border-top: 1px solid var(--hero-rule);
          opacity: 0;
          animation: rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.05s forwards;
        }

        .scroll-cue {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex: none;
          font-family: monospace;
          font-size: 0.64rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .scroll-cue:hover { color: var(--accent); }

        .scroll-cue-track {
          position: relative;
          width: 34px;
          height: 1px;
          background: var(--line-strong);
          overflow: hidden;
        }

        .scroll-cue-track::after {
          content: '';
          position: absolute;
          top: -1px;
          left: 0;
          width: 12px;
          height: 3px;
          border-radius: 2px;
          background: var(--accent);
          animation: cueSlide 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .ticker {
          position: relative;
          flex: 1;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: marquee 42s linear infinite;
        }

        .ticker:hover .ticker-track {
          animation-play-state: paused;
        }

        .ticker-group {
          display: flex;
          align-items: center;
          gap: 26px;
          padding-right: 26px;
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 26px;
          font-family: monospace;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
        }

        .ticker-item::after {
          content: '';
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.7;
        }

        /* ─── Keyframe Animations ─────────────────────────────── */
        @keyframes floatIn {
          0% { opacity: 0; transform: translateY(12px) scale(0.97); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @keyframes rise {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes charRise {
          from { opacity: 0; transform: translateY(0.42em) rotate(2deg); }
          to { opacity: 1; transform: translateY(0) rotate(0); }
        }

        @keyframes auraDrift {
          from { transform: translate3d(0, 0, 0) scale(0.94); opacity: 0.75; }
          to { transform: translate3d(24px, -22px, 0) scale(1.08); opacity: 1; }
        }

        @keyframes plateSpin {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }

        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.3); opacity: 0; }
        }

        @keyframes cueSlide {
          0% { transform: translateX(-14px); }
          100% { transform: translateX(36px); }
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ─── Responsive Queries ──────────────────────────────── */
        @media (max-width: 1180px) {
          .hero { padding-left: 92px; }
          .hero-index-cell { padding: 0 18px; }
        }

        @media (max-width: 968px) {
          .hero {
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: auto auto auto;
            justify-items: center;
            text-align: center;
            padding: 116px 6% 0 72px;
            row-gap: 8px;
          }

          .hero-content { order: 2; padding-top: 8px; }
          .hero-plate-col { order: 1; padding-bottom: 34px; }
          .hero-footer { order: 3; }

          .hero-greeting-badge { margin-inline: auto; }
          .hero-meta { justify-content: center; }
          .hero-role { justify-content: center; }
          .role-window { flex: 0 1 auto; min-width: 260px; }
          .hero-tagline { margin-inline: auto; }
          .hero-cta,
          .hero-index,
          .hero-socials { justify-content: center; }
          .hero-index-cell:first-child { padding-left: 26px; }
        }

        @media (max-width: 620px) {
          .hero { padding: 104px 5% 0 62px; }
          .hero-index { flex-wrap: wrap; gap: 18px 0; }
          .hero-index-cell { padding: 0 16px; }
          .hero-footer { flex-direction: column; align-items: stretch; gap: 14px; }
          .scroll-cue { justify-content: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-greeting-badge,
          .hero-meta,
          .name-char,
          .hero-role,
          .hero-tagline,
          .hero-cta,
          .hero-index,
          .hero-socials,
          .hero-plate-col,
          .hero-footer {
            animation: none;
            opacity: 1;
            transform: none;
          }

          .hero-aura,
          .ticker-track,
          .scroll-cue-track::after,
          .hero-meta-dot::after {
            animation: none;
          }
        }
      `}</style>

      <section className="hero" id="home">
        <div className="hero-aura is-left" aria-hidden="true" />
        <div className="hero-aura is-right" aria-hidden="true" />
        <div className="hero-mesh" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />

        <div className="hero-content">
          {/* DYNAMIC EDITORIAL GREETING BADGE */}
          <div className="hero-greeting-badge">
            <span className="hero-meta-dot" aria-hidden="true" />
            <span className="hero-greeting-word" key={currentHeroGreeting.code}>
              {currentHeroGreeting.text}
            </span>
            <span className="hero-greeting-divider" aria-hidden="true" />
            <span className="hero-greeting-sub">Welcome</span>
          </div>

          <p className="hero-meta">
            <span>Portfolio — 2026</span>
            <span className="hero-meta-sep" aria-hidden="true" />
            <span>Fes, Morocco</span>
            <span className="hero-meta-sep" aria-hidden="true" />
            <span className="hero-meta-live">
              <span className="hero-meta-dot" aria-hidden="true" />
              Open to work
            </span>
          </p>

          <h1 className="hero-nameplate" aria-label="Mohammed Skikri">
            <span className="name-line">{renderWord('Mohammed', 'first', 0.18)}</span>
            <span className="name-line is-last">{renderWord('Skikri', 'last', 0.42)}</span>
          </h1>

          <div className="hero-role">
            <span className="hero-role-rule" aria-hidden="true" />
            <span className="role-window" aria-live="polite">
              {ROLES.map((role, idx) => (
                <span
                  key={role}
                  className={[
                    'role-item',
                    idx === roleIndex ? 'is-active' : '',
                    idx === (roleIndex - 1 + ROLES.length) % ROLES.length ? 'is-prev' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {role}
                </span>
              ))}
            </span>
          </div>

          <p className="hero-tagline">
            I build <strong>high-performance full-stack applications</strong> — from database schema to
            the last easing curve. Currently deepening my software engineering practice while shipping
            production systems for real businesses.
          </p>

          <div className="hero-cta">
            <a href="#contact" className="btn-primary">
              Get in touch
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <button
              ref={cvButtonRef}
              type="button"
              onMouseEnter={openCv}
              onMouseLeave={handleButtonMouseLeave}
              onClick={() => setIsCvPreviewOpen((prev) => !prev)}
              className="btn-ghost"
              aria-label="View Mohammed Skikri's CV"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="14 2 14 8 20 8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="16"
                  y1="13"
                  x2="8"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="16"
                  y1="17"
                  x2="8"
                  y2="17"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="10 9 9 9 8 9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              View CV
            </button>

            <a
              href={`${import.meta.env.BASE_URL}Mohammed_Skikri_CV.pdf`}
              download="Mohammed_Skikri_CV.pdf"
              onClick={handleDownloadCV}
              className="btn-ghost"
              aria-label="Download Mohammed Skikri's CV"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path
                  d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download CV
            </a>
          </div>

          <div className="hero-index">
            {STATS.map((stat) => (
              <div className="hero-index-cell" key={stat.label}>
                <span className="hero-index-no">{stat.index}</span>
                <span className="hero-index-val">{stat.value}</span>
                <span className="hero-index-lbl">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-socials">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="social-link"
                aria-label={social.label}
                {...(social.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="hero-plate-col">
          <Hero3DPortrait onOpenCv={openCv} />
        </div>

        <div className="hero-footer">
          <a className="scroll-cue" href="#projects">
            <span>Scroll</span>
            <span className="scroll-cue-track" aria-hidden="true" />
          </a>

          <div className="ticker" aria-hidden="true">
            <div className="ticker-track">
              {[0, 1].map((copy) => (
                <div className="ticker-group" key={copy}>
                  {STACK.map((item) => (
                    <span className="ticker-item" key={`${copy}-${item}`}>
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CvModal
        isOpen={isCvPreviewOpen}
        onClose={() => {
          clearCvTimer();
          setIsCvPreviewOpen(false);
        }}
        cardRef={cvCardRef}
        onCardMouseEnter={clearCvTimer}
        onCardMouseLeave={() => scheduleCloseCv(280)}
      />
    </>
  );
};

export default Home;