import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Eye, Globe, Star, Rocket } from 'lucide-react';

const Vision: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation();

  const goals = [
    {
      icon: Globe,
      title: 'Alcance Global',
      description: 'Ser reconocidos en la Zona 8 del Ecuador por nuestra excelencia en educación fiscal vespertina'
    },
    {
      icon: Star,
      title: 'Excelencia Académica',
      description: 'Mantener los más altos estándares en EGB y Bachillerato con educación regular de calidad'
    },
    {
      icon: Rocket,
      title: 'Innovación Constante',
      description: 'Integrar metodologías modernas en jornada vespertina respetando nuestra tradición educativa'
    }
  ];

  return (
    <div ref={elementRef} className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Eye className="w-16 h-16 mx-auto text-purple-600 mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Nuestra Visión
          </h2>
        </div>

        <div className={`mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <p className="text-xl md:text-2xl leading-relaxed mb-6 text-center">
              Ser reconocida como una institución educativa fiscal líder en la Zona 8 del Ecuador, 
              destacada por la excelencia académica en modalidad vespertina, la formación integral 
              de nuestros estudiantes y nuestro compromiso con el desarrollo de la comunidad guayaquileña.
            </p>
            <p className="text-lg leading-relaxed text-purple-100 text-center">
              Aspiramos a mantener nuestro prestigio como centro educativo urbano de referencia 
              en el régimen Costa, donde la tradición académica se combine con la innovación 
              pedagógica para formar ciudadanos preparados para los desafíos del futuro.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {goals.map((goal, index) => (
            <div
              key={goal.title}
              className={`transition-all duration-1000 delay-${(index + 1) * 200 + 500} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full border-l-4 border-purple-600">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <goal.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{goal.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{goal.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vision;