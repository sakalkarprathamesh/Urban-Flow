"use client";

import { useState } from "react";
import { DashboardStats, MapDataResponse, MicroHub, Vehicle } from "@/types";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[440px] flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] text-xs">
      Loading Pune Network Cartography...
    </div>
  ),
});
import { 
  Truck, 
  Package, 
  Gauge, 
  RotateCcw, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles, 
  Activity, 
  ChevronRight,
  TrendingDown,
  Building2,
  CheckCircle2,
  Clock
} from "lucide-react";

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
  // Activity Feed Events
  const recentEvents = [
    {
      id: 1,
      type: "reroute",
      title: isRerouted ? "Dynamic Reroute Triggered" : "Corridor Optimization Active",
      desc: isRerouted 
        ? "Vehicle UF-012 rerouted via Senapati Bapat Road (+4.5 min detour)" 
        : "FC Road corridor nominal; routing via direct arterial grid",
      time: "Just now",
      badge: isRerouted ? "Critical" : "Nominal",
      badgeClass: isRerouted ? "uf-badge-critical" : "uf-badge-neutral",
    },
    {
      id: 2,
      type: "hub",
      title: "Hub Approaching Capacity",
      desc: "Hub 04 (Baner) storage capacity reached 78% of operating threshold",
      time: "3 min ago",
      badge: "Warning",
      badgeClass: "uf-badge-warning",
    },
    {
      id: 3,
      type: "cluster",
      title: "Delivery Cluster Consolidated",
      desc: "Shivajinagar sector: 24 package drops merged into 1 electric cargo run",
      time: "8 min ago",
      badge: "Efficient",
      badgeClass: "uf-badge-success",
    },
    {
      id: 4,
      type: "reverse",
      title: "Reverse Pickup Paired",
      desc: "Returning EV from Kothrud matched with 3 customer returns",
      time: "14 min ago",
      badge: "Piggyback",
      badgeClass: "uf-badge-info",
    },
    {
      id: 5,
      type: "traffic",
      title: "Peak Corridor Congestion",
      desc: "JM Road flow velocity normalized to 26 km/h following dispatch pacing",
      time: "21 min ago",
      badge: "Active",
      badgeClass: "uf-badge-neutral",
    },
  ];

  const activeVehicles = stats?.active_vehicles || 30;
  const deliveriesInTransit = stats?.packages_in_transit || 520;
  const utilizationPct = stats?.average_vehicle_utilization_pct || 74.2;
  const tripsAvoided = stats?.simulated_trips_avoided || 471;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Concept Hero Statement Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#eff6ff] text-[#1e40af] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              <span>Pune Urban Coordination Zone • Live Operational Network</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
              The second road network for everything your city needs.
            </h1>
            <p className="text-sm text-[#475569] max-w-3xl leading-relaxed">
              Today's roads move people. Urban Flow coordinates logistics into a shared digital layer—grouping consignments, dispatching via 8 neighborhood micro-hubs, and eliminating empty return trips.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOptimizeNetwork}
              className="uf-btn-primary text-xs"
              title="Consolidate unassigned packages into nearest micro-hubs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consolidate Demand</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reroute Incident Alert (when active) */}
      {isRerouted && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#fecaca] flex items-center justify-center text-[#ef4444] shrink-0 font-bold">
              ⚠️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#991b1b] uppercase tracking-wider">Dynamic Reroute Active</span>
                <span className="text-xs text-[#991b1b] font-mono">• Fergusson College Road (FC Road) Incident</span>
              </div>
              <p className="text-xs text-[#7f1d1d] mt-0.5">
                Route #1 diverted via Senapati Bapat Road. ETA adjusted from 28.0 min to 32.5 min (+4.5 min delay avoided gridlock).
              </p>
            </div>
          </div>
          <button
            onClick={onClearClosure}
            className="px-3 py-1.5 bg-white border border-[#fecaca] text-xs font-semibold text-[#991b1b] hover:bg-[#fee2e2] rounded-lg transition-colors"
          >
            Clear Incident
          </button>
        </div>
      )}

      {/* 4 Core High-Impact Metrics (Section 9) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Active Vehicles */}
        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Vehicles</span>
            <Truck className="w-4 h-4 text-[#1e3a8a]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            {activeVehicles}
          </div>
          <div className="text-xs text-[#64748b] mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
            <span>{stats?.vehicles_in_transit || 14} in transit across Pune</span>
          </div>
        </div>

        {/* Metric 2: Deliveries In Transit */}
        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Deliveries In Transit</span>
            <Package className="w-4 h-4 text-[#2563eb]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            {deliveriesInTransit}
          </div>
          <div className="text-xs text-[#64748b] mt-1">
            <span>{stats?.packages_consolidated || 917} consolidated ({stats?.consolidation_rate_pct || 74.2}%)</span>
          </div>
        </div>

        {/* Metric 3: Vehicle Load Utilization */}
        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Vehicle Utilization</span>
            <Gauge className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            {utilizationPct}%
          </div>
          <div className="text-xs text-[#065f46] mt-1 flex items-center gap-1 font-medium">
            <span>+32% vs uncoordinated single-drop</span>
          </div>
        </div>

        {/* Metric 4: Direct Trips Avoided */}
        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Trips Avoided</span>
            <TrendingDown className="w-4 h-4 text-[#0284c7]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            {tripsAvoided}
          </div>
          <div className="text-xs text-[#0369a1] mt-1 flex items-center gap-1 font-medium">
            <span>~{stats?.simulated_distance_saved_km || 1601.4} km less road traffic</span>
          </div>
        </div>

      </div>

      {/* Main Operational Section: Map + Live Network Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Central Interactive Pune Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Geospatial Coordination Map
              </span>
              <span className="text-[11px] text-[#64748b]">• 8 Micro-Hubs & Active Corridors</span>
            </div>
          </div>

          <MapComponent
            mapData={mapData}
            onSimulateReroute={onSimulateReroute}
            onClearClosure={onClearClosure}
            onSelectHub={onSelectHub}
            onSelectVehicle={onSelectVehicle}
            isRerouted={isRerouted}
            compactHeight={true}
          />
        </div>

        {/* Right 1 Col: Live Network Activity Feed (Section 9) */}
        <div className="uf-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1e3a8a]" />
              <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Network Activity Feed
              </span>
            </div>
            <span className="text-[11px] text-[#64748b] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> Live
            </span>
          </div>

          <div className="space-y-3">
            {recentEvents.map((evt) => (
              <div 
                key={evt.id} 
                className="p-3 rounded-lg bg-[#f8f9fa] border border-[#f1f5f9] hover:border-[#cbd5e1] transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#0f172a]">{evt.title}</span>
                  <span className={`uf-badge text-[10px] ${evt.badgeClass}`}>{evt.badge}</span>
                </div>
                <p className="text-[11px] text-[#475569] leading-snug">
                  {evt.desc}
                </p>
                <span className="text-[10px] text-[#94a3b8] mt-1.5 block font-mono">
                  {evt.time}
                </span>
              </div>
            ))}
          </div>

          {/* Micro-Hub Operating Summary Snapshot */}
          <div className="pt-3 border-t border-[#f1f5f9]">
            <div className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider mb-2">
              Micro-Hub Facility Load
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#475569]">
                <span>Shivajinagar Central</span>
                <span className="font-mono font-medium text-[#0f172a]">68% capacity</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Hinjewadi Tech Corridor</span>
                <span className="font-mono font-medium text-[#0f172a]">82% capacity</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Kothrud Residential</span>
                <span className="font-mono font-medium text-[#0f172a]">54% capacity</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
