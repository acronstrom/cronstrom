import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../lib/config';
import type { Exhibition } from '../../lib/types';

interface PopupSettings {
  enabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  showCurrentExhibitions: boolean;
  showUpcomingExhibitions: boolean;
}

const POPUP_STORAGE_KEY = 'cronstrom_popup_seen';

export function ExhibitionPopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<PopupSettings | null>(null);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPopupData();
  }, []);

  const loadPopupData = async () => {
    try {
      // Check if user has already seen the popup
      const hasSeenPopup = localStorage.getItem(POPUP_STORAGE_KEY);
      if (hasSeenPopup) {
        setIsLoading(false);
        return;
      }

      // Load popup settings
      const settingsResponse = await fetch(`${API_BASE}/settings`);
      const settingsData = await settingsResponse.json();
      
      const popupEnabled = settingsData.settings?.popupEnabled === 'true';
      if (!popupEnabled) {
        setIsLoading(false);
        return;
      }

      const popupSettings: PopupSettings = {
        enabled: popupEnabled,
        title: settingsData.settings?.popupTitle || 'Kommande utställningar',
        description: settingsData.settings?.popupDescription || '',
        buttonText: settingsData.settings?.popupButtonText || 'Se alla utställningar',
        showCurrentExhibitions: settingsData.settings?.popupShowCurrent !== 'false',
        showUpcomingExhibitions: settingsData.settings?.popupShowUpcoming !== 'false',
      };
      setSettings(popupSettings);

      // Load exhibitions
      const exhibitionsResponse = await fetch(`${API_BASE}/exhibitions`);
      const exhibitionsData = await exhibitionsResponse.json();
      
      if (exhibitionsData.exhibitions && exhibitionsData.exhibitions.length > 0) {
        const mapped = exhibitionsData.exhibitions.map((e: any) => ({
          id: e.id.toString(),
          title: e.title,
          venue: e.venue,
          location: e.venue,
          date: e.date,
          year: e.date,
          category: e.category,
          description: e.description,
          imageUrl: e.image_url,
          is_current: e.is_current,
          is_upcoming: e.is_upcoming,
          start_date: e.start_date,
          end_date: e.end_date,
        }));
        
        // Filter exhibitions based on settings
        const relevantExhibitions = mapped.filter((ex: any) => {
          if (ex.category === 'commission' || ex.category === 'represented') {
            return false;
          }
          if (popupSettings.showCurrentExhibitions && ex.is_current) return true;
          if (popupSettings.showUpcomingExhibitions && ex.is_upcoming) return true;
          return false;
        });

        setExhibitions(relevantExhibitions);

        // Only show popup if there are exhibitions to display
        if (relevantExhibitions.length > 0) {
          // Small delay before showing popup for better UX
          setTimeout(() => setIsOpen(true), 1500);
        }
      }
    } catch (err) {
      console.error('Failed to load popup data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Mark popup as seen
    localStorage.setItem(POPUP_STORAGE_KEY, new Date().toISOString());
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (isLoading || !settings || exhibitions.length === 0) {
    return null;
  }

  const currentExhibitions = exhibitions.filter((ex: any) => ex.is_current);
  const upcomingExhibitions = exhibitions.filter((ex: any) => ex.is_upcoming);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors z-10"
              aria-label="Stäng"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="bg-neutral-900 text-white px-6 py-8 md:px-8 md:py-10">
              <h2 className="font-serif text-2xl md:text-3xl mb-2">{settings.title}</h2>
              {settings.description && (
                <p className="text-white/70 text-sm md:text-base">{settings.description}</p>
              )}
            </div>

            {/* Content */}
            <div className="px-6 py-6 md:px-8 md:py-8 space-y-6">
              {/* Current exhibitions */}
              {settings.showCurrentExhibitions && currentExhibitions.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-4">
                    Pågående utställningar
                  </h3>
                  <div className="space-y-4">
                    {currentExhibitions.slice(0, 2).map((exhibition: any) => (
                      <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming exhibitions */}
              {settings.showUpcomingExhibitions && upcomingExhibitions.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-4">
                    Kommande utställningar
                  </h3>
                  <div className="space-y-4">
                    {upcomingExhibitions.slice(0, 3).map((exhibition: any) => (
                      <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 md:px-8 md:pb-8">
              <Link
                to="/utstallningar"
                onClick={handleClose}
                className="flex items-center justify-center gap-2 w-full bg-neutral-900 text-white px-6 py-4 text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                {settings.buttonText}
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ExhibitionCard({ exhibition }: { exhibition: any }) {
  const formatDate = (startDate: string, endDate: string) => {
    if (!startDate) return exhibition.date;
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const startFormatted = start.toLocaleDateString('sv-SE', options);
    
    if (end) {
      const endFormatted = end.toLocaleDateString('sv-SE', options);
      return `${startFormatted} – ${endFormatted}`;
    }
    
    return startFormatted;
  };

  return (
    <div className="group border border-neutral-200 p-4 hover:border-neutral-300 transition-colors">
      <h4 className="font-serif text-lg mb-2 group-hover:text-neutral-600 transition-colors">
        {exhibition.title}
      </h4>
      <div className="flex flex-col gap-1 text-sm text-neutral-500">
        {exhibition.venue && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="flex-shrink-0" />
            <span>{exhibition.venue}</span>
          </div>
        )}
        {(exhibition.start_date || exhibition.date) && (
          <div className="flex items-center gap-2">
            <Calendar size={14} className="flex-shrink-0" />
            <span>{formatDate(exhibition.start_date, exhibition.end_date)}</span>
          </div>
        )}
      </div>
      {exhibition.description && (
        <p className="mt-3 text-sm text-neutral-600 line-clamp-2">
          {exhibition.description}
        </p>
      )}
    </div>
  );
}
