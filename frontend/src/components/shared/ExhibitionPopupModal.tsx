import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../lib/config';
import type { Exhibition } from '../../lib/types';
import { sanitizePopupHtml, isPopupHtmlEmpty } from '../../lib/sanitizePopupHtml';
import { FormattedExhibitionDescription } from './FormattedExhibitionDescription';

interface PopupSettings {
  enabled: boolean;
  title: string;
  description: string;
  bodyHtml: string;
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
      const hasSeenPopup = localStorage.getItem(POPUP_STORAGE_KEY);
      if (hasSeenPopup) {
        setIsLoading(false);
        return;
      }

      const settingsResponse = await fetch(`${API_BASE}/settings`);
      const settingsData = await settingsResponse.json();

      const popupEnabled = settingsData.settings?.popupEnabled === 'true';
      if (!popupEnabled) {
        setIsLoading(false);
        return;
      }

      const rawBody = settingsData.settings?.popupBodyHtml || '';
      const bodyHtml = sanitizePopupHtml(rawBody);
      const hasCustomBody = !isPopupHtmlEmpty(bodyHtml);

      const popupSettings: PopupSettings = {
        enabled: popupEnabled,
        title: settingsData.settings?.popupTitle || 'Kommande utställningar',
        description: settingsData.settings?.popupDescription || '',
        bodyHtml,
        buttonText: settingsData.settings?.popupButtonText || 'Se alla utställningar',
        showCurrentExhibitions: settingsData.settings?.popupShowCurrent !== 'false',
        showUpcomingExhibitions: settingsData.settings?.popupShowUpcoming !== 'false',
      };

      const exhibitionsResponse = await fetch(`${API_BASE}/exhibitions`);
      const exhibitionsData = await exhibitionsResponse.json();

      let relevantExhibitions: Exhibition[] = [];

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

        relevantExhibitions = mapped.filter((ex: any) => {
          if (ex.category === 'commission' || ex.category === 'represented') {
            return false;
          }
          if (popupSettings.showCurrentExhibitions && ex.is_current) return true;
          if (popupSettings.showUpcomingExhibitions && ex.is_upcoming) return true;
          return false;
        });
      }

      if (!hasCustomBody && relevantExhibitions.length === 0) {
        setIsLoading(false);
        return;
      }

      setSettings(popupSettings);
      setExhibitions(relevantExhibitions);

      setTimeout(() => setIsOpen(true), 1500);
    } catch (err) {
      console.error('Failed to load popup data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(POPUP_STORAGE_KEY, new Date().toISOString());
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

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

  if (isLoading || !settings) {
    return null;
  }

  const currentExhibitions = exhibitions.filter((ex: any) => ex.is_current);
  const upcomingExhibitions = exhibitions.filter((ex: any) => ex.is_upcoming);
  const showCurrentBlock =
    settings.showCurrentExhibitions && currentExhibitions.length > 0;
  const showUpcomingBlock =
    settings.showUpcomingExhibitions && upcomingExhibitions.length > 0;
  const hasRichBody = !isPopupHtmlEmpty(settings.bodyHtml);
  const showHeaderDescription = Boolean(settings.description?.trim());

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
            className="relative bg-white w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-xl border border-neutral-200/70 shadow-2xl shadow-neutral-900/10"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-2.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors z-10"
              aria-label="Stäng"
            >
              <X size={20} strokeWidth={1.75} />
            </button>

            <div className="px-7 pt-10 pb-0 md:px-9 md:pt-11 pr-14">
              <header className="space-y-3">
                <h2 className="font-serif text-2xl md:text-[1.75rem] leading-snug text-neutral-900 tracking-tight text-balance">
                  {settings.title}
                </h2>
                {showHeaderDescription && (
                  <p className="text-neutral-500 text-sm md:text-[0.9375rem] leading-relaxed max-w-prose">
                    {settings.description}
                  </p>
                )}
              </header>
            </div>

            <div className="px-7 py-8 md:px-9 md:py-9 space-y-10">
              {hasRichBody && (
                <div
                  className="popup-rte-content text-neutral-800 text-[0.9375rem] md:text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: settings.bodyHtml }}
                />
              )}

              {showCurrentBlock && (
                <section className="popup-exhibition-section space-y-5">
                  <h3 className="font-sans text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-medium">
                    Pågående utställningar
                  </h3>
                  <div className="space-y-3">
                    {currentExhibitions.slice(0, 2).map((exhibition: any) => (
                      <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
                    ))}
                  </div>
                </section>
              )}

              {showUpcomingBlock && (
                <section className="popup-exhibition-section space-y-5">
                  <h3 className="font-sans text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-medium">
                    Kommande utställningar
                  </h3>
                  <div className="space-y-3">
                    {upcomingExhibitions.slice(0, 3).map((exhibition: any) => (
                      <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="px-7 pb-8 md:px-9 md:pb-9 pt-0">
              <Link
                to="/utstallningar"
                onClick={handleClose}
                className="flex items-center justify-center gap-2 w-full border border-neutral-200/90 bg-neutral-50/50 text-neutral-900 px-6 py-3.5 text-sm uppercase tracking-[0.12em] hover:border-neutral-300 hover:bg-neutral-100/80 transition-colors rounded-md"
              >
                {settings.buttonText}
                <ArrowRight size={16} className="text-neutral-500" />
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
    <article className="group rounded-lg bg-neutral-50/90 px-5 py-4 md:px-5 md:py-5 ring-1 ring-inset ring-neutral-200/60 hover:ring-neutral-300/80 transition-[box-shadow,ring-color]">
      <h4 className="font-serif text-[1.125rem] leading-snug text-neutral-900 mb-3 group-hover:text-neutral-700 transition-colors">
        {exhibition.title}
      </h4>
      <div className="flex flex-col gap-2 text-sm text-neutral-500">
        {exhibition.venue && (
          <div className="flex items-start gap-2.5">
            <MapPin size={15} className="flex-shrink-0 mt-0.5 text-neutral-400" strokeWidth={1.75} />
            <span className="leading-snug">{exhibition.venue}</span>
          </div>
        )}
        {(exhibition.start_date || exhibition.date) && (
          <div className="flex items-start gap-2.5">
            <Calendar size={15} className="flex-shrink-0 mt-0.5 text-neutral-400" strokeWidth={1.75} />
            <span className="leading-snug tabular-nums">
              {formatDate(exhibition.start_date, exhibition.end_date)}
            </span>
          </div>
        )}
      </div>
      {exhibition.description && (
        <FormattedExhibitionDescription
          text={exhibition.description}
          className="mt-3.5 border-t border-neutral-200/70 pt-3.5"
        />
      )}
    </article>
  );
}
