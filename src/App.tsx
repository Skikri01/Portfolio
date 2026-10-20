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

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="App">
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