import React, { useState } from 'react';

type FieldName = 'name' | 'email' | 'message';
type SubmitState = 'idle' | 'submitting' | 'success';

const Contact: React.FC = () => {
  const [focused, setFocused] = useState<FieldName | null>(null);
  const [status, setStatus] = useState<SubmitState>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    // Simulated send — swap for a real request handler.
    window.setTimeout(() => {
      setStatus('success');
      e.currentTarget.reset();
      window.setTimeout(() => setStatus('idle'), 4000);
    }, 900);
  };

  return (
    <>
      <style>{`
        .contact-section {
          position: relative;
          padding: 120px 7% 140px;
          background: var(--bg);
          color: var(--ink);
          overflow: hidden;
          transition: background 0.4s ease;
        }

        .contact-section::before {
          content: '';
          position: absolute;
          top: -180px;
          right: -120px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, var(--accent-soft) 0%, transparent 70%);
          pointer-events: none;
        }

        .contact-section::after {
          content: '';
          position: absolute;
          bottom: -220px;
          left: -160px;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, var(--accent-soft) 0%, transparent 72%);
          opacity: 0.5;
          pointer-events: none;
        }

        .contact-inner {
          position: relative;
          max-width: 1120px;
          margin: 0 auto;
        }

        .contact-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          margin: 0 0 16px;
        }

        .contact-eyebrow::before {
          content: '';
          width: 28px;
          height: 1px;
          background: var(--accent);
        }

        .contact-heading-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 64px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 40px;
        }

        .contact-heading-row h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.6rem, 5vw, 4rem);
          font-weight: 600;
          line-height: 1.05;
          margin: 0;
          color: var(--ink);
          letter-spacing: -0.01em;
        }

        .contact-heading-row h2 em {
          font-style: italic;
          color: var(--accent);
        }

        .contact-lede {
          font-family: 'Inter', sans-serif;
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--muted);
          max-width: 320px;
          margin: 0;
          text-align: right;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 32px;
          align-items: start;
        }

        /* --- Info panel --- */

        .contact-info {
          background: var(--card-bg);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          box-shadow: 0 10px 30px var(--shadow-color);
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }

        .contact-info:hover {
          border-color: var(--line-strong);
          box-shadow: 0 16px 40px var(--shadow-color);
        }

        .contact-info-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--faint);
          margin: 0 0 6px;
        }

        .contact-info-label i {
          font-size: 0.95rem;
          color: var(--accent);
        }

        .contact-info-item {
          padding-bottom: 24px;
          border-bottom: 1px solid var(--line);
        }

        .contact-info-item:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }

        .contact-info-value {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.35rem;
          color: var(--ink);
          margin: 0;
        }

        .contact-info-value a {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.25s ease, color 0.25s ease;
        }

        .contact-info-value a:hover {
          color: var(--accent);
          border-color: var(--accent);
        }

        .contact-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          color: var(--muted);
        }

        .contact-status-dot {
          position: relative;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6ecb7a;
          flex-shrink: 0;
        }

        .contact-status-dot::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(110, 203, 122, 0.35);
          animation: statusPulse 2.4s ease-out infinite;
        }

        @keyframes statusPulse {
          0% { transform: scale(0.6); opacity: 0.9; }
          70% { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }

        .social-links {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        .social-links a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border-radius: 999px;
          border: 1px solid var(--line);
          color: var(--muted);
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          text-decoration: none;
          transition: color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, background 0.25s ease;
        }

        .social-links a:hover {
          color: var(--accent);
          border-color: var(--accent);
          background: var(--accent-soft);
          transform: translateY(-2px);
        }

        .social-links a:focus-visible,
        .contact-form button:focus-visible,
        .contact-form input:focus-visible,
        .contact-form textarea:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }

        .social-links i {
          font-size: 1.05rem;
          line-height: 1;
        }

        /* --- Form panel --- */

        .contact-form {
          position: relative;
          background: var(--card-bg);
          padding: 36px 32px 32px;
          border-radius: 12px;
          border: 1px solid var(--line);
          box-shadow: 0 20px 50px -20px var(--shadow-color);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .contact-form:hover {
          border-color: var(--line-strong);
        }

        .contact-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .field {
          margin-bottom: 22px;
        }

        .field label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-family: var(--label-font);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--faint);
          margin-bottom: 10px;
          transition: color 0.25s ease;
        }

        .field.is-active label {
          color: var(--accent);
        }

        .field-index {
          font-family: var(--display-font);
          font-style: italic;
          font-size: 0.85rem;
          color: var(--accent);
          text-transform: none;
          letter-spacing: 0;
        }

        .field-control {
          position: relative;
        }

        .field-control::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 0;
          background: var(--accent);
          transition: width 0.3s ease;
        }

        .field.is-active .field-control::after {
          width: 100%;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 13px 4px;
          font-family: var(--label-font);
          font-size: 1rem;
          color: var(--ink);
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--line-strong);
          border-radius: 0;
          outline: none;
          transition: border-color 0.25s ease;
        }

        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: var(--faint);
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: transparent;
        }

        .contact-form textarea {
          resize: none;
          height: 108px;
          padding-top: 13px;
        }

        .contact-form button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 24px;
          margin-top: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--bg);
          background: var(--ink);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease, opacity 0.25s ease;
        }

        .contact-form button:hover:not(:disabled) {
          background: var(--accent);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 14px 34px -12px var(--accent-glow);
        }

        .contact-form button:active:not(:disabled) {
          transform: translateY(0);
        }

        .contact-form button:disabled {
          cursor: default;
          opacity: 0.75;
        }

        .contact-form button span {
          display: inline-flex;
          transition: transform 0.25s ease;
        }

        .contact-form button:hover:not(:disabled) span {
          transform: translateX(3px);
        }

        .btn-spinner {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: currentColor;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .contact-form-foot {
          margin-top: 16px;
          font-family: var(--label-font);
          font-size: 0.78rem;
          color: var(--faint);
          text-align: center;
          min-height: 1.2em;
          transition: color 0.25s ease;
        }

        .contact-form-foot.is-success {
          color: #6ecb7a;
          font-weight: 600;
        }

        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-heading-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .contact-lede {
            text-align: left;
            max-width: none;
          }

          .contact-form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-form button,
          .social-links a,
          .contact-info,
          .field-control::after,
          .field label {
            transition: none;
          }

          .contact-status-dot::after,
          .btn-spinner {
            animation: none;
          }
        }
      `}</style>

      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <p className="contact-eyebrow">Get In Touch · Open To Work</p>

          <div className="contact-heading-row">
            <h2>
              Let's build <em>together</em>.
            </h2>
            <p className="contact-lede">
              Have a project, a role, or just a question? Send a message and I'll get back to you within a day or two.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-info-item">
                <p className="contact-info-label">
                  <i className="bx bx-pulse" aria-hidden="true"></i>
                  Availability
                </p>
                <span className="contact-status">
                  <span className="contact-status-dot" />
                  Open to new opportunities
                </span>
              </div>

              <div className="contact-info-item">
                <p className="contact-info-label">
                  <i className="bx bx-envelope" aria-hidden="true"></i>
                  Email
                </p>
                <p className="contact-info-value">
                  <a href="mailto:mohamedskikri44@gmail.com">mohamedskikri44@gmail.com</a>
                </p>
              </div>

              <div className="contact-info-item">
                <p className="contact-info-label">
                  <i className="bx bx-map-pin" aria-hidden="true"></i>
                  Based in
                </p>
                <p className="contact-info-value">Morocco</p>
              </div>

              <div>
                <p className="contact-info-label">
                  <i className="bx bx-link-alt" aria-hidden="true"></i>
                  Elsewhere
                </p>
                <div className="social-links">
                  <a
                    href="https://www.linkedin.com/in/mohamed-skikri-467862299/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <i className="bx bxl-linkedin" aria-hidden="true"></i>
                    LinkedIn
                  </a>
                  <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                    <i className="bx bxl-github" aria-hidden="true"></i>
                    GitHub
                  </a>
                  <a href="#" target="_blank" rel="noreferrer" aria-label="Medium">
                    <i className="bx bxl-medium" aria-hidden="true"></i>
                    Medium
                  </a>
                  <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram">
                    <i className="bx bxl-instagram" aria-hidden="true"></i>
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className={`field ${focused === 'name' ? 'is-active' : ''}`}>
                  <label htmlFor="name">
                    Name <span className="field-index">01</span>
                  </label>
                  <div className="field-control">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>

                <div className={`field ${focused === 'email' ? 'is-active' : ''}`}>
                  <label htmlFor="email">
                    Email <span className="field-index">02</span>
                  </label>
                  <div className="field-control">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>
              </div>

              <div className={`field ${focused === 'message' ? 'is-active' : ''}`}>
                <label htmlFor="message">
                  Message <span className="field-index">03</span>
                </label>
                <div className="field-control">
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell me a bit about what you're working on..."
                    required
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                  ></textarea>
                </div>
              </div>

              <button type="submit" disabled={status === 'submitting'} aria-live="polite">
                {status === 'submitting' ? (
                  <>
                    Sending
                    <span className="btn-spinner" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Send Message
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <p
                className={`contact-form-foot ${status === 'success' ? 'is-success' : ''}`}
                role="status"
              >
                {status === 'success'
                  ? 'Message sent — thanks, I\'ll be in touch soon.'
                  : 'Usually replies within 24–48 hours.'}
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;