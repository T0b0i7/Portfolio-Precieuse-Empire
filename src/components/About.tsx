import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Heart, Globe, Award, Sparkles, ChevronRight, MessageCircle } from "lucide-react";

export default function About() {
  const VALUES = [
    { title: "Naturel", desc: "Des ingrédients hérités de la terre africaine, sans compromis sur la pureté.", icon: Sparkles },
    { title: "Femme Africaine", desc: "Célébrer et sublimer toutes les nuances de peaux mélanines.", icon: Heart },
    { title: "Qualité", desc: "L'excellence artisanale alliée à la rigueur scientifique.", icon: Award },
    { title: "Proximité", desc: "Une écoute active et des conseils personnalisés pour chaque cliente.", icon: Globe },
  ];

  const TEAM = [
    { name: "Mlle Précieuse", role: "Fondatrice & CEO", image: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=400" },
    { name: "Sarah G.", role: "Responsable Commerciale", image: "https://images.unsplash.com/photo-1506272517105-4f29bc952dd6?auto=format&fit=crop&q=80&w=400" },
    { name: "Awa D.", role: "Experte Cosmétologue", image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=400" },
  ];

  return (
    <div className="pt-20 pb-0">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-50"
            alt="About Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-cream via-brand-cream/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="micro-label text-brand-gold mb-6 tracking-[0.4em]">NOTRE ESSENCE</p>
            <h1 className="luxury-text text-5xl md:text-8xl mb-8 font-light lg:leading-tight">
              Sublimer <br /> l'Héritage.
            </h1>
            <p className="text-xl opacity-70 leading-relaxed mb-8 max-w-lg italic border-l-2 border-brand-gold pl-8">
              "La beauté africaine n'est pas une tendance, c'est une royauté qui mérite ses propres secrets."
            </p>
            <p className="micro-label font-bold text-brand-ink">— MLLE PRÉCIEUSE, FONDATRICE</p>
          </motion.div>
        </div>
      </section>

      {/* Story & Timeline */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div>
            <h2 className="luxury-text text-4xl mb-12">Notre Histoire</h2>
            <div className="prose prose-lg opacity-70 space-y-8 leading-relaxed">
              <p>
                Tout a commencé par une simple observation : le marché regorgeait de produits inadaptés aux besoins spécifiques des peaux mélanines vivant sous le climat tropical.
              </p>
              <p>
                Passionnée par les recettes de ma grand-mère et armée d'une formation en cosmétologie, j'ai commencé à formuler mes propres soins dans ma cuisine à Cotonou. Ce qui était un passe-temps est devenu une mission : créer un véritable Empire du soin.
              </p>
            </div>
          </div>
          
          <div className="space-y-12 pl-12 border-l border-brand-ink/10 relative">
            {[ 
              { date: "2022", title: "L'Étincelle", desc: "Premiers tests de formulation artisanale au karité pur." },
              { date: "2023", title: "Le Lancement", desc: "Naissance officielle de Précieuse Empire et premier showroom." },
              { date: "2024", title: "L'Empire s'étend", desc: "Lancement de la plateforme digitale et livraison internationale." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-[54px] top-2 w-4 h-4 bg-brand-gold rounded-full border-4 border-brand-cream" />
                <span className="luxury-text text-brand-gold text-2xl mb-2 block">{step.date}</span>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="opacity-60 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-brand-ink text-brand-cream p-12 md:p-32 rounded-[5rem] mx-6 mb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="luxury-text text-4xl md:text-6xl mb-24 text-center">Nos Piliers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {VALUES.map((val, idx) => (
              <motion.div 
                 key={val.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="group"
              >
                <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold mb-8 group-hover:bg-brand-gold group-hover:text-white transition-all transform group-hover:scale-110">
                  <val.icon size={28} />
                </div>
                <h3 className="luxury-text text-2xl mb-4">{val.title}</h3>
                <p className="opacity-50 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[120px]" />
      </section>

      {/* Mission */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
        <Sparkles className="mx-auto text-brand-gold mb-8" size={40} />
        <h2 className="luxury-text text-4xl mb-8">Notre Mission</h2>
        <p className="text-2xl font-light opacity-70 leading-relaxed italic">
          "Donner à chaque femme les clés d'une beauté autonome, naturelle et royale. Nous ne vendons pas des crèmes, nous partageons un héritage de confiance."
        </p>
      </section>

      {/* Team */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="luxury-text text-4xl md:text-6xl text-center mb-24">L'Équipe du Showroom</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {TEAM.map((member, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="aspect-[3/4] rounded-[3.5rem] overflow-hidden mb-8 border border-brand-ink/5 shadow-lg group-hover:shadow-2xl transition-all">
                <img src={member.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={member.name} />
              </div>
              <h3 className="luxury-text text-2xl mb-2">{member.name}</h3>
              <p className="micro-label text-brand-gold">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Engagements */}
      <section className="py-32 bg-brand-cream/50 border-t border-brand-ink/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="luxury-text text-4xl mb-12">Nos Engagements</h2>
               <div className="space-y-10">
                  <div className="flex gap-6">
                     <div className="p-4 bg-brand-gold/10 rounded-2xl text-brand-gold h-fit"><Award size={24} /></div>
                     <div>
                        <h4 className="font-bold mb-2">Fabrication Locale</h4>
                        <p className="opacity-60 text-sm">Nous privilégions le savoir-faire béninois et la transformation locale des matières premières.</p>
                     </div>
                  </div>
                  <div className="flex gap-6">
                     <div className="p-4 bg-brand-gold/10 rounded-2xl text-brand-gold h-fit"><Heart size={24} /></div>
                     <div>
                        <h4 className="font-bold mb-2">Zéro Produit Blanchissant</h4>
                        <p className="opacity-60 text-sm">L'Empire combat activement la dépigmentation artificielle et prône le glow naturel.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="aspect-square bg-brand-ink p-1 rounded-[4rem] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover rounded-[3.8rem] opacity-70" alt="Engagement" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="luxury-text text-4xl text-center mb-24">Elles Rayonnent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { name: "Cynthia M.", comment: "Le Sérum Éclat a littéralement changé mon grain de peau. Adieu les taches !" },
              { name: "Mariam T.", comment: "Enfin des produits qui comprennent ma peau sèche sous la chaleur de Cotonou. Je recommande !" }
            ].map((t, idx) => (
              <div key={idx} className="bg-brand-cream p-12 rounded-[3.5rem] relative">
                <p className="text-xl italic opacity-70 mb-8 leading-relaxed">"{t.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                  <p className="micro-label font-bold tracking-widest">{t.name}</p>
                </div>
                <div className="absolute -top-6 -right-6 text-brand-gold/10 transform scale-[5]"><Sparkles size={24} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          className="bg-brand-ink text-brand-cream p-12 md:p-32 rounded-[5rem] text-center max-w-7xl mx-auto"
        >
           <h2 className="luxury-text text-4xl md:text-7xl mb-12">Prête à bâtir votre Empire ?</h2>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/catalogue" className="bg-brand-gold text-white px-12 py-5 rounded-full micro-label hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
                 PARCOURIR LE CATALOGUE <ChevronRight size={18} />
              </Link>
              <a 
                href="https://wa.me/2290150824534?text=Bonjour, je souhaite un conseil personnalisé avant de commander !"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 text-white border border-white/20 px-12 py-5 rounded-full micro-label hover:bg-white/20 transition-all flex items-center justify-center gap-3"
              >
                 CONTACT WHATSAPP <MessageCircle size={18} />
              </a>
           </div>
        </motion.div>
      </section>
    </div>
  );
}
