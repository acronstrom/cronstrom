import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { exhibitions } from '../../lib/data';

export function UpcomingExhibitions() {
  // Filter for upcoming/current exhibitions
  const currentYear = new Date().getFullYear();
  
  const upcomingExhibitions = exhibitions.filter(ex => {
    if (ex.category === 'kommande') return true;
    const year = parseInt(ex.date || ex.year || '0');
    return year >= currentYear;
  }).slice(0, 2); // Show max 2 for discretion

  if (upcomingExhibitions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="absolute bottom-8 right-8 z-20 hidden md:block"
    >
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
          Aktuellt
        </p>
        {upcomingExhibitions.map((exhibition, index) => (
          <motion.div
            key={exhibition.id || index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.8 + index * 0.2 }}
            className="mb-2 last:mb-0"
          >
            <p className="text-white/70 text-sm font-light">
              {exhibition.title}
            </p>
            <p className="text-white/40 text-xs">
              {exhibition.venue || exhibition.location}
            </p>
          </motion.div>
        ))}
        <Link 
          to="/utstallningar"
          className="inline-block mt-4 text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors border-b border-white/20 hover:border-white/40 pb-0.5"
        >
          Alla utställningar
        </Link>
      </div>
    </motion.div>
  );
}
