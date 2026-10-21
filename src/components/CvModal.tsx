import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import solaImage from '../assets/sola.jpg';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardRef?: React.RefObject<HTMLDivElement>;
  onCardMouseEnter?: () => void;
  onCardMouseLeave?: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({
  isOpen,
  onClose,
  cardRef,
  onCardMouseEnter,
  onCardMouseLeave,
}) => {
  // Close on Escape & prevent body background scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="cv-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Curriculum Vitae Preview"
    >
      <style>{`
        .cv-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(12px, 3vh, 32px);
          background: rgba(5, 5, 8, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          animation: cvModalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cvModalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .cv-modal-card {
          position: relative;
          display: flex;
          flex-direction: column;
          width: min(94vw, 820px);
          max-height: min(90vh, 920px);
          background: var(--card-bg-solid, #101014);
          border: 1px solid var(--line-strong, rgba(243, 237, 226, 0.22));
          border-radius: 20px;
          box-shadow: 0 25px 65px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px var(--line, rgba(243, 237, 226, 0.1));
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .cv-modal-card:hover {
          border-color: var(--accent, #d9a441);
        }

        /* Body & Scroll Area */
        .cv-modal-body {
          position: relative;
          flex: 1;
          overflow-y: auto;
          padding: clamp(18px, 3.5vw, 36px);
          background: var(--bg, #0a0a0d);
          color: var(--ink, #f3ede2);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          overscroll-behavior: contain;
        }

        /* Custom Scrollbar */
        .cv-modal-body::-webkit-scrollbar {
          width: 7px;
        }

        .cv-modal-body::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }

        .cv-modal-body::-webkit-scrollbar-thumb {
          background: var(--line-strong, rgba(243, 237, 226, 0.22));
          border-radius: 999px;
        }

        .cv-modal-body::-webkit-scrollbar-thumb:hover {
          background: var(--accent, #d9a441);
        }

        /* Pure CV Sheet */
        .cv-paper {
          max-width: 740px;
          margin: 0 auto;
          background: var(--card-bg-solid, #121217);
          border: 1px solid var(--line, rgba(243, 237, 226, 0.14));
          border-radius: 14px;
          padding: clamp(20px, 3.8vw, 40px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .cv-paper-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--accent, #d9a441);
        }

        .cv-paper-name {
          margin: 0;
          font-size: clamp(1.4rem, 2.8vw, 1.85rem);
          font-weight: 800;
          letter-spacing: 0.02em;
          color: var(--ink, #f3ede2);
          text-transform: uppercase;
        }

        .cv-paper-role {
          margin: 4px 0 12px 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--accent, #d9a441);
        }

        .cv-paper-contacts {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 14px;
          font-size: 0.8rem;
          color: var(--muted, rgba(243, 237, 226, 0.72));
        }

        .cv-paper-contact-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          text-decoration: none;
          color: inherit;
          transition: color 0.2s ease;
        }

        .cv-paper-contact-item:hover {
          color: var(--accent, #d9a441);
        }

        .cv-avatar-slot {
          width: 76px;
          height: 88px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid var(--accent, #d9a441);
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .cv-avatar-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 70% 28%;
          display: block;
        }

        /* Sections */
        .cv-section {
          margin-top: 20px;
        }

        .cv-section-title {
          margin: 0 0 10px 0;
          font-size: 0.88rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent, #d9a441);
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--line, rgba(243, 237, 226, 0.12));
          padding-bottom: 4px;
        }

        .cv-summary-text {
          margin: 0;
          font-size: 0.84rem;
          line-height: 1.58;
          color: var(--muted, rgba(243, 237, 226, 0.82));
        }

        /* Skills Grid */
        .cv-skills-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          font-size: 0.81rem;
        }

        .cv-skill-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .cv-skill-category {
          font-weight: 700;
          color: var(--ink, #f3ede2);
          min-width: 140px;
          flex-shrink: 0;
        }

        .cv-skill-values {
          color: var(--muted, rgba(243, 237, 226, 0.78));
        }

        /* Timeline Items */
        .cv-item {
          margin-bottom: 14px;
        }

        .cv-item:last-child {
          margin-bottom: 0;
        }

        .cv-item-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }

        .cv-item-title {
          font-size: 0.87rem;
          font-weight: 700;
          color: var(--ink, #f3ede2);
        }

        .cv-item-period {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent, #d9a441);
          white-space: nowrap;
        }

        .cv-item-sub {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          font-style: italic;
          color: var(--muted, rgba(243, 237, 226, 0.65));
          margin: 1px 0 5px 0;
        }

        .cv-item-bullets {
          margin: 0;
          padding-left: 18px;
          font-size: 0.81rem;
          line-height: 1.5;
          color: var(--muted, rgba(243, 237, 226, 0.8));
        }

        .cv-tech-tag {
          display: inline-block;
          font-size: 0.76rem;
          color: var(--accent, #d9a441);
          font-weight: 600;
          margin-top: 4px;
        }

        /* Two Columns for Languages & Certifications */
        .cv-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 640px) {
          .cv-two-col {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .cv-paper-header {
            flex-direction: column-reverse;
            align-items: center;
            text-align: center;
          }

          .cv-paper-contacts {
            justify-content: center;
          }
        }
      `}</style>

      <div
        ref={cardRef}
        className="cv-modal-card"
        onMouseEnter={onCardMouseEnter}
        onMouseLeave={onCardMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CV Document (Pure CV, Absolutely No Buttons) */}
        <div className="cv-modal-body">
          <article className="cv-paper">
            {/* Header */}
            <header className="cv-paper-header">
              <div>
                <h1 className="cv-paper-name">Mohammed Skikri</h1>
                <p className="cv-paper-role">Full-Stack Developer • Software Engineering Student</p>
                <div className="cv-paper-contacts">
                  <span className="cv-paper-contact-item">
                    📍 Fes, Morocco
                  </span>
                  <a href="mailto:contact@skikri.dev" className="cv-paper-contact-item">
                    ✉️ mohamedskikri44@gmail.com
                  </a>
                  <a href="https://github.com/Skikri-mohammed" target="_blank" rel="noreferrer" className="cv-paper-contact-item">
                    💻 https://github.com/Skikri01
                  </a>
                  <a href="https://www.linkedin.com/in/mohamed-skikri-467862299/" target="_blank" rel="noreferrer" className="cv-paper-contact-item">
                    🔗 www.linkedin.com/in/mohammed-skikri-467862299
                  </a>
                </div>
              </div>

              <div className="cv-avatar-slot" aria-hidden="true">
                <img src={solaImage} alt="Mohammed Skikri" />
              </div>
            </header>

            {/* Professional Summary */}
            <section className="cv-section">
              <h2 className="cv-section-title">Professional Summary</h2>
              <p className="cv-summary-text">
                Full-Stack Developer and Software Engineering student with 3+ years of practical experience
                building web applications and scalable backend architectures. Proficient in JavaScript/TypeScript
                (React.js, Node.js, Express) and PHP (Laravel), with solid foundations in SQL/NoSQL databases,
                REST APIs, and RBAC authentication.
              </p>
            </section>

            {/* Technical Skills */}
            <section className="cv-section">
              <h2 className="cv-section-title">Technical Skills</h2>
              <div className="cv-skills-grid">
                <div className="cv-skill-row">
                  <span className="cv-skill-category">Languages:</span>
                  <span className="cv-skill-values">JavaScript (ES6+), TypeScript, PHP, Python, Java, SQL, HTML5, CSS3</span>
                </div>
                <div className="cv-skill-row">
                  <span className="cv-skill-category">Frameworks & Libs:</span>
                  <span className="cv-skill-values">React.js, Laravel, Express.js, Node.js, Tailwind CSS, Bootstrap, GSAP</span>
                </div>
                <div className="cv-skill-row">
                  <span className="cv-skill-category">Databases & Cloud:</span>
                  <span className="cv-skill-values">MongoDB, MySQL, Oracle Database, Mongoose, Cloudinary</span>
                </div>
                <div className="cv-skill-row">
                  <span className="cv-skill-category">Tools & Practices:</span>
                  <span className="cv-skill-values">Git, GitHub, REST APIs, JWT, Multer, Vite, UML Modeling, RBAC</span>
                </div>
              </div>
            </section>

            {/* Experience & Projects */}
            <section className="cv-section">
              <h2 className="cv-section-title">Experience & Key Projects</h2>

              <div className="cv-item">
                <div className="cv-item-header">
                  <span className="cv-item-title">Full-Stack Developer — Car Rental Management System</span>
                  <span className="cv-item-period">2025 — Present</span>
                </div>
                <div className="cv-item-sub">
                  <span>Sup'Management</span>
                  <span>Meknes, Morocco</span>
                </div>
                <ul className="cv-item-bullets">
                  <li>Developed full-stack booking system with real-time vehicle availability filtering, RBAC authentication, JWT, and Cloudinary media pipelines.</li>
                </ul>
                <span className="cv-tech-tag">Tech Stack: Node.js, Express.js, MongoDB, React.js, Tailwind CSS, JWT, Cloudinary</span>
              </div>

              <div className="cv-item">
                <div className="cv-item-header">
                  <span className="cv-item-title">Frontend Specialist — MIZAN Luxury Watch E-Commerce</span>
                  <span className="cv-item-period">Feb 2025 — Present</span>
                </div>
                <div className="cv-item-sub">
                  <span>Independent Project</span>
                  <span>Full-Stack</span>
                </div>
                <ul className="cv-item-bullets">
                  <li>Built luxury dark glassmorphism store with instant catalog search, dynamic category filtering, slide-over cart drawer, and checkout workflow.</li>
                </ul>
                <span className="cv-tech-tag">Tech Stack: React.js, Node.js, Express.js, MySQL, Multer, Tailwind CSS</span>
              </div>

              <div className="cv-item">
                <div className="cv-item-header">
                  <span className="cv-item-title">Laravel Developer — Market Bio Inventory & E-Commerce</span>
                  <span className="cv-item-period">2024 — 2025</span>
                </div>
                <div className="cv-item-sub">
                  <span>Enterprise Solution</span>
                  <span>Morocco</span>
                </div>
                <ul className="cv-item-bullets">
                  <li>Engineered bio-compound e-commerce platform with Arabic-primary UI, real-time sales tracking, and inventory control dashboard.</li>
                </ul>
                <span className="cv-tech-tag">Tech Stack: Laravel, PHP, MySQL, Bootstrap, Tailwind CSS</span>
              </div>

              <div className="cv-item">
                <div className="cv-item-header">
                  <span className="cv-item-title">Web Development Intern — Enterprise Marketplace Platform</span>
                  <span className="cv-item-period">2024</span>
                </div>
                <div className="cv-item-sub">
                  <span>OFPPT Marketplace</span>
                  <span>Meknes, Morocco</span>
                </div>
                <ul className="cv-item-bullets">
                  <li>Implemented RBAC user authentication pipelines, product catalog CRUD operations, shopping cart, and central admin metrics panel.</li>
                </ul>
                <span className="cv-tech-tag">Tech Stack: Laravel, PHP, MySQL, Blade, Tailwind CSS, UML</span>
              </div>
            </section>

            {/* Education */}
            <section className="cv-section">
              <h2 className="cv-section-title">Education</h2>

              <div className="cv-item">
                <div className="cv-item-header">
                  <span className="cv-item-title">Licence Professionnelle en Génie Informatique</span>
                  <span className="cv-item-period">2025 — Present</span>
                </div>
                <div className="cv-item-sub">
                  <span>Sup'Management</span>
                  <span>Meknes, Morocco</span>
                </div>
                <ul className="cv-item-bullets">
                  <li>Specialization in Software Engineering Architecture, Oracle Database Management, and Enterprise Java Applications.</li>
                </ul>
              </div>

              <div className="cv-item">
                <div className="cv-item-header">
                  <span className="cv-item-title">Technicien Spécialisé en Développement Informatique</span>
                  <span className="cv-item-period">2023 — 2025</span>
                </div>
                <div className="cv-item-sub">
                  <span>OFPPT</span>
                  <span>Morocco</span>
                </div>
                <ul className="cv-item-bullets">
                  <li>Coursework in full-stack web development, Python programming, database administration, and software modeling.</li>
                </ul>
              </div>

              <div className="cv-item">
                <div className="cv-item-header">
                  <span className="cv-item-title">Baccalauréat en Sciences Expérimentales (Série SVT)</span>
                  <span className="cv-item-period">2022 — 2023</span>
                </div>
                <div className="cv-item-sub">
                  <span>Lycée Qualifiant Abderrahim Bouabid</span>
                  <span>Morocco</span>
                </div>
              </div>
            </section>

            {/* Languages & Certifications */}
            <div className="cv-two-col">
              <section className="cv-section">
                <h2 className="cv-section-title">Languages</h2>
                <ul className="cv-item-bullets">
                  <li><strong>Arabic:</strong> Native</li>
                  <li><strong>English:</strong> Intermediate (B1)</li>
                  <li><strong>French:</strong> Intermediate (B1)</li>
                </ul>
              </section>

              <section className="cv-section">
                <h2 className="cv-section-title">Certifications</h2>
                <ul className="cv-item-bullets">
                  <li><strong>Advanced React</strong> — Coursera</li>
                  <li><strong>Database Structures & MySQL</strong> — Coursera</li>
                  <li><strong>Excel Skills for Business</strong> — Coursera</li>
                  <li><strong>Essentials of Prompt Engineering</strong>Amazon Web Services (AWS)</li>
                </ul>
              </section>
            </div>
          </article>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CvModal;
