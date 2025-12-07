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
  RotateCcw,
  Loader2
} from 'lucide-react';
import { artworks as initialArtworks } from '../../lib/data';
import type { Artwork } from '../../lib/types';

type EditingArtwork = Partial<Artwork> & { isNew?: boolean };

const API_BASE = '/api';

export function GalleryManager() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editingArtwork, setEditingArtwork] = useState<EditingArtwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useDatabase, setUseDatabase] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Galleri', 'Glasfusing', 'Textilmåleri', 'Nobel'];

  // Load artworks from API or localStorage
  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/artworks`, {
        headers: token ? { 'x-auth-token': token } : {}
      });
      const data = await response.json();
      
      if (data.artworks && data.artworks.length > 0) {
        // Map database fields to frontend format
        const mapped = data.artworks.map((a: any) => ({
          id: a.id.toString(),
          title: a.title,
          medium: a.medium || '',
          dimensions: a.dimensions || '',
          year: a.year || '',
          imageUrl: a.image_url || '',
          category: a.category || 'Galleri',
          description: a.description || '',
          status: a.status || 'available'
        }));
        setArtworks(mapped);
        setUseDatabase(true);
      } else {
        // Fallback to initial data if database is empty
        setArtworks(initialArtworks);
        setUseDatabase(false);
      }
    } catch (err) {
      console.error('Error loading artworks:', err);
      // Fallback to initial data
      setArtworks(initialArtworks);
      setUseDatabase(false);
    } finally {
      setIsLoading(false);
    }
  };

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

  const [isUploading, setIsUploading] = useState(false);

  // Compress image before upload - aggressive compression for Vercel's 4.5MB limit
  const compressImage = (file: File, maxWidth = 800, quality = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          
          // Scale down aggressively
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check original file size - if over 5MB, recommend URL instead
    if (file.size > 5 * 1024 * 1024) {
      alert('Bilden är för stor (över 5MB).\n\nAnvänd en bildlänk istället:\n1. Ladda upp bilden till WordPress\n2. Kopiera bildlänken\n3. Klistra in i "Bildlänk (URL)" fältet nedan');
      return;
    }

    setIsUploading(true);
    
    try {
      // Compress image aggressively
      const compressedData = await compressImage(file, 800, 0.6);
      setUploadPreview(compressedData);
      
      // Check compressed size - must be under 2MB for safe upload
      const base64Length = compressedData.length * 0.75;
      if (base64Length > 2 * 1024 * 1024) {
        // Try even more compression
        const moreCompressed = await compressImage(file, 600, 0.4);
        const smallerSize = moreCompressed.length * 0.75;
        
        if (smallerSize > 2 * 1024 * 1024) {
          alert('Bilden är för stor även efter komprimering.\n\nAnvänd en bildlänk istället:\n1. Ladda upp bilden till WordPress\n2. Kopiera bildlänken\n3. Klistra in i "Bildlänk (URL)" fältet');
          setIsUploading(false);
          return;
        }
        
        // Use more compressed version
        setUploadPreview(moreCompressed);
        await uploadToServer(moreCompressed, file.name);
      } else {
        await uploadToServer(compressedData, file.name);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Bilduppladdning misslyckades.\n\nAnvänd en bildlänk istället:\n1. Ladda upp bilden till WordPress\n2. Kopiera bildlänken\n3. Klistra in i "Bildlänk (URL)" fältet');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadToServer = async (imageData: string, filename: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'x-auth-token': token } : {})
      },
      body: JSON.stringify({
        filename: filename.replace(/\.[^/.]+$/, '.jpg'),
        contentType: 'image/jpeg',
        data: imageData
      })
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    if (data.url) {
      setEditingArtwork(prev => prev ? { ...prev, imageUrl: data.url } : null);
      setUploadPreview(data.url);
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  };

  const showNotification = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleSave = async () => {
    if (!editingArtwork) return;

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) headers['x-auth-token'] = token;

    try {
      if (editingArtwork.isNew) {
        // Create new artwork
        const response = await fetch(`${API_BASE}/artworks`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: editingArtwork.title || 'Untitled',
            medium: editingArtwork.medium || '',
            dimensions: editingArtwork.dimensions || '',
            year: editingArtwork.year || new Date().getFullYear().toString(),
            image_url: editingArtwork.imageUrl || '',
            category: editingArtwork.category || 'Galleri',
            description: editingArtwork.description || '',
            status: editingArtwork.status || 'available'
          })
        });
        
        if (response.ok) {
          await loadArtworks();
          showNotification();
        }
      } else {
        // Update existing artwork
        const response = await fetch(`${API_BASE}/artworks/${editingArtwork.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            title: editingArtwork.title,
            medium: editingArtwork.medium,
            dimensions: editingArtwork.dimensions,
            year: editingArtwork.year,
            image_url: editingArtwork.imageUrl,
            category: editingArtwork.category,
            description: editingArtwork.description,
            status: editingArtwork.status
          })
        });
        
        if (response.ok) {
          await loadArtworks();
          showNotification();
        }
      }
    } catch (err) {
      console.error('Error saving artwork:', err);
      alert('Kunde inte spara. Försök igen.');
    }

    setIsModalOpen(false);
    setEditingArtwork(null);
    setUploadPreview(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort detta verk?')) return;

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE}/artworks/${id}`, {
        method: 'DELETE',
        headers: token ? { 'x-auth-token': token } : {}
      });
      
      if (response.ok) {
        await loadArtworks();
        showNotification();
      }
    } catch (err) {
      console.error('Error deleting artwork:', err);
      alert('Kunde inte ta bort. Försök igen.');
    }
  };

  const handleSyncToDatabase = async () => {
    if (!confirm('Vill du synkronisera alla verk till databasen? Detta lägger till standardverken.')) return;

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) headers['x-auth-token'] = token;

    setIsLoading(true);
    
    try {
      for (const artwork of initialArtworks) {
        await fetch(`${API_BASE}/artworks`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: artwork.title,
            medium: artwork.medium,
            dimensions: artwork.dimensions,
            year: artwork.year,
            image_url: artwork.imageUrl,
            category: artwork.category,
            description: artwork.description || '',
            status: artwork.status
          })
        });
      }
      await loadArtworks();
      showNotification();
    } catch (err) {
      console.error('Error syncing:', err);
      alert('Kunde inte synkronisera. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

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
              <p className="text-xs text-neutral-500">
                {artworks.length} verk • {useDatabase ? '🟢 Databas' : '🟡 Lokal data'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!useDatabase && (
              <button
                onClick={handleSyncToDatabase}
                className="flex items-center gap-2 border border-neutral-200 px-4 py-3 text-sm uppercase tracking-wider hover:bg-neutral-100 transition-colors"
                title="Synkronisera till databas"
              >
                <RotateCcw size={18} />
                Synka till DB
              </button>
            )}
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
      <div className={`${useDatabase ? 'bg-green-50 border-green-100 text-green-700' : 'bg-blue-50 border-blue-100 text-blue-700'} border-b px-6 py-3`}>
        <p className="container mx-auto text-sm">
          {useDatabase 
            ? <><strong>Databas ansluten:</strong> Ändringar sparas permanent i Vercel Postgres.</>
            : <><strong>Lokal data:</strong> Klicka "Synka till DB" för att spara verken i databasen.</>
          }
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
                  className={`border-2 border-dashed border-neutral-200 hover:border-neutral-400 transition-colors cursor-pointer aspect-video bg-neutral-50 flex items-center justify-center overflow-hidden relative ${isUploading ? 'opacity-50' : ''}`}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  {uploadPreview ? (
                    <img src={uploadPreview} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <Upload size={32} className="mx-auto text-neutral-400 mb-2" />
                      <p className="text-sm text-neutral-500">Klicka för att ladda upp</p>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <Loader2 className="animate-spin" size={32} />
                      <span className="ml-2 text-sm">Laddar upp...</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                
                {/* Image URL input */}
                <div className="mt-3">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Eller ange bildlänk (URL) - Rekommenderas!
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.imageUrl || ''}
                    onChange={(e) => {
                      setEditingArtwork({ ...editingArtwork, imageUrl: e.target.value });
                      setUploadPreview(e.target.value);
                    }}
                    className="w-full border border-neutral-200 p-2 text-sm focus:border-neutral-400 focus:outline-none"
                    placeholder="https://cronstrom.net/wp-content/uploads/..."
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Tips: Ladda upp bilden till WordPress och klistra in länken här
                  </p>
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
