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
    <section className="relative h-screen flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://cronstrom.net/wp-content/uploads/2023/03/Vita-gass-lll-720x1024.jpg"
          alt="Lena Cronström - Vita gäss III" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80"></div>
      </div>

      {/* Content - Two column layout */}
      <div className="relative z-10 container mx-auto px-6 pb-16 md:pb-24 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-12">
          
          {/* Left Column - Main content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h2 className="text-sm md:text-base uppercase tracking-[0.3em] text-neutral-300 mb-6 font-medium border-l-2 border-white pl-4">
              {artistBio.tagline}
            </h2>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif text-white mb-8 tracking-tighter leading-none drop-shadow-lg">
              {artistBio.name}
            </h1>
            
            {/* Artist Statement - Frosted Glass (matching exhibitions panel) */}
            <div className="relative max-w-xl mb-10 bg-black/10 backdrop-blur-sm border border-white/5 p-6 md:p-8">
              {/* Decorative corner accent */}
              <div className="absolute top-0 left-0 w-12 h-[2px] bg-white/60"></div>
              <div className="absolute top-0 left-0 w-[2px] h-12 bg-white/60"></div>
              
              <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed italic">
                {artistBio.shortBio}
              </p>
              
              {/* Bottom decorative accent */}
              <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-white/30"></div>
              <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-white/30"></div>
            </div>
            
            {/* Utforska Galleri Button */}
            <button 
              onClick={() => navigate('/galleri')}
              className="group px-10 py-4 bg-white text-black hover:bg-neutral-200 transition-all duration-300 flex items-center gap-3 text-sm uppercase tracking-widest"
            >
              Utforska Galleri
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Right Column - Exhibitions Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="md:max-w-sm"
          >
            {/* Glassmorphic container - more transparent */}
            <div className="bg-black/10 backdrop-blur-sm border border-white/5 p-6 md:p-8 relative">
              {/* Decorative corner accent */}
              <div className="absolute top-0 left-0 w-12 h-[2px] bg-white/60"></div>
              <div className="absolute top-0 left-0 w-[2px] h-12 bg-white/60"></div>
              
              {/* Link to exhibitions page */}
              <button 
                onClick={() => navigate('/utstallningar')}
                className="group mb-6 text-white hover:text-white/80 transition-all duration-300 flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-medium"
              >
                <span className="w-8 h-[1px] bg-white/60 group-hover:w-12 transition-all duration-300"></span>
                Aktuella Utställningar
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>

              {/* Pågående */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-3 font-medium">
                  Pågående
                </p>
                {currentExhibitions.length > 0 ? (
                  currentExhibitions.slice(0, 2).map((exhibition, index) => (
                    <div key={exhibition.id || index} className="mb-3">
                      <p className="text-white text-lg font-serif">{exhibition.title}</p>
                      <p className="text-white/50 text-sm">{exhibition.venue || exhibition.location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/30 text-sm italic">
                    Inga pågående just nu
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-gradient-to-r from-white/20 via-white/10 to-transparent mb-6"></div>

              {/* Kommande */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-3 font-medium">
                  Kommande
                </p>
                {upcomingExhibitions.length > 0 ? (
                  upcomingExhibitions.slice(0, 2).map((exhibition, index) => (
                    <div key={exhibition.id || index} className="mb-3">
                      <p className="text-white text-lg font-serif">{exhibition.title}</p>
                      <p className="text-white/50 text-sm">{exhibition.venue || exhibition.location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/30 text-sm italic">
                    Inga kommande just nu
                  </p>
                )}
              </div>

              {/* Bottom decorative accent */}
              <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-white/30"></div>
              <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-white/30"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
