import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Users, ExternalLink } from 'lucide-react';
import { API_BASE } from '../lib/config';

interface EducationItem {
  id?: string;
  institution: string;
  degree: string;
  year: string;
  type: 'education' | 'membership' | 'link';
  url?: string;
}

// Fallback data if API fails
const fallbackStudies = [
  { institution: 'Konstfackskolan', degree: 'Påbörjad konstutbildning', year: '1961', type: 'education' as const },
  { institution: 'Skånska målarskolan', degree: 'För Tage Hansson, Bengt Hansson och Ulf Stålhane', year: '', type: 'education' as const },
  { institution: 'Gerlesborgsskolan', degree: 'För bl.a. George Suttner, Inger Wallerz, Lars Holm och Hasse Karlsson', year: '2005-2015', type: 'education' as const },
];

const fallbackMemberships = [
  { institution: 'Nordvästra Skånes Konstförening', degree: 'NVSK', year: '', type: 'membership' as const },
  { institution: 'Svenska konstnärer', degree: '', year: '', type: 'membership' as const, url: 'https://www.svenskakonstnarer.se' },
  { institution: 'Nordiska Akvarellsällskapet', degree: '', year: '', type: 'membership' as const, url: 'https://www.nordicwatercolour.org' },
];

export function Education() {
  const [educationData, setEducationData] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch(`${API_BASE}/education`);
        if (response.ok) {
          const data = await response.json();
          if (data.education && data.education.length > 0) {
            setEducationData(data.education);
          } else {
            // Use fallback if DB is empty
            setEducationData([...fallbackStudies, ...fallbackMemberships]);
          }
        } else {
          setEducationData([...fallbackStudies, ...fallbackMemberships]);
        }
      } catch (err) {
        console.error('Failed to fetch education:', err);
        setEducationData([...fallbackStudies, ...fallbackMemberships]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEducation();
  }, []);

  const studies = educationData.filter(item => item.type === 'education');
  const memberships = educationData.filter(item => item.type === 'membership');
  const links = educationData.filter(item => item.type === 'link');

  // Find earliest year for the timeline
  const earliestYear = studies.reduce((min, study) => {
    const year = parseInt(study.year?.split('-')[0] || '9999');
    return year < min ? year : min;
  }, 9999);
  const displayYear = earliestYear < 9999 ? earliestYear : 1961;

  if (isLoading) {
    return (
      <section className="min-h-screen bg-white pt-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white pt-32">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-serif mb-6">Utbildning</h1>
          <p className="text-sm uppercase tracking-wide text-neutral-500 mb-8">
            Studier & Medlemskap
          </p>
        </motion.div>
      </div>

      {/* Studies Section */}
      {studies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-neutral-50"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-3xl font-serif text-neutral-900">Studier</h2>
              </div>

              <div className="space-y-1">
                {studies.map((study, index) => (
                  <motion.div
                    key={study.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="bg-white p-6 border-l-4 border-amber-400 hover:border-amber-500 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-serif text-neutral-900">
                          {study.institution}
                        </h3>
                        {study.degree && (
                          <p className="text-neutral-600 mt-1">{study.degree}</p>
                        )}
                      </div>
                      {study.year && (
                        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full whitespace-nowrap">
                          {study.year}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Memberships Section */}
      {memberships.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-serif text-neutral-900">Medlem av</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {memberships.map((membership, index) => (
                  <motion.div
                    key={membership.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-neutral-50 p-6 rounded-lg hover:bg-neutral-100 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-serif text-neutral-900 group-hover:text-blue-600 transition-colors">
                          {membership.institution}
                        </h3>
                        {membership.degree && (
                          <p className="text-neutral-500 text-sm mt-1">
                            {membership.degree}
                          </p>
                        )}
                      </div>
                      {membership.url && (
                        <a 
                          href={membership.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-blue-600 transition-colors p-2"
                          aria-label={`Besök ${membership.institution}`}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline Visual */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/80 text-sm uppercase tracking-wide mb-4">
            Konstnärlig utbildning sedan
          </p>
          <p className="text-white text-6xl md:text-8xl font-serif">
            {displayYear}
          </p>
        </div>
      </motion.div>

      {/* Links Section */}
      {links.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-neutral-900 text-white"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-serif mb-8">Länkar</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {links.map((link, index) => (
                  <span key={link.id || index}>
                    {index > 0 && <span className="text-neutral-700 mr-6">•</span>}
                    <a 
                      href={link.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-2"
                    >
                      <span>{link.institution}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Show links section even without DB data */}
      {links.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-neutral-900 text-white"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-serif mb-8">Länkar</h2>
              <div className="flex flex-wrap justify-center gap-6">
                <a 
                  href="https://www.nordicwatercolour.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>Nordiska Akvarell Sällskapet</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <span className="text-neutral-700">•</span>
                <a 
                  href="https://www.bus.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>BUS</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <span className="text-neutral-700">•</span>
                <a 
                  href="https://www.svenskakonstnarer.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>Svenska Konstnärer</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
