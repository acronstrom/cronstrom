import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { exhibitions as initialExhibitions } from '../lib/data';
import type { Exhibition } from '../lib/types';

function ExhibitionItem({ exhibition }: { exhibition: Exhibition }) {
  const displayTitle = exhibition.title
    .replace(/^Separatutställning$/, '')
    .replace(/^Samlingsutställning$/, '')
    .trim();
  
  const venue = exhibition.venue || exhibition.location || '';
  const year = exhibition.date || exhibition.year || '';
  
  return (
    <div className="py-3 border-b border-neutral-100 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
        <span className="text-neutral-500 text-sm min-w-[90px] tabular-nums">
          {year}
        </span>
        <div className="flex-1">
          {displayTitle ? (
            <>
              <span className="text-neutral-900 font-medium">{displayTitle}</span>
              {venue && <span className="text-neutral-400">, </span>}
            </>
          ) : null}
          <span className="text-neutral-600">{venue}</span>
        </div>
      </div>
    </div>
  );
}

function ExhibitionSection({ 
  title, 
  count,
  items,
  accentColor = 'bg-neutral-900'
}: { 
  title: string, 
  count: number,
  items: Exhibition[],
  accentColor?: string
}) {
  if (items.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-neutral-900">
        <div className={`w-3 h-3 ${accentColor}`} />
        <h3 className="text-lg font-medium tracking-wide uppercase">
          {title}
        </h3>
        <span className="text-neutral-400 text-sm ml-auto">
          {count} utställningar
        </span>
      </div>
      
      {/* Exhibition List */}
      <div className="pl-7">
        {items.map((ex, i) => (
          <ExhibitionItem key={ex.id || i} exhibition={ex} />
        ))}
      </div>
    </motion.div>
  );
}

export function Exhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/exhibitions');
      const data = await response.json();
      
      if (data.exhibitions && data.exhibitions.length > 0) {
        const mapped = data.exhibitions.map((e: any) => ({
          id: e.id.toString(),
          title: e.title,
          venue: e.venue,
          location: e.venue,
          date: e.date,
          year: e.date,
          category: e.category,
          description: e.description,
          is_current: e.is_current,
          is_upcoming: e.is_upcoming
        }));
        setExhibitions(mapped);
      } else {
        setExhibitions(initialExhibitions);
      }
    } catch (err) {
      setExhibitions(initialExhibitions);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort function - latest first (descending by year/date)
  const sortByDateDesc = (a: Exhibition, b: Exhibition) => {
    const yearA = parseInt(a.date || a.year || '0');
    const yearB = parseInt(b.date || b.year || '0');
    return yearB - yearA;
  };

  // Filter and sort exhibitions by flags or category
  const currentExhibitions = exhibitions
    .filter(e => (e as any).is_current === true)
    .sort(sortByDateDesc);
  const upcomingExhibitions = exhibitions
    .filter(e => 
      (e as any).is_upcoming === true && 
      e.category !== 'commission' && 
      e.category !== 'represented'
    )
    .sort(sortByDateDesc);
  const representerad = exhibitions
    .filter(e => e.category === 'commission' || e.category === 'represented')
    .sort(sortByDateDesc);
  const separat = exhibitions
    .filter(e => e.category === 'separat')
    .sort(sortByDateDesc);
  const samling = exhibitions
    .filter(e => e.category === 'samling')
    .sort(sortByDateDesc);
  const jury = exhibitions
    .filter(e => e.category === 'jury')
    .sort(sortByDateDesc);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-neutral-50 pt-32 pb-24">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-neutral-200 rounded w-64 mx-auto mb-6"></div>
            <div className="h-4 bg-neutral-100 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-50 pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif mb-6">
            Utställningar
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            En resa genom tre decennier av konstnärligt skapande — 
            från intima gallerier i Skåne till Kungliga Vetenskapsakademien i Stockholm.
          </p>
        </motion.div>

        {/* Current & Upcoming Exhibitions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 grid md:grid-cols-2 gap-8"
        >
          {/* Pågående utställningar */}
          <div className="bg-white p-8 border-l-4 border-amber-500">
            <h2 className="text-sm font-medium tracking-wide uppercase text-neutral-500 mb-4">
              Pågående utställningar
            </h2>
            {currentExhibitions.length > 0 ? (
              <div className="space-y-4">
                {currentExhibitions.map((ex, i) => (
                  <div key={ex.id || i}>
                    <h3 className="text-xl font-serif text-neutral-900 mb-1">
                      {ex.title}
                    </h3>
                    <p className="text-neutral-600">
                      {ex.venue || ex.location}
                      {(ex.date || ex.year) && (
                        <span className="text-neutral-500"> · {ex.date || ex.year}</span>
                      )}
                    </p>
                    {ex.description && (
                      <p className="text-neutral-500 text-sm mt-2 whitespace-pre-line">{ex.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 italic">
                För tillfället visas inga utställningar – håll utkik efter kommande
              </p>
            )}
          </div>

          {/* Kommande utställningar */}
          <div className="bg-white p-8 border-l-4 border-neutral-300">
            <h2 className="text-sm font-medium tracking-wide uppercase text-neutral-500 mb-4">
              Kommande utställningar
            </h2>
            {upcomingExhibitions.length > 0 ? (
              <div className="space-y-4">
                {upcomingExhibitions.map((ex, i) => (
                  <div key={ex.id || i}>
                    <h3 className="text-xl font-serif text-neutral-900 mb-1">
                      {ex.title}
                    </h3>
                    <p className="text-neutral-600">
                      {ex.venue || ex.location}
                      {(ex.date || ex.year) && (
                        <span className="text-neutral-500"> · {ex.date || ex.year}</span>
                      )}
                    </p>
                    {ex.description && (
                      <p className="text-neutral-500 text-sm mt-2 whitespace-pre-line">{ex.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 italic">
                Inga kommande utställningar för tillfället
              </p>
            )}
          </div>
        </motion.div>

        {/* Featured: Uppdrag & Representerad */}
        {representerad.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 bg-white p-8 md:p-12 border-l-4 border-neutral-900"
          >
            <h2 className="text-sm font-medium tracking-wide uppercase text-neutral-500 mb-6">
              Uppdrag & Representerad
            </h2>
            <div className="space-y-6">
              {representerad.map((ex, i) => (
                <div key={ex.id || i}>
                  <h3 className="text-2xl font-serif text-neutral-900 mb-1">
                    {ex.title}
                  </h3>
                  <p className="text-neutral-600">
                    {ex.venue || ex.location}
                    {(ex.date || ex.year) && (
                      <span className="text-neutral-500"> · {ex.date || ex.year}</span>
                    )}
                  </p>
                  {ex.description && (
                    <p className="text-neutral-500 text-sm mt-2 whitespace-pre-line">{ex.description}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Exhibition Sections */}
        <div className="max-w-4xl">
          <ExhibitionSection 
            title="Separatutställningar" 
            count={separat.length}
            items={separat}
            accentColor="bg-neutral-900"
          />
          
          <ExhibitionSection 
            title="Jurybedömda utställningar" 
            count={jury.length}
            items={jury}
            accentColor="bg-neutral-700"
          />
          
          <ExhibitionSection 
            title="Samlingsutställningar" 
            count={samling.length}
            items={samling}
            accentColor="bg-neutral-500"
          />
        </div>

        {/* Footer quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 pt-12 border-t border-neutral-200 text-center max-w-2xl mx-auto"
        >
          <p className="text-neutral-500 italic font-serif text-lg">
            "Varje utställning är ett samtal mellan konstnär och betraktare"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
