import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Image, 
  FileText, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Calendar,
  GraduationCap
} from 'lucide-react';

export function AdminDashboard() {
  const { user, logout } = useAuth();

  const menuItems = [
    { 
      name: 'Galleri', 
      description: 'Hantera konstverk och bilder',
      icon: Image, 
      path: '/admin/gallery',
      color: 'bg-blue-500/10 text-blue-500'
    },
    { 
      name: 'Utställningar', 
      description: 'Lägg till och redigera utställningar',
      icon: Calendar, 
      path: '/admin/exhibitions',
      color: 'bg-purple-500/10 text-purple-500'
    },
    { 
      name: 'Utbildning', 
      description: 'Hantera utbildningsinformation',
      icon: GraduationCap, 
      path: '/admin/education',
      color: 'bg-green-500/10 text-green-500'
    },
    { 
      name: 'Sidor', 
      description: 'Redigera sidinnehåll och texter',
      icon: FileText, 
      path: '/admin/pages',
      color: 'bg-orange-500/10 text-orange-500'
    },
    { 
      name: 'Inställningar', 
      description: 'Webbplatsinställningar och profil',
      icon: Settings, 
      path: '/admin/settings',
      color: 'bg-neutral-500/10 text-neutral-500'
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="text-neutral-400" size={24} />
            <div>
              <h1 className="font-serif text-xl">Adminpanel</h1>
              <p className="text-xs text-neutral-500">cronstrom.net</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Visa webbplats →
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.role}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                title="Logga ut"
              >
                <LogOut size={18} className="text-neutral-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-serif mb-2">Välkommen, {user?.name?.split(' ')[0]}!</h2>
          <p className="text-neutral-500">Vad vill du göra idag?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group bg-white p-8 border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-6`}>
                <item.icon size={24} />
              </div>
              <h3 className="font-serif text-xl mb-2 group-hover:text-neutral-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-neutral-500 text-sm">{item.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 border border-neutral-100">
            <p className="text-3xl font-serif mb-1">7</p>
            <p className="text-sm text-neutral-500">Konstverk</p>
          </div>
          <div className="bg-white p-6 border border-neutral-100">
            <p className="text-3xl font-serif mb-1">6</p>
            <p className="text-sm text-neutral-500">Utställningar</p>
          </div>
          <div className="bg-white p-6 border border-neutral-100">
            <p className="text-3xl font-serif mb-1">4</p>
            <p className="text-sm text-neutral-500">Kategorier</p>
          </div>
          <div className="bg-white p-6 border border-neutral-100">
            <p className="text-3xl font-serif mb-1">3</p>
            <p className="text-sm text-neutral-500">Tillgängliga</p>
          </div>
        </div>
      </main>
    </div>
  );
}

