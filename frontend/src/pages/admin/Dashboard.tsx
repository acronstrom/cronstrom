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
      gradient: 'from-blue-500 to-blue-600',
      bgHover: 'hover:bg-blue-50',
      iconBg: 'bg-blue-500',
      border: 'border-blue-200 hover:border-blue-400'
    },
    { 
      name: 'Utställningar', 
      description: 'Lägg till och redigera utställningar',
      icon: Calendar, 
      path: '/admin/exhibitions',
      gradient: 'from-purple-500 to-purple-600',
      bgHover: 'hover:bg-purple-50',
      iconBg: 'bg-purple-500',
      border: 'border-purple-200 hover:border-purple-400'
    },
    { 
      name: 'Utbildning', 
      description: 'Hantera utbildningsinformation',
      icon: GraduationCap, 
      path: '/admin/education',
      gradient: 'from-emerald-500 to-emerald-600',
      bgHover: 'hover:bg-emerald-50',
      iconBg: 'bg-emerald-500',
      border: 'border-emerald-200 hover:border-emerald-400'
    },
    { 
      name: 'Sidor', 
      description: 'Redigera sidinnehåll och texter',
      icon: FileText, 
      path: '/admin/pages',
      gradient: 'from-orange-500 to-orange-600',
      bgHover: 'hover:bg-orange-50',
      iconBg: 'bg-orange-500',
      border: 'border-orange-200 hover:border-orange-400'
    },
    { 
      name: 'Inställningar', 
      description: 'Webbplatsinställningar och profil',
      icon: Settings, 
      path: '/admin/settings',
      gradient: 'from-neutral-600 to-neutral-700',
      bgHover: 'hover:bg-neutral-100',
      iconBg: 'bg-neutral-600',
      border: 'border-neutral-300 hover:border-neutral-400'
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
              className={`group relative bg-white rounded-xl p-6 border-2 ${item.border} ${item.bgHover} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Gradient accent bar at top */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />
              
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`${item.iconBg} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={26} className="text-white" />
                </div>
                
                {/* Text */}
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-lg text-neutral-800 group-hover:text-neutral-900 transition-colors flex items-center gap-2">
                    {item.name}
                    <span className="text-neutral-300 group-hover:text-neutral-400 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-neutral-500 text-sm mt-1">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">Snabbstatistik</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
              <p className="text-3xl font-bold text-neutral-800 mb-1">7</p>
              <p className="text-sm text-neutral-500">Konstverk</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
              <p className="text-3xl font-bold text-neutral-800 mb-1">6</p>
              <p className="text-sm text-neutral-500">Utställningar</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
              <p className="text-3xl font-bold text-neutral-800 mb-1">4</p>
              <p className="text-sm text-neutral-500">Kategorier</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
              <p className="text-3xl font-bold text-neutral-800 mb-1">3</p>
              <p className="text-sm text-neutral-500">Tillgängliga</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

