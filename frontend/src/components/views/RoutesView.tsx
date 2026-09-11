"use client";

import { RouteData } from "@/types";
import { Route as RouteIcon, MapPin, Truck, Clock, Sparkles, AlertTriangle, ArrowRight } from "lucide-react";

interface RoutesProps {
  routes: RouteData[];
  onNavigateToMap: () => void;
}

export default function RoutesView({ routes, onNavigateToMap }: RoutesProps) {
  return (
    <div className="space-y-5 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#202124] flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-[#1a73e8]" />
            Delivery Routes & Path Optimization
          </h1>
          <p className="text-xs text-[#5f6368]">
            Multi-drop TSP / Capacitated VRP sequences calculated on Pune arterial network
          </p>
        </div>

        <button
          onClick={onNavigateToMap}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs transition-all"
        >
          <span>Highlight Routes on Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Routes Table / Cards (Item 14) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((r) => {
          const isDetour = r.is_rerouted || r.status === "rerouted";
          return (
            <div
              key={r.id}
              className={`google-card p-5 flex flex-col justify-between space-y-3 bg-white ${
                isDetour ? "border-[#fbbc04]" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-[#1a73e8]">
                    {r.code}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isDetour ? "bg-[#fce8e6] text-[#c5221f]" : "bg-[#e8f0fe] text-[#1a73e8]"
                  }`}>
                    {isDetour ? "DETOUR ACTIVE" : r.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-[#5f6368] space-y-1">
                  <div>Origin: <b className="text-[#202124]">Shivajinagar Central Depot (Hub 01)</b></div>
                  <div>Assigned Vehicle: <b className="text-[#202124]">UF-V001 (Electric Cargo Van)</b></div>
                  <div>Stops: <b className="text-[#202124]">4 delivery waypoints + 1 return</b></div>
                </div>
              </div>

              {/* Route Metrics (Item 14) */}
              <div className="grid grid-cols-3 gap-2 bg-[#f8fafd] p-3 rounded-xl border border-[#e8eaed] text-center text-xs">
                <div>
                  <span className="text-[#80868b] block text-[11px]">Distance</span>
                  <span className="font-bold text-[#202124]">{r.distance_km} km</span>
                </div>
                <div>
                  <span className="text-[#80868b] block text-[11px]">Est. Time</span>
                  <span className="font-bold text-[#1a73e8]">{r.eta_min} min</span>
                </div>
                <div>
                  <span className="text-[#80868b] block text-[11px]">Opt. Score</span>
                  <span className="font-bold text-[#34a853]">94.2%</span>
                </div>
              </div>

              {isDetour && (
                <div className="p-2.5 rounded-xl bg-[#fef7e0] border border-[#fbbc04] text-[11px] text-[#b06000] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#f29900] shrink-0" />
                  <span>Rerouted via Senapati Bapat Road due to FC Road closure.</span>
                </div>
              )}

              {r.empty_returns_avoided > 0 && (
                <div className="text-xs text-[#188038] font-medium pt-1">
                  ✓ {r.empty_returns_avoided} Reverse return pickup piggybacked
                </div>
              )}

              <button
                onClick={onNavigateToMap}
                className="w-full py-2 rounded-xl bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] text-xs font-medium transition-colors"
              >
                Inspect Path on Map
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
