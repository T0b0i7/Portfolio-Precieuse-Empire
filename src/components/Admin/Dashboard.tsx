import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Calendar, 
  FileText, 
  CheckSquare, 
  TrendingUp,
  ArrowUpRight,
  Eye,
  Clock,
  User,
  ShoppingBag,
  Users,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import { dataService } from '../../services/dataService';

const chartData = [
  { name: 'Lun', visites: 400, ventes: 240 },
  { name: 'Mar', visites: 300, ventes: 139 },
  { name: 'Mer', visites: 200, ventes: 980 },
  { name: 'Jeu', visites: 278, ventes: 390 },
  { name: 'Ven', visites: 189, ventes: 480 },
  { name: 'Sam', visites: 239, ventes: 380 },
  { name: 'Dim', visites: 349, ventes: 430 },
];

export function AdminDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-bronze border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    { label: 'Indice d\'Éclat Global', value: '98.4%', icon: Sparkles, color: 'text-brand-bronze', bg: 'bg-brand-bronze/10' },
    { label: 'Produits Actifs', value: stats.products, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Membres du Cercle', value: '1.2k', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Tâches en Cours', value: stats.tasks, icon: CheckSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="luxury-text text-4xl mb-2 text-black transition-colors">Bienvenue, {user.name}</h1>
          <p className="text-black/40 font-medium font-sans">Voici un résumé de l'activité de votre empire aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white p-4 rounded-2xl border border-black/5 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-bronze/10 flex items-center justify-center text-brand-bronze">
                 <Users size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest font-sans">Équipe</p>
                 <p className="font-bold text-sm tracking-tight">{stats.team} Membres</p>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/5 group hover:shadow-xl transition-all"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon className={stat.color} size={28} />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-1 font-sans">{stat.label}</p>
                <h3 className="text-3xl font-light">{stat.value}</h3>
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold pb-1 font-sans">
                <TrendingUp size={14} /> {stats.revenueTrend || '+12%'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Visualization UI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3.5rem] p-10 border border-black/5 shadow-premium overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="luxury-text text-2xl">Aperçu du Trafic</h2>
              <p className="text-xs text-black/40 mt-1 uppercase tracking-wider font-bold font-sans">Visites vs Conversions</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-bronze font-sans"><div className="w-2 h-2 rounded-full bg-brand-bronze" /> VISITES</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 font-sans"><div className="w-2 h-2 rounded-full bg-emerald-400" /> VENTES</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVisites" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A67C52" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#A67C52" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF', fontWeight: 600}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#080707', 
                    border: 'none', 
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                  }} 
                />
                <Area type="monotone" dataKey="visites" stroke="#A67C52" fillOpacity={1} fill="url(#colorVisites)" strokeWidth={3} />
                <Area type="monotone" dataKey="ventes" stroke="#34D399" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-10 border border-black/5 shadow-premium overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <h2 className="luxury-text text-2xl">Impact des Rituels</h2>
              <BarChart3 className="text-black/10" size={24} />
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF', fontWeight: 600}} />
                  <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="ventes" fill="#000" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h2 className="luxury-text text-2xl">Activité Récente</h2>
            <button className="text-brand-bronze text-xs font-bold hover:underline font-sans">VOIR TOUT</button>
          </div>
          <div className="space-y-8">
            {(stats.recentActivity || []).map((activity: any, i: number) => (
              <div key={activity.id} className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-black/30 group-hover:bg-brand-bronze/10 group-hover:text-brand-bronze transition-colors">
                  <User size={20} />
                </div>
                <div className="flex-1 border-b border-black/5 pb-8 group-last:border-none group-last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold">{activity.user} <span className="font-normal text-black/40 ml-1">{activity.action}</span></p>
                    <span className="text-[10px] text-black/30 bg-black/5 px-2 py-0.5 rounded-full font-sans">{activity.time}</span>
                  </div>
                  <p className="text-xs text-black/40 font-sans">Action effectuée avec succès via le back-office.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Viewed Products */}
        <div className="bg-white rounded-[3.5rem] p-10 border border-black/5 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h2 className="luxury-text text-2xl">Plus Consultés</h2>
            <Eye size={20} className="text-black/20" />
          </div>
          <div className="space-y-6 flex-1">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-black/[0.02] hover:bg-black/[0.04] transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border border-black/5 shrink-0">
                  <img src={`https://images.unsplash.com/photo-${i === 0 ? "1620916566398-39f1143ab7be" : i === 1 ? "1596462502278-27bfaf43399f" : "1556228720-195a672e8a03"}?auto=format&fit=crop&q=80&w=200`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">Produit Éclat {i + 1}</h4>
                  <p className="text-xs text-black/40 font-sans">{1200 - (i * 250)} vues cette semaine</p>
                </div>
                <ArrowUpRight size={20} className="text-black/10 group-hover:text-brand-bronze transition-colors shrink-0" />
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-5 rounded-3xl border border-black/5 text-[10px] font-bold uppercase tracking-widest hover:border-brand-bronze hover:text-brand-bronze transition-all font-sans">
            ANALYSER LES TENDANCES
          </button>
        </div>
      </div>
    </div>
  );
}
