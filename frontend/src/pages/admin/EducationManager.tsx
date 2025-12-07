import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, GraduationCap, Calendar, X, Save, RefreshCcw, AlertTriangle, Users, ExternalLink, Database } from 'lucide-react';

const API_BASE = '/api';

// Initial data to sync
const initialEducationData = [
  // Studier
  { institution: 'Forsberg Design', degree: 'Konstnärligt grundår', year: '1979-80', type: 'education' },
  { institution: 'Konstfack', degree: 'Textillinje', year: '1980-82', type: 'education' },
  { institution: 'RMI Berghs', degree: 'AD-linje', year: '1982-83', type: 'education' },
  { institution: 'Enebybergs Folkhögskola', degree: 'Akvarell', year: '2005-06', type: 'education' },
  { institution: 'Gerlesborgsskolan', degree: 'Målarskola', year: '2007-08', type: 'education' },
  { institution: 'Capellagårdens Glasstudio', degree: 'Storfors', year: '', type: 'education' },
  { institution: 'Pilchuck Glass School', degree: 'Seattle, USA', year: '', type: 'education' },
  { institution: 'Konstindustriskolan', degree: 'i Göteborg, enstaka kurser', year: '', type: 'education' },
  
  // Medlemskap
  { institution: 'KRO', degree: 'Konstnärernas Riksorganisation', year: '', type: 'membership' },
  { institution: 'Konstnärsklubben', degree: 'Medlem', year: '', type: 'membership' },
  { institution: 'Svenska Akvarellsällskapet', degree: 'Medlem', year: '', type: 'membership' },
  
  // Länkar
  { institution: 'KRO', degree: 'Konstnärernas Riksorganisation', year: '', type: 'link', url: 'https://www.kfrskane.se' },
  { institution: 'Konstnärsklubben', degree: 'Stockholm', year: '', type: 'link', url: 'http://www.konstnarsklubben.com' },
  { institution: 'Svenska Akvarellsällskapet', degree: '', year: '', type: 'link', url: 'https://akvarellsallskapet.se' },
];

interface EducationItem {
  id?: string;
  institution: string;
  degree: string;
  year: string;
  type: 'education' | 'membership' | 'link';
  url?: string;
}

const emptyForm: EducationItem = {
  institution: '',
  degree: '',
  year: '',
  type: 'education',
  url: '',
};

