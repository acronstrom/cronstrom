import { artistBio } from '../../lib/data';

export function Footer() {
  return (
    <footer className="bg-neutral-50 py-8 border-t border-neutral-100">
      <div className="container mx-auto px-6">
        <div className="text-center text-xs text-neutral-400">
          <p>&copy; {new Date().getFullYear()} {artistBio.name}. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
}
