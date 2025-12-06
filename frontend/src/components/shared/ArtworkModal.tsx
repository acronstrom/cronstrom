import { X } from 'lucide-react';
import type { Artwork } from '../../lib/types';

interface ArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
}

export function ArtworkModal({ artwork, onClose }: ArtworkModalProps) {
  if (!artwork) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 p-4 md:p-10 backdrop-blur-sm">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 md:top-8 md:right-8 p-2 hover:bg-neutral-100 rounded-full transition-colors"
        aria-label="Close modal"
      >
        <X size={32} className="text-neutral-800" />
      </button>
      
      <div className="flex flex-col lg:flex-row w-full max-w-7xl h-full max-h-[90vh] bg-white shadow-2xl overflow-hidden">
        <div className="w-full lg:w-2/3 h-1/2 lg:h-full bg-neutral-50 flex items-center justify-center p-6">
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
             {artwork.description && (
               <div>
                 <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Om verket</h3>
                 <p className="text-neutral-600 leading-relaxed">{artwork.description}</p>
               </div>
             )}
             <div>
               <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Status</h3>
               <div className="flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${artwork.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                 <p className="capitalize text-neutral-800">
                   {artwork.status === 'available' ? 'Tillgänglig' : artwork.status === 'reserved' ? 'Reserverad' : 'Såld'}
                 </p>
               </div>
             </div>
          </div>
          
          {artwork.status === 'available' && (
            <a 
              href={`mailto:hello@cronstrom.net?subject=Förfrågan: ${artwork.title}`}
              className="block w-full py-4 bg-black text-white text-center uppercase tracking-widest text-sm hover:bg-neutral-800 transition-colors"
            >
              Skicka förfrågan
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

