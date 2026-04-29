import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, ChevronRight, MessageCircle, Heart, Share2, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { toast } from "react-hot-toast";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  status: 'upcoming' | 'finished' | 'ongoing';
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'finished'>('all');
  const [likedEvents, setLikedEvents] = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(setEvents);
    
    const savedLikes = JSON.parse(localStorage.getItem("liked_events") || "[]");
    setLikedEvents(savedLikes);
  }, []);

  const toggleLike = (e: React.MouseEvent, id: number) => {
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
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512496011212-721d80ad6668?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-60 scale-105"
            alt="Events Ambience" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/50 via-transparent to-brand-cream" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="micro-label text-brand-gold mb-4"
          >
            Vivre l'Empire
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="luxury-text text-5xl md:text-8xl font-light mb-6"
          >
            Événements & Ateliers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg opacity-60 max-w-xl mx-auto"
          >
            Rejoignez-nous pour des moments d'exception dédiés à votre beauté.
          </motion.p>
        </div>
      </section>

      <div className="px-6 max-w-7xl mx-auto pb-32">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {['all', 'upcoming', 'ongoing', 'finished'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-8 py-3 rounded-full micro-label transition-all font-bold cursor-pointer",
                filter === f ? "bg-brand-gold text-brand-ebony shadow-xl" : "bg-brand-ebony/5 text-brand-ebony/60 hover:bg-brand-ebony/10"
              )}
            >
              {f === 'all' ? 'Tous' : f === 'upcoming' ? 'À Venir' : f === 'ongoing' ? 'En Cours' : 'Passés'}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, idx) => (
              <motion.div 
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <Link to={`/evenements/${event.id}`}>
                  <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-lg mb-8">
                    <img src={event.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-8 right-8 flex flex-col gap-3">
                      <button 
                        onClick={(e) => toggleLike(e, event.id)}
                        className={cn(
                          "p-4 rounded-full backdrop-blur-md transition-all shadow-lg",
                          likedEvents.includes(event.id) 
                            ? "bg-brand-gold text-white" 
                            : "bg-white/20 text-white hover:bg-white/40"
                        )}
                      >
                        <Heart size={20} className={cn(likedEvents.includes(event.id) && "fill-current")} />
                      </button>
                      <button 
                        onClick={(e) => handleShare(e, event)}
                        className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all shadow-lg"
                      >
                        <Share2 size={20} />
                      </button>
                    </div>

                    <div className="absolute top-8 left-8">
                      <span className={cn(
                        "px-6 py-2 rounded-full micro-label backdrop-blur-md text-white shadow-lg",
                        event.status === 'upcoming' ? "bg-brand-gold/80" : 
                        event.status === 'ongoing' ? "bg-brand-sage/80" : "bg-brand-ebony/60"
                      )}>
                        {event.status === 'upcoming' ? "À Venir" : event.status === 'ongoing' ? "En Cours" : "Terminé"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-4">
                    <div className="flex gap-6 mb-4 opacity-40 micro-label">
                      <span className="flex items-center gap-2"><Calendar size={14} /> {event.date}</span>
                      <span className="flex items-center gap-2"><MapPin size={14} /> {event.location}</span>
                    </div>
                    <h2 className="luxury-text text-4xl mb-6 group-hover:text-brand-gold transition-colors">{event.title}</h2>
                    <p className="opacity-60 line-clamp-2 leading-relaxed mb-8">{event.description}</p>
                    <div className="flex items-center gap-2 micro-label font-bold text-brand-gold">
                      EN SAVOIR PLUS <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-32 space-y-8">
            <p className="opacity-20 luxury-text text-3xl italic">
              Aucun événement dans cette catégorie pour le moment.
            </p>
            <button 
              onClick={() => {
                setEvents([
                  {
                    id: 1,
                    title: "Atelier Beauté : Les Secrets du Karité",
                    description: "Venez apprendre à formuler votre propre baume nourrissant avec Mlle Précieuse. Une immersion totale dans les traditions ancestrales.",
                    date: "15 Mai 2026",
                    location: "Haie Vive, Cotonou",
                    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
                    status: 'upcoming'
                  },
                  {
                    id: 2,
                    title: "Masterclass Teint Parfait",
                    description: "Apprenez les techniques de maquillage pour peaux mélanines avec nos experts internationaux.",
                    date: "20 Juin 2026",
                    location: "Fidjrossè, Cotonou",
                    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
                    status: 'ongoing'
                  }
                ]);
              }}
              className="micro-label text-brand-gold underline underline-offset-4"
            >
              CHARGER LES ÉVÉNEMENTS TYPES
            </button>
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
              className="btn-whatsapp px-12 py-5"
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
