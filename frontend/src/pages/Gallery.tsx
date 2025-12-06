import { useState, useEffect } from 'react';
import { artworks as initialArtworks } from '../lib/data';
import { SectionHeader, ArtworkGrid } from '../components/shared/SharedComponents';
import { ArtworkModal } from '../components/shared/ArtworkModal';
import type { Artwork } from '../lib/types';

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

export function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    setArtworks(loadArtworks());
  }, []);

  const galleryItems = artworks.filter(a => 
    a.category === 'Galleri' || 
    a.category === 'Abstract' || 
    a.category === 'Nature' || 
    a.category === 'Landscape' || 
    a.category === 'Mixed Media'
  );

  return (
    <>
      <section className="py-24 bg-white min-h-screen pt-32">
        <div className="container mx-auto px-6">
          <SectionHeader title="Galleri" subtitle="Ett urval av målningar och verk." />
          <ArtworkGrid items={galleryItems} onOpen={setSelectedArtwork} />
        </div>
      </section>
      {selectedArtwork && (
        <ArtworkModal 
          artwork={selectedArtwork} 
          onClose={() => setSelectedArtwork(null)} 
        />
      )}
    </>
  );
}
