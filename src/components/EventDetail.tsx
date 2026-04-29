import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, Clock, ChevronLeft, MessageCircle, Share2, Users, Heart, Facebook, Twitter, Linkedin } from "lucide-react";
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

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => {
        const found = data.find((e: Event) => e.id === Number(id));
        if (found) {
          setEvent(found);
          const likes = JSON.parse(localStorage.getItem("liked_events") || "[]");
          setIsLiked(likes.includes(found.id));
        } else {
          navigate("/evenements");
        }
      })
      .finally(() => setLoading(false));
    
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const toggleLike = () => {
    if (!event) return;
    const likes = JSON.parse(localStorage.getItem("liked_events") || "[]");
    let newLikes;
    if (isLiked) {
      newLikes = likes.filter((i: number) => i !== event.id);
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
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen">
      <Link to="/evenements" className="inline-flex items-center gap-2 micro-label mb-12 hover:text-brand-gold transition-colors">
        <ChevronLeft size={16} /> Retour à l'agenda
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-video md:aspect-[21/9] rounded-[3.5rem] overflow-hidden shadow-2xl mb-16"
      >
        <img src={event.image} className="w-full h-full object-cover" alt={event.title} />
        <div className="absolute top-8 left-8">
          <span className={cn(
            "px-8 py-3 rounded-full micro-label backdrop-blur-md text-white shadow-xl shadow-black/20 font-bold",
            event.status === 'upcoming' ? "bg-brand-gold/80" : 
            event.status === 'ongoing' ? "bg-brand-sage/80" : "bg-brand-ebony/60"
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
            className="luxury-text text-4xl md:text-6xl mb-10 leading-tight"
          >
            {event.title}
          </motion.h1>

          <div className="prose prose-lg max-w-none text-ui-muted font-medium leading-relaxed mb-12">
            <p className="text-xl mb-8 font-medium italic border-l-4 border-brand-gold pl-8 text-brand-ebony">
              {event.description}
            </p>
            <p>
              Précieuse Empire est ravi de vous inviter à cet événement exceptionnel. Nous avons conçu ce moment pour être bien plus qu'une simple présentation de produits : c'est une véritable immersion dans l'univers de la beauté consciente et de l'héritage africain.
            </p>
            <p className="mt-6">
              Au programme : démonstrations en direct, conseils personnalisés de nos expertes, et bien sûr, la possibilité de tester et d'acquérir nos dernières formulations en avant-première.
            </p>
          </div>
          
          <div className="flex gap-4 relative">
             <button 
               onClick={toggleLike}
               className={cn(
                 "p-5 rounded-full border border-brand-ink/10 transition-all",
                 isLiked ? "bg-brand-gold text-white border-brand-gold shadow-lg" : "hover:border-brand-gold"
               )}
             >
               <Heart size={24} className={cn(isLiked && "fill-current")} />
             </button>
             <button 
               onClick={() => setShowShareMenu(!showShareMenu)}
               className={cn(
                 "p-5 rounded-full border border-brand-ebony/10 hover:border-brand-gold transition-all",
                 showShareMenu && "bg-brand-ebony text-brand-cream border-brand-ebony"
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
                   className="absolute left-full ml-4 top-0 flex gap-2 bg-white p-2 rounded-full shadow-2xl border border-brand-ink/5"
                 >
                   <button onClick={() => shareSocial('facebook')} className="p-3 hover:bg-blue-50 text-blue-600 rounded-full transition-colors"><Facebook size={20} /></button>
                   <button onClick={() => shareSocial('twitter')} className="p-3 hover:bg-sky-50 text-sky-500 rounded-full transition-colors"><Twitter size={20} /></button>
                   <button onClick={() => shareSocial('whatsapp')} className="p-3 hover:bg-green-50 text-green-600 rounded-full transition-colors"><MessageCircle size={20} /></button>
                   <button onClick={() => shareSocial('linkedin')} className="p-3 hover:bg-blue-50 text-blue-700 rounded-full transition-colors"><Linkedin size={20} /></button>
                   <div className="w-[1px] bg-brand-ink/10 h-6 my-auto mx-1" />
                   <button onClick={() => shareSocial('copy')} className="px-4 text-[10px] font-bold micro-label hover:text-brand-gold">COPIER</button>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-brand-ink/5 space-y-8">
              <div className="flex items-center gap-6">
                 <div className="bg-brand-gold/10 p-4 rounded-2xl text-brand-gold">
                    <Calendar size={24} />
                 </div>
                 <div>
                    <p className="micro-label opacity-40">Date</p>
                    <p className="font-bold">{event.date}</p>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="bg-brand-gold/10 p-4 rounded-2xl text-brand-gold">
                    <Clock size={24} />
                 </div>
                 <div>
                    <p className="micro-label opacity-40">Heure</p>
                    <p className="font-bold">15:00 — 19:00</p>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="bg-brand-gold/10 p-4 rounded-2xl text-brand-gold">
                    <MapPin size={24} />
                 </div>
                 <div>
                    <p className="micro-label opacity-40">Lieu</p>
                    <p className="font-bold">{event.location}</p>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="bg-brand-gold/10 p-4 rounded-2xl text-brand-gold">
                    <Users size={24} />
                 </div>
                 <div>
                    <p className="micro-label opacity-40">Places</p>
                    <p className="font-bold">Limitées (sur réservation)</p>
                 </div>
              </div>

              {event.status !== 'finished' && (
                <a 
                  href={`https://wa.me/2290150824534?text=Bonjour, je suis intéressée par l'événement : ${event.title}. Reste-t-il des places ?`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp w-full flex items-center justify-center gap-3"
                >
                  <MessageCircle size={20} /> JE SUIS INTÉRESSÉE
                </a>
              )}
           </div>

           <div className="bg-brand-gold p-10 rounded-[2.5rem] text-white">
              <h3 className="luxury-text text-2xl mb-4">Vente Flash Exclusive</h3>
              <p className="opacity-80 text-sm leading-relaxed mb-6">
                Profitez de -15% sur toute la gamme Soins Visage uniquement pendant la durée de l'événement.
              </p>
              <Link to="/catalogue" className="text-white micro-label underline underline-offset-4 font-bold">
                 VOIR LES PRODUITS CONCERNÉS
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
