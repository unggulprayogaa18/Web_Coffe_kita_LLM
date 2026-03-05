"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, MessageSquare, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function AIChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Halo Mimi! Saya sudah mensinkronisasi data pelanggan Kopi Kita terbaru. Ada metrik atau segmentasi spesifik yang ingin Anda tanyakan hari ini?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke pesan terbaru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ content: userMsg }] })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Maaf, sistem sedang mengalami kendala sinkronisasi data.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Chips saran pertanyaan agar UI tidak kosong
  const suggestions = [
    "Siapa pelanggan susu oat?",
    "Tren minuman minggu ini?",
    "Target promo pastry?"
  ];

  return (
    <div className="h-screen flex flex-col bg-[#FCFAF8] font-sans overflow-hidden">
      
      {/* --------------------------------------------------------------------------------
          CUSTOM SCROLLBAR STYLE
      -------------------------------------------------------------------------------- */}
      <style jsx global>{`
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 10px; }
      `}</style>

      {/* ================= HEADER AREA ================= */}
      <div className="p-8 lg:p-10 border-b border-amber-900/5 bg-white/50 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-950 rounded-2xl flex items-center justify-center text-[#f59e0b] shadow-lg shadow-amber-950/20">
              <Zap size={24} className="fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-950 tracking-tight">Intelligence Assistant</h1>
              <p className="text-xs text-amber-900/40 font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected to Database
              </p>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <div className="px-4 py-2 bg-stone-100 rounded-xl text-[10px] font-bold text-stone-500 uppercase tracking-widest border border-stone-200">
              Model: Llama 3.3
            </div>
          </div>
        </div>
      </div>

      {/* ================= CHAT AREA (Insight Card Style) ================= */}
      <div className="flex-1 overflow-y-auto chat-scroll p-6 md:p-10 space-y-8">
        <div className="max-w-4xl mx-auto space-y-10 pb-20" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar Ikon */}
              <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${
                msg.role === 'user' ? 'bg-white border border-stone-200 text-stone-400' : 'bg-[#f59e0b] text-white'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
              </div>

              {/* Konten Pesan */}
              <div className={`max-w-[85%] md:max-w-[75%] space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-900/30">
                  {msg.role === 'user' ? 'Mimi (Owner)' : 'System Insight'}
                </p>
                <div className={`p-5 md:p-6 rounded-[24px] shadow-sm border ${
                  msg.role === 'user' 
                  ? 'bg-amber-950 text-white border-amber-900 rounded-tr-none' 
                  : 'bg-white text-amber-950 border-amber-900/5 rounded-tl-none'
                }`}>
                  <p className="text-sm md:text-base leading-relaxed font-medium">
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 items-center animate-pulse">
              <div className="w-10 h-10 bg-stone-200 rounded-xl"></div>
              <div className="h-12 w-48 bg-stone-100 rounded-2xl border border-stone-200"></div>
            </div>
          )}
        </div>
      </div>

      {/* ================= INPUT AREA ================= */}
      <div className="p-6 md:p-10 bg-gradient-to-t from-[#FCFAF8] via-[#FCFAF8] to-transparent">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Suggestion Chips */}
          {!loading && messages.length < 3 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((text) => (
                <button 
                  key={text}
                  onClick={() => setInput(text)}
                  className="px-4 py-2 bg-white border border-amber-900/5 rounded-full text-xs font-bold text-amber-900/60 hover:border-[#f59e0b] hover:text-[#f59e0b] transition-all shadow-sm"
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* Floating Input Bar */}
          <form onSubmit={sendMessage} className="relative group">
            <div className="absolute inset-0 bg-[#f59e0b]/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-white border border-amber-900/10 rounded-[28px] p-2 shadow-2xl shadow-amber-900/5 overflow-hidden">
              <div className="pl-6 text-amber-900/30">
                <MessageSquare size={20} />
              </div>
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your customers..."
                className="flex-1 bg-transparent border-none py-4 px-4 focus:ring-0 outline-none text-amber-950 font-semibold placeholder:text-amber-900/20"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-[#f59e0b] hover:bg-amber-950 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 shadow-lg shadow-amber-500/20"
              >
                <CornerDownLeft size={20} />
              </button>
            </div>
          </form>
          
          <p className="text-center text-[10px] font-bold text-amber-900/20 uppercase tracking-[0.3em]">
            AI can make mistakes. Please verify critical data.
          </p>
        </div>
      </div>
    </div>
  );
}