"use client";

import { useState, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  Activity, 
  MapPin, 
  Clock, 
  User, 
  ShieldCheck, 
  Truck, 
  Store, 
  ChevronDown
} from "lucide-react";

interface HeaderProps {
  currentTab: string;
  currentRole: string;
  onSelectRole: (role: string) => void;
  onOpenAi: () => void;
  onStartDemoFlow: () => void;
  isSidebarCollapsed: boolean;
}

export default function Header({
  currentTab,
  currentRole,
  onSelectRole,
  onOpenAi,
  onStartDemoFlow,
  isSidebarCollapsed,
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const titlesMap: Record<string, { title: string; desc: string }> = {
    overview: { 
      title: "Overview", 
      desc: "Live coordination telemetry for Pune urban goods movement" 
    },
    map: { 
      title: "Live Pune Map", 
      desc: "Geospatial telemetry for micro-hubs, vehicles, routes, and traffic corridors" 
    },
    deliveries: { 
      title: "Deliveries", 
      desc: "Consignments, spatial cluster consolidation, and package manifest" 
    },
    hubs: { 
      title: "Micro-Hubs", 
      desc: "8 strategic Pune urban logistics and consolidation facilities" 
    },
    vehicles: { 
      title: "Vehicles", 
      desc: "Fleet status, load factors, and electric vehicle deployment" 
    },
    routes: { 
      title: "Routes", 
      desc: "Optimized multi-stop paths and capacity-constrained delivery sequences" 
    },
    reverse: { 
      title: "Reverse Logistics", 
      desc: "Corridor pickup matching to eliminate empty return trips" 
    },
    simulation: { 
      title: "Simulation Center", 
      desc: "Comparative model: Conventional point-to-point vs Urban Flow coordination" 
    },
    analytics: { 
      title: "Analytics", 
      desc: "Fleet utilization, consolidation efficiency, and emissions reduction metrics" 
    },
    planning: { 
      title: "Network Planning", 
      desc: "Simulate candidate micro-hub additions and quantify city-scale impact" 
    },
    users: {
      title: "System Accounts & Directory",
      desc: "Registered city administrators, delivery fleet agents, merchants, and consumer profiles"
    },
    driver: {
      title: "Delivery Agent Web Portal",
      desc: "Sequential delivery stop checklist and parcel confirmation console"
    },
    customer: {
      title: "Customer Logistics Web Portal",
      desc: "Live consignment milestone tracking and delivery windows"
    }
  };

  const currentInfo = titlesMap[currentTab] || { 
    title: "Urban Flow", 
    desc: "Intelligent Urban Logistics Coordination Platform" 
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "driver":
        return "Delivery Agent (Ramesh Shinde #04)";
      case "business":
        return "Merchant Partner (Pune Daily Fresh)";
      case "customer":
        return "Consumer Account (Aditi Joshi)";
      default:
        return "City Administrator";
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#e2e8f0] px-6 flex items-center justify-between">
      
      {/* Active View Title & Context */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-[#0f172a] tracking-tight">
            {currentInfo.title}
          </h1>
          {currentRole !== "admin" && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">
              {currentRole === "driver" ? "Agent View" : currentRole === "customer" ? "Customer View" : "Merchant View"}
            </span>
          )}
        </div>
        <p className="text-xs text-[#64748b] hidden sm:block">
          {currentInfo.desc}
        </p>
      </div>

      {/* Right Actions & Telemetry Badges */}
      <div className="flex items-center gap-3">
        
        {/* Active Perspective Indicator & Fast Switcher */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0] text-xs text-[#0f172a]">
          {currentRole === "admin" && <ShieldCheck className="w-3.5 h-3.5 text-[#ef4444]" />}
          {currentRole === "driver" && <Truck className="w-3.5 h-3.5 text-[#2563eb]" />}
          {currentRole === "business" && <Store className="w-3.5 h-3.5 text-[#f59e0b]" />}
          {currentRole === "customer" && <User className="w-3.5 h-3.5 text-[#10b981]" />}
          <span className="font-medium">{getRoleLabel(currentRole)}</span>
        </div>

        {/* Network Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#f8f9fa] border border-[#e2e8f0] text-xs text-[#0f172a]">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span className="font-medium">Pune Network</span>
          <span className="text-[#64748b]">● Active</span>
          <span className="text-[#94a3b8] font-mono pl-1">{timeStr || "19:50"} IST</span>
        </div>

        {/* Demo Flow Trigger */}
        <button
          onClick={onStartDemoFlow}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#fffbeb] border border-[#fde68a] text-[#92400e] hover:bg-[#fef3c7] text-xs font-medium transition-all"
          title="Interactive faculty evaluation script"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
          <span>Faculty Demo</span>
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAi}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-medium transition-all shadow-xs"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Intelligence</span>
        </button>
      </div>
    </header>
  );
}
