import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Floating "View Website" button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/"
          target="_blank"
          className="group flex items-center gap-2 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <ExternalLink size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Visa webbplats</span>
        </Link>
      </div>
      
      {/* Page content */}
      {children}
    </div>
  );
}

