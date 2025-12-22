import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar, MapPin, Award, Users, Star, X, Save, Loader2, RotateCcw, Check, ExternalLink, Upload, Image } from 'lucide-react';
import { exhibitions as initialExhibitions } from '../../lib/data';
import type { Exhibition } from '../../lib/types';
import { API_BASE } from '../../lib/config';

type CategoryFilter = 'all' | 'separat' | 'samling' | 'jury' | 'current' | 'upcoming' | 'commission' | 'represented';

interface ExhibitionFormData {
  id?: string;
  title: string;
  venue: string;
  date: string;
  category: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  manual_current: boolean;
  manual_upcoming: boolean;
}

const emptyForm: ExhibitionFormData = {
  title: '',
  venue: '',
  date: new Date().getFullYear().toString(),
  category: 'separat',
  description: '',
  image_url: '',
  start_date: '',
  end_date: '',
  manual_current: false,
  manual_upcoming: false
};

export function ExhibitionsManager() {
  const [exhibitionList, setExhibitionList] = useState<Exhibition[]>([]);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<ExhibitionFormData | null>(null);
  const [formData, setFormData] = useState<ExhibitionFormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [useDatabase, setUseDatabase] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/exhibitions`, {
        headers: token ? { 'x-auth-token': token } : {}
      });
      const data = await response.json();
      
      if (data.exhibitions && data.exhibitions.length > 0) {
        const mapped = data.exhibitions.map((e: any) => ({
          id: e.id.toString(),
          title: e.title,
          venue: e.venue,
          location: e.venue,
          date: e.date,
          year: e.date,
          category: e.category,
          description: e.description,
          image_url: e.image_url || '',
          is_current: e.is_current,
          is_upcoming: e.is_upcoming,
          start_date: e.start_date ? e.start_date.split('T')[0] : '',
          end_date: e.end_date ? e.end_date.split('T')[0] : '',
          manual_current: e.manual_current || false,
          manual_upcoming: e.manual_upcoming || false
        }));
        setExhibitionList(mapped);
        setUseDatabase(true);
      } else {
        setExhibitionList(initialExhibitions);
        setUseDatabase(false);
      }
    } catch (err) {
      console.error('Error loading exhibitions:', err);
      setExhibitionList(initialExhibitions);
      setUseDatabase(false);
    } finally {
      setIsLoading(false);
    }
  };

  const notify = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const filteredExhibitions = (() => {
    if (filter === 'all') return exhibitionList;
    if (filter === 'current') return exhibitionList.filter(e => (e as any).is_current);
    if (filter === 'upcoming') return exhibitionList.filter(e => (e as any).is_upcoming && !(e as any).is_current);
    if (filter === 'commission') return exhibitionList.filter(e => e.category === 'commission' || e.category === 'represented');
    return exhibitionList.filter(e => e.category === filter);
  })();

  const separatCount = exhibitionList.filter(e => e.category === 'separat').length;
  const samlingCount = exhibitionList.filter(e => e.category === 'samling').length;
  const juryCount = exhibitionList.filter(e => e.category === 'jury').length;
  const currentCount = exhibitionList.filter(e => (e as any).is_current).length;
  const upcomingCount = exhibitionList.filter(e => (e as any).is_upcoming && !(e as any).is_current).length;
  const uppdragCount = exhibitionList.filter(e => e.category === 'commission' || e.category === 'represented').length;

  const getCategoryBadge = (category?: string) => {
    switch(category) {
      case 'separat':
        return <span className="px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs bg-purple-100 text-purple-700">Separat</span>;
      case 'samling':
        return <span className="px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs bg-blue-100 text-blue-700">Samling</span>;
      case 'jury':
        return <span className="px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs bg-amber-100 text-amber-700">Jury</span>;
      case 'commission':
      case 'represented':
        return <span className="px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs bg-teal-100 text-teal-700">Uppdrag</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE');
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingExhibition(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exhibition: Exhibition) => {
    const data: ExhibitionFormData = {
      id: exhibition.id,
      title: exhibition.title,
      venue: exhibition.venue || exhibition.location || '',
      date: exhibition.date || exhibition.year || '',
      category: exhibition.category || 'separat',
      description: exhibition.description || '',
      image_url: (exhibition as any).image_url || '',
      start_date: (exhibition as any).start_date || '',
      end_date: (exhibition as any).end_date || '',
      manual_current: (exhibition as any).manual_current || false,
      manual_upcoming: (exhibition as any).manual_upcoming || false
    };
    setFormData(data);
    setEditingExhibition(data);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vänligen välj en bildfil');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Bilden är för stor. Max 5MB.');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        // Upload to Vercel Blob via API
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || ''
          },
          body: JSON.stringify({
            filename: `exhibition-${Date.now()}-${file.name}`,
            data: base64
          })
        });

        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({ ...prev, image_url: data.url }));
        } else {
          alert('Kunde inte ladda upp bilden');
        }
        setIsUploadingImage(false);
      };
      reader.onerror = () => {
        alert('Kunde inte läsa bildfilen');
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Ett fel uppstod vid uppladdning');
      setIsUploadingImage(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExhibition(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['x-auth-token'] = token;

    try {
      if (editingExhibition?.id) {
        // Update existing
        await fetch(`${API_BASE}/exhibitions/${editingExhibition.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formData)
        });
      } else {
        // Add new
        await fetch(`${API_BASE}/exhibitions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });
      }
      await loadExhibitions();
      notify();
    } catch (err) {
      console.error('Error saving exhibition:', err);
      alert('Kunde inte spara. Försök igen.');
    }
    
    closeModal();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Är du säker på att du vill ta bort denna utställning?')) return;
    
    const token = localStorage.getItem('token');
    
    try {
      await fetch(`${API_BASE}/exhibitions/${id}`, {
        method: 'DELETE',
        headers: token ? { 'x-auth-token': token } : {}
      });
      await loadExhibitions();
      notify();
    } catch (err) {
      console.error('Error deleting exhibition:', err);
      alert('Kunde inte ta bort. Försök igen.');
    }
  };

  const handleSyncToDatabase = async () => {
    if (!confirm('Vill du synkronisera alla utställningar till databasen? Detta lägger till standarddata.')) return;

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['x-auth-token'] = token;

    setIsLoading(true);
    
    try {
      for (const ex of initialExhibitions) {
        // Don't mark commission/represented as upcoming
        const isCommissionOrRep = ex.category === 'commission' || ex.category === 'represented' || ex.category === 'kommande';
        
        await fetch(`${API_BASE}/exhibitions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: ex.title,
            venue: ex.venue || ex.location,
            date: ex.date || ex.year,
            // Map old 'kommande' category to appropriate new category
            category: ex.category === 'kommande' ? 'commission' : ex.category,
            description: ex.description || '',
            is_current: false,
            is_upcoming: false // Don't auto-mark as upcoming - user should set this manually
          })
        });
      }
      await loadExhibitions();
      notify();
    } catch (err) {
      console.error('Error syncing:', err);
      alert('Kunde inte synkronisera. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm('⚠️ Detta tar bort ALLA utställningar från databasen. Är du säker?')) return;

    const token = localStorage.getItem('token');
    
    setIsLoading(true);
    
    try {
      // Delete all exhibitions
      for (const ex of exhibitionList) {
        await fetch(`${API_BASE}/exhibitions/${ex.id}`, {
          method: 'DELETE',
          headers: token ? { 'x-auth-token': token } : {}
        });
      }
      await loadExhibitions();
      notify();
    } catch (err) {
      console.error('Error clearing:', err);
      alert('Kunde inte rensa. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-[100] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check size={18} />
          <span>Ändringar sparade!</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          {/* Top row - navigation */}
          <div className="flex items-center justify-between mb-2 md:mb-0">
            <div className="flex items-center gap-2 md:gap-4">
              <Link 
                to="/admin" 
                className="flex items-center gap-1 md:gap-2 border border-neutral-300 text-neutral-600 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-neutral-100 hover:border-neutral-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Tillbaka</span>
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-serif">Utställningar</h1>
                <p className="text-[10px] md:text-xs text-neutral-500">
                  {exhibitionList.length} st • {useDatabase ? '🟢 DB' : '🟡 Lokal'}
                </p>
              </div>
            </div>
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1 md:gap-2 border border-neutral-300 text-neutral-600 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-neutral-100 hover:border-neutral-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Visa webbplats</span>
            </Link>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:justify-end">
            {useDatabase && (
              <button 
                onClick={handleClearDatabase}
                className="flex items-center gap-1 md:gap-2 border border-red-200 text-red-600 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm hover:bg-red-50 transition-colors rounded whitespace-nowrap"
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Rensa DB</span>
              </button>
            )}
            {!useDatabase && (
              <button 
                onClick={handleSyncToDatabase}
                className="flex items-center gap-1 md:gap-2 border border-neutral-200 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm hover:bg-neutral-50 transition-colors rounded whitespace-nowrap"
              >
                <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Synka till DB</span>
              </button>
            )}
            <button 
              onClick={openAddModal}
              className="flex items-center gap-1 md:gap-2 bg-neutral-900 text-white px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm hover:bg-neutral-800 transition-colors rounded whitespace-nowrap"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Lägg till</span>
              <span className="sm:hidden">Ny</span>
            </button>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className={`${useDatabase ? 'bg-green-50 border-green-100 text-green-700' : 'bg-blue-50 border-blue-100 text-blue-700'} border-b px-4 md:px-6 py-2 md:py-3`}>
        <p className="max-w-7xl mx-auto text-xs md:text-sm">
          {useDatabase 
            ? <><strong>DB ansluten:</strong> <span className="hidden sm:inline">Ändringar sparas permanent.</span></>
            : <><strong>Lokal data:</strong> <span className="hidden sm:inline">Synka till DB för att spara.</span></>
          }
        </p>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Stats - scrollable on mobile */}
        <div className="flex gap-2 md:grid md:grid-cols-7 md:gap-4 mb-4 md:mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
          <button 
            onClick={() => setFilter('all')}
            className={`p-2 md:p-4 rounded-lg text-center md:text-left transition-colors shrink-0 min-w-[70px] md:min-w-0 ${filter === 'all' ? 'bg-neutral-900 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <p className="text-xl md:text-2xl font-serif">{exhibitionList.length}</p>
            <p className="text-[10px] md:text-sm opacity-70">Totalt</p>
          </button>
          <button 
            onClick={() => setFilter('current')}
            className={`p-2 md:p-4 rounded-lg text-center md:text-left transition-colors shrink-0 min-w-[70px] md:min-w-0 ${filter === 'current' ? 'bg-red-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <p className="text-xl md:text-2xl font-serif">{currentCount}</p>
            <p className="text-[10px] md:text-sm opacity-70">Pågående</p>
          </button>
          <button 
            onClick={() => setFilter('upcoming')}
            className={`p-2 md:p-4 rounded-lg text-center md:text-left transition-colors shrink-0 min-w-[70px] md:min-w-0 ${filter === 'upcoming' ? 'bg-orange-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <p className="text-xl md:text-2xl font-serif">{upcomingCount}</p>
            <p className="text-[10px] md:text-sm opacity-70">Kommande</p>
          </button>
          <button 
            onClick={() => setFilter('separat')}
            className={`p-2 md:p-4 rounded-lg text-center md:text-left transition-colors shrink-0 min-w-[70px] md:min-w-0 ${filter === 'separat' ? 'bg-purple-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <p className="text-xl md:text-2xl font-serif">{separatCount}</p>
            <p className="text-[10px] md:text-sm opacity-70">Separat</p>
          </button>
          <button 
            onClick={() => setFilter('samling')}
            className={`p-2 md:p-4 rounded-lg text-center md:text-left transition-colors shrink-0 min-w-[70px] md:min-w-0 ${filter === 'samling' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <p className="text-xl md:text-2xl font-serif">{samlingCount}</p>
            <p className="text-[10px] md:text-sm opacity-70">Samling</p>
          </button>
          <button 
            onClick={() => setFilter('jury')}
            className={`p-2 md:p-4 rounded-lg text-center md:text-left transition-colors shrink-0 min-w-[70px] md:min-w-0 ${filter === 'jury' ? 'bg-amber-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <p className="text-xl md:text-2xl font-serif">{juryCount}</p>
            <p className="text-[10px] md:text-sm opacity-70">Jury</p>
          </button>
          <button 
            onClick={() => setFilter('commission')}
            className={`p-2 md:p-4 rounded-lg text-center md:text-left transition-colors shrink-0 min-w-[70px] md:min-w-0 ${filter === 'commission' ? 'bg-teal-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <p className="text-xl md:text-2xl font-serif">{uppdragCount}</p>
            <p className="text-[10px] md:text-sm opacity-70">Uppdrag</p>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-3 md:p-4 border-b border-neutral-200">
            <p className="text-xs md:text-sm text-neutral-500">
              Visar {filteredExhibitions.length} utställningar
              {filter !== 'all' && ` (${filter})`}
            </p>
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredExhibitions.map((exhibition) => (
              <div key={exhibition.id} className="p-3 md:p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start gap-2 md:gap-4">
                  {/* Year - compact on mobile */}
                  <span className="text-sm md:text-lg font-bold text-neutral-400 shrink-0 w-10 md:w-14">
                    {exhibition.date || exhibition.year}
                  </span>
                  
                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="font-medium text-sm md:text-lg truncate md:whitespace-normal">
                      {exhibition.title || '—'}
                    </h3>
                    
                    {/* Badges - wrap on mobile */}
                    <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                      {getCategoryBadge(exhibition.category)}
                      {(exhibition as any).is_current && (
                        <span className="px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs bg-red-100 text-red-700">🔴 Pågående</span>
                      )}
                      {(exhibition as any).is_upcoming && !(exhibition as any).is_current && (
                        <span className="px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs bg-orange-100 text-orange-700">🟠 Kommande</span>
                      )}
                    </div>
                    
                    {/* Venue and dates */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-neutral-600 mt-1 md:mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                        <span className="truncate">{exhibition.venue || exhibition.location}</span>
                      </span>
                      {((exhibition as any).start_date || (exhibition as any).end_date) && (
                        <span className="text-[10px] md:text-xs text-neutral-500">
                          {formatDate((exhibition as any).start_date)} – {formatDate((exhibition as any).end_date)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => openEditModal(exhibition)}
                      className="p-1.5 md:p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                      title="Redigera"
                    >
                      <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(exhibition.id!)}
                      className="p-1.5 md:p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Ta bort"
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredExhibitions.length === 0 && (
            <div className="p-12 text-center text-neutral-500">
              Inga utställningar hittades
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-neutral-200 sticky top-0 bg-white">
              <h2 className="text-lg md:text-xl font-serif">
                {editingExhibition ? 'Redigera utställning' : 'Lägg till utställning'}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-neutral-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="Utställningens namn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Plats *
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="Galleri, stad"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Datum/År *
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="2024 eller 15 mars - 30 april 2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Kategori *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  required
                >
                  <option value="separat">Separatutställning</option>
                  <option value="samling">Samlingsutställning</option>
                  <option value="jury">Jurybedömd</option>
                  <option value="commission">Uppdrag</option>
                  <option value="represented">Representerad</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Beskrivning
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent h-20 resize-none"
                  placeholder="Kort beskrivning..."
                />
                <p className="text-xs text-neutral-400 mt-1">
                  💡 Länk-format: [länktext](https://url.se) → blir klickbar länk
                </p>
              </div>

              {/* Image upload for current/upcoming exhibitions */}
              <div className="bg-amber-50 p-4 rounded-lg space-y-3">
                <p className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Bild <span className="text-neutral-400 font-normal">(visas på startsidan för pågående/kommande)</span>
                </p>
                
                {formData.image_url ? (
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img 
                        src={formData.image_url} 
                        alt="Utställningsbild" 
                        className="w-24 h-24 object-cover rounded border border-neutral-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-neutral-600 hover:text-neutral-900 underline"
                    >
                      Byt bild
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-neutral-400 hover:bg-white transition-colors text-sm text-neutral-600"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Laddar upp...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Ladda upp bild
                      </>
                    )}
                  </button>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-neutral-500">
                  Max 5MB. Rekommenderad storlek: 400x400px
                </p>
              </div>

              {/* Date range for current/upcoming status */}
              <div className="bg-neutral-50 p-4 rounded-lg space-y-3">
                <p className="text-sm font-medium text-neutral-700">
                  Visningsperiod <span className="text-neutral-400 font-normal">(valfritt - för automatisk status)</span>
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Startdatum</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Slutdatum</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-neutral-500">
                  Om datum är satta beräknas status automatiskt. Annars använd manuella flaggor nedan.
                </p>
              </div>

              {/* Manual override flags */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <p className="text-sm font-medium text-neutral-700">
                  Manuell status <span className="text-neutral-400 font-normal">(om datum ej är satta)</span>
                </p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.manual_current}
                      onChange={e => setFormData(prev => ({ 
                        ...prev, 
                        manual_current: e.target.checked,
                        manual_upcoming: e.target.checked ? false : prev.manual_upcoming 
                      }))}
                      className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm">🔴 Pågående</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.manual_upcoming}
                      onChange={e => setFormData(prev => ({ 
                        ...prev, 
                        manual_upcoming: e.target.checked,
                        manual_current: e.target.checked ? false : prev.manual_current 
                      }))}
                      className="rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">🟠 Kommande</span>
                  </label>
                </div>
                <p className="text-xs text-neutral-500">
                  Dessa används endast om inga datum är ifyllda. Datum har alltid prioritet.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingExhibition ? 'Spara ändringar' : 'Lägg till'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
