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
  Loader2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ExternalLink
} from 'lucide-react';
import { artworks as initialArtworks } from '../../lib/data';
import type { Artwork } from '../../lib/types';
import { API_BASE } from '../../lib/config';

type EditingArtwork = Partial<Artwork> & { isNew?: boolean };

export function GalleryManager() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editingArtwork, setEditingArtwork] = useState<EditingArtwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useDatabase, setUseDatabase] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Alla');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Galleri', 'Glasfusing', 'Textilmåleri', 'Nobel'];
  const tabs = ['Alla', ...categories];
  
  // Filter artworks based on active tab
  const filteredArtworks = activeTab === 'Alla' 
    ? artworks 
    : artworks.filter(a => a.category === activeTab);

  // Move artwork up in order
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArtworks = [...artworks];
    [newArtworks[index - 1], newArtworks[index]] = [newArtworks[index], newArtworks[index - 1]];
    setArtworks(newArtworks);
    setHasOrderChanges(true);
  };

  // Move artwork down in order
  const moveDown = (index: number) => {
    if (index === artworks.length - 1) return;
    const newArtworks = [...artworks];
    [newArtworks[index], newArtworks[index + 1]] = [newArtworks[index + 1], newArtworks[index]];
    setArtworks(newArtworks);
    setHasOrderChanges(true);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    // Store the artwork ID instead of index for reliable tracking
    const artworkId = filteredArtworks[index]?.id;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', artworkId || '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Get artwork IDs from filtered list
    const draggedArtwork = filteredArtworks[draggedIndex];
    const dropArtwork = filteredArtworks[dropIndex];
    
    if (!draggedArtwork || !dropArtwork) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Find actual positions in full array
    const fromIndex = artworks.findIndex(a => a.id === draggedArtwork.id);
    const toIndex = artworks.findIndex(a => a.id === dropArtwork.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      const newArtworks = [...artworks];
      const [removed] = newArtworks.splice(fromIndex, 1);
      newArtworks.splice(toIndex, 0, removed);
      setArtworks(newArtworks);
      setHasOrderChanges(true);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Save new order to database
  const saveOrder = async () => {
    if (!useDatabase) {
      alert('Ordningen kan bara sparas när databasen är ansluten.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const order = artworks.map((artwork, index) => ({
        id: parseInt(artwork.id),
        sort_order: index
      }));
      
      const response = await fetch(`${API_BASE}/artworks/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-auth-token': token } : {})
        },
        body: JSON.stringify({ order })
      });
      
      if (response.ok) {
        setHasOrderChanges(false);
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 3000);
      } else {
        throw new Error('Failed to save order');
      }
    } catch (err) {
      console.error('Error saving order:', err);
      alert('Kunde inte spara ordningen. Försök igen.');
    }
  };

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
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState('');

  // ALL images to migrate from WordPress
  const allImagesToMigrate = [
    // === GALLERI (15 images) ===
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2022/04/IMG_0252-768x711.jpg', title: 'Vita gäss', medium: 'Akvarell', dimensions: '40 x 50 cm', year: '2022', category: 'Galleri', description: 'Vita gäss i rörelse mot en öppen himmel.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2023/03/Bergetl-768x507.jpg', title: 'Berget', medium: 'Akvarell', dimensions: '50 x 35 cm', year: '2023', category: 'Galleri', description: 'Ett dramatiskt bergslandskap i nordisk anda.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2023/03/Vita-gass-lll-720x1024.jpg', title: 'Vita gäss III', medium: 'Akvarell', dimensions: '60 x 80 cm', year: '2023', category: 'Galleri', description: 'Den tredje i serien av vita gäss.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2023/03/samtal-pagar-768x996.jpg', title: 'Samtal pågår', medium: 'Akvarell', dimensions: '45 x 60 cm', year: '2023', category: 'Galleri', description: 'Ett ögonblick av kommunikation fångat i färg.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/Tar-sjovagen-kopia-768x776.jpg', title: 'Tar sjövägen', medium: 'Akvarell', dimensions: '50 x 50 cm', year: '2024', category: 'Galleri', description: 'En resa över vatten, inspirerad av skärgårdens rytm.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/Vem-dar_-768x732.png', title: 'Vem där?', medium: 'Akvarell', dimensions: '40 x 40 cm', year: '2024', category: 'Galleri', description: 'En fråga ställd genom penseldraget.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/Vantan-768x1023.png', title: 'Väntan', medium: 'Akvarell', dimensions: '55 x 70 cm', year: '2024', category: 'Galleri', description: 'Tålamod och stillhet fångat i ett ögonblick.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/kappsegling-659x1024.png', title: 'Kappsegling', medium: 'Akvarell', dimensions: '45 x 65 cm', year: '2024', category: 'Galleri', description: 'Seglingens spänning och vindens kraft.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/Tatatat-ll-1-712x1024.png', title: 'Tätatät', medium: 'Akvarell', dimensions: '50 x 70 cm', year: '2024', category: 'Galleri', description: 'Närhet och samhörighet uttryckt i form och färg.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/Vattenfall-768x747.png', title: 'Vattenfall', medium: 'Akvarell', dimensions: '50 x 50 cm', year: '2024', category: 'Galleri', description: 'Vattnets kraft och rörelse i naturens magi.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2025/03/Dit-nabben-pekar--768x588.jpg', title: 'Dit näbben pekar', medium: 'Akvarell', dimensions: '45 x 35 cm', year: '2025', category: 'Galleri', description: 'Fåglarnas riktning och instinkt.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2025/03/Fagelskadare--768x773.jpg', title: 'Fågelskådare', medium: 'Akvarell', dimensions: '50 x 50 cm', year: '2025', category: 'Galleri', description: 'En hyllning till naturens observatörer.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2025/03/Hanger-ihop-768x984.jpg', title: 'Hänger ihop', medium: 'Akvarell', dimensions: '55 x 70 cm', year: '2025', category: 'Galleri', description: 'Samband och samhörighet i naturens värld.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2025/03/skogsglanta-768x779.jpg', title: 'Skogsglänta', medium: 'Akvarell', dimensions: '50 x 50 cm', year: '2025', category: 'Galleri', description: 'Ljuset som bryter igenom skogens tak.' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2025/03/Soligt-768x741.jpg', title: 'Soligt', medium: 'Akvarell', dimensions: '45 x 45 cm', year: '2025', category: 'Galleri', description: 'Solens värme och ljus i akvarellens transparens.' },
    
    // === GLASFUSING (7 images) ===
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/12/Bla-bordsdekoration--scaled.jpg', title: 'Blå bordsdekoration', medium: 'Glasfusing', dimensions: '', year: '2024', category: 'Glasfusing', description: 'Blå bordsdekoration i glasfusing' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/12/Blarott-fat.jpg', title: 'Blårött fat', medium: 'Glasfusing', dimensions: '', year: '2024', category: 'Glasfusing', description: 'Fat i blått och rött glas' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/12/IMG_8533-scaled.jpg', title: 'Glasfusing komposition', medium: 'Glasfusing', dimensions: '', year: '2024', category: 'Glasfusing', description: 'Glasfusing komposition' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/12/svartvitt-fat-scaled.jpg', title: 'Svartvitt fat', medium: 'Glasfusing', dimensions: '', year: '2024', category: 'Glasfusing', description: 'Svartvitt fat i glasfusing' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129220455.jpg', title: 'Glassmycke 1', medium: 'Glasfusing', dimensions: '', year: '2014', category: 'Glasfusing', description: 'Handgjort glassmycke' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129221355.jpg', title: 'Glassmycke 2', medium: 'Glasfusing', dimensions: '', year: '2014', category: 'Glasfusing', description: 'Glassmycke i regnbågens färger' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129221102.jpg', title: 'Glassmycke 3', medium: 'Glasfusing', dimensions: '', year: '2014', category: 'Glasfusing', description: 'Unik glasfusing kreation' },
    
    // === NOBEL 2013 - Ekonomipriset (6 images) ===
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/fama-diploma.jpg', title: 'Eugene F. Fama Nobeldiplom', medium: 'Akvarell', dimensions: '', year: '2013', category: 'Nobel', description: 'Nobeldiplom 2013 - Ekonomipriset' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/hansen-diploma.jpg', title: 'Lars Peter Hansen Nobeldiplom', medium: 'Akvarell', dimensions: '', year: '2013', category: 'Nobel', description: 'Nobeldiplom 2013 - Ekonomipriset' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/shiller-diploma.jpg', title: 'Robert J. Shiller Nobeldiplom', medium: 'Akvarell', dimensions: '', year: '2013', category: 'Nobel', description: 'Nobeldiplom 2013 - Ekonomipriset' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/robertj.jpg', title: 'Lena med Robert J. Shiller', medium: 'Fotografi', dimensions: '', year: '2013', category: 'Nobel', description: 'Från Nobelceremonin 2013' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/al-hansen-award.jpg', title: 'Lars Peter Hansen', medium: 'Fotografi', dimensions: '', year: '2013', category: 'Nobel', description: '© Nobel Media AB 2013' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/EugeneF.jpg', title: 'Eugene F. Fama med Lena', medium: 'Fotografi', dimensions: '', year: '2013', category: 'Nobel', description: 'Från Nobelceremonin 2013' },
    
    // === NOBEL 2012 - Fysikpriset (4 images) ===
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/wineland_diploma.jpg', title: 'David J. Wineland Nobeldiplom', medium: 'Akvarell', dimensions: '', year: '2012', category: 'Nobel', description: 'Nobeldiplom 2012 - Fysikpriset' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/haroche_diploma.jpg', title: 'Serge Haroche Nobeldiplom', medium: 'Akvarell', dimensions: '', year: '2012', category: 'Nobel', description: 'Nobeldiplom 2012 - Fysikpriset' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/Lena-Haroche.jpg', title: 'Lena med Serge Haroche', medium: 'Fotografi', dimensions: '', year: '2012', category: 'Nobel', description: 'Från Nobelceremonin 2012' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/Lena-Wineland.jpg', title: 'David J. Wineland med Lena', medium: 'Fotografi', dimensions: '', year: '2012', category: 'Nobel', description: 'Från Nobelceremonin 2012' },
    
    // === NOBEL 2011 - Kemipriset (3 images) ===
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/nobel.png', title: 'Dan Shechtman Nobeldiplom', medium: 'Akvarell', dimensions: '', year: '2011', category: 'Nobel', description: 'Nobeldiplom 2011 - Kemipriset - Flyga drake' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/chestmanprice.jpg', title: 'Nobelceremonin 2011', medium: 'Fotografi', dimensions: '', year: '2011', category: 'Nobel', description: 'Nobelceremonin 2011' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/lena_chestman.jpg', title: 'Lena med Dan Shechtman', medium: 'Fotografi', dimensions: '', year: '2011', category: 'Nobel', description: 'Från Nobelceremonin 2011' },
    
    // === TEXTILMÅLERI (3 images) ===
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/20140130235406-1.jpg', title: 'Sidenmålning 1', medium: 'Textilmåleri', dimensions: '', year: '', category: 'Textilmåleri', description: 'Handmålat siden' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129221916-1.jpg', title: 'Sidenmålning 2', medium: 'Textilmåleri', dimensions: '', year: '', category: 'Textilmåleri', description: 'Sidenschal med akvarellmotiv' },
    { imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129222102-1.jpg', title: 'Sidenmålning 3', medium: 'Textilmåleri', dimensions: '', year: '', category: 'Textilmåleri', description: 'Unik textilkonst på siden' },
  ];

  // Migrate ALL images from WordPress to Vercel Blob (one at a time to avoid timeout)
  // Skips images that already exist in the database (by title match)
  const migrateAllImages = async () => {
    if (!useDatabase) {
      alert('Databasen måste vara ansluten för att migrera bilder.');
      return;
    }
    
    // Check which images already exist
    const existingTitles = new Set(artworks.map(a => a.title.toLowerCase().trim()));
    const imagesToMigrate = allImagesToMigrate.filter(
      img => !existingTitles.has(img.title.toLowerCase().trim())
    );
    
    if (imagesToMigrate.length === 0) {
      alert('Alla bilder är redan migrerade!');
      return;
    }
    
    const skippedCount = allImagesToMigrate.length - imagesToMigrate.length;
    const confirm = window.confirm(
      `Migration av bilder från WordPress till Vercel Blob:\n\n` +
      `• ${imagesToMigrate.length} bilder att migrera\n` +
      `• ${skippedCount} bilder hoppas över (finns redan)\n\n` +
      `Det tar ca ${Math.ceil(imagesToMigrate.length * 2 / 60)} minut(er). Fortsätta?`
    );
    if (!confirm) return;
    
    setIsMigrating(true);
    setMigrationProgress('Startar...');
    const token = localStorage.getItem('token');
    let successCount = 0;
    let failCount = 0;
    
    // Migrate one image at a time to avoid timeout
    for (let i = 0; i < imagesToMigrate.length; i++) {
      const img = imagesToMigrate[i];
      setMigrationProgress(`${i + 1}/${imagesToMigrate.length}: ${img.title}`);
      
      try {
        console.log(`Migrating ${i + 1}/${imagesToMigrate.length}: ${img.title}`);
        
        const response = await fetch(`${API_BASE}/migrate-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'x-auth-token': token } : {})
          },
          body: JSON.stringify(img)
        });
        
        if (response.ok) {
          successCount++;
          console.log(`✓ ${img.title} migrated successfully`);
        } else {
          failCount++;
          console.error(`✗ ${img.title} failed: ${response.status}`);
        }
      } catch (err) {
        failCount++;
        console.error(`✗ ${img.title} error:`, err);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setIsMigrating(false);
    setMigrationProgress('');
    alert(`Migration klar!\n\n✓ ${successCount} lyckades\n✗ ${failCount} misslyckades\n⏭ ${skippedCount} hoppades över`);
    
    // Reload artworks to show the new ones
    await loadArtworks();
  };

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
                <h1 className="font-serif text-lg md:text-xl">Galleri</h1>
                <p className="text-[10px] md:text-xs text-neutral-500">
                  {artworks.length} verk • {useDatabase ? '🟢 DB' : '🟡 Lokal'}
                </p>
              </div>
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
          
          {/* Action buttons row - scrollable on mobile */}
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:justify-end">
            {!useDatabase && (
              <button
                onClick={handleSyncToDatabase}
                className="flex items-center gap-1 md:gap-2 border border-neutral-200 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-neutral-100 transition-colors whitespace-nowrap"
                title="Synkronisera till databas"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Synka till DB</span>
              </button>
            )}
            {isReorderMode ? (
              <>
                <button
                  onClick={() => {
                    setIsReorderMode(false);
                    if (hasOrderChanges) {
                      loadArtworks(); // Reload to discard changes
                      setHasOrderChanges(false);
                    }
                  }}
                  className="flex items-center gap-1 md:gap-2 border border-neutral-200 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-neutral-100 transition-colors whitespace-nowrap"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">Avbryt</span>
                </button>
                <button
                  onClick={saveOrder}
                  disabled={!hasOrderChanges}
                  className="flex items-center gap-1 md:gap-2 bg-green-600 text-white px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  <Save size={16} />
                  <span className="hidden sm:inline">Spara ordning</span>
                  <span className="sm:hidden">Spara</span>
                </button>
              </>
            ) : (
              <>
                {useDatabase && (
                  <button
                    onClick={migrateAllImages}
                    disabled={isMigrating}
                    className="flex items-center gap-1 md:gap-2 border border-cyan-500 text-cyan-700 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-cyan-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                    title="Migrera alla bilder från WordPress till Vercel Blob"
                  >
                    {isMigrating ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span className="max-w-[100px] md:max-w-[200px] truncate text-xs">{migrationProgress || 'Migrerar...'}</span>
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        <span className="hidden sm:inline">Migrera Bilder</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setIsReorderMode(true)}
                  className="flex items-center gap-1 md:gap-2 border border-neutral-200 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-neutral-100 transition-colors whitespace-nowrap"
                  title="Ändra ordning"
                >
                  <GripVertical size={16} />
                  <span className="hidden sm:inline">Ändra ordning</span>
                </button>
                <button
                  onClick={openNewArtwork}
                  className="flex items-center gap-1 md:gap-2 bg-black text-white px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors whitespace-nowrap"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Lägg till verk</span>
                  <span className="sm:hidden">Nytt</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className={`${useDatabase ? 'bg-green-50 border-green-100 text-green-700' : 'bg-blue-50 border-blue-100 text-blue-700'} border-b px-4 md:px-6 py-2 md:py-3`}>
        <p className="container mx-auto text-xs md:text-sm">
          {useDatabase 
            ? <><strong>DB ansluten:</strong> <span className="hidden sm:inline">Ändringar sparas permanent.</span></>
            : <><strong>Lokal data:</strong> <span className="hidden sm:inline">Klicka "Synka till DB" för att spara.</span></>
          }
        </p>
      </div>

      {/* Reorder Mode Banner */}
      {isReorderMode && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 md:px-6 py-2 md:py-3">
          <p className="container mx-auto text-xs md:text-sm text-amber-800">
            <strong>Sorteringsläge:</strong> Dra och släpp för att ändra ordning.
          </p>
        </div>
      )}

      {/* Category Tabs */}
      <div className="border-b border-neutral-200 bg-white sticky top-[57px] md:top-[73px] z-30">
        <div className="container mx-auto px-2 md:px-6">
          <nav className="flex gap-0 md:gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => {
              const count = tab === 'Alla' 
                ? artworks.length 
                : artworks.filter(a => a.category === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-black text-black'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {tab}
                  <span className={`ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs ${
                    activeTab === tab ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        {filteredArtworks.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>Inga verk i denna kategori</p>
          </div>
        ) : (
        <div className={isReorderMode 
          ? "grid grid-cols-2 md:grid-cols-3 gap-4" 
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        }>
          {filteredArtworks.map((artwork, index) => (
            isReorderMode ? (
              /* Reorder Mode - Grid view with drag & drop thumbnails */
              <div 
                key={artwork.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative bg-white border-2 rounded-lg overflow-hidden transition-all cursor-grab active:cursor-grabbing select-none ${
                  draggedIndex === index 
                    ? 'opacity-50 border-neutral-400 scale-95' 
                    : dragOverIndex === index 
                    ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                    : 'border-neutral-200 hover:border-neutral-400 hover:shadow-lg'
                }`}
              >
                {/* Order number badge */}
                <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-mono px-2 py-1 rounded">
                  {index + 1}
                </div>
                
                {/* Drag handle indicator */}
                <div className="absolute top-2 right-2 z-10 bg-white/90 p-1.5 rounded shadow">
                  <GripVertical size={16} className="text-neutral-500" />
                </div>
                
                {/* Thumbnail */}
                <div className="aspect-square bg-neutral-100">
                  {artwork.imageUrl ? (
                    <img 
                      src={artwork.imageUrl} 
                      alt={artwork.title}
                      className="w-full h-full object-cover pointer-events-none"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={32} className="text-neutral-300" />
                    </div>
                  )}
                </div>
                
                {/* Title */}
                <div className="p-2 bg-white">
                  <p className="text-sm font-medium truncate">{artwork.title}</p>
                  <p className="text-xs text-neutral-400">{artwork.category}</p>
                </div>
              </div>
            ) : (
              /* Normal Mode - Grid view */
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
            )
          ))}
        </div>
        )}
      </main>

      {/* Edit Modal */}
      {isModalOpen && editingArtwork && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white w-full max-w-3xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-lg md:rounded-none">
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
              <h2 className="font-serif text-lg md:text-xl">
                {editingArtwork.isNew ? 'Nytt konstverk' : 'Redigera konstverk'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
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
