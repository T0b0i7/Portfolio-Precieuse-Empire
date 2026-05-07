import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Image as ImageIcon,
  User,
  Star,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import { dataService, AboutContent, TeamMember, ValueItem, TimelineEvent } from '../../services/dataService';

export function AdminAbout() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'values' | 'team' | 'timeline'>('general');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const data = await dataService.getAbout();
      setContent(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des contenus');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updates: Partial<AboutContent>) => {
    setIsSubmitting(true);
    try {
      const updated = await dataService.updateAbout(updates);
      setContent(updated);
      toast.success('Contenu mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (field: keyof AboutContent | string, index?: number, listField?: 'values' | 'team' | 'timeline') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (listField && index !== undefined && content) {
            const newList = [...(content[listField] as any[])];
            newList[index] = { ...newList[index], image: result };
            handleUpdate({ [listField]: newList });
          } else {
            handleUpdate({ [field as keyof AboutContent]: result });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (loading || !content) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-bronze border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const tabs = [
    { id: 'general', label: 'GÉNÉRAL', icon: Edit2 },
    { id: 'values', label: 'VALEURS', icon: Star },
    { id: 'team', label: 'ÉQUIPE', icon: User },
    { id: 'timeline', label: 'HISTOIRE', icon: Clock },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="luxury-text text-4xl mb-2">Gestion À Propos</h1>
          <p className="text-black/40 font-medium">Personnalisez l'histoire et l'identité de votre empire.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-2 bg-white rounded-3xl border border-black/5 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all",
              activeTab === tab.id ? "bg-brand-obsidian text-white shadow-xl shadow-black/10" : "text-black/40 hover:bg-black/5"
            )}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3.5rem] p-10 border border-black/5 shadow-sm">
        {activeTab === 'general' && (
          <div className="space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h3 className="luxury-text text-2xl mb-6">Hero Section</h3>
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Titre Hero</label>
                      <input 
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50"
                        value={content.hero_title}
                        onChange={(e) => setContent({...content, hero_title: e.target.value})}
                        onBlur={() => handleUpdate({ hero_title: content.hero_title })}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Sous-titre (Citation)</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50 resize-none"
                        value={content.hero_subtitle}
                        onChange={(e) => setContent({...content, hero_subtitle: e.target.value})}
                        onBlur={() => handleUpdate({ hero_subtitle: content.hero_subtitle })}
                      />
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Image de fond</label>
                   <div 
                      onClick={() => handleFileUpload('hero_image')}
                      className="aspect-[16/9] rounded-[2.5rem] bg-black/5 border-2 border-dashed border-black/10 flex flex-col items-center justify-center cursor-pointer hover:border-brand-bronze/30 overflow-hidden relative group transition-all"
                   >
                     {content.hero_image ? (
                        <img src={content.hero_image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                     ) : (
                        <ImageIcon className="text-black/10" size={40} />
                     )}
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold text-xs">CHANGER L'IMAGE</div>
                   </div>
                </div>
             </div>

             <div className="pt-10 border-t border-black/5">
                <h3 className="luxury-text text-2xl mb-8">Notre Histoire</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Titre de l'histoire</label>
                      <input 
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50 mb-6"
                        value={content.story_title}
                        onChange={(e) => setContent({...content, story_title: e.target.value})}
                        onBlur={() => handleUpdate({ story_title: content.story_title })}
                      />
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Paragraphe 1</label>
                      <textarea 
                        rows={4}
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50 resize-none mb-6"
                        value={content.story_text_1}
                        onChange={(e) => setContent({...content, story_text_1: e.target.value})}
                        onBlur={() => handleUpdate({ story_text_1: content.story_text_1 })}
                      />
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Paragraphe 2</label>
                      <textarea 
                        rows={4}
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-bronze/50 resize-none"
                        value={content.story_text_2}
                        onChange={(e) => setContent({...content, story_text_2: e.target.value})}
                        onBlur={() => handleUpdate({ story_text_2: content.story_text_2 })}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Notre Mission (Texte mis en avant)</label>
                      <textarea 
                        rows={10}
                        className="w-full h-[320px] bg-brand-obsidian text-brand-champagne border-none rounded-[3rem] p-10 text-lg italic luxury-text outline-none focus:ring-2 focus:ring-brand-bronze/50 resize-none shadow-xl"
                        value={content.mission_text}
                        onChange={(e) => setContent({...content, mission_text: e.target.value})}
                        onBlur={() => handleUpdate({ mission_text: content.mission_text })}
                      />
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'values' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.values.map((val, i) => (
              <div key={val.id} className="bg-black/[0.02] p-8 rounded-[2.5rem] border border-black/5 relative group hover:bg-white hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-brand-bronze">
                   <Star size={20} />
                </div>
                <input 
                  className="w-full bg-transparent border-none text-lg font-bold mb-4 outline-none focus:text-brand-bronze transition-colors p-0"
                  value={val.title}
                  onChange={(e) => {
                    const next = [...content.values];
                    next[i].title = e.target.value;
                    setContent({...content, values: next});
                  }}
                  onBlur={() => handleUpdate({ values: content.values })}
                />
                <textarea 
                  rows={4}
                  className="w-full bg-transparent border-none text-xs text-black/40 leading-relaxed outline-none focus:text-black/60 resize-none p-0"
                  value={val.desc}
                  onChange={(e) => {
                    const next = [...content.values];
                    next[i].desc = e.target.value;
                    setContent({...content, values: next});
                  }}
                  onBlur={() => handleUpdate({ values: content.values })}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'team' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {content.team.map((member, i) => (
                 <div key={member.id} className="group relative">
                    <div 
                      onClick={() => handleFileUpload('', i, 'team')}
                      className="aspect-[3/4] rounded-[3.5rem] bg-black/5 overflow-hidden mb-6 relative cursor-pointer group-hover:shadow-2xl transition-all border border-black/5"
                    >
                       <img src={member.image} className="w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="text-white" size={32} />
                       </div>
                    </div>
                    <div className="flex flex-col gap-4">
                       <input 
                         className="w-full bg-transparent border-none text-xl font-bold luxury-text outline-none text-center"
                         value={member.name}
                         onChange={(e) => {
                           const next = [...content.team];
                           next[i].name = e.target.value;
                           setContent({...content, team: next});
                         }}
                         onBlur={() => handleUpdate({ team: content.team })}
                       />
                       <input 
                         className="w-full bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.2em] text-brand-bronze text-center outline-none"
                         value={member.role}
                         onChange={(e) => {
                           const next = [...content.team];
                           next[i].role = e.target.value;
                           setContent({...content, team: next});
                         }}
                         onBlur={() => handleUpdate({ team: content.team })}
                       />
                    </div>
                 </div>
              ))}
              <div className="aspect-[3/4] rounded-[3.5rem] border-2 border-dashed border-black/10 flex flex-col items-center justify-center group cursor-pointer hover:border-brand-bronze transition-all bg-black/[0.01]">
                 <Plus size={40} className="text-black/10 group-hover:text-brand-bronze mb-4 transition-all" />
                 <p className="text-[10px] font-bold text-black/20 group-hover:text-brand-bronze uppercase tracking-widest">Ajouter un membre</p>
              </div>
           </div>
        )}

        {activeTab === 'timeline' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.timeline.map((item, i) => (
                 <div key={item.id} className="p-10 bg-black/[0.02] rounded-[3rem] border border-black/5 flex gap-8 group hover:bg-white hover:shadow-xl transition-all">
                    <div className="flex flex-col items-center gap-4">
                       <input 
                         className="w-20 bg-brand-bronze/10 text-brand-bronze rounded-xl py-2 px-1 text-sm font-bold text-center outline-none"
                         value={item.date}
                         onChange={(e) => {
                           const next = [...content.timeline];
                           next[i].date = e.target.value;
                           setContent({...content, timeline: next});
                         }}
                         onBlur={() => handleUpdate({ timeline: content.timeline })}
                       />
                       <div className="flex-1 w-[1px] bg-brand-bronze/20" />
                    </div>
                    <div className="flex-1 space-y-4">
                       <input 
                         className="w-full bg-transparent border-none text-lg font-bold outline-none font-sans"
                         value={item.title}
                         onChange={(e) => {
                           const next = [...content.timeline];
                           next[i].title = e.target.value;
                           setContent({...content, timeline: next});
                         }}
                         onBlur={() => handleUpdate({ timeline: content.timeline })}
                       />
                       <textarea 
                         rows={3}
                         className="w-full bg-transparent border-none text-xs text-black/40 leading-relaxed outline-none resize-none"
                         value={item.desc}
                         onChange={(e) => {
                           const next = [...content.timeline];
                           next[i].desc = e.target.value;
                           setContent({...content, timeline: next});
                         }}
                         onBlur={() => handleUpdate({ timeline: content.timeline })}
                       />
                    </div>
                    <button className="h-fit p-3 text-black/10 hover:text-red-500 transition-colors">
                       <Trash2 size={18} />
                    </button>
                 </div>
              ))}
               <div className="p-10 border-2 border-dashed border-black/10 rounded-[3rem] flex flex-col items-center justify-center group cursor-pointer hover:border-brand-bronze transition-all hover:bg-white bg-black/[0.01]">
                 <Plus size={40} className="text-black/10 group-hover:text-brand-bronze mb-4 transition-all" />
                 <p className="text-[10px] font-bold text-black/20 group-hover:text-brand-bronze uppercase tracking-widest">Ajouter une étape</p>
              </div>
           </div>
        )}
      </div>

      <div className="flex items-center justify-between p-10 bg-brand-obsidian rounded-[3rem] text-white">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-bronze/20 flex items-center justify-center text-brand-bronze">
               <CheckCircle2 size={32} />
            </div>
            <div>
               <p className="font-bold text-xl luxury-text">Toutes les modifications sont synchronisées</p>
               <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Le site est à jour avec vos derniers secrets impériaux</p>
            </div>
         </div>
         <button 
           onClick={() => window.open('/a-propos', '_blank')}
           className="bg-white/10 hover:bg-white text-white hover:text-brand-obsidian px-10 py-5 rounded-2xl micro-label font-black tracking-widest transition-all"
         >
           VOIR LA PAGE EN DIRECT
         </button>
      </div>
    </div>
  );
}
