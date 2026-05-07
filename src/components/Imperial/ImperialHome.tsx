import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowDown, Sparkles } from 'lucide-react';
import { Reveal, Magnetic, CinematicImage } from '../ui/motion';
import { Testimonials } from '../Testimonials';

const ImperialHome = () => {
  return (
    <div className="bg-[#0A0A0A] text-[#E8D9C5] selection:bg-[#C19A6B] selection:text-black">
      {/* Hero Section - Imperial Majesty */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <CinematicImage 
            src="https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
        </div>

        <div className="relative z-10 text-center px-6">
          <Reveal delay={0.2}>
            <span className="block text-[10px] tracking-[0.8em] text-[#C19A6B] mb-8 uppercase font-bold">
              DEPUIS LA PREMIÈRE DYNASTIE
            </span>
          </Reveal>
          
          <Reveal delay={0.4}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tighter mb-8 text-white leading-none italic">
              PRÉCIEUSE EMPIRE
            </h1>
          </Reveal>

          <Reveal delay={0.6}>
            <p className="max-w-xl mx-auto text-lg md:text-xl font-light italic text-[#E8D9C5]/80 mb-12 leading-relaxed">
              La sagesse ancestrale distillée dans des rituels de beauté sacrés. Un sanctuaire d'élégance impériale pour le souverain moderne.
            </p>
          </Reveal>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Reveal delay={0.8}>
              <Magnetic>
                <Link to="/routines" className="px-10 py-5 bg-[#C19A6B] text-black font-bold text-xs tracking-[0.3em] uppercase hover:bg-white transition-all duration-500 shadow-[0_0_40px_rgba(193,154,107,0.3)]">
                  Rituels Impériaux
                </Link>
              </Magnetic>
            </Reveal>
            <Reveal delay={0.9}>
              <Magnetic>
                <Link to="/a-propos" className="px-10 py-5 border border-[#C19A6B]/30 text-[#E8D9C5] font-bold text-xs tracking-[0.3em] uppercase hover:bg-white/10 transition-all duration-500">
                  L'Héritage
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
          <span className="text-[8px] tracking-[0.5em] uppercase font-bold">Défiler pour s'élever</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[1px] h-12 bg-[#C19A6B]"
          />
        </div>
      </section>

      {/* L'Origine - Sacred Lineage */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <Reveal>
              <span className="text-[10px] tracking-[0.6em] text-[#C19A6B] mb-6 block uppercase font-bold">L'ORIGINE</span>
              <h2 className="text-5xl md:text-7xl font-serif italic mb-10 leading-tight">
                Lignée Sacrée. <br/>
                <span className="text-[#C19A6B]">Savoir-faire</span> sans compromis.
              </h2>
              <p className="text-lg opacity-60 leading-relaxed mb-12 font-light">
                Au-delà de la beauté se cache un héritage de puissance. PRÉCIEUSE EMPIRE est né des archives des cours royales oubliées, où l'alchimie des plantes rares rencontrait la précision du décret impérial.
              </p>
              <div className="border-l border-[#C19A6B]/30 pl-8 pt-2">
                <p className="italic text-xl text-[#E8D9C5]/80 mb-4">"La vraie beauté n'est pas un masque, mais un couronnement de l'esprit."</p>
                <p className="text-[10px] tracking-[0.3em] text-[#C19A6B] uppercase font-bold">— La Première Matriarche</p>
              </div>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-6 items-start">
             <div className="col-span-2 aspect-square rounded-sm overflow-hidden mb-6">
                <img src="https://images.unsplash.com/photo-1596462502278-27bfaf43399f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Sacred" />
             </div>
             <div className="aspect-square bg-[#1A1A1A] p-10 flex flex-col justify-center items-center text-center border border-[#C19A6B]/10">
                <h4 className="text-3xl font-serif mb-2">12</h4>
                <p className="text-[8px] tracking-[0.2em] font-bold text-[#C19A6B] uppercase">Mois de maturation</p>
             </div>
             <div className="aspect-square rounded-sm overflow-hidden border border-[#C19A6B]/10">
                <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale" alt="Boutille" />
             </div>
          </div>
        </div>
      </section>

      {/* The Imperial Collections */}
      <section className="py-40 bg-[#070707] border-y border-[#C19A6B]/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C19A6B]/2 rounded-full blur-[150px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal className="text-center mb-32">
            <h2 className="text-5xl md:text-8xl font-serif italic mb-4">LES COLLECTIONS IMPÉRIALES</h2>
            <div className="w-24 h-[1px] bg-[#C19A6B] mx-auto" />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="lg:row-span-2 group cursor-pointer">
              <Reveal className="h-full">
                <div className="relative h-[800px] overflow-hidden rounded-sm border border-[#C19A6B]/10 group-hover:border-[#C19A6B]/30 transition-all duration-700">
                  <img src="https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="Signature" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-12">
                    <span className="text-[10px] tracking-[0.5em] text-[#C19A6B] mb-4 uppercase font-bold">SIGNATURE</span>
                    <h3 className="text-4xl font-serif italic mb-6">L'Éclat du Roi Soleil</h3>
                    <p className="text-[10px] tracking-[0.2em] font-bold uppercase hover:text-[#C19A6B] transition-colors">Explorer le Rituel</p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="group cursor-pointer">
              <Reveal delay={0.2}>
                <div className="relative aspect-[16/11] overflow-hidden rounded-sm border border-[#C19A6B]/10">
                  <img src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all duration-1000" alt="Elixir" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-3xl font-serif italic text-white flex flex-col items-center gap-4">
                      Élixirs de Minuit
                      <div className="h-px w-0 group-hover:w-16 bg-[#C19A6B] transition-all duration-700" />
                    </h3>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="group cursor-pointer">
               <Reveal delay={0.4}>
                  <div className="bg-[#C19A6B] aspect-square p-16 flex flex-col justify-between text-black transition-all hover:bg-white">
                    <div>
                      <h3 className="text-4xl font-serif italic mb-4 leading-none">Essence Rare</h3>
                      <p className="text-xs leading-relaxed opacity-70">Sourcée des hauts plateaux d'Éthiopie. Une vibration d'or pur.</p>
                    </div>
                    <ChevronRight size={32} />
                  </div>
               </Reveal>
            </div>

            <div className="lg:col-span-1 group cursor-pointer overflow-hidden rounded-sm border border-[#C19A6B]/10">
               <Reveal delay={0.6}>
                  <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600" className="w-full aspect-square object-cover grayscale opacity-30 group-hover:opacity-60 transition-all duration-700" />
               </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Footer Imperial */}
      <footer className="py-32 px-6 bg-black text-center border-t border-[#C19A6B]/10">
        <h2 className="text-4xl font-serif italic mb-16 tracking-widest">PRÉCIEUSE EMPIRE</h2>
        <div className="flex flex-wrap justify-center gap-12 mb-20 text-[10px] tracking-[0.4em] uppercase font-bold text-[#E8D9C5]/40">
           <Link to="/" className="hover:text-[#C19A6B] transition-colors">Le Sanctuaire</Link>
           <Link to="/a-propos" className="hover:text-[#C19A6B] transition-colors">Éthos</Link>
           <Link to="#" className="hover:text-[#C19A6B] transition-colors">Confidentialité</Link>
           <Link to="#" className="hover:text-[#C19A6B] transition-colors">Contact</Link>
        </div>
        <p className="text-[8px] tracking-[0.3em] uppercase opacity-20">
          © 2024 PRÉCIEUSE EMPIRE. SÉCURISÉ PAR DÉCRET IMPÉRIAL.
        </p>
      </footer>
    </div>
  );
};

export default ImperialHome;
