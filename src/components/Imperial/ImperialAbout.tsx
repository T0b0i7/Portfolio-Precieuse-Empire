import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Reveal, Magnetic, CinematicImage } from '../ui/motion';
import { dataService, AboutContent } from '../../services/dataService';

const ImperialAbout = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await dataService.getAbout();
        setContent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading || !content) return (
    <div className="h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#C19A6B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#0A0A0A] text-[#E8D9C5] pt-40 min-h-screen font-serif">
      {/* Hero Heritage */}
      <section className="px-6 max-w-7xl mx-auto text-center mb-40">
        <Reveal>
          <span className="text-[10px] tracking-[0.5em] text-[#C19A6B] mb-8 block uppercase font-bold">NOTRE ÉTHOS</span>
          <h1 className="text-5xl md:text-8xl italic mb-12 leading-tight">
            {content.hero_title}
          </h1>
          <div className="max-w-3xl mx-auto border-l-2 border-[#C19A6B]/20 pl-12 py-4 text-left">
             <p className="text-xl md:text-2xl opacity-80 leading-relaxed font-light italic mb-8">
               {content.hero_subtitle}
             </p>
             <p className="text-[10px] tracking-[0.4em] font-bold text-[#C19A6B] uppercase">— ÉDIT DE LA FONDATRICE</p>
          </div>
        </Reveal>
      </section>

      {/* Philosophy sections */}
      <section className="py-40 border-y border-[#C19A6B]/5">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <Reveal>
               <h2 className="text-4xl md:text-6xl italic mb-10 leading-tight">{content.story_title}</h2>
               <div className="space-y-8 prose prose-invert prose-lg">
                  <p className="text-lg opacity-60 font-light italic leading-loose">
                    {content.story_text_1}
                  </p>
                  <p className="text-lg opacity-60 font-light italic leading-loose">
                    {content.story_text_2}
                  </p>
               </div>
            </Reveal>
            <Reveal delay={0.4}>
               <div className="aspect-[4/5] rounded-sm overflow-hidden border border-[#C19A6B]/10">
                  <CinematicImage src={content.hero_image} className="w-full h-full object-cover grayscale brightness-75" alt="Story image" />
               </div>
            </Reveal>
         </div>
      </section>

      {/* Mission block */}
      <section className="py-40 px-6 max-w-5xl mx-auto text-center">
         <Reveal>
            <h2 className="text-3xl md:text-5xl italic mb-8 leading-tight">Notre Mission Sacrée</h2>
            <p className="text-2xl opacity-80 font-light italic leading-relaxed text-[#C19A6B]">
               {content.mission_text}
            </p>
         </Reveal>
      </section>

      {/* The Pillars */}
      <section className="py-40 px-6 max-w-7xl mx-auto border-t border-[#C19A6B]/5">
        <h2 className="text-4xl md:text-6xl text-center italic mb-32">Les Piliers de l'Empire</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
           {content.values.slice(0, 3).map((p, idx) => (
             <Reveal key={idx} delay={idx * 0.2}>
                <div className="text-center">
                   <div className="w-12 h-12 rounded-full bg-[#C19A6B]/10 mx-auto mb-8 flex items-center justify-center text-[#C19A6B]">
                      <div className="w-2 h-2 rounded-full bg-[#C19A6B]" />
                   </div>
                   <h3 className="text-3xl italic mb-6">{p.title}</h3>
                   <p className="text-[11px] opacity-40 uppercase tracking-[0.3em] leading-relaxed font-bold">{p.desc}</p>
                </div>
             </Reveal>
           ))}
        </div>
      </section>

      {/* Team Heritage */}
      <section className="py-40 px-6 max-w-7xl mx-auto border-t border-[#C19A6B]/5">
         <h2 className="text-4xl md:text-6xl text-center italic mb-32">La Garde Impériale</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {content.team.map((member, idx) => (
               <Reveal key={idx} delay={idx * 0.2}>
                  <div className="text-center group">
                     <div className="aspect-[3/4] rounded-sm overflow-hidden border border-[#C19A6B]/5 mb-8 grayscale group-hover:grayscale-0 transition-all duration-1000">
                        <img src={member.image} className="w-full h-full object-cover" alt={member.name} />
                     </div>
                     <h3 className="text-2xl italic mb-2">{member.name}</h3>
                     <p className="text-[9px] tracking-[0.3em] font-bold text-[#C19A6B] uppercase">{member.role}</p>
                  </div>
               </Reveal>
            ))}
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

export default ImperialAbout;
