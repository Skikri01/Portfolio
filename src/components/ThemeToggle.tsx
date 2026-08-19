import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <style>{`
        .floating-theme-toggle {
          position: fixed;
          top: 24px;
          right: 28px;
          z-index: 1000;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--line);
          background: var(--pill-bg);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: var(--accent);
          cursor: pointer;
          font-size: 1.3rem;
          box-shadow: 0 10px 30px var(--shadow-color);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .floating-theme-toggle:hover {
          transform: rotate(15deg) scale(1.08);
          border-color: var(--accent);
          background: var(--accent-soft);
          box-shadow: 0 14px 35px var(--accent-glow);
        }

        .floating-theme-toggle i {
          transition: transform 0.4s ease;
        }

        @media (max-width: 768px) {
          .floating-theme-toggle {
            top: 16px;
            right: 16px;
            width: 40px;
            height: 40px;
            font-size: 1.15rem;
          }
        }
      `}</style>
      <button
        type="button"
        className="floating-theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <i className={`bx ${theme === 'dark' ? 'bx-sun' : 'bx-moon'}`}></i>
      </button>
    </>
  );
};

export default ThemeToggle;
