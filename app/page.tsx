"use client";

import { useState } from "react";

export default function HomePage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content || JSON.stringify(data) }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col bg-slate-950 text-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-4 rounded-xl max-w-lg ${m.role === 'user' ? 'bg-cyan-900 ml-auto' : 'bg-slate-800'}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="text-slate-500">Escrow AI bhabche...</div>}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t border-slate-800 flex gap-2">
        <input 
          className="flex-1 bg-slate-900 p-3 rounded-lg"
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="D-1001 ba kono proshno likhun..." 
        />
        <button type="submit" className="bg-cyan-600 px-6 py-3 rounded-lg font-bold">send</button>
      </form>
    </main>
  );
}