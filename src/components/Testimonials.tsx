import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Send, CheckCircle, User, Sparkles, Quote } from 'lucide-react';
import { dataService, Testimonial } from '../services/dataService';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { Reveal } from './ui/motion';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    content: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await dataService.getTestimonials();
      // Show only approved testimonials to the public
      setTestimonials(data.filter(t => t.approved));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dataService.addTestimonial(formData);
      setSubmitted(true);
      toast.success('Merci pour votre témoignage ! Il sera publié après modération.');
      setTimeout(() => {
        setIsFormOpen(false);
        setSubmitted(false);
        setFormData({ author: '', rating: 5, content: '' });
      }, 3000);
    } catch (error) {
      toast.error('Une erreur est survenue.');
    }
  };

  return (
    <section className="py-32 px-6 bg-brand-obsidian text-brand-champagne relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-bronze rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-bronze rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <Reveal>
             <p className="micro-label text-brand-bronze mb-6 tracking-[0.5em] uppercase font-black font-sans">L'EXPÉRIENCE IMPÉRIALE</p>
             <h2 className="luxury-text text-5xl md:text-7xl mb-8 italic">Leurs Secrets de Beauté</h2>
             <p className="text-brand-champagne/40 text-lg max-w-2xl mx-auto font-medium italic">
               Découvrez les témoignages de celles qui ont rejoint l'Empire et transformé leur rituel de soin.
             </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="aspect-square bg-white/5 rounded-[3rem] animate-pulse" />)
          ) : testimonials.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-brand-champagne/20 luxury-text text-2xl">L'Empire attend son premier témoignage sacré...</p>
            </div>
          ) : (
            testimonials.map((t, idx) => (
              <Reveal key={t.id} delay={idx * 0.1}>
                <div className="bg-white/5 backdrop-blur-md p-10 rounded-[3.5rem] border border-white/5 h-full flex flex-col group hover:bg-white/10 transition-all duration-700">
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < t.rating ? "fill-brand-bronze text-brand-bronze" : "text-white/10"} />
                    ))}
                  </div>
                  <Quote className="text-brand-bronze/20 mb-6 group-hover:text-brand-bronze/40 transition-colors" size={40} />
                  <p className="text-xl italic mb-10 text-brand-champagne/80 leading-relaxed font-serif">
                    "{t.content}"
                  </p>
                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm tracking-widest">{t.author.toUpperCase()}</h4>
                      <p className="text-[10px] text-brand-bronze uppercase tracking-[0.2em] mt-1 font-bold">Cliente Vérifiée</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-brand-bronze/10 flex items-center justify-center text-brand-bronze">
                      <User size={18} />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>

        <Reveal className="text-center">
           <button 
             onClick={() => setIsFormOpen(true)}
             className="px-12 py-6 bg-brand-bronze text-brand-obsidian micro-label text-[10px] tracking-[0.4em] font-black rounded-full shadow-bronze-glow hover:bg-white hover:shadow-2xl transition-all"
           >
             PARTAGER MON EXPÉRIENCE
           </button>
        </Reveal>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setIsFormOpen(false)} 
               className="absolute inset-0 bg-brand-obsidian/80 backdrop-blur-md" 
            />
            <motion.div 
               initial={{ scale: 0.9, y: 20, opacity: 0 }} 
               animate={{ scale: 1, y: 0, opacity: 1 }} 
               exit={{ scale: 0.9, y: 20, opacity: 0 }} 
               className="relative bg-brand-obsidian border border-white/10 w-full max-w-xl rounded-[4rem] p-12 shadow-premium"
            >
              {submitted ? (
                <div className="py-20 text-center space-y-8">
                  <div className="w-24 h-24 bg-brand-bronze/20 rounded-full flex items-center justify-center mx-auto text-brand-bronze">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="luxury-text text-4xl text-white">Message Reçu</h3>
                  <p className="text-brand-champagne/60 italic">Votre témoignage a été envoyé à la Garde Impériale pour validation.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <p className="micro-label text-brand-bronze mb-2 tracking-[0.3em]">VOTRE VOIX COMPTE</p>
                      <h2 className="luxury-text text-4xl text-white italic">Publier un Avis</h2>
                    </div>
                    <button onClick={() => setIsFormOpen(false)} className="text-white/20 hover:text-white transition-colors">
                       <Reveal><Sparkles size={24} /></Reveal>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                      <label className="micro-label mb-3 block text-brand-champagne/40">NOM OU PSEUDONYME</label>
                      <input 
                        required 
                        placeholder="Ex: Mariam C."
                        value={formData.author} 
                        onChange={e => setFormData({...formData, author: e.target.value})} 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-brand-bronze transition-all luxury-text" 
                      />
                    </div>

                    <div>
                      <label className="micro-label mb-3 block text-brand-champagne/40">VOTRE NOTE SACRÉE</label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({...formData, rating: star})}
                            className={cn(
                              "w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center transition-all",
                              formData.rating >= star ? "bg-brand-bronze text-brand-obsidian border-brand-bronze" : "bg-white/5 text-white/20 hover:border-white/20"
                            )}
                          >
                            <Star size={20} className={formData.rating >= star ? "fill-brand-obsidian" : ""} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="micro-label mb-3 block text-brand-champagne/40">VOTRE EXPÉRIENCE</label>
                      <textarea 
                        required 
                        rows={5}
                        placeholder="Partagez vos impressions sur vos rituels..."
                        value={formData.content} 
                        onChange={e => setFormData({...formData, content: e.target.value})} 
                        className="w-full bg-white/5 border border-white/5 rounded-[2.5rem] p-8 text-white outline-none focus:border-brand-bronze transition-all italic leading-relaxed text-lg" 
                      />
                    </div>

                    <div className="flex gap-6">
                       <button 
                         type="button" 
                         onClick={() => setIsFormOpen(false)} 
                         className="flex-1 py-6 rounded-2xl micro-label text-[10px] tracking-widest text-white/20 hover:text-white transition-colors"
                       >
                         ANNULER
                       </button>
                       <button 
                         type="submit" 
                         className="flex-1 py-6 bg-brand-bronze text-brand-obsidian rounded-2xl micro-label text-[10px] tracking-widest font-black flex items-center justify-center gap-3 hover:bg-white transition-all"
                       >
                         PUBLIER <Send size={16} />
                       </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
