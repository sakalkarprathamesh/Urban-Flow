"use client";

import { useState } from "react";
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw,
  Database,
  ArrowRight
} from "lucide-react";
import { fetchApi } from "@/lib/api";

interface AiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: "user" | "ai";
  text: string;
  provider?: string;
}

export default function AiAssistantDrawer({ isOpen, onClose }: AiDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am your Urban Flow Logistics Intelligence Assistant for the Pune metropolitan pilot. I can analyze real-time hub capacities, explain route clustering, evaluate traffic disruptions, or predict network scaling impact grounded in live database telemetry.",
      provider: "Grounded System Intelligence"
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Where should we consider adding another micro-hub?",
    "Which area currently has the highest delivery demand?",
    "Which micro-hub is closest to capacity?",
    "Suggest three ways to reduce empty return journeys.",
    "What happens if delivery demand increases by 30%?",
    "Can we consolidate these deliveries?"
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: Message = { sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const data = await fetchApi<{
        response: string;
        provider: string;
      }>("/api/ai/ask", {
        method: "POST",
        body: JSON.stringify({ query: q })
      });

      const aiMsg: Message = {
        sender: "ai",
        text: data.response,
        provider: data.provider
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I was unable to query the logistics engine. Please verify the FastAPI backend is running.",
          provider: "System Error"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[1100] w-full sm:w-[460px] bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Urban Intelligence Assistant
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                GROUNDED
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" />
              Connected to Pune Live Database
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Chips */}
      <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/80 overflow-x-auto">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Quick Inquiries
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-slate-800/80 hover:bg-indigo-950 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/40 text-slate-300 px-2.5 py-1 rounded-full text-left transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-xl text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-cyan-600 text-white rounded-br-none shadow-md"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md"
              }`}
            >
              {/* Parse basic markdown formatting like bold */}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
            {msg.provider && (
              <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                {msg.provider}
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 p-2 bg-indigo-950/20 rounded-lg border border-indigo-900/40">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Analyzing operational telemetry and computing recommendation...
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-900/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about Pune logistics, routes, or hubs..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 text-xs px-3.5 py-2.5 rounded-lg outline-none transition-all placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-2">
          Grounded on active database calculations • No fabricated statistics
        </p>
      </div>

    </div>
  );
}
