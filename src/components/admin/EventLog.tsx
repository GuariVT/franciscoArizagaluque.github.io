import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, FileText, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  event_date: string;
  max_participants: number;
  current_participants: number;
}

interface Registration {
  id: string;
  representative_ci: string;
  representative_name: string;
  student_ci: string;
  student_name: string;
  student_course: string;
  created_at: string;
}

export default function EventLog() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, event_date, max_participants, current_participants')
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Error loading events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const loadRegistrations = async (eventId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading registrations:', error);
    } else {
      setRegistrations(data || []);
    }
  };

  const handleViewRegistrations = (event: Event) => {
    setSelectedEvent(event);
    loadRegistrations(event.id);
    setSearchTerm('');
  };

  const handleBack = () => {
    setSelectedEvent(null);
    setRegistrations([]);
    setSearchTerm('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.representative_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.representative_ci.includes(searchTerm) ||
      reg.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student_ci.includes(searchTerm) ||
      reg.student_course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Cargando eventos...</div>;
  }

  if (selectedEvent) {
    return (
      <div className="p-8">
        <button
          onClick={handleBack}
          className="mb-6 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
        >
          ← Volver a la lista de eventos
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedEvent.title}</h2>
          <p className="text-slate-600 mb-4">{formatDate(selectedEvent.event_date)}</p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-slate-700">
                <strong>{selectedEvent.current_participants}</strong> de{' '}
                <strong>{selectedEvent.max_participants}</strong> participantes
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Registros ({filteredRegistrations.length})
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o C.I..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              {searchTerm ? 'No se encontraron registros con ese criterio' : 'No hay registros todavía'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((reg, index) => (
                <div
                  key={reg.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Representante Legal</h4>
                        <p className="text-sm text-slate-600">
                          <strong>Nombre:</strong> {reg.representative_name}
                        </p>
                        <p className="text-sm text-slate-600">
                          <strong>C.I.:</strong> {reg.representative_ci}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Estudiante</h4>
                        <p className="text-sm text-slate-600">
                          <strong>Nombre:</strong> {reg.student_name}
                        </p>
                        <p className="text-sm text-slate-600">
                          <strong>C.I.:</strong> {reg.student_ci}
                        </p>
                        <p className="text-sm text-slate-600">
                          <strong>Curso:</strong> {reg.student_course}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-slate-500">
                        {formatDate(reg.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Log de Eventos</h2>
        <p className="text-slate-600">
          Ver y gestionar los registros de participantes para cada evento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">{event.title}</h3>
                <p className="text-sm text-slate-600">{formatDate(event.event_date)}</p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Registrados:</span>
                <span className="font-bold text-slate-900">
                  {event.current_participants} / {event.max_participants}
                </span>
              </div>
              {event.max_participants > 0 && (
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((event.current_participants / event.max_participants) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => handleViewRegistrations(event)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Ver Registros
            </button>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No hay eventos creados todavía
        </div>
      )}
    </div>
  );
}
