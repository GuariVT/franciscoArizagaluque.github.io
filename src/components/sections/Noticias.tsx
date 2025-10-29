import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useNews } from '../../hooks/useContentData';
import { Newspaper, Calendar, Clock, ArrowRight } from 'lucide-react';

const Noticias: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation();
  const { news, loading } = useNews();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div ref={elementRef} className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Newspaper className="w-16 h-16 mx-auto text-orange-600 mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Noticias y Novedades
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mantente informado sobre las actividades, logros y novedades de nuestra institución educativa fiscal 
            en la parroquia Febres Cordero, Guayaquil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <div
              key={article.id}
              className={`transition-all duration-1000 delay-${(index + 1) * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <article className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden h-full">
                {article.image_url && (
                  <div className="relative">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Noticia
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-4 flex-grow leading-relaxed">
                    {article.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.published_date)}</span>
                    </div>
                  </div>

                  <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold group transition-colors duration-200">
                    <span>Leer más</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-orange-500/25">
            Ver todas las noticias
          </button>
        </div>
      </div>
    </div>
  );
};

export default Noticias;