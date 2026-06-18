"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "What's most urgent for our first GAAP year FY2026?",
  "How does deferred revenue work for annual subscriptions?",
  "Do we need to capitalize sales commissions under ASC 340-40?",
  "Walk me through the ASC 842 steps for our Austin office lease.",
  "How do we handle the cash-to-accrual transition under ASC 250?",
  "What internal software costs can we capitalize under ASC 350-40?",
  "How should we calculate our allowance for credit losses?",
  "What equity comp disclosures do we need under ASC 718?",
];

function renderMarkdown(text: string) {
  return text
    .replace(/^### (.+)$/gm, '<h4 class="text-sm font-bold text-slate-900 mt-4 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="text-base font-bold text-slate-900 mt-5 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-slate-800 px-1 rounded text-xs font-mono">$1</code>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/^(?!<[h|l])(.+)$/gm, (line) =>
      line.startsWith("<") ? line : `<span>${line}</span>`
    );
}

export default function AskAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (data.text) {
        setMessages([...next, { role: "assistant", content: data.text }]);
      } else {
        setMessages([...next, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Network error — please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 200px)", minHeight: 500 }}>
      {/* Chat window */}
      <div
        className="flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-4 mb-3"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
            <div className="text-4xl">🏛️</div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Ask anything about FASB standards as they apply to SerpApi
              </p>
              <p className="text-xs text-slate-400">
                Pre-loaded with your company profile · private SaaS · FY2026 first accrual year
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-slate-900 text-white rounded-br-sm"
                  : "bg-slate-50 text-slate-800 border border-slate-100 rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <div
                  className="prose-answer"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts (when chat has messages) */}
      {messages.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {QUICK_PROMPTS.slice(0, 4).map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={loading}
              className="text-xs px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
          placeholder="Ask about any FASB standard or accounting treatment…"
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60"
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          style={{ background: "#0f172a" }}
        >
          {loading ? "…" : "Send"}
        </button>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="px-4 py-3 rounded-xl text-sm border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
