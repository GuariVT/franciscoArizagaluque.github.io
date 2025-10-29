import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

interface HeroProps {
  onEnter: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEnter }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTitle(true), 500);
    const timer2 = setTimeout(() => setShowSubtitle(true), 1500);
    const timer3 = setTimeout(() => setShowButton(true), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-50"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 text-center px-8">
        <div className="mb-8">
          <BookOpen className="w-16 h-16 mx-auto text-blue-400 opacity-80" />
        </div>
        
        <h1 
          className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Unidad Educativa
        </h1>
        
        <h2 
          className={`text-2xl md:text-3xl font-light mb-8 text-gray-300 transition-all duration-1000 delay-500 ${
            showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          "Dr. Francisco Arízaga Luque"
        </h2>
        
        <p 
          className={`text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-1000 ${
            showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Institución educativa fiscal de excelencia ubicada en la parroquia Febres Cordero, Guayaquil. 
          Más de 60 años formando ciudadanos íntegros con educación presencial vespertina de calidad.
        </p>
        
        <button
          onClick={onEnter}
          className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                     rounded-full text-xl font-semibold transition-all duration-500 transform hover:scale-105 
                     shadow-2xl hover:shadow-blue-500/25 ${
                       showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                     }`}
        >
          Explorar
        </button>
      </div>
    </div>
  );
};

export default Hero;