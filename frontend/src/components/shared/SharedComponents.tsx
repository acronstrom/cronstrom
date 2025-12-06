import { motion } from 'motion/react';
import { Expand } from 'lucide-react';
import type { Artwork } from '../../lib/types';

export const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12 md:mb-16">
    <h2 className="text-4xl font-serif mb-4">{title}</h2>
    {subtitle && <p className="text-neutral-600 max-w-2xl leading-relaxed">{subtitle}</p>}
  </div>
);

export const ArtworkGrid = ({ items, onOpen }: { items: Artwork[], onOpen: (item: Artwork) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {items.map((art, index) => (
      <motion.div
        key={art.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="group cursor-pointer"
        onClick={() => onOpen(art)}
      >
        <div className="relative overflow-hidden aspect-[4/5] bg-neutral-100 mb-4">
          <img 
            src={art.imageUrl} 
            alt={art.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white p-3 rounded-full">
              <Expand size={20} />
            </div>
          </div>
        </div>
        <h3 className="font-serif text-xl group-hover:text-neutral-600 transition-colors">{art.title}</h3>
        <p className="text-neutral-500 text-sm mt-1">{art.medium}, {art.year}</p>
      </motion.div>
    ))}
  </div>
);

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
  </div>
);

export const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <p className="text-neutral-500">{message}</p>
  </div>
);

