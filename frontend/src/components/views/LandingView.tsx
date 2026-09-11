"use client";

import { 
  ArrowRight, 
  Warehouse, 
  Truck, 
  RotateCcw, 
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";

interface LandingProps {
  onExplore: () => void;
  onSeeHowItWorks?: () => void;
}

export default function LandingView({ onExplore, onSeeHowItWorks }: LandingProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-white px-4 py-10 sm:px-6 lg:px-12">
      
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center pt-6">
        
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
          <span>Urban Flow Web Platform • Pune City Logistics Pilot</span>
        </div>

        {/* Big Confident Heading */}
        <h1 className="text-4xl sm:text-6xl font-bold text-[#202124] tracking-tight leading-[1.15] mb-5">
          The <span className="text-[#1a73e8]">second road network</span> for everything your city needs.
        </h1>

        {/* Supporting Text */}
        <p className="text-lg sm:text-xl text-[#5f6368] max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Today's roads move people. Urban Flow makes them intelligently move everything people need.
        </p>

        {/* Clean CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onExplore}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-sm shadow-sm hover:shadow-md transition-all transform hover:scale-[1.01]"
          >
            <span>Explore the City Network</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onSeeHowItWorks || onExplore}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] font-medium text-sm transition-all"
          >
            <span>See How It Works</span>
            <ChevronRight className="w-4 h-4 text-[#5f6368]" />
          </button>
        </div>
      </div>

      {/* 5-Step Process Flow (Item 10) */}
      <div className="max-w-5xl mx-auto w-full my-12">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold text-[#1a73e8] uppercase tracking-wider">
            Intelligent Goods Movement Workflow
          </span>
          <h2 className="text-lg font-bold text-[#202124] mt-1">
            How Urban Flow Coordinates City Deliveries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {[
            {
              step: "01",
              title: "Independent Deliveries",
              desc: "Parcels from restaurants, e-commerce, pharmacies, and local businesses.",
              icon: "📦",
            },
            {
              step: "02",
              title: "Demand Analysis",
              desc: "Urban Flow scans destination corridors and delivery time windows.",
              icon: "🧠",
            },
            {
              step: "03",
              title: "Micro-Hub Consolidation",
              desc: "Shipments grouped into 8 strategically located Pune neighborhood micro-hubs.",
              icon: "🏬",
            },
            {
              step: "04",
              title: "Optimized Routes",
              desc: "High-utilization multi-drop routes dispatched via EV cargo vehicles.",
              icon: "🚚",
            },
            {
              step: "05",
              title: "Reverse Return Flow",
              desc: "Returns and eligible pickups piggyback on returning vehicles. Zero empty trips.",
              icon: "↺",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="google-card p-4 text-center bg-white flex flex-col justify-between h-48 relative group"
            >
              <div>
                <div className="text-2xl mb-2">{item.icon}</div>
                <span className="text-[11px] font-mono font-bold text-[#1a73e8] block mb-1">
                  STEP {item.step}
                </span>
                <h3 className="text-xs font-bold text-[#202124] leading-snug">
                  {item.title}
                </h3>
              </div>
              <p className="text-[11px] text-[#5f6368] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Bottom Value Props */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#f1f3f4] text-center">
        <div className="p-3">
          <div className="text-2xl font-bold text-[#1a73e8]">38%</div>
          <div className="text-xs font-semibold text-[#202124] mt-0.5">Trips Avoided</div>
          <div className="text-[11px] text-[#5f6368]">Simulated reduction in urban goods runs</div>
        </div>
        <div className="p-3">
          <div className="text-2xl font-bold text-[#34a853]">72%</div>
          <div className="text-xs font-semibold text-[#202124] mt-0.5">Average Utilization</div>
          <div className="text-[11px] text-[#5f6368]">Consolidated capacity vs 48% conventional</div>
        </div>
        <div className="p-3">
          <div className="text-2xl font-bold text-[#188038]">Zero</div>
          <div className="text-xs font-semibold text-[#202124] mt-0.5">Deadhead Returns</div>
          <div className="text-[11px] text-[#5f6368]">Automated reverse logistics pairing</div>
        </div>
      </div>

    </div>
  );
}
