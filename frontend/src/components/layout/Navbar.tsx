import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { artistBio } from '../../lib/data';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Galleri', path: '/galleri' },
    { name: 'Utställningar', path: '/utstallningar' },
    { name: 'Nobel', path: '/nobel' },
    { name: 'Glasfusing', path: '/glasfusing' },
    { name: 'Textilmåleri', path: '/textilmaleri' },
    { name: 'Utbildning', path: '/utbildning' },
    { name: 'Kontakt', path: '/kontakt' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md border-b border-neutral-100 py-4`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="text-xl md:text-2xl xl:text-3xl font-serif tracking-wider font-bold text-neutral-900 shrink-0">
          {artistBio.name.toUpperCase()}
        </Link>

        {/* Desktop Menu - only show on xl screens (1280px+) */}
        <div className="hidden xl:flex items-center gap-6 2xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-xs 2xl:text-sm uppercase tracking-wider 2xl:tracking-widest font-medium transition-colors py-2 group whitespace-nowrap ${
                isActive(link.path) ? 'text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-neutral-900 transition-all duration-300 ${
                isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          ))}
        </div>

        {/* Mobile/Tablet Menu Toggle - show below xl */}
        <button
          className="xl:hidden z-50 text-neutral-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile/Tablet Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white flex flex-col items-center justify-center space-y-6 xl:hidden z-40">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-xl font-serif transition-colors ${
                  isActive(link.path) ? 'text-neutral-900 font-bold border-b-2 border-neutral-900' : 'text-neutral-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

