import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Globe, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { artistBio } from '../../lib/data';

export function AdminSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'site' | 'contact'>('site');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [siteSettings, setSiteSettings] = useState({
    artistName: artistBio.name,
    tagline: artistBio.tagline,
    shortBio: artistBio.shortBio,
    fullBio: artistBio.fullBio,
  });

  const [contactSettings, setContactSettings] = useState({
    email: 'hello@cronstrom.net',
    phone: '070-123 45 67',
    address: 'Artillerigatan 12\n114 51 Stockholm',
    instagram: '',
    facebook: '',
  });

  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMessage('Inställningarna har sparats!');
    setIsSaving(false);
    
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { id: 'site', name: 'Webbplats', icon: Globe },
    { id: 'contact', name: 'Kontakt', icon: Mail },
    { id: 'profile', name: 'Profil', icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-serif text-xl">Inställningar</h1>
              <p className="text-xs text-neutral-500">Hantera webbplatsen och din profil</p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Sparar...' : 'Spara'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {message && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs */}
          <div className="lg:w-64 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white border border-neutral-200 text-neutral-900' 
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50'
                }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 bg-white border border-neutral-100 p-8">
            {activeTab === 'site' && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl mb-6">Webbplatsinställningar</h2>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Konstnärsnamn
                  </label>
                  <input
                    type="text"
                    value={siteSettings.artistName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, artistName: e.target.value })}
                    className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={siteSettings.tagline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                    className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Kort bio (visas på startsidan)
                  </label>
                  <textarea
                    value={siteSettings.shortBio}
                    onChange={(e) => setSiteSettings({ ...siteSettings, shortBio: e.target.value })}
                    className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Fullständig bio
                  </label>
                  <textarea
                    value={siteSettings.fullBio}
                    onChange={(e) => setSiteSettings({ ...siteSettings, fullBio: e.target.value })}
                    className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none h-48 resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl mb-6">Kontaktinformation</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      E-post
                    </label>
                    <input
                      type="email"
                      value={contactSettings.email}
                      onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Telefon
                    </label>
                    <input
                      type="text"
                      value={contactSettings.phone}
                      onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Adress
                  </label>
                  <textarea
                    value={contactSettings.address}
                    onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                    className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={contactSettings.instagram}
                      onChange={(e) => setContactSettings({ ...contactSettings, instagram: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={contactSettings.facebook}
                      onChange={(e) => setContactSettings({ ...contactSettings, facebook: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl mb-6">Din profil</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Namn
                    </label>
                    <input
                      type="text"
                      value={profileSettings.name}
                      onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      E-post
                    </label>
                    <input
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                    />
                  </div>
                </div>

                <hr className="border-neutral-100 my-8" />
                
                <h3 className="font-serif text-lg mb-4">Ändra lösenord</h3>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Nuvarande lösenord
                  </label>
                  <input
                    type="password"
                    value={profileSettings.currentPassword}
                    onChange={(e) => setProfileSettings({ ...profileSettings, currentPassword: e.target.value })}
                    className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Nytt lösenord
                    </label>
                    <input
                      type="password"
                      value={profileSettings.newPassword}
                      onChange={(e) => setProfileSettings({ ...profileSettings, newPassword: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Bekräfta nytt lösenord
                    </label>
                    <input
                      type="password"
                      value={profileSettings.confirmPassword}
                      onChange={(e) => setProfileSettings({ ...profileSettings, confirmPassword: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

