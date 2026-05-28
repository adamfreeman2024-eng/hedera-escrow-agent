"use client";
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, ShieldCheck, PlusCircle, Search, User, Loader2 } from 'lucide-react';

export default function EscrowDashboard() {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [trackId, setTrackId] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callApi = async (prompt: string) => {
    setIsLoading(true);
    const newMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await res.json();
      
      if (data.error) {
         setMessages([...newMessages, { role: 'assistant', content: `SERVER ERROR: ${data.error}` }]);
      } else {
         setMessages([...newMessages, { role: 'assistant', content: data.content }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Failed to connect to server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockFunds = () => {
    if (!orderId || !amount) return;
    const prompt = `Please lock ${amount} HBAR for order ${orderId}.`;
    callApi(prompt);
    setOrderId('');
    setAmount('');
  };

  const handleCheckDelivery = () => {
    if (!trackId) return;
    const prompt = `Can you check my delivery status? My Track ID is ${trackId}.`;
    callApi(prompt);
    setTrackId('');
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    callApi(input);
    setInput('');
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans overflow-hidden">
      <aside className="w-1/3 border-r border-gray-800 p-6 flex flex-col gap-6 bg-gray-950 z-10 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="text-emerald-500" size={28} />
          <h1 className="text-xl font-bold tracking-tight">EscrowAI Platform</h1>
        </div>
        
        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 space-y-4 shadow-lg">
          <h3 className="font-semibold text-gray-300">New Transaction</h3>
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} className="w-full bg-gray-800 p-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="Enter Order ID..." />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="w-full bg-gray-800 p-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="Amount (HBAR)..." />
          <button onClick={handleLockFunds} disabled={isLoading || !orderId || !amount} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition">
            <PlusCircle size={20} /> Lock Funds
          </button>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-lg">
          <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2"><Search size={16}/> Track Order Status</h3>
          <div className="flex gap-2">
            <input value={trackId} onChange={(e) => setTrackId(e.target.value)} className="flex-1 bg-gray-800 p-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="TRK-..." />
            <button onClick={handleCheckDelivery} disabled={isLoading || !trackId} className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded-xl transition font-medium">Check</button>
          </div>
        </div>
      </aside>

      <section className="flex-1 flex flex-col bg-gray-950 relative">
        <header className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm z-10">
          <span className="text-sm font-medium text-gray-400">EscrowAI Assistant v1.0</span>
        </header>

        <div className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-2xl text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-emerald-500 animate-pulse pl-10">Processing...</div>}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 border-t border-gray-800 bg-gray-950">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-gray-900 rounded-2xl px-6 py-4 outline-none border border-gray-800" placeholder="Ask anything..." disabled={isLoading} />
            <button onClick={handleSendMessage} disabled={isLoading} className="bg-emerald-600 p-4 rounded-2xl">
              <Send size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}