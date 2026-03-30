import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Globe, Mail, AlertTriangle, RefreshCcw, ExternalLink, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { artistBio } from '../../lib/data';
import { API_BASE } from '../../lib/config';

export function AdminSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'site' | 'contact' | 'popup'>('site');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');

  const [siteSettings, setSiteSettings] = useState({
    artistName: artistBio.name,
    tagline: artistBio.tagline,
    shortBio: artistBio.shortBio,
    fullBio: artistBio.fullBio,
  });

  const [contactSettings, setContactSettings] = useState({
    email: 'lena@cronstrom.net',
    phone: '',
    address: '',
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

  const [popupSettings, setPopupSettings] = useState({
    enabled: false,
    title: 'Kommande utställningar',
    description: 'Välkommen! Missa inte mina kommande och pågående utställningar.',
    buttonText: 'Se alla utställningar',
    showCurrent: true,
    showUpcoming: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Check DB status
      const healthCheck = await fetch(`${API_BASE}/health`).then(res => res.json());
      setDbStatus(healthCheck.database === 'connected' ? 'connected' : 'disconnected');

      const response = await fetch(`${API_BASE}/settings`, {
        headers: token ? { 'x-auth-token': token } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSiteSettings(prev => ({
            artistName: data.settings.artistName || prev.artistName,
            tagline: data.settings.tagline || prev.tagline,
            shortBio: data.settings.shortBio || prev.shortBio,
            fullBio: data.settings.fullBio || prev.fullBio,
          }));
          setContactSettings(prev => ({
            email: data.settings.contactEmail || prev.email,
            phone: data.settings.contactPhone || prev.phone,
            address: data.settings.contactAddress || prev.address,
            instagram: data.settings.instagram || prev.instagram,
            facebook: data.settings.facebook || prev.facebook,
          }));
          setPopupSettings(prev => ({
            enabled: data.settings.popupEnabled === 'true',
            title: data.settings.popupTitle || prev.title,
            description: data.settings.popupDescription || prev.description,
            buttonText: data.settings.popupButtonText || prev.buttonText,
            showCurrent: data.settings.popupShowCurrent !== 'false',
            showUpcoming: data.settings.popupShowUpcoming !== 'false',
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setDbStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const allSettings = {
        artistName: siteSettings.artistName,
        tagline: siteSettings.tagline,
        shortBio: siteSettings.shortBio,
        fullBio: siteSettings.fullBio,
        contactEmail: contactSettings.email,
        contactPhone: contactSettings.phone,
        contactAddress: contactSettings.address,
        instagram: contactSettings.instagram,
        facebook: contactSettings.facebook,
        popupEnabled: String(popupSettings.enabled),
        popupTitle: popupSettings.title,
        popupDescription: popupSettings.description,
        popupButtonText: popupSettings.buttonText,
        popupShowCurrent: String(popupSettings.showCurrent),
        popupShowUpcoming: String(popupSettings.showUpcoming),
      };

      const response = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-auth-token': token } : {})
        },
        body: JSON.stringify({ settings: allSettings })
      });

      if (response.ok) {
        setMessage('Inställningarna har sparats!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }
    } catch (err: any) {
      setError(err.message || 'Kunde inte spara inställningar. Kontrollera databasanslutningen.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'site', name: 'Webbplats', icon: Globe },
    { id: 'contact', name: 'Kontakt', icon: Mail },
    { id: 'popup', name: 'Popup', icon: Bell },
    { id: 'profile', name: 'Profil', icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          {/* Top row - navigation */}
          <div className="flex items-center justify-between mb-2 md:mb-0">
            <div className="flex items-center gap-2 md:gap-4">
              <Link 
                to="/admin" 
                className="flex items-center gap-1 md:gap-2 border border-neutral-300 text-neutral-600 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-neutral-100 hover:border-neutral-400 transition-colors"
              >
                <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden sm:inline">Tillbaka</span>
              </Link>
              <div>
                <h1 className="font-serif text-lg md:text-xl">Inställningar</h1>
                <p className="text-[10px] md:text-xs text-neutral-500 hidden sm:block">Hantera webbplatsen</p>
              </div>
              <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${dbStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {dbStatus === 'connected' ? '🟢 DB' : '🔴'}
              </span>
            </div>
            
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1 md:gap-2 border border-neutral-300 text-neutral-600 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-neutral-100 hover:border-neutral-400 transition-colors"
            >
              <ExternalLink size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Visa webbplats</span>
            </Link>
          </div>
          
          {/* Save button row */}
          <div className="flex items-center justify-end gap-2 md:gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || dbStatus !== 'connected'}
              className="flex items-center gap-1 md:gap-2 bg-black text-white px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Sparar...' : 'Spara'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCcw className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
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
                  
                  <p className="text-xs text-neutral-400 mt-4">
                    Dessa inställningar visas på startsidans Hero-sektion.
                  </p>
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

              {activeTab === 'popup' && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl mb-6">Popup för nya besökare</h2>
                  <p className="text-sm text-neutral-500 mb-6">
                    Visa en popup med kommande och pågående utställningar för besökare som kommer till sidan första gången.
                  </p>
                  
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 border border-neutral-200">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={popupSettings.enabled}
                        onChange={(e) => setPopupSettings({ ...popupSettings, enabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                    <div>
                      <p className="font-medium text-sm">Aktivera popup</p>
                      <p className="text-xs text-neutral-500">Visas endast en gång per besökare</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Rubrik
                    </label>
                    <input
                      type="text"
                      value={popupSettings.title}
                      onChange={(e) => setPopupSettings({ ...popupSettings, title: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                      placeholder="Kommande utställningar"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Beskrivning
                    </label>
                    <textarea
                      value={popupSettings.description}
                      onChange={(e) => setPopupSettings({ ...popupSettings, description: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none h-24 resize-none"
                      placeholder="Välkommen! Missa inte mina kommande och pågående utställningar."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Knapptext
                    </label>
                    <input
                      type="text"
                      value={popupSettings.buttonText}
                      onChange={(e) => setPopupSettings({ ...popupSettings, buttonText: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                      placeholder="Se alla utställningar"
                    />
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="font-serif text-lg mb-4">Visa utställningar</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={popupSettings.showCurrent}
                          onChange={(e) => setPopupSettings({ ...popupSettings, showCurrent: e.target.checked })}
                          className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-500"
                        />
                        <span className="text-sm">Visa pågående utställningar</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={popupSettings.showUpcoming}
                          onChange={(e) => setPopupSettings({ ...popupSettings, showUpcoming: e.target.checked })}
                          className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-500"
                        />
                        <span className="text-sm">Visa kommande utställningar</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 text-sm">
                    <p className="text-amber-800">
                      <strong>Tips:</strong> Popup visas endast om det finns utställningar att visa och besökaren inte har sett den tidigare. 
                      Besökarens val sparas i webbläsarens localStorage.
                    </p>
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
                  <p className="text-sm text-neutral-500 mb-4">
                    Lösenordet ändras via Vercel miljövariabler (ADMIN_PASSWORD)
                  </p>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Nuvarande lösenord
                    </label>
                    <input
                      type="password"
                      value={profileSettings.currentPassword}
                      onChange={(e) => setProfileSettings({ ...profileSettings, currentPassword: e.target.value })}
                      className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                      disabled
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
                        disabled
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
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
