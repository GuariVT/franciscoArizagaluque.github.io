import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useSectionContent } from '../../hooks/useContentData';
import { Clock, Users, Award, BookOpen } from 'lucide-react';

const Historia: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation();
  const { data: sectionData, loading } = useSectionContent('historia');

  const milestones = [
    {
      year: '1960',
      title: 'Fundación',
      description: 'Fundación de la Unidad Educativa "Dr. Francisco Arízaga Luque" como institución fiscal en la parroquia Febres Cordero, Guayaquil',
      icon: BookOpen
    },
    {
      year: '1970',
      title: 'Crecimiento',
      description: 'Consolidación como centro educativo de referencia en la Zona 8 del Ecuador con modalidad vespertina',
      icon: Users
    },
    {
      year: '1990',
      title: 'Modernización',
      description: 'Implementación de nuevas metodologías educativas y fortalecimiento de la formación integral',
      icon: Award
    },
    {
      year: '2024',
      title: 'Presente',
      description: 'Centro educativo urbano líder en EGB y Bachillerato, régimen Costa, sostenimiento fiscal',
      icon: Clock
    }
  ];

  return (
    <div ref={elementRef} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {sectionData?.title || 'Nuestra Historia'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {sectionData?.content || 'Más de 60 años de trayectoria educativa en la parroquia Febres Cordero, Guayaquil, formando generaciones de estudiantes con excelencia académica, valores cívicos y compromiso social.'}
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-300 h-full hidden md:block"></div>
          
          <div className="space-y-12 md:space-y-24">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} 
                           transition-all duration-1000 delay-${index * 200} ${
                  isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${
                    index % 2 === 0 ? '-translate-x-10' : 'translate-x-10'
                  }`
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} mb-8 md:mb-0`}>
                  <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center mb-4">
                      <milestone.icon className="w-8 h-8 text-blue-600 mr-4" />
                      <span className="text-3xl font-bold text-blue-600">{milestone.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="hidden md:flex w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg flex-shrink-0"></div>
                
                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historia;