import { motion } from 'motion/react';
import { exhibitions } from '../../lib/data';

export function UpcomingExhibitions() {
  const currentYear = new Date().getFullYear();
  
  // Filter for current/ongoing exhibitions
  const currentExhibitions = exhibitions.filter(ex => {
    if (ex.category === 'kommande') {
      const year = parseInt(ex.date || ex.year || '0');
      return year === currentYear;
    }
    return false;
  });

  // Filter for upcoming exhibitions (future)
  const upcomingExhibitions = exhibitions.filter(ex => {
    if (ex.category === 'kommande') {
      const year = parseInt(ex.date || ex.year || '0');
      return year > currentYear;
    }
    return false;
  });

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
