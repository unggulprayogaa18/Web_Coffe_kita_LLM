"use client";

import { useState } from "react";
import { Coffee, Lock, Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi login sederhana untuk kebutuhan tugas
    // Di dunia nyata, Anda akan memvalidasi ini ke database
    if (email && password) {
      router.push("/dashboard/customers");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center p-4">
      {/* Kartu Login */}
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-xl shadow-amber-900/5 border border-amber-100 overflow-hidden">
        
        {/* Header dengan Ikon Kopi */}
        <div className="bg-amber-900 p-8 text-center space-y-3">
          <div className="inline-flex p-3 bg-amber-800 rounded-2xl text-amber-100 shadow-inner">
            <Coffee size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Kopi Kita</h1>
            <p className="text-amber-200/70 text-sm">Mini CRM & AI Promo Helper </p>
          </div>
        </div>

        {/* Form Login  */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="mimi@kopikita.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-900"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Tombol Login */}
          <button 
            type="submit"
            className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 group transition-all active:scale-[0.98]"
          >
            Masuk ke CRM
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Khusus akses administrator Mimi's Coffee.
          </p>
        </form>
      </div>
    </div>
  );
}