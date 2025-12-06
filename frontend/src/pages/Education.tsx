import { motion } from 'motion/react';
import { GraduationCap, Users, ExternalLink } from 'lucide-react';

const studies = [
  {
    year: '1961',
    institution: 'Konstfackskolan',
    location: 'Stockholm',
    description: 'Påbörjad konstutbildning på dåvarande Konstfackskolan'
  },
  {
    year: '',
    institution: 'Skånska målarskolan',
    location: '',
    description: 'För Tage Hansson, Bengt Hansson och Ulf Stålhane'
  },
  {
    year: '2005-2015',
    institution: 'Gerlesborgsskolan',
    location: '',
    description: 'För bl.a. George Suttner, Inger Wallerz, Lars Holm och Hasse Karlsson'
  },
  {
    year: '2003-2005',
    institution: 'Lars Björklund',
    location: 'Halmstad',
    description: 'Deltagande i "öppen ateljé"'
  },
  {
    year: '',
    institution: 'Roy Evertsens målarkurs',
    location: 'Landskrona',
    description: ''
  },
  {
    year: '',
    institution: 'Östra Grevie Folkhögskola',
    location: '',
    description: 'Benkt Engquist / Birger Hammarstedt; olika måleri och bildanalyskurser'
  },
  {
    year: '',
    institution: 'Kävesta Folkhögskola',
    location: 'Örebro',
    description: ''
  },
  {
    year: '',
    institution: 'Sundsgårdens Folkhögskola',
    location: '',
    description: 'Stig Morin'
  }
];

const memberships = [
  {
    name: 'Nordvästra Skånes Konstförening',
    abbreviation: 'NVSK',
    url: ''
  },
  {
    name: 'Svenska konstnärer',
    abbreviation: '',
    url: 'https://www.svenskakonstnarer.se'
  },
  {
    name: 'Nordiska Akvarellsällskapet',
    abbreviation: '',
    url: 'https://www.nordicwatercolour.org'
  },
  {
    name: 'BUS',
    abbreviation: 'Bildkonst upphovsrätt i Sverige',
    url: 'https://www.bus.se'
  }
];

export function Education() {
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
                  key={index}
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
                        {study.location && (
                          <span className="text-neutral-400 font-normal text-base ml-2">
                            {study.location}
                          </span>
                        )}
                      </h3>
                      {study.description && (
                        <p className="text-neutral-600 mt-1">{study.description}</p>
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

      {/* Memberships Section */}
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
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-neutral-50 p-6 rounded-lg hover:bg-neutral-100 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-serif text-neutral-900 group-hover:text-blue-600 transition-colors">
                        {membership.name}
                      </h3>
                      {membership.abbreviation && (
                        <p className="text-neutral-500 text-sm mt-1">
                          {membership.abbreviation}
                        </p>
                      )}
                    </div>
                    {membership.url && (
                      <a 
                        href={membership.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-blue-600 transition-colors p-2"
                        aria-label={`Besök ${membership.name}`}
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
            1961
          </p>
        </div>
      </motion.div>

      {/* Links Section */}
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
    </section>
  );
}
