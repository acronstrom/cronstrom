import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { artistBio as defaultArtistBio, exhibitions as initialExhibitions } from '../../lib/data';
import type { Exhibition } from '../../lib/types';
import { API_BASE } from '../../lib/config';

// Helper to render markdown links [text](url) as clickable links
function MarkdownText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [, linkText, url] = linkMatch;
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
            >
              {linkText}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

export function Hero() {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [siteSettings, setSiteSettings] = useState({
    artistName: defaultArtistBio.name,
    tagline: defaultArtistBio.tagline,
    shortBio: defaultArtistBio.shortBio,
  });

  useEffect(() => {
    loadExhibitions();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/settings`);
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSiteSettings(prev => ({
            artistName: data.settings.artistName || prev.artistName,
            tagline: data.settings.tagline || prev.tagline,
            shortBio: data.settings.shortBio || prev.shortBio,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

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
          is_upcoming: e.is_upcoming,
          start_date: e.start_date,
          end_date: e.end_date,
          description: e.description
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

  // Format date range for display
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return null;
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleDateString('sv-SE', { month: 'short' }).replace('.', '');
      return `${day} ${month}`;
    };
    
    if (startDate && endDate) {
      return `${formatDate(startDate)} – ${formatDate(endDate)}`;
    } else if (startDate) {
      return `Från ${formatDate(startDate)}`;
    } else if (endDate) {
      return `T.o.m. ${formatDate(endDate)}`;
    }
    return null;
  };

  return (
    <section className="relative min-h-screen flex items-center lg:items-end overflow-hidden pt-20 lg:pt-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://cronstrom.net/wp-content/uploads/2023/03/Vita-gass-lll-720x1024.jpg"
          alt="Lena Cronström - Vita gäss III" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 lg:from-black/90 lg:via-black/40 lg:to-transparent"></div>
      </div>

      {/* Content - Two column layout on large screens, stacked on mobile/tablet */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 lg:pb-24 w-full">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 lg:gap-12">
          
          {/* Left Column - Main content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Artist Name - prominent on mobile/tablet */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-serif text-white mb-4 md:mb-6 lg:mb-8 tracking-tighter leading-none drop-shadow-lg">
              {siteSettings.artistName}
            </h1>
            
            {/* Artist Statement - Frosted Glass with Tagline */}
            <div className="relative max-w-xl mb-6 lg:mb-10 bg-black/20 lg:bg-black/10 backdrop-blur-sm border border-white/10 lg:border-white/5 p-4 md:p-6 lg:p-8">
              {/* Decorative corner accent - hidden on mobile/tablet */}
              <div className="hidden lg:block absolute top-0 left-0 w-12 h-[2px] bg-white/60"></div>
              <div className="hidden lg:block absolute top-0 left-0 w-[2px] h-12 bg-white/60"></div>
              
              {/* Tagline */}
              <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] lg:tracking-[0.3em] text-white/70 mb-3 md:mb-4 font-medium">
                {siteSettings.tagline}
              </p>
              
              <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed italic">
                {siteSettings.shortBio}
              </p>
              
              {/* Bottom decorative accent - hidden on mobile/tablet */}
              <div className="hidden lg:block absolute bottom-0 right-0 w-12 h-[2px] bg-white/30"></div>
              <div className="hidden lg:block absolute bottom-0 right-0 w-[2px] h-12 bg-white/30"></div>
            </div>
            
            {/* Utforska Galleri Button */}
            <button 
              onClick={() => navigate('/galleri')}
              className="group px-6 md:px-8 lg:px-10 py-3 md:py-3.5 lg:py-4 bg-white text-black hover:bg-neutral-200 transition-all duration-300 flex items-center gap-2 md:gap-3 text-xs md:text-sm uppercase tracking-widest"
            >
              Utforska Galleri
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform md:w-4 md:h-4" />
            </button>
          </motion.div>

          {/* Right Column - Exhibitions Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full md:max-w-md lg:max-w-sm"
          >
            {/* Glassmorphic container */}
            <div className="bg-black/20 lg:bg-black/10 backdrop-blur-sm border border-white/10 lg:border-white/5 p-4 md:p-6 lg:p-8 relative">
              {/* Decorative corner accent - hidden on mobile/tablet */}
              <div className="hidden lg:block absolute top-0 left-0 w-12 h-[2px] bg-white/60"></div>
              <div className="hidden lg:block absolute top-0 left-0 w-[2px] h-12 bg-white/60"></div>
              
              {/* Link to exhibitions page */}
              <button 
                onClick={() => navigate('/utstallningar')}
                className="group mb-4 lg:mb-6 text-white hover:text-white/80 transition-all duration-300 flex items-center gap-2 md:gap-3 text-sm md:text-base uppercase tracking-[0.15em] lg:tracking-[0.2em] font-medium"
              >
                <span className="w-6 md:w-8 h-[1px] bg-white/60 group-hover:w-10 lg:group-hover:w-12 transition-all duration-300"></span>
                Aktuella Utställningar
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>

              {/* Pågående */}
              <div className="mb-4 lg:mb-6">
                <p className="text-xs md:text-sm uppercase tracking-[0.15em] lg:tracking-[0.2em] text-white/70 mb-2 lg:mb-3 font-medium">
                  Pågående
                </p>
                {currentExhibitions.length > 0 ? (
                  currentExhibitions.slice(0, 2).map((exhibition, index) => {
                    const dateRange = formatDateRange((exhibition as any).start_date, (exhibition as any).end_date);
                    const description = (exhibition as any).description;
                    return (
                      <div key={exhibition.id || index} className="mb-3 lg:mb-4">
                        <p className="text-white text-base md:text-lg lg:text-xl font-serif">{exhibition.title}</p>
                        <p className="text-white/60 text-sm md:text-base">
                          {exhibition.venue || exhibition.location}
                          {dateRange && <span className="text-white/50"> · {dateRange}</span>}
                        </p>
                        {description && (
                          <p className="text-white/50 text-xs md:text-sm mt-1 whitespace-pre-line leading-relaxed">
                            <MarkdownText text={description} />
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-white/30 text-sm md:text-base italic">
                    Inga pågående just nu
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-gradient-to-r from-white/20 via-white/10 to-transparent mb-4 lg:mb-6"></div>

              {/* Kommande */}
              <div>
                <p className="text-xs md:text-sm uppercase tracking-[0.15em] lg:tracking-[0.2em] text-white/70 mb-2 lg:mb-3 font-medium">
                  Kommande
                </p>
                {upcomingExhibitions.length > 0 ? (
                  upcomingExhibitions.slice(0, 2).map((exhibition, index) => {
                    const dateRange = formatDateRange((exhibition as any).start_date, (exhibition as any).end_date);
                    const description = (exhibition as any).description;
                    return (
                      <div key={exhibition.id || index} className="mb-3 lg:mb-4">
                        <p className="text-white text-base md:text-lg lg:text-xl font-serif">{exhibition.title}</p>
                        <p className="text-white/60 text-sm md:text-base">
                          {exhibition.venue || exhibition.location}
                          {dateRange && <span className="text-white/50"> · {dateRange}</span>}
                        </p>
                        {description && (
                          <p className="text-white/50 text-xs md:text-sm mt-1 whitespace-pre-line leading-relaxed">
                            <MarkdownText text={description} />
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-white/30 text-sm md:text-base italic">
                    Inga kommande just nu
                  </p>
                )}
              </div>

              {/* Bottom decorative accent - hidden on mobile/tablet */}
              <div className="hidden lg:block absolute bottom-0 right-0 w-12 h-[2px] bg-white/30"></div>
              <div className="hidden lg:block absolute bottom-0 right-0 w-[2px] h-12 bg-white/30"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
