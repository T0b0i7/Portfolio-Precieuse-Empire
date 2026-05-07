import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AdminLoginProps {
  onLogin: (user: any) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Heureux de vous revoir, ${data.user.name}`);
        onLogin(data.user);
      } else {
        toast.error(data.message || 'Identifiants incorrects');
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bronze/5 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[4rem] p-12 shadow-2xl border border-black/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <ShieldCheck size={120} />
        </div>

        <div className="mb-12 text-center">
          <h1 className="luxury-text text-4xl mb-4 tracking-tighter">PRÉCIEUSE</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-brand-bronze opacity-80 mb-10">Access Portal</p>
          <div className="h-[1px] w-12 bg-brand-bronze mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-brand-bronze transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Identifiant impérial (Email)"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/[0.02] border-none rounded-[2rem] py-5 pl-16 pr-8 outline-none focus:ring-1 focus:ring-brand-bronze/50 transition-all font-medium placeholder:text-black/20"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-brand-bronze transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Mot de passe secret"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/[0.02] border-none rounded-[2rem] py-5 pl-16 pr-8 outline-none focus:ring-1 focus:ring-brand-bronze/50 transition-all font-medium placeholder:text-black/20"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-obsidian text-white py-6 rounded-[2rem] flex items-center justify-center gap-4 text-xs font-bold tracking-widest hover:bg-brand-bronze hover:text-brand-obsidian transition-all shadow-2xl shadow-black/10 group disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>ENTRER DANS L'ESPACE <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18}/></>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
           <p className="text-[10px] text-black/20 font-bold uppercase tracking-widest">
             Ce portail est réservé aux collaborateurs autorisés.<br/>
             Toute intrusion sera tracée.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
