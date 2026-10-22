import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import SideScrollbar from './components/SideScrollbar';
import Home from './components/Home';
import Education from './components/Education';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import ScrollVideoBackground from './components/ScrollVideoBackground';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      {/*
        ScrollVideoBackground renders two fixed layers (z-index 0 and 1):
          0 → animated <canvas>
          1 → dark vignette overlay
        All foreground content sits at z-index 10+.
      */}
      <ScrollVideoBackground />

      {/* Foreground wrapper — transparent so the canvas shows through */}
      <div
        className="App"
        style={{
          position:   'relative',
          zIndex:     10,
          background: 'transparent',
        }}
      >
        <ThemeToggle />
        <SideScrollbar />
        <Home />
        <Education />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
        <Chatbot />
      </div>
    </ThemeProvider>
  );
};

export default App;
