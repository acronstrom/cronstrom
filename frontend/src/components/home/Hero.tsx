import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { artistBio, exhibitions as initialExhibitions } from '../../lib/data';
import type { Exhibition } from '../../lib/types';
import { API_BASE } from '../../lib/config';

export function Hero() {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    try {
      const response = await fetch(`${API_BASE}/exhibitions`);
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
          is_current: e.is_current,
          is_upcoming: e.is_upcoming
        }));
        setExhibitions(mapped);
      } else {
        setExhibitions(initialExhibitions);
      }
    } catch (err) {
      setExhibitions(initialExhibitions);
    }
  };

  const currentExhibitions = exhibitions.filter(ex => (ex as any).is_current === true);
  const upcomingExhibitions = exhibitions.filter(ex => 
    (ex as any).is_upcoming === true && 
    ex.category !== 'commission' && 
    ex.category !== 'represented'
  );

  return (
    <section className="relative h-screen flex items-end justify-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://cronstrom.net/wp-content/uploads/2023/03/Vita-gass-lll-720x1024.jpg"
          alt="Lena Cronström - Vita gäss III" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h2 className="text-sm md:text-base uppercase tracking-[0.3em] text-neutral-300 mb-6 font-medium border-l-2 border-white pl-4">
            {artistBio.tagline}
          </h2>
          <h1 className="text-6xl md:text-9xl font-serif text-white mb-8 tracking-tighter leading-none drop-shadow-lg">
            {artistBio.name}
          </h1>
          <p className="max-w-xl text-neutral-200 mb-12 text-lg md:text-xl font-light leading-relaxed drop-shadow-md">
            {artistBio.shortBio}
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-12">
            <button 
              onClick={() => navigate('/galleri')}
              className="group px-10 py-4 bg-white text-black hover:bg-neutral-200 transition-all duration-300 flex items-center gap-3 text-sm uppercase tracking-widest"
            >
              Se Samling
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/utstallningar')}
              className="group px-8 py-4 text-white border-b border-white/30 hover:border-white transition-all duration-300 flex items-center gap-2 text-sm uppercase tracking-widest"
            >
              Aktuella Utställningar
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>

          {/* Exhibition Info - Below buttons with same underline style */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row gap-8 sm:gap-16"
          >
            {/* Pågående */}
            <div className="group">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mb-3 border-b border-white/20 pb-2">
                Pågående Utställningar
              </p>
              {currentExhibitions.length > 0 ? (
                currentExhibitions.slice(0, 2).map((exhibition, index) => (
                  <div key={exhibition.id || index} className="mb-2">
                    <p className="text-white/80 text-sm">{exhibition.title}</p>
                    <p className="text-white/40 text-xs">{exhibition.venue || exhibition.location}</p>
                  </div>
                ))
              ) : (
                <p className="text-white/30 text-xs max-w-[200px]">
                  Inga pågående utställningar just nu
                </p>
              )}
            </div>

            {/* Kommande */}
            <div className="group">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mb-3 border-b border-white/20 pb-2">
                Kommande Utställningar
              </p>
              {upcomingExhibitions.length > 0 ? (
                upcomingExhibitions.slice(0, 2).map((exhibition, index) => (
                  <div key={exhibition.id || index} className="mb-2">
                    <p className="text-white/80 text-sm">{exhibition.title}</p>
                    <p className="text-white/40 text-xs">{exhibition.venue || exhibition.location}</p>
                  </div>
                ))
              ) : (
                <p className="text-white/30 text-xs max-w-[200px]">
                  Inga kommande utställningar just nu
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
