import React, { useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useEvents } from '../../hooks/useContentData';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import EventRegistrationModal from '../EventRegistrationModal';

const Eventos: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation();
  const { events, loading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleRegisterClick = (event: any) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleRegistrationSuccess = () => {
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getColorClasses = (index: number) => {
    const colors = [
      'bg-blue-600 text-white border-blue-200',
      'bg-green-600 text-white border-green-200',
      'bg-orange-600 text-white border-orange-200',
      'bg-teal-600 text-white border-teal-200'
    ];
    return colors[index % colors.length];
  };

  const formatTime = (dateString: string) => {
    const dateParts = dateString.split('T');
    if (dateParts.length < 2) return '';

    const timePart = dateParts[1].substring(0, 5);
    return timePart;
  };

  return (
    <div ref={elementRef} className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-20">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Calendar className="w-16 h-16 mx-auto text-indigo-600 mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Próximos Eventos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Participa en nuestras actividades académicas, culturales y cívicas en jornada vespertina 
            que complementan la formación integral de nuestros estudiantes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`transition-all duration-1000 delay-${(index + 1) * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden h-full">
                <div className={`p-4 ${getColorClasses(index)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                      Evento
                    </span>
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium">{formatDate(event.event_date)}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-600">
                      <Clock className="w-5 h-5 text-indigo-600" />
                      <span>{formatTime(event.event_date)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <span>{event.location}</span>
                    </div>

                    {event.max_participants > 0 && (
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Users className="w-5 h-5 text-indigo-600" />
                        <span>
                          {event.current_participants} / {event.max_participants} participantes
                        </span>
                      </div>
                    )}
                  </div>

                  {event.max_participants > 0 && event.current_participants >= event.max_participants ? (
                    <div className="w-full py-3 bg-gray-300 text-gray-600 rounded-lg font-semibold text-center">
                      Cupo Completo
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegisterClick(event)}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25"
                    >
                      Registrarse
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <EventRegistrationModal
          isOpen={showModal}
          onClose={handleCloseModal}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};

export default Eventos;