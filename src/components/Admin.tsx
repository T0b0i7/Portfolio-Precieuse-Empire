import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Package, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  Clock,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  LayoutDashboard,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AdminLogin } from './Admin/Login';
import { AdminDashboard } from './Admin/Dashboard';
import { AdminProducts } from './Admin/Products';
import { AdminTasks } from './Admin/Tasks';
import { AdminSettings } from './Admin/Settings';
import { AdminEvents } from './Admin/Events';
import { AdminContent } from './Admin/Content';
import { AdminCollaborators } from './Admin/Collaborators';
import { AdminTestimonials } from './Admin/Testimonials';
import { AdminMediaGallery } from './Admin/MediaGallery';

type AdminView = 'dashboard' | 'products' | 'events' | 'content' | 'testimonials' | 'gallery' | 'tasks' | 'collaborators' | 'settings';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Stock Faible', message: 'Beurre de Karité (moins de 5 unités)', type: 'warning', time: '10 min' },
    { id: 2, title: 'Nouvelle Inscription', message: 'Atelier Teint Parfait : 3 nouveaux inscrits', type: 'info', time: '1h' },
    { id: 3, title: 'Maintenance', message: 'Mise à jour système prévue à 23h', type: 'system', time: '4h' },
  ]);

  const navigateTo = (view: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={(user) => {
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('admin_user', JSON.stringify(user));
    }} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Vue d\'Ensemble', icon: LayoutDashboard, roles: ['super_admin', 'editor', 'commercial', 'collaborator'] },
    { id: 'products', label: 'Catalogue Produits', icon: ShoppingBag, roles: ['super_admin', 'commercial', 'editor'] },
    { id: 'events', label: 'Ateliers & Événements', icon: Calendar, roles: ['super_admin', 'editor'] },
    { id: 'content', label: 'Articles & Routines', icon: FileText, roles: ['super_admin', 'editor'] },
    { id: 'testimonials', label: 'Avis Clients', icon: BarChart3, roles: ['super_admin', 'editor'] },
    { id: 'gallery', label: 'Galerie Média', icon: Package, roles: ['super_admin', 'editor'] },
    { id: 'tasks', label: 'Missions Équipe', icon: CheckSquare, roles: ['super_admin', 'editor', 'commercial', 'collaborator'] },
    { id: 'collaborators', label: 'Membres Empire', icon: Users, roles: ['super_admin'] },
    { id: 'settings', label: 'Configuration', icon: Settings, roles: ['super_admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between mb-2">
        <div className={cn("flex items-center gap-4 overflow-hidden transition-all", sidebarCollapsed ? "w-0 opacity-0" : "w-full opacity-100")}>
          <div className="flex flex-col">
            <span className="luxury-text text-xl tracking-tighter text-white">PRÉCIEUSE</span>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-gold opacity-80 whitespace-nowrap">Back-Office</span>
          </div>
        </div>
        {sidebarCollapsed && <span className="luxury-text text-2xl text-brand-gold mx-auto">P</span>}
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto overflow-x-hidden no-scrollbar">
        {filteredMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentView(item.id as AdminView);
              if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group relative",
              currentView === item.id 
                ? "bg-brand-gold text-brand-ebony font-bold shadow-lg shadow-brand-gold/20" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon size={20} className={cn("shrink-0 transition-transform", currentView === item.id ? "scale-110" : "group-hover:scale-110")} />
            <span className={cn(
              "text-sm transition-all duration-300 whitespace-nowrap",
              sidebarCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible"
            )}>
              {item.label}
            </span>
            {currentView === item.id && !sidebarCollapsed && (
              <motion.div layoutId="nav-pill" className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-ebony/40" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className={cn("flex items-center gap-3 p-3 rounded-2xl bg-white/5 mb-4 transition-all", sidebarCollapsed && "justify-center p-2")}>
           <img src={user.image} className="w-10 h-10 rounded-xl object-cover border border-brand-gold/30 shrink-0" />
           {!sidebarCollapsed && (
             <div className="flex flex-col min-w-0">
               <span className="text-sm font-bold truncate text-white">{user.name}</span>
               <span className="text-[10px] uppercase tracking-wider text-brand-gold">{user.role?.replace('_', ' ')}</span>
             </div>
           )}
        </div>
        <button 
          onClick={handleLogout}
          className={cn("w-full flex items-center gap-4 px-4 py-3 text-white/40 hover:text-red-400 transition-colors", sidebarCollapsed && "justify-center")}
        >
          <LogOut size={20} className="shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-bold">Déconnexion</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className={cn("min-h-screen flex transition-colors duration-500 overflow-hidden", isDarkMode ? "bg-[#0A0A0A] dark" : "bg-[#F8F9FA]")}>
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col transition-all duration-300 sticky top-0 h-screen z-50 border-r",
          isDarkMode ? "bg-black border-white/5" : "bg-brand-ebony border-white/5",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isMobileMenuOpen ? 0 : -300 }}
        className="fixed top-0 bottom-0 left-0 w-72 bg-brand-ebony z-[70] flex flex-col lg:hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen">
        <header className={cn(
          "h-20 backdrop-blur-md border-b flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40 shrink-0 transition-colors",
          isDarkMode ? "bg-black/80 border-white/5" : "bg-white/80 border-black/5"
        )}>
           <div className="flex items-center gap-4 lg:gap-8 flex-1">
             <button 
               onClick={() => {
                 if (window.innerWidth < 1024) setIsMobileMenuOpen(true);
                 else setSidebarCollapsed(!sidebarCollapsed);
               }}
               className={cn("p-2.5 rounded-xl transition-colors", isDarkMode ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-black/5 text-black/60 hover:bg-black/10")}
             >
               <ChevronRight className={cn("transition-transform duration-300", !sidebarCollapsed && "rotate-180")} size={20} />
             </button>
             
             <div className="relative group w-full max-w-xs sm:max-w-md hidden sm:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-brand-gold transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Recherche..."
                 className={cn(
                   "w-full border-none rounded-2xl py-2.5 px-12 text-xs outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium",
                   isDarkMode ? "bg-white/5 text-white placeholder:text-white/20" : "bg-black/5 text-black placeholder:text-black/30"
                 )}
               />
             </div>
           </div>

           <div className="flex items-center gap-3 lg:gap-6">
             <button 
               onClick={() => setIsDarkMode(!isDarkMode)}
               className={cn(
                 "p-2.5 rounded-xl transition-all flex items-center justify-center",
                 isDarkMode ? "bg-white/5 text-brand-gold hover:bg-white/10" : "bg-black/5 text-black/60 hover:bg-black/10"
               )}
               title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
             >
               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             <div className="relative">
               <button 
                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                 className={cn(
                   "p-2.5 rounded-xl relative transition-all", 
                   isDarkMode ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-black/5 text-black/60 hover:bg-black/10"
                 )}
                 title="Notifications"
               >
                 <Bell size={18} />
                 {notifications.length > 0 && (
                   <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-gold rounded-full border-2 border-white" />
                 )}
               </button>

               <AnimatePresence>
                 {isNotificationsOpen && (
                   <>
                     <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
                     <motion.div
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className={cn(
                        "absolute right-0 mt-4 w-80 rounded-3xl shadow-2xl border z-20 overflow-hidden",
                        isDarkMode ? "bg-black border-white/5" : "bg-white border-black/5"
                       )}
                     >
                       <div className="p-6 border-b border-black/5 flex items-center justify-between">
                         <h3 className="font-bold text-[10px] uppercase tracking-widest text-black/40">Notifications</h3>
                         <button onClick={() => setNotifications([])} className="text-[10px] text-brand-gold font-bold hover:underline">TOUT LIRE</button>
                       </div>
                       <div className="max-h-96 overflow-y-auto no-scrollbar pb-4">
                         {notifications.map(n => (
                           <div key={n.id} className="p-5 hover:bg-black/5 transition-colors cursor-pointer border-b border-black/5 last:border-0">
                             <div className="flex justify-between mb-1">
                               <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">{n.title}</p>
                               <span className="text-[8px] text-black/30 font-bold uppercase">{n.time}</span>
                             </div>
                             <p className="text-xs text-black/60 leading-relaxed font-medium">{n.message}</p>
                           </div>
                         ))}
                         {notifications.length === 0 && (
                           <div className="p-10 text-center text-black/30 text-xs font-medium">Aucune notification</div>
                         )}
                       </div>
                     </motion.div>
                   </>
                 )}
               </AnimatePresence>
             </div>
             <a href="/" target="_blank" className="bg-brand-ebony text-white flex items-center justify-center w-12 h-12 lg:w-auto lg:px-6 rounded-xl gap-3 text-xs font-bold hover:bg-brand-gold hover:text-brand-ebony transition-all shadow-lg shadow-black/10">
               <span className="hidden lg:inline">SITE VITRINE</span> <ExternalLink size={16} />
             </a>
           </div>
        </header>

        <div className={cn("flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 transition-colors", isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F8F9FA]")}>
           <AnimatePresence mode="wait">
             <motion.div
               key={currentView}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="max-w-7xl mx-auto"
             >
               {currentView === 'dashboard' && <AdminDashboard user={user} />}
               {currentView === 'products' && <AdminProducts />}
               {currentView === 'tasks' && <AdminTasks user={user} />}
               {currentView === 'settings' && <AdminSettings />}
               {currentView === 'events' && <AdminEvents />}
               {currentView === 'content' && <AdminContent />}
               {currentView === 'testimonials' && <AdminTestimonials />}
               {currentView === 'gallery' && <AdminMediaGallery />}
               {currentView === 'collaborators' && <AdminCollaborators />}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
