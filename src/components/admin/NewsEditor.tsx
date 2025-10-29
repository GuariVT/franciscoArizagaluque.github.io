import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published_date: string;
  is_published: boolean;
}

export default function NewsEditor() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) {
      console.error('Error loading news:', error);
    } else {
      setNews(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      for (const item of news) {
        if (item.id.startsWith('new-')) {
          const { error } = await supabase
            .from('news')
            .insert({
              title: item.title,
              content: item.content,
              image_url: item.image_url,
              published_date: item.published_date,
              is_published: item.is_published,
            });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('news')
            .update({
              title: item.title,
              content: item.content,
              image_url: item.image_url,
              published_date: item.published_date,
              is_published: item.is_published,
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.id);
          if (error) throw error;
        }
      }

      await loadNews();
      setMessage('Cambios guardados exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving news:', error);
      setMessage('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const addNews = () => {
    const newItem: News = {
      id: `new-${Date.now()}`,
      title: '',
      content: '',
      image_url: null,
      published_date: new Date().toISOString().split('T')[0],
      is_published: false,
    };
    setNews([newItem, ...news]);
  };

  const deleteNews = async (id: string) => {
    if (id.startsWith('new-')) {
      setNews(news.filter(item => item.id !== id));
    } else {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) {
        console.error('Error deleting news:', error);
      } else {
        setNews(news.filter(item => item.id !== id));
      }
    }
  };

  const updateNews = (id: string, field: keyof News, value: any) => {
    setNews(news.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Cargando noticias...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Gestionar Noticias</h2>
        <div className="flex gap-3">
          <button
            onClick={addNews}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Noticia
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
        {news.map((item) => (
          <div key={item.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50">
            <div className="flex justify-between items-start mb-4">
              <button
                onClick={() => updateNews(item.id, 'is_published', !item.is_published)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  item.is_published
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {item.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {item.is_published ? 'Publicado' : 'Borrador'}
              </button>
              <button
                onClick={() => deleteNews(item.id)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateNews(item.id, 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contenido
                </label>
                <textarea
                  value={item.content}
                  onChange={(e) => updateNews(item.id, 'content', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Publicación
                  </label>
                  <input
                    type="date"
                    value={item.published_date}
                    onChange={(e) => updateNews(item.id, 'published_date', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL de Imagen (opcional)
                  </label>
                  <input
                    type="text"
                    value={item.image_url || ''}
                    onChange={(e) => updateNews(item.id, 'image_url', e.target.value || null)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
