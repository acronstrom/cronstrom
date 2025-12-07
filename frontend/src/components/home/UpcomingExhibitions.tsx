import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { exhibitions as initialExhibitions } from '../../lib/data';
import type { Exhibition } from '../../lib/types';
import { API_BASE } from '../../lib/config';

export function UpcomingExhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  // Filter for current/ongoing exhibitions (is_current flag)
  const currentExhibitions = exhibitions.filter(ex => (ex as any).is_current === true);

  // Filter for upcoming exhibitions (is_upcoming flag, excluding represented/commission)
  const upcomingExhibitions = exhibitions.filter(ex => 
    (ex as any).is_upcoming === true && 
    ex.category !== 'commission' && 
    ex.category !== 'represented'
  );

  if (isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="absolute bottom-8 right-8 z-20 hidden md:block"
    >
      <div className="text-right space-y-6">
        {/* Pågående utställningar */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
            Pågående utställningar
          </p>
          {currentExhibitions.length > 0 ? (
            currentExhibitions.slice(0, 2).map((exhibition, index) => (
              <motion.div
                key={exhibition.id || index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.8 + index * 0.2 }}
                className="mb-1"
              >
                <p className="text-white/70 text-sm font-light">
                  {exhibition.title}
                </p>
                <p className="text-white/40 text-xs">
                  {exhibition.venue || exhibition.location}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-white/30 text-xs italic">
              För tillfället visas inga utställningar – håll utkik efter kommande
            </p>
          )}
        </div>

        {/* Kommande utställningar */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
            Kommande utställningar
          </p>
          {upcomingExhibitions.length > 0 ? (
            upcomingExhibitions.slice(0, 2).map((exhibition, index) => (
              <motion.div
                key={exhibition.id || index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.0 + index * 0.2 }}
                className="mb-1"
              >
                <p className="text-white/70 text-sm font-light">
                  {exhibition.title}
                </p>
                <p className="text-white/40 text-xs">
                  {exhibition.venue || exhibition.location}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-white/30 text-xs italic">
              Inga kommande utställningar för tillfället
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
