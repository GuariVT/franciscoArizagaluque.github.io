import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  image_url: string | null;
  is_active: boolean;
  invited_courses: string;
  specialties: string | null;
  max_participants: number;
  current_participants: number;
}

export default function EventsEditor() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Error loading events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      for (const event of events) {
        if (event.id.startsWith('new-')) {
          const { error } = await supabase
            .from('events')
            .insert({
              title: event.title,
              description: event.description,
              location: event.location,
              event_date: event.event_date,
              image_url: event.image_url,
              is_active: event.is_active,
              invited_courses: event.invited_courses,
              specialties: event.specialties,
              max_participants: event.max_participants,
              current_participants: event.current_participants,
            });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('events')
            .update({
              title: event.title,
              description: event.description,
              location: event.location,
              event_date: event.event_date,
              image_url: event.image_url,
              is_active: event.is_active,
              invited_courses: event.invited_courses,
              specialties: event.specialties,
              max_participants: event.max_participants,
              updated_at: new Date().toISOString(),
            })
            .eq('id', event.id);
          if (error) throw error;
        }
      }

      await loadEvents();
      setMessage('Cambios guardados exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving events:', error);
      setMessage('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const addEvent = () => {
    const newEvent: Event = {
      id: `new-${Date.now()}`,
      title: '',
      description: '',
      location: '',
      event_date: new Date().toISOString(),
      image_url: null,
      is_active: true,
      invited_courses: 'Todos',
      specialties: null,
      max_participants: 0,
      current_participants: 0,
    };
    setEvents([newEvent, ...events]);
  };

  const deleteEvent = async (id: string) => {
    if (id.startsWith('new-')) {
      setEvents(events.filter(event => event.id !== id));
    } else {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) {
        console.error('Error deleting event:', error);
      } else {
        setEvents(events.filter(event => event.id !== id));
      }
    }
  };

  const updateEvent = (id: string, field: keyof Event, value: any) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Cargando eventos...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Gestionar Eventos</h2>
        <div className="flex gap-3">
          <button
            onClick={addEvent}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Evento
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50">
            <div className="flex justify-between items-start mb-4">
              <button
                onClick={() => updateEvent(event.id, 'is_active', !event.is_active)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  event.is_active
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {event.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {event.is_active ? 'Activo' : 'Inactivo'}
              </button>
              <button
                onClick={() => deleteEvent(event.id)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Título del Evento
                </label>
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={event.description}
                  onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={event.location}
                    onChange={(e) => updateEvent(event.id, 'location', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha y Hora
                  </label>
                  <input
                    type="datetime-local"
                    value={event.event_date.slice(0, 16)}
                    onChange={(e) => {
                      const localDateTime = e.target.value;
                      updateEvent(event.id, 'event_date', localDateTime + ':00');
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL de Imagen (opcional)
                </label>
                <input
                  type="text"
                  value={event.image_url || ''}
                  onChange={(e) => updateEvent(event.id, 'image_url', e.target.value || null)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-blue-800 mb-3">Configuración de Cursos Invitados</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cursos Invitados
                    </label>
                    <select
                      value={event.invited_courses}
                      onChange={(e) => updateEvent(event.id, 'invited_courses', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Todos">Todos</option>
                      <option value="Todos los de básica">Todos los de básica</option>
                      <option value="Todos los de bachillerato">Todos los de bachillerato</option>
                      <option value="Específicos">Cursos específicos</option>
                    </select>
                  </div>

                  {event.invited_courses === 'Específicos' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Especificar cursos (ej: 8A, 8B, 9A, 1BGU A)
                      </label>
                      <input
                        type="text"
                        value={event.invited_courses === 'Específicos' ? (event.specialties || '') : ''}
                        onChange={(e) => updateEvent(event.id, 'specialties', e.target.value)}
                        placeholder="8A, 8B, 9A, 1BGU A"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {event.invited_courses === 'Todos los de bachillerato' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Especialidad
                      </label>
                      <select
                        value={event.specialties || 'Todas'}
                        onChange={(e) => updateEvent(event.id, 'specialties', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Todas">Todas</option>
                        <option value="Informática">Informática</option>
                        <option value="Ciencias">Ciencias</option>
                        <option value="Contabilidad">Contabilidad</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Número de participantes esperados
                    </label>
                    <input
                      type="number"
                      value={event.max_participants}
                      onChange={(e) => updateEvent(event.id, 'max_participants', parseInt(e.target.value) || 0)}
                      min="0"
                      placeholder="250"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-slate-600 mt-1">
                      Registrados actualmente: {event.current_participants}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
