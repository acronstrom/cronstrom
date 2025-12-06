import { motion } from 'motion/react';
import { useState } from 'react';

interface NobelImage {
  src: string;
  alt: string;
  caption?: string;
}

const nobelYears = [
  {
    year: 2013,
    prize: 'Ekonomipriset',
    color: 'ljust brunt',
    colorClass: 'bg-amber-700',
    recipients: 'Eugene F. Fama, Lars Peter Hansen och Robert J. Shiller',
    title: 'Tjuren som symbol för finansmarknaden',
    description: `Sedan urminnes tider använder människor tecken och symboler för att kommunicera. Dessa utgör ett nyanserat, universellt språk. Tjuren är symbol för kraft, makt och fruktbarhet. De första Homo sapiens sökte minimera risken vid jakt genom att avbilda, läsa av och lära in tjurens psykologiska beteende.

Risker är emellertid svåra att mäta och omöjliga att gardera sig emot, även på finansiella marknader. "The Wall Street Bull"* är symbol för finanskvarteren i New York. Är det variationer i risk och psykologiska faktorer, som än idag bestämmer t.ex. tillgångspriser?

*Bronsskulptur av Arthuro Di Modica`,
    diplomas: [
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/fama-diploma.jpg', alt: 'Eugene F. Fama Nobeldiplom 2013' },
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/hansen-diploma.jpg', alt: 'Lars Peter Hansen Nobeldiplom 2013' },
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/shiller-diploma.jpg', alt: 'Robert J. Shiller Nobeldiplom 2013' },
    ],
    photos: [
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/robertj.jpg', alt: 'Lena med Robert J. Shiller', caption: 'Lena med Robert J. Shiller' },
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/al-hansen-award.jpg', alt: 'Lars Peter Hansen', caption: 'Lars Peter Hansen © Nobel Media AB 2013' },
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/EugeneF.jpg', alt: 'Eugene F. Fama med Lena', caption: 'Eugene F. Fama med Lena' },
    ],
    credits: {
      artist: 'Lena Cronström',
      calligrapher: 'Annika Rücker',
      bookbinder: 'Ingemar Dackéus',
      photo: 'Lovisa Engblom'
    }
  },
  {
    year: 2012,
    prize: 'Fysikpriset',
    color: 'marinblått',
    colorClass: 'bg-blue-900',
    recipients: 'Serge Haroche och David J. Wineland',
    achievement: 'Banbrytande experimentella metoder som möjliggör mätning och styrning av kvantsystem',
    title: 'Skepp med besättning — "forskare i team"',
    description: `Fysikpriset detta år gick till ämnesområdet kvantfysik, en bisarr parallellvärld som ingen någonsin sett. Kvantpartiklar kan inte ses i mikroskop och har bland annat egenskapen att de kan befinna sig på två ställen samtidigt. Detta är svårt att förstå i vår realistiska värld!

Metafor: "att sitta i samma båt". Forskning är som en sjöresa. För att navigera och föra "båten" framåt krävs samarbete mellan kapten och besättning. Alla får vara beredda på överraskningar och plötsliga kursändringar.

Vid stiltje händer ingenting — man tror att man kört fast ohjälpligt, i motsats till storm — då allt händer samtidigt! Om manskapet har respekt för varandra och naturens lagar upplever de tjusning och frihet under resans gång.

Att slutföra projektet innebär att föra det i hamn. Människan kan ju också i tanken befinna sig på två ställen samtidigt, när man är på resa. Man är dels på orten man lämnat och dels på orten vid resmålet.`,
    diplomas: [
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/wineland_diploma.jpg', alt: 'David J. Wineland Nobeldiplom 2012' },
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/haroche_diploma.jpg', alt: 'Serge Haroche Nobeldiplom 2012' },
    ],
    photos: [
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/Lena-Haroche.jpg', alt: 'Lena med Serge Haroche', caption: 'Lena med Serge Haroche' },
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/Lena-Wineland.jpg', alt: 'David J. Wineland med Lena', caption: 'David J. Wineland med Lena' },
    ],
    credits: {
      artist: 'Lena Cronström',
      calligrapher: 'Annika Rücker',
      bookbinder: 'Ingemar Dackéus',
      photo: 'Lovisa Engblom'
    }
  },
  {
    year: 2011,
    prize: 'Kemipriset',
    color: 'rött',
    colorClass: 'bg-red-700',
    recipients: 'Dan Shechtman',
    achievement: 'Upptäckten av kvasikristaller',
    title: '"Flyga drake"',
    description: `Metafor: "Det är inte i medvind utan i motvind som draken lyfter."

Bilden heter "Flyga drake" och metaforen syftar på den uppförsbacke som Dan Shechtman arbetade i under stora delar av 80-talet.

Pentagoner och dekagoner i aperiodiska mönster tar vetenskapen om kristaller mot nya höjder. "Sådana djur finns!" Det gäller inte bara att se — utan också att inse!

Konst och vetenskap flätas samman, när kvasikristaller förklaras med gyllene snittet i arabiska mosaiker från medeltiden och med matematik från det antika Grekland.`,
    diplomas: [
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/nobel.png', alt: 'Dan Shechtman Nobeldiplom 2011' },
    ],
    photos: [
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/chestmanprice.jpg', alt: 'Nobelceremonin 2011', caption: 'Nobelceremonin 2011' },
      { src: 'https://cronstrom.net/wp-content/uploads/2018/11/lena_chestman.jpg', alt: 'Lena med Dan Shechtman', caption: 'Lena med Dan Shechtman' },
    ],
    credits: {
      artist: 'Lena Cronström',
      calligrapher: 'Annika Rücker',
      bookbinder: 'Ingemar Dackéus',
      photo: 'Lovisa Engblom'
    }
  }
];

