import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Copy, 
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export function AdminProducts({ searchQuery: globalSearch }: { searchQuery?: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const activeSearch = globalSearch || searchQuery;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    short_desc: '',
    long_description: '',
    price: 0,
    category: 'Soins visage',
    skin_type: 'Tous types',
    stock: 0,
    status: 'visible',
    badges: [] as string[],
    images: [] as string[],
    planned_at: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      short_desc: product.short_desc || '',
      long_description: product.long_description || '',
      price: product.price,
      category: product.category,
      skin_type: product.skin_type || 'Tous types',
      stock: product.stock,
      status: product.status,
      badges: product.badges || [],
      images: product.images || [product.image || ''],
      planned_at: product.planned_at || ''
    });
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      short_desc: '',
      long_description: '',
      price: 0,
      category: 'Soins visage',
      skin_type: 'Tous types',
      stock: 0,
      status: 'visible',
      badges: [],
      images: [],
      planned_at: ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit impérial ?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Produit supprimé');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
      toast.success('Images ajoutées');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success(editingProduct ? 'Produit mis à jour' : 'Produit ajouté au palais');
        setIsFormOpen(false);
        fetchProducts();
      }
    } catch (error) {
      toast.error('Erreur serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
    if (sortBy === 'price') comparison = a.price - b.price;
    if (sortBy === 'stock') comparison = a.stock - b.stock;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="luxury-text text-4xl mb-2">Gestion du Catalogue</h1>
          <p className="text-black/40 font-medium">Créez et gérez vos produits impériaux avec précision.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-ebony text-white h-14 px-8 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold hover:bg-brand-gold hover:text-brand-ebony transition-all shadow-xl shadow-black/10 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> AJOUTER UN PRODUIT
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-black/5 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-brand-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/[0.02] border-none rounded-xl py-3 px-12 text-sm outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black/[0.02] border-none rounded-xl py-3 px-6 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-brand-gold/50"
          >
            <option value="name">Trier par Nom</option>
            <option value="price">Trier par Prix</option>
            <option value="stock">Trier par Stock</option>
          </select>
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-3 bg-black/[0.02] rounded-xl text-black/40 hover:text-brand-gold transition-colors"
          >
            <Filter size={18} className={cn(sortOrder === 'desc' && "rotate-180")} />
          </button>
          {['all', 'Soins visage', 'Corps', 'Maquillage'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                selectedCategory === cat ? "bg-brand-gold text-brand-ebony" : "bg-black/[0.02] text-black/40 hover:bg-black/[0.05]"
              )}
            >
              {cat === 'all' ? 'TOUS' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-black/5 overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-black/5">
              <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30">Produit</th>
              <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30">Catégorie</th>
              <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30">Prix</th>
              <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30">Stock</th>
              <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30">Statut</th>
              <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="p-8"><div className="h-12 bg-black/5 rounded-2xl w-full" /></td>
                </tr>
              ))
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-32 text-center text-black/30 luxury-text text-2xl">Aucun produit trouvé</td>
              </tr>
            ) : filteredProducts.map((p) => (
              <tr key={p.id} className="group hover:bg-black/[0.01] transition-colors border-b border-black/5 last:border-none">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-black/5 overflow-hidden border border-black/5">
                      <img src={p.main_image || p.image} className="w-full h-full object-cover" alt={p.name} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">{p.name}</h4>
                      <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">RÉF : BZA-{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <span className="px-4 py-1.5 bg-black/5 rounded-full text-[10px] font-bold text-black/60">{p.category}</span>
                </td>
                <td className="p-8 font-light">{p.price.toLocaleString()} FCFA</td>
                <td className="p-8">
                   <div className="flex items-center gap-2">
                     <div className={cn("w-2 h-2 rounded-full", p.stock > 10 ? "bg-emerald-500" : "bg-orange-500")} />
                     <span className="text-sm font-medium">{p.stock} unités</span>
                   </div>
                </td>
                <td className="p-8">
                   <span className={cn(
                     "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                     p.status === 'visible' ? "bg-emerald-50 text-emerald-600" : "bg-black/5 text-black/40"
                   )}>
                     {p.status === 'visible' ? 'Visible' : 'Masqué'}
                   </span>
                </td>
                <td className="p-8">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={`/shop?id=${p.id}`}
                      target="_blank"
                      className="p-3 bg-black/5 hover:bg-brand-gold/10 hover:text-brand-gold rounded-xl transition-all" title="Voir sur le site"
                    >
                      <Eye size={16} />
                    </a>
                    <button 
                      onClick={() => handleEdit(p)}
                      className="p-3 bg-black/5 hover:bg-brand-gold/10 hover:text-brand-gold rounded-xl transition-all" title="Modifier"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-3 bg-black/5 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all" title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-brand-ebony/60 backdrop-blur-sm" 
              onClick={() => setIsFormOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-10 border-b border-black/5 flex items-center justify-between shrink-0">
                <h2 className="luxury-text text-3xl">{editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-3 bg-black/5 rounded-full hover:bg-black/10 transition-colors"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold tracking-widest uppercase text-black/40">NOM DU PRODUIT</label>
                       <input 
                         required
                         value={formData.name}
                         onChange={e => setFormData({ ...formData, name: e.target.value })}
                         type="text" className="bg-black/[0.02] border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-brand-gold/50 font-medium" 
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold tracking-widest uppercase text-black/40">DESCRIPTION COURTE</label>
                       <textarea 
                         required
                         value={formData.short_desc}
                         onChange={e => setFormData({ ...formData, short_desc: e.target.value })}
                         rows={2}
                         className="bg-black/[0.02] border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-brand-gold/50 font-medium resize-none" 
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold tracking-widest uppercase text-black/40">DESCRIPTION LONGUE (Fiche détail)</label>
                       <textarea 
                         required
                         value={formData.long_description}
                         onChange={e => setFormData({ ...formData, long_description: e.target.value })}
                         rows={4}
                         className="bg-black/[0.02] border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-brand-gold/50 font-medium resize-none shadow-inner" 
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold tracking-widest uppercase text-black/40">PRIX (FCFA)</label>
                          <input 
                            required
                            type="number" 
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="bg-black/[0.02] border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-brand-gold/50 font-medium" 
                          />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold tracking-widest uppercase text-black/40">STOCK INITIAL</label>
                          <input 
                            required
                            type="number" 
                            value={formData.stock}
                            onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                            className="bg-black/[0.02] border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-brand-gold/50 font-medium" 
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold tracking-widest uppercase text-black/40">CATÉGORIE</label>
                          <select 
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="bg-black/[0.02] border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-brand-gold/50"
                          >
                             <option value="Soins visage">Soins visage</option>
                             <option value="Corps">Corps</option>
                             <option value="Maquillage">Maquillage</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold tracking-widest uppercase text-black/40">TYPE DE PEAU</label>
                          <select 
                            value={formData.skin_type}
                            onChange={e => setFormData({ ...formData, skin_type: e.target.value })}
                            className="bg-black/[0.02] border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-brand-gold/50"
                          >
                             <option value="Tous types">Tous types</option>
                             <option value="Peau grasse">Peau grasse</option>
                             <option value="Peau sèche">Peau sèche</option>
                             <option value="Peau sensible">Peau sensible</option>
                          </select>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold tracking-widest uppercase text-black/40">BADGES ACTIFS</label>
                       <div className="flex flex-wrap gap-2">
                         {['Nouveau', 'Best-seller', 'Promo', 'Rupture'].map(badge => (
                           <button
                             key={badge}
                             type="button"
                             onClick={() => {
                               const isActive = formData.badges.includes(badge);
                               setFormData({
                                 ...formData,
                                 badges: isActive 
                                   ? formData.badges.filter(b => b !== badge)
                                   : [...formData.badges, badge]
                               })
                             }}
                             className={cn(
                               "px-4 py-2 rounded-xl text-[8px] font-bold uppercase tracking-widest border transition-all",
                               formData.badges.includes(badge) ? "bg-brand-gold border-brand-gold text-brand-ebony" : "border-black/5 text-black/40"
                             )}
                           >
                             {badge}
                           </button>
                         ))}
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold tracking-widest uppercase text-black/40">DATE DE MISE EN LIGNE (Planification)</label>
                       <input 
                         type="datetime-local" 
                         value={formData.planned_at}
                         onChange={e => setFormData({ ...formData, planned_at: e.target.value })}
                         className="bg-black/[0.02] border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-brand-gold/50 font-medium" 
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold tracking-widest uppercase text-black/40">STATUT</label>
                       <select 
                         value={formData.status}
                         onChange={e => setFormData({ ...formData, status: e.target.value })}
                         className="bg-black/[0.02] border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-brand-gold/50"
                       >
                          <option value="visible">Visible</option>
                          <option value="hidden">Masqué</option>
                       </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="micro-label block text-center">Images du Produit({formData.images.length})</label>
                    <div className="grid grid-cols-2 gap-4">
                       {formData.images.map((img, i) => (
                         <div key={i} className="aspect-square rounded-3xl overflow-hidden relative group border border-black/5">
                            <img src={img} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={12} />
                            </button>
                            {i === 0 && <span className="absolute bottom-2 left-2 px-2 py-1 bg-brand-gold text-brand-ebony text-[8px] font-bold rounded-md">PRINCIPALE</span>}
                         </div>
                       ))}
                       <label className="aspect-square border-2 border-dashed border-black/10 rounded-3xl flex flex-col items-center justify-center p-4 group cursor-pointer hover:border-brand-gold/30 transition-all bg-black/[0.01]">
                          <Plus size={24} className="text-black/10 group-hover:text-brand-gold/30" />
                          <p className="text-[8px] font-bold text-black/20 mt-2 uppercase">Ajouter</p>
                          <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
                       </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 shrink-0 pt-6 border-t border-black/5">
                  {editingProduct && (
                    <a 
                      href={`/shop?id=${editingProduct.id}`}
                      target="_blank"
                      className="px-8 h-14 rounded-2xl border border-black/10 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all"
                    >
                      <Eye size={16} /> VOIR SUR LE SITE
                    </a>
                  )}
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-8 h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                  >
                    ANNULER
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-ebony text-white flex items-center justify-center px-10 h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-ebony transition-all shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting ? 'ENREGISTREMENT...' : (editingProduct ? 'METTRE À JOUR' : 'ENREGISTRER LE PRODUIT')}
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
