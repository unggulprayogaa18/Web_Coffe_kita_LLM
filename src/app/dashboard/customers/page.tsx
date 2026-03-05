"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, X, User, MoreHorizontal, Download, Eye, Edit3, Trash2, ChevronDown } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInterest, setFilterInterest] = useState("");
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    favoriteDrink: "",
    interests: ""
  });

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setTimeout(() => setLoading(false), 500); // Sedikit delay agar animasi terlihat smooth
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const interestsArray = formData.interests.split(',').map(i => i.trim()).filter(i => i !== "");

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, interests: interestsArray })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: "", contact: "", favoriteDrink: "", interests: "" });
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // FUNGSI EXPORT KE EXCEL (CSV Format)
  const exportToExcel = () => {
    const headers = ["Nama,Kontak,Minuman Favorit,Minat\n"];
    const rows = filteredCustomers.map(c => 
      `${c.name},${c.contact || "-"},${c.favoriteDrink || "-"},"${(c.interests || []).join("; ")}"`
    );
    const blob = new Blob([headers + rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Database_Pelanggan_KopiKita_${new Date().toLocaleDateString()}.csv`);
    a.click();
  };

  const filteredCustomers = customers.filter(c => {
    const matchName = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchInterest = filterInterest === "" || (c.interests && c.interests.includes(filterInterest));
    return matchName && matchInterest;
  });

  const allInterests = Array.from(new Set(customers.flatMap(c => c.interests || [])));

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8 bg-[#FCFAF8] min-h-screen">
      
      {/* HEADER AREA */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-amber-950">Customer Base</h1>
          <p className="text-amber-900/60 font-medium italic">Manajemen profil dan segmentasi audiens Kopi Kita.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-white border border-amber-900/10 text-amber-900 px-5 py-2.5 rounded-2xl font-bold shadow-sm hover:bg-amber-50 transition-all active:scale-95"
          >
            <Download size={18} /> Export Excel
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus size={20} /> Add Profile
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-amber-900/5 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30 group-focus-within:text-[#f59e0b] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search profiles by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#FCFAF8] border-none rounded-2xl focus:ring-2 focus:ring-[#f59e0b]/20 outline-none text-amber-950 placeholder:text-amber-900/30 font-medium"
          />
        </div>
        <div className="relative w-full md:w-72 group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30" size={18} />
          <select 
            value={filterInterest}
            onChange={(e) => setFilterInterest(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-[#FCFAF8] border-none rounded-2xl focus:ring-2 focus:ring-[#f59e0b]/20 outline-none appearance-none text-amber-900/70 font-semibold cursor-pointer"
          >
            <option value="">All Segments</option>
            {allInterests.map((interest, idx) => (
              <option key={idx} value={interest as string}>{interest as string}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-900/30 pointer-events-none" size={16} />
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="bg-white rounded-[32px] shadow-sm border border-amber-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-amber-900/5">
                <th className="px-8 py-5 text-left text-xs font-bold text-amber-900/40 uppercase tracking-[0.15em]">Profile</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-amber-900/40 uppercase tracking-[0.15em]">Communication</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-amber-900/40 uppercase tracking-[0.15em]">Preferences</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-amber-900/40 uppercase tracking-[0.15em]">Tags</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-amber-900/40 uppercase tracking-[0.15em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    {/* ANIMASI LOADING KUNING AMBER */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-[#f59e0b] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-amber-900/40 font-bold tracking-widest text-xs uppercase animate-pulse">Syncing Database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-amber-50/30 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#f59e0b] flex items-center justify-center font-black text-lg shadow-inner group-hover:scale-110 transition-transform">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-amber-950 text-base">{customer.name}</p>
                          <p className="text-[10px] uppercase font-black text-amber-900/30 tracking-tighter">Member since {new Date(customer.createdAt).getFullYear()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-semibold text-amber-900/70">{customer.contact || "-"}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                        <span className="text-sm font-bold text-amber-950">{customer.favoriteDrink || "No Preference"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-2">
                        {customer.interests?.map((tag: string, index: number) => (
                          <span key={index} className="text-[10px] font-bold uppercase tracking-wide bg-stone-100 text-stone-500 px-2.5 py-1 rounded-lg border border-stone-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-amber-900/40 hover:text-[#f59e0b] hover:bg-amber-50 rounded-xl transition-all" title="View Details"><Eye size={18} /></button>
                        <button className="p-2 text-amber-900/40 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Edit Profile"><Edit3 size={18} /></button>
                        <button className="p-2 text-amber-900/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                      <User size={48} className="mx-auto text-amber-900/10" />
                      <p className="text-amber-900/40 font-bold">No matching profiles found in the database.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PELANGGAN (REVAMPED) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl border border-amber-900/5">
            <div className="bg-[#FCFAF8] p-8 border-b border-amber-900/5 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-amber-950">New Database Profile</h3>
                <p className="text-xs text-amber-900/40 font-bold uppercase tracking-widest mt-1">Registering a new customer</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors text-amber-900/30 hover:text-amber-950">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 ml-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-[#FCFAF8] border-none rounded-2xl focus:ring-2 focus:ring-[#f59e0b]/20 outline-none text-amber-950 font-semibold" placeholder="e.g. Andi Setiawan" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 ml-1">Contact Info</label>
                  <input type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full px-5 py-3 bg-[#FCFAF8] border-none rounded-2xl focus:ring-2 focus:ring-[#f59e0b]/20 outline-none text-amber-950 font-semibold" placeholder="Email / HP" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 ml-1">Top Beverage</label>
                  <input type="text" value={formData.favoriteDrink} onChange={e => setFormData({...formData, favoriteDrink: e.target.value})} className="w-full px-5 py-3 bg-[#FCFAF8] border-none rounded-2xl focus:ring-2 focus:ring-[#f59e0b]/20 outline-none text-amber-950 font-semibold" placeholder="Latte, etc." />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 ml-1">Interest Tags (Comma separated)</label>
                <input type="text" value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})} className="w-full px-5 py-3 bg-[#FCFAF8] border-none rounded-2xl focus:ring-2 focus:ring-[#f59e0b]/20 outline-none text-amber-950 font-semibold" placeholder="morning buyer, oat milk, pastry" />
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 px-6 rounded-2xl font-bold text-amber-900/40 hover:bg-amber-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 px-6 bg-[#f59e0b] text-white rounded-2xl font-bold shadow-lg shadow-amber-500/20 hover:bg-[#d97706] disabled:opacity-50 transition-all active:scale-95">
                  {isSubmitting ? "Processing..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}