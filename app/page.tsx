"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function HomePage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" })
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <main className="flex h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur">
        <h1 className="text-xl font-semibold tracking-wide">OnlineMall Escrow AI</h1>
        <p className="mt-1 text-sm text-slate-400">
          Enterprise-grade smart escrow assistant on Hedera
        </p>
      </header>

      <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
              Ask about an order ID to verify delivery status and escrow release policy.
            </div>
          ) : null}

          {messages.map((m) => {
            const text =
              m.parts
                ?.filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("\n") ?? "";

            return (
              <article
                key={m.id}
                className={`max-w-[85%] rounded-2xl border px-4 py-3 shadow-lg ${
                  m.role === "user"
                    ? "ml-auto border-cyan-500/30 bg-cyan-500/15 text-cyan-50"
                    : "mr-auto border-slate-700 bg-slate-900 text-slate-100"
                }`}
              >
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {m.role === "user" ? "You" : "Escrow AI"}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {text || "(No text response)"}
                </p>
              </article>
            );
          })}

          {isLoading && (
            <div className="mr-auto rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              Escrow AI is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-900/90 px-4 py-4 backdrop-blur sm:px-6">
        <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-4xl gap-3">
          <input
            name="message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about an order (e.g., D-1001)..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </footer>
    </main>
  );
}