import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { TextSlide, Magnetic, Reveal, CinematicImage } from "./ui/motion";

import { dataService, Routine } from "../services/dataService";
import { useDesign } from "../context/DesignContext";
import ImperialRoutines from "./Imperial/ImperialRoutines";

export default function Routines() {
  const { design } = useDesign();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    const loadRoutines = async () => {
      const data = await dataService.getRoutines();
      setRoutines(data);
    };
    loadRoutines();
  }, []);

  const categories = ["Tous", "Grasse", "Sèche", "Mixte", "Normale", "Sensible"];

  if (design === 'imperial') {
    return <ImperialRoutines />;
  }

  const filteredRoutines = routines.filter(r => filter === "Tous" || r.category === filter);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-brand-obsidian text-brand-champagne border-b border-white/5 h-[80vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CinematicImage src="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=2000" className="opacity-20 rounded-none h-full grayscale" alt="Rituals" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-obsidian to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <Reveal className="mb-6">
            <p className="micro-label text-brand-bronze tracking-[0.8em] uppercase font-bold">LES ARCHIVES DU SOIN</p>
          </Reveal>
          <Reveal delay={0.2} className="mb-10">
            <h1 className="luxury-text text-7xl md:text-[10rem] font-black leading-none tracking-tighter text-brand-champagne italic uppercase">RITUELS.</h1>
          </Reveal>
          <Reveal delay={0.4} className="border-l border-brand-bronze/30 pl-10 max-w-2xl">
            <p className="text-xl text-brand-champagne/60 leading-relaxed font-medium italic uppercase tracking-[0.2em]">
              L'art de la transmission impériale. Découvrez nos protocoles sacrés pour sublimer chaque millimètre de votre peau.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-40">
        {/* Filter Bar - Forge UI High Contrast */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-32 border-b border-white/5 pb-16">
          <div className="flex items-center gap-6">
             <span className="micro-label font-black text-brand-bronze tracking-[0.5em] uppercase">TYPE DE PEAU :</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
             {categories.map(cat => (
               <Magnetic key={cat}>
                 <button
                   onClick={() => setFilter(cat)}
                   className={cn(
                     "px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all font-bold cursor-pointer border",
                     filter === cat 
                       ? "bg-brand-bronze border-brand-bronze text-brand-obsidian shadow-premium" 
                       : "border-brand-bronze/10 text-brand-champagne/40 hover:text-brand-bronze"
                   )}
                 >
                   {cat}
                 </button>
               </Magnetic>
             ))}
          </div>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
          <AnimatePresence mode="popLayout">
            {filteredRoutines.map((routine, idx) => (
              <Reveal key={routine.id} delay={idx * 0.1}>
                <article className="group flex flex-col h-full bg-brand-obsidian/40 relative overflow-hidden rounded-[3rem] border border-white/5 pt-1 hover:border-brand-bronze/20 transition-all duration-700 shadow-premium">
                  <Link to={`/routines/${routine.id}`} className="aspect-[4/5] overflow-hidden relative block mx-2 mt-2 rounded-[2.5rem]">
                    <img 
                      src={routine.image} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                      alt={routine.title}
                    />
                    <div className="absolute inset-0 bg-brand-obsidian/20" />
                    <div className="absolute top-10 left-10">
                       <span className="bg-brand-obsidian/60 backdrop-blur-md text-brand-bronze px-8 py-3 rounded-full micro-label text-[9px] tracking-widest font-black shadow-xl border border-brand-bronze/20">
                          {routine.category.toUpperCase()}
                       </span>
                    </div>
                  </Link>

                  <div className="p-12 flex flex-col flex-1">
                     <div className="flex items-center gap-8 mb-8 opacity-40 micro-label font-bold text-[8px] tracking-[0.3em] text-brand-champagne">
                        <span className="flex items-center gap-3 uppercase font-black"><Clock size={14} className="text-brand-bronze"/> 10 MIN</span>
                        <span className="flex items-center gap-3 uppercase font-black"><Sparkles size={14} className="text-brand-bronze"/> EXCELLENCE</span>
                     </div>
                     <h2 className="luxury-text text-4xl mb-6 group-hover:text-brand-bronze transition-colors text-brand-champagne leading-tight italic uppercase">{routine.title}</h2>
                     <p className="text-brand-champagne/60 font-medium italic line-clamp-3 leading-relaxed mb-10 flex-1 uppercase tracking-widest text-[11px]">
                       "{routine.excerpt}"
                     </p>
                     <Magnetic>
                       <Link 
                         to={`/routines/${routine.id}`}
                         className="inline-flex items-center gap-4 micro-label font-black text-brand-bronze group-hover:gap-8 transition-all uppercase tracking-widest"
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

      {/* Newsletter */}
      <section className="bg-brand-velvet border-t border-white/5 py-40 px-6 overflow-hidden relative">
         <div className="absolute inset-0 bg-brand-bronze/5 blur-[100px] rounded-full scale-150 opacity-20" />
         <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="luxury-text text-4xl md:text-6xl mb-8 leading-tight text-brand-champagne italic uppercase">Rituels Sacrés</h2>
            <p className="text-brand-champagne/40 micro-label tracking-[0.3em] font-black mb-12 uppercase">Inscrivez-vous à l'archive impériale</p>
            <div className="flex flex-col sm:flex-row gap-6 mt-12 bg-brand-obsidian p-2 rounded-full border border-white/10 shadow-premium">
               <input 
                 type="email" 
                 placeholder="VOTRE ADRESSE EMAIL" 
                 className="flex-1 bg-transparent text-brand-champagne border-none rounded-full px-10 py-5 micro-label focus:outline-none placeholder:text-brand-champagne/20 uppercase font-black"
               />
               <button className="bg-brand-bronze text-brand-obsidian px-16 py-5 rounded-full micro-label font-black tracking-widest hover:bg-white transition-all shadow-premium uppercase">
                  S'ABONNER
               </button>
            </div>
         </div>
      </section>
    </div>
  );
}
