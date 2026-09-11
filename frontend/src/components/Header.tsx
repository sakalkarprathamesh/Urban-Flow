"use client";

import { useState, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  Activity, 
  MapPin, 
  ShieldCheck, 
  Clock,
  ExternalLink
} from "lucide-react";

interface HeaderProps {
  currentTab: string;
  currentRole: string;
  onOpenAi: () => void;
  onStartDemoFlow: () => void;
  isSidebarCollapsed: boolean;
}

export default function Header({
  currentTab,
  currentRole,
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
    landing: { title: "Welcome to Urban Flow", desc: "The second road network for everything your city needs" },
    overview: { title: "Command Center Overview", desc: "Live coordination telemetry for Pune urban logistics zone" },
    map: { title: "Live Geospatial Map", desc: "Real-time Pune micro-hubs, vehicles, routes, and traffic incidents" },
    deliveries: { title: "Deliveries & Clustering", desc: "Consignments, spatial cluster consolidation, and package tracking" },
    hubs: { title: "Micro-Hub Network", desc: "8 strategic Pune urban logistics and consolidation facilities" },
    vehicles: { title: "Vehicle Fleet Management", desc: "Active electric cargo vans, mini-trucks, and 2-wheeler couriers" },
    routes: { title: "Optimized Delivery Routes", desc: "Capacitated vehicle routing problem (CVRP) stops and path sequences" },
    reverse: { title: "Reverse Logistics Center", desc: "Eliminating empty return runs through corridor pickup matching" },
    simulation: { title: "Logistics Simulation Center", desc: "Comparative model: Conventional point-to-point vs Urban Flow" },
    analytics: { title: "City Logistics Analytics", desc: "Efficiency trends, utilization curves, and demand patterns" },
    planning: { title: "Network Infrastructure Planning", desc: "Simulate candidate micro-hub additions and quantify savings" },
    driver: { title: "Delivery Agent Web Portal", desc: "Live route execution and stop-by-stop delivery confirmation" },
    customer: { title: "Customer Logistics Web Portal", desc: "Live package journey timeline and consolidation tracking" },
  };

  const currentInfo = titlesMap[currentTab] || { title: "Urban Flow", desc: "Intelligent Urban Logistics Coordination Platform" };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#e8eaed] px-6 flex items-center justify-between">
      
      {/* Active Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-[#202124]">
            {currentInfo.title}
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#f1f3f4] text-[#5f6368] font-medium capitalize">
            {currentRole === "driver" ? "Delivery Agent" : currentRole} View
          </span>
        </div>
        <p className="text-xs text-[#5f6368] hidden sm:block">
          {currentInfo.desc}
        </p>
      </div>

      {/* Right Telemetry Badges & Quick Action Buttons */}
      <div className="flex items-center gap-3">
        
        {/* Network Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f8fafd] border border-[#e8eaed] text-xs text-[#202124]">
          <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse"></span>
          <span className="font-medium">Pune Urban Zone</span>
          <span className="text-[#5f6368] font-mono">| {timeStr || "19:50:00"} IST</span>
        </div>

        {/* 1-Click Faculty Demo Trigger */}
        <button
          onClick={onStartDemoFlow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fef7e0] border border-[#fbbc04] text-[#b06000] hover:bg-[#feefc3] text-xs font-semibold transition-all shadow-xs"
          title="Launch 7-step presentation script and action sequence for faculty evaluation"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#f29900]" />
          <span>Faculty Demo</span>
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAi}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium transition-all shadow-xs"
        >
          <Bot className="w-4 h-4 text-white" />
          <span>AI Assistant</span>
        </button>

      </div>

    </header>
  );
}
