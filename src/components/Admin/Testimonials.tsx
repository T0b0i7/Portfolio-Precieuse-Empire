import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  MessageCircle, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Search,
  Filter,
  User,
  Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    rating: 5,
    comment: '',
    is_active: true,
    photo_url: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    // Simuler le fetch ou utiliser Supabase
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      toast.error('Erreur chargement témoignages');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, current: boolean) => {
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !current })
      });
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t));
      toast.success(current ? 'Témoignage masqué' : 'Témoignage activé');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce témoignage ?')) return;
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast.success('Supprimé');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Témoignage ajouté');
        setIsFormOpen(false);
        fetchTestimonials();
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="luxury-text text-4xl mb-2">Témoignages & Avis</h1>
          <p className="text-black/40 font-medium">Modérez et gérez les retours de vos clientes.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-brand-ebony text-white h-14 px-8 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold hover:bg-brand-gold hover:text-brand-ebony transition-all group shadow-xl"
        >
          <Plus size={20} /> AJOUTER MANUELLEMENT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-black/5" />)
        ) : testimonials.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-black/5">
            <MessageCircle size={48} className="mx-auto text-black/10 mb-4" />
            <p className="text-black/30 font-medium">Aucun témoignage pour le moment.</p>
          </div>
        ) : testimonials.map(testimonial => (
          <motion.div 
            key={testimonial.id}
            className={cn(
              "p-8 rounded-[2.5rem] bg-white border border-black/5 flex flex-col relative group transition-all",
              !testimonial.is_active && "opacity-50 grayscale"
            )}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center overflow-hidden">
                {testimonial.photo_url ? (
                  <img src={testimonial.photo_url} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-brand-gold" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm">{testimonial.client_name}</h4>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className={i < testimonial.rating ? "fill-brand-gold text-brand-gold" : "text-black/10"} />
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-black/60 italic leading-relaxed mb-6 flex-1">
              "{testimonial.comment}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-black/5 mt-auto">
              <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest">
                {new Date(testimonial.created_at).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleStatus(testimonial.id, testimonial.is_active)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    testimonial.is_active ? "text-emerald-500 hover:bg-emerald-50" : "text-black/20 hover:bg-black/5"
                  )}
                  title={testimonial.is_active ? "Désactiver" : "Activer"}
                >
                  {testimonial.is_active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                </button>
                <button 
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-brand-ebony/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl">
              <h2 className="luxury-text text-3xl mb-8">Nouveau Témoignage</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="micro-label mb-2 block">Nom de la cliente</label>
                  <input required value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none" />
                </div>
                <div>
                  <label className="micro-label mb-2 block">Note (1-5)</label>
                  <input type="number" min="1" max="5" required value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none" />
                </div>
                <div>
                  <label className="micro-label mb-2 block">Commentaire</label>
                  <textarea required value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none resize-none" rows={4} />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-black/40">Annuler</button>
                  <button type="submit" className="flex-1 bg-brand-ebony text-white h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