export function EducationManager() {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [formData, setFormData] = useState<EducationItem>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');
  const [filter, setFilter] = useState<'all' | 'education' | 'membership' | 'link'>('all');

  const fetchEducation = useCallback(async () => {
    try {
      setIsLoading(true);
      const healthCheck = await fetch(`${API_BASE}/health`).then(res => res.json());
      setDbStatus(healthCheck.database === 'connected' ? 'connected' : 'disconnected');

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/education`, {
        headers: token ? { 'x-auth-token': token } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        setEducationList(data.education || []);
        setError(null);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (err) {
      console.error("Failed to fetch education:", err);
      setError("Kunde inte ladda utbildningar från databasen.");
      setDbStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const filteredItems = educationList.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const educationCount = educationList.filter(e => e.type === 'education').length;
  const membershipCount = educationList.filter(e => e.type === 'membership').length;
  const linkCount = educationList.filter(e => e.type === 'link').length;

  const openAddModal = (type: 'education' | 'membership' | 'link' = 'education') => {
    setFormData({ ...emptyForm, type });
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: EducationItem) => {
    setFormData({ ...item });
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(emptyForm);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const url = editingItem?.id 
        ? `${API_BASE}/education/${editingItem.id}` 
        : `${API_BASE}/education`;
      
      const response = await fetch(url, {
        method: editingItem?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-auth-token': token } : {})
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save');
      
      await fetchEducation();
      closeModal();
    } catch (err) {
      console.error("Failed to save education:", err);
      setError("Kunde inte spara. Kontrollera databasanslutningen.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Är du säker på att du vill ta bort detta?')) return;
    
    setIsSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/education/${id}`, {
        method: 'DELETE',
        headers: token ? { 'x-auth-token': token } : {}
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      await fetchEducation();
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Kunde inte ta bort. Kontrollera databasanslutningen.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncToDB = async () => {
    if (!window.confirm('Detta kommer att lägga till all utbildningsdata i databasen. Fortsätt?')) return;
    
    setIsSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      
      // Clear existing data first
      for (const item of educationList) {
        if (item.id) {
          await fetch(`${API_BASE}/education/${item.id}`, {
            method: 'DELETE',
            headers: token ? { 'x-auth-token': token } : {}
          });
        }
      }
      
      // Add all initial data
      for (const item of initialEducationData) {
        await fetch(`${API_BASE}/education`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'x-auth-token': token } : {})
          },
          body: JSON.stringify(item)
        });
      }
      
      await fetchEducation();
    } catch (err) {
      console.error("Failed to sync:", err);
      setError("Kunde inte synkronisera. Kontrollera databasanslutningen.");
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'education': return 'Utbildning';
      case 'membership': return 'Medlemskap';
      case 'link': return 'Länk';
      default: return type;
    }
  };

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'education':
        return <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">Utbildning</span>;
      case 'membership':
        return <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">Medlemskap</span>;
      case 'link':
        return <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">Länk</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-neutral-500 hover:text-neutral-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-serif">Hantera Utbildning</h1>
            <span className={`text-xs px-2 py-1 rounded-full ${dbStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              Databas: {dbStatus === 'connected' ? 'Ansluten' : 'Ej ansluten'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncToDB}
              disabled={isSaving || dbStatus !== 'connected'}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Database className="w-4 h-4" />
              Synka till DB
            </button>
            <button
              onClick={() => openAddModal('education')}
              className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Lägg till
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'all' ? 'bg-neutral-900 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <p className="text-2xl font-serif">{educationList.length}</p>
            <p className="text-sm opacity-70">Totalt</p>
          </button>
          <button
            onClick={() => setFilter('education')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'education' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span className="text-2xl font-serif">{educationCount}</span>
            </div>
            <p className="text-sm opacity-70">Utbildning</p>
          </button>
          <button
            onClick={() => setFilter('membership')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'membership' ? 'bg-green-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-2xl font-serif">{membershipCount}</span>
            </div>
            <p className="text-sm opacity-70">Medlemskap</p>
          </button>
          <button
            onClick={() => setFilter('link')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'link' ? 'bg-purple-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <ExternalLink className="w-4 h-4" />
              <span className="text-2xl font-serif">{linkCount}</span>
            </div>
            <p className="text-sm opacity-70">Länkar</p>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCcw className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <p className="text-sm text-neutral-500">
                Visar {filteredItems.length} poster
                {filter !== 'all' && ` (${getTypeLabel(filter)})`}
              </p>
            </div>

            <div className="divide-y divide-neutral-100">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg">{item.institution}</h3>
                        {getTypeBadge(item.type)}
                      </div>
                      <p className="text-neutral-600">{item.degree}</p>
                      {item.year && (
                        <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.year}
                        </p>
                      )}
                      {item.url && (
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mt-1 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {item.url}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                        title="Redigera"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
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

            {filteredItems.length === 0 && (
              <div className="p-12 text-center text-neutral-500">
                Inga poster hittades
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-serif">
                {editingItem ? 'Redigera' : 'Lägg till'} {getTypeLabel(formData.type)}
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
                  Typ *
                </label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as EducationItem['type'] }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  required
                >
                  <option value="education">Utbildning</option>
                  <option value="membership">Medlemskap</option>
                  <option value="link">Länk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {formData.type === 'link' ? 'Namn' : formData.type === 'membership' ? 'Organisation' : 'Institution'} *
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={e => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder={formData.type === 'link' ? 'Konstnärernas Riksorganisation' : formData.type === 'membership' ? 'KRO' : 'Kungliga Konsthögskolan'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {formData.type === 'link' ? 'Beskrivning' : formData.type === 'membership' ? 'Roll/Beskrivning' : 'Program/Examen'}
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={e => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder={formData.type === 'education' ? 'Fri konst' : 'Medlem sedan...'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  År
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="2024 eller 2020-2024"
                />
              </div>

              {formData.type === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={formData.url || ''}
                    onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
                  disabled={isSaving}
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingItem ? 'Spara ändringar' : 'Lägg till'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
