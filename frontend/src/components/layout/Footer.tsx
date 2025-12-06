import { Link } from 'react-router-dom';
import { artistBio } from '../../lib/data';
import { Instagram, Facebook, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-50 pt-20 pb-10 border-t border-neutral-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl">{artistBio.name}</h3>
            <p className="text-neutral-500 max-w-xs text-sm leading-relaxed">
              {artistBio.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-medium mb-2 uppercase tracking-wider text-xs text-neutral-400">Utforska</h4>
            <Link to="/galleri" className="text-left hover:text-neutral-500 transition-colors">Galleri</Link>
            <Link to="/utstallningar" className="text-left hover:text-neutral-500 transition-colors">Utställningar</Link>
            <Link to="/nobel" className="text-left hover:text-neutral-500 transition-colors">Nobel</Link>
            <Link to="/utbildning" className="text-left hover:text-neutral-500 transition-colors">Utbildning</Link>
            <Link to="/kontakt" className="text-left hover:text-neutral-500 transition-colors">Kontakt</Link>
          </div>

          {/* Contact */}
          <div className="space-y-4">
             <h4 className="font-medium mb-2 uppercase tracking-wider text-xs text-neutral-400">Följ</h4>
             <div className="flex space-x-4">
               <a href="#" className="p-2 bg-white rounded-full hover:bg-neutral-100 border border-neutral-100 transition-colors">
                 <Instagram size={18} />
               </a>
               <a href="#" className="p-2 bg-white rounded-full hover:bg-neutral-100 border border-neutral-100 transition-colors">
                 <Facebook size={18} />
               </a>
               <a href="mailto:hello@cronstrom.net" className="p-2 bg-white rounded-full hover:bg-neutral-100 border border-neutral-100 transition-colors">
                 <Mail size={18} />
               </a>
             </div>
             <p className="text-sm text-neutral-500">hello@cronstrom.net</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-200 text-xs text-neutral-400">
          <p>&copy; {new Date().getFullYear()} {artistBio.name}. Alla rättigheter förbehållna.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-600">Integritetspolicy</a>
            <a href="#" className="hover:text-neutral-600">Villkor</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

