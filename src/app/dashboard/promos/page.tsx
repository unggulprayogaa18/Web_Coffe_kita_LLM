"use client";

import { useState, useEffect } from 'react';
import { Sparkles, Users, Zap, Target, BarChart3, Copy, Check, Info, Coffee, Milk, Croissant, LayoutGrid } from 'lucide-react';

export default function PromoIdeasPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Segments", icon: LayoutGrid },
    { id: "coffee", name: "Coffee Enthusiast", icon: Coffee },
    { id: "milk", name: "Milk & Non-Coffee", icon: Milk },
    { id: "pastry", name: "Pastry Lover", icon: Croissant },
  ];

  const generatePromo = async () => {
    setLoading(true);
    try {

      const res = await fetch('/api/ai/generate', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategory })
      });
      const data = await res.json();
      setPromos(Array.isArray(data) ? data : data.promos || []);
    } catch (error) {
      console.error("Gagal generate promo:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    /* FIX: Tambahkan h-screen overflow-hidden agar scroll mandiri aktif */
    <div className="h-screen flex flex-col bg-[#FCFAF8] overflow-hidden font-sans">
      
      {/* --------------------------------------------------------------------------------
          CUSTOM SCROLLBAR STYLE
      -------------------------------------------------------------------------------- */}
      <style jsx global>{`
        .promo-scroll::-webkit-scrollbar { width: 5px; }
        .promo-scroll::-webkit-scrollbar-track { background: transparent; }
        .promo-scroll::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 10px; }
      `}</style>

      {/* ================= AREA SCROLLABLE (KONTEN UTAMA) ================= */}
      <div className="flex-1 overflow-y-auto promo-scroll p-8 lg:p-12 pb-32">
        
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-amber-900/5 pb-10 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#f59e0b] font-bold text-xs uppercase tracking-[0.2em]">
              <Zap size={14} className="fill-current" /> Campaign Engine
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-amber-950">Marketing Strategy</h1>
            <p className="text-amber-900/60 font-medium italic">Tentukan kategori fokus dan biarkan AI meracik promo terbaik untuk pelanggan Anda.</p>
          </div>
          
          <button 
            onClick={generatePromo}
            disabled={loading}
            className="flex items-center justify-center gap-3 bg-[#f59e0b] hover:bg-[#d97706] text-white px-10 py-5 rounded-[24px] font-bold shadow-xl shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles size={20} />
            )}
            {loading ? "Analyzing Database..." : "Execute Campaign Analysis"}
          </button>
        </div>

        {/* ================= CATEGORY SELECTOR ================= */}
        <div className="mb-10 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/40 ml-1">Fokus Segmentasi</p>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all border ${
                    isActive 
                    ? 'bg-amber-950 text-white border-amber-950 shadow-lg shadow-amber-950/20 scale-105' 
                    : 'bg-white text-amber-900/60 border-amber-900/5 hover:border-amber-900/20 hover:bg-amber-50'
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-[#f59e0b]" : ""} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= CAMPAIGN GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promos.map((promo, index) => (
            <div key={index} className="group bg-white rounded-[40px] border border-amber-900/5 p-8 space-y-6 hover:shadow-2xl transition-all duration-500 border-l-4 border-l-[#f59e0b]">
              <div className="flex justify-between items-start">
                <span className="bg-stone-100 text-stone-500 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-stone-200">
                  Ref: {promo.theme || "Marketing-01"}
                </span>
                <div className="text-[#f59e0b]"><Target size={24} /></div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-amber-950 leading-tight">{promo.title || promo.theme}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-[#f59e0b] bg-amber-50 w-fit px-3 py-1.5 rounded-full">
                  <Users size={14} /> Segment: {promo.segment}
                </div>
              </div>

              <div className="flex gap-3 p-5 bg-[#FCFAF8] rounded-3xl border border-amber-900/5 italic text-amber-900/70 text-xs font-medium leading-relaxed">
                <Info size={16} className="shrink-0 text-amber-900/30" />
                "{promo.whyNow}"
              </div>

              <div className="bg-stone-950 text-stone-300 p-6 rounded-[32px] relative shadow-inner">
                <div className="text-[10px] uppercase font-bold tracking-widest text-stone-500 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Ready to Copy
                </div>
                <p className="text-sm leading-relaxed font-medium mb-10 text-stone-200">{promo.message}</p>
                <button 
                  onClick={() => copyToClipboard(promo.message, index)}
                  className="absolute bottom-5 right-5 flex items-center gap-2 bg-stone-800 hover:bg-[#f59e0b] hover:text-stone-950 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border border-stone-700 active:scale-95"
                >
                  {copiedIndex === index ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy for WhatsApp</>}
                </button>
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {promos.length === 0 && !loading && (
            <div className="col-span-full py-40 text-center border-4 border-dashed border-amber-900/5 rounded-[60px] bg-white/40">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#f59e0b]">
                  <BarChart3 size={48} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-amber-950">Strategist Idle</h3>
                  <p className="text-amber-900/40 text-sm font-medium">Pilih kategori di atas dan tekan tombol Generate untuk mulai merancang kampanye.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}