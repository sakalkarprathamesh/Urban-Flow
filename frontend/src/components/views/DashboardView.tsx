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
  Warehouse,
  Truck,
  Activity,
  Layers,
  Clock
} from "lucide-react";

// Dynamic import for Leaflet
const MapComponent = dynamic(() => import("../MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-white border border-[#e8eaed] rounded-2xl text-[#5f6368] text-xs">
      Loading Pune Urban Flow Geospatial Layer...
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
  const [selectedFeedTab, setSelectedFeedTab] = useState<"clusters" | "routes" | "incidents">("clusters");

  return (
    <div className="space-y-5 max-w-7xl mx-auto px-4 sm:px-6 py-5">
      
      {/* Top Banner (Item 7) */}
      <div className="bg-white border border-[#e8eaed] rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold text-[#202124] tracking-tight">Urban Flow</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#188038] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse"></span>
              Pune Network • Operational
            </span>
          </div>
          <p className="text-sm text-[#5f6368]">
            The second road network for everything your city needs.
          </p>
        </div>

        {/* Quick Operations Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOptimizeNetwork}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimize Network</span>
          </button>
          {!isRerouted ? (
            <button
              onClick={onSimulateReroute}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#fce8e6] text-[#d93025] border border-[#f5c6cb] text-xs font-medium transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#ea4335]" />
              <span>Simulate Road Closure</span>
            </button>
          ) : (
            <button
              onClick={onClearClosure}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e6f4ea] hover:bg-[#ceead6] text-[#137333] border border-[#a8dab5] text-xs font-semibold transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#188038]" />
              <span>Restore Corridor</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Road Closure Notice (when active) */}
      {isRerouted && (
        <div className="p-4 rounded-2xl bg-[#fef7e0] border border-[#fbbc04] flex flex-wrap items-center justify-between gap-3 text-xs text-[#b06000]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#f29900] shrink-0" />
            <div>
              <b className="font-semibold text-[#804000]">Active Road Closure: Fergusson College Road (FC Road)</b>
              <p className="text-[#994d00]">Route UF-R001 dynamically rerouted via Senapati Bapat Road. ETA adjusted from 28 min to 32.5 min (+4.5 min detour).</p>
            </div>
          </div>
          <button
            onClick={onClearClosure}
            className="px-3 py-1 rounded-full bg-[#ffffff] border border-[#fbbc04] text-[#804000] font-semibold hover:bg-[#feefc3]"
          >
            Clear Incident
          </button>
        </div>
      )}

      {/* Metrics Ribbon (Item 7 - 8 real cards from backend) */}
      <StatsRibbon stats={stats} />

      {/* Main Grid: Interactive Map (Left 68%) & Live Operations Feed (Right 32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Interactive Map Column */}
        <div className="lg:col-span-8 h-[540px] flex flex-col">
          <MapComponent
            mapData={mapData}
            onSimulateReroute={onSimulateReroute}
            onClearClosure={onClearClosure}
            onSelectHub={onSelectHub}
            onSelectVehicle={onSelectVehicle}
            isRerouted={isRerouted}
          />
        </div>

        {/* Live Operational Telemetry Column */}
        <div className="lg:col-span-4 h-[540px] flex flex-col google-card p-4 overflow-hidden bg-white">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#e8eaed] mb-3">
            <div>
              <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                Live Operations Feed
              </h2>
              <span className="text-[11px] text-[#5f6368]">Active Pune City movements</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse"></span>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 mb-3 bg-[#f1f3f4] p-1 rounded-xl text-xs">
            <button
              onClick={() => setSelectedFeedTab("clusters")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                selectedFeedTab === "clusters" ? "bg-white text-[#1a73e8] font-semibold shadow-xs" : "text-[#5f6368]"
              }`}
            >
              Clusters ({mapData?.clusters?.length || 5})
            </button>
            <button
              onClick={() => setSelectedFeedTab("routes")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                selectedFeedTab === "routes" ? "bg-white text-[#1a73e8] font-semibold shadow-xs" : "text-[#5f6368]"
              }`}
            >
              Routes ({mapData?.routes?.length || 1})
            </button>
            <button
              onClick={() => setSelectedFeedTab("incidents")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                selectedFeedTab === "incidents" ? "bg-white text-[#1a73e8] font-semibold shadow-xs" : "text-[#5f6368]"
              }`}
            >
              Incidents ({mapData?.traffic_events?.length || 0})
            </button>
          </div>

          {/* Feed Content */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {selectedFeedTab === "clusters" && (
              <>
                {mapData?.clusters?.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-[#e8eaed] hover:border-[#d2e3fc] bg-white text-xs flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="font-semibold text-[#202124] flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#1a73e8]" />
                        {c.code}
                      </div>
                      <div className="text-[11px] text-[#5f6368] mt-0.5">
                        {c.package_count} Packages • {c.total_weight_kg} kg combined
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e6f4ea] text-[#188038]">
                        Consolidated
                      </span>
                      <div className="text-[10px] text-[#80868b] mt-1 font-mono">
                        Hub 0{c.hub_id || 1}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {selectedFeedTab === "routes" && (
              <>
                {mapData?.routes?.map((r) => (
                  <div
                    key={r.id}
                    className={`p-3 rounded-xl border text-xs flex flex-col gap-1.5 transition-all ${
                      r.is_rerouted
                        ? "bg-[#fef7e0]/50 border-[#fbbc04]"
                        : "bg-white border-[#e8eaed]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#202124] flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#1a73e8]" />
                        {r.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.is_rerouted ? "bg-[#fce8e6] text-[#c5221f]" : "bg-[#e8f0fe] text-[#1a73e8]"
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#5f6368]">
                      <span>Distance: {r.distance_km} km</span>
                      <span className="text-[#1a73e8] font-semibold">ETA: {r.eta_min} min</span>
                    </div>
                    {r.empty_returns_avoided > 0 && (
                      <div className="text-[11px] text-[#188038] font-medium pt-1 border-t border-[#f1f3f4]">
                        ✓ {r.empty_returns_avoided} Reverse pickup paired (Zero empty return)
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {selectedFeedTab === "incidents" && (
              <>
                {mapData?.traffic_events && mapData.traffic_events.length > 0 ? (
                  mapData.traffic_events.map((te) => (
                    <div
                      key={te.id}
                      className="p-3 rounded-xl bg-[#fce8e6]/40 border border-[#f5c6cb] text-xs space-y-1"
                    >
                      <div className="font-bold text-[#c5221f] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ea4335]" />
                        {te.road}
                      </div>
                      <p className="text-[#5f6368] text-[11px]">{te.description}</p>
                      <div className="text-[10px] text-[#80868b]">Area: {te.area}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-[#5f6368] text-xs">
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
