import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Upload, 
  X,
  Image as ImageIcon,
  Save,
  Check,
  RotateCcw
} from 'lucide-react';
import { artworks as initialArtworks } from '../../lib/data';
import type { Artwork } from '../../lib/types';

type EditingArtwork = Partial<Artwork> & { isNew?: boolean };

const STORAGE_KEY = 'cronstrom_artworks';

// Load artworks from localStorage or use initial data
function loadArtworks(): Artwork[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading artworks from localStorage:', e);
  }
  return initialArtworks;
}

// Save artworks to localStorage
function saveArtworksToStorage(artworks: Artwork[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks));
  } catch (e) {
    console.error('Error saving artworks to localStorage:', e);
  }
}

export function GalleryManager() {
  const [artworks, setArtworks] = useState<Artwork[]>(loadArtworks);
  const [editingArtwork, setEditingArtwork] = useState<EditingArtwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Galleri', 'Glasfusing', 'Textilmåleri', 'Nobel'];

  // Save to localStorage whenever artworks change
  useEffect(() => {
    saveArtworksToStorage(artworks);
  }, [artworks]);

  const openNewArtwork = () => {
    setEditingArtwork({
      isNew: true,
      title: '',
      medium: '',
      dimensions: '',
      year: new Date().getFullYear().toString(),
      imageUrl: '',
      category: 'Galleri',
      description: '',
      price: '',
      status: 'available'
    });
    setUploadPreview(null);
    setIsModalOpen(true);
  };

  const openEditArtwork = (artwork: Artwork) => {
    setEditingArtwork({ ...artwork });
    setUploadPreview(artwork.imageUrl);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
        setEditingArtwork(prev => prev ? { ...prev, imageUrl: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const showNotification = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleSave = () => {
    if (!editingArtwork) return;

    if (editingArtwork.isNew) {
      const newArtwork: Artwork = {
        id: Date.now().toString(),
        title: editingArtwork.title || 'Untitled',
        medium: editingArtwork.medium || '',
        dimensions: editingArtwork.dimensions || '',
        year: editingArtwork.year || new Date().getFullYear().toString(),
        imageUrl: editingArtwork.imageUrl || '',
        category: editingArtwork.category || 'Galleri',
        description: editingArtwork.description,
        price: editingArtwork.price,
        status: editingArtwork.status || 'available'
      };
      setArtworks([newArtwork, ...artworks]);
    } else {
      setArtworks(artworks.map(a => 
        a.id === editingArtwork.id 
          ? { ...a, ...editingArtwork } as Artwork
          : a
      ));
    }

    setIsModalOpen(false);
    setEditingArtwork(null);
    setUploadPreview(null);
    showNotification();
  };

  const handleDelete = (id: string) => {
    if (confirm('Är du säker på att du vill ta bort detta verk?')) {
      setArtworks(artworks.filter(a => a.id !== id));
      showNotification();
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Är du säker på att du vill återställa galleriet till originaldata? Alla ändringar kommer att försvinna.')) {
      localStorage.removeItem(STORAGE_KEY);
      setArtworks(initialArtworks);
      showNotification();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 z-[100] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <Check size={18} />
          <span>Ändringar sparade!</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-serif text-xl">Galleri</h1>
              <p className="text-xs text-neutral-500">Hantera konstverk ({artworks.length} st)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-2 border border-neutral-200 px-4 py-3 text-sm uppercase tracking-wider hover:bg-neutral-100 transition-colors"
              title="Återställ till originaldata"
            >
              <RotateCcw size={18} />
              Återställ
            </button>
            <button
              onClick={openNewArtwork}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              <Plus size={18} />
              Lägg till verk
            </button>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
        <p className="container mx-auto text-sm text-blue-700">
          <strong>Demo-läge:</strong> Ändringar sparas lokalt i din webbläsare. För permanent lagring krävs en databaskoppling.
        </p>
      </div>

      {/* Gallery Grid */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="bg-white border border-neutral-100 overflow-hidden group">
              <div className="aspect-[4/5] bg-neutral-100 relative">
                {artwork.imageUrl ? (
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={48} className="text-neutral-300" />
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => openEditArtwork(artwork)}
                    className="p-3 bg-white rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(artwork.id)}
                    className="p-3 bg-white rounded-full hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {/* Status badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 text-xs uppercase tracking-wider ${
                  artwork.status === 'available' 
                    ? 'bg-green-500 text-white' 
                    : artwork.status === 'reserved'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {artwork.status === 'available' ? 'Tillgänglig' : artwork.status === 'reserved' ? 'Reserverad' : 'Såld'}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-serif text-lg mb-1">{artwork.title}</h3>
                <p className="text-sm text-neutral-500">{artwork.category} • {artwork.year}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit Modal */}
      {isModalOpen && editingArtwork && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif text-xl">
                {editingArtwork.isNew ? 'Nytt konstverk' : 'Redigera konstverk'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Bild
                </label>
                <div 
                  className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 transition-colors cursor-pointer aspect-video bg-neutral-50 flex items-center justify-center overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadPreview ? (
                    <img src={uploadPreview} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <Upload size={32} className="mx-auto text-neutral-400 mb-2" />
                      <p className="text-sm text-neutral-500">Klicka för att ladda upp</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {/* Image URL input */}
                <div className="mt-3">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Eller ange bildlänk (URL)
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.imageUrl || ''}
                    onChange={(e) => {
                      setEditingArtwork({ ...editingArtwork, imageUrl: e.target.value });
                      setUploadPreview(e.target.value);
                    }}
                    className="w-full border border-neutral-200 p-2 text-sm focus:border-neutral-400 focus:outline-none"
                    placeholder="https://example.com/bild.jpg"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={editingArtwork.title || ''}
                  onChange={(e) => setEditingArtwork({ ...editingArtwork, title: e.target.value })}
                  className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                  placeholder="Verkets titel"
                />
              </div>

              {/* Category & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Kategori
                  </label>
                  <select
                    value={editingArtwork.category || 'Galleri'}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, category: e.target.value })}
                    className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    År
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.year || ''}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, year: e.target.value })}
                    className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                    placeholder="2024"
                  />
                </div>
              </div>

              {/* Medium & Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Teknik
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.medium || ''}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, medium: e.target.value })}
                    className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                    placeholder="Akvarell, Olja på duk..."
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Mått
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.dimensions || ''}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, dimensions: e.target.value })}
                    className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none"
                    placeholder="50 x 70 cm"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Status
                </label>
                <select
                  value={editingArtwork.status || 'available'}
                  onChange={(e) => setEditingArtwork({ ...editingArtwork, status: e.target.value as Artwork['status'] })}
                  className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none bg-white"
                >
                  <option value="available">Tillgänglig</option>
                  <option value="reserved">Reserverad</option>
                  <option value="sold">Såld</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Beskrivning
                </label>
                <textarea
                  value={editingArtwork.description || ''}
                  onChange={(e) => setEditingArtwork({ ...editingArtwork, description: e.target.value })}
                  className="w-full border border-neutral-200 p-3 focus:border-neutral-400 focus:outline-none h-24 resize-none"
                  placeholder="Beskriv verket..."
                />
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-sm uppercase tracking-wider hover:bg-neutral-100 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                <Save size={18} />
                Spara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
