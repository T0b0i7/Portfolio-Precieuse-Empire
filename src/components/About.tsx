import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Heart, Globe, Award, Sparkles, ChevronRight, MessageCircle, Star, X, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDesign } from "../context/DesignContext";
import ImperialAbout from "./Imperial/ImperialAbout";
import { dataService, AboutContent } from "../services/dataService";
import { Testimonials } from "./Testimonials";

const IconMap: Record<string, any> = {
  Sparkles,
  Heart,
  Award,
  Globe
};

export default function About() {
  const { design } = useDesign();
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

  if (design === 'imperial') {
    return <ImperialAbout />;
  }

  if (loading || !content) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-bronze border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-0">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-brand-obsidian">
        <div className="absolute inset-0">
          <img 
            src={content.hero_image} 
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="About Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-obsidian via-brand-obsidian/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="micro-label text-brand-bronze mb-6 tracking-[0.4em] font-black">NOTRE ESSENCE</p>
            <h1 className="luxury-text text-5xl md:text-8xl mb-8 font-light lg:leading-tight text-brand-champagne italic whitespace-pre-line">
              {content.hero_title}
            </h1>
            <p className="text-xl text-brand-champagne/70 leading-relaxed mb-8 max-w-lg italic border-l-2 border-brand-bronze pl-8 uppercase tracking-widest">
              {content.hero_subtitle}
            </p>
            <p className="micro-label font-black text-brand-bronze tracking-[0.3em]">— MLLE PRÉCIEUSE, FONDATRICE</p>
          </motion.div>
        </div>
      </section>

      {/* Story & Timeline */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div>
            <h2 className="luxury-text text-4xl mb-12 text-brand-champagne italic">{content.story_title}</h2>
            <div className="prose prose-lg text-brand-champagne/60 space-y-8 leading-relaxed uppercase tracking-widest text-sm font-light">
              <p>{content.story_text_1}</p>
              <p>{content.story_text_2}</p>
            </div>
          </div>
          
          <div className="space-y-12 pl-12 border-l border-brand-bronze/10 relative">
            {content.timeline.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-[54px] top-2 w-4 h-4 bg-brand-bronze rounded-full border-4 border-brand-obsidian" />
                <span className="luxury-text text-brand-bronze text-3xl mb-2 block">{step.date}</span>
                <h4 className="font-bold mb-2 text-brand-champagne uppercase tracking-widest">{step.title}</h4>
                <p className="text-brand-champagne/40 text-xs uppercase tracking-widest leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-brand-obsidian text-brand-champagne p-12 md:p-32 rounded-[5rem] mx-6 mb-32 relative overflow-hidden border border-brand-bronze/10 shadow-premium">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="luxury-text text-4xl md:text-6xl mb-24 text-center italic">Nos Piliers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {content.values.map((val, idx) => {
              const Icon = IconMap[val.icon || 'Sparkles'] || Sparkles;
              return (
                <motion.div 
                   key={val.title}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   className="group"
                >
                  <div className="w-16 h-16 bg-brand-bronze/10 rounded-2xl flex items-center justify-center text-brand-bronze mb-8 group-hover:bg-brand-bronze group-hover:text-brand-obsidian transition-all transform group-hover:scale-110">
                    <Icon size={28} />
                  </div>
                  <h3 className="luxury-text text-2xl mb-4 italic">{val.title}</h3>
                  <p className="text-brand-champagne/40 text-xs uppercase tracking-widest leading-relaxed">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-bronze/5 rounded-full blur-[120px]" />
      </section>

      {/* Mission */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
        <Sparkles className="mx-auto text-brand-bronze mb-8" size={40} />
        <h2 className="luxury-text text-4xl mb-8 text-brand-champagne italic">Notre Mission</h2>
        <p className="text-2xl font-light text-brand-champagne/70 leading-relaxed italic uppercase tracking-widest">
          {content.mission_text}
        </p>
      </section>

      {/* Team */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="luxury-text text-4xl md:text-6xl text-center mb-24 text-brand-champagne italic">L'Équipe du Showroom</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.team.map((member, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="aspect-[3/4] rounded-[3.5rem] overflow-hidden mb-8 border border-white/5 shadow-premium group-hover:shadow-bronze-glow transition-all bg-brand-obsidian">
                <img src={member.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] opacity-60 group-hover:opacity-100" alt={member.name} />
              </div>
              <h3 className="luxury-text text-2xl mb-2 text-brand-champagne">{member.name}</h3>
              <p className="micro-label text-brand-bronze font-black tracking-widest">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Engagements */}
      <section className="py-32 bg-brand-obsidian/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="luxury-text text-4xl mb-12 text-brand-champagne italic">Nos Engagements</h2>
               <div className="space-y-10">
                  <div className="flex gap-6 group">
                     <div className="p-4 bg-brand-bronze/10 rounded-2xl text-brand-bronze h-fit group-hover:bg-brand-bronze group-hover:text-brand-obsidian transition-all"><Award size={24} /></div>
                     <div>
                        <h4 className="font-bold mb-2 text-brand-champagne uppercase tracking-widest">Fabrication Locale</h4>
                        <p className="text-brand-champagne/40 text-sm uppercase tracking-widest leading-relaxed">Nous privilégions le savoir-faire béninois impérial.</p>
                     </div>
                  </div>
                  <div className="flex gap-6 group">
                     <div className="p-4 bg-brand-bronze/10 rounded-2xl text-brand-bronze h-fit group-hover:bg-brand-bronze group-hover:text-brand-obsidian transition-all"><Heart size={24} /></div>
                     <div>
                        <h4 className="font-bold mb-2 text-brand-champagne uppercase tracking-widest">Zéro Produit Blanchissant</h4>
                        <p className="text-brand-champagne/40 text-sm uppercase tracking-widest leading-relaxed">L'Empire prône le glow naturel éternel.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="aspect-square bg-brand-obsidian p-1 rounded-[4rem] overflow-hidden border border-white/5 shadow-premium">
               <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover rounded-[3.8rem] opacity-40 group-hover:opacity-100 transition-opacity duration-1000" alt="Engagement" />
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Final CTA */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          className="bg-brand-obsidian text-brand-champagne p-12 md:p-32 rounded-[5rem] text-center max-w-7xl mx-auto border border-brand-bronze/20 shadow-premium"
        >
           <h2 className="luxury-text text-4xl md:text-7xl mb-12 italic leading-tight">Prête à bâtir votre <br className="hidden md:block"/> Empire ?</h2>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/catalogue" className="bg-brand-bronze text-brand-obsidian px-12 py-5 rounded-full micro-label font-black tracking-widest hover:scale-105 transition-all shadow-premium flex items-center justify-center gap-3 uppercase">
                 PARCOURIR LE CATALOGUE <ChevronRight size={18} />
              </Link>
              <a 
                href="https://wa.me/2290150824534?text=Bonjour, je souhaite un conseil personnalisé avant de commander !"
                target="_blank"
                rel="noreferrer"
                className="bg-white/5 text-brand-champagne border border-white/10 px-12 py-5 rounded-full micro-label font-black tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 uppercase"
              >
                 CONTACT WHATSAPP <MessageCircle size={18} />
              </a>
           </div>
        </motion.div>
      </section>
    </div>
  );
}
