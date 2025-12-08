import { useEffect, useCallback, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
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
  const [showDetails, setShowDetails] = useState(false);
  
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 md:bg-white/95 backdrop-blur-sm">
      {/* Close button */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 md:top-8 md:right-8 p-2 hover:bg-white/20 md:hover:bg-neutral-100 rounded-full transition-colors z-10"
        aria-label="Stäng"
      >
        <X size={28} className="text-white md:text-neutral-800" />
      </button>

      {/* Previous button */}
      {hasPrevious && onPrevious && (
        <button 
          onClick={onPrevious}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/20 md:bg-white/80 hover:bg-white/40 md:hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10"
          aria-label="Föregående"
        >
          <ChevronLeft size={24} className="text-white md:text-neutral-800" />
        </button>
      )}

      {/* Next button */}
      {hasNext && onNext && (
        <button 
          onClick={onNext}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/20 md:bg-white/80 hover:bg-white/40 md:hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10"
          aria-label="Nästa"
        >
          <ChevronRight size={24} className="text-white md:text-neutral-800" />
        </button>
      )}
      
      {/* Mobile Layout - Full screen image with expandable details */}
      <div className="md:hidden w-full h-full flex flex-col">
        {/* Image - takes most of the screen */}
        <div className="flex-1 flex items-center justify-center p-4 pt-16">
          <img 
            src={artwork.imageUrl} 
            alt={artwork.title} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {/* Expandable info panel at bottom */}
        <div className="bg-black/90 text-white">
          {/* Title bar with toggle */}
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-6 py-4 flex items-center justify-between"
          >
            <h2 className="text-xl font-serif">{artwork.title}</h2>
            <span className="text-white/60 flex items-center gap-1 text-xs">
              {showDetails ? (
                <>Dölj <ChevronDown size={16} /></>
              ) : (
                <>Info <ChevronUp size={16} /></>
              )}
            </span>
          </button>
          
          {/* Expandable details */}
          {showDetails && (
            <div className="px-6 pb-6 pt-2 border-t border-white/10 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-white/50 mb-1">Teknik</h3>
                  <p className="text-white/90">{artwork.medium}</p>
                </div>
                {artwork.dimensions && (
                  <div className="text-right">
                    <h3 className="text-xs uppercase tracking-wider text-white/50 mb-1">Mått</h3>
                    <p className="text-white/90">{artwork.dimensions}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Side by side */}
      <div className="hidden md:flex flex-row w-full max-w-7xl h-full max-h-[90vh] bg-white shadow-2xl overflow-hidden m-10">
        <div className="w-2/3 h-full bg-neutral-50 flex items-center justify-center p-6 relative">
          <img 
            src={artwork.imageUrl} 
            alt={artwork.title} 
            className="max-w-full max-h-full object-contain shadow-lg"
          />
        </div>
        
        <div className="w-1/3 h-full overflow-y-auto p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-serif mb-6">{artwork.title}</h2>
          
          <div className="space-y-6 mb-8">
             <div>
               <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Teknik</h3>
               <p className="text-neutral-800">{artwork.medium}</p>
             </div>
             {artwork.dimensions && (
               <div>
                 <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Mått</h3>
                 <p className="text-neutral-800">{artwork.dimensions}</p>
               </div>
             )}
          </div>

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
