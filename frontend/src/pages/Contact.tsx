import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { API_BASE } from '../lib/config';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // 5 second delay before form can be submitted
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanSubmit(true);
    }
  }, [countdown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Try Resend API first (via our backend)
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to send');
      }
    } catch (err) {
      // Fallback to mailto if API fails
      const subject = encodeURIComponent(`Kontaktförfrågan från ${formData.name}`);
      const body = encodeURIComponent(
        `Namn: ${formData.name}\nE-post: ${formData.email}\n\nMeddelande:\n${formData.message}`
      );
      window.open(`mailto:lena@cronstrom.net?subject=${subject}&body=${body}`, '_blank');
      setError('Formuläret kunde inte skickas automatiskt. Din e-postklient bör ha öppnats.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-center">Kontakt</h1>
          <p className="text-neutral-600 text-center mb-12 max-w-md mx-auto">
            Har du frågor eller vill komma i kontakt? Fyll i formuläret nedan.
          </p>
          
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif mb-4">Tack för ditt meddelande!</h3>
              <p className="text-neutral-500">Jag återkommer så snart jag kan.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm rounded">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-500">Namn</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-neutral-200 p-4 text-neutral-900 focus:border-neutral-400 focus:outline-none transition-colors" 
                    placeholder="Ditt namn" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-500">E-post</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-neutral-200 p-4 text-neutral-900 focus:border-neutral-400 focus:outline-none transition-colors" 
                    placeholder="Din e-post" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-500">Meddelande</label>
                <textarea 
                  name="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full border border-neutral-200 p-4 text-neutral-900 focus:border-neutral-400 focus:outline-none transition-colors h-40 resize-none" 
                  placeholder="Skriv ditt meddelande här..."
                ></textarea>
              </div>
              <div className="text-center">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !canSubmit}
                  className="bg-neutral-900 text-white px-12 py-4 uppercase tracking-wider text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Skickar...' : !canSubmit ? `Vänta ${countdown}s...` : 'Skicka Meddelande'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
