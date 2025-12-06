import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar, MapPin, Award, Users, Star, X, Save } from 'lucide-react';
import { exhibitions as initialExhibitions } from '../../lib/data';
import type { Exhibition } from '../../lib/types';

type CategoryFilter = 'all' | 'separat' | 'samling' | 'jury' | 'kommande' | 'commission' | 'represented';

interface ExhibitionFormData {
  id?: string;
  year: string;
  title: string;
  location: string;
  category: string;
}

const emptyForm: ExhibitionFormData = {
  year: new Date().getFullYear().toString(),
  title: '',
  location: '',
  category: 'separat'
};

export function ExhibitionsManager() {
  const [exhibitionList, setExhibitionList] = useState<Exhibition[]>(initialExhibitions);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<ExhibitionFormData | null>(null);
  const [formData, setFormData] = useState<ExhibitionFormData>(emptyForm);

  const filteredExhibitions = filter === 'all' 
    ? exhibitionList 
    : exhibitionList.filter(e => e.category === filter);

  const separatCount = exhibitionList.filter(e => e.category === 'separat').length;
  const samlingCount = exhibitionList.filter(e => e.category === 'samling').length;
  const juryCount = exhibitionList.filter(e => e.category === 'jury').length;
  const kommandCount = exhibitionList.filter(e => e.category === 'kommande').length;
  const uppdragCount = exhibitionList.filter(e => e.category === 'commission' || e.category === 'represented').length;

  const getCategoryBadge = (category?: string) => {
    switch(category) {
      case 'separat':
        return <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">Separat</span>;
      case 'samling':
        return <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">Samlingsutställning</span>;
      case 'jury':
        return <span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700">Jurybedömd</span>;
      case 'kommande':
        return <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">Kommande</span>;
      case 'commission':
      case 'represented':
        return <span className="px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-700">Uppdrag/Representerad</span>;
      default:
        return null;
    }
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingExhibition(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exhibition: Exhibition) => {
    const data: ExhibitionFormData = {
      id: exhibition.id,
      year: exhibition.year,
      title: exhibition.title,
      location: exhibition.location,
      category: exhibition.category || 'separat'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExhibition?.id) {
      // Update existing
      setExhibitionList(prev => prev.map(ex => 
        ex.id === editingExhibition.id 
          ? { ...ex, ...formData }
          : ex
      ));
    } else {
      // Add new
      const newExhibition: Exhibition = {
        id: `ex-${Date.now()}`,
        year: formData.year,
        title: formData.title,
        location: formData.location,
        category: formData.category as Exhibition['category']
      };
      setExhibitionList(prev => [newExhibition, ...prev]);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Är du säker på att du vill ta bort denna utställning?')) {
      setExhibitionList(prev => prev.filter(ex => ex.id !== id));
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
            <h1 className="text-xl font-serif">Hantera Utställningar</h1>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Lägg till utställning
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <button 
            onClick={() => setFilter('all')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'all' ? 'bg-neutral-900 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <p className="text-2xl font-serif">{exhibitionList.length}</p>
            <p className="text-sm opacity-70">Totalt</p>
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
            onClick={() => setFilter('kommande')}
            className={`p-4 rounded-lg text-left transition-colors ${filter === 'kommande' ? 'bg-green-600 text-white' : 'bg-white hover:bg-neutral-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-2xl font-serif">{kommandCount}</span>
            </div>
            <p className="text-sm opacity-70">Kommande</p>
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
                      <span className="text-lg font-bold text-neutral-400">{exhibition.year}</span>
                      <h3 className="font-medium text-lg">{exhibition.title || '—'}</h3>
                      {getCategoryBadge(exhibition.category)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exhibition.location}
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

        <p className="text-center text-neutral-500 text-sm mt-8">
          Obs: Ändringar sparas endast lokalt i denna session.
        </p>
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
                  År *
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="2024"
                  required
                />
              </div>

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
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="Galleri, stad"
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
                  <option value="kommande">Kommande</option>
                  <option value="commission">Uppdrag</option>
                  <option value="represented">Representerad</option>
                </select>
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
