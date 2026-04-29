import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { TextSlide, Magnetic, Reveal, CinematicImage } from "./ui/motion";

import { dataService, Routine } from "../services/dataService";

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [filter, setFilter] = useState("Tous");
  const categories = ["Tous", "Grasse", "Sèche", "Mixte", "Normale", "Sensible"];

  useEffect(() => {
    const loadRoutines = async () => {
      const data = await dataService.getRoutines();
      setRoutines(data);
    };
    loadRoutines();
  }, []);

  const filteredRoutines = routines.filter(r => filter === "Tous" || r.category === filter);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-brand-ebony text-brand-cream border-b border-white/5 h-[80vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CinematicImage src="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=2000" className="opacity-30 rounded-none h-full" alt="Rituals" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-ebony to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <TextSlide className="mb-6">
            <p className="micro-label text-brand-gold tracking-[0.8em] uppercase font-bold">LES ARCHIVES DU SOIN</p>
          </TextSlide>
          <TextSlide delay={0.2} className="mb-10">
            <h1 className="luxury-text text-7xl md:text-[10rem] font-black leading-none tracking-tighter text-white">RITUELS.</h1>
          </TextSlide>
          <Reveal delay={0.4} className="border-l border-brand-gold/30 pl-10 max-w-2xl">
            <p className="text-xl text-brand-cream/60 leading-relaxed font-medium italic">
              L'art de la transmission. Découvrez nos protocoles sacrés, où la science moderne rencontre la sagesse ancestrale pour sublimer chaque millimètre de votre peau.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-40">
        {/* Filter Bar - Forge UI High Contrast */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-32 border-b border-brand-ebony/5 pb-16">
          <div className="flex items-center gap-6">
             <span className="micro-label font-black text-brand-gold tracking-[0.5em]">TYPE DE PEAU :</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
             {categories.map(cat => (
               <Magnetic key={cat}>
                 <button
                   onClick={() => setFilter(cat)}
                   className={cn(
                     "px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all font-bold cursor-pointer border",
                     filter === cat 
                       ? "bg-brand-gold border-brand-gold text-brand-ebony shadow-lg" 
                       : "border-brand-ebony/10 text-brand-ebony/40 hover:text-brand-ebony"
                   )}
                 >
                   {cat}
                 </button>
               </Magnetic>
             ))}
          </div>
        </div>

        {/* Magazine Grid - Vengence UI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
          <AnimatePresence mode="popLayout">
            {filteredRoutines.map((routine, idx) => (
              <Reveal key={routine.id} delay={idx * 0.1}>
                <article className="group flex flex-col h-full bg-white relative overflow-hidden rounded-[3rem] border border-brand-ink/5 pt-1 hover:border-brand-gold/20 transition-all duration-700 shadow-sm hover:shadow-2xl">
                  <Link to={`/routines/${routine.id}`} className="aspect-[4/5] overflow-hidden relative block mx-2 mt-2 rounded-[2.5rem]">
                    <img 
                      src={routine.image} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                      alt={routine.title}
                    />
                    <div className="absolute inset-0 bg-brand-ebony/5" />
                    <div className="absolute top-10 left-10">
                       <span className="bg-brand-cream/90 backdrop-blur-md text-brand-ebony px-8 py-3 rounded-full micro-label text-[9px] tracking-widest font-black shadow-xl">
                          {routine.category.toUpperCase()}
                       </span>
                    </div>
                  </Link>

                  <div className="p-12 flex flex-col flex-1">
                     <div className="flex items-center gap-8 mb-8 opacity-40 micro-label font-bold text-[8px] tracking-[0.3em]">
                        <span className="flex items-center gap-3"><Clock size={14} className="text-brand-gold"/> 10 MIN</span>
                        <span className="flex items-center gap-3"><Sparkles size={14} className="text-brand-gold"/> EXCELLENCE</span>
                     </div>
                     <h2 className="luxury-text text-4xl mb-6 group-hover:text-brand-gold transition-colors text-brand-ebony leading-tight">{routine.title}</h2>
                     <p className="text-ui-muted font-medium italic line-clamp-3 leading-relaxed mb-10 flex-1 opacity-60">
                       "{routine.excerpt}"
                     </p>
                     <Magnetic>
                       <Link 
                         to={`/routines/${routine.id}`}
                         className="inline-flex items-center gap-4 micro-label font-black text-brand-gold group-hover:gap-8 transition-all"
                       >
                         ENTRER DANS LE RITUEL <ChevronRight size={18} />
                       </Link>
                     </Magnetic>
                  </div>
                </article>
              </Reveal>
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
