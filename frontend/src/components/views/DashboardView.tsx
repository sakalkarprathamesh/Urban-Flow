"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { 
  DashboardStats, 
  MapDataResponse, 
  MicroHub, 
  Vehicle, 
  DeliveryCluster,
  RouteData
} from "@/types";
import StatsRibbon from "../StatsRibbon";
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  Clock, 
  TrendingUp,
  Warehouse,
  Truck
} from "lucide-react";

// Dynamic import for Leaflet to avoid SSR window errors
const MapComponent = dynamic(() => import("../MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-950 border border-slate-800 rounded-xl text-slate-500 text-xs">
      Loading Pune Urban Flow Geospatial Engine...
    </div>
  ),
});

interface DashboardProps {
  stats: DashboardStats | null;
  mapData: MapDataResponse | null;
  onSimulateReroute: () => void;
  onClearClosure: () => void;
  onOptimizeNetwork: () => void;
  onSelectHub: (hub: MicroHub) => void;
  onSelectVehicle: (veh: Vehicle) => void;
  isRerouted: boolean;
  rerouteDetails: any;
}

export default function DashboardView({
  stats,
  mapData,
  onSimulateReroute,
  onClearClosure,
  onOptimizeNetwork,
  onSelectHub,
  onSelectVehicle,
  isRerouted,
  rerouteDetails,
}: DashboardProps) {
  const [selectedTab, setSelectedTab] = useState<"clusters" | "routes" | "incidents">("clusters");

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 py-4">
      
      {/* Dynamic Road Closure Alert Banner (When Incident is Active) */}
      {isRerouted && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/50 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                DYNAMIC REROUTE ACTIVE • FERGUSSON COLLEGE ROAD BLOCKED
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                  +4.5 min ETA Delta
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Route UF-R001 rerouted via Senapati Bapat Road arterial detour. Original ETA: 28 min ➔ New ETA: 32.5 min.
              </p>
            </div>
          </div>
          <button
            onClick={onClearClosure}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Clear Incident
          </button>
        </div>
      )}

      {/* KPI Stats Ribbon */}
      <StatsRibbon stats={stats} />

      {/* Main Command Room: Interactive Map (Left 70%) & Telemetry Drawer (Right 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Interactive Map Column */}
        <div className="lg:col-span-8 h-[560px] flex flex-col">
          <MapComponent
            mapData={mapData}
            onSimulateReroute={onSimulateReroute}
            onClearClosure={onClearClosure}
            onSelectHub={onSelectHub}
            onSelectVehicle={onSelectVehicle}
            isRerouted={isRerouted}
          />
        </div>

        {/* Live Telemetry & Control Column */}
        <div className="lg:col-span-4 h-[560px] flex flex-col glass-panel rounded-xl border border-slate-800 p-4 overflow-hidden">
          
          {/* Quick Actions Panel */}
          <div className="mb-4 pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Autonomous Optimization Controls
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOptimizeNetwork}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Optimize Network
              </button>
              {!isRerouted ? (
                <button
                  onClick={onSimulateReroute}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Road Closure
                </button>
              ) : (
                <button
                  onClick={onClearClosure}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Clear Road
                </button>
              )}
            </div>
          </div>

          {/* Sub-tabs inside Telemetry drawer */}
          <div className="flex items-center gap-2 mb-3 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedTab("clusters")}
              className={`flex-1 py-1 rounded font-medium transition-all ${
                selectedTab === "clusters" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"
              }`}
            >
              Clusters ({mapData?.clusters?.length || 5})
            </button>
            <button
              onClick={() => setSelectedTab("routes")}
              className={`flex-1 py-1 rounded font-medium transition-all ${
                selectedTab === "routes" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"
              }`}
            >
              Routes ({mapData?.routes?.length || 1})
            </button>
            <button
              onClick={() => setSelectedTab("incidents")}
              className={`flex-1 py-1 rounded font-medium transition-all ${
                selectedTab === "incidents" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"
              }`}
            >
              Incidents ({mapData?.traffic_events?.length || 0})
            </button>
          </div>

          {/* Tab Content List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {selectedTab === "clusters" && (
              <>
                {mapData?.clusters?.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-indigo-400" />
                        {c.code}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {c.package_count} pkgs • {c.total_weight_kg} kg
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                        CONSOLIDATED
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Hub ID: {c.hub_id || "Hub 01"}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {selectedTab === "routes" && (
              <>
                {mapData?.routes?.map((r) => (
                  <div
                    key={r.id}
                    className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1.5 ${
                      r.is_rerouted
                        ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                        : "bg-slate-900/90 border-slate-800 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-cyan-400" />
                        {r.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.is_rerouted ? "bg-amber-500/20 text-amber-300" : "bg-cyan-500/20 text-cyan-300"
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Distance: {r.distance_km} km</span>
                      <span className="text-sky-400 font-bold">ETA: {r.eta_min} min</span>
                    </div>
                    {r.is_rerouted && (
                      <div className="text-[10px] text-amber-400 font-mono bg-amber-950/40 p-1.5 rounded">
                        ⚠ Detour active via Senapati Bapat Road
                      </div>
                    )}
                    {r.empty_returns_avoided > 0 && (
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        ✓ {r.empty_returns_avoided} Reverse pickup assigned (Zero empty leg)
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {selectedTab === "incidents" && (
              <>
                {mapData?.traffic_events && mapData.traffic_events.length > 0 ? (
                  mapData.traffic_events.map((te) => (
                    <div
                      key={te.id}
                      className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs space-y-1"
                    >
                      <div className="font-bold text-red-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        {te.road}
                      </div>
                      <p className="text-slate-300 text-[11px]">{te.description}</p>
                      <div className="text-[10px] text-slate-400 font-mono">Area: {te.area}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No active traffic closures. Pune arterial corridors operating normally.
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
