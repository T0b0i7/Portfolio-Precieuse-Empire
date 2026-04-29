import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, MessageCircle, Share2, Facebook, Twitter, Clock, Sparkles, CheckCircle2, ShoppingBag } from "lucide-react";
import { cn } from "@/src/lib/utils";
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

  useEffect(() => {
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
          const content = JSON.parse(found.content);
          setParsedContent(content);
          
          const pIds = JSON.parse(found.product_ids || "[]");
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
    <div className="pb-32">
      {/* Hero Header */}
      <section className="relative h-[80vh] min-h-[600px] flex items-end">
        <div className="absolute inset-0">
          <img src={routine.image} className="w-full h-full object-cover" alt={routine.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ebony via-brand-ebony/20 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-20">
          <Link to="/routines" className="inline-flex items-center gap-2 micro-label text-brand-cream/80 mb-12 hover:text-brand-gold transition-colors">
            <ChevronLeft size={16} /> RETOUR AUX RITUELS
          </Link>
          
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 mb-8"
            >
               <span className="bg-brand-gold text-white px-6 py-2 rounded-full micro-label text-[10px] shadow-xl">
                 {routine.category}
               </span>
               <div className="flex items-center gap-4 text-brand-cream/60 micro-label">
                  <span className="flex items-center gap-2"><Clock size={16} /> 15 MIN</span>
                  <span className="flex items-center gap-2"><Sparkles size={16} /> EXPERT</span>
               </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="luxury-text text-5xl md:text-8xl text-brand-cream lg:leading-tight mb-8"
            >
              {routine.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-brand-cream/70 leading-relaxed max-w-2xl italic border-l-2 border-brand-gold pl-8"
            >
              {routine.excerpt}
            </motion.p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 mt-24">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="prose prose-lg prose-brand max-w-none text-ui-muted font-medium leading-relaxed mb-20">
            <p className="text-2xl font-light text-brand-ebony mb-12">{parsedContent.intro}</p>
          </div>

          <h3 className="luxury-text text-4xl mb-16 flex items-center gap-4 text-brand-ebony">
             Les Étapes du Rituel <div className="h-[1px] bg-brand-ebony/10 flex-1" />
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
                  <div className="absolute left-0 top-0 w-16 h-16 bg-brand-ebony text-brand-cream rounded-full flex items-center justify-center luxury-text text-2xl shadow-xl z-10">
                    {idx + 1}
                  </div>
                  {idx !== parsedContent.steps.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-[-64px] w-[2px] bg-brand-ebony/5" />
                  )}

                  <div className="bg-white p-10 rounded-[3rem] border border-brand-ebony/5 shadow-sm hover:shadow-xl transition-shadow">
                    <h4 className="luxury-text text-3xl mb-6 text-brand-ebony">{step.title}</h4>
                    <p className="text-ui-muted font-medium text-lg leading-relaxed mb-10">
                      {step.description}
                    </p>

                    {product && (
                      <Link 
                        to={`/catalogue/${product.id}`}
                        className="flex items-center gap-6 p-6 bg-brand-cream/50 rounded-3xl group border border-transparent hover:border-brand-gold/20 transition-all"
                      >
                         <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-md">
                            <img src={product.main_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                         </div>
                         <div className="flex-1">
                            <p className="micro-label text-brand-gold mb-1">PRODUIT RECOMMANDÉ</p>
                            <h5 className="font-bold text-lg mb-1">{product.name}</h5>
                            <p className="text-sm opacity-50">{product.price.toLocaleString()} FCFA</p>
                         </div>
                         <div className="p-4 bg-white rounded-2xl shadow-sm text-brand-ebony group-hover:bg-brand-gold group-hover:text-brand-ebony transition-colors">
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
              <div className="bg-brand-ebony text-brand-cream p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="luxury-text text-3xl mb-6 text-white font-medium">Routine Complète</h3>
                    <p className="text-brand-champagne/60 text-sm mb-10 leading-relaxed font-medium">
                      Adoptez l'intégralité du rituel pour maximiser les bienfaits sur votre peau. Tous les produits sont disponibles au showroom.
                    </p>
                    <button 
                      onClick={orderRoutine}
                      className="btn-whatsapp w-full flex items-center justify-center gap-3"
                    >
                       <MessageCircle size={20} /> COMMANDER LE PACK
                    </button>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl" />
              </div>

              <div className="bg-white p-12 rounded-[3.5rem] border border-brand-ink/5 shadow-sm">
                 <h4 className="micro-label font-bold mb-8 tracking-widest text-brand-ink/40">PARTAGER LE SECRET</h4>
                 <div className="flex justify-between items-center">
                    <button onClick={() => handleShare('facebook')} className="p-4 bg-brand-ink/5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all"><Facebook size={24} /></button>
                    <button onClick={() => handleShare('twitter')} className="p-4 bg-brand-ink/5 rounded-full hover:bg-sky-50 hover:text-sky-500 transition-all"><Twitter size={24} /></button>
                    <button onClick={() => handleShare('whatsapp')} className="p-4 bg-brand-ink/5 rounded-full hover:bg-green-50 hover:text-green-600 transition-all"><MessageCircle size={24} /></button>
                    <button onClick={() => handleShare('copy')} className="p-4 bg-brand-ink/5 rounded-full hover:bg-brand-gold hover:text-white transition-all"><Share2 size={24} /></button>
                 </div>
              </div>

              <div className="p-12 bg-brand-cream/50 rounded-[3.5rem] border border-dashed border-brand-ink/10">
                 <h4 className="micro-label font-bold mb-6 text-brand-gold">POUR ALLER PLUS LOIN</h4>
                 <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-gold"><CheckCircle2 size={24} /></div>
                    <div>
                       <p className="text-sm font-bold mb-1">Diagnostic de Peau</p>
                       <p className="text-xs opacity-40">Personnalisez votre routine</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
