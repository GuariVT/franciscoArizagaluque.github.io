import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Target, Heart, Lightbulb, Users } from 'lucide-react';

const Mision: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation();

  const values = [
    {
      icon: Heart,
      title: 'Excelencia',
      description: 'Compromiso con la calidad educativa fiscal y la formación integral de nuestros estudiantes en jornada vespertina'
    },
    {
      icon: Lightbulb,
      title: 'Tradición',
      description: 'Más de 60 años de experiencia educativa al servicio de la comunidad de Febres Cordero y Guayaquil'
    },
    {
      icon: Users,
      title: 'Valores',
      description: 'Formación en principios éticos, cívicos y patrióticos siguiendo el ejemplo del Dr. Francisco Arízaga Luque'
    }
  ];

  return (
    <div ref={elementRef} className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-20">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Target className="w-16 h-16 mx-auto text-green-600 mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Nuestra Misión
          </h2>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
              Brindar educación integral de calidad en los niveles de Educación General Básica 
              y Bachillerato, en modalidad presencial vespertina, formando ciudadanos responsables, 
              críticos y comprometidos con el desarrollo de la sociedad ecuatoriana.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Como institución fiscal perteneciente a la Zona 8, ubicada en la parroquia Febres Cordero 
              de Guayaquil, nos comprometemos a ofrecer educación regular de excelencia en jornada vespertina, 
              honrando el legado y los valores del Dr. Francisco Arízaga Luque.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`transition-all duration-1000 delay-${(index + 1) * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <value.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mision;