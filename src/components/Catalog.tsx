import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, ShoppingBag, Heart, Eye, X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { cn } from "../lib/utils";
import { TextSlide, Magnetic, Reveal, CinematicImage } from "./ui/motion";

interface Product {
  id: number;
  name: string;
  description: string;
  long_description: string;
  price: number;
  category: string;
  skin_type: string;
  main_image: string;
  gallery: string[];
  badges: string[];
  stock_status: string;
}

export default function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedSkinType, setSelectedSkinType] = useState("Tous");
  const [selectedBadge, setSelectedBadge] = useState("Tous");
  const [sortBy, setSortBy] = useState("nouveautes");
  const [maxPriceFilter, setMaxPriceFilter] = useState(100000);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        if (data.length > 0) {
          const highestPrice = Math.max(...data.map((p: Product) => p.price));
          setMaxPriceFilter(highestPrice);
        }
      })
      .finally(() => {
        // Simulate a slightly longer loading for luxury feel (skeleton demo)
        setTimeout(() => setLoading(false), 800);
      });

    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const toggleWishlist = (id: number) => {
    const newWishlist = wishlist.includes(id)
      ? wishlist.filter(i => i !== id)
      : [...wishlist, id];
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    toast.success(wishlist.includes(id) ? "Retiré des favoris" : "Ajouté aux favoris", {
      icon: <Heart size={16} className={cn("text-brand-gold", wishlist.includes(id) ? "" : "fill-brand-gold")} />
    });
  };

  const categories = ["Tous", "Soins visage", "Corps", "Maquillage", "Parfums", "Cheveux"];
  const skinTypes = ["Tous", "Grasse", "Sèche", "Mixte", "Sensible", "Normale"];
  const badges = ["Tous", "Nouveau", "Promo", "Best-seller"];

  const [displayLimit, setDisplayLimit] = useState(8);

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Tous" || p.category === selectedCategory;
      const matchesSkin = selectedSkinType === "Tous" || p.skin_type === selectedSkinType;
      const matchesBadge = selectedBadge === "Tous" || (p.badges || []).includes(selectedBadge);
      const matchesPrice = p.price <= maxPriceFilter;
      return matchesSearch && matchesCategory && matchesSkin && matchesBadge && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "prix-asc") return a.price - b.price;
      if (sortBy === "prix-desc") return b.price - a.price;
      if (sortBy === "popularite") return b.id - a.id; // Mock popularity with ID
      return b.id - a.id; // Nouveautés
    });

  const sendWhatsAppMessage = (product: Product) => {
    const text = `Bonjour de l'Empire ! Je souhaite commander : ${product.name} (${product.price.toLocaleString()} FCFA). Pouvez-vous me confirmer la disponibilité ?`;
    window.open(`https://wa.me/2290150824534?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header & Instant Search - UI Lora Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
        <div>
          <TextSlide className="mb-2">
            <p className="micro-label text-brand-gold tracking-[0.4em] uppercase">Catalogue Impérial</p>
          </TextSlide>
          <TextSlide delay={0.2} className="mb-6">
            <h1 className="luxury-text text-6xl md:text-8xl font-light text-brand-ebony leading-[0.9]">Sublimez-vous.</h1>
          </TextSlide>
          <Reveal delay={0.4}>
            <p className="text-xl text-ui-muted font-medium max-w-md leading-relaxed opacity-60">L'excellence de la cosmétique africaine, formulée pour révéler votre éclat naturel.</p>
          </Reveal>
        </div>
        
        <Reveal delay={0.6} className="relative w-full md:w-[450px] group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 group-focus-within:text-brand-gold transition-all" size={24} />
          <input 
            type="text" 
            placeholder="Rechercher un secret..." 
            className="w-full bg-white border border-brand-ink/5 shadow-2xl rounded-full py-6 px-20 focus:ring-4 focus:ring-brand-gold/10 outline-none text-lg transition-all placeholder:opacity-30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Reveal>
      </div>

      {/* Sticky Filter Bar - Forge UI Style */}
      <div className="sticky top-28 z-40 bg-brand-cream/60 backdrop-blur-3xl py-6 mb-24 border-b border-brand-ink/5 overflow-x-auto no-scrollbar">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-12 min-w-max px-4">
          {/* Categories */}
          <div className="flex items-center gap-6 border-r border-brand-ink/10 pr-12">
            <Filter size={18} className="text-brand-gold" />
            <div className="flex gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all font-bold cursor-pointer",
                    selectedCategory === cat 
                      ? "bg-brand-gold text-brand-ebony shadow-lg" 
                      : "bg-brand-ebony/5 text-brand-ebony/60 hover:bg-brand-ebony/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Types */}
          <div className="flex items-center gap-6 border-r border-brand-ink/10 pr-12">
            <span className="micro-label opacity-40 font-bold tracking-widest">PEAU :</span>
            <div className="flex gap-3">
              {skinTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedSkinType(type)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-[10px] transition-all font-bold tracking-wider",
                    selectedSkinType === type 
                      ? "bg-brand-ebony text-white shadow-xl" 
                      : "bg-brand-ink/5 text-brand-ink/60 hover:bg-brand-ink/10"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-6">
            <span className="micro-label opacity-40 font-bold tracking-widest">TRI :</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[10px] uppercase tracking-[0.2em] font-black outline-none cursor-pointer text-brand-gold"
            >
              <option value="nouveautes">Nouveautés</option>
              <option value="prix-asc">Prix Croissant</option>
              <option value="prix-desc">Prix Décroissant</option>
              <option value="popularite">Popularité</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="space-y-6">
              <div className="aspect-[4/5] bg-brand-ink/5 animate-pulse rounded-[3.5rem]" />
              <div className="h-5 w-2/3 bg-brand-ink/5 rounded-full animate-pulse" />
              <div className="h-5 w-1/3 bg-brand-ink/5 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24">
            <AnimatePresence mode="popLayout">
              {filteredProducts.slice(0, displayLimit).map((p, idx) => (
                <Reveal key={p.id} delay={idx * 0.05}>
                  <Magnetic>
                    <div 
                      className="group block"
                      onClick={() => navigate(`/catalogue/${p.id}`)}
                    >
                      <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden mb-10 shadow-lg group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] transition-all duration-700 bg-white cursor-pointer overflow-hidden">
                        <img 
                          src={p.main_image} 
                          alt={p.name} 
                          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                        />
                        
                        <div className="absolute top-8 left-8 flex flex-col gap-3">
                          {(p.badges || []).map(badge => (
                            <motion.span 
                              key={badge} 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className={cn(
                                "px-5 py-2 rounded-full micro-label text-[9px] backdrop-blur-xl text-white shadow-2xl font-black tracking-widest",
                                badge === 'Nouveau' ? "bg-brand-gold/60" : 
                                badge === 'Promo' ? "bg-brand-rose/60" : "bg-brand-ebony/60"
                              )}
                            >
                              {badge}
                            </motion.span>
                          ))}
                        </div>

                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                          className="absolute top-8 right-8 p-5 rounded-full bg-white/20 backdrop-blur-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all hover:bg-white text-brand-ebony shadow-2xl"
                        >
                          <Heart size={22} className={cn(wishlist.includes(p.id) && "fill-brand-gold text-brand-gold")} />
                        </button>

                        <div className="absolute inset-x-0 bottom-0 p-8 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-t from-brand-ebony/90 via-brand-ebony/40 to-transparent flex flex-col gap-4">
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                             className="w-full bg-white text-brand-ebony py-4 rounded-2x; micro-label flex items-center justify-center gap-3 hover:bg-brand-gold hover:text-brand-ebony transition-all font-black rounded-2xl"
                           >
                              APERÇU RAPIDE <Eye size={18}/>
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); sendWhatsAppMessage(p); }}
                             className="w-full bg-[#25D366] text-white py-4 rounded-2xl micro-label flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-2xl font-black"
                           >
                              COMMANDER <ShoppingBag size={18}/>
                           </button>
                        </div>
                      </div>
                      
                      <div className="px-4">
                        <div className="flex justify-between items-start gap-4">
                           <div>
                              <p className="text-[10px] uppercase tracking-[0.4em] text-brand-gold mb-2 font-bold">{p.category}</p>
                              <h3 className="luxury-text text-2xl leading-tight group-hover:text-brand-gold transition-colors">{p.name}</h3>
                           </div>
                           <p className="luxury-text text-xl font-bold text-brand-ebony">{p.price.toLocaleString()} <span className="text-[10px] opacity-40">FCFA</span></p>
                        </div>
                      </div>
                    </div>
                  </Magnetic>
                </Reveal>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredProducts.length > displayLimit && (
            <div className="mt-32 text-center">
              <Magnetic>
                <button 
                  onClick={() => setDisplayLimit(prev => prev + 4)}
                  className="micro-label border-2 border-brand-ebony px-16 py-6 rounded-full hover:bg-brand-ebony hover:text-white transition-all font-black tracking-[0.3em]"
                >
                  VOIR PLUS DE SECRETS <ChevronRight className="inline-block ml-4" size={18} />
                </button>
              </Magnetic>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-60">
              <Reveal>
                <h3 className="luxury-text text-4xl opacity-10 tracking-widest">AUCUN SECRET RÉVÉLÉ POUR CETTE RECHERCHE</h3>
              </Reveal>
            </div>
          )}
        </>
      )}

      {/* Modal Quick View */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
          >
            <div className="absolute inset-0 bg-brand-ebony/90 backdrop-blur-2xl" onClick={() => setSelectedProduct(null)} />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ scale: 1.1, opacity: 0, y: 30, filter: "blur(20px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-ui-dark text-brand-cream max-w-7xl w-full max-h-[90vh] overflow-y-auto rounded-[4rem] shadow-2xl flex flex-col md:flex-row border border-white/5"
              >
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-10 right-10 z-10 p-5 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white shadow-2xl"
                >
                  <X size={28} />
                </button>

                {/* Gallery Section */}
                <div className="md:w-1/2 min-h-[500px] md:h-auto relative bg-brand-ebony overflow-hidden group">
                  <CinematicImage src={selectedProduct.main_image} alt={selectedProduct.name} className="h-full rounded-none" />
                </div>

                {/* Info Section */}
                <div className="md:w-1/2 p-10 md:p-32 flex flex-col justify-center">
                  <div className="mb-16">
                    <TextSlide className="mb-4">
                      <p className="micro-label text-brand-gold uppercase tracking-[0.5em] font-bold">{selectedProduct.category}</p>
                    </TextSlide>
                    <TextSlide delay={0.1} className="mb-8">
                       <h2 className="luxury-text text-5xl md:text-7xl leading-none text-brand-cream">{selectedProduct.name}</h2>
                    </TextSlide>
                    <Reveal delay={0.2} className="flex items-center gap-6 mb-12">
                      <p className="text-4xl font-light text-brand-gold">{selectedProduct.price.toLocaleString()} FCFA</p>
                      <span className="px-6 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-brand-gold/60 tracking-widest">{selectedProduct.skin_type}</span>
                    </Reveal>
                    <Reveal delay={0.3}>
                      <p className="text-brand-cream/60 text-xl leading-relaxed font-light">{selectedProduct.description}</p>
                    </Reveal>
                  </div>

                  <div className="space-y-8 mt-auto">
                    <Magnetic>
                      <button 
                        onClick={() => sendWhatsAppMessage(selectedProduct)}
                        className="btn-primary w-full flex items-center justify-center gap-6 py-10 rounded-[2rem] text-lg font-black tracking-widest bg-brand-gold text-brand-ebony shadow-[0_20px_50px_rgba(197,165,114,0.3)]"
                      >
                        <ShoppingBag size={24} /> COMMANDER VIA WHATSAPP
                      </button>
                    </Magnetic>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <Magnetic>
                        <button 
                          onClick={() => toggleWishlist(selectedProduct.id)}
                          className={cn(
                            "py-6 rounded-2xl border border-white/10 flex items-center justify-center gap-3 micro-label hover:border-brand-gold transition-all text-white font-bold",
                            wishlist.includes(selectedProduct.id) && "text-brand-gold border-brand-gold bg-brand-gold/5"
                          )}
                        >
                          <Heart size={20} className={cn(wishlist.includes(selectedProduct.id) && "fill-current")} /> FAVORIS
                        </button>
                      </Magnetic>
                      <Magnetic>
                        <button 
                          className="py-6 rounded-2xl border border-white/10 flex items-center justify-center gap-3 micro-label hover:border-brand-gold transition-all text-white font-bold"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.origin + "/catalogue/" + selectedProduct.id);
                            toast.success("Lien de l'article copié");
                          }}
                        >
                          <Eye size={20} /> PARTAGER
                        </button>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
