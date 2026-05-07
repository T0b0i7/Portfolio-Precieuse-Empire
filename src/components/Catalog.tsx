import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShoppingBag, Heart, Eye, X, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { cn } from "../lib/utils";
import { TextSlide, Magnetic, Reveal, CinematicImage } from "./ui/motion";
import { ImageWithPlaceholder } from "./ui/ImageWithPlaceholder";

// Services
import { dataService, Product } from "../services/dataService";
import { useDesign } from "../context/DesignContext";
import ImperialCatalog from "./Imperial/ImperialCatalog";

export default function Catalog() {
  const { design } = useDesign();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
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
      setTimeout(() => setLoading(false), 800);
    };
    
    loadProducts();

    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  if (design === 'imperial') {
    return <ImperialCatalog />;
  }

  const toggleWishlist = (id: string) => {
    const newWishlist = wishlist.includes(id)
      ? wishlist.filter(i => i !== id)
      : [...wishlist, id];
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    toast.success(wishlist.includes(id) ? "Retiré des favoris" : "Ajouté aux favoris", {
      icon: <Heart size={16} className={cn("text-brand-bronze", wishlist.includes(id) ? "" : "fill-brand-bronze")} />
    });
  };

  const categories = ["Tous", "visage", "corps", "maquillage", "accessoires"];

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
    const text = `Bonjour l'Empire ! Je souhaite commander : ${product.name} (${product.price.toLocaleString()} FCFA). Pouvez-vous me confirmer la disponibilité ?`;
    window.open(`https://wa.me/2290150824534?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header & Instant Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-32">
        <div className="max-w-2xl">
          <Reveal className="mb-4">
            <p className="micro-label text-brand-bronze tracking-[0.8em] uppercase font-bold">L'ARCHIVE DES SECRETS</p>
          </Reveal>
          <Reveal delay={0.2} className="mb-8">
            <h1 className="luxury-text text-7xl md:text-[8rem] font-black text-brand-champagne leading-none tracking-tighter italic">ÉCLAT PUR.</h1>
          </Reveal>
          <Reveal delay={0.4} className="border-l-2 border-brand-bronze/20 pl-10">
            <p className="text-xl text-brand-champagne/60 font-medium leading-relaxed italic uppercase tracking-widest">L'excellence de la cosmétique africaine impériale.</p>
          </Reveal>
        </div>
        
        <Reveal delay={0.6} className="relative w-full lg:w-[550px] group">
          <div className="absolute inset-0 bg-brand-bronze/5 blur-3xl rounded-full scale-150 opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
          <Search className="absolute left-10 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 group-focus-within:text-brand-bronze transition-all" size={28} />
          <input 
            type="text" 
            placeholder="RECHERCHER DANS L'ARCHIVE..." 
            className="w-full bg-brand-obsidian/5 border-b-2 border-brand-bronze/10 py-10 px-24 focus:border-brand-bronze outline-none text-2xl luxury-text text-brand-champagne transition-all placeholder:opacity-20 placeholder:uppercase"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Reveal>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-12 z-40 px-6 max-w-7xl mx-auto mb-20">
        <div className="bg-brand-obsidian/90 backdrop-blur-3xl py-4 px-10 flex items-center justify-between overflow-x-auto no-scrollbar shadow-premium border border-brand-bronze/10 rounded-full">
          <div className="flex items-center gap-12 min-w-max">
            <span className="micro-label text-brand-champagne/40 uppercase tracking-widest font-black">FILTRER PAR</span>
             <div className="flex gap-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all font-bold cursor-pointer border",
                      selectedCategory === cat 
                        ? "bg-brand-bronze border-brand-bronze text-brand-obsidian shadow-lg" 
                        : "border-brand-bronze/10 text-brand-champagne/40 hover:text-brand-bronze"
                    )}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="h-10 w-px bg-white/10" />

          <div className="flex items-center gap-10">
            <span className="micro-label text-brand-champagne/30 tracking-[0.5em] font-black uppercase">TRIER :</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[10px] uppercase tracking-[0.3em] font-black outline-none cursor-pointer text-brand-bronze border-none"
            >
              <option value="nouveautes" className="bg-brand-obsidian">NOUVEAUTÉS</option>
              <option value="prix-asc" className="bg-brand-obsidian">PRIX CROISSANT</option>
              <option value="prix-desc" className="bg-brand-obsidian">PRIX DÉCROISSANT</option>
              <option value="popularite" className="bg-brand-obsidian">POPULARITÉ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="space-y-6">
              <div className="aspect-[4/5] bg-brand-bronze/5 animate-pulse rounded-[3.5rem]" />
              <div className="h-5 w-2/3 bg-brand-bronze/5 rounded-full animate-pulse" />
              <div className="h-5 w-1/3 bg-brand-bronze/5 rounded-full animate-pulse" />
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
                      <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden mb-10 shadow-premium transition-all duration-1000 bg-brand-velvet border border-white/5 cursor-pointer flex flex-col items-center justify-center">
                        <ImageWithPlaceholder 
                          src={p.main_image} 
                          alt={p.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                        />
                        
                        <div className="absolute top-8 left-8 flex flex-col gap-3">
                          {p.is_bestseller && (
                            <motion.span 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="px-6 py-2 rounded-full micro-label text-[8px] bg-brand-bronze/90 backdrop-blur-md text-brand-obsidian shadow-lg font-black tracking-widest border border-brand-bronze/20"
                            >
                              BEST-SELLER
                            </motion.span>
                          )}
                        </div>

                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                          className="absolute top-8 right-8 p-5 rounded-full bg-brand-obsidian/40 backdrop-blur-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all hover:bg-brand-bronze text-white hover:text-brand-obsidian shadow-2xl"
                        >
                          <Heart size={22} className={cn(wishlist.includes(p.id) && "fill-brand-bronze text-brand-bronze")} />
                        </button>

                        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-3 z-10">
                           <button 
                             className="w-full bg-brand-champagne text-brand-obsidian py-5 rounded-full micro-label flex items-center justify-center gap-3 transition-all duration-700 font-black tracking-[0.3em] opacity-40 group-hover:opacity-100 translate-y-12 group-hover:translate-y-0"
                           >
                              VOIR L'ARTICLE <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform"/>
                           </button>
                           
                           <div className="flex gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                             <button 
                               onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                               className="flex-1 bg-white/10 backdrop-blur-md text-white py-4 rounded-full micro-label flex items-center justify-center gap-2 hover:bg-brand-bronze hover:text-brand-obsidian transition-all font-bold"
                             >
                                <Eye size={16}/>
                             </button>
                             <button 
                               onClick={(e) => { e.stopPropagation(); sendWhatsAppMessage(p); }}
                               className="flex-1 bg-brand-bronze text-brand-obsidian py-4 rounded-full micro-label flex items-center justify-center gap-2 hover:bg-white transition-all font-bold"
                             >
                                <ShoppingBag size={16}/>
                             </button>
                           </div>
                        </div>
                      </div>
                      
                      <div className="px-4">
                        <div className="flex justify-between items-start gap-4">
                           <div>
                              <p className="text-[10px] uppercase tracking-[0.4em] text-brand-bronze mb-2 font-bold">{p.category}</p>
                              <h3 className="luxury-text text-2xl leading-tight group-hover:text-brand-bronze transition-colors text-brand-champagne">{p.name}</h3>
                           </div>
                           <p className="luxury-text text-xl font-bold text-brand-bronze">{p.price.toLocaleString()} <span className="text-[10px] opacity-40 text-brand-champagne">FCFA</span></p>
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
                  className="micro-label border-2 border-brand-bronze/30 text-brand-bronze px-16 py-6 rounded-full hover:bg-brand-bronze hover:text-brand-obsidian transition-all font-black tracking-[0.3em]"
                >
                  VOIR PLUS DE SECRETS <ChevronRight className="inline-block ml-4" size={18} />
                </button>
              </Magnetic>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-60">
              <Reveal>
                <h3 className="luxury-text text-4xl opacity-10 tracking-widest text-brand-champagne">AUCUN SECRET RÉVÉLÉ POUR CETTE RECHERCHE</h3>
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
            <div className="absolute inset-0 bg-brand-obsidian/95 backdrop-blur-2xl" onClick={() => setSelectedProduct(null)} />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ scale: 1.1, opacity: 0, y: 30, filter: "blur(20px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-brand-obsidian text-brand-champagne max-w-7xl w-full max-h-[90vh] overflow-y-auto rounded-[4rem] shadow-premium flex flex-col md:flex-row border border-brand-bronze/20"
              >
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-10 right-10 z-10 p-5 bg-white/5 hover:bg-white/10 rounded-full transition-all text-brand-bronze shadow-2xl"
                >
                  <X size={28} />
                </button>

                {/* Gallery Section */}
                <div className="md:w-1/2 min-h-[500px] md:h-auto relative bg-brand-obsidian overflow-hidden group">
                  <CinematicImage src={selectedProduct.main_image} alt={selectedProduct.name} className="h-full rounded-none" />
                </div>

                {/* Info Section */}
                <div className="md:w-1/2 p-10 md:p-32 flex flex-col justify-center">
                  <div className="mb-16">
                    <Reveal className="mb-4">
                      <p className="micro-label text-brand-bronze uppercase tracking-[0.5em] font-bold">{selectedProduct.category}</p>
                    </Reveal>
                    <Reveal delay={0.1} className="mb-8">
                       <h2 className="luxury-text text-5xl md:text-7xl leading-none text-brand-champagne italic">{selectedProduct.name}</h2>
                    </Reveal>
                    <Reveal delay={0.2} className="flex items-center gap-6 mb-12">
                      <p className="text-4xl font-light text-brand-bronze">{selectedProduct.price.toLocaleString()} FCFA</p>
                    </Reveal>
                    <Reveal delay={0.3}>
                      <p className="text-brand-champagne/60 text-xl leading-relaxed font-light uppercase tracking-widest">{selectedProduct.description}</p>
                    </Reveal>
                  </div>

                  <div className="space-y-8 mt-auto">
                    <Magnetic>
                      <button 
                        onClick={() => sendWhatsAppMessage(selectedProduct)}
                        className="w-full flex items-center justify-center gap-6 py-10 rounded-[2rem] micro-label text-lg font-black tracking-widest bg-brand-bronze text-brand-obsidian shadow-premium hover:bg-white transition-all uppercase"
                      >
                        <ShoppingBag size={24} /> COMMANDER VIA WHATSAPP
                      </button>
                    </Magnetic>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <Magnetic>
                        <button 
                          onClick={() => toggleWishlist(selectedProduct.id)}
                          className={cn(
                            "py-6 rounded-2xl border border-brand-bronze/10 flex items-center justify-center gap-3 micro-label hover:border-brand-bronze transition-all text-brand-champagne font-bold uppercase",
                            wishlist.includes(selectedProduct.id) && "text-brand-bronze border-brand-bronze bg-brand-bronze/5"
                          )}
                        >
                          <Heart size={20} className={cn(wishlist.includes(selectedProduct.id) && "fill-current")} /> FAVORIS
                        </button>
                      </Magnetic>
                      <Magnetic>
                        <button 
                          className="py-6 rounded-2xl border border-brand-bronze/10 flex items-center justify-center gap-3 micro-label hover:border-brand-bronze transition-all text-brand-champagne font-bold uppercase"
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
