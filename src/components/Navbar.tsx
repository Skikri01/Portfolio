import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            padding: 26px 7%;
            background: var(--pill-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
            transition: all 0.4s ease;
            border-bottom: 1px solid var(--line);
            box-sizing: border-box;
        }

        .header.scrolled {
            padding: 16px 7%;
            background: var(--pill-bg);
            box-shadow: 0 4px 30px var(--shadow-color);
            border-bottom-color: var(--accent-glow);
        }

        .logo {
            font-family: 'Playfair Display', Georgia, serif;
            color: var(--ink);
            font-size: 24px;
            letter-spacing: 0.04em;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: baseline;
            gap: 1px;
        }

        .logo-letter {
            font-size: 30px;
            color: var(--accent);
            font-weight: 700;
            display: inline-block;
            transition: all 0.3s ease;
        }

        .logo:hover {
            transform: translateY(-1px);
        }

        .logo:hover .logo-letter {
            transform: scale(1.1) rotate(-4deg);
        }

        .navbar-right {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .navbar {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .navbar a {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            color: var(--muted);
            padding: 8px 16px;
            display: inline-block;
            font-size: 0.85rem;
            font-weight: 500;
            letter-spacing: 0.04em;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
            border-radius: 8px;
            white-space: nowrap;
        }

        .navbar a::before {
            content: '';
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 1px;
            background: var(--accent);
            transition: width 0.3s ease;
        }

        .navbar a:hover::before {
            width: 50%;
        }

        .navbar a:hover {
            color: var(--ink);
        }

        .navbar a.contact-btn {
            background: var(--ink);
            color: var(--bg) !important;
            padding: 10px 24px;
            border-radius: 999px;
            font-weight: 600;
            margin-left: 8px;
            box-shadow: 0 8px 22px -10px var(--shadow-color);
            position: relative;
            overflow: hidden;
            border: 1px solid var(--ink);
            transition: all 0.3s ease;
        }

        .navbar a.contact-btn::before {
            display: none;
        }

        .navbar a.contact-btn:hover {
            transform: translateY(-2px);
            background: var(--accent);
            border-color: var(--accent);
            color: #ffffff !important;
            box-shadow: 0 10px 26px -10px var(--accent-glow);
        }

        .theme-toggle-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid var(--line);
            background: var(--card-bg);
            color: var(--accent);
            cursor: pointer;
            font-size: 1.25rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            margin-left: 6px;
            box-shadow: 0 4px 12px var(--shadow-color);
            position: relative;
            overflow: hidden;
        }

        .theme-toggle-btn:hover {
            transform: rotate(15deg) scale(1.08);
            border-color: var(--accent);
            background: var(--accent-soft);
            box-shadow: 0 6px 18px var(--accent-glow);
        }

        .theme-toggle-btn i {
            transition: transform 0.4s ease, opacity 0.3s ease;
        }

        #menu-icon {
            font-size: 1.9rem;
            color: var(--ink);
            cursor: pointer;
            display: none;
            transition: all 0.3s ease;
            padding: 5px;
        }

        #menu-icon:hover {
            color: var(--accent);
            transform: scale(1.08);
        }

        @media (max-width: 968px) {
            #menu-icon {
                display: block;
            }

            .navbar {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                padding: 1.2rem 7%;
                background: var(--pill-bg);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border-top: 1px solid var(--line);
                box-shadow: 0 12px 30px var(--shadow-color);
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-20px);
                transition: all 0.4s ease;
            }

            .navbar.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .navbar a {
                display: block;
                width: 100%;
                font-size: 1rem;
                padding: 14px 16px;
                margin: 2px 0;
                border-radius: 8px;
            }

            .navbar a.contact-btn {
                margin-left: 0;
                margin-top: 10px;
                text-align: center;
                width: 100%;
            }
        }
      `}</style>

      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <a href="#home" className="logo">
          <span className="logo-letter">S</span>kikri
        </a>
        <div className="navbar-right">
          <nav className={`navbar ${menuOpen ? 'active' : ''}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#education" onClick={() => setMenuOpen(false)}>Education</a>
            <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
            <a href="#skills" onClick={() => setMenuOpen(false)}>Skills</a>
            <a href="#contact" className="contact-btn" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <i className={`bx ${theme === 'dark' ? 'bx-sun' : 'bx-moon'}`}></i>
          </button>

          <div
            id="menu-icon"
            className={`bx ${menuOpen ? 'bx-x' : 'bx-menu'}`}
            onClick={toggleMenu}
          ></div>
        </div>
      </header>
    </>
  );
}

export default Navbar;