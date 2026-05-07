import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  ChevronRight,
  Search,
  Filter,
  Users,
  Settings,
  X,
  Mail,
  Phone
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

import { dataService, Event } from '../../services/dataService';

export function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registrations state
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingReg, setLoadingReg] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    status: 'upcoming' as 'upcoming' | 'finished' | 'ongoing'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await dataService.getEvents();
      setEvents(data);
    } catch (error) {
      toast.error('Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      image: event.image,
      status: event.status
    });
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
      status: 'upcoming'
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return;
    try {
      await dataService.deleteEvent(id);
      toast.success('Événement supprimé');
      fetchEvents();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleViewRegistrations = async (event: Event) => {
    setSelectedEvent(event);
    setIsRegistrationsOpen(true);
    setLoadingReg(true);
    // Registration feature not yet in dataService, mock for now
    setTimeout(() => {
      setRegistrations([]);
      setLoadingReg(false);
    }, 500);
  };

  const handleDeleteRegistration = async (id: number) => {
    if (!confirm('Supprimer cette inscription ?')) return;
    setRegistrations(prev => prev.filter(r => r.id !== id));
    toast.success('Inscription supprimée (démo)');
  };

  const handleExportCSV = () => {
    if (!registrations.length) return;
    toast.success('Exporté au format CSV (démo)');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingEvent) {
        await dataService.updateEvent(editingEvent.id, formData);
        toast.success('Événement mis à jour');
      } else {
        await dataService.addEvent({
          ...formData,
          id: formData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        } as Event);
        toast.success('Événement créé avec succès');
      }
      setIsFormOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error('Erreur technique');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-emerald-600 bg-emerald-50';
      case 'draft': return 'text-brand-bronze bg-brand-bronze/10';
      case 'archived': return 'text-black/40 bg-black/5';
      default: return 'text-black/40 bg-black/5';
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="luxury-text text-4xl mb-2">Événements de l'Empire</h1>
          <p className="text-black/40 font-medium">Planifiez vos ventes flash, ateliers et lancements.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-obsidian text-white h-14 px-8 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold hover:bg-brand-bronze hover:text-brand-obsidian transition-all shadow-xl group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> CRÉER UN ÉVÉNEMENT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white aspect-[4/5] rounded-[3rem] animate-pulse border border-black/5" />
          ))
        ) : events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] overflow-hidden border border-black/5 group hover:shadow-2xl transition-all h-full flex flex-col"
          >
            <div className="aspect-video relative overflow-hidden">
               <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
               <div className="absolute top-6 left-6">
                 <span className={cn("px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest backdrop-blur-md", getStatusColor(event.status))}>
                   {event.status === 'published' ? 'PUBLIÉ' : event.status === 'draft' ? 'BROUILLON' : 'ARCHIVÉ'}
                 </span>
               </div>
               <div className="absolute top-6 right-6 flex gap-2">
                 <button 
                   onClick={() => handleEdit(event)}
                   className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
                 >
                    <Edit2 size={14} />
                 </button>
                 <button 
                   onClick={() => handleDelete(event.id)}
                   className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                 >
                    <Trash2 size={14} />
                 </button>
               </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-4 line-clamp-2">{event.title}</h3>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-xs text-black/40">
                  <Calendar size={14} className="text-brand-bronze" />
                  <span>{new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-black/40">
                  <MapPin size={14} className="text-brand-bronze" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              <div className="mt-auto border-t border-black/5 pt-6 flex items-center justify-between">
                <div className="flex -space-x-2">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-black/5 flex items-center justify-center text-[10px] font-bold text-black/20">
                        {i === 3 ? '+12' : ''}
                     </div>
                   ))}
                </div>
                <button 
                  onClick={() => handleViewRegistrations(event)}
                  className="text-[10px] font-bold uppercase tracking-widest text-brand-bronze hover:underline flex items-center gap-2"
                >
                  GÉRER LES INSCRIPTIONS <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-brand-obsidian/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] overflow-hidden shadow-2xl p-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <h2 className="luxury-text text-3xl mb-8">
                {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Titre de l'événement</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                      placeholder="Ex: Lancement Collection Été"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Date</label>
                    <input 
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Lieu</label>
                    <input 
                      required
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                      placeholder="Showroom Paris / Zoom"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Image URL</label>
                    <input 
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Description</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Statut</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                    >
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-black/10 hover:bg-black/5 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-brand-obsidian text-white h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-bronze hover:text-brand-obsidian transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registrations Modal */}
      <AnimatePresence>
        {isRegistrationsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRegistrationsOpen(false)} className="absolute inset-0 bg-brand-obsidian/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative bg-white w-full max-w-3xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
               <div className="p-10 border-b border-black/5">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="luxury-text text-3xl">Inscrits : {selectedEvent?.title}</h2>
                     <div className="flex items-center gap-4">
                        <button 
                          onClick={handleExportCSV}
                          className="px-6 py-2 bg-brand-bronze text-brand-obsidian rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                        >
                          Exporter CSV
                        </button>
                        <button onClick={() => setIsRegistrationsOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-all"><X size={24} /></button>
                     </div>
                  </div>
                  <p className="text-black/40 text-sm font-medium">Liste des personnes ayant réservé leur place pour cet événement.</p>
               </div>

               <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                  {loadingReg ? (
                    <div className="flex items-center justify-center h-40">
                       <div className="w-8 h-8 border-2 border-brand-bronze border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : registrations.length === 0 ? (
                    <div className="text-center py-20 bg-black/[0.01] rounded-[2.5rem] border border-dashed border-black/5">
                       <p className="text-black/30 font-medium">Aucun inscrit pour le moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       {registrations.map((reg) => (
                         <div key={reg.id} className="flex items-center justify-between p-6 bg-black/[0.02] rounded-3xl border border-black/5 group">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-brand-bronze border border-black/5 capitalize">
                                  {reg.name.charAt(0)}
                               </div>
                               <div>
                                  <h4 className="font-bold text-sm">{reg.name}</h4>
                                  <div className="flex items-center gap-4 mt-1">
                                     <span className="text-[10px] text-black/30 flex items-center gap-1"><Mail size={10} /> {reg.email}</span>
                                     <span className="text-[10px] text-black/30 flex items-center gap-1"><Phone size={10} /> {reg.phone}</span>
                                  </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className="text-[10px] text-black/20 font-bold uppercase tracking-widest">{new Date(reg.created_at).toLocaleDateString()}</span>
                               <button 
                                onClick={() => handleDeleteRegistration(reg.id)}
                                className="p-2 text-black/10 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

