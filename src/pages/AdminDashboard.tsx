import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, FileText, Calendar, Image, Newspaper, Home, Eye, ClipboardList, Mail } from 'lucide-react';
import SectionEditor from '../components/admin/SectionEditor';
import NewsEditor from '../components/admin/NewsEditor';
import EventsEditor from '../components/admin/EventsEditor';
import GalleryEditor from '../components/admin/GalleryEditor';
import EventLog from '../components/admin/EventLog';
import ContactLog from '../components/admin/ContactLog';

type TabType = 'sections' | 'news' | 'events' | 'gallery' | 'eventlog' | 'contactlog';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('sections');
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/AdminG/login');
  };

  const menuItems = [
    { id: 'sections' as TabType, label: 'Secciones del Sitio', icon: FileText },
    { id: 'news' as TabType, label: 'Noticias', icon: Newspaper },
    { id: 'events' as TabType, label: 'Eventos', icon: Calendar },
    { id: 'gallery' as TabType, label: 'Galería', icon: Image },
    { id: 'eventlog' as TabType, label: 'Log de Evento', icon: ClipboardList },
    { id: 'contactlog' as TabType, label: 'Log de Contacto', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">Panel Admin</h1>
          <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-2">
          <button
            onClick={() => window.open('/', '_blank')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">Ver Sitio Público</span>
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Home className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Bienvenido al Panel del Administrador</h2>
                  <p className="text-slate-300 leading-relaxed">
                    Desde aquí puedes editar tu sitio web fácilmente.<br />
                    Usa el menú lateral para navegar por las secciones y presiona "Guardar cambios" cuando termines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg">
            {activeTab === 'sections' && <SectionEditor />}
            {activeTab === 'news' && <NewsEditor />}
            {activeTab === 'events' && <EventsEditor />}
            {activeTab === 'gallery' && <GalleryEditor />}
            {activeTab === 'eventlog' && <EventLog />}
            {activeTab === 'contactlog' && <ContactLog />}
          </div>
        </div>
      </main>
    </div>
  );
}
