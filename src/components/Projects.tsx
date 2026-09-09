import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../data/portfolio-data';
import { useReveal } from '../hooks/useReveal';
import { useSpotlight } from '../hooks/useSpotlight';

gsap.registerPlugin(ScrollTrigger);

export const ProjectsShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const titleRef = useReveal<HTMLHeadingElement>();
  const onSpotlight = useSpotlight();

  useEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    if (!section || !timeline) return;

    const ctx = gsap.context(() => {
      const cards = timeline.querySelectorAll('.timeline-card-wrapper');
      const nodes = timeline.querySelectorAll('.timeline-node');

      cards.forEach((card, idx) => {
        const isEven = idx % 2 === 0;
        const node = nodes[idx];

        // Animate Cards
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isEven ? -60 : 60,
            y: 30,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Animate Timeline Node
        if (node) {
          gsap.fromTo(
            node,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const getNodeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'car':
        return 'bx bx-car';
      case 'time':
        return 'bx bx-time-five';
      case 'leaf':
        return 'bx bx-leaf';
      case 'code':
        return 'bx bx-code-alt';
      case 'briefcase':
        return 'bx bx-briefcase';
      case 'film':
        return 'bx bx-movie-play';
      default:
        return 'bx bx-atom';
    }
  };

  return (
    <>
      <style>{`
        /* ─── Timeline Section Base Layout ───────────────────────── */
        .timeline-section {
          width: 100%;
          position: relative;
          background: var(--bg);
          color: var(--ink);
          padding: 120px 6vw;
          box-sizing: border-box;
          overflow: hidden;
          transition: background 0.4s ease, color 0.4s ease;
        }

        /* ─── Section Header ────────────────────────────────────── */
        .timeline-header-center {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 80px auto;
          position: relative;
          z-index: 2;
        }

        .timeline-eyebrow {
          font-family: var(--font-mono, 'Courier New', monospace);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 16px;
          display: inline-block;
        }

        .timeline-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.015em;
          color: var(--ink);
          margin: 0 0 20px 0;
        }

        .timeline-title em {
          font-style: italic;
          font-family: 'Playfair Display', Georgia, serif;
          color: var(--accent);
          font-weight: 400;
        }

        .timeline-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          line-height: 1.65;
          color: var(--muted);
          max-width: 620px;
          margin: 0 auto;
        }

        /* ─── Central Timeline Spine ────────────────────────────── */
        .timeline-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 0;
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(
            180deg,
            var(--accent-soft) 0%,
            var(--accent) 15%,
            var(--accent) 85%,
            var(--accent-soft) 100%
          );
          box-shadow: 0 0 12px var(--accent-glow);
          z-index: 1;
        }

        /* ─── Timeline Row & Nodes ──────────────────────────────── */
        .timeline-row {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 70px;
          z-index: 2;
        }

        .timeline-row:last-child {
          margin-bottom: 0;
        }

        .timeline-row.left-row {
          justify-content: flex-start;
        }

        .timeline-row.right-row {
          justify-content: flex-end;
        }

        .timeline-node {
          position: absolute;
          left: 50%;
          top: 40px;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--card-bg-solid);
          border: 1.5px solid var(--accent);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          box-shadow: 0 0 18px var(--accent-glow), inset 0 0 10px var(--accent-soft);
          z-index: 5;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .timeline-row:hover .timeline-node {
          transform: translate(-50%, -50%) scale(1.15);
          box-shadow: 0 0 24px var(--accent-glow), inset 0 0 12px var(--accent-glow);
        }

        /* ─── Timeline Card Slab ───────────────────────────────── */
        .timeline-card-wrapper {
          width: calc(50% - 48px);
        }

        .timeline-card {
          position: relative;
          background: var(--card-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--line);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 16px 40px var(--shadow-color);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.4s ease,
                      box-shadow 0.4s ease;
          will-change: transform;
        }

        .timeline-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent-glow);
          box-shadow: 0 20px 48px var(--shadow-color), 0 0 24px var(--accent-glow);
        }

        /* Card Visual Header Banner with Project Image */
        .card-banner {
          position: relative;
          height: 210px;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
        }

        .banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .timeline-card:hover .banner-img {
          transform: scale(1.06);
        }

        .banner-art {
          position: absolute;
          inset: 0;
          opacity: 0.85;
          transition: transform 0.6s ease;
        }

        .timeline-card:hover .banner-art {
          transform: scale(1.05);
        }

        /* Dark Gradient Overlay for Banner Image readability */
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            var(--card-bg) 100%
          );
          pointer-events: none;
        }

        .banner-badge {
          position: absolute;
          top: 16px;
          right: 18px;
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--accent);
          background: var(--pill-bg);
          border: 1px solid var(--accent-glow);
          padding: 5px 12px;
          border-radius: 999px;
          backdrop-filter: blur(8px);
          z-index: 2;
          text-transform: uppercase;
          box-shadow: 0 4px 12px var(--shadow-color);
        }

        .timeline-card.is-private .banner-badge {
          color: #e8a87c;
          border-color: rgba(232, 168, 124, 0.5);
        }

        /* Card Content Body */
        .card-body {
          padding: 26px 30px 28px;
        }

        .card-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .meta-date {
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          display: inline-block;
        }

        .meta-company {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--muted);
          text-transform: uppercase;
        }

        .card-title-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.55rem;
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin: 0 0 16px 0;
        }

        /* Highlights Bullet List */
        .card-highlights {
          list-style: none;
          padding: 0;
          margin: 0 0 22px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card-highlights li {
          position: relative;
          padding-left: 18px;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--muted);
        }

        .card-highlights li::before {
          content: "•";
          position: absolute;
          left: 0;
          top: 0;
          color: var(--accent);
          font-size: 1.1rem;
          line-height: 1.4;
        }

        /* Tech Tags Pill Grid */
        .card-tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          padding-top: 18px;
          border-top: 1px solid var(--line);
        }

        .tech-pill {
          font-family: monospace;
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          background: var(--accent-soft);
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 4px 12px;
          color: var(--muted);
          white-space: nowrap;
          transition: border-color 0.25s ease, color 0.25s ease;
        }

        .timeline-card:hover .tech-pill {
          border-color: var(--accent);
          color: var(--ink);
        }

        /* Card Footer Link */
        .card-footer-action {
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.73rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--accent);
          transition: color 0.3s ease;
        }

        .action-btn:hover {
          color: var(--ink);
        }

        .action-btn span {
          transition: transform 0.3s ease;
        }

        .action-btn:hover span {
          transform: translate(3px, -3px);
        }

        .action-status-nda {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          color: #e8a87c;
          opacity: 0.85;
          letter-spacing: 0.06em;
        }

        /* ─── Responsive Adjustments ───────────────────────────── */
        @media (max-width: 992px) {
          .timeline-line {
            left: 28px;
            transform: none;
          }

          .timeline-node {
            left: 28px;
            transform: translate(-50%, -50%);
          }

          .timeline-row {
            justify-content: flex-end !important;
            margin-bottom: 50px;
          }

          .timeline-card-wrapper {
            width: calc(100% - 68px);
          }
        }

        @media (max-width: 600px) {
          .timeline-section {
            padding: 80px 4vw;
          }

          .card-body {
            padding: 20px 20px 22px;
          }

          .card-title-text {
            font-size: 1.3rem;
          }

          .card-banner {
            height: 170px;
          }
        }
      `}</style>

      <section ref={sectionRef} className="timeline-section" id="projects" data-section="projects">
        {/* Centered Luxury Header */}
        <div className="timeline-header-center">
          <span className="timeline-eyebrow">
            CHART II · EXPERIENCE & PROJECTS TIMELINE · {PROJECTS.length} ROLES
          </span>
          <h2 ref={titleRef} className="timeline-title">
            Professional journey, <em>visualized.</em>
          </h2>
          <p className="timeline-subtitle">
            An interactive timeline tracking software engineering roles, full-stack applications, and database architectures.
          </p>
        </div>

        {/* Vertical Timeline Engine */}
        <div ref={timelineRef} className="timeline-container" onMouseMove={onSpotlight}>
          <div className="timeline-line" aria-hidden="true" />

          {PROJECTS.map((project, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={project.id}
                className={`timeline-row ${isEven ? 'left-row' : 'right-row'}`}
              >
                {/* Node Icon on Central Spine */}
                <div className="timeline-node" aria-hidden="true">
                  <i className={getNodeIcon(project.icon)}></i>
                </div>

                {/* Card Container */}
                <div className="timeline-card-wrapper">
                  <article
                    className={`timeline-card spotlight${project.isPrivate ? ' is-private' : ''}`}
                  >
                    {/* Top Visual Banner with Project Image */}
                    <div className="card-banner" aria-hidden="true">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="banner-img"
                        />
                      ) : (
                        <div
                          className="banner-art"
                          style={{
                            background:
                              project.gradient ||
                              'linear-gradient(135deg, rgba(217, 164, 65, 0.2), rgba(168, 85, 247, 0.25))',
                          }}
                        />
                      )}
                      <div className="banner-overlay" />
                      <span className="banner-badge">{project.badge}</span>
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      {/* Meta Date & Company */}
                      <div className="card-meta-row">
                        <span className="meta-date">
                          <span className="status-dot" />
                          {project.date}
                        </span>
                        <span className="meta-company">{project.company}</span>
                      </div>

                      {/* Main Title */}
                      <h3 className="card-title-text">{project.title}</h3>

                      {/* Highlighted Bullets */}
                      <ul className="card-highlights">
                        {project.highlights.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>

                      {/* Tech Stack Pills */}
                      <div className="card-tech-row">
                        {project.techTags.map((tag) => (
                          <span key={tag} className="tech-pill">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Footer */}
                      <div className="card-footer-action">
                        {project.isPrivate ? (
                          <span className="action-status-nda">
                            Source withheld · client confidential
                          </span>
                        ) : (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn"
                          >
                            View Repository <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ProjectsShowcase;