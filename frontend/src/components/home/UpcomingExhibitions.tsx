import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { exhibitions } from '../../lib/data';

export function UpcomingExhibitions() {
  // Filter for upcoming/current exhibitions (kommande category or future dates)
  const currentYear = new Date().getFullYear();
  
  const upcomingExhibitions = exhibitions.filter(ex => {
    // Check if it's marked as 'kommande' or has a current/future year
    if (ex.category === 'kommande') return true;
    const year = parseInt(ex.date || ex.year || '0');
    return year >= currentYear;
  }).slice(0, 3); // Show max 3

  // If no upcoming exhibitions, don't render the section
  if (upcomingExhibitions.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-neutral-900 text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Aktuellt</h2>
          <p className="text-neutral-400 max-w-xl mx-auto">
            Kommande och pågående utställningar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {upcomingExhibitions.map((exhibition, index) => (
            <motion.div
              key={exhibition.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-2 text-amber-400 mb-4">
                <Calendar size={18} />
                <span className="text-sm uppercase tracking-wider">
                  {exhibition.date || exhibition.year || 'Kommande'}
                </span>
              </div>
              
              <h3 className="text-2xl font-serif mb-3 group-hover:text-amber-200 transition-colors">
                {exhibition.title}
              </h3>
              
              <div className="flex items-start gap-2 text-neutral-400 mb-4">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-sm">
                  {exhibition.venue || exhibition.location}
                </span>
              </div>
              
              {exhibition.description && (
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {exhibition.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link 
            to="/utstallningar" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <span className="uppercase tracking-wider text-sm">Se alla utställningar</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

