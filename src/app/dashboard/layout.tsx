"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Sparkles, MessageSquare, Coffee, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // State untuk melacak apakah sidebar sedang diperkecil atau tidak
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Database', href: '/dashboard/customers', icon: Users },
    { name: 'Campaigns', href: '/dashboard/promos', icon: Sparkles },
    { name: 'Intelligence', href: '/dashboard/chat', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-stone-950 font-sans">
      
      {/* Sidebar dengan transisi ukuran (w-64 ke w-24) */}
      <aside 
        className={`relative bg-stone-950 text-stone-50 hidden md:flex flex-col sticky top-0 h-screen border-r border-stone-800 z-50 shadow-[10px_0_20px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-24' : 'w-64'
        }`}
      >
        
        {/* Tombol Toggle Melayang di Pinggir Kanan */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-9 bg-stone-900 border border-stone-700 text-stone-400 hover:text-white rounded-full p-1 z-50 transition-colors shadow-sm hover:bg-stone-800"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Logo Area (Dikembalikan ke Kuning Amber) */}
        <div className={`flex items-center border-b border-stone-800/50 h-24 shrink-0 transition-all ${
          isCollapsed ? 'justify-center px-0' : 'px-8 gap-3'
        }`}>
          <div className="bg-amber-500 p-2.5 rounded-xl text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
            <Coffee size={20} strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap overflow-hidden transition-opacity duration-300">
              Kopi Kita
            </span>
          )}
        </div>

        {/* Menu Navigasi */}
        <nav className={`flex-1 space-y-2 mt-6 ${isCollapsed ? 'px-4' : 'px-4'}`}>
          {!isCollapsed ? (
            <p className="px-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4 whitespace-nowrap overflow-hidden">
              Workspace
            </p>
          ) : (
            <div className="h-6"></div> /* Spacer saat collapsed */
          )}
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : ""} // Memunculkan tooltip bawaan saat minimize
                className={`flex items-center rounded-xl transition-all text-sm font-medium group ${
                  isCollapsed ? 'justify-center py-3.5' : 'gap-3 px-4 py-3.5'
                } ${
                  isActive 
                  ? 'bg-stone-800/80 text-white shadow-inner border border-stone-700/50' 
                  : 'text-stone-400 hover:bg-stone-900 hover:text-white border border-transparent'
                }`}
              >
                <item.icon 
                  size={18} 
                  // Dikembalikan ke Kuning Amber
                  className={`shrink-0 transition-colors ${isActive ? "text-amber-500" : "text-stone-500 group-hover:text-stone-300"}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout / Footer Sidebar */}
        <div className={`p-6 border-t border-stone-800/50 mt-auto flex ${isCollapsed ? 'justify-center' : ''}`}>
          <Link 
            href="/" 
            title={isCollapsed ? "Sign Out" : ""}
            className={`flex items-center transition-colors text-sm font-medium rounded-xl hover:bg-red-950/20 text-stone-500 hover:text-red-400 ${
              isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3 w-full'
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">Sign Out</span>}
          </Link>
        </div>
      </aside>

      {/* Konten Dashboard Utama */}
      <main className="flex-1 h-screen overflow-hidden bg-[#FCFAF8]">
        {children}
      </main>
    </div>
  );
}