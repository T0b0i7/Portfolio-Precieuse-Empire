import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, MessageCircle, Share2, Facebook, Twitter, Clock, Sparkles, CheckCircle2, ShoppingBag, X, Check, Search, Play } from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "react-hot-toast";

import { dataService, Routine, Product } from "../services/dataService";

interface RoutineStep {
  title: string;
  description: string;
  productId: string | null;
}

export default function RoutineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [parsedContent, setParsedContent] = useState<any>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      if (!id) return;
      const [routines, products] = await Promise.all([
        dataService.getRoutines(),
        dataService.getProducts()
      ]);

      const found = routines.find((r: Routine) => r.id === id);
      if (found) {
        setRoutine(found);
        
        let content;
        try {
          content = JSON.parse(found.content);
          if (!content.steps) throw new Error("Invalid format");
        } catch (e) {
          // Fallback if not JSON or different format
          content = {
            intro: found.content,
            steps: []
          };
        }
        setParsedContent(content);
        
        let pIds = [];
        try {
          pIds = JSON.parse(found.product_ids || "[]");
        } catch (e) {
          pIds = [];
        }
        const recs = products.filter((p: Product) => pIds.includes(p.id));
        setRecommendedProducts(recs);
      } else {
        navigate("/routines");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Découvrez cette routine de soin Précieuse Empire : ${routine?.title}`;
    let shareLink = "";

    switch (platform) {
      case "facebook": shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case "twitter": shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`; break;
      case "whatsapp": shareLink = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`; break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Lien copié !");
        return;
    }

    if (shareLink) window.open(shareLink, "_blank");
  };

  const orderRoutine = () => {
    if (!routine) return;
    const text = `Bonjour ! Je souhaite commander tous les produits de la routine "${routine.title}". Pouvez-vous me donner le tarif total et la disponibilité ?`;
    window.open(`https://wa.me/2290150824534?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="pt-40 px-6 min-h-screen max-w-4xl mx-auto space-y-12 animate-pulse">
        <div className="h-[60vh] bg-brand-ink/5 rounded-[3.5rem]" />
        <div className="h-20 bg-brand-ink/5 rounded-2xl w-3/4" />
      </div>
    );
  }

  if (!routine || !parsedContent) return null;

  return (
    <div className="pb-32 bg-brand-obsidian min-h-screen">
      {/* Interactive Ritual Overlay */}
      <AnimatePresence>
        {activeStepIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-brand-obsidian text-brand-champagne flex flex-col items-center justify-center p-8 sm:p-20"
          >
            <div className="absolute top-10 right-10 flex items-center gap-6">
                <p className="micro-label text-brand-bronze font-black tracking-[0.3em]">ÉTAPE {activeStepIndex + 1} / {parsedContent.steps.length}</p>
                <button 
                  onClick={() => setActiveStepIndex(null)}
                  className="p-4 bg-white/5 rounded-full hover:bg-brand-bronze hover:text-brand-obsidian transition-all group"
                >
                  <X size={28} className="group-hover:scale-110 transition-transform"/>
                </button>
            </div>

            <div className="max-w-4xl w-full text-center space-y-12">
               <motion.div
                 key={activeStepIndex}
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 1.1, y: -20 }}
                 transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                 className="space-y-12"
               >
                  <div className="w-24 h-24 mx-auto bg-brand-bronze text-brand-obsidian rounded-full flex items-center justify-center luxury-text text-4xl shadow-bronze-glow font-black italic">
                    {activeStepIndex + 1}
                  </div>
                  
                  <h2 className="luxury-text text-5xl md:text-8xl leading-tight italic uppercase text-brand-champagne">
                    {parsedContent.steps[activeStepIndex].title}
                  </h2>
                  
                  <p className="text-xl md:text-3xl font-light text-brand-champagne/60 leading-relaxed italic max-w-3xl mx-auto uppercase tracking-widest">
                    {parsedContent.steps[activeStepIndex].description}
                  </p>

                  {parsedContent.steps[activeStepIndex].productId && (
                    <div className="flex justify-center pt-10">
                       <Link 
                         to={`/catalogue/${parsedContent.steps[activeStepIndex].productId}`}
                         className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-5 rounded-3xl hover:bg-brand-bronze hover:text-brand-obsidian transition-all group"
                       >
                         <Search size={18} className="text-brand-bronze group-hover:text-brand-obsidian" />
                         <span className="micro-label text-xs tracking-widest font-black uppercase">VOIR LE PRODUIT ÉCLAT</span>
                       </Link>
                    </div>
                  )}
               </motion.div>

               <div className="flex items-center justify-center gap-8 pt-20">
                  <button 
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex(prev => prev! - 1)}
                    className="p-6 bg-white/5 rounded-full hover:bg-white/10 transition-all disabled:opacity-10 cursor-pointer"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  
                  <div className="flex gap-3">
                    {parsedContent.steps.map((_: any, i: number) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1.5 transition-all duration-700 rounded-full",
                          i === activeStepIndex ? "w-10 bg-brand-bronze" : "w-3 bg-white/20"
                        )}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      if (activeStepIndex === parsedContent.steps.length - 1) {
                        toast.success("RITUEL COMPLÉTÉ. VOTRE ÉCLAT EST RÉVÉLÉ.");
                        setActiveStepIndex(null);
                      } else {
                        setActiveStepIndex(prev => prev! + 1);
                      }
                    }}
                    className="p-6 bg-brand-bronze text-brand-obsidian rounded-full hover:bg-white transition-all cursor-pointer shadow-premium"
                  >
                    {activeStepIndex === parsedContent.steps.length - 1 ? <Check size={32} className="font-black"/> : <ChevronRight size={32} className="font-black"/>}
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <section className="relative h-[80vh] min-h-[600px] flex items-end bg-brand-obsidian">
        <div className="absolute inset-0">
          <img src={routine.image} className="w-full h-full object-cover opacity-60 grayscale" alt={routine.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/20 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-20">
          <Link to="/routines" className="inline-flex items-center gap-2 micro-label text-brand-champagne/60 mb-12 hover:text-brand-bronze transition-colors uppercase tracking-[0.3em] font-black">
            <ChevronLeft size={16} /> RETOUR AUX RITUELS
          </Link>
          
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 mb-8"
            >
               <span className="bg-brand-bronze text-brand-obsidian px-6 py-2 rounded-full micro-label text-[10px] shadow-premium font-black tracking-widest uppercase">
                 {routine.category}
               </span>
               <div className="flex items-center gap-4 text-brand-champagne/60 micro-label tracking-widest font-black uppercase text-[10px]">
                  <span className="flex items-center gap-2"><Clock size={16} className="text-brand-bronze"/> 15 MIN</span>
                  <span className="flex items-center gap-2"><Sparkles size={16} className="text-brand-bronze"/> EXPERT</span>
               </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="luxury-text text-5xl md:text-[8rem] text-brand-champagne lg:leading-tight mb-8 italic uppercase"
            >
              {routine.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-brand-champagne/70 leading-relaxed max-w-2xl italic border-l-2 border-brand-bronze pl-8 mb-12 uppercase tracking-widest text-sm font-light"
            >
              {routine.excerpt}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button 
                onClick={() => setActiveStepIndex(0)}
                className="group flex items-center gap-6 bg-brand-bronze text-brand-obsidian px-12 py-6 rounded-full micro-label font-black tracking-[0.3em] hover:bg-white transition-all shadow-bronze-glow uppercase"
              >
                COMMENCER LE RITUEL <Play size={20} className="fill-current" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 mt-24">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="prose prose-lg prose-brand max-w-none text-brand-champagne/60 font-light leading-relaxed mb-20 uppercase tracking-widest text-sm">
            <p className="text-2xl font-light text-brand-champagne mb-12 italic leading-relaxed">{parsedContent.intro}</p>
          </div>

          <h3 className="luxury-text text-4xl mb-16 flex items-center gap-4 text-brand-bronze italic uppercase">
             Les Étapes du Rituel <div className="h-[1px] bg-brand-bronze/10 flex-1" />
          </h3>

          <div className="space-y-16">
            {parsedContent.steps.map((step: RoutineStep, idx: number) => {
              const product = recommendedProducts.find(p => p.id === step.productId);
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  key={idx} 
                  className="relative pl-24"
                >
                  <div className="absolute left-0 top-0 w-16 h-16 bg-brand-bronze text-brand-obsidian rounded-full flex items-center justify-center luxury-text text-2xl shadow-premium z-10 font-black italic">
                    {idx + 1}
                  </div>
                  {idx !== parsedContent.steps.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-[-64px] w-[2px] bg-brand-bronze/10" />
                  )}

                  <div className="bg-brand-velvet p-10 rounded-[3rem] border border-white/5 shadow-premium hover:border-brand-bronze/20 transition-all group">
                    <h4 className="luxury-text text-3xl mb-6 text-brand-champagne italic uppercase group-hover:text-brand-bronze transition-colors">{step.title}</h4>
                    <p className="text-brand-champagne/40 font-light text-lg leading-relaxed mb-10 uppercase tracking-widest text-[13px]">
                      {step.description}
                    </p>

                    {product && (
                      <Link 
                        to={`/catalogue/${product.id}`}
                        className="flex items-center gap-6 p-6 bg-brand-obsidian p-2 rounded-3xl group border border-white/5 hover:border-brand-bronze/20 transition-all shadow-premium"
                      >
                         <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-md grayscale group-hover:grayscale-0 transition-all duration-700">
                            <img src={product.main_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                         </div>
                         <div className="flex-1">
                            <p className="micro-label text-brand-bronze mb-1 font-black text-[9px] tracking-widest uppercase">PRODUIT RECOMMANDÉ</p>
                            <h5 className="font-bold text-lg mb-1 text-brand-champagne uppercase tracking-widest">{product.name}</h5>
                            <p className="text-xs text-brand-bronze font-black tracking-widest">{product.price.toLocaleString()} FCFA</p>
                         </div>
                         <div className="p-4 bg-brand-bronze text-brand-obsidian rounded-2xl shadow-premium hover:bg-white transition-colors">
                            <ShoppingBag size={20} />
                         </div>
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-12">
           <div className="sticky top-32 space-y-8">
              <div className="bg-brand-velvet text-brand-champagne p-12 rounded-[3.5rem] shadow-premium relative overflow-hidden border border-white/5">
                 <div className="relative z-10">
                    <h3 className="luxury-text text-3xl mb-6 text-brand-champagne font-medium italic uppercase tracking-widest">Routine Complète</h3>
                    <p className="text-brand-champagne/40 text-xs mb-10 leading-relaxed font-black uppercase tracking-widest">
                      Adoptez l'intégralité du rituel impérial pour maximiser les bienfaits éternels.
                    </p>
                    <button 
                      onClick={orderRoutine}
                      className="bg-brand-bronze text-brand-obsidian w-full flex items-center justify-center gap-3 py-6 rounded-full micro-label font-black tracking-[0.2em] hover:bg-white transition-all shadow-premium uppercase"
                    >
                       <MessageCircle size={20} /> COMMANDER LE PACK
                    </button>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-bronze/10 rounded-full blur-3xl opacity-20" />
              </div>

              <div className="bg-brand-obsidian p-12 rounded-[3.5rem] border border-white/5 shadow-premium">
                 <h4 className="micro-label font-black mb-8 tracking-[0.4em] text-brand-bronze text-[9px] uppercase">PARTAGER LE SECRET</h4>
                 <div className="flex justify-between items-center">
                    <button onClick={() => handleShare('facebook')} className="p-4 bg-white/5 rounded-full hover:bg-brand-bronze hover:text-brand-obsidian transition-all group shadow-premium"><Facebook size={24} className="group-hover:scale-110 transition-transform" /></button>
                    <button onClick={() => handleShare('twitter')} className="p-4 bg-white/5 rounded-full hover:bg-brand-bronze hover:text-brand-obsidian transition-all group shadow-premium"><Twitter size={24} className="group-hover:scale-110 transition-transform" /></button>
                    <button onClick={() => handleShare('whatsapp')} className="p-4 bg-white/5 rounded-full hover:bg-brand-bronze hover:text-brand-obsidian transition-all group shadow-premium"><MessageCircle size={24} className="group-hover:scale-110 transition-transform" /></button>
                    <button onClick={() => handleShare('copy')} className="p-4 bg-white/5 rounded-full hover:bg-brand-bronze hover:text-brand-obsidian transition-all group shadow-premium"><Share2 size={24} className="group-hover:scale-110 transition-transform" /></button>
                 </div>
              </div>

              <div className="p-12 bg-white/5 rounded-[3.5rem] border border-dashed border-white/10 group cursor-pointer hover:border-brand-bronze/40 transition-all">
                 <h4 className="micro-label font-black mb-6 text-brand-bronze tracking-widest uppercase text-[9px]">POUR ALLER PLUS LOIN</h4>
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-bronze text-brand-obsidian rounded-2xl flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform"><CheckCircle2 size={24} /></div>
                    <div>
                       <p className="text-sm font-black mb-1 text-brand-champagne uppercase tracking-widest">Diagnostic de Peau</p>
                       <p className="text-[10px] text-brand-champagne/40 uppercase tracking-widest font-black transition-colors group-hover:text-brand-bronze">Personnalisez votre rituel</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
