import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit2, FileText, Eye, ExternalLink } from 'lucide-react';
import { artistBio } from '../../lib/data';

const pages = [
  { id: '1', title: 'Startsida', path: '/', description: 'Huvudsidan med hero och introduktion' },
  { id: '2', title: 'Galleri', path: '/galleri', description: 'Konstverksgalleri' },
  { id: '3', title: 'Utställningar', path: '/utstallningar', description: 'Lista över utställningar' },
  { id: '4', title: 'Nobel', path: '/nobel', description: 'Nobelpriset och relaterade verk' },
  { id: '5', title: 'Glasfusing', path: '/glasfusing', description: 'Glasfusingkonst' },
  { id: '6', title: 'Textilmåleri', path: '/textilmaleri', description: 'Textilmåleriet' },
  { id: '7', title: 'Utbildning', path: '/utbildning', description: 'Utbildning och kurser' },
  { id: '8', title: 'Kontakt', path: '/kontakt', description: 'Kontaktformulär och information' },
];

export function PagesManager() {
  const [bio, setBio] = useState(artistBio);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-neutral-500 hover:text-neutral-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-serif">Hantera Sidor</h1>
          </div>
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 px-3 py-2 text-sm border border-neutral-200 rounded hover:border-neutral-400 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Visa webbplats
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Artist Bio */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-medium">Konstnärsprofil</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Information som visas på flera sidor
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Namn</label>
              <input
                type="text"
                value={bio.name}
                onChange={(e) => setBio({ ...bio, name: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Tagline</label>
              <input
                type="text"
                value={bio.tagline}
                onChange={(e) => setBio({ ...bio, tagline: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Kort biografi</label>
              <textarea
                value={bio.shortBio}
                onChange={(e) => setBio({ ...bio, shortBio: e.target.value })}
                rows={3}
                className="w-full border border-neutral-300 rounded px-3 py-2 focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Fullständig biografi</label>
              <textarea
                value={bio.fullBio}
                onChange={(e) => setBio({ ...bio, fullBio: e.target.value })}
                rows={6}
                className="w-full border border-neutral-300 rounded px-3 py-2 focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
            <button className="bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800 transition-colors">
              Spara ändringar
            </button>
          </div>
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-medium flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Webbsidor
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {pages.length} sidor
            </p>
          </div>

          <div className="divide-y divide-neutral-100">
            {pages.map((page) => (
              <div key={page.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{page.title}</h3>
                    <p className="text-sm text-neutral-500">{page.description}</p>
                    <p className="text-xs text-neutral-400 mt-1">{page.path}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-neutral-500 text-sm">
          Obs: Ändringar sparas i demo-läge. Anslut MongoDB för permanent lagring.
        </p>
      </main>
    </div>
  );
}

