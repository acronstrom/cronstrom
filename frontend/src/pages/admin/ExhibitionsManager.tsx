import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar, MapPin, Award, Users, Star, X, Save, Loader2, RotateCcw, Check } from 'lucide-react';
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
  start_date: string;
  end_date: string;
}

const emptyForm: ExhibitionFormData = {
  title: '',
  venue: '',
  date: new Date().getFullYear().toString(),
  category: 'separat',
  description: '',
  start_date: '',
  end_date: ''
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
          is_current: e.is_current,
          is_upcoming: e.is_upcoming,
          start_date: e.start_date ? e.start_date.split('T')[0] : '',
          end_date: e.end_date ? e.end_date.split('T')[0] : ''
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
        return <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">Separat</span>;
      case 'samling':
        return <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">Samlingsutställning</span>;
      case 'jury':
        return <span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700">Jurybedömd</span>;
      case 'commission':
      case 'represented':
        return <span className="px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-700">Uppdrag/Representerad</span>;
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
      start_date: (exhibition as any).start_date || '',
      end_date: (exhibition as any).end_date || ''
    };
    setFormData(data);
    setEditingExhibition(data);
    setIsModalOpen(true);
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-neutral-500 hover:text-neutral-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-serif">Hantera Utställningar</h1>
              <p className="text-xs text-neutral-500">
                {exhibitionList.length} utställningar • {useDatabase ? '🟢 Databas' : '🟡 Lokal data'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {useDatabase && (
              <button 
                onClick={handleClearDatabase}
                className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 text-sm hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Rensa DB
              </button>
            )}
            {!useDatabase && (
              <button 
                onClick={handleSyncToDatabase}
                className="flex items-center gap-2 border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Synka till DB
              </button>
            )}
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Lägg till utställning
            </button>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className={`${useDatabase ? 'bg-green-50 border-green-100 text-green-700' : 'bg-blue-50 border-blue-100 text-blue-700'} border-b px-6 py-3`}>
        <p className="max-w-7xl mx-auto text-sm">
          {useDatabase 
            ? <><strong>Databas ansluten:</strong> Ändringar sparas permanent och visas på hemsidan.</>
            : <><strong>Lokal data:</strong> Klicka "Synka till DB" för att spara utställningarna i databasen.</>
          }
        </p>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
          <button 
            onClick={() => setFilter('all')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'all' ? 'bg-neutral-900 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <p className="text-2xl font-serif">{exhibitionList.length}</p>
            <p className="text-sm opacity-70">Totalt</p>
          </button>
          <button 
            onClick={() => setFilter('current')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'current' ? 'bg-red-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-2xl font-serif">{currentCount}</span>
            </div>
            <p className="text-sm opacity-70">Pågående</p>
          </button>
          <button 
            onClick={() => setFilter('upcoming')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'upcoming' ? 'bg-orange-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-2xl font-serif">{upcomingCount}</span>
            </div>
            <p className="text-sm opacity-70">Kommande</p>
          </button>
          <button 
            onClick={() => setFilter('separat')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'separat' ? 'bg-purple-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4" />
              <span className="text-2xl font-serif">{separatCount}</span>
            </div>
            <p className="text-sm opacity-70">Separat</p>
          </button>
          <button 
            onClick={() => setFilter('samling')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'samling' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-2xl font-serif">{samlingCount}</span>
            </div>
            <p className="text-sm opacity-70">Samling</p>
          </button>
          <button 
            onClick={() => setFilter('jury')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'jury' ? 'bg-amber-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-2xl font-serif">{juryCount}</span>
            </div>
            <p className="text-sm opacity-70">Jury</p>
          </button>
          <button 
            onClick={() => setFilter('commission')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'commission' ? 'bg-teal-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-serif">{uppdragCount}</span>
            </div>
            <p className="text-sm opacity-70">Uppdrag</p>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <p className="text-sm text-neutral-500">
              Visar {filteredExhibitions.length} utställningar
              {filter !== 'all' && ` (${filter})`}
            </p>
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredExhibitions.map((exhibition) => (
              <div key={exhibition.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-neutral-400">{exhibition.date || exhibition.year}</span>
                      <h3 className="font-medium text-lg">{exhibition.title || '—'}</h3>
                      {getCategoryBadge(exhibition.category)}
                      {(exhibition as any).is_current && (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">🔴 Pågående</span>
                      )}
                      {(exhibition as any).is_upcoming && !(exhibition as any).is_current && (
                        <span className="px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700">🟠 Kommande</span>
                      )}
                      {((exhibition as any).start_date || (exhibition as any).end_date) && (
                        <span className="text-xs text-neutral-500">
                          {formatDate((exhibition as any).start_date)} – {formatDate((exhibition as any).end_date)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exhibition.venue || exhibition.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => openEditModal(exhibition)}
                      className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                      title="Redigera"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(exhibition.id!)}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Ta bort"
                    >
                      <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-serif">
                {editingExhibition ? 'Redigera utställning' : 'Lägg till utställning'}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-neutral-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              </div>

              {/* Date range for current/upcoming status */}
              <div className="bg-neutral-50 p-4 rounded-lg space-y-3">
                <p className="text-sm font-medium text-neutral-700">
                  Visningsperiod <span className="text-neutral-400 font-normal">(för Pågående/Kommande status)</span>
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
                  • Före startdatum = <span className="text-orange-600">Kommande</span><br/>
                  • Mellan start och slut = <span className="text-red-600">Pågående</span><br/>
                  • Efter slutdatum = Arkiverad (visas ej på startsidan)
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
