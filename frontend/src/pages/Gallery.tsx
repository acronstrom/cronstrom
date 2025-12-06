import { useState, useEffect, useCallback } from 'react';
import { artworks as initialArtworks } from '../lib/data';
import { SectionHeader, ArtworkGrid } from '../components/shared/SharedComponents';
import { ArtworkModal } from '../components/shared/ArtworkModal';
import type { Artwork } from '../lib/types';

export function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    setIsLoading(true);
    try {
      // Try to load from API first
      const response = await fetch('/api/artworks');
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
      } else {
        // Fallback to initial data
        setArtworks(initialArtworks);
      }
    } catch (err) {
      // Fallback to initial data
      setArtworks(initialArtworks);
    } finally {
      setIsLoading(false);
    }
  };

  const galleryItems = artworks.filter(a => 
    a.category === 'Galleri' || 
    a.category === 'Abstract' || 
    a.category === 'Nature' || 
    a.category === 'Landscape' || 
    a.category === 'Mixed Media'
  );

  const handleOpenArtwork = (artwork: Artwork) => {
    const index = galleryItems.findIndex(a => a.id === artwork.id);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrevious = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < galleryItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, galleryItems.length]);

  const selectedArtwork = selectedIndex !== null ? galleryItems[selectedIndex] : null;
  const hasPrevious = selectedIndex !== null && selectedIndex > 0;
  const hasNext = selectedIndex !== null && selectedIndex < galleryItems.length - 1;

  if (isLoading) {
    return (
      <section className="py-24 bg-white min-h-screen pt-32">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-neutral-100 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-24 bg-white min-h-screen pt-32">
        <div className="container mx-auto px-6">
          <SectionHeader title="Galleri" subtitle="Ett urval av målningar och verk." />
          <ArtworkGrid items={galleryItems} onOpen={handleOpenArtwork} />
        </div>
      </section>
      {selectedArtwork && (
        <ArtworkModal 
          artwork={selectedArtwork} 
          onClose={handleClose}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )}
    </>
  );
}
