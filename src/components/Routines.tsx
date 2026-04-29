import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Clock, Sparkles, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";

interface Routine {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
}

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [filter, setFilter] = useState("Tous");
  const categories = ["Tous", "Grasse", "Sèche", "Mixte", "Normale", "Sensible"];

  useEffect(() => {
    fetch("/api/routines")
      .then(res => res.json())
      .then(setRoutines);
  }, []);

  const filteredRoutines = routines.filter(r => filter === "Tous" || r.category === filter);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-brand-ebony text-brand-cream py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="micro-label text-brand-gold mb-6 tracking-[0.4em]"
          >
            L'ART DU SOIN
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="luxury-text text-5xl md:text-8xl font-light mb-8 lg:leading-tight text-white"
          >
            Rituels & Secrets <br /> de Teint
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-cream/60 max-w-2xl mx-auto leading-relaxed"
          >
            Découvrez nos guides éditoriaux conçus pour accompagner chaque peau vers son plein potentiel. La beauté est un héritage que nous cultivons ensemble.
          </motion.p>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-1/2 left-10 w-96 h-96 bg-brand-gold rounded-full blur-[120px]" />
           <div className="absolute bottom-0 right-10 w-96 h-96 bg-brand-gold rounded-full blur-[120px]" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 border-b border-brand-ebony/5 pb-12">
          <div className="flex items-center gap-3">
             <Filter size={16} className="text-brand-gold" />
             <span className="micro-label font-bold text-brand-ebony">TYPE DE PEAU</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar w-full md:w-auto pb-4 md:pb-0">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setFilter(cat)}
                 className={cn(
                   "px-8 py-3 rounded-full micro-label whitespace-nowrap transition-all font-bold cursor-pointer",
                   filter === cat 
                     ? "bg-brand-gold text-brand-ebony shadow-lg" 
                     : "bg-brand-ebony/5 text-brand-ebony/60 hover:bg-brand-ebony/10"
                 )}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredRoutines.map((routine, idx) => (
              <motion.article
                key={routine.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col h-full bg-white rounded-[3rem] overflow-hidden border border-brand-ink/5 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <Link to={`/routines/${routine.id}`} className="aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={routine.image} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                    alt={routine.title}
                  />
                  <div className="absolute top-8 left-8">
                     <span className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full micro-label text-brand-ink shadow-lg">
                        {routine.category}
                     </span>
                  </div>
                </Link>

                <div className="p-10 flex flex-col flex-1">
                   <div className="flex items-center gap-4 mb-6 opacity-40 micro-label font-bold">
                      <span className="flex items-center gap-2"><Clock size={14} /> 10 MIN</span>
                      <span className="flex items-center gap-2"><Sparkles size={14} /> {routine.category.toUpperCase()}</span>
                   </div>
                   <h2 className="luxury-text text-3xl mb-4 group-hover:text-brand-gold transition-colors text-brand-ebony">{routine.title}</h2>
                   <p className="text-ui-muted font-medium line-clamp-3 leading-relaxed mb-8 flex-1">
                     {routine.excerpt}
                   </p>
                   <Link 
                     to={`/routines/${routine.id}`}
                     className="inline-flex items-center gap-2 micro-label font-bold text-brand-gold group/link"
                   >
                     LIRE LA ROUTINE <ChevronRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                   </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredRoutines.length === 0 && (
          <div className="text-center py-32">
             <h3 className="luxury-text text-3xl opacity-20 italic">Bientôt de nouveaux secrets partagés...</h3>
          </div>
        )}
      </div>

      {/* Newsletter / Subscription CTA */}
      <section className="bg-brand-champagne border-t border-brand-ebony/5 py-32 px-6">
         <div className="max-w-3xl mx-auto text-center">
            <h2 className="luxury-text text-4xl mb-8 leading-tight text-brand-ebony">Recevez nos rituels sacrés directement dans votre boîte mail</h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
               <input 
                 type="email" 
                 placeholder="Votre adresse email" 
                 className="flex-1 bg-white/50 border border-brand-ebony/10 rounded-full px-8 py-5 micro-label focus:outline-none focus:border-brand-gold"
               />
               <button className="btn-primary px-12 py-5">
                  S'ABONNER
               </button>
            </div>
         </div>
      </section>
    </div>
  );
}
