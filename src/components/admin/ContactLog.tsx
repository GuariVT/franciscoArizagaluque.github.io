import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Trash2, User, AtSign, MessageSquare } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function ContactLog() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel('contact-messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages',
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este mensaje?')) {
      return;
    }

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting message:', error);
      alert('Error al eliminar el mensaje');
    } else {
      setMessages(messages.filter((msg) => msg.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubjectLabel = (subject: string) => {
    const subjects: { [key: string]: string } = {
      'informacion': 'Información General',
      'admisiones': 'Admisiones',
      'programas': 'Programas EGB y Bachillerato',
      'vespertina': 'Modalidad Vespertina',
      'soporte': 'Soporte Técnico',
      'otro': 'Otro',
    };
    return subjects[subject] || subject;
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Cargando mensajes...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Log de Contacto</h2>
        <p className="text-slate-600">
          Ver y gestionar todos los mensajes de contacto recibidos
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No hay mensajes todavía</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{msg.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <AtSign className="w-4 h-4" />
                        <span>{msg.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                      <MessageSquare className="w-4 h-4" />
                      {getSubjectLabel(msg.subject)}
                    </span>
                    <span className="text-sm text-slate-500">{formatDate(msg.created_at)}</span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar mensaje"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div className="mt-6 text-center text-sm text-slate-500">
          Total de mensajes: {messages.length}
        </div>
      )}
    </div>
  );
}
