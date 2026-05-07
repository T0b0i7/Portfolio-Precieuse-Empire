import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Reveal, Magnetic, CinematicImage } from '../ui/motion';

const ImperialEvents = () => {
  const testimonials = [
    {
      author: "Baron Malik El-Amin",
      role: "MÉCÈNE FONDATEUR",
      content: "Appartenir à l'Empire, c'est marcher entre les mondes. Les rituels ne sont pas de simples événements ; ce sont des voyages transcendantaux dans notre propre royauté."
    },
    {
      author: "Lady Seraphina Vance",
      role: "SCULPTRICE CRÉATIVE",
      content: "L'attention aux détails est stupéfiante. Chaque parfum, chaque lumière, chaque texture parle d'un héritage qui a été réinventé pour l'élite moderne."
    },
    {
      author: "Chef Ibrahim Okefor",
      role: "INTENDANT SUPÉRIEUR",
      content: "Précieuse Empire a créé un espace où le silence est aussi puissant que la musique. C'est le sanctuaire ultime pour le raffinement de l'âme."
    }
  ];

  return (
    <div className="bg-[#0A0A0A] text-[#E8D9C5] pt-40 min-h-screen font-serif">
      {/* Hero Events */}
      <section className="px-6 max-w-7xl mx-auto text-center mb-40">
        <Reveal>
          <span className="text-[10px] tracking-[0.5em] text-[#C19A6B] mb-8 block uppercase font-bold">RASSEMBLEMENTS CURATÉS</span>
          <h1 className="text-5xl md:text-8xl italic mb-12 leading-tight">
            Événements <span className="text-[#C19A6B]">Impériaux</span> Exclusifs
          </h1>
          <p className="text-lg opacity-60 leading-relaxed font-light italic max-w-2xl mx-auto">
            Sur invitation uniquement. Découvrez l'intersection de la majesté antique et du luxe contemporain dans nos rituels saisonniers privés.
          </p>
        </Reveal>
      </section>

      {/* Featured Event Card */}
      <section className="px-6 max-w-7xl mx-auto mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 group cursor-pointer">
           <div className="aspect-video lg:aspect-square overflow-hidden rounded-sm border border-[#C19A6B]/10">
              <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="Event" />
           </div>
           <div className="flex flex-col justify-center border-y border-[#C19A6B]/10 py-20 px-8">
              <span className="text-[10px] tracking-[0.4em] text-[#C19A6B] mb-4 uppercase font-bold">L'ÉQUINOXE</span>
              <h2 className="text-4xl md:text-6xl italic mb-6">Le Rituel du Solstice d'Ambre</h2>
              <p className="text-sm opacity-40 mb-10 tracking-[0.2em] font-bold">DAKAR, SÉNÉGAL | DÉCEMBRE 2024</p>
              <p className="text-lg opacity-60 mb-12 font-light italic">Une soirée d'exploration sensorielle et de dévoilement de parfums ancestraux au cœur de la Citadelle.</p>
              <button className="text-[10px] tracking-[0.3em] font-bold text-[#C19A6B] uppercase flex items-center gap-4 group-hover:gap-8 transition-all">Demander l'accès →</button>
           </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-40 border-y border-[#C19A6B]/10">
         <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-32">
               <span className="text-[10px] tracking-[0.5em] text-[#C19A6B] mb-6 block uppercase font-bold">VOIX DE L'EMPIRE</span>
               <h2 className="text-5xl md:text-7xl italic font-serif leading-tight">Témoignages Impériaux</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
               {testimonials.map((t, i) => (
                 <Reveal key={i} delay={i * 0.2}>
                    <div className="text-center group">
                       <div className="w-20 h-20 rounded-full mx-auto mb-10 overflow-hidden border border-[#C19A6B]/30 grayscale group-hover:grayscale-0 transition-all duration-700">
                          <img src={`https://i.pravatar.cc/150?u=${i}`} alt={t.author} className="w-full h-full object-cover" />
                       </div>
                       <p className="text-lg italic opacity-70 mb-10 leading-relaxed">"{t.content}"</p>
                       <h4 className="text-[10px] tracking-[0.3em] font-black uppercase text-[#C19A6B] mb-2">{t.author}</h4>
                       <p className="text-[8px] tracking-[0.2em] uppercase opacity-30">{t.role}</p>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* Application Form */}
      <section className="py-60 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
           <div>
              <h2 className="text-4xl md:text-6xl italic mb-10 leading-tight">Revendiquez votre place au sein de l'Empire</h2>
              <p className="text-lg opacity-60 font-light italic mb-12">L'adhésion est strictement limitée et validée par le Haut Conseil. Nous recherchons des individus qui incarnent nos valeurs de patrimoine, de discrétion et d'excellence avant-gardiste.</p>
              <div className="space-y-8">
                 <div className="flex gap-6 items-center">
                    <div className="w-2 h-2 rounded-full bg-[#C19A6B]" />
                    <p className="text-[10px] tracking-[0.2em] font-bold uppercase opacity-80">Curation Prioritaire</p>
                 </div>
                 <div className="flex gap-6 items-center">
                    <div className="w-2 h-2 rounded-full bg-[#C19A6B]" />
                    <p className="text-[10px] tracking-[0.2em] font-bold uppercase opacity-80">Rituels Privés</p>
                 </div>
              </div>
           </div>
           
           <div className="space-y-12">
              <div className="space-y-3">
                 <label className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#C19A6B]">Appellation Complète</label>
                 <input type="text" className="w-full bg-transparent border-b border-[#C19A6B]/20 py-4 focus:outline-none focus:border-[#C19A6B] text-[#E8D9C5] transition-all" />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#C19A6B]">Correspondance Numérique</label>
                 <input type="email" className="w-full bg-transparent border-b border-[#C19A6B]/20 py-4 focus:outline-none focus:border-[#C19A6B] text-[#E8D9C5] transition-all" />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#C19A6B]">Intérêt Principal</label>
                 <select className="w-full bg-transparent border-b border-[#C19A6B]/20 py-4 focus:outline-none focus:border-[#C19A6B] text-[#E8D9C5] transition-all appearance-none cursor-pointer">
                    <option value="collection">Collection Signature</option>
                    <option value="rituals">Rituels Saisonniers</option>
                    <option value="gala">Galas Impériaux</option>
                 </select>
              </div>
              <button className="w-full py-6 bg-[#C19A6B] text-black font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-white transition-all shadow-xl">Soumettre la pétition 🔒</button>
           </div>
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

export default ImperialEvents;
