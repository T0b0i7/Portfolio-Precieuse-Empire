import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Reveal, CinematicImage } from '../ui/motion';

const ImperialRoutines = () => {
  const rituals = [
    {
      id: 1,
      title: "Dawn Sovereignty",
      desc: "Le réveil de l'esprit par la lumière et l'alchimie botanique.",
      image: "https://images.unsplash.com/photo-1596462502278-27bfaf43399f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Solar Zenith",
      desc: "Protection active et maintien d'une aura impériale lumineuse.",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "Nocturnal Descent",
      desc: "Restauration cellulaire profonde dans le silence de la nuit.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="bg-[#0A0A0A] text-[#E8D9C5] pt-40 min-h-screen font-serif">
      <section className="px-6 max-w-5xl mx-auto text-center mb-40">
        <Reveal>
          <span className="text-[10px] tracking-[0.5em] text-[#C19A6B] mb-8 block uppercase font-bold">TRANSCENDER L'ORDINAIRE</span>
          <h1 className="text-5xl md:text-8xl italic mb-12 leading-tight">
            Rituels de <span className="text-[#C19A6B]">Beauté</span> Sacrés
          </h1>
          <p className="text-lg opacity-60 leading-relaxed font-light italic">
            Entrez dans le Sanctuaire Impérial. Chaque routine est un acte de dévotion délibéré, conçu à partir de la sagesse ancestrale et raffiné pour le souverain moderne.
          </p>
        </Reveal>
      </section>

      <section className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-60">
        {rituals.map((ritual, idx) => (
          <Reveal key={ritual.id} delay={idx * 0.2}>
            <div className="group cursor-pointer">
              <div className="aspect-[4/5] bg-[#0F0F0F] rounded-sm overflow-hidden mb-10 border border-[#C19A6B]/10">
                <img src={ritual.image} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[1.5s]" alt={ritual.title} />
              </div>
              <h3 className="text-3xl italic mb-6 text-[#C19A6B]">{ritual.title}</h3>
              <p className="text-xs opacity-50 leading-loose italic">{ritual.desc}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Cleansing as a Ceremony */}
      <section className="py-40 bg-[#070707] relative overflow-hidden mb-40">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <Reveal>
              <span className="text-[10px] tracking-[0.4em] text-[#C19A6B] mb-6 block uppercase font-bold">ÉTAPE 01: LA PURIFICATION</span>
              <h2 className="text-5xl md:text-7xl italic mb-10">Le Nettoyage comme une Cérémonie.</h2>
              <p className="italic text-xl opacity-60 mb-16 leading-relaxed">"Avant que la couronne ne soit portée, la peau doit être débarrassée de tout ce qui n'est pas de soi."</p>
              
              <div className="space-y-12">
                 <div className="flex gap-8 group">
                    <span className="text-3xl font-light text-[#C19A6B]/30 group-hover:text-[#C19A6B]">I.</span>
                    <div>
                       <h4 className="text-[10px] tracking-[0.3em] font-bold uppercase mb-4">Activation Thermale</h4>
                       <p className="text-xs opacity-40 italic">Eau chaude infusée à l'Essence de Néroli pour ouvrir les portes de la peau.</p>
                    </div>
                 </div>
                 <div className="flex gap-8 group">
                    <span className="text-3xl font-light text-[#C19A6B]/30 group-hover:text-[#C19A6B]">II.</span>
                    <div>
                       <h4 className="text-[10px] tracking-[0.3em] font-bold uppercase mb-4">Massage Obsidian</h4>
                       <p className="text-xs opacity-40 italic">Cercles lents et rythmiques utilisant la pierre volcanique pour extraire les impuretés.</p>
                    </div>
                 </div>
              </div>
            </Reveal>
            <Reveal delay={0.4} className="relative">
               <div className="aspect-square border border-[#C19A6B]/20 p-4">
                  <img src="https://images.unsplash.com/photo-1590156221122-c748e7898b0a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Ceremony" />
               </div>
            </Reveal>
         </div>
      </section>

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

export default ImperialRoutines;