function ImageModal({ image, onClose }: { image: NobelImage; onClose: () => void }) {
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

function NobelYearSection({ data, index }: { data: typeof nobelYears[0], index: number }) {
  const [selectedImage, setSelectedImage] = useState<NobelImage | null>(null);
  const isEven = index % 2 === 0;
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`py-16 ${isEven ? 'bg-white' : 'bg-neutral-50'}`}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Year Header */}
            <div className="flex items-center gap-6 mb-10">
              <span className="text-7xl md:text-8xl font-serif text-neutral-200">{data.year}</span>
              <div>
                <h3 className="text-3xl font-serif text-neutral-900">{data.prize}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-4 h-4 ${data.colorClass} rounded-sm`}></span>
                  <span className="text-sm text-neutral-500">Diplom i {data.color}</span>
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="mb-10 pb-8 border-b border-neutral-200">
              <p className="text-sm uppercase tracking-wide text-neutral-500 mb-2">Pristagare</p>
              <p className="text-xl text-neutral-900">{data.recipients}</p>
              {data.achievement && (
                <p className="text-neutral-600 mt-2 italic">"{data.achievement}"</p>
              )}
            </div>

            {/* Diploma Images */}
            <div className="mb-12">
              <h4 className="text-sm uppercase tracking-wide text-neutral-500 mb-4">Nobeldiplom</h4>
              <div className={`grid gap-6 ${data.diplomas.length === 1 ? 'grid-cols-1 max-w-lg' : data.diplomas.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {data.diplomas.map((diploma, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer overflow-hidden shadow-lg"
                    onClick={() => setSelectedImage(diploma)}
                  >
                    <img 
                      src={diploma.src} 
                      alt={diploma.alt}
                      className="w-full h-auto"
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-neutral-400 mt-4">
                © The Nobel Foundation {data.year} · Artist: {data.credits.artist} · Kalligraf: {data.credits.calligrapher} · Bokbindare: {data.credits.bookbinder}
              </p>
            </div>

            {/* Artwork Description */}
            <div className="mb-12 max-w-3xl">
              <h4 className="text-2xl font-serif text-neutral-900 mb-4">{data.title}</h4>
              <div className="text-neutral-600 leading-relaxed space-y-4">
                {data.description.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Photos with laureates */}
            {data.photos && data.photos.length > 0 && (
              <div>
                <h4 className="text-sm uppercase tracking-wide text-neutral-500 mb-4">Från Nobelceremonin</h4>
                <div className={`grid gap-6 ${data.photos.length === 1 ? 'grid-cols-1 max-w-lg' : data.photos.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {data.photos.map((photo, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer overflow-hidden"
                      onClick={() => setSelectedImage(photo)}
                    >
                      <img 
                        src={photo.src} 
                        alt={photo.alt}
                        className="w-full h-64 object-cover"
                      />
                      {photo.caption && (
                        <p className="text-sm text-neutral-600 mt-2 italic">{photo.caption}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  );
}

export function Nobel() {
  return (
    <section className="min-h-screen bg-white pt-32">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-serif mb-6">Nobel</h1>
          <p className="text-sm uppercase tracking-wide text-neutral-500 mb-8">
            Uppdrag Nobeldiplom · Kungliga Vetenskapsakademien
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
            Jag har fått ett fint hedersuppdrag av Kungliga Vetenskapsakademien, KVA, att under tre års tid 
            måla akvareller till Nobelprisdiplom. 2011 målade jag bilden till kemipristagaren Dan Shechtman 
            och hans upptäckt av kvasikristaller. 2012 målade jag till fysikpristagarna Serge Haroche och 
            David J. Wineland. 2013 målade jag till ekonomipristagarna.
          </p>
          <div className="bg-neutral-50 p-8 border-l-4 border-neutral-900">
            <p className="text-neutral-600 leading-relaxed mb-4">
              Akvarellen är i stående format och finns på vänstersidan i diplomet. På högersidan skriver 
              kalligrafen med gåspennor en text, som går ton i ton med akvarellfärgerna.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Därefter binder bokbindaren in de båda sidorna i pergament (specialbehandlat läder). 
              De olika prisen har alltid samma läderfärg:
            </p>
            <ul className="text-neutral-700 space-y-2">
              <li className="flex items-center gap-3">
                <span className="w-4 h-4 bg-red-700 rounded-sm"></span>
                <span><strong>Rött</strong> för kemi</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-4 h-4 bg-blue-900 rounded-sm"></span>
                <span><strong>Marinblått</strong> för fysik</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-4 h-4 bg-amber-700 rounded-sm"></span>
                <span><strong>Ljust brunt</strong> för ekonomi</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Timeline indicator */}
      <div className="container mx-auto px-6 py-8 border-t border-neutral-200">
        <p className="text-sm uppercase tracking-wide text-neutral-500 text-center">
          Nobeldiplom 2011 – 2013
        </p>
      </div>

      {/* Year Sections */}
      {nobelYears.map((yearData, index) => (
        <NobelYearSection key={yearData.year} data={yearData} index={index} />
      ))}

      {/* Closing */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-neutral-900 text-white"
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-neutral-400 text-sm uppercase tracking-wide mb-4">
            Kungliga Vetenskapsakademien
          </p>
          <p className="text-2xl font-serif max-w-2xl mx-auto">
            "Konst och vetenskap flätas samman"
          </p>
        </div>
      </motion.div>
    </section>
  );
}
