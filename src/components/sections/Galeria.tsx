import React, { useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useGallery } from '../../hooks/useContentData';
import { Image, X, ZoomIn } from 'lucide-react';

const Galeria: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation();
  const { images, loading } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div ref={elementRef} className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-20">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Image className="w-16 h-16 mx-auto text-pink-600 mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Galería
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conoce nuestras instalaciones, actividades académicas y la vida estudiantil vespertina 
            en la Unidad Educativa "Dr. Francisco Arízaga Luque" de Febres Cordero, Guayaquil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`transition-all duration-1000 delay-${(index + 1) * 100} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.description}</p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedImage(image.image_url)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for image preview */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
              
              <img
                src={selectedImage}
                alt="Imagen ampliada"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Galeria;