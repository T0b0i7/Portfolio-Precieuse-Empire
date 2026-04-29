import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Trash2, 
  Search, 
  Filter, 
  Copy, 
  Plus, 
  Link as LinkIcon,
  X,
  FileText,
  Package,
  Calendar
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export function AdminMediaGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      setImages(data);
    } catch (error) {
      toast.error('Erreur chargement média');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Lien copié !');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer définitivement cette image ?')) return;
    try {
      await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      setImages(prev => prev.filter(img => img.id !== id));
      toast.success('Média supprimé');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await fetch('/api/admin/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: reader.result,
              filename: file.name,
              type: file.type.split('/')[1] || 'image',
              size: file.size
            })
          });
          fetchMedia();
        } catch (error) {
          toast.error('Erreur téléversement');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMedia = images.filter(img => 
    (img.filename?.toLowerCase() || '').includes(search.toLowerCase()) &&
    (filter === 'all' || img.type === filter)
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="luxury-text text-4xl mb-2">Galerie Média</h1>
          <p className="text-black/40 font-medium">La bibliothèque centrale de votre empire visuel.</p>
        </div>
        <label className="bg-brand-ebony text-white h-14 px-8 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold hover:bg-brand-gold hover:text-brand-ebony transition-all group shadow-xl cursor-pointer">
           <Plus size={20} /> TÉLÉVERSER UN MÉDIA
           <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
        </label>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-black/5 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-brand-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une image..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/[0.02] border-none rounded-xl py-3 px-12 text-sm outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
          {['all', 'products', 'content', 'events'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                filter === f ? "bg-brand-gold text-brand-ebony" : "bg-black/[0.02] text-black/40 hover:bg-black/[0.05]"
              )}
            >
              {f === 'all' ? 'TOUS' : f === 'products' ? 'Produits' : f === 'content' ? 'Articles' : 'Événements'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => <div key={i} className="aspect-square bg-white rounded-3xl animate-pulse border border-black/5" />)}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-40 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-black/5">
           <ImageIcon size={64} className="mx-auto text-black/5 mb-6" />
           <p className="text-black/30 luxury-text text-2xl">Aucun média trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredMedia.map((img) => (
            <motion.div 
              layout
              key={img.id}
              className="group aspect-square bg-white rounded-3xl border border-black/5 overflow-hidden relative shadow-sm hover:shadow-xl transition-all"
            >
              <img src={img.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-brand-ebony/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                 <button onClick={() => handleCopyUrl(img.url)} className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-brand-gold hover:text-brand-ebony transition-all">
                    <Copy size={16} />
                 </button>
                 <button onClick={() => handleDelete(img.id)} className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all">
                    <Trash2 size={16} />
                 </button>
              </div>
              <div className="absolute top-2 left-2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-[8px] font-bold uppercase tracking-widest text-black/60 opacity-0 group-hover:opacity-100 transition-all">
                 {img.type}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
