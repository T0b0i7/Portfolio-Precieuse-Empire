import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  Instagram, 
  Phone, 
  Heart,
  ChevronRight,
  User,
  LayoutDashboard,
  Mail,
  Facebook,
  Twitter,
  MessageCircle,
  Sparkles
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { cn } from "./lib/utils";

// Real Components
import Catalog from "./components/Catalog";
import Admin from "./components/Admin";
import Routines from "./components/Routines";
import RoutineDetail from "./components/RoutineDetail";
import Events from "./components/Events";
import EventDetail from "./components/EventDetail";
import About from "./components/About";
import ProductDetail from "./components/ProductDetail";

// Services
import { dataService } from "./services/dataService";

// Motion Primitives
import { TextSlide, Magnetic, Reveal, CinematicImage } from "./components/ui/motion";

// Pages
const Home = () => {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);
  const [latestEvent, setLatestEvent] = useState<any>(null);
  const [testimonials] = useState([
    { id: 1, author: "Awa K.", content: "Le sérum précieux a transformé mon grain de peau. Je ne m'en passe plus !", rating: 5 },
    { id: 2, author: "Mariam D.", content: "Livraison rapide à Cotonou et produits d'une qualité rare. Bravo Précieuse Empire.", rating: 5 },
    { id: 3, author: "Fatou B.", content: "Enfin une marque qui comprend les besoins des peaux melaninées.", rating: 5 }
  ]);

  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const heroImages = [
    "https://images.unsplash.com/photo-1596462502278-27bfaf43399f?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1590156221122-c748e7898b0a?auto=format&fit=crop&q=80&w=2000"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      const prods = await dataService.getProducts();
      setBestSellers(prods.slice(0, 4));
      
      const routs = await dataService.getRoutines();
      setRoutines(routs.slice(0, 2));
      
      const evs = await dataService.getEvents();
      if (evs.length > 0) setLatestEvent(evs[0]);
    };
    loadHomeData();
  }, []);

  return (
    <div className="pt-0">
      {/* Hero Section - Majestic Visuals */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center bg-brand-ebony">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <CinematicImage 
                src={heroImages[currentHeroImage]} 
                alt="Cosmetics Hero"
                className="w-full h-full object-cover rounded-none"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-brand-ebony/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ebony/60 via-transparent to-brand-ebony/80" />
          
          {/* Hero Image Navigation Dots */}
          <div className="absolute bottom-12 right-12 z-20 flex flex-col gap-4">
             {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHeroImage(idx)}
                  className="group flex items-center gap-4 text-right"
                >
                  <span className={cn(
                    "micro-label text-[8px] tracking-[0.3em] transition-all duration-500",
                    currentHeroImage === idx ? "text-brand-gold opacity-100" : "text-white opacity-20 group-hover:opacity-60"
                  )}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className={cn(
                    "h-[1px] transition-all duration-700",
                    currentHeroImage === idx ? "w-12 bg-brand-gold" : "w-4 bg-white/20 group-hover:w-8"
                  )} />
                </button>
             ))}
          </div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="micro-label text-brand-gold text-[10px] sm:text-xs tracking-[0.8em] mb-12 block uppercase font-black drop-shadow-lg">
              L'ART DE LA BEAUTÉ IMPÉRIALE
            </span>
            
            <h1 className="luxury-text text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black text-white leading-[0.85] tracking-tighter mb-10 italic drop-shadow-2xl">
              ÉCLAT <span className="text-brand-gold italic font-light block mt-4 drop-shadow-lg">RARE</span>
            </h1>

            <p className="text-brand-cream/80 text-lg sm:text-2xl font-light tracking-wide max-w-2xl mx-auto mb-16 leading-relaxed luxury-text italic drop-shadow-md">
              L'excellence africaine au service de votre éclat naturel. Un rituel sacré, une perfection moderne.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <Magnetic>
                <Link 
                  to="/catalogue" 
                  className="px-14 py-6 bg-brand-gold text-brand-ebony micro-label text-xs tracking-[0.4em] font-black hover:bg-white transition-all duration-500 rounded-full shadow-[0_20px_50px_rgba(197,161,107,0.4)] flex items-center gap-4"
                >
                  EXPLORER L'EMPIRE <ChevronRight size={18} />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link 
                  to="/routines" 
                  className="px-14 py-6 bg-white/5 backdrop-blur-md border border-white/10 text-white micro-label text-xs tracking-[0.4em] font-black hover:bg-white/20 transition-all duration-500 rounded-full"
                >
                  VOS RITUELS
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator - Vengence UI Style */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="micro-label text-white/30 text-[8px] tracking-[0.8em]">SCROLL</span>
          <motion.div 
            animate={{ height: [0, 60, 0], y: [0, 20, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[2px] bg-brand-gold"
          />
        </motion.div>
      </section>

      {/* Reassurance Band - Forge UI Technical Grid */}
      <section className="bg-brand-ebony py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-20">
          {[
            { tag: "01. NATUREL", icon: <Sparkles size={24}/>, desc: "Ingrédients Purs" },
            { tag: "02. LOGISTIQUE", icon: <ShoppingBag size={24}/>, desc: "Express Cotonou" },
            { tag: "03. SÉCURITÉ", icon: <User size={24}/>, desc: "Transactions Chiffrées" },
            { tag: "04. CONSEIL", icon: <MessageCircle size={24}/>, desc: "Experts Dédiés" },
          ].map((item, idx) => (
            <Reveal key={item.tag} delay={idx * 0.1}>
              <div className="group cursor-default border-l border-white/5 pl-8 py-4 hover:border-brand-gold transition-colors duration-700">
                <div className="text-brand-gold/60 mb-6 group-hover:text-brand-gold transition-colors group-hover:scale-110 transition-transform origin-left">
                  {item.icon}
                </div>
                <h4 className="micro-label text-white mb-2 tracking-[0.4em]">{item.tag}</h4>
                <p className="text-[11px] text-white/40 uppercase tracking-[0.3em] font-medium">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured Categories (Bento Grid) - Vengence UI Style magnetic cards */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <Reveal className="max-w-xl">
             <h2 className="luxury-text text-5xl md:text-7xl mb-10 leading-[0.9]">Collections Impériales</h2>
             <p className="text-lg opacity-60 leading-relaxed text-ui-muted font-medium">Chaque gamme est pensée pour répondre aux besoins spécifiques des peaux mélaninées, avec des ingrédients purs et puissants.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <Magnetic>
              <Link to="/catalogue" className="micro-label text-brand-gold hover:underline flex items-center gap-3 py-2 border-b border-brand-gold/20">
                VOIR LE CATALOGUE ENTIER <ChevronRight size={14}/>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 md:row-span-2 h-[700px]">
            <Reveal className="h-full">
              <Link to="/catalogue?category=visage" className="block h-full group relative overflow-hidden rounded-[3.5rem] shadow-2xl">
                <CinematicImage src="https://images.unsplash.com/photo-1512496011212-721d80ad6668?auto=format&fit=crop&w=800" alt="Visage" className="h-full rounded-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ebony/80 via-brand-ebony/20 to-transparent flex flex-col justify-end p-16">
                  <h3 className="text-white text-5xl luxury-text mb-4">Soins Visage</h3>
                  <p className="text-brand-gold micro-label tracking-[0.3em]">L'ÉCLAT ROYAL À CHAQUE INSTANT</p>
                </div>
              </Link>
            </Reveal>
          </div>
          
          <div className="md:col-span-2 h-[330px]">
            <Reveal delay={0.2} className="h-full">
              <Link to="/catalogue?category=corps" className="block h-full group relative overflow-hidden rounded-[3.5rem] shadow-2xl">
                <CinematicImage src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800" alt="Corps" className="h-full rounded-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ebony/80 to-transparent flex flex-col justify-end p-12">
                  <h3 className="text-white text-3xl luxury-text">Corps & Harmonie</h3>
                </div>
              </Link>
            </Reveal>
          </div>
          
          <div className="md:col-span-2 h-[330px]">
            <Reveal delay={0.4} className="h-full">
              <Link to="/catalogue?category=maquillage" className="block h-full group relative overflow-hidden rounded-[3.5rem] shadow-2xl">
                <CinematicImage src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800" alt="Maquillage" className="h-full rounded-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ebony/80 to-transparent flex flex-col justify-end p-12">
                  <h3 className="text-white text-3xl luxury-text">Maquillage Précieux</h3>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Best Sellers - Vengence UI Style Magnetic Products */}
      <section className="py-40 bg-brand-ebony/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <p className="micro-label text-brand-gold mb-4 tracking-[0.5em] uppercase">Sélection</p>
            <h2 className="luxury-text text-5xl md:text-7xl">Nos Best-Sellers</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            {bestSellers.map((p, idx) => (
              <Reveal key={p.id} delay={idx * 0.1}>
                <Magnetic>
                  <Link to={`/catalogue/${p.id}`} className="group block">
                    <div className="aspect-[3/4] rounded-[3rem] overflow-hidden mb-8 relative shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <img src={p.main_image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-ebony/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-6 left-6 right-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <button 
                          className="w-full bg-brand-ebony text-white py-4 rounded-2xl micro-label flex items-center justify-center gap-3 shadow-2xl hover:bg-brand-gold hover:text-brand-ebony transition-all font-bold"
                        >
                          <ShoppingBag size={16} /> VOIR L'ARTICLE
                        </button>
                      </div>
                    </div>
                    <h3 className="luxury-text text-2xl mb-2 group-hover:text-brand-gold transition-colors">{p.name}</h3>
                    <p className="text-brand-gold-muted font-bold tracking-widest">{p.price.toLocaleString()} FCFA</p>
                  </Link>
                </Magnetic>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event / Promo - UI LORA Cinematic Reveal */}
      {latestEvent && (
        <section className="py-40 px-6 max-w-7xl mx-auto">
           <Reveal>
             <div className="bg-brand-ebony p-12 md:p-32 rounded-[5rem] grid grid-cols-1 md:grid-cols-2 gap-20 items-center shadow-[0_50px_100px_-15px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                <div className="relative z-10">
                   <TextSlide delay={0.2} className="mb-6">
                      <p className="micro-label text-brand-gold uppercase tracking-[0.6em]">En Vedette</p>
                   </TextSlide>
                   <Reveal delay={0.4}>
                      <h2 className="luxury-text text-5xl md:text-8xl mb-12 leading-tight text-white">{latestEvent.title}</h2>
                      <p className="text-brand-cream/60 text-xl leading-relaxed mb-12 font-light">{latestEvent.description}</p>
                      <Magnetic>
                        <Link to="/evenements" className="btn-outline border-white/20 text-white hover:bg-white hover:text-brand-ebony px-12 py-5 rounded-full inline-block">
                           PARTICIPER À L'ÉVÉNEMENT
                        </Link>
                      </Magnetic>
                   </Reveal>
                </div>
                <Reveal delay={0.6} className="relative z-10">
                  <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl scale-110 md:scale-125 translate-x-10">
                     <img src={latestEvent.image} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  </div>
                </Reveal>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[150px]" />
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[120px]" />
             </div>
           </Reveal>
        </section>
      )}

      {/* Beauty Routine Section - Forge UI Clean Staggered Cards */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-24">
           <Reveal>
             <h2 className="luxury-text text-5xl md:text-6xl font-light">Routines de l'Empire</h2>
           </Reveal>
           <Reveal delay={0.2}>
             <Magnetic>
               <Link to="/routines" className="micro-label opacity-40 hover:opacity-100 flex items-center gap-3 tracking-[0.2em]">
                 DÉCOUVRIR LE MAG <ChevronRight size={14} />
               </Link>
             </Magnetic>
           </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {routines.map((routine, idx) => (
            <Reveal key={routine.id} delay={idx * 0.2}>
              <Link to={`/routines/${routine.id}`} className="group block">
                 <div className="aspect-[16/10] rounded-[3.5rem] overflow-hidden mb-10 shadow-xl">
                    <img src={routine.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                 </div>
                 <h3 className="luxury-text text-3xl mb-6 group-hover:text-brand-gold transition-colors leading-tight">{routine.title}</h3>
                 <p className="text-lg opacity-50 line-clamp-2 leading-relaxed font-medium">{routine.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials - UI LORA Smooth Transitions */}
      <section className="py-40 bg-brand-ebony text-brand-cream relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-gold rounded-full blur-[200px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-gold rounded-full blur-[200px]" />
         </div>
         <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <Reveal className="flex justify-center gap-4 mb-20">
               {[1,2,3,4,5].map(i => <Sparkles key={i} size={28} className="text-brand-gold/40" />)}
            </Reveal>
            <div className="relative min-h-[400px] flex items-center justify-center">
               <AnimatePresence mode="wait">
                  <motion.div 
                    key={testimonials[0].id}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="p-12"
                  >
                    <p className="luxury-text text-4xl md:text-6xl italic mb-16 text-brand-champagne leading-tight">
                      "{testimonials[0].content}"
                    </p>
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-12 h-px bg-brand-gold/30" />
                       <p className="micro-label text-brand-gold tracking-[0.5em] uppercase font-bold">— {testimonials[0].author}</p>
                    </div>
                  </motion.div>
               </AnimatePresence>
            </div>
         </div>
      </section>

      {/* Short About - Forge UI Simple Elegant Reveal */}
      <section className="py-40 px-6 max-w-7xl mx-auto text-center">
         <Reveal>
           <h2 className="luxury-text text-4xl md:text-6xl mb-12 max-w-3xl mx-auto font-light leading-tight">
             Plus qu'une marque, une célébration de l'héritage précieux de la peau mélaninée.
           </h2>
           <p className="text-xl text-ui-muted mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
             Chaque formulation PRÉCIEUSE EMPIRE est un secret partagé, un rituel de dignité et un éclat retrouvé.
           </p>
           <Magnetic>
             <Link to="/a-propos" className="btn-outline border-brand-ebony/10 px-12 py-5 rounded-full inline-block tracking-widest font-bold text-xs">
               NOTRE VISION
             </Link>
           </Magnetic>
         </Reveal>
      </section>

      {/* Instagram Grid - Cinematic Grid Load */}
      <section className="py-40 px-6 max-w-7xl mx-auto overflow-hidden text-center border-t border-brand-ebony/5">
         <Reveal className="mb-24">
            <h2 className="luxury-text text-5xl mb-6">Suivez l'Empire</h2>
            <p className="micro-label text-brand-gold tracking-[0.4em] uppercase font-bold">@precieuse_empire_officiel</p>
         </Reveal>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Magnetic>
                  <div className="aspect-square bg-brand-ink/5 rounded-[2rem] overflow-hidden group relative cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700">
                     <img src={`https://images.unsplash.com/photo-1596462502278-27bfaf43399f?auto=format&fit=crop&q=80&w=300&sig=${i}`} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700" />
                     <div className="absolute inset-0 bg-brand-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Instagram className="text-white" size={32} />
                     </div>
                  </div>
                </Magnetic>
              </Reveal>
            ))}
         </div>
      </section>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Scroll state for appearance (blur/bg)
      setIsScrolled(currentScrollY > 20);
      
      // Visibility state (hide on scroll down, show on scroll up)
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/catalogue?q=${encodeURIComponent(globalSearch.trim())}`);
      setIsSearchOpen(false);
      setGlobalSearch("");
    }
  };

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Catalogue", path: "/catalogue" },
    { name: "Événements", path: "/evenements" },
    { name: "Routines", path: "/routines" },
    { name: "À Propos", path: "/a-propos" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -120, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 px-6 sm:px-12",
        isScrolled ? "py-4 sm:py-6" : "py-8 sm:py-12"
      )}
    >
      <div className={cn(
        "max-w-[1500px] mx-auto transition-all duration-1000 flex items-center justify-between px-10 sm:px-12 rounded-[2.5rem] relative group",
        (isScrolled || location.pathname !== '/')
          ? "bg-brand-ebony/95 backdrop-blur-3xl py-4 sm:py-5 border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]" 
          : "bg-white/5 backdrop-blur-md py-6 sm:py-8 border border-white/5 hover:bg-white/10"
      )}>
        <Link to="/" className="flex flex-col items-start shrink-0">
          <span className="luxury-text text-2xl sm:text-3xl font-black tracking-tighter text-white leading-none">PRÉCIEUSE</span>
          <span className="micro-label text-brand-gold text-[7px] sm:text-[8px] tracking-[1em] mt-1">EMPIRE</span>
        </Link>

        {/* Desktop Nav - Majestic Center Links */}
        <div className="hidden xl:flex items-center gap-8 2xl:gap-14">
          {navLinks.map((link, idx) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx + 0.5 }}
            >
              <Link 
                to={link.path}
                className={cn(
                  "micro-label transition-all relative group py-2 text-[10px] tracking-[0.4em] font-black whitespace-nowrap",
                  location.pathname === link.path 
                    ? "text-brand-gold" 
                    : "text-white/40 hover:text-white"
                )}
              >
                {link.name.toUpperCase()}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-700 ease-out group-hover:w-full",
                  location.pathname === link.path && "w-full"
                )} />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          {[
            { icon: <Search size={18} />, action: () => setIsSearchOpen(true), label: "RECHERCHE" },
            { icon: <Heart size={18} />, path: "/favoris", label: "FAVORIS" },
            { icon: <LayoutDashboard size={18} />, path: "/admin", label: "ADMIN" }
          ].map((item, idx) => (
            <Magnetic key={idx}>
              <div className="relative group flex items-center">
                {item.path ? (
                  <Link to={item.path} className="text-white/70 hover:text-white transition-all p-2 sm:p-3 bg-white/5 rounded-full hover:bg-white/20">
                    {item.icon}
                  </Link>
                ) : (
                  <button onClick={item.action} className="text-white/70 hover:text-white transition-all border-none bg-white/5 p-2 sm:p-3 rounded-full hover:bg-white/20 cursor-pointer">
                    {item.icon}
                  </button>
                )}
                <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 micro-label text-[7px] tracking-[0.2em] font-black text-brand-gold opacity-0 group-hover:opacity-100 transition-all bg-brand-ebony/90 backdrop-blur-xl px-3 py-2 rounded-lg whitespace-nowrap shadow-xl pointer-events-none border border-white/10 z-[110]">
                  {item.label}
                </span>
              </div>
            </Magnetic>
          ))}
          
          <button 
            className="xl:hidden text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all ml-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-brand-ebony/95 backdrop-blur-2xl flex items-center justify-center px-6"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-10 right-10 text-white hover:text-brand-gold transition-all p-4 border border-white/10 rounded-full"
            >
              <X size={32} />
            </button>
            <div className="max-w-4xl w-full">
              <form onSubmit={handleGlobalSearch} className="relative">
                <p className="micro-label text-brand-gold mb-6 tracking-[0.5em] text-center">QUE RECHERCHEZ-VOUS DANS L'EMPIRE ?</p>
                <input 
                  autoFocus
                  type="text" 
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Tapez un ingrédient, un éclat, un secret..."
                  className="w-full bg-transparent border-b-2 border-white/10 text-4xl md:text-7xl luxury-text text-white py-8 focus:outline-none focus:border-brand-gold transition-all placeholder:opacity-10 text-center"
                />
                <div className="mt-8 flex justify-center">
                   <button type="submit" className="micro-label text-white/40 hover:text-brand-gold transition-all flex items-center gap-4 group">
                      APPUYEZ SUR ENTRÉE POUR RÉVÉLER <ChevronRight size={16} className="group-hover:translate-x-2 transition-all"/>
                   </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 bg-brand-ebony z-[200] flex flex-col p-12"
          >
            <div className="flex justify-between items-center mb-24">
               <span className="luxury-text text-white text-3xl font-black">PRÉCIEUSE <span className="text-brand-gold">EMPIRE</span></span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-white bg-white/10 p-5 rounded-full"><X size={32}/></button>
            </div>
            
            <div className="flex flex-col gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx + 0.3 }}
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="luxury-text text-5xl text-white hover:text-brand-gold transition-colors inline-block uppercase"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-auto pt-16 border-t border-white/10 flex flex-col gap-10">
               <div>
                  <p className="micro-label text-brand-gold mb-4">L'EXCELLENCE AFRICAINE</p>
                  <p className="text-white/40 text-xs leading-relaxed max-w-xs">Sublimez votre éclat naturel avec nos rituels d'exception inspirés des traditions ancestrales.</p>
               </div>
               <div className="flex gap-8">
                  <Instagram className="text-white/40 hover:text-brand-gold cursor-pointer" size={24}/>
                  <Facebook className="text-white/40 hover:text-brand-gold cursor-pointer" size={24}/>
                  <MessageCircle className="text-white/40 hover:text-brand-gold cursor-pointer" size={24}/>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("hasSeenPromoPopup");
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenPromoPopup", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-ebony/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-brand-ebony text-brand-cream max-w-2xl w-full rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row border border-white/10"
          >
            <button 
              onClick={closePopup}
              className="absolute top-6 right-6 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <X size={20} />
            </button>
            
            <div className="md:w-1/2 aspect-[4/5] md:aspect-auto h-64 md:h-auto">
               <img 
                 src="https://images.unsplash.com/photo-1596462502278-27bfaf43399f?auto=format&fit=crop&q=80&w=600" 
                 className="w-full h-full object-cover grayscale brightness-75" 
                 alt="Promo" 
               />
            </div>
            
            <div className="md:w-1/2 p-10 md:p-12 flex flex-col justify-center">
               <p className="micro-label text-brand-gold mb-4 tracking-[0.3em]">REJOIGNEZ L'EMPIRE</p>
               <h2 className="luxury-text text-4xl mb-6">Offre de Bienvenue</h2>
               <p className="text-brand-cream/60 mb-8 leading-relaxed text-sm">
                 Inscrivez-vous à notre lettre d'information et recevez <strong>-10%</strong> sur votre premier rituel de soin.
               </p>
               <div className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="Votre email" 
                    className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 micro-label focus:outline-none focus:border-brand-gold text-white"
                  />
                  <button 
                    onClick={closePopup}
                    className="btn-primary w-full"
                  >
                    PROFITER DE L'OFFRE
                  </button>
                  <button 
                    onClick={closePopup}
                    className="w-full text-[10px] opacity-40 uppercase tracking-widest hover:opacity-100 transition-opacity"
                  >
                    Non merci, je préfère payer le prix fort
                  </button>
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const WhatsAppButton = () => (
  <a 
    href="https://wa.me/2290150824534" 
    target="_blank" 
    rel="noreferrer"
    className="fixed bottom-8 right-8 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
  >
    <MessageCircle size={28} />
    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold micro-label tracking-normal capitalize">
      Besoin d'aide ?
    </span>
  </a>
);

const Footer = () => (
  <footer className="bg-brand-ebony text-brand-cream pt-24 pb-12 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
      <div className="lg:col-span-1">
        <Link to="/" className="luxury-text text-3xl mb-8 block tracking-tighter text-brand-gold">PRÉCIEUSE EMPIRE</Link>
        <p className="opacity-50 max-w-sm mb-10 leading-relaxed text-sm font-medium">
          L'alliance sacrée entre les secrets ancestraux de la terre d'Afrique et l'innovation cosmétique moderne. Pour que chaque peau rayonne de sa propre lumière.
        </p>
        <div className="flex gap-4">
          <a href="#" className="w-12 h-12 flex items-center justify-center border border-brand-cream/10 rounded-full hover:border-brand-gold hover:text-brand-gold transition-all">
            <Instagram size={18} />
          </a>
          <a href="#" className="w-12 h-12 flex items-center justify-center border border-brand-cream/10 rounded-full hover:border-brand-gold hover:text-brand-gold transition-all">
            <Facebook size={18} />
          </a>
          <a href="#" className="w-12 h-12 flex items-center justify-center border border-brand-cream/10 rounded-full hover:border-brand-gold hover:text-brand-gold transition-all">
            <Twitter size={18} />
          </a>
        </div>
      </div>

      <div>
        <h4 className="micro-label font-bold text-brand-gold mb-10 tracking-[0.2em]">NAVIGATION</h4>
        <ul className="space-y-5">
          {["Accueil", "Catalogue", "Événements", "Routines", "À Propos"].map((item) => (
             <li key={item}>
                <Link 
                  to={item === "Accueil" ? "/" : `/${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "-")}`}
                  className="opacity-50 hover:opacity-100 hover:text-brand-gold transition-all text-sm flex items-center gap-2 group font-medium"
                >
                   <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /> {item}
                </Link>
             </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="micro-label font-bold text-brand-gold mb-10 tracking-[0.2em]">SERVICE CLIENT</h4>
        <ul className="space-y-5">
           <li className="flex items-start gap-4 opacity-50 group cursor-pointer hover:opacity-100">
              <Phone size={18} className="text-brand-gold shrink-0" />
              <div>
                 <p className="text-xs font-bold mb-1">WhatsApp & Appels</p>
                 <p className="text-sm">+229 0150824534</p>
              </div>
           </li>
           <li className="flex items-start gap-4 opacity-50 group cursor-pointer hover:opacity-100">
              <Mail size={18} className="text-brand-gold shrink-0" />
              <div>
                 <p className="text-xs font-bold mb-1">Email</p>
                 <p className="text-sm">merveillesokenou12@gmail.com</p>
              </div>
           </li>
           <li className="flex items-start gap-4 opacity-50">
              <Sparkles size={18} className="text-brand-gold shrink-0" />
              <div>
                 <p className="text-xs font-bold mb-1">Showroom</p>
                 <p className="text-sm">Haie Vive, Cotonou, Bénin</p>
              </div>
           </li>
        </ul>
      </div>

      <div>
        <h4 className="micro-label font-bold text-brand-gold mb-10 tracking-[0.2em]">L'EMPIRE NEWS</h4>
        <p className="opacity-50 text-sm mb-8 leading-relaxed font-medium">
           Recevez nos rituels secrets et nos offres privées en avant-première.
        </p>
        <div className="relative">
           <input 
             type="email" 
             placeholder="Votre email" 
             className="w-full bg-brand-cream/5 border border-brand-cream/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-brand-gold transition-colors text-white"
           />
           <button className="absolute right-2 top-2 bottom-2 bg-brand-gold text-brand-ebony px-6 rounded-full hover:bg-brand-gold-muted transition-colors">
              <ChevronRight size={20} />
           </button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-12 border-t border-brand-cream/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 text-[10px] tracking-widest font-medium">
      <p>COPYRIGHT &copy; 2026 PRÉCIEUSE EMPIRE. TOUS DROITS RÉSERVÉS.</p>
      <div className="flex gap-8">
         <a href="#" className="hover:text-brand-gold transition-colors">MENTIONS LÉGALES</a>
         <a href="#" className="hover:text-brand-gold transition-colors">CGV</a>
         <a href="#" className="hover:text-brand-gold transition-colors">CONFIDENTIALITÉ</a>
      </div>
    </div>
  </footer>
);

// Placeholder components for other pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen text-center">
    <h1 className="luxury-text text-4xl mb-8">{title}</h1>
    <p className="opacity-60">Cette section sera implémentée prochainement pour offrir une expérience complète.</p>
  </div>
);

export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen font-sans selection:bg-brand-gold selection:text-white">
      <Toaster position="top-right" />
      {!isAdminPath && <Navbar />}
      {!isAdminPath && <PromoPopup />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalog />} />
        <Route path="/catalogue/:id" element={<ProductDetail />} />
        <Route path="/evenements" element={<Events />} />
        <Route path="/evenements/:id" element={<EventDetail />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/routines/:id" element={<RoutineDetail />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/favoris" element={<PlaceholderPage title="Vos Favoris" />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <WhatsAppButton />}
    </div>
  );
}

