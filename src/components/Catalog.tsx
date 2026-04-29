import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, ShoppingBag, Heart, Eye, X, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { cn } from "../lib/utils";
import { TextSlide, Magnetic, Reveal, CinematicImage } from "./ui/motion";

// Services
import { dataService, Product } from "../services/dataService";

export default function Catalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedSkinType, setSelectedSkinType] = useState("Tous");
  const [sortBy, setSortBy] = useState("nouveautes");
  const [maxPriceFilter, setMaxPriceFilter] = useState(100000);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await dataService.getProducts();
      setProducts(data);
      if (data.length > 0) {
        const highestPrice = Math.max(...data.map((p: Product) => p.price));
        setMaxPriceFilter(highestPrice);
      }
      // Simulate a slightly longer loading for luxury feel (skeleton demo)
      setTimeout(() => setLoading(false), 800);
    };
    
    loadProducts();

    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const toggleWishlist = (id: string) => {
    const newWishlist = wishlist.includes(id)
      ? wishlist.filter(i => i !== id)
      : [...wishlist, id];
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    toast.success(wishlist.includes(id) ? "Retiré des favoris" : "Ajouté aux favoris", {
      icon: <Heart size={16} className={cn("text-brand-gold", wishlist.includes(id) ? "" : "fill-brand-gold")} />
    });
  };

  const categories = ["Tous", "visage", "corps", "maquillage", "accessoires"];
  const skinTypes = ["Tous", "Grasse", "Sèche", "Mixte", "Sensible", "Normale"];

  const [displayLimit, setDisplayLimit] = useState(8);

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Tous" || p.category === selectedCategory;
      const matchesPrice = p.price <= maxPriceFilter;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "prix-asc") return a.price - b.price;
      if (sortBy === "prix-desc") return b.price - a.price;
      return 0;
    });

  const sendWhatsAppMessage = (product: Product) => {
    const text = `Bonjour de l'Empire ! Je souhaite commander : ${product.name} (${product.price.toLocaleString()} FCFA). Pouvez-vous me confirmer la disponibilité ?`;
    window.open(`https://wa.me/2290150824534?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header & Instant Search - UI Lora Style */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-32">
        <div className="max-w-2xl">
          <TextSlide className="mb-4">
            <p className="micro-label text-brand-gold tracking-[0.8em] uppercase font-bold">L'ARCHIVE DES SECRETS</p>
          </TextSlide>
          <TextSlide delay={0.2} className="mb-8">
            <h1 className="luxury-text text-7xl md:text-[8rem] font-black text-brand-ebony leading-none tracking-tighter">ÉCLAT PUR.</h1>
          </TextSlide>
          <Reveal delay={0.4} className="border-l-2 border-brand-gold/20 pl-10">
            <p className="text-xl text-ui-muted font-medium leading-relaxed opacity-60 italic">L'excellence de la cosmétique africaine, formulée pour révéler l'empire qui sommeille en vous.</p>
          </Reveal>
        </div>
        
        <Reveal delay={0.6} className="relative w-full lg:w-[550px] group">
          <div className="absolute inset-0 bg-brand-gold/5 blur-3xl rounded-full scale-150 opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
          <Search className="absolute left-10 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 group-focus-within:text-brand-gold transition-all" size={28} />
          <input 
            type="text" 
            placeholder="RECHERCHER DANS L'ARCHIVE..." 
            className="w-full bg-brand-ebony/5 border-b-2 border-brand-ebony/10 py-10 px-24 focus:border-brand-gold outline-none text-2xl luxury-text transition-all placeholder:opacity-20 placeholder:uppercase"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Reveal>
      </div>

      {/* Sticky Filter Bar - Luxury Style */}
      <div className="sticky top-12 z-40 px-6 max-w-7xl mx-auto mb-20">
        <div className="glass-card py-4 px-10 flex items-center justify-between overflow-x-auto no-scrollbar shadow-premium">
          <div className="flex items-center gap-12 min-w-max">
            <span className="micro-label text-brand-ebony/40">FILTRER PAR</span>
             <div className="flex gap-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all font-bold cursor-pointer border",
                      selectedCategory === cat 
                        ? "bg-brand-gold border-brand-gold text-brand-ebony shadow-lg" 
                        : "border-brand-ebony/10 text-brand-ebony/40 hover:text-brand-ebony"
                    )}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="h-10 w-px bg-white/10" />

          <div className="flex items-center gap-10">
            <span className="micro-label text-white/30 tracking-[0.5em] font-black">TRIER :</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[10px] uppercase tracking-[0.3em] font-black outline-none cursor-pointer text-brand-gold border-none"
            >
              <option value="nouveautes" className="bg-brand-ebony">NOUVEAUTÉS</option>
              <option value="prix-asc" className="bg-brand-ebony">PRIX CROISSANT</option>
              <option value="prix-desc" className="bg-brand-ebony">PRIX DÉCROISSANT</option>
              <option value="popularite" className="bg-brand-ebony">POPULARITÉ</option>
            </select>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 ml-16 text-white/20">
           <span className="micro-label uppercase text-[8px] tracking-[1em]">{filteredProducts.length} ARTICLES RÉVÉLÉS</span>
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
                          {p.is_bestseller && (
                            <motion.span 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="px-6 py-2 rounded-full micro-label text-[8px] bg-brand-cream/90 backdrop-blur-md text-brand-ebony shadow-lg font-black tracking-widest"
                            >
                              BEST-SELLER
                            </motion.span>
                          )}
                        </div>

                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                          className="absolute top-8 right-8 p-5 rounded-full bg-white/10 backdrop-blur-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all hover:bg-brand-gold text-white hover:text-brand-ebony shadow-2xl"
                        >
                          <Heart size={22} className={cn(wishlist.includes(p.id) && "fill-brand-gold text-brand-gold")} />
                        </button>

                        <div className="absolute inset-x-0 bottom-0 p-8 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-t from-brand-ebony/60 to-transparent flex flex-col gap-3">
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                             className="w-full bg-white text-brand-ebony py-4 rounded-full micro-label flex items-center justify-center gap-3 hover:bg-brand-gold hover:text-brand-ebony transition-all font-bold"
                           >
                              APERÇU RAPIDE <Eye size={18}/>
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); sendWhatsAppMessage(p); }}
                             className="w-full bg-brand-gold text-brand-ebony py-4 rounded-full micro-label flex items-center justify-center gap-3 hover:bg-brand-gold-muted transition-all shadow-xl font-bold"
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
