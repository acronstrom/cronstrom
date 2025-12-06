import { useState, FormEvent } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="py-24 bg-neutral-900 text-white min-h-screen pt-32">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-serif mb-6">Kontakt</h2>
            <p className="text-neutral-400 mb-8 max-w-md">
              För frågor gällande verk till salu, samarbeten eller ateljébesök, vänligen använd formuläret eller kontakta mig direkt via e-post.
            </p>
            <div className="mb-8">
              <p className="text-lg font-serif">hello@cronstrom.net</p>
              <p className="text-neutral-500">070-123 45 67</p>
            </div>
            <div className="space-y-2 text-neutral-500 text-sm">
              <p>Ateljé:</p>
              <p>Artillerigatan 12<br/>114 51 Stockholm</p>
            </div>
          </div>
          
          {submitted ? (
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-serif mb-4">Tack för ditt meddelande!</h3>
                <p className="text-neutral-400">Jag återkommer så snart jag kan.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-500">Namn</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-neutral-800 border-none p-4 text-white focus:ring-1 focus:ring-white/50 focus:outline-none" 
                    placeholder="Ditt namn" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-500">E-post</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-neutral-800 border-none p-4 text-white focus:ring-1 focus:ring-white/50 focus:outline-none" 
                    placeholder="Din e-post" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-500">Meddelande</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-neutral-800 border-none p-4 text-white focus:ring-1 focus:ring-white/50 focus:outline-none h-32 resize-none" 
                  placeholder="Skriv ditt meddelande här..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-white text-black px-8 py-4 uppercase tracking-wider text-sm hover:bg-neutral-200 transition-colors w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Skickar...' : 'Skicka Meddelande'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

