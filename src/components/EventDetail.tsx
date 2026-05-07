import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, Clock, ChevronLeft, MessageCircle, Share2, Users, Heart, Facebook, Twitter, Linkedin } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { toast } from "react-hot-toast";

import { dataService, Event } from "../services/dataService";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const data = await dataService.getEvents();
        const found = data.find((e: Event) => e.id === id);
        if (found) {
          setEvent(found);
          const likes = JSON.parse(localStorage.getItem("liked_events") || "[]");
          setIsLiked(likes.includes(found.id));
        } else {
          navigate("/evenements");
        }
      } catch (error) {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    
    loadEvent();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const toggleLike = () => {
    if (!event) return;
    const likes = JSON.parse(localStorage.getItem("liked_events") || "[]");
    let newLikes;
    if (isLiked) {
      newLikes = likes.filter((i: string) => i !== event.id);
      toast.success("Retiré de vos favoris");
    } else {
      newLikes = [...likes, event.id];
      toast.success("Ajouté à vos favoris !");
    }
    localStorage.setItem("liked_events", JSON.stringify(newLikes));
    setIsLiked(!isLiked);
  };

  const shareSocial = (platform: string) => {
    if (!event) return;
    const url = window.location.href;
    const text = `Découvrez cet événement : ${event.title}`;
    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Lien copié !");
        setShowShareMenu(false);
        return;
    }

    if (shareLink) {
      window.open(shareLink, "_blank");
      setShowShareMenu(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-40 px-6 min-h-screen max-w-4xl mx-auto space-y-12 animate-pulse">
        <div className="aspect-video bg-brand-ink/5 rounded-[3.5rem]" />
        <div className="h-20 bg-brand-ink/5 rounded-2xl w-3/4" />
        <div className="h-40 bg-brand-ink/5 rounded-2xl w-full" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen bg-brand-obsidian">
      <Link to="/evenements" className="inline-flex items-center gap-2 micro-label mb-12 text-brand-champagne/60 hover:text-brand-bronze transition-colors uppercase font-black tracking-widest">
        <ChevronLeft size={16} /> Retour à l'agenda
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-video md:aspect-[21/9] rounded-[3.5rem] overflow-hidden shadow-premium mb-16 border border-white/5 bg-brand-obsidian"
      >
        <img src={event.image} className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-[2s]" alt={event.title} />
        <div className="absolute top-8 left-8">
          <span className={cn(
            "px-8 py-3 rounded-full micro-label backdrop-blur-md text-brand-obsidian shadow-premium font-black tracking-widest uppercase text-[9px]",
            event.status === 'upcoming' ? "bg-brand-bronze" : 
            event.status === 'ongoing' ? "bg-brand-champagne" : "bg-white/40"
          )}>
            {event.status === 'upcoming' ? "Prochainement" : event.status === 'ongoing' ? "Actuellement" : "Événement Passé"}
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="luxury-text text-4xl md:text-[6rem] mb-10 leading-tight text-brand-champagne italic uppercase"
          >
            {event.title}
          </motion.h1>

          <div className="prose prose-lg max-w-none text-brand-champagne/60 font-light leading-relaxed mb-12">
            <p className="text-xl mb-8 font-light italic border-l-4 border-brand-bronze pl-8 text-brand-champagne uppercase tracking-widest leading-relaxed">
              {event.description}
            </p>
            <p className="uppercase tracking-widest text-sm leading-relaxed">
              Précieuse Empire est ravi de vous inviter à cet événement exceptionnel de l'archive impériale. Nous avons conçu ce moment pour être bien plus qu'une simple présentation de rituels : c'est une véritable immersion dans l'univers de la beauté consciente.
            </p>
            <p className="mt-6 uppercase tracking-widest text-sm leading-relaxed">
              Au programme : démonstrations de protocoles sacrés, conseils personnalisés de nos expertes, et la possibilité de tester et d'acquérir nos dernières formulations en avant-première.
            </p>
          </div>
          
          <div className="flex gap-4 relative">
             <button 
               onClick={toggleLike}
               className={cn(
                 "p-5 rounded-full border border-white/10 transition-all",
                 isLiked ? "bg-brand-bronze text-brand-obsidian border-brand-bronze shadow-premium" : "text-brand-champagne/40 hover:border-brand-bronze hover:text-brand-bronze"
               )}
             >
               <Heart size={24} className={cn(isLiked && "fill-current")} />
             </button>
             <button 
               onClick={() => setShowShareMenu(!showShareMenu)}
               className={cn(
                 "p-5 rounded-full border border-white/10 hover:border-brand-bronze hover:text-brand-bronze transition-all",
                 showShareMenu && "bg-brand-bronze text-brand-obsidian border-brand-bronze"
               )}
             >
               <Share2 size={24} />
             </button>

             <AnimatePresence>
               {showShareMenu && (
                 <motion.div 
                   initial={{ opacity: 0, x: -10, scale: 0.9 }}
                   animate={{ opacity: 1, x: 0, scale: 1 }}
                   exit={{ opacity: 0, x: -10, scale: 0.9 }}
                   className="absolute left-full ml-4 top-0 flex gap-2 bg-brand-obsidian p-2 rounded-full shadow-premium border border-white/10"
                 >
                   <button onClick={() => shareSocial('facebook')} className="p-3 hover:bg-white/5 text-brand-champagne rounded-full transition-colors"><Facebook size={20} /></button>
                   <button onClick={() => shareSocial('twitter')} className="p-3 hover:bg-white/5 text-brand-champagne rounded-full transition-colors"><Twitter size={20} /></button>
                   <button onClick={() => shareSocial('whatsapp')} className="p-3 hover:bg-white/5 text-brand-champagne rounded-full transition-colors"><MessageCircle size={20} /></button>
                   <button onClick={() => shareSocial('linkedin')} className="p-3 hover:bg-white/5 text-brand-champagne rounded-full transition-colors"><Linkedin size={20} /></button>
                   <div className="w-[1px] bg-white/10 h-6 my-auto mx-1" />
                   <button onClick={() => shareSocial('copy')} className="px-4 text-[10px] font-black micro-label hover:text-brand-bronze tracking-widest">COPIER</button>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-brand-velvet p-10 rounded-[2.5rem] shadow-premium border border-white/5 space-y-8">
              <div className="flex items-center gap-6 group">
                 <div className="bg-brand-bronze/10 p-4 rounded-2xl text-brand-bronze group-hover:bg-brand-bronze group-hover:text-brand-obsidian transition-all">
                    <Calendar size={24} />
                 </div>
                 <div>
                    <p className="micro-label opacity-40 uppercase tracking-widest font-black text-[9px] text-brand-champagne">Date</p>
                    <p className="font-black text-brand-champagne uppercase tracking-widest text-xs">{event.date}</p>
                 </div>
              </div>

              <div className="flex items-center gap-6 group">
                 <div className="bg-brand-bronze/10 p-4 rounded-2xl text-brand-bronze group-hover:bg-brand-bronze group-hover:text-brand-obsidian transition-all">
                    <Clock size={24} />
                 </div>
                 <div>
                    <p className="micro-label opacity-40 uppercase tracking-widest font-black text-[9px] text-brand-champagne">Heure</p>
                    <p className="font-black text-brand-champagne uppercase tracking-widest text-xs">15:00 — 19:00</p>
                 </div>
              </div>

              <div className="flex items-center gap-6 group">
                 <div className="bg-brand-bronze/10 p-4 rounded-2xl text-brand-bronze group-hover:bg-brand-bronze group-hover:text-brand-obsidian transition-all">
                    <MapPin size={24} />
                 </div>
                 <div>
                    <p className="micro-label opacity-40 uppercase tracking-widest font-black text-[9px] text-brand-champagne">Lieu</p>
                    <p className="font-black text-brand-champagne uppercase tracking-widest text-xs">{event.location}</p>
                 </div>
              </div>

              <div className="flex items-center gap-6 group">
                 <div className="bg-brand-bronze/10 p-4 rounded-2xl text-brand-bronze group-hover:bg-brand-bronze group-hover:text-brand-obsidian transition-all">
                    <Users size={24} />
                 </div>
                 <div>
                    <p className="micro-label opacity-40 uppercase tracking-widest font-black text-[9px] text-brand-champagne">Places</p>
                    <p className="font-black text-brand-champagne uppercase tracking-widest text-xs">Limitées (sur réservation)</p>
                 </div>
              </div>

              {event.status !== 'finished' && (
                <a 
                  href={`https://wa.me/2290150824534?text=Bonjour, je suis intéressée par l'événement : ${event.title}. Reste-t-il des places ?`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-brand-bronze text-brand-obsidian w-full flex items-center justify-center gap-3 py-6 rounded-full micro-label font-black tracking-[0.2em] hover:bg-white transition-all shadow-premium uppercase"
                >
                  <MessageCircle size={20} /> JE SUIS INTÉRESSÉE
                </a>
              )}
           </div>

           <div className="bg-brand-bronze p-10 rounded-[2.5rem] text-brand-obsidian shadow-bronze-glow">
              <h3 className="luxury-text text-3xl mb-4 italic uppercase tracking-tighter">Vente Flash</h3>
              <p className="opacity-80 text-xs leading-relaxed mb-6 font-black uppercase tracking-widest">
                Profitez de -15% sur toute la gamme Soins Visage uniquement pendant la durée de l'événement.
              </p>
              <Link to="/catalogue" className="text-brand-obsidian micro-label underline underline-offset-4 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">
                 VOIR LES PRODUITS CONCERNÉS
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
