import React, { useState, useEffect } from 'react';

interface SectionItem {
  id: string;
  label: string;
  number: string;
}

const SECTIONS: SectionItem[] = [
  { id: 'home', label: 'Home', number: '00' },
  { id: 'education', label: 'Education', number: '01' },
  { id: 'projects', label: 'Projects', number: '02' },
  { id: 'skills', label: 'Skills', number: '03' },
  { id: 'contact', label: 'Contact', number: '04' },
];

const SideScrollbar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate overall scroll progress (0 to 100%)
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Determine active section based on scroll position
      const viewportCenter = window.scrollY + window.innerHeight / 3;
      
      let currentSectionIdx = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const element = document.getElementById(SECTIONS[i].id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (viewportCenter >= top && viewportCenter < top + height) {
            currentSectionIdx = i;
            break;
          } else if (viewportCenter >= top) {
            currentSectionIdx = i;
          }
        }
      }
      setActiveIndex(currentSectionIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        /* Floating Minimal Logo Pill (Top Left) */
        .brand-logo-pill {
          position: fixed;
          top: 24px;
          left: 28px;
          z-index: 1000;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: var(--pill-bg);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid var(--line);
          border-radius: 999px;
          text-decoration: none;
          box-shadow: 0 10px 30px var(--shadow-color);
          transition: all 0.3s ease;
        }

        .brand-logo-pill:hover {
          border-color: var(--accent-glow);
          transform: translateY(-2px);
          box-shadow: 0 14px 35px var(--accent-soft);
        }

        .brand-logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent-glow);
        }

        .brand-logo-text {
          font-family: 'Playfair Display', Georgia, serif;
          color: var(--ink);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        /* Floating Side Scroll Navigator Pill (Fixed LEFT Side) */
        .side-scrollbar-container {
          position: fixed;
          left: 20px;
          top: 55%;
          transform: translateY(-50%);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 42px;
          padding: 18px 4px;
          background: var(--pill-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--line);
          border-radius: 40px;
          box-shadow: 0 16px 40px var(--shadow-color), inset 0 1px 1px var(--line);
          gap: 10px;
          user-select: none;
          box-sizing: border-box;
        }

        /* Scroll Progress Line inside Pill */
        .scrollbar-progress-track {
          position: absolute;
          right: 3px;
          top: 18px;
          bottom: 18px;
          width: 2px;
          background: var(--line);
          border-radius: 2px;
          overflow: hidden;
        }

        .scrollbar-progress-fill {
          width: 100%;
          background: linear-gradient(180deg, var(--accent) 0%, #b8842f 100%);
          border-radius: 2px;
          transition: height 0.15s ease-out;
        }

        /* Number Button Item */
        .scroll-number-item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 3px 5px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 32px;
          height: 28px;
          border-radius: 999px;
        }

        .scroll-number-text {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--faint);
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .scroll-number-item:hover .scroll-number-text {
          color: var(--ink);
        }

        /* Active Number Badge Styling */
        .scroll-number-item.active {
          padding: 3px 5px;
          border: 1.5px solid var(--accent);
          border-radius: 999px;
          background: var(--accent-soft);
          box-shadow: 0 0 14px var(--accent-glow);
        }

        .scroll-number-item.active .scroll-number-text {
          color: var(--ink);
          font-weight: 800;
          text-shadow: 0 0 8px var(--accent-glow);
        }

        /* Hover Tooltip Popup (Pops to the RIGHT of Pill) */
        .scroll-tooltip {
          position: absolute;
          left: calc(100% + 14px);
          top: 50%;
          transform: translateY(-50%) translateX(-6px);
          background: var(--pill-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--line-strong);
          color: var(--ink);
          padding: 6px 14px;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 20px var(--shadow-color);
        }

        .scroll-tooltip::after {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: transparent var(--pill-bg) transparent transparent;
        }

        .scroll-number-item:hover .scroll-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(0);
        }

        /* Responsiveness */
        @media (max-width: 768px) {
          .brand-logo-pill {
            top: 16px;
            left: 16px;
            padding: 8px 16px;
          }
          .brand-logo-text {
            font-size: 0.95rem;
          }
          .side-scrollbar-container {
            left: 12px;
            padding: 18px 10px;
            gap: 10px;
            border-radius: 40px;
          }
          .scroll-number-item.active {
            padding: 4px 10px;
          }
          .scroll-number-text {
            font-size: 0.78rem;
          }
          .scroll-tooltip {
            display: none; /* Hide tooltips on mobile to avoid overlapping */
          }
        }
      `}</style>

      {/* Brand Logo Anchor (Top Left) */}
      <a href="#home" className="brand-logo-pill" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
        <span className="brand-logo-dot"></span>
        <span className="brand-logo-text">Skikri</span>
      </a>

      {/* Professional Side Scrollbar Navigator (Fixed LEFT Side) */}
      <nav className="side-scrollbar-container" aria-label="Section Scroll Navigation">
        <div className="scrollbar-progress-track" aria-hidden="true">
          <div className="scrollbar-progress-fill" style={{ height: `${scrollProgress}%` }}></div>
        </div>

        {SECTIONS.map((section, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={section.id}
              className={`scroll-number-item ${isActive ? 'active' : ''}`}
              onClick={() => scrollToSection(section.id)}
              aria-label={`Scroll to section ${section.number}: ${section.label}`}
            >
              <span className="scroll-number-text">{section.number}</span>
              <div className="scroll-tooltip">
                {section.number} &bull; {section.label}
              </div>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default SideScrollbar;
