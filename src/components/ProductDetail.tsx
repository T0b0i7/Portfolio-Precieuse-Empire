import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Heart, ChevronLeft, Share2, ShieldCheck, Sparkles, Truck, Facebook, Twitter, MessageCircle, ArrowRight } from "lucide-react";
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

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch product
    fetch(`/api/products`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: Product) => p.id === Number(id));
        if (found) {
          setProduct(found);
          setSimilarProducts(data.filter((p: Product) => p.category === found.category && p.id !== found.id).slice(0, 4));
          
          const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
          setIsFavorite(wishlist.includes(found.id));
        } else {
          navigate("/catalogue");
        }
      })
      .finally(() => setLoading(false));
    
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const toggleFavorite = () => {
    if (!product) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let newWishlist;
    if (isFavorite) {
      newWishlist = wishlist.filter((item: number) => item !== product.id);
      toast.success("Retiré des favoris");
    } else {
      newWishlist = [...wishlist, product.id];
      toast.success("Ajouté aux favoris");
    }
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setIsFavorite(!isFavorite);
  };

  const shareSocial = (platform: string) => {
    if (!product) return;
    const url = window.location.href;
    const text = `Regardez ce secret de beauté de l'Empire : ${product.name}`;
    let shareLink = "";

    switch (platform) {
      case "facebook": shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case "twitter": shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`; break;
      case "whatsapp": shareLink = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`; break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Lien copié !");
        setShowShareMenu(false);
        return;
    }

    if (shareLink) {
      window.open(shareLink, "_blank");
      setShowShareMenu(false);
    }
  };

  const sendWhatsAppMessage = () => {
    if (!product) return;
    const text = `Bonjour de l'Empire ! Je souhaite commander : ${product.name} (${product.price.toLocaleString()} FCFA). Pouvez-vous me confirmer la disponibilité ?`;
    window.open(`https://wa.me/2290150824534?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="pt-48 px-6 min-h-screen max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="aspect-square bg-brand-ink/5 animate-pulse rounded-[4rem]" />
          <div className="space-y-10">
            <div className="h-16 w-3/4 bg-brand-ink/5 animate-pulse rounded-full" />
            <div className="h-8 w-1/4 bg-brand-ink/5 animate-pulse rounded-full" />
            <div className="h-40 w-full bg-brand-ink/5 animate-pulse rounded-[2rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = [product.main_image, ...(product.gallery || [])];

  return (
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      <Reveal className="mb-16">
        <Link to="/catalogue" className="inline-flex items-center gap-3 micro-label hover:text-brand-gold transition-all group">
          <ChevronLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> <span className="tracking-[0.2em] font-bold">RETOUR AU CATALOGUE</span>
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start mb-48">
        {/* Left: Gallery - Cinematic Images */}
        <div className="space-y-8">
          <div className="aspect-[4/5] rounded-[4rem] overflow-hidden bg-white border border-brand-ink/5 shadow-2xl relative group overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                <img 
                  src={images[activeImage]} 
                  className="w-full h-full object-cover" 
                  alt={product.name}
                />
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute top-10 left-10 flex flex-col gap-3">
               {product.badges.map(badge => (
                 <span key={badge} className="bg-brand-gold/80 backdrop-blur-xl text-brand-ebony px-6 py-2 rounded-full micro-label text-[10px] shadow-2xl font-black tracking-widest">
                   {badge}
                 </span>
               ))}
            </div>
          </div>
          
          <Reveal delay={0.4} className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-2">
            {images.map((img, idx) => (
              <Magnetic key={idx}>
                <button
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "w-28 h-28 rounded-3xl overflow-hidden border-2 transition-all shrink-0 shadow-lg",
                    activeImage === idx ? "border-brand-gold scale-110 shadow-2xl" : "border-transparent opacity-30 hover:opacity-100"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              </Magnetic>
            ))}
          </Reveal>
        </div>

        {/* Right: Details - UI Lora Reveal */}
        <div className="flex flex-col py-10">
          <div className="mb-16">
            <TextSlide className="mb-4">
              <p className="micro-label text-brand-gold tracking-[0.6em] font-bold uppercase">{product.category}</p>
            </TextSlide>
            <TextSlide delay={0.1} className="mb-8">
              <h1 className="luxury-text text-6xl md:text-8xl font-black leading-none">{product.name}</h1>
            </TextSlide>
            
            <Reveal delay={0.2} className="flex items-center gap-10 mb-16">
              <span className="text-5xl font-light text-brand-ebony tracking-tight">{product.price.toLocaleString()} FCFA</span>
              <span className="px-6 py-2 bg-brand-gold/5 text-brand-gold rounded-full text-[10px] font-black tracking-[0.3em] border border-brand-gold/20">L'EMPIRE VOUS ATTEND</span>
            </Reveal>
            
            <Reveal delay={0.3} className="flex flex-wrap gap-6 mb-16">
              <div className="flex items-center gap-3 px-6 py-3 bg-brand-ebony/5 rounded-2xl border border-brand-ebony/5 shadow-sm">
                <Sparkles size={18} className="text-brand-gold" />
                <span className="text-[12px] font-black uppercase tracking-widest text-brand-ebony">Peau : {product.skin_type}</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-brand-ebony/5 rounded-2xl border border-brand-ebony/5 shadow-sm">
                <ShieldCheck size={18} className="text-brand-gold" />
                <span className="text-[12px] font-black uppercase tracking-widest text-brand-ebony">Authenticité Certifiée</span>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <p className="text-2xl text-ui-muted font-medium mb-12 border-l-4 border-brand-gold/20 pl-12 leading-relaxed opacity-80 italic">
                {product.description}
              </p>
            </Reveal>
            
            <Reveal delay={0.5} className="prose prose-brand max-w-none opacity-40 text-lg leading-relaxed font-light mb-16 px-12">
              <p>{product.long_description || "Une formulation précieuse héritée des secrets de beauté de nos mères. Testée dermatologiquement pour une efficacité prouvée sans compromis."}</p>
            </Reveal>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <Magnetic className="flex-1">
                <button 
                  onClick={sendWhatsAppMessage}
                  className="btn-primary w-full py-10 flex items-center justify-center gap-6 text-xl bg-brand-gold text-brand-ebony shadow-[0_30px_60px_-10px_rgba(197,165,114,0.4)]"
                >
                  <ShoppingBag size={24} /> COMMANDER SUR WHATSAPP
                </button>
              </Magnetic>
              
              <Magnetic>
                <button 
                  onClick={toggleFavorite}
                  className={cn(
                    "p-8 rounded-full border-2 border-brand-ebony/5 hover:border-brand-gold transition-all shadow-xl",
                    isFavorite ? "text-brand-gold border-brand-gold bg-brand-gold/5" : "bg-white"
                  )}
                >
                  <Heart size={28} className={cn(isFavorite && "fill-current")} />
                </button>
              </Magnetic>

              <div className="relative">
                <Magnetic>
                  <button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className={cn(
                      "p-8 rounded-full border-2 border-brand-ebony/5 hover:border-brand-gold transition-all shadow-xl",
                      showShareMenu ? "bg-brand-ebony text-brand-cream border-brand-ebony" : "bg-white"
                    )}
                  >
                    <Share2 size={28} />
                  </button>
                </Magnetic>
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                      className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 flex gap-4 bg-brand-ebony p-4 rounded-[2rem] shadow-2xl z-20 border border-white/10"
                    >
                      <button onClick={() => shareSocial('facebook')} className="p-4 hover:bg-white/10 text-white rounded-2xl transition-colors"><Facebook size={20} /></button>
                      <button onClick={() => shareSocial('twitter')} className="p-4 hover:bg-white/10 text-white rounded-2xl transition-colors"><Twitter size={20} /></button>
                      <button onClick={() => shareSocial('whatsapp')} className="p-4 hover:bg-white/10 text-white rounded-2xl transition-colors"><MessageCircle size={20} /></button>
                      <button onClick={() => shareSocial('copy')} className="px-6 text-[10px] font-black text-brand-gold tracking-widest hover:text-white transition-colors">COPIER LE LIEN</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <Reveal delay={0.6} className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-16 border-t border-brand-ebony/5">
               <div className="flex items-start gap-6 p-10 bg-white rounded-[3rem] shadow-sm border border-brand-ebony/5 group hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                  <div className="text-brand-gold p-4 bg-brand-gold/5 rounded-3xl group-hover:bg-brand-gold group-hover:text-white transition-all"><Truck size={28} /></div>
                  <div>
                    <h4 className="luxury-text text-xl mb-2">Expédition Impériale</h4>
                    <p className="text-sm opacity-40 leading-relaxed">Le monde entier à votre porte. Express à Cotonou et sous-région.</p>
                  </div>
               </div>
               <div className="flex items-start gap-6 p-10 bg-white rounded-[3rem] shadow-sm border border-brand-ebony/5 group hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                  <div className="text-brand-gold p-4 bg-brand-gold/5 rounded-3xl group-hover:bg-brand-gold group-hover:text-white transition-all"><Sparkles size={28} /></div>
                  <div>
                    <h4 className="luxury-text text-xl mb-2">Rituel Sacré</h4>
                    <p className="text-sm opacity-40 leading-relaxed">À utiliser chaque aube et chaque crépuscule pour un éclat divin.</p>
                  </div>
               </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Similar Products - Cinematic Grid */}
      {similarProducts.length > 0 && (
        <section className="pt-48 border-t border-brand-ebony/5">
          <div className="text-center mb-20">
             <Reveal>
               <h2 className="luxury-text text-5xl md:text-7xl mb-6">Secrets Similaires</h2>
             </Reveal>
             <Reveal delay={0.2}>
               <p className="micro-label text-brand-gold tracking-[0.5em] uppercase font-bold">Complétez votre rituel</p>
             </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            {similarProducts.map((p, idx) => (
              <Reveal key={p.id} delay={idx * 0.1}>
                <Magnetic>
                  <Link to={`/catalogue/${p.id}`} className="group block">
                    <div className="aspect-[3/4] rounded-[3.5rem] overflow-hidden mb-10 relative shadow-lg group-hover:shadow-2xl transition-all duration-700 overflow-hidden bg-white">
                      <img src={p.main_image} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                      <div className="absolute inset-0 bg-brand-ebony/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="p-6 bg-brand-cream/80 backdrop-blur-xl rounded-full translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                            <ArrowRight className="text-brand-ebony" size={24} />
                         </div>
                      </div>
                    </div>
                    <div className="px-4">
                      <h3 className="luxury-text text-2xl mb-2 group-hover:text-brand-gold transition-colors">{p.name}</h3>
                      <p className="micro-label text-brand-gold tracking-[0.3em] font-black">{p.price.toLocaleString()} FCFA</p>
                    </div>
                  </Link>
                </Magnetic>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
