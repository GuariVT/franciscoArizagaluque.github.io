import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Eye, EyeOff } from 'lucide-react';

interface Section {
  id: string;
  section_key: string;
  title: string;
  content: string;
  image_url: string | null;
  order_index: number;
  is_visible: boolean;
}

export default function SectionEditor() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    const { data, error } = await supabase
      .from('site_sections')
      .select('*')
      .order('order_index');

    if (error) {
      console.error('Error loading sections:', error);
    } else {
      setSections(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      for (const section of sections) {
        const { error } = await supabase
          .from('site_sections')
          .update({
            title: section.title,
            content: section.content,
            image_url: section.image_url,
            is_visible: section.is_visible,
            updated_at: new Date().toISOString(),
          })
          .eq('id', section.id);

        if (error) throw error;
      }

      setMessage('Cambios guardados exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving sections:', error);
      setMessage('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (id: string, field: keyof Section, value: any) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Cargando secciones...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Editar Secciones del Sitio</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 capitalize">
                  {section.section_key.replace('_', ' ')}
                </h3>
              </div>
              <button
                onClick={() => updateSection(section.id, 'is_visible', !section.is_visible)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  section.is_visible
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {section.is_visible ? 'Visible' : 'Oculto'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contenido
                </label>
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL de Imagen (opcional)
                </label>
                <input
                  type="text"
                  value={section.image_url || ''}
                  onChange={(e) => updateSection(section.id, 'image_url', e.target.value || null)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
