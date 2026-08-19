import React, { useEffect, useRef, useState } from 'react';

interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  proficiency: string;
  level: string;
  dots: number; // kept for compatibility, no longer rendered
  percentage: number;
}

interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  logo: string;
  skills?: string;
}

interface CertificateItem {
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

const languagesData: LanguageItem[] = [
  {
    code: "AR",
    name: "Arabic",
    nativeName: "العربية",
    proficiency: "Native or bilingual proficiency",
    level: "Native / Mother Tongue",
    dots: 5,
    percentage: 100
  },
  {
    code: "EN",
    name: "English",
    nativeName: "English",
    proficiency: "Limited working proficiency",
    level: "Working Proficiency",
    dots: 3,
    percentage: 65
  },
  {
    code: "FR",
    name: "French",
    nativeName: "Français",
    proficiency: "Limited working proficiency",
    level: "Working Proficiency",
    dots: 3,
    percentage: 65
  }
];

const educationData: EducationItem[] = [
  {
    institution: "Sup'Management",
    degree: "Licence Professionnelle en Génie Informatique",
    period: "2025 — Present",
    logo: "bx bxs-graduation",
    skills: "Oracle Database, Java, Software Engineering"
  },
  {
    institution: "Ecole Polytechnique des Génies",
    degree: "Stage à l'École Polytechnique de Génie de Fès",
    period: "Mar 2025 — Apr 2025",
    logo: "bx bxs-briefcase",
    skills: "Full-time, Hybrid, Fès-Meknès"
  },
  {
    institution: "OFPPT",
    degree: "Technicien Spécialisé en Développement Informatique",
    period: "2023 — 2025",
    logo: "bx bxs-school",
    skills: "Python, Tailwind CSS, Web Development"
  },
  {
    institution: "Lycée Qualifiant Abderrahim Bouabid",
    degree: "Baccalauréat en Sciences Expérimentales (Série SVT)",
    period: "2022 — Jun 2023",
    logo: "bx bxs-book-bookmark"
  }
];

// Update the url fields with your real Coursera credential links
const certificatesData: CertificateItem[] = [
  {
    title: "Advanced React",
    issuer: "Coursera",
    date: "",
    url: "#"
  },
  {
    title: "Excel Skills for Business: Essentials",
    issuer: "Coursera",
    date: "",
    url: "#"
  },
  {
    title: "Database Structures and Management with MySQL",
    issuer: "Coursera",
    date: "",
    url: "#"
  }
];

const pad = (n: number) => String(n).padStart(2, '0');

/* ---------- Scroll-in-view hook ---------- */
function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ---------- Count-up hook, keyed to a trigger + delay ---------- */
function useCountUp(target: number, trigger: boolean, delayMs: number, durationMs = 1100) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    let start: number | null = null;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(Math.max((elapsed) / durationMs, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };

    const timeout = setTimeout(() => {
      frame.current = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, target, delayMs, durationMs]);

  return value;
}

const RING_RADIUS = 38;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const Education: React.FC = () => {
  const total = educationData.length;
  const certTotal = certificatesData.length;
  const langTotal = languagesData.length;

  const { ref: langBlockRef, inView: langInView } = useInView<HTMLDivElement>(0.2);

  return (
    <>
      <style>{`
        .education-section {
          position: relative;
          padding: 120px 7% 100px;
          box-sizing: border-box;
          background: var(--bg);
          color: var(--ink);
          transition: background 0.4s ease;
        }

        @media (prefers-reduced-motion: no-preference) {
          .education-section * {
            scroll-behavior: smooth;
          }
        }

        /* ---------- Professional Languages Section ---------- */
        .languages-section-block {
          max-width: 820px;
          margin: 0 auto 90px;
        }

        .languages-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .languages-section-block.is-in-view .languages-header-row {
          opacity: 1;
          transform: translateY(0);
        }

        .languages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .lang-card {
          --i: 0;
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 26px 24px;
          box-shadow: 0 10px 30px var(--shadow-color);
          backdrop-filter: blur(14px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 22px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          transition:
            opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.35s ease,
            box-shadow 0.35s ease;
          transition-delay: calc(var(--i) * 110ms), calc(var(--i) * 110ms), 0s, 0s;
        }

        .languages-section-block.is-in-view .lang-card {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .lang-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .lang-card:hover {
          transform: translateY(-5px) scale(1);
          border-color: var(--accent-glow);
          box-shadow: 0 18px 44px var(--shadow-color);
        }

        .lang-card:hover::before {
          opacity: 1;
        }

        .lang-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .lang-code-pill {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--accent);
          background: var(--accent-soft);
          border: 1px solid var(--accent-glow);
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        .lang-card:hover .lang-code-pill {
          box-shadow: 0 0 0 4px var(--accent-soft);
        }

        .lang-native-script {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.95rem;
          font-style: italic;
          color: var(--faint);
        }

        .lang-card-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lang-name-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ink);
          margin: 0;
          line-height: 1.2;
        }

        .lang-prof-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.84rem;
          font-weight: 400;
          color: var(--muted);
          margin: 0;
        }

        .lang-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 18px;
          border-top: 1px solid var(--line);
        }

        .lang-level-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lang-level-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--faint);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .lang-level-badge {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.3;
          max-width: 130px;
        }

        .lang-ring-wrap {
          position: relative;
          width: 76px;
          height: 76px;
          flex: 0 0 auto;
        }

        .lang-ring {
          width: 76px;
          height: 76px;
          transform: rotate(-90deg);
          overflow: visible;
        }

        .lang-ring-track {
          fill: none;
          stroke: var(--line);
          stroke-width: 6;
        }

        .lang-ring-fill {
          fill: none;
          stroke: var(--accent);
          stroke-width: 6;
          stroke-linecap: round;
          filter: drop-shadow(0 0 5px var(--accent-glow));
          transition: stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: calc(var(--i) * 110ms + 200ms);
        }

        .lang-ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--accent);
          font-variant-numeric: tabular-nums;
        }

        @media (prefers-reduced-motion: reduce) {
          .lang-card,
          .languages-header-row,
          .lang-ring-fill {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        /* ---------- Header & Timeline ---------- */
        .education-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 64px;
          flex-wrap: wrap;
        }

        .header-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          margin: 0 0 18px 0;
        }

        .header-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 600;
          margin: 0;
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: var(--ink);
        }

        .header-title em {
          color: var(--accent);
          font-style: italic;
          font-weight: 500;
        }

        .header-counter {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--muted);
          white-space: nowrap;
        }

        .header-counter .current {
          color: var(--accent);
        }

        .timeline {
          max-width: 820px;
          margin: 0 auto;
          position: relative;
        }

        .timeline-item {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 24px;
          position: relative;
        }

        .timeline-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .timeline-marker {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--accent);
          color: var(--accent);
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-soft);
          flex: 0 0 auto;
        }

        .timeline-connector {
          width: 1px;
          flex: 1;
          background: var(--line);
          margin: 6px 0;
        }

        .timeline-card {
          padding: 26px 28px 30px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: var(--card-bg);
          margin-bottom: 24px;
          box-shadow: 0 10px 30px var(--shadow-color);
          transition: border-color 0.35s ease, transform 0.35s ease, background 0.35s ease;
        }

        .timeline-card:hover {
          border-color: var(--accent-glow);
          transform: translateY(-3px);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 14px;
        }

        .institution-name {
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--faint);
          margin: 0;
        }

        .period {
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--muted);
        }

        .degree {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.55rem;
          font-weight: 600;
          line-height: 1.28;
          color: var(--ink);
          margin: 0 0 18px 0;
        }

        .skills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }

        .skill-tag {
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid var(--line);
          color: var(--muted);
          background: var(--card-bg);
        }

        .timeline-item:last-child .timeline-connector {
          display: none;
        }

        /* ---------- Certificates & Online Learning ---------- */

        .certs-block {
          max-width: 820px;
          margin: 100px auto 0;
        }

        .certs-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 36px;
          flex-wrap: wrap;
          border-top: 1px solid var(--line);
          padding-top: 56px;
        }

        .certs-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.7rem, 3vw, 2.2rem);
          font-weight: 600;
          margin: 0;
          line-height: 1.15;
          color: var(--ink);
        }

        .certs-title em {
          color: var(--accent);
          font-style: italic;
          font-weight: 500;
        }

        .certs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 10px 30px var(--shadow-color);
        }

        .cert-card {
          background: var(--card-bg);
          padding: 24px 26px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-decoration: none;
          color: inherit;
          transition: background 0.3s ease;
        }

        .cert-card.is-link:hover {
          background: var(--accent-soft);
        }

        .cert-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .cert-index {
          font-family: var(--label-font);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent);
        }

        .cert-date {
          font-family: var(--label-font);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--muted);
        }

        .cert-title {
          font-family: var(--display-font);
          font-size: 1.12rem;
          font-weight: 600;
          line-height: 1.3;
          color: var(--ink);
          margin: 0;
        }

        .cert-issuer {
          font-family: var(--label-font);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--faint);
        }

        .cert-link-hint {
          font-family: var(--label-font);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--accent);
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .cert-card.is-link:hover .cert-link-hint {
          opacity: 1;
          transform: translateX(0);
        }

        .certs-empty {
          font-family: var(--label-font);
          font-size: 0.9rem;
          color: var(--muted);
          border: 1px dashed var(--line);
          border-radius: 14px;
          padding: 30px 26px;
          text-align: center;
        }

        @media (max-width: 640px) {
          .languages-section-block {
            margin-bottom: 60px;
          }

          .languages-grid {
            grid-template-columns: 1fr;
          }

          .timeline-item {
            grid-template-columns: 44px 1fr;
            gap: 14px;
          }

          .timeline-marker {
            width: 32px;
            height: 32px;
            font-size: 0.65rem;
          }

          .timeline-card {
            padding: 20px 20px 24px;
          }

          .degree {
            font-size: 1.3rem;
          }

          .certs-block {
            margin-top: 72px;
          }

          .certs-header {
            padding-top: 40px;
          }
        }
      `}</style>

      <section className="education-section" id="education">
        {/* Professional Languages Section at Top */}
        <div
          className={`languages-section-block${langInView ? ' is-in-view' : ''}`}
          ref={langBlockRef}
        >
          <div className="languages-header-row">
            <div>
              <p className="header-eyebrow">Linguistic Skills · {pad(langTotal)} Languages</p>
              <h2 className="header-title">
                Languages & <em>fluency</em>.
              </h2>
            </div>
            <p className="header-counter">
              <span className="current">{pad(langTotal)}</span> / {pad(langTotal)}
            </p>
          </div>

          <div className="languages-grid">
            {languagesData.map((lang, idx) => (
              <LangCard key={idx} lang={lang} index={idx} inView={langInView} />
            ))}
          </div>
        </div>

        <div className="education-header">
          <div>
            <p className="header-eyebrow">Academic Background · {total} Entries</p>
            <h2 className="header-title">
              Learned to <em>build</em>.
            </h2>
          </div>
          <p className="header-counter">
            <span className="current">{pad(total)}</span> / {pad(total)}
          </p>
        </div>

        <div className="timeline">
          {educationData.map((edu, index) => (
            <div className="timeline-item" key={index}>
              <div className="timeline-rail">
                <div className="timeline-marker">{pad(index + 1)}</div>
                <div className="timeline-connector" />
              </div>

              <div className="timeline-card">
                <div className="card-top">
                  <p className="institution-name">{edu.institution}</p>
                  <span className="period">{edu.period}</span>
                </div>

                <h3 className="degree">{edu.degree}</h3>

                {edu.skills && (
                  <div className="skills-row">
                    {edu.skills.split(',').map((skill, sIdx) => (
                      <span key={sIdx} className="skill-tag">{skill.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="certs-block">
          <div className="certs-header">
            <h3 className="certs-title">
              Certificates & <em>online learning</em>
            </h3>
            <p className="header-counter">
              <span className="current">{pad(certTotal)}</span> / {pad(certTotal)}
            </p>
          </div>

          {certTotal > 0 ? (
            <div className="certs-grid">
              {certificatesData.map((cert, index) => {
                const CardTag: any = cert.url ? 'a' : 'div';
                return (
                  <CardTag
                    key={index}
                    className={`cert-card${cert.url ? ' is-link' : ''}`}
                    {...(cert.url ? { href: cert.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <div className="cert-top">
                      <span className="cert-index">{pad(index + 1)}</span>
                      {cert.date && <span className="cert-date">{cert.date}</span>}
                    </div>
                    <p className="cert-title">{cert.title}</p>
                    <span className="cert-issuer">{cert.issuer}</span>
                    {cert.url && <span className="cert-link-hint">View credential →</span>}
                  </CardTag>
                );
              })}
            </div>
          ) : (
            <div className="certs-empty">Certificates coming soon.</div>
          )}
        </div>
      </section>
    </>
  );
};

/* ---------- Individual language card, isolated so its count-up hook
   only runs for that card ---------- */
const LangCard: React.FC<{ lang: LanguageItem; index: number; inView: boolean }> = ({
  lang,
  index,
  inView
}) => {
  const delay = index * 110 + 200;
  const animatedPercent = useCountUp(lang.percentage, inView, delay);
  const offset = RING_CIRCUMFERENCE * (1 - animatedPercent / 100);

  return (
    <div className="lang-card" style={{ ['--i' as any]: index }}>
      <div className="lang-card-top">
        <span className="lang-code-pill">{lang.code}</span>
        <span className="lang-native-script">{lang.nativeName}</span>
      </div>

      <div className="lang-card-body">
        <h3 className="lang-name-title">{lang.name}</h3>
        <p className="lang-prof-text">{lang.proficiency}</p>
      </div>

      <div className="lang-card-footer">
        <div className="lang-level-meta">
          <span className="lang-level-label">Proficiency</span>
          <span className="lang-level-badge">{lang.level}</span>
        </div>

        <div className="lang-ring-wrap">
          <svg className="lang-ring" viewBox="0 0 84 84">
            <circle
              className="lang-ring-track"
              cx="42"
              cy="42"
              r={RING_RADIUS}
            />
            <circle
              className="lang-ring-fill"
              cx="42"
              cy="42"
              r={RING_RADIUS}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={inView ? offset : RING_CIRCUMFERENCE}
            />
          </svg>
          <div className="lang-ring-center">{animatedPercent}%</div>
        </div>
      </div>
    </div>
  );
};

export default Education;