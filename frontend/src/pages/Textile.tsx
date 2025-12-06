import { useState } from 'react';
import { motion } from 'motion/react';
import { artworks } from '../lib/data';
import { ArtworkGrid } from '../components/shared/SharedComponents';
import { ArtworkModal } from '../components/shared/ArtworkModal';
import type { Artwork } from '../lib/types';

// Textilmåleri images from cronstrom.net
const textileImages = [
  {
    src: 'https://cronstrom.net/wp-content/uploads/2018/11/20140130235406-1.jpg',
    alt: 'Sidenmålning 1',
    caption: 'Handmålat siden'
  },
  {
    src: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129221916-1.jpg',
    alt: 'Sidenmålning 2',
    caption: 'Sidenschal med akvarellmotiv'
  },
  {
    src: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129222102-1.jpg',
    alt: 'Sidenmålning 3',
    caption: 'Unik textilkonst på siden'
  }
];

const silkTypes = [
  {
    name: 'Habotai',
    description: 'Lätt som luft; märks ej att man bär det',
    weight: 'Lätt'
  },
  {
    name: 'Crepe satin',
    description: 'Tjockt blankt sidan, med tungt fall',
    weight: 'Tungt'
  },
  {
    name: 'Crepe de chine',
    description: '"Rinner som vatten", matt yta, skrynklar ej',
    weight: 'Medium'
  }
];

const processSteps = [
  {
    step: 1,
    title: 'Förberedelse',
    description: 'Handtvätta sidentyget, så att eventuella behandlingsmedel tas bort och "färgen biter".'
  },
  {
    step: 2,
    title: 'Spänn tyget',
    description: 'Spänn tyget i en stor träram med speciella stift, tätt tätt.'
  },
  {
    step: 3,
    title: 'Målning',
    description: 'Måla som akvarell med tyska textilfärger och kinesiska kalligrafipenslar.'
  },
  {
    step: 4,
    title: 'Fixering',
    description: 'Rulla in varje scarf i silkespapper och ångfixera i en stor ångkokare.'
  },
  {
    step: 5,
    title: 'Färdigställning',
    description: 'Handfålla. Klart! Färgbeständigt. Allt går att tvätta i 40°C.'
  }
];

interface TextileImage {
  src: string;
  alt: string;
  caption?: string;
}

function ImageModal({ image, onClose }: { image: TextileImage; onClose: () => void }) {
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
        {image.caption && (
          <p className="text-white/80 text-center mt-4 text-sm">{image.caption}</p>
        )}
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

export function Textile() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedImage, setSelectedImage] = useState<TextileImage | null>(null);
  const textilItems = artworks.filter(a => a.category === 'Textilmåleri');

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
            <h1 className="text-5xl md:text-6xl font-serif mb-6">Textilmåleri</h1>
            <p className="text-sm uppercase tracking-wide text-neutral-500 mb-8">
              Handmålat siden · Unika skapelser
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-xl text-neutral-700 leading-relaxed mb-6">
              Det finns ca 200 olika typer av siden. Men bara en handfull som man kan måla på.
            </p>
            <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-lg border border-neutral-100">
              <p className="text-lg text-neutral-800 font-medium">
                Siden är ett naturmaterial som värmer vid kyla och känns svalt vid värme.
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
          className="py-16 bg-gradient-to-b from-rose-900 to-neutral-900"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-sm uppercase tracking-wide text-rose-200 mb-8 text-center">Verk</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {textileImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  className="cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-80 object-cover hover:opacity-90 transition-opacity"
                  />
                  {image.caption && (
                    <p className="text-sm text-rose-200/80 mt-3 text-center italic">{image.caption}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Silk Types Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-neutral-50"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif text-neutral-900 mb-3">De typer jag målar på</h2>
              <p className="text-neutral-500 mb-10">Varje sidentyp har sina unika egenskaper</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {silkTypes.map((silk, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white p-6 rounded-lg shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-serif text-neutral-900">{silk.name}</h3>
                      <span className="text-xs uppercase tracking-wide text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                        {silk.weight}
                      </span>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed">{silk.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Size info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-10 p-6 bg-white rounded-lg border-l-4 border-rose-400"
              >
                <p className="text-neutral-700">
                  <strong>Min ram är 120 × 120 cm.</strong> Detta räcker till ett klänningsliv eller en top/blus.
                </p>
                <p className="text-neutral-600 mt-2">
                  Jag målar tyg till kläder på beställning samt scarves i olika storlekar, avlånga eller kvadratiska.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif text-neutral-900 mb-10 text-center">Processen</h2>
              
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-rose-200 transform md:-translate-x-1/2"></div>
                
                {processSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    className={`relative flex items-start gap-6 mb-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Step number */}
                    <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center font-serif text-lg z-10">
                      {step.step}
                    </div>
                    
                    {/* Content */}
                    <div className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                      <h3 className="text-xl font-serif text-neutral-900 mb-2">{step.title}</h3>
                      <p className="text-neutral-600">{step.description}</p>
                    </div>
                    
                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-5/12"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400"
        >
          <div className="container mx-auto px-6 text-center">
            <p className="text-white text-2xl font-serif max-w-2xl mx-auto drop-shadow-lg">
              "Siden – ett naturmaterial som värmer vid kyla och svalkar vid värme"
            </p>
          </div>
        </motion.div>

        {/* Additional Gallery Section (from data.ts) */}
        {textilItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-16"
          >
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif text-neutral-900 mb-8">Fler verk</h2>
              <ArtworkGrid items={textilItems} onOpen={setSelectedArtwork} />
            </div>
          </motion.div>
        )}
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
