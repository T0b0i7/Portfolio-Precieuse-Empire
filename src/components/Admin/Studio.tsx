import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  PenTool, 
  Image as ImageIcon, 
  Send, 
  Copy, 
  Check, 
  Download, 
  RefreshCw,
  Library,
  Zap,
  ArrowRight,
  Palette,
  FileText,
  Instagram,
  Target
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export function AdminStudio() {
  const [activeTool, setActiveTool] = useState<'copy' | 'flyer'>('copy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [flyerConcept, setFlyerConcept] = useState<any>(null);
  
  // Copy state
  const [copyInput, setCopyInput] = useState({
    product: '',
    tone: 'luxury',
    target: 'instagram',
    details: ''
  });
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [copied, setCopied] = useState(false);

  // Flyer state
  const [flyerPrompt, setFlyerPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateCopy = async () => {
    if (!copyInput.product) {
      toast.error("Veuillez entrer le nom du produit");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Génère un texte de vente luxueux et persuasif pour le produit "${copyInput.product}".
      Marque: Précieuse Empire (Cosmétiques de luxe africains).
      Détails: ${copyInput.details}
      Ton: ${copyInput.tone} (Majestueux, Éclatant, Impérial)
      Format cible: ${copyInput.target}
      Le texte doit être en français, utiliser un vocabulaire sensoriel et haut de gamme. 
      Inclure des emojis appropriés et des hashtags pertinents. 
      Si c'est pour Instagram, ajoute une structure d'accroche, corps de texte et appel à l'action.`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: "gemini-1.5-flash" })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setGeneratedCopy(data.text || '');
      toast.success("Magie opérée ! Le texte est prêt.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Une erreur est survenue lors de la génération.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFlyer = async () => {
    if (!flyerPrompt) {
      toast.error("Veuillez décrire le concept de votre flyer");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Tu es un directeur artistique de luxe. En te basant sur cette demande : "${flyerPrompt}", génère un concept visuel et textuel pour un flyer.
      Renvoie UNIQUEMENT un objet JSON avec les champs suivants :
      - title: Un titre accrocheur
      - subtitle: Un sous-titre élégant
      - backgroundColor: Une couleur hexadécimale (doit être sombre ou dorée)
      - accentColor: Une couleur d'accent (doré #C5A16B)
      - mainMessage: Le message principal de vente
      - callToAction: L'appel à l'action
      - mood: Une description de l'ambiance (3 mots)
      - suggestedImageDescription: Une description pour une image (pour inspiration)
      Marque : Précieuse Empire. Style : Royal, Africain Moderne, Minimaliste.`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: "gemini-1.5-flash" })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      const text = data.text || "{}";
      // Robust JSON extraction
      let jsonStr = text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const concept = JSON.parse(jsonStr);
      setFlyerConcept(concept);
      // Simulate image based on concept or use a high quality related one
      setGeneratedImage("https://images.unsplash.com/photo-1596462502278-27bfaf43399f?auto=format&fit=crop&q=80&w=800"); 
      toast.success("Concept de flyer généré !");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur de génération du flyer.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCopy);
    setCopied(true);
    toast.success("Copié dans le presse-papier");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="luxury-text text-4xl mb-2 text-black">Studio Créatif AI</h1>
          <p className="text-black/40 font-medium font-sans italic">Propulsez votre marketing avec l'intelligence impériale.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-black/5 shadow-sm">
          <button 
            onClick={() => setActiveTool('copy')}
            className={cn(
              "px-6 py-3 rounded-xl micro-label text-[10px] font-black tracking-widest transition-all",
              activeTool === 'copy' ? "bg-brand-obsidian text-white shadow-lg" : "text-black/40 hover:text-black"
            )}
          >
            COPYWRITING
          </button>
          <button 
            onClick={() => setActiveTool('flyer')}
            className={cn(
              "px-6 py-3 rounded-xl micro-label text-[10px] font-black tracking-widest transition-all",
              activeTool === 'flyer' ? "bg-brand-obsidian text-white shadow-lg" : "text-black/40 hover:text-black"
            )}
          >
            GÉNÉRATEUR DE VISUELS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input section */}
        <div className="lg:col-span-5 space-y-8">
          <AnimatePresence mode="wait">
            {activeTool === 'copy' ? (
              <motion.div
                key="copy-input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-[2.5rem] p-10 border border-black/5 shadow-sm space-y-8"
              >
                <div className="flex items-center gap-4 text-brand-bronze mb-2">
                  <PenTool size={24} />
                  <h3 className="luxury-text text-2xl">Copywriter Assistant</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-black/40 uppercase tracking-widest mb-3 px-1">Produit concerné</label>
                    <input 
                      type="text"
                      placeholder="Ex: Masque à l'Or de Côte d'Ivoire"
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-bronze transition-all"
                      value={copyInput.product}
                      onChange={e => setCopyInput({...copyInput, product: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-black/40 uppercase tracking-widest mb-3 px-1">Ton impérial</label>
                      <select 
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-bronze transition-all"
                        value={copyInput.tone}
                        onChange={e => setCopyInput({...copyInput, tone: e.target.value})}
                      >
                        <option value="luxury">Luxe & Élégance</option>
                        <option value="enthusiastic">Enthousiaste & Énergique</option>
                        <option value="educational">Éducatif & Expert</option>
                        <option value="minimalist">Minimaliste & Chic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-black/40 uppercase tracking-widest mb-3 px-1">Canal</label>
                      <select 
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-bronze transition-all"
                        value={copyInput.target}
                        onChange={e => setCopyInput({...copyInput, target: e.target.value})}
                      >
                        <option value="instagram">Instagram / Facebook</option>
                        <option value="website">Site Web (Landing)</option>
                        <option value="email">Newsletter</option>
                        <option value="ads">Publicité Google/Meta</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-black/40 uppercase tracking-widest mb-3 px-1">Détails ou points forts</label>
                    <textarea 
                      rows={4}
                      placeholder="Ingrédients clés, Bénéfices, Offre spéciale..."
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-bronze transition-all resize-none"
                      value={copyInput.details}
                      onChange={e => setCopyInput({...copyInput, details: e.target.value})}
                    />
                  </div>

                  <button 
                    onClick={handleGenerateCopy}
                    disabled={isGenerating}
                    className="w-full bg-brand-obsidian text-white py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-brand-bronze hover:text-brand-obsidian transition-all shadow-xl group disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Zap size={20} className="fill-brand-bronze text-brand-bronze group-hover:text-brand-obsidian" />
                        <span className="micro-label font-black tracking-widest text-[11px]">DÉPLOYER LA MAGIE AI</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="flyer-input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-[2.5rem] p-10 border border-black/5 shadow-sm space-y-8"
              >
                <div className="flex items-center gap-4 text-brand-bronze mb-2">
                  <Palette size={24} />
                  <h3 className="luxury-text text-2xl">Studio Graphique</h3>
                </div>

                <div className="space-y-6">
                  <p className="text-xs text-black/50 leading-relaxed italic">
                    Décrivez l'ambiance du visuel que vous souhaitez créer. L'AI adaptera automatiquement le style au luxe de Précieuse Empire.
                  </p>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-black/40 uppercase tracking-widest mb-3 px-1">Concept du visuel</label>
                    <textarea 
                      rows={5}
                      placeholder="Ex: Une ambiance dorée au crépuscule avec le sérum Éclat Rare posé sur une pierre précieuse entourée de pétales de jasmin..."
                      className="w-full bg-black/5 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-brand-bronze transition-all resize-none leading-relaxed"
                      value={flyerPrompt}
                      onChange={e => setFlyerPrompt(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/[0.02] border border-black/5 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-brand-bronze/10 hover:border-brand-bronze/30 transition-all cursor-pointer">
                       <Instagram size={24} className="text-black/20 group-hover:text-brand-bronze mb-2" />
                       <span className="text-[10px] font-bold uppercase tracking-wider">Format Story</span>
                    </div>
                    <div className="p-4 bg-black/[0.02] border border-black/5 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-brand-bronze/10 hover:border-brand-bronze/30 transition-all cursor-pointer border-brand-bronze/30 bg-brand-bronze/5">
                       <FileText size={24} className="text-brand-bronze mb-2" />
                       <span className="text-[10px] font-bold uppercase tracking-wider text-brand-bronze">Format Flyer / Post</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerateFlyer}
                    disabled={isGenerating}
                    className="w-full bg-brand-obsidian text-white py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-brand-bronze hover:text-brand-obsidian transition-all shadow-xl group font-sans disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      <>
                        <ImageIcon size={20} />
                        <span className="micro-label font-black tracking-widest text-[11px]">GÉNÉRER LE VISUEL</span>
                      </>
                    )}
                  </button>
                  
                  <p className="text-[8px] text-center text-black/30 font-bold uppercase tracking-[0.2em] px-4">
                    Note: La génération d'images haute résolution peut prendre quelques secondes.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Output section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeTool === 'copy' ? (
              <motion.div
                key="copy-result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-obsidian rounded-[3.5rem] p-12 h-full flex flex-col shadow-premium min-h-[600px] border border-white/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-bronze opacity-[0.03] blur-[100px] -mr-32 -mt-32" />
                
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-bronze">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h3 className="text-white luxury-text text-xl">Résultat de la Copie</h3>
                      <p className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-bold">Optimisé par Gemini-1.5</p>
                    </div>
                  </div>
                  {generatedCopy && (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10"
                      >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span className="text-[10px] font-bold tracking-widest uppercase">{copied ? 'COPIÉ' : 'COPIER'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 relative z-10">
                  {generatedCopy ? (
                    <div className="bg-white/5 rounded-3xl p-10 h-full border border-white/5 text-white/80 leading-relaxed whitespace-pre-wrap font-serif text-lg italic italic-shadow overflow-y-auto no-scrollbar">
                      {generatedCopy}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-10">
                      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/10 mb-4 animate-pulse">
                        <PenTool size={48} />
                      </div>
                      <div className="space-y-4">
                        <h4 className="luxury-text text-2xl text-white/40">Prêt à briller ?</h4>
                        <p className="text-white/20 text-sm italic max-w-sm font-sans">
                          Remplissez les détails à gauche et laissez l'Esprit de l'Empire rédiger vos textes les plus captivants.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {generatedCopy && (
                  <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-10">
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-bold">© Studio Créatif Précieuse</p>
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">IA Active</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="flyer-result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-obsidian rounded-[3.5rem] p-12 h-full flex flex-col shadow-premium min-h-[600px] border border-white/5"
              >
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-bronze">
                      <ImageIcon size={20} />
                    </div>
                    <h3 className="text-white luxury-text text-xl">Aperçu du Visuel</h3>
                  </div>
                  {generatedImage && (
                    <button className="flex items-center gap-2 px-6 py-3 bg-brand-bronze text-brand-obsidian rounded-full font-black micro-label text-[10px] tracking-widest hover:bg-white transition-all">
                      <Download size={14} /> TÉLÉCHARGER
                    </button>
                  )}
                </div>

                <div className="flex-1 bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden flex items-center justify-center relative group">
                  {flyerConcept ? (
                    <motion.div 
                      style={{ backgroundColor: flyerConcept.backgroundColor || '#0F1113' }}
                      className="w-full h-full relative p-12 flex flex-col items-center justify-center text-center overflow-hidden"
                    >
                      {/* Decorative elements */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-bronze/50 to-transparent" />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 space-y-8"
                      >
                         <div className="w-16 h-[1px] bg-brand-bronze mx-auto mb-8" />
                         
                         <h4 style={{ color: flyerConcept.accentColor }} className="text-[10px] font-black uppercase tracking-[0.5em] mb-4">
                           {flyerConcept.subtitle || 'PRÉCIEUSE EMPIRE'}
                         </h4>
                         
                         <h2 className="luxury-text text-5xl md:text-6xl text-white italic leading-tight mb-8">
                           {flyerConcept.title || 'Collection Éclat'}
                         </h2>
                         
                         <div className="max-w-md mx-auto">
                            <p className="text-white/70 text-lg font-serif italic mb-10 leading-relaxed">
                               {flyerConcept.mainMessage}
                            </p>
                         </div>
                         
                         <button 
                           style={{ backgroundColor: flyerConcept.accentColor }}
                           className="px-12 py-5 rounded-full text-brand-obsidian micro-label font-black tracking-widest text-[10px] shadow-2xl"
                         >
                           {flyerConcept.callToAction}
                         </button>
                         
                         <div className="pt-12">
                           <p className="text-[8px] text-white/30 uppercase tracking-[0.4em] font-bold">
                             {flyerConcept.mood} • LUXE AUTHENTIQUE
                           </p>
                         </div>
                      </motion.div>
                      
                      {/* Artistic overlay */}
                      <div 
                        className="absolute bottom-0 right-0 w-full h-1/2 opacity-20 pointer-events-none"
                        style={{ background: `linear-gradient(to top, ${flyerConcept.accentColor}, transparent)` }}
                      />
                    </motion.div>
                  ) : generatedImage ? (
                    <img src={generatedImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  ) : (
                    <div className="text-center space-y-8 p-10">
                        <Library className="mx-auto text-white/5" size={80} />
                        <div className="space-y-3">
                          <h4 className="luxury-text text-2xl text-white/30">Chef-d'œuvre à venir</h4>
                          <p className="text-white/20 text-xs max-w-xs mx-auto font-sans italic">
                            Votre vision artistique prendra forme ici. Le luxe se dessine dans les détails.
                          </p>
                        </div>
                    </div>
                  )}
                  
                  {generatedImage && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex gap-4">
                        <button className="p-4 bg-white text-brand-obsidian rounded-full hover:scale-110 transition-transform">
                          <RefreshCw size={20} />
                        </button>
                        <button className="p-4 bg-brand-bronze text-brand-obsidian rounded-full hover:scale-110 transition-transform">
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Templates / Inspiration section */}
      <section className="bg-white rounded-[3rem] p-12 border border-black/5 shadow-sm">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="luxury-text text-3xl mb-2">Bibliothèque d'Inspiration</h3>
            <p className="text-black/40 text-sm font-sans italic">Modèles de thèmes pré-configurés pour vos campagnes.</p>
          </div>
          <button className="p-4 bg-black/5 rounded-2xl hover:bg-brand-bronze/10 transition-all text-brand-bronze">
            <Library size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { tag: 'COLLECTION', title: "Lancement 'Éclat Rare'", desc: "Focus sur la pureté et l'exceptionnel.", icon: Target, prompt: "Nouveau sérum Éclat Rare aux extraits de perles noires et or 24k" },
            { tag: 'SOCIAL', title: "Contenu Éducatif", desc: "Expliquer les rituels et les bienfaits.", icon: Sparkles, prompt: "Les 5 secrets du beurre de karité impérial pour une peau soyeuse" },
            { tag: 'PROMOTION', title: "Offre de Saison", desc: "Appel à l'action élégant et pressant.", icon: Zap, prompt: "Vente privée exclusive -30% pour les membres du Cercle Impérial" }
          ].map((temp, i) => (
            <div 
              key={i} 
              onClick={() => {
                if (activeTool === 'copy') {
                  setCopyInput({ ...copyInput, product: temp.title, details: temp.prompt });
                  toast.success("Modèle de texte chargé !");
                } else {
                  setFlyerPrompt(temp.prompt);
                  toast.success("Modèle de flyer chargé !");
                }
              }}
              className="group p-8 rounded-[2rem] bg-black/[0.02] border border-black/5 hover:border-brand-bronze/30 hover:bg-brand-bronze/5 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[9px] font-black tracking-widest text-brand-bronze bg-brand-bronze/10 px-3 py-1.5 rounded-full">{temp.tag}</span>
                <temp.icon size={20} className="text-black/20 group-hover:text-brand-bronze" />
              </div>
              <h4 className="text-xl font-bold mb-2 transition-colors group-hover:text-brand-obsidian">{temp.title}</h4>
              <p className="text-xs text-black/40 font-medium mb-8 leading-relaxed font-sans">{temp.desc}</p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/30 group-hover:text-brand-bronze transition-colors">
                Utiliser ce modèle <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
