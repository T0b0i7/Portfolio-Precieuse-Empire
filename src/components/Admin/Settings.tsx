import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Settings as SettingsIcon, 
  Globe, 
  MessageCircle, 
  Smartphone, 
  Shield, 
  ExternalLink,
  Save,
  Palette,
  Layout,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    site_name: 'Précieuse Empire',
    slogan: 'L\'élégance de la beauté naturelle',
    whatsapp_main: '+229 0150824534',
    whatsapp_urgency: '+229 0191362054',
    contact_email: 'merveillesokenou12@gmail.com',
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',
    maintenance_mode: false,
    popup_active: false,
    popup_title: 'Offre Impériale',
    popup_subtitle: 'Profitez de -20% sur votre première routine complète',
    popup_delay: 5,
    popup_image: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {}
    setLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      toast.success('Paramètres impériaux mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const SectionTitle = ({ icon: Icon, title, subtitle }: any) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="luxury-text text-2xl tracking-tighter">{title}</h3>
        <p className="text-[10px] uppercase font-bold tracking-widest text-black/40">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="luxury-text text-4xl mb-2">Configuration Globale</h1>
          <p className="text-black/40 font-medium">Gérez les fondations de votre présence digitale.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-ebony text-white h-14 px-10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-ebony transition-all shadow-xl disabled:opacity-50"
        >
          {isSaving ? 'ENREGISTREMENT...' : <><Save size={18} /> ENREGISTRER LES MODIFICATIONS</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Identité du Site */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-black/5">
          <SectionTitle icon={Globe} title="Identité de l'Empire" subtitle="Nom, slogan et contact" />
          <div className="space-y-6">
            <div>
              <label className="micro-label mb-2 block">Nom de l'entreprise</label>
              <input value={settings.site_name} onChange={e => setSettings({...settings, site_name: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm" />
            </div>
            <div>
              <label className="micro-label mb-2 block">Slogan impérial</label>
              <input value={settings.slogan} onChange={e => setSettings({...settings, slogan: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="micro-label mb-2 block">WhatsApp Principal</label>
                <input value={settings.whatsapp_main} onChange={e => setSettings({...settings, whatsapp_main: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm" />
              </div>
              <div>
                <label className="micro-label mb-2 block">WhatsApp Urgence</label>
                <input value={settings.whatsapp_urgency} onChange={e => setSettings({...settings, whatsapp_urgency: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm" />
              </div>
            </div>
            <div>
              <label className="micro-label mb-2 block">Email de contact</label>
              <input value={settings.contact_email} onChange={e => setSettings({...settings, contact_email: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm" />
            </div>
          </div>
        </div>

        {/* Pop-up Promotionnel */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-black/5">
          <SectionTitle icon={Layout} title="Fenêtre Promotionnelle" subtitle="Configuration du Pop-up" />
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl">
               <div className="flex items-center gap-3">
                 <div className={cn("w-3 h-3 rounded-full", settings.popup_active ? "bg-emerald-500 animate-pulse" : "bg-black/20")} />
                 <span className="text-xs font-bold uppercase tracking-wider">Activation Globale</span>
               </div>
               <button 
                 onClick={() => setSettings({...settings, popup_active: !settings.popup_active})}
                 className={cn("w-14 h-8 rounded-full transition-all relative", settings.popup_active ? "bg-brand-gold" : "bg-black/10")}
               >
                 <div className={cn("absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm", settings.popup_active ? "right-1" : "left-1")} />
               </button>
            </div>
            <div>
              <label className="micro-label mb-2 block">Titre du Pop-up</label>
              <input value={settings.popup_title} onChange={e => setSettings({...settings, popup_title: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm" />
            </div>
            <div>
              <label className="micro-label mb-2 block">Message principal</label>
              <textarea value={settings.popup_subtitle} onChange={e => setSettings({...settings, popup_subtitle: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm resize-none" rows={2} />
            </div>
            <div>
              <label className="micro-label mb-2 block">Délai d'apparition (secondes)</label>
              <select value={settings.popup_delay} onChange={e => setSettings({...settings, popup_delay: Number(e.target.value)})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm">
                <option value={5}>5 secondes</option>
                <option value={10}>10 secondes</option>
                <option value={15}>15 secondes</option>
                <option value={0}>Intention de quitter</option>
              </select>
            </div>
          </div>
        </div>

        {/* Réseaux Sociaux */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-black/5">
          <SectionTitle icon={Share2} title="Social & Connectivité" subtitle="Liens de l'Empire" />
          <div className="space-y-6">
            <div>
              <label className="micro-label mb-2 block">Lien Instagram</label>
              <input value={settings.instagram_url} onChange={e => setSettings({...settings, instagram_url: e.target.value})} placeholder="https://instagram.com/..." className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm" />
            </div>
            <div>
              <label className="micro-label mb-2 block">Lien Facebook</label>
              <input value={settings.facebook_url} onChange={e => setSettings({...settings, facebook_url: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm" />
            </div>
            <div>
              <label className="micro-label mb-2 block">Lien TikTok</label>
              <input value={settings.tiktok_url} onChange={e => setSettings({...settings, tiktok_url: e.target.value})} className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm" />
            </div>
          </div>
        </div>

        {/* Système & Maintenance */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-black/5">
          <SectionTitle icon={Shield} title="Centre de Contrôle" subtitle="Maintenance & Sécurité" />
          <div className="space-y-8">
            <div className={cn(
              "p-8 rounded-[2rem] border transition-all",
              settings.maintenance_mode ? "bg-amber-50 border-amber-200" : "bg-black/5 border-black/5"
            )}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                   <Clock className={cn("shrink-0", settings.maintenance_mode ? "text-amber-500" : "text-black/20")} size={24} />
                   <div>
                     <h4 className="font-bold text-sm">Mode Maintenance</h4>
                     <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Désactive le site vitrine pour les visiteurs</p>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setSettings({...settings, maintenance_mode: !settings.maintenance_mode})}
                className={cn(
                  "w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  settings.maintenance_mode 
                    ? "bg-amber-500 text-white shadow-xl shadow-amber-200" 
                    : "bg-brand-ebony text-white"
                )}
              >
                {settings.maintenance_mode ? 'SITE EN MAINTENANCE' : 'ACTIVER LA MAINTENANCE'}
              </button>
            </div>

            <div className="flex items-center gap-4 p-8 bg-brand-cream rounded-[2rem] border border-brand-gold/20">
               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-gold shrink-0">
                  <AlertCircle size={24} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-brand-ebony">Mode Développeur</h4>
                  <p className="text-xs text-brand-ebony/60 leading-relaxed font-medium">Les modifications effectuées ici sont répercutées en temps réel sur la vitrine si Supabase est connecté.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
