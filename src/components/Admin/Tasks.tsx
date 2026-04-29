import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  MoreVertical, 
  MessageSquare, 
  Paperclip,
  Calendar,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

type TaskStatus = 'todo' | 'in_progress' | 'done';
type ViewType = 'kanban' | 'list';

export function AdminTasks({ user }: { user: any }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [viewType, setViewType] = useState<ViewType>('kanban');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    deadline: '',
    status: 'todo',
    assignees: [] as number[]
  });

  useEffect(() => {
    fetchTasks();
    fetchTeam();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tasks');
      const data = await res.json();
      // Si collaborator, filtrer par tâches assignées
      if (user.role === 'collaborator') {
        setTasks(data.filter((t: any) => t.assignees?.some((a: any) => a.id === user.id)));
      } else {
        setTasks(data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      setTeam(data);
    } catch (error) {}
  };

  const updateTaskStatus = async (id: number, status: TaskStatus) => {
    try {
      await fetch(`/api/admin/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Mission créée et assignée');
        setIsFormOpen(false);
        setFormData({ title: '', description: '', priority: 'normal', deadline: '', status: 'todo', assignees: [] });
        fetchTasks();
      } else {
        toast.error('Erreur lors de la création');
      }
    } catch (error) {
      toast.error('Erreur serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAssignee = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.includes(userId) 
        ? prev.assignees.filter(id => id !== userId)
        : [...prev.assignees, userId]
    }));
  };

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'todo', label: 'À FAIRE', color: 'bg-black/5' },
    { id: 'in_progress', label: 'EN COURS', color: 'bg-brand-gold/10' },
    { id: 'done', label: 'TERMINÉ', color: 'bg-emerald-50' },
  ];

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'normal': return 'text-brand-gold bg-brand-gold/10';
      case 'low': return 'text-black/40 bg-black/5';
      default: return 'text-black/40 bg-black/5';
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="luxury-text text-4xl mb-2">To-do Liste Collaborative</h1>
          <p className="text-black/40 font-medium">Coordonnez les efforts de l'Empire en temps réel.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white p-1 rounded-2xl border border-black/5 flex h-14">
             <button 
               onClick={() => setViewType('kanban')}
               className={cn("p-2.5 rounded-xl transition-all flex items-center justify-center min-w-[3.5rem]", viewType === 'kanban' ? "bg-brand-ebony text-white shadow-lg" : "text-black/30 hover:bg-black/5")}
             >
               <LayoutGrid size={20} />
             </button>
             <button 
               onClick={() => setViewType('list')}
               className={cn("p-2.5 rounded-xl transition-all flex items-center justify-center min-w-[3.5rem]", viewType === 'list' ? "bg-brand-ebony text-white shadow-lg" : "text-black/30 hover:bg-black/5")}
             >
               <ListIcon size={20} />
             </button>
           </div>
           <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-brand-ebony text-white h-14 px-8 rounded-2xl flex items-center gap-3 text-xs font-bold hover:bg-brand-gold hover:text-brand-ebony transition-all group shadow-xl"
           >
             <Plus size={20} className="group-hover:rotate-90 transition-transform" /> NOUVELLE TÂCHE
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewType === 'kanban' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{column.label}</span>
                    <span className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-[10px] font-bold">
                      {tasks.filter(t => t.status === column.id).length}
                    </span>
                  </div>
                  <MoreVertical size={16} className="text-black/20" />
                </div>
                
                <div className={cn("flex-1 p-6 rounded-[2.5rem] min-h-[400px] sm:min-h-[600px] space-y-6", column.color)}>
                  {loading ? (
                    [1, 2].map(i => <div key={i} className="bg-white/50 h-32 rounded-3xl animate-pulse" />)
                  ) : tasks.filter(t => t.status === column.id).map((task) => (
                    <motion.div
                      layoutId={String(task.id)}
                      key={task.id}
                      className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 group cursor-grab active:cursor-grabbing hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={cn("px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest", getPriorityColor(task.priority))}>
                          {task.priority}
                        </span>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => updateTaskStatus(task.id, column.id === 'done' ? 'todo' : 'done')}
                            className="p-1.5 text-black/10 hover:text-emerald-500 transition-all rounded-md hover:bg-emerald-50"
                          >
                            <CheckSquare size={14} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm mb-3 group-hover:text-brand-gold transition-colors">{task.title}</h4>
                      <p className="text-[11px] text-black/40 line-clamp-2 mb-6 leading-relaxed">{task.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {(task.assignees || []).map((a: any) => (
                            <img key={a.id} src={a.image} className="w-8 h-8 rounded-lg border-2 border-white object-cover" title={a.name} alt={a.name} />
                          ))}
                          <button 
                            onClick={() => setIsFormOpen(true)}
                            className="w-8 h-8 rounded-lg border-2 border-dashed border-black/10 flex items-center justify-center text-black/20 hover:border-brand-gold hover:text-brand-gold transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-black/20">
                          <div className="flex items-center gap-1 text-[10px] font-bold">
                             <Clock size={12} /> {task.deadline ? new Date(task.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Pas de date'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <button 
                    onClick={() => setIsFormOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-black/10 rounded-2xl flex items-center justify-center gap-2 text-black/20 hover:border-black/20 hover:text-black/40 transition-all text-xs font-bold"
                  >
                     <Plus size={16} /> AJOUTER UNE TÂCHE
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[3.5rem] border border-black/5 overflow-x-auto no-scrollbar"
          >
             <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                 <tr className="border-b border-black/5">
                   <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30">Tâche</th>
                   <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30">Assigné</th>
                   <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30">Priorité</th>
                   <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30">Deadline</th>
                   <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-black/30">Statut</th>
                 </tr>
               </thead>
               <tbody>
                  {tasks.map(task => (
                    <tr key={task.id} className="border-b border-black/5 last:border-none hover:bg-black/[0.01] transition-colors">
                      <td className="p-8">
                        <div>
                          <h4 className="font-bold text-sm mb-1">{task.title}</h4>
                          <p className="text-xs text-black/40 line-clamp-1">{task.description}</p>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex -space-x-2">
                           {(task.assignees || []).map((a: any) => (
                             <img key={a.id} src={a.image} className="w-8 h-8 rounded-lg border-2 border-white object-cover" title={a.name} alt={a.name} />
                           ))}
                        </div>
                      </td>
                      <td className="p-8">
                        <span className={cn("px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest", getPriorityColor(task.priority))}>
                           {task.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-8 text-sm text-black/40">
                         {task.deadline ? new Date(task.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '--'}
                      </td>
                      <td className="p-8">
                         <select 
                           value={task.status}
                           onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                           className="bg-black/5 border-none rounded-xl py-2 px-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-brand-gold/50"
                         >
                            <option value="todo">À faire</option>
                            <option value="in_progress">En cours</option>
                            <option value="done">Terminé</option>
                         </select>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Form */}
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] overflow-hidden shadow-2xl p-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <h2 className="luxury-text text-3xl mb-8 text-center uppercase tracking-tighter">Attribuer une Mission</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Titre de la tâche</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-gold/50"
                      placeholder="Ex: Refroidir le showroom"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Priorité</label>
                      <select 
                        value={formData.priority}
                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-gold/50"
                      >
                        <option value="low">Note de service</option>
                        <option value="normal">Normal</option>
                        <option value="high">Priorité Impériale</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Échéance</label>
                      <input 
                        type="date"
                        value={formData.deadline}
                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-gold/50"
                      />
                    </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4 block text-center">Membres Assignés</label>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {team.map(member => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => toggleAssignee(member.id)}
                            className={cn(
                              "flex flex-col items-center p-4 rounded-3xl border-2 transition-all group/btn relative",
                              formData.assignees.includes(member.id) 
                                ? "bg-brand-gold/10 border-brand-gold" 
                                : "bg-white border-black/5 hover:border-black/10"
                            )}
                          >
                            <img src={member.image} className="w-10 h-10 rounded-2xl object-cover mb-2 border border-black/5 shadow-sm" alt={member.name} />
                            <span className="text-[10px] font-bold truncate w-full text-center overflow-hidden">{member.name.split(' ')[0]}</span>
                            {formData.assignees.includes(member.id) && (
                              <div className="absolute top-2 right-2 bg-brand-gold text-brand-ebony rounded-full p-0.5">
                                <CheckSquare size={10} />
                              </div>
                            )}
                          </button>
                        ))}
                     </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Notes Additionnelles</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-brand-gold/50 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-black/10 hover:bg-black/5 transition-all font-bold"
                  >
                    Abandonner
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-brand-ebony text-white h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-ebony transition-all shadow-2xl shadow-brand-gold/10 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Lancer la Mission'}
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
