"use client";

import { 
  Network, 
  ArrowRight, 
  Layers, 
  Truck, 
  Warehouse, 
  RotateCcw, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles,
  MapPin
} from "lucide-react";

interface LandingProps {
  onExplore: () => void;
}

export default function LandingView({ onExplore }: LandingProps) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-950 via-[#080d1a] to-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[300px] bg-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Main Hero Header */}
      <div className="max-w-4xl mx-auto text-center relative z-10 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Intelligent Urban Logistics Coordination Platform • Pune Urban Pilot
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          The <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">second road network</span> for everything your city needs.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Today's urban roads move people, while goods travel through a fragmented parallel system of uncoordinated vehicles, empty return trips, and congested neighborhoods. Urban Flow creates a shared intelligent coordination layer that clusters shipments, connects them through micro-hubs, and synchronizes reverse logistics.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExplore}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Explore the City Network
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Concept Diagram: Fragmented vs Urban Flow */}
      <div className="max-w-5xl mx-auto w-full my-12 relative z-10">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase text-center mb-6">
            The Core Concept: From Uncoordinated Trips to Coordinated Urban Flow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Left: Fragmented Traditional */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-red-500/20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400">Conventional Logistics</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300">Fragmented</span>
              </div>
              <p className="text-xs text-slate-400">
                Multiple independent delivery vans travel to the same neighborhood carrying 35-48% capacity. Many return completely empty.
              </p>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="p-2 rounded bg-slate-950/60 flex items-center justify-between">
                  <span>Merchant A ➔ Kothrud</span>
                  <span className="text-red-400">Van 1 (30% load)</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 flex items-center justify-between">
                  <span>Merchant B ➔ Kothrud</span>
                  <span className="text-red-400">Van 2 (40% load)</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 flex items-center justify-between">
                  <span>Return ➔ Empty</span>
                  <span className="text-red-400">100% empty trip</span>
                </div>
              </div>
            </div>

            {/* Center: Urban Flow Coordination Mechanism */}
            <div className="p-5 rounded-xl bg-gradient-to-b from-cyan-950/40 to-indigo-950/40 border border-cyan-500/40 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
                <Network className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white">Urban Flow Optimization Engine</h3>
              <p className="text-[11px] text-slate-300">
                Examines undelivered demand ➔ Spatial clustering ➔ Micro-hub allocation ➔ Capacity vehicle dispatch ➔ Return pickup pairing.
              </p>
              <div className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                Demand Analysis ➔ Clustering ➔ Micro-Hub ➔ Reverse
              </div>
            </div>

            {/* Right: Urban Flow Consolidated Result */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Urban Flow Coordination</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Consolidated</span>
              </div>
              <p className="text-xs text-slate-400">
                Packages are grouped into a micro-hub. 1 EV vehicle handles the consolidated neighborhood drop, then picks up returns on its way back.
              </p>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="p-2 rounded bg-slate-950/60 flex items-center justify-between">
                  <span>Hub 02 ➔ Paud Road</span>
                  <span className="text-emerald-400">1 EV Van (78% load)</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 flex items-center justify-between">
                  <span>Stops 1-4 ➔ Delivered</span>
                  <span className="text-emerald-400">14 packages</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 flex items-center justify-between">
                  <span>Return ➔ Piggybacked</span>
                  <span className="text-emerald-400">4 reverse pickups</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Features */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-center pb-4 relative z-10">
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
          <Warehouse className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
          <h4 className="text-xs font-bold text-white">8 Pune Micro-Hubs</h4>
          <p className="text-[10px] text-slate-400">Strategically distributed nodes</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
          <Truck className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
          <h4 className="text-xs font-bold text-white">38% Trips Avoided</h4>
          <p className="text-[10px] text-slate-400">Simulated reduction in urban runs</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
          <RotateCcw className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
          <h4 className="text-xs font-bold text-white">Reverse Logistics</h4>
          <p className="text-[10px] text-slate-400">No more empty return legs</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
          <ShieldCheck className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
          <h4 className="text-xs font-bold text-white">Dynamic Rerouting</h4>
          <p className="text-[10px] text-slate-400">Live response to traffic incidents</p>
        </div>
      </div>

    </div>
  );
}
