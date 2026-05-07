import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  FileText, 
  Star, 
  Sparkles, 
  Clock, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle2,
  Tag,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

import { dataService, Routine } from '../../services/dataService';

export function AdminContent() {
  const [activeType, setActiveType] = useState<'article' | 'promo' | 'routine'>('routine');
  const [items, setItems] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Routine | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    category: '',
    product_ids: '[]'
  });

  const [sortBy, setSortBy] = useState<'title' | 'date'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchContent();
  }, [activeType]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeType === 'routine') {
        const data = await dataService.getRoutines();
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des contenus');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
        toast.success('Image chargée');
      };
      reader.readAsDataURL(file);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'title') comparison = a.title.localeCompare(b.title);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleEdit = (item: Routine) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content || '',
      image: item.image,
      category: item.category || '',
      product_ids: item.product_ids || '[]'
    });
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
      category: '',
      product_ids: '[]'
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce contenu ?')) return;
    try {
      if (activeType === 'routine') {
        await dataService.deleteRoutine(id);
        toast.success('Contenu supprimé');
        fetchContent();
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (activeType === 'routine') {
        if (editingItem) {
          await dataService.updateRoutine(editingItem.id, formData);
          toast.success('Rituel mis à jour');
        } else {
          await dataService.addRoutine({
            ...formData,
            id: formData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
            date: new Date().toLocaleDateString('fr-FR')
          } as Routine);
          toast.success('Rituel créé avec succès');
        }
      }
      setIsFormOpen(false);
      fetchContent();
    } catch (error) {
      toast.error('Erreur technique');
    } finally {
      setIsSubmitting(false);
    }
  };

  const types = [
    { id: 'article', label: 'ARTICLES', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'promo', label: 'PROMOTIONS', icon: Sparkles, color: 'text-brand-bronze', bg: 'bg-brand-bronze/10' },
    { id: 'routine', label: 'ROUTINES', icon: Star, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="luxury-text text-4xl mb-2">Contenus Éditoriaux</h1>
          <p className="text-black/40 font-medium">Gérez votre blog, vos guides et vos offres spéciales.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-obsidian text-white h-14 px-8 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold hover:bg-brand-bronze hover:text-brand-obsidian transition-all shadow-xl group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> CRÉER UN CONTENU
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-wrap gap-4 p-2 bg-white rounded-3xl border border-black/5 w-fit">
          {types.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all",
                activeType === tab.id ? "bg-brand-obsidian text-white shadow-xl shadow-black/10" : "text-black/40 hover:bg-black/5"
              )}
            >
              <tab.icon size={16} className={activeType === tab.id ? "" : tab.color} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-black/5 rounded-2xl py-3 px-6 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-brand-bronze/50"
            >
              <option value="title">Nom</option>
              <option value="date">Date</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-3 bg-white border border-black/5 rounded-2xl text-black/40 hover:text-brand-bronze transition-colors"
            >
              <Search size={18} className={cn("transition-transform", sortOrder === 'desc' && "rotate-180")} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          [1, 2].map(i => (
            <div key={i} className="bg-white h-48 rounded-[2.5rem] animate-pulse border border-black/5" />
          ))
        ) : sortedItems.length === 0 ? (
          <div className="lg:col-span-2 py-32 text-center border-2 border-dashed border-black/5 rounded-[3.5rem]">
             <FileText size={48} className="text-black/10 mx-auto mb-6" />
             <p className="text-black/30 luxury-text text-xl">Aucun contenu trouvé dans cette catégorie</p>
          </div>
        ) : sortedItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[3rem] border border-black/5 flex flex-col sm:flex-row gap-8 group hover:shadow-xl transition-all"
          >
            <div className="w-full sm:w-32 h-40 sm:h-32 rounded-[2rem] overflow-hidden shrink-0 border border-black/5">
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold tracking-widest uppercase text-brand-bronze opacity-60 flex items-center gap-2">
                   <Tag size={12} /> {item.category || item.tag || 'Nouveauté'}
                 </span>
                 <div className="flex gap-1">
                    <a 
                      href={item.type === 'routine' ? `/routines?id=${item.id}` : `/blog?id=${item.id}`}
                      target="_blank"
                      className="p-2 hover:bg-black/5 rounded-lg text-black/20 hover:text-brand-obsidian transition-all"
                      title="Voir sur le site"
                    >
                      <Eye size={16} />
                    </a>
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-black/5 rounded-lg text-black/20 hover:text-brand-obsidian transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-black/20 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
              </div>
              <h3 className="font-bold text-lg mb-2 truncate group-hover:text-brand-bronze transition-colors">{item.title}</h3>
              <p className="text-xs text-black/40 line-clamp-2 mb-4 leading-relaxed">{item.excerpt}</p>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-black/20">
                   <span className="flex items-center gap-1.5"><Clock size={12} /> {item.date || 'Auto'}</span>
                   <span className={cn("flex items-center gap-1.5", item.status === 'published' ? "text-emerald-500" : "text-brand-bronze")}>
                     <CheckCircle2 size={12} /> {item.status === 'published' ? 'Publié' : 'Brouillon'}
                   </span>
                </div>
                <button className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/40 group-hover:bg-brand-obsidian group-hover:text-white transition-all">
                  <ArrowRight size={18} />
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
              className="relative w-full max-w-3xl bg-white rounded-[3.5rem] overflow-hidden shadow-2xl p-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <h2 className="luxury-text text-3xl mb-8">
                {editingItem ? 'Modifier le contenu' : 'Nouveau contenu'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Titre</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                      placeholder="Ex: Les bienfaits du Karité"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                    >
                      <option value="article">Article</option>
                      <option value="promo">Promotion</option>
                      <option value="routine">Routine</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Catégorie / Tag</label>
                    <input 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                      placeholder="Ex: Soin du visage"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Extrait (Résumé)</label>
                    <textarea 
                      rows={2}
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50 resize-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Image de couverture</label>
                    <label className="border-2 border-dashed border-black/10 rounded-3xl flex flex-col items-center justify-center p-8 group cursor-pointer hover:border-brand-bronze/30 transition-all bg-black/[0.01] relative overflow-hidden">
                       {formData.image ? (
                         <img src={formData.image} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Preview" />
                       ) : (
                         <div className="flex flex-col items-center">
                           <ImageIcon size={32} className="text-black/10 mb-2 group-hover:text-brand-bronze/30 transition-all" />
                           <p className="text-[10px] font-bold text-black/30">CLIQUEZ POUR TÉLÉVERSER</p>
                         </div>
                       )}
                       <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Contenu (Éditeur Enrichi)</label>
                    <div className="bg-black/5 rounded-3xl p-4 min-h-[400px] border border-black/10 focus-within:ring-1 focus-within:ring-brand-bronze/50 transition-all">
                       <div className="flex gap-2 mb-4 p-2 border-b border-black/10 overflow-x-auto no-scrollbar">
                          {['Bold', 'Italic', 'Underline', 'H1', 'H2', 'Bullet List'].map(tool => (
                            <button key={tool} type="button" className="px-3 py-1 hover:bg-black/5 rounded text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-brand-bronze transition-colors">{tool}</button>
                          ))}
                       </div>
                       <textarea 
                         value={formData.content}
                         onChange={e => setFormData({ ...formData, content: e.target.value })}
                         className="w-full bg-transparent border-none outline-none text-sm font-medium leading-relaxed resize-none h-80"
                         placeholder="Rédaction impériale..."
                       />
                    </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Date de publication prévue</label>
                    <input 
                      type="datetime-local"
                      value={formData.planned_at}
                      onChange={e => setFormData({ ...formData, planned_at: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Statut</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                    >
                      <option value="published">Publié</option>
                      <option value="draft">Brouillon</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {editingItem && (
                    <a 
                      href={editingItem.type === 'routine' ? `/routines?id=${editingItem.id}` : `/blog?id=${editingItem.id}`}
                      target="_blank"
                      className="flex-1 h-14 rounded-2xl border border-black/10 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all"
                    >
                      <Eye size={16} /> VOIR SUR LE SITE
                    </a>
                  )}
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
                    {isSubmitting ? 'Publication...' : (editingItem ? 'Mettre à jour' : 'Publier')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
