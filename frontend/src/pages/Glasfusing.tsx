import { useState } from 'react';
import { motion } from 'motion/react';
import { artworks } from '../lib/data';
import { ArtworkGrid } from '../components/shared/SharedComponents';
import { ArtworkModal } from '../components/shared/ArtworkModal';
import type { Artwork } from '../lib/types';

// Glasfusing images from cronstrom.net
const glasfusingImages = [
  {
    src: 'https://cronstrom.net/wp-content/uploads/2024/12/Bla-bordsdekoration--scaled.jpg',
    alt: 'Blå bordsdekoration',
    caption: 'Blå bordsdekoration i glasfusing'
  },
  {
    src: 'https://cronstrom.net/wp-content/uploads/2024/12/Blarott-fat.jpg',
    alt: 'Blårött fat',
    caption: 'Fat i blått och rött glas'
  },
  {
    src: 'https://cronstrom.net/wp-content/uploads/2024/12/IMG_8533-scaled.jpg',
    alt: 'Glasfusing verk',
    caption: 'Glasfusing komposition'
  },
  {
    src: 'https://cronstrom.net/wp-content/uploads/2024/12/svartvitt-fat-scaled.jpg',
    alt: 'Svartvitt fat',
    caption: 'Svartvitt fat i glasfusing'
  },
  {
    src: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129220455.jpg',
    alt: 'Glasfusing smycke 1',
    caption: 'Handgjort glassmycke'
  },
  {
    src: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129221355.jpg',
    alt: 'Glasfusing smycke 2',
    caption: 'Glassmycke i regnbågens färger'
  },
  {
    src: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129221102.jpg',
    alt: 'Glasfusing smycke 3',
    caption: 'Unik glasfusing kreation'
  }
];

interface GlasImage {
  src: string;
  alt: string;
  caption?: string;
}

function ImageModal({ image, onClose }: { image: GlasImage; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-w-5xl max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <img 
          src={image.src} 
          alt={image.alt}
          className="max-w-full max-h-[85vh] object-contain"
        />
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white text-3xl"
        >
          ×
        </button>
      </motion.div>
    </div>
  );
}

export function Glasfusing() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedImage, setSelectedImage] = useState<GlasImage | null>(null);
  const glasItems = artworks.filter(a => a.category === 'Glasfusing');
  
  return (
    <>
      <section className="min-h-screen bg-white pt-32">
        {/* Hero Section */}
        <div className="container mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl font-serif mb-6">Glasfusing</h1>
            <p className="text-sm uppercase tracking-wide text-neutral-500 mb-8">
              Laminering av oblåst glas
            </p>
          </motion.div>

          {/* Main Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-xl text-neutral-700 leading-relaxed mb-8">
              <strong>Tekniken "glasfusing"</strong>, även kallad laminering av oblåst glas, innebär att 
              glasbitar smälts samman vid hög temperatur i en speciell ugn.
            </p>
            
            <div className="bg-gradient-to-br from-cyan-50 to-purple-50 p-8 rounded-lg border border-neutral-100">
              <p className="text-neutral-700 leading-relaxed mb-4">
                Jag kombinerar glas med metaller och olika kemiska föreningar till smycken och det färdiga 
                resultatet blir fascinerande.
              </p>
              <p className="text-lg text-neutral-800 font-medium">
                Varje smycke är unikt och beroende på hur mycket ljus som släpps genom glaset, 
                skiftar det i alla regnbågens färger.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-neutral-900"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-sm uppercase tracking-wide text-neutral-400 mb-8 text-center">Verk</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {glasfusingImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  className="cursor-pointer overflow-hidden rounded-lg aspect-square"
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Historical Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-neutral-50 py-16"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <h2 className="text-sm uppercase tracking-wide text-neutral-500 mb-6">Historik</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Ancient History */}
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="text-4xl font-serif text-neutral-200 mb-4">2000 f.Kr</div>
                  <h3 className="text-xl font-serif text-neutral-900 mb-3">Forntida ursprung</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Historiskt brändes glas med denna teknik redan 2000 år före Kristus. 
                    Egyptier och romare var mest avancerade och deras arbeten kan ses på 
                    bland annat Corning Museum i New York.
                  </p>
                </div>

                {/* Modern Revival */}
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="text-4xl font-serif text-neutral-200 mb-4">1940-tal</div>
                  <h3 className="text-xl font-serif text-neutral-900 mb-3">Modern renässans</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Från 500-talet fram till början av 1900-talet finns endast ett fåtal glasobjekt bevarade. 
                    Glasblåsningstekniken utvecklades i Europa under renässansen och glasfusing blev nästan bortglömt.
                  </p>
                </div>
              </div>

              {/* Timeline note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-8 p-6 border-l-4 border-cyan-500 bg-white"
              >
                <p className="text-neutral-700 leading-relaxed">
                  Först på <strong>1940-talet</strong> började konstnärer i USA åter arbeta med att smälta samman 
                  oblåst glas, och många glaskonstnärer över hela världen arbetar med denna teknik idag.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Additional Gallery Section (from data.ts) */}
        {glasItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-16"
          >
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif text-neutral-900 mb-8">Fler verk</h2>
              <ArtworkGrid items={glasItems} onOpen={setSelectedArtwork} />
            </div>
          </motion.div>
        )}

        {/* Visual element - glass prism effect */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-purple-500"
        >
          <div className="container mx-auto px-6 text-center">
            <p className="text-white text-2xl font-serif max-w-2xl mx-auto drop-shadow-lg">
              "Varje smycke skiftar i alla regnbågens färger"
            </p>
          </div>
        </motion.div>

        {/* Process Section */}
        <div className="py-16 bg-neutral-900 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-sm uppercase tracking-wide text-neutral-400 mb-8 text-center">Processen</h2>
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Hög temperatur</h3>
                  <p className="text-neutral-400 text-sm">
                    Glasbitar smälts samman i en speciell ugn vid mycket hög temperatur
                  </p>
                </div>
                
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
                    <span className="text-2xl">⚗️</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Metaller & kemikalier</h3>
                  <p className="text-neutral-400 text-sm">
                    Kombinerar glas med metaller och olika kemiska föreningar
                  </p>
                </div>
                
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
                    <span className="text-2xl">💎</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Unika smycken</h3>
                  <p className="text-neutral-400 text-sm">
                    Varje verk är unikt och skiftar i färg beroende på ljuset
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedArtwork && (
        <ArtworkModal 
          artwork={selectedArtwork} 
          onClose={() => setSelectedArtwork(null)} 
        />
      )}

      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </>
  );
}
