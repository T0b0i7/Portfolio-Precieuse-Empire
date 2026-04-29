import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Plus, 
  Mail, 
  Shield, 
  UserPlus, 
  MoreVertical, 
  Power, 
  ShieldCheck, 
  Clock,
  History,
  Layout,
  ExternalLink,
  Settings,
  Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export function AdminCollaborators() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor',
    status: 'active'
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      setTeam(data);
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'équipe');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status || 'active'
    });
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      role: 'editor',
      status: 'active'
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Révoquer l\'accès de ce collaborateur ?')) return;
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Collaborateur révoqué');
        fetchTeam();
      }
    } catch (error) {
      toast.error('Erreur lors de la révocation');
    }
  };

  const toggleStatus = async (member: any) => {
    const newStatus = member.status === 'inactive' ? 'active' : 'inactive';
    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...member, status: newStatus })
      });
      if (res.ok) {
        toast.success(`Statut de ${member.name} mis à jour`);
        fetchTeam();
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingMember ? `/api/admin/team/${editingMember.id}` : '/api/admin/team';
      const method = editingMember ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success(editingMember ? 'Collaborateur mis à jour' : 'Collaborateur invité');
        setIsFormOpen(false);
        fetchTeam();
      }
    } catch (error) {
      toast.error('Erreur serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'super_admin': return { label: 'SUPER ADMIN', color: 'text-brand-gold bg-brand-gold/10' };
      case 'commercial': return { label: 'COMMERCIAL', color: 'text-blue-500 bg-blue-50' };
      case 'editor': return { label: 'ÉDITEUR', color: 'text-purple-500 bg-purple-50' };
      case 'collaborator': return { label: 'COLLABORATEUR', color: 'text-black/40 bg-black/5' };
      default: return { label: role?.toUpperCase() || 'MEMBRE', color: 'text-black/40 bg-black/5' };
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="luxury-text text-4xl mb-2">Gestion de l'Équipe</h1>
          <p className="text-black/40 font-medium">Invitez et gérez les accès des collaborateurs de l'Empire.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-ebony text-white h-14 px-8 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold hover:bg-brand-gold hover:text-brand-ebony transition-all shadow-xl group shadow-black/10"
        >
          <UserPlus size={20} className="group-hover:scale-110 transition-transform" /> INVITER UN MEMBRE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white h-64 rounded-[3rem] animate-pulse border border-black/5" />
          ))
        ) : (
          <>
            {team.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[3rem] border border-black/5 group hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                   <Shield size={80} />
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <img src={member.image} className="w-20 h-20 rounded-[1.8rem] object-cover border-2 border-brand-gold/20 group-hover:border-brand-gold transition-all" />
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white",
                      member.status === 'inactive' ? "bg-red-500" : "bg-emerald-500"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-xs text-black/40 mb-3 truncate max-w-[150px]">{member.email || 'Email non fourni'}</p>
                    <span className={cn("px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest", getRoleConfig(member.role).color)}>
                      {getRoleConfig(member.role).label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-black/5">
                   <button 
                    onClick={() => handleEdit(member)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/[0.02] hover:bg-black/[0.05] transition-all gap-1 group/btn"
                   >
                      <Settings size={16} className="text-black/20 group-hover/btn:text-brand-gold" />
                      <span className="text-[9px] font-bold text-black/40 uppercase tracking-widest">Modifier</span>
                   </button>
                   <button 
                    onClick={() => handleDelete(member.id)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/[0.02] hover:bg-red-50 transition-all gap-1 group/btn"
                   >
                      <Trash2 size={16} className="text-black/20 group-hover/btn:text-red-500" />
                      <span className="text-[9px] font-bold text-black/40 uppercase tracking-widest group-hover/btn:text-red-500">Révoquer</span>
                   </button>
                </div>

                <div className="mt-6 flex items-center justify-between px-2">
                   <div className="flex items-center gap-2 text-[10px] text-black/20 font-bold uppercase tracking-widest">
                      <Clock size={12} /> {member.status === 'inactive' ? 'Désactivé' : 'Actif'}
                   </div>
                   <div className="flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleStatus(member)}
                        className={cn("p-2 rounded-xl bg-black/5 transition-all", member.status === 'inactive' ? "text-emerald-500 hover:bg-emerald-50" : "text-red-400 hover:bg-red-50")}
                      >
                        <Power size={18} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}

            {/* Invitation Card */}
            <div 
              onClick={handleCreate}
              className="bg-black/[0.02] p-8 rounded-[3rem] border-2 border-dashed border-black/5 flex flex-col items-center justify-center text-center gap-6 group hover:bg-black/[0.04] transition-all cursor-pointer"
            >
               <div className="w-20 h-20 rounded-[2.5rem] bg-white border-2 border-dashed border-black/10 flex items-center justify-center text-black/10 group-hover:bg-brand-gold/10 group-hover:text-brand-gold group-hover:border-brand-gold/30 transition-all">
                  <Mail size={32} />
               </div>
               <div>
                  <h4 className="luxury-text text-xl mb-2">Inviter un Collaborateur</h4>
                  <p className="text-xs text-black/30 max-w-[200px]">Envoyez un lien d'accès sécurisé valable 48h.</p>
               </div>
               <button className="btn-primary scale-90">COMMENCER</button>
            </div>
          </>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-brand-ebony/60 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden p-10"
            >
              <h2 className="luxury-text text-3xl mb-8 text-center">{editingMember ? 'Modifier Collaborateur' : 'Inviter un Collaborateur'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Nom Complet</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-gold/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Email Impérial</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-gold/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Rôle</label>
                      <select 
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-gold/50"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="editor">Éditeur</option>
                        <option value="commercial">Commercial</option>
                        <option value="collaborator">Collaborateur</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Statut</label>
                      <select 
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-gold/50"
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-black/10 hover:bg-black/5 transition-all font-bold"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-brand-ebony text-white h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-ebony transition-all disabled:opacity-50 shadow-xl shadow-brand-gold/10"
                  >
                    {isSubmitting ? 'Enregistrement...' : (editingMember ? 'METTRE À JOUR' : 'INVITER')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
