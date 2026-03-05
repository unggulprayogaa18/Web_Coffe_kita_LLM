"use client";

import { useState, useEffect } from 'react';
import { Search, Bell, Users, Coffee, ArrowRight, Target, PenTool, Zap, BarChart3, TrendingUp, Sparkles, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --------------------------------------------------------------------------------
// HELPER: GAMBAR DARI UNSPLASH
// --------------------------------------------------------------------------------
const getImageForInterest = (interest: string) => {
  const i = interest.toLowerCase();
  if (i.includes('milk') || i.includes('susu') || i.includes('oat')) return 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80';
  if (i.includes('sweet') || i.includes('caramel') || i.includes('manis')) return 'https://images.unsplash.com/photo-1463797221720-6b07e6426c24?auto=format&fit=crop&w=400&q=80';
  if (i.includes('pastry') || i.includes('cake') || i.includes('roti')) return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80';
  if (i.includes('black') || i.includes('espresso') || i.includes('americano')) return 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80';
  if (i.includes('non-coffee') || i.includes('matcha')) return 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=400&q=80';
  if (i.includes('morning') || i.includes('buyer')) return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80';
  if (i.includes('weekend') || i.includes('chill')) return 'https://images.unsplash.com/photo-1445116572660-236099cecd07?auto=format&fit=crop&w=400&q=80';
  
  return 'https://plus.unsplash.com/premium_photo-1668970851336-6c81cc888ba7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
};

const pieColors = ['#78350f', '#b45309', '#d97706', '#f59e0b', '#fcd34d'];

export default function DashboardPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers');
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error("Gagal memuat data pelanggan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#FCFAF8] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-amber-900/60 font-medium animate-pulse">Memuat Analytics Kopi Kita...</p>
      </div>
    );
  }

  // ============================================================================
  // PENGOLAHAN DATA DINAMIS
  // ============================================================================
  const totalCustomers = customers.length;
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const trendMap: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  
  customers.forEach(c => {
    if (c.createdAt) {
      const dayName = daysOfWeek[new Date(c.createdAt).getDay()];
      trendMap[dayName]++;
    }
  });
  
  const todayIndex = new Date().getDay();
  const dynamicTrendData = [];
  for (let i = 6; i >= 0; i--) {
    const dIndex = (todayIndex - i + 7) % 7;
    dynamicTrendData.push({ name: daysOfWeek[dIndex], count: trendMap[daysOfWeek[dIndex]] });
  }

  const interestMap: Record<string, number> = {};
  customers.forEach(c => {
    c.interests?.forEach((interest: string) => {
      interestMap[interest] = (interestMap[interest] || 0) + 1;
    });
  });

  const pieData = Object.entries(interestMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const topInterests = Object.entries(interestMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); 

  const drinkMap: Record<string, number> = {};
  let totalDrinksWithPref = 0;
  customers.forEach(c => {
    if (c.favoriteDrink) {
      drinkMap[c.favoriteDrink] = (drinkMap[c.favoriteDrink] || 0) + 1;
      totalDrinksWithPref++;
    }
  });
  
  const dynamicDrinkData = Object.entries(drinkMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      value: totalDrinksWithPref > 0 ? Math.round((count / totalDrinksWithPref) * 100) : 0
    }));

  const recentCustomers = customers.slice(0, 4);

  return (
    <div className="flex flex-col xl:flex-row h-screen bg-[#FCFAF8] font-sans overflow-hidden">
      
      {/* --------------------------------------------------------------------------------
          CUSTOM SCROLLBAR STYLE
      -------------------------------------------------------------------------------- */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f59e0b;
          border-radius: 10px;
        }
      `}</style>
      
      {/* ================= AREA TENGAH ================= */}
      <div className="flex-1 p-8 lg:p-10 overflow-y-auto pb-24 custom-scrollbar">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-amber-950">Overview</h1>
            <p className="text-amber-900/60 text-sm mt-1">Real-time pulse of Kopi Kita customers.</p>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/40" size={16} />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="w-full pl-9 pr-4 py-2 bg-transparent border-b border-amber-900/20 focus:border-amber-900 focus:outline-none text-sm transition-colors rounded-none placeholder:text-amber-900/40 text-amber-950"
              />
            </div>
            <button className="text-amber-900/40 hover:text-amber-900 transition-colors">
              <Bell size={18} />
            </button>
            <div className="w-8 h-8 bg-amber-900 rounded-full flex items-center justify-center text-white text-xs font-bold tracking-widest shadow-sm">
              MK
            </div>
          </div>
        </div>

        {/* CHART CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 border border-amber-900/10 bg-white rounded-2xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2 text-sm font-semibold text-amber-950">Customer Growth <TrendingUp size={16} className="text-emerald-500" /></div>
            <div className="flex items-baseline gap-2 mb-6"><span className="text-3xl font-bold text-amber-900">{totalCustomers}</span></div>
            <div className="h-24 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicTrendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs><linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Area type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 border border-amber-900/10 bg-white rounded-2xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6 text-sm font-semibold text-amber-950">Interest Distribution <BarChart3 size={16} className="text-amber-900/40" /></div>
            <div className="flex-1 flex items-center justify-center h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 border border-amber-900/10 bg-white rounded-2xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6 text-sm font-semibold text-amber-950">Top Beverages <Coffee size={16} className="text-amber-900/40" /></div>
            <div className="flex-1 flex flex-col justify-center gap-4">
              {dynamicDrinkData.map((drink, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1.5 font-medium text-amber-900/80">{drink.name} <span>{drink.value}%</span></div>
                  <div className="w-full bg-amber-50 rounded-full h-1.5 overflow-hidden"><div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${drink.value}%` }}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TRENDING SEGMENTS */}
        <h2 className="text-lg font-medium text-amber-950 mb-6">Trending Segments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topInterests.map(([name, count]) => (
            <div key={name} className="group bg-white border border-amber-900/10 rounded-3xl overflow-hidden hover:shadow-xl transition-all">
              <div className="h-40 w-full relative overflow-hidden bg-amber-100">
                <img src={getImageForInterest(name)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={name} />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent flex items-end p-5 text-white font-bold text-xl capitalize">{name}</div>
              </div>
              <div className="p-5 flex justify-between items-center">
                <div className="flex flex-col"><span className="text-3xl font-black text-amber-950">{count}</span><span className="text-[10px] text-amber-900/60 uppercase font-bold tracking-widest mt-1">Active Profiles</span></div>
                <div className="w-14 h-14 rounded-full border-4 border-amber-50 flex items-center justify-center bg-amber-100 text-amber-800 font-bold">{((count / totalCustomers) * 100).toFixed(0)}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="mt-12 flex justify-between items-end mb-6">
          <div className="flex items-center gap-2 text-amber-950 font-medium text-lg"><Clock size={20} className="text-amber-700" /> Recent Activity</div>
          <Link href="/dashboard/customers" className="text-xs font-semibold text-amber-700 bg-amber-50 px-4 py-2 rounded-xl">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="bg-white border border-amber-900/10 rounded-3xl p-3">
          {recentCustomers.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-amber-50/50 rounded-2xl border-b border-amber-900/5 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold">{c.name.charAt(0)}</div>
                <div><p className="text-sm font-bold text-amber-950">{c.name}</p><p className="text-xs text-amber-900/60">{c.contact}</p></div>
              </div>
              <div className="hidden md:flex flex-col items-end gap-2 text-xs">
                <span className="font-semibold text-amber-900/80 bg-amber-50 px-3 py-1.5 rounded-lg">{c.favoriteDrink}</span>
                <div className="flex gap-1.5">{c.interests?.slice(0,2).map((t: string, idx: number) => (<span key={idx} className="bg-stone-100 text-stone-500 px-2 py-1 rounded uppercase font-bold text-[10px]">{t}</span>))}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PANEL KANAN (INTELLIGENCE) ================= */}
      <div 
        className={`bg-stone-950 text-stone-50 h-full border-l border-stone-800 shrink-0 z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.2)] transition-all duration-300 relative flex flex-col ${
          isRightCollapsed ? 'xl:w-24 w-full p-6' : 'xl:w-[380px] w-full p-8'
        }`}
      >
        
        {/* FIX: TOMBOL MINIMIZE DENGAN Z-INDEX TINGGI & WARNA KONTRAS */}
        <button 
          onClick={() => setIsRightCollapsed(!isRightCollapsed)}
          className="hidden xl:flex absolute -left-5 top-12 bg-[#f59e0b] text-stone-950 hover:bg-white rounded-full p-2 z-[100] transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] items-center justify-center border-4 border-stone-950"
        >
          {isRightCollapsed ? <ChevronLeft size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
        </button>

        <div className={`flex items-center mb-10 mt-1 ${isRightCollapsed ? 'xl:justify-center' : 'justify-between'}`}>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b] flex items-center gap-2" title={isRightCollapsed ? "Intelligence" : ""}>
            <Zap size={16} className="fill-current shrink-0" />
            <span className={`${isRightCollapsed ? 'xl:hidden' : 'block'}`}>Intelligence</span>
          </h2>
        </div>

        <div className={`mb-10 transition-opacity duration-300 ${isRightCollapsed ? 'xl:opacity-0 xl:h-0 xl:overflow-hidden' : 'opacity-100'}`}>
          <h3 className="text-[22px] font-semibold mb-3 text-white tracking-wide">Campaign Engine</h3>
          <p className="text-[#a8a29e] text-[13px] leading-relaxed">System is ready to analyze {totalCustomers} recent customer profiles to generate hyper-targeted marketing campaign</p>
        </div>

        <div className={`space-y-8 flex-1 ${isRightCollapsed ? 'xl:flex xl:flex-col xl:items-center' : ''}`}>
          <div className="flex gap-4 items-start group" title={isRightCollapsed ? "Audience" : ""}>
            <div className="mt-0.5 text-[#f59e0b] shrink-0"><Target size={20} /></div>
            <div className={`${isRightCollapsed ? 'xl:hidden' : 'block'}`}><h4 className="font-semibold text-stone-200 text-sm">Segmentation</h4><p className="text-xs text-[#78716c] mt-1">Mapping trending interests & behaviors</p></div>
          </div>
          <div className="flex gap-4 items-start group" title={isRightCollapsed ? "Copywriting" : ""}>
            <div className="mt-0.5 text-[#f59e0b] shrink-0"><PenTool size={20} /></div>
            <div className={`${isRightCollapsed ? 'xl:hidden' : 'block'}`}><h4 className="font-semibold text-stone-200 text-sm">Copy Generation</h4><p className="text-xs text-[#78716c] mt-1">Drafting contextual WhatsApp messages</p></div>
          </div>
        </div>

        <div className={`mt-auto pt-8 border-t border-stone-800/50 ${isRightCollapsed ? 'xl:flex xl:flex-col xl:items-center' : ''}`}>
          <div className={`flex justify-between items-center mb-5 text-xs font-bold ${isRightCollapsed ? 'xl:hidden' : 'flex'}`}>
            <span className="text-[#78716c] uppercase">Status</span>
            <span className="text-[#10b981] flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>Ready</span>
          </div>
          <Link 
            href="/dashboard/promos"
            className={`bg-[#f59e0b] hover:bg-white text-stone-950 font-bold rounded-xl flex items-center justify-center transition-all ${
              isRightCollapsed ? 'xl:w-12 xl:h-12 xl:p-0' : 'w-full py-4 gap-2 text-sm shadow-lg shadow-orange-900/20'
            }`}
          >
            <Sparkles size={18} className={isRightCollapsed ? 'block' : 'hidden'} />
            <div className={isRightCollapsed ? 'hidden' : 'flex items-center gap-2'}>Run AI Analysis <ArrowRight size={18} /></div>
          </Link>
        </div>

      </div>
    </div>
  );
}