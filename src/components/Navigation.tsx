import React from 'react';
import { Home, History, Target, Eye, Newspaper, Calendar, Image, Mail } from 'lucide-react';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, onSectionChange }) => {
  const sections = [
    { id: 'home', name: 'Inicio', icon: Home },
    { id: 'historia', name: 'Historia', icon: History },
    { id: 'mision', name: 'Misión', icon: Target },
    { id: 'vision', name: 'Visión', icon: Eye },
    { id: 'noticias', name: 'Noticias', icon: Newspaper },
    { id: 'eventos', name: 'Eventos', icon: Calendar },
    { id: 'galeria', name: 'Galería', icon: Image },
    { id: 'contacto', name: 'Contacto', icon: Mail }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Home className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">U.E. Dr. Arízaga Luque</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {sections.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onSectionChange(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  currentSection === id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{name}</span>
              </button>
            ))}
          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden">
            <select
              value={currentSection}
              onChange={(e) => onSectionChange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sections.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;