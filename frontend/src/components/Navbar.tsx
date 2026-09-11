"use client";

import { useState, useEffect } from "react";
import { 
  Network, 
  MapPin, 
  Activity, 
  Package, 
  Warehouse, 
  Truck, 
  RotateCcw, 
  Sliders, 
  Compass, 
  Bot, 
  UserCheck, 
  Sparkles,
  Layers
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentRole: string;
  onSelectRole: (role: string) => void;
  onToggleAi: () => void;
  onStartDemoFlow: () => void;
}

export default function Navbar({
  currentTab,
  onSelectTab,
  currentRole,
  onSelectRole,
  onToggleAi,
  onStartDemoFlow,
}: NavbarProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-IN", { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "map", label: "Live Map", icon: Layers },
    { id: "deliveries", label: "Deliveries", icon: Package },
    { id: "hubs", label: "Micro-Hubs", icon: Warehouse },
    { id: "vehicles", label: "Vehicles", icon: Truck },
    { id: "reverse", label: "Reverse Logistics", icon: RotateCcw },
    { id: "simulation", label: "Simulation", icon: Sliders },
    { id: "planning", label: "Plan Network", icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        
        {/* Brand & Zone Indicator */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onSelectTab("landing")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white flex items-center gap-1.5">
                URBAN<span className="text-cyan-400">FLOW</span>
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                PUNE ZONE • {timeStr || "19:50:00"}
              </div>
            </div>
          </div>
        </div>

        {/* Center Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Faculty Demo Button, Role Switcher, AI Assistant */}
        <div className="flex items-center gap-2.5">
          {/* 1-Click Faculty Demo Trigger */}
          <button
            onClick={onStartDemoFlow}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-semibold hover:border-amber-400 transition-all"
            title="Launch step-by-step presentation walkthrough for faculty evaluation"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            Faculty Demo
          </button>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            {["admin", "business", "driver", "customer"].map((role) => (
              <button
                key={role}
                onClick={() => onSelectRole(role)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                  currentRole === role
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* AI Intelligence Assistant Toggle */}
          <button
            onClick={onToggleAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-indigo-200 text-xs font-medium transition-all shadow-lg shadow-indigo-500/10"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">AI Intelligence</span>
          </button>
        </div>

      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-900 bg-slate-950">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              currentTab === item.id ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
