import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { artistBio } from '../../lib/data';
import { UpcomingExhibitions } from './UpcomingExhibitions';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen flex items-end justify-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://cronstrom.net/wp-content/uploads/2023/03/Vita-gass-lll-720x1024.jpg"
          alt="Lena Cronström - Vita gäss III" 
          className="w-full h-full object-cover"
        />
        {/* Modern Gradient Overlay: Dark at bottom for text readability, clear at top for art visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80"></div>
      </div>

      {/* Content - Positioned bottom-left for a modern editorial look */}
      <div className="relative z-10 container mx-auto px-6 pb-24 md:pb-32">
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
          
          <div className="flex flex-col sm:flex-row items-start gap-6">
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
        </motion.div>
      </div>

      {/* Upcoming Exhibitions - Discrete overlay in bottom right */}
      <UpcomingExhibitions />
    </section>
  );
}
