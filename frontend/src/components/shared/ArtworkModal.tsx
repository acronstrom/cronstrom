import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Artwork } from '../../lib/types';

interface ArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function ArtworkModal({ 
  artwork, 
  onClose, 
  onPrevious, 
  onNext, 
  hasPrevious = false, 
  hasNext = false 
}: ArtworkModalProps) {
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
      onPrevious();
    } else if (e.key === 'ArrowRight' && hasNext && onNext) {
      onNext();
    }
  }, [onClose, onPrevious, onNext, hasPrevious, hasNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  if (!artwork) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 p-4 md:p-10 backdrop-blur-sm">
      {/* Close button */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 md:top-8 md:right-8 p-2 hover:bg-neutral-100 rounded-full transition-colors z-10"
        aria-label="Stäng"
      >
        <X size={32} className="text-neutral-800" />
      </button>

      {/* Previous button */}
      {hasPrevious && onPrevious && (
        <button 
          onClick={onPrevious}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10"
          aria-label="Föregående"
        >
          <ChevronLeft size={28} className="text-neutral-800" />
        </button>
      )}

      {/* Next button */}
      {hasNext && onNext && (
        <button 
          onClick={onNext}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10"
          aria-label="Nästa"
        >
          <ChevronRight size={28} className="text-neutral-800" />
        </button>
      )}
      
      <div className="flex flex-col lg:flex-row w-full max-w-7xl h-full max-h-[90vh] bg-white shadow-2xl overflow-hidden">
        <div className="w-full lg:w-2/3 h-1/2 lg:h-full bg-neutral-50 flex items-center justify-center p-6 relative">
          <img 
            src={artwork.imageUrl} 
            alt={artwork.title} 
            className="max-w-full max-h-full object-contain shadow-lg"
          />
        </div>
        
        <div className="w-full lg:w-1/3 h-1/2 lg:h-full overflow-y-auto p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-2">{artwork.title}</h2>
          <p className="text-neutral-500 text-lg mb-6">{artwork.year}</p>
          
          <div className="space-y-6 mb-8">
             <div>
               <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Teknik</h3>
               <p className="text-neutral-800">{artwork.medium}</p>
             </div>
             <div>
               <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Mått</h3>
               <p className="text-neutral-800">{artwork.dimensions}</p>
             </div>
          </div>
          
          <a 
            href={`mailto:hello@cronstrom.net?subject=Förfrågan: ${artwork.title}`}
            className="block w-full py-4 bg-black text-white text-center uppercase tracking-widest text-sm hover:bg-neutral-800 transition-colors"
          >
            Skicka förfrågan
          </a>

          {/* Navigation hint */}
          {(hasPrevious || hasNext) && (
            <p className="text-center text-neutral-400 text-xs mt-6">
              Använd ← → piltangenter för att navigera
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
