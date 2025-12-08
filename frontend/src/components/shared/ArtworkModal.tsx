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

type BgColor = 'black' | 'grey' | 'white';

const bgStyles: Record<BgColor, { bg: string; text: string; textMuted: string; buttonBg: string; buttonHover: string; panelBg: string; border: string }> = {
  black: {
    bg: 'bg-black',
    text: 'text-white',
    textMuted: 'text-white/50',
    buttonBg: 'bg-white/20',
    buttonHover: 'hover:bg-white/30',
    panelBg: 'bg-neutral-900',
    border: 'border-white/10',
  },
  grey: {
    bg: 'bg-neutral-600',
    text: 'text-white',
    textMuted: 'text-white/60',
    buttonBg: 'bg-white/20',
    buttonHover: 'hover:bg-white/30',
    panelBg: 'bg-neutral-700',
    border: 'border-white/10',
  },
  white: {
    bg: 'bg-white',
    text: 'text-neutral-800',
    textMuted: 'text-neutral-400',
    buttonBg: 'bg-neutral-100',
    buttonHover: 'hover:bg-neutral-200',
    panelBg: 'bg-neutral-50',
    border: 'border-neutral-200',
  },
};

export function ArtworkModal({ 
  artwork, 
  onClose, 
  onPrevious, 
  onNext, 
  hasPrevious = false, 
  hasNext = false 
}: ArtworkModalProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [bgColor, setBgColor] = useState<BgColor>('white');
  
  const styles = bgStyles[bgColor];
  
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
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${styles.bg} transition-colors duration-300`}>
      {/* Background color picker */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 flex gap-2 z-10">
        <button
          onClick={() => setBgColor('black')}
          className={`w-7 h-7 rounded-full bg-black border-2 transition-all ${bgColor === 'black' ? 'border-amber-400 scale-110' : 'border-white/30 hover:border-white/60'}`}
          aria-label="Svart bakgrund"
          title="Svart"
        />
        <button
          onClick={() => setBgColor('grey')}
          className={`w-7 h-7 rounded-full bg-neutral-500 border-2 transition-all ${bgColor === 'grey' ? 'border-amber-400 scale-110' : 'border-white/30 hover:border-white/60'}`}
          aria-label="Grå bakgrund"
          title="Grå"
        />
        <button
          onClick={() => setBgColor('white')}
          className={`w-7 h-7 rounded-full bg-white border-2 transition-all ${bgColor === 'white' ? 'border-amber-400 scale-110' : 'border-neutral-300 hover:border-neutral-400'}`}
          aria-label="Vit bakgrund"
          title="Vit"
        />
      </div>

      {/* Close button */}
      <button 
        onClick={onClose} 
        className={`absolute top-4 right-4 md:top-8 md:right-8 p-2 ${styles.buttonBg} ${styles.buttonHover} rounded-full transition-colors z-10`}
        aria-label="Stäng"
      >
        <X size={28} className={styles.text} />
      </button>

      {/* Previous button */}
      {hasPrevious && onPrevious && (
        <button 
          onClick={onPrevious}
          className={`absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-2 md:p-3 ${styles.buttonBg} ${styles.buttonHover} rounded-full shadow-lg transition-all hover:scale-110 z-10`}
          aria-label="Föregående"
        >
          <ChevronLeft size={24} className={styles.text} />
        </button>
      )}

      {/* Next button */}
      {hasNext && onNext && (
        <button 
          onClick={onNext}
          className={`absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-2 md:p-3 ${styles.buttonBg} ${styles.buttonHover} rounded-full shadow-lg transition-all hover:scale-110 z-10`}
          aria-label="Nästa"
        >
          <ChevronRight size={24} className={styles.text} />
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
        <div className={`${styles.panelBg} ${styles.text}`}>
          {/* Title bar with toggle */}
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-6 py-4 flex items-center justify-between"
          >
            <h2 className="text-xl font-serif">{artwork.title}</h2>
            <span className={`${styles.textMuted} flex items-center gap-1 text-xs`}>
              {showDetails ? (
                <>Dölj <ChevronDown size={16} /></>
              ) : (
                <>Info <ChevronUp size={16} /></>
              )}
            </span>
          </button>
          
          {/* Expandable details */}
          {showDetails && (
            <div className={`px-6 pb-6 pt-2 border-t ${styles.border} space-y-4 animate-in slide-in-from-bottom-2 duration-200`}>
              <div className="flex justify-between">
                <div>
                  <h3 className={`text-xs uppercase tracking-wider ${styles.textMuted} mb-1`}>Teknik</h3>
                  <p className={styles.text}>{artwork.medium}</p>
                </div>
                {artwork.dimensions && (
                  <div className="text-right">
                    <h3 className={`text-xs uppercase tracking-wider ${styles.textMuted} mb-1`}>Mått</h3>
                    <p className={styles.text}>{artwork.dimensions}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Side by side */}
      <div className={`hidden md:flex flex-row w-full max-w-7xl h-full max-h-[90vh] ${styles.panelBg} shadow-2xl overflow-hidden m-10 transition-colors duration-300`}>
        <div className={`w-2/3 h-full ${styles.bg} flex items-center justify-center p-6 relative transition-colors duration-300`}>
          <img 
            src={artwork.imageUrl} 
            alt={artwork.title} 
            className="max-w-full max-h-full object-contain shadow-lg"
          />
        </div>
        
        <div className={`w-1/3 h-full overflow-y-auto p-12 flex flex-col justify-center ${styles.panelBg} transition-colors duration-300`}>
          <h2 className={`text-4xl font-serif mb-6 ${styles.text}`}>{artwork.title}</h2>
          
          <div className="space-y-6 mb-8">
             <div>
               <h3 className={`text-xs uppercase tracking-wider ${styles.textMuted} mb-1`}>Teknik</h3>
               <p className={styles.text}>{artwork.medium}</p>
             </div>
             {artwork.dimensions && (
               <div>
                 <h3 className={`text-xs uppercase tracking-wider ${styles.textMuted} mb-1`}>Mått</h3>
                 <p className={styles.text}>{artwork.dimensions}</p>
               </div>
             )}
          </div>

          {/* Navigation hint */}
          {(hasPrevious || hasNext) && (
            <p className={`text-center ${styles.textMuted} text-xs mt-6`}>
              Använd ← → piltangenter för att navigera
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
