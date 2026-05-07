import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Filter, ChevronRight, X } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Reveal, Magnetic, CinematicImage } from '../ui/motion';

const ImperialCatalog = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const all = await dataService.getProducts();
      setProducts(all);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const categories = ['Tous', 'Soins Visage', 'Corps', 'Maquillage'];

  const filteredProducts = category === 'Tous' 
    ? products 
    : products.filter(p => p.category === category);

  return (
    <div className="bg-[#0A0A0A] text-[#E8D9C5] pt-40 min-h-screen font-serif">
      {/* Catalog Header */}
      <section className="px-6 max-w-7xl mx-auto mb-32">
        <Reveal>
          <span className="text-[10px] tracking-[0.5em] text-[#C19A6B] mb-8 block uppercase font-bold">ÉTABLI PAR DÉCRET</span>
          <h1 className="text-5xl md:text-8xl italic mb-12 leading-tight max-w-4xl">
            Alchimie Sacrée pour le <span className="text-[#C19A6B]">Souverain</span> Moderne
          </h1>
          <p className="text-lg opacity-60 max-w-2xl font-light italic leading-relaxed">
            Découvrez le zénith du soin de la peau. Nos formules sont des secrets murmurés d'antiques lignées, raffinées par une science d'avant-garde pour honorer votre peau d'un éclat éthéré.
          </p>
        </Reveal>
      </section>

      {/* Featured Collection Banner */}
      <section className="px-6 max-w-7xl mx-auto mb-40">
        <div className="bg-[#0D0D0D] border border-[#C19A6B]/10 p-12 md:p-24 rounded-sm flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[#C19A6B]/5 opacity-20 pointer-events-none" />
           <div className="md:w-1/2">
              <span className="text-[10px] tracking-[0.4em] text-[#C19A6B] mb-4 block uppercase font-bold">COLLECTION I</span>
              <h2 className="text-4xl md:text-6xl italic mb-8">La Collection Or Nubien</h2>
              <p className="text-sm opacity-50 mb-12 leading-loose">
                Infusée de résines botaniques rares récoltées sous la lumière lunaire et d'or colloïdal. Un rituel de transformation pour l'élite moderne.
              </p>
              <button className="px-10 py-5 bg-[#C19A6B] text-black font-bold text-[10px] tracking-[0.3em] uppercase">Acquérir la Collection</button>
           </div>
           <div className="md:w-1/2 aspect-square">
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover rounded-sm shadow-2xl" alt="Nubian Gold" />
           </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="px-6 max-w-7xl mx-auto mb-20">
        <div className="flex flex-wrap gap-8 border-b border-[#C19A6B]/10 pb-8">
           {categories.map(cat => (
             <button 
               key={cat}
               onClick={() => setCategory(cat)}
               className={`text-[10px] tracking-[0.4em] uppercase font-bold transition-all ${category === cat ? 'text-[#C19A6B]' : 'text-white/30 hover:text-white'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 max-w-7xl mx-auto pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {filteredProducts.map((p, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="group flex flex-col">
                <div className="aspect-[4/5] bg-[#0F0F0F] rounded-sm overflow-hidden mb-10 relative border border-[#C19A6B]/10 group-hover:border-[#C19A6B] transition-all duration-700">
                  <img src={p.main_image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" alt={p.name} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-8 py-4 bg-white text-black font-bold text-[10px] tracking-[0.2em] uppercase">Acquérir</button>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl italic tracking-tight">{p.name}</h3>
                  <span className="text-[10px] font-bold text-[#C19A6B] tracking-[0.2em] mt-2 italic">{p.price.toLocaleString()} FCFA</span>
                </div>
                <p className="text-[11px] opacity-40 uppercase tracking-[0.2em] mb-8 font-bold leading-relaxed">{p.category}</p>
                <div className="w-full h-px bg-[#C19A6B]/10" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer Imperial */}
      <footer className="py-32 px-6 bg-black text-center border-t border-[#C19A6B]/10">
        <h2 className="text-4xl font-serif italic mb-16 tracking-widest">PRÉCIEUSE EMPIRE</h2>
        <div className="flex flex-wrap justify-center gap-12 mb-20 text-[10px] tracking-[0.4em] uppercase font-bold text-[#E8D9C5]/40">
           <Link to="/" className="hover:text-[#C19A6B] transition-colors">Le Sanctuaire</Link>
           <Link to="/a-propos" className="hover:text-[#C19A6B] transition-colors">Éthos</Link>
           <Link to="#" className="hover:text-[#C19A6B] transition-colors">Confidentialité</Link>
           <Link to="#" className="hover:text-[#C19A6B] transition-colors">Contact</Link>
        </div>
        <p className="text-[8px] tracking-[0.3em] uppercase opacity-20">
          © 2024 PRÉCIEUSE EMPIRE. SÉCURISÉ PAR DÉCRET IMPÉRIAL.
        </p>
      </footer>
    </div>
  );
};

export default ImperialCatalog;
