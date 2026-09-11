"use client";

import { useState } from "react";
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RefreshCw,
  Database,
  Info
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
      text: "Hello! I am your Urban Flow Logistics Intelligence Assistant for the Pune metropolitan area. I explain optimization decisions, predict demand surge impacts, and recommend hub placements grounded directly in your live operational database.",
      provider: "Urban Flow Telemetry Engine"
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Where should we build the next micro-hub?",
    "Why was Hub 04 selected for this delivery cluster?",
    "What happens if delivery demand increases by 30%?",
    "How can we reduce empty return journeys?",
    "Which micro-hub is closest to capacity?",
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
          text: "Unable to reach the Urban Flow backend service. Please verify FastAPI is running on port 8000.",
          provider: "System Notice"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[1100] w-full sm:w-[480px] bg-white border-l border-[#e8eaed] shadow-2xl flex flex-col transition-all duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-[#e8eaed] flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#202124] flex items-center gap-1.5">
              Urban Flow Intelligence Assistant
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-semibold">
                Grounded
              </span>
            </h3>
            <p className="text-[11px] text-[#5f6368] flex items-center gap-1">
              <Database className="w-3 h-3 text-[#34a853]" />
              Connected to Pune Operational Database
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Inquiries */}
      <div className="px-4 py-3 bg-[#f8fafd] border-b border-[#e8eaed] space-y-1.5">
        <div className="text-[10px] font-semibold text-[#5f6368] uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#f29900]" /> Suggested Inquiries
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-white hover:bg-[#e8f0fe] hover:text-[#1a73e8] border border-[#dadce0] hover:border-[#1a73e8] text-[#3c4043] px-2.5 py-1 rounded-full text-left transition-all shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#f8fafd]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-[#1a73e8] text-white rounded-br-none shadow-xs"
                  : "bg-white border border-[#e8eaed] text-[#202124] rounded-bl-none shadow-xs"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
            {msg.provider && (
              <span className="text-[10px] text-[#80868b] mt-1 px-1">
                {msg.provider}
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#1a73e8] p-3 bg-white rounded-2xl border border-[#e8eaed] shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Analyzing operational telemetry and computing recommendation...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3.5 border-t border-[#e8eaed] bg-white">
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
            placeholder="Ask about Pune routes, micro-hubs, or consolidation..."
            className="flex-1 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#1a73e8] focus:bg-white text-[#202124] text-xs px-4 py-2.5 rounded-full outline-none transition-all placeholder:text-[#80868b]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-[#80868b] text-center mt-2 flex items-center justify-center gap-1">
          <Info className="w-3 h-3" />
          Grounded on database calculations • Explains real system telemetry
        </p>
      </div>

    </div>
  );
}
