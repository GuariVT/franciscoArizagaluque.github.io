import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  order_index: number;
  is_visible: boolean;
}

export default function GalleryEditor() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('order_index');

    if (error) {
      console.error('Error loading images:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      for (const image of images) {
        if (image.id.startsWith('new-')) {
          const { error } = await supabase
            .from('gallery_images')
            .insert({
              title: image.title,
              description: image.description,
              image_url: image.image_url,
              order_index: image.order_index,
              is_visible: image.is_visible,
            });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('gallery_images')
            .update({
              title: image.title,
              description: image.description,
              image_url: image.image_url,
              order_index: image.order_index,
              is_visible: image.is_visible,
              updated_at: new Date().toISOString(),
            })
            .eq('id', image.id);
          if (error) throw error;
        }
      }

      await loadImages();
      setMessage('Cambios guardados exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving images:', error);
      setMessage('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    const newImage: GalleryImage = {
      id: `new-${Date.now()}`,
      title: '',
      description: null,
      image_url: '',
      order_index: images.length,
      is_visible: true,
    };
    setImages([...images, newImage]);
  };

  const deleteImage = async (id: string) => {
    if (id.startsWith('new-')) {
      setImages(images.filter(img => img.id !== id));
    } else {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) {
        console.error('Error deleting image:', error);
      } else {
        setImages(images.filter(img => img.id !== id));
      }
    }
  };

  const updateImage = (id: string, field: keyof GalleryImage, value: any) => {
    setImages(images.map(img =>
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

    newImages.forEach((img, idx) => {
      img.order_index = idx;
    });

    setImages(newImages);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Cargando galería...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Gestionar Galería de Imágenes</h2>
        <div className="flex gap-3">
          <button
            onClick={addImage}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Imagen
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
        {images.map((image, index) => (
          <div key={image.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <MoveUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === images.length - 1}
                  className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <MoveDown className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateImage(image.id, 'is_visible', !image.is_visible)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    image.is_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {image.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {image.is_visible ? 'Visible' : 'Oculta'}
                </button>
                <button
                  onClick={() => deleteImage(image.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={image.title}
                  onChange={(e) => updateImage(image.id, 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL de Imagen
                </label>
                <input
                  type="text"
                  value={image.image_url}
                  onChange={(e) => updateImage(image.id, 'image_url', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                {image.image_url && (
                  <img
                    src={image.image_url}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={image.description || ''}
                  onChange={(e) => updateImage(image.id, 'description', e.target.value || null)}
                  rows={2}
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
