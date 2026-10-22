import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .site-footer {
          position: relative;
          background: var(--bg-section);
          color: var(--ink);
          border-top: 1px solid var(--line);
          padding: 80px 7% 40px;
          overflow: hidden;
          transition: background 0.4s ease, color 0.4s ease;
        }

        .footer-ambient-glow {
          position: absolute;
          bottom: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 300px;
          background: radial-gradient(circle, var(--accent-soft) 0%, transparent 70%);
          filter: blur(90px);
          pointer-events: none;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 60px;
        }

        .footer-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }

        /* Large Professional Brand Name */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-lastname {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(3.2rem, 8.5vw, 7rem);
          font-weight: 700;
          line-height: 0.92;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          margin: 0;
          background: linear-gradient(135deg, var(--ink) 0%, var(--accent) 70%, #f5d77f 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          user-select: none;
        }

        .footer-tagline {
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0;
        }

        /* Navigation & Back to Top */
        .footer-nav-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 24px;
        }

        .back-to-top-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 22px;
          border-radius: 999px;
          background: var(--card-bg);
          border: 1px solid var(--line-strong);
          color: var(--ink);
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          backdrop-filter: blur(12px);
        }

        .back-to-top-btn:hover {
          background: var(--accent-soft);
          border-color: var(--accent);
          color: var(--accent);
          transform: translateY(-3px);
          box-shadow: 0 10px 24px var(--shadow-color);
        }

        .back-to-top-btn svg {
          transition: transform 0.3s ease;
        }

        .back-to-top-btn:hover svg {
          transform: translateY(-3px);
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-link {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.25s ease;
        }

        .footer-link:hover {
          color: var(--accent);
        }

        /* Bottom Row */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 32px;
          border-top: 1px solid var(--line);
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-copy {
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          color: var(--muted);
          margin: 0;
        }

        .footer-copy strong {
          color: var(--ink);
          font-weight: 600;
        }

        .footer-meta-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.76rem;
          font-weight: 500;
          color: var(--faint);
          letter-spacing: 0.08em;
        }

        .footer-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4caf6d;
          box-shadow: 0 0 8px #4caf6d;
        }

        @media (max-width: 768px) {
          .site-footer {
            padding: 60px 6% 36px;
          }

          .footer-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .footer-nav-col {
            align-items: flex-start;
            width: 100%;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <footer className="site-footer">
        <div className="footer-ambient-glow" aria-hidden="true" />
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <h1 className="footer-lastname">SKIKRI</h1>
              <p className="footer-tagline">Full Stack Developer · Software Engineering Student</p>
            </div>

            <div className="footer-nav-col">
              <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
                <span>Back to top</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </button>

              <div className="footer-links">
                <a href="#education" className="footer-link">Education</a>
                <a href="#projects" className="footer-link">Projects</a>
                <a href="#skills" className="footer-link">Skills</a>
                <a href="#contact" className="footer-link">Contact</a>
                <a href="https://github.com/Skikri-mohammed" target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
                <a href="https://www.linkedin.com/in/mohamed-skikri-467862299/" target="_blank" rel="noreferrer" className="footer-link">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">
              © {currentYear} <strong>SKIKRI</strong>. All rights reserved.
            </p>
            <div className="footer-meta-status">
              <span className="footer-status-dot" />
              <span>Fès, Morocco · Open to Opportunities</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
