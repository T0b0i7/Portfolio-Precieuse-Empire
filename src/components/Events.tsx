import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, ChevronRight, MessageCircle, Heart, Share2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { toast } from "react-hot-toast";
import { TextSlide, Magnetic, Reveal, CinematicImage } from "./ui/motion";

import { dataService, Event } from "../services/dataService";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'finished'>('all');
  const [likedEvents, setLikedEvents] = useState<string[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await dataService.getEvents();
      setEvents(data);
    };
    loadEvents();
    
    const savedLikes = JSON.parse(localStorage.getItem("liked_events") || "[]");
    setLikedEvents(savedLikes);
  }, []);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newLikes = likedEvents.includes(id) 
      ? likedEvents.filter(i => i !== id) 
      : [...likedEvents, id];
    setLikedEvents(newLikes);
    localStorage.setItem("liked_events", JSON.stringify(newLikes));
    toast.success(likedEvents.includes(id) ? "Retiré des coups de cœur" : "Événement liké !");
  };

  const handleShare = (e: React.MouseEvent, event: Event) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/evenements/${event.id}`;
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  const filteredEvents = events.filter(e => filter === 'all' || e.status === filter);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-ebony">
        <div className="absolute inset-0">
          <CinematicImage 
            src="https://images.unsplash.com/photo-1512496011212-721d80ad6668?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full opacity-40 rounded-none"
            alt="Events Ambience" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ebony/60 via-transparent to-brand-ebony" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-7xl">
          <TextSlide delay={0.2} className="mb-6">
            <p className="micro-label text-brand-gold tracking-[0.6em] uppercase font-bold">L'EXPÉRIENCE VIVANTE</p>
          </TextSlide>
          <TextSlide delay={0.4} className="mb-10">
            <h1 className="luxury-text text-6xl md:text-[10rem] font-black text-white leading-none tracking-tighter">ÉVÉNEMENTS.</h1>
          </TextSlide>
          <Reveal delay={0.6} className="max-w-xl mx-auto border-l border-brand-gold/20 pl-10">
            <p className="text-xl text-brand-cream/60 leading-relaxed font-medium italic">Rejoignez l'élite impériale lors de moments suspendus, dédiés à la célébration de votre beauté et de votre héritage.</p>
          </Reveal>
        </div>
      </section>

      <div className="px-6 max-w-7xl mx-auto pb-40">
        {/* Filters - Luxury Style */}
        <div className="flex flex-wrap justify-center gap-4 mb-32 -translate-y-1/2 relative z-20">
          {['all', 'upcoming', 'ongoing', 'finished'].map((f) => (
            <Magnetic key={f}>
              <button
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] transition-all font-bold cursor-pointer border",
                  filter === f 
                    ? "bg-brand-gold border-brand-gold text-brand-ebony shadow-lg" 
                    : "glass-card bg-white text-brand-ebony/40 hover:text-brand-ebony"
                )}
              >
                {f === 'all' ? 'TOUS' : f === 'upcoming' ? 'À VENIR' : f === 'ongoing' ? 'EN COURS' : 'PASSÉS'}
              </button>
            </Magnetic>
          ))}
        </div>


        {/* Grid - Vengence UI Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, idx) => (
              <Reveal key={event.id} delay={idx * 0.1}>
                <Link to={`/evenements/${event.id}`} className="group block">
                  <div className="relative aspect-[16/10] rounded-[4rem] overflow-hidden shadow-2xl mb-12 border border-white/5">
                    <img src={event.image} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ebony/60 to-transparent" />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-10 right-10 flex flex-col gap-4">
                      <Magnetic>
                        <button 
                          onClick={(e) => toggleLike(e, event.id)}
                          className={cn(
                            "p-5 rounded-full backdrop-blur-xl transition-all shadow-2xl",
                            likedEvents.includes(event.id) 
                              ? "bg-brand-gold text-brand-ebony" 
                              : "bg-white/10 text-white hover:bg-white"
                          )}
                        >
                          <Heart size={20} className={cn(likedEvents.includes(event.id) && "fill-current")} />
                        </button>
                      </Magnetic>
                      <Magnetic>
                        <button 
                          onClick={(e) => handleShare(e, event)}
                          className="p-5 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white hover:text-brand-ebony transition-all shadow-2xl"
                        >
                          <Share2 size={20} />
                        </button>
                      </Magnetic>
                    </div>

                    <div className="absolute bottom-10 left-10">
                      <span className={cn(
                        "px-8 py-3 rounded-full micro-label backdrop-blur-xl text-white shadow-2xl border border-white/10",
                        event.status === 'upcoming' ? "bg-brand-gold/60" : 
                        event.status === 'ongoing' ? "bg-brand-ebony/60" : "bg-white/10"
                      )}>
                        {event.status === 'upcoming' ? "À VENIR" : event.status === 'ongoing' ? "EN COURS" : "TERMINÉ"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-6">
                    <div className="flex gap-8 mb-6 opacity-30 micro-label text-[9px] tracking-[0.3em] font-bold">
                      <span className="flex items-center gap-3"><Calendar size={14} className="text-brand-gold"/> {event.date}</span>
                      <span className="flex items-center gap-3"><MapPin size={14} className="text-brand-gold"/> {event.location}</span>
                    </div>
                    <h2 className="luxury-text text-5xl mb-8 group-hover:text-brand-gold transition-colors leading-tight">{event.title}</h2>
                    <p className="opacity-50 line-clamp-3 leading-relaxed mb-10 text-lg font-medium italic">"{event.description}"</p>
                    <div className="flex items-center gap-4 micro-label font-black text-brand-gold group-hover:gap-8 transition-all">
                      DÉCOUVRIER L'EXPÉRIENCE <ChevronRight size={18} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </AnimatePresence>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-32 space-y-8">
            <p className="opacity-20 luxury-text text-3xl italic">
              Aucun événement dans cette catégorie pour le moment.
            </p>
          </div>
        )}

        {/* WhatsApp CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-40 bg-brand-ebony text-brand-cream p-12 md:p-24 rounded-[4rem] text-center relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <h2 className="luxury-text text-4xl md:text-6xl mb-8">Ne ratez aucune vente privée</h2>
            <p className="opacity-60 text-lg mb-12 max-w-2xl mx-auto text-brand-champagne">
              Rejoignez notre communauté exclusive sur WhatsApp pour être informée en priorité de nos lancements et événements secrets.
            </p>
            <a 
              href="https://wa.me/2290150824534?text=Je souhaite rejoindre le groupe WhatsApp de l'Empire pour ne rien rater !"
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex items-center justify-center gap-3 max-w-sm mx-auto"
            >
              <MessageCircle size={20} /> REJOINDRE LE GROUPE
            </a>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </motion.section>
      </div>
    </div>
  );
}
