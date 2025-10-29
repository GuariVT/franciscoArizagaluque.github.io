import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import Historia from './components/sections/Historia';
import Mision from './components/sections/Mision';
import Vision from './components/sections/Vision';
import Noticias from './components/sections/Noticias';
import Eventos from './components/sections/Eventos';
import Galeria from './components/sections/Galeria';
import Contacto from './components/sections/Contacto';
import { cleanupExpiredEvents } from './utils/cleanupExpiredEvents';

function App() {
  const [showHero, setShowHero] = useState(true);
  const [currentSection, setCurrentSection] = useState('home');

  useEffect(() => {
    cleanupExpiredEvents();

    const interval = setInterval(() => {
      cleanupExpiredEvents();
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

  const handleEnterSite = () => {
    setShowHero(false);
    setCurrentSection('historia');
  };

  const handleSectionChange = (section: string) => {
    if (section === 'home') {
      setShowHero(true);
      setCurrentSection('home');
    } else {
      setShowHero(false);
      setCurrentSection(section);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'historia':
        return <Historia />;
      case 'mision':
        return <Mision />;
      case 'vision':
        return <Vision />;
      case 'noticias':
        return <Noticias />;
      case 'eventos':
        return <Eventos />;
      case 'galeria':
        return <Galeria />;
      case 'contacto':
        return <Contacto />;
      default:
        return <Historia />;
    }
  };

  if (showHero) {
    return <Hero onEnter={handleEnterSite} />;
  }

  return (
    <div className="min-h-screen">
      <Navigation 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange} 
      />
      <div className="pt-16">
        {renderSection()}
      </div>
    </div>
  );
}

export default App;