"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MicroHub } from "@/types";
import { 
  Warehouse, 
  MapPin, 
  Truck, 
  Package, 
  Route, 
  Sparkles, 
  Activity, 
  ChevronRight,
  Gauge,
  Layers
} from "lucide-react";

const MapComponent = dynamic(() => import("../MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[440px] flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] text-xs">
      Loading Pune Hub Facility Cartography...
    </div>
  ),
});

interface HubsProps {
  hubs: MicroHub[];
  onNavigateTab?: (tab: string) => void;
}

export default function HubsView({ hubs, onNavigateTab }: HubsProps) {
  const [selectedHub, setSelectedHub] = useState<MicroHub>(hubs[0] || {
    id: 1,
    name: "Shivajinagar Hub",
    code: "HUB-SHIV",
    area: "Shivajinagar",
    location_name: "Shivajinagar Central, Pune",
    lat: 18.5314,
    lng: 73.8446,
    max_capacity_kg: 250,
    current_load_kg: 170,
    utilization_pct: 68.0,
    status: "active"
  });

  const activeHub = selectedHub || hubs[0];
  const hubLat = activeHub.lat || activeHub.latitude || 18.5314;
  const hubLng = activeHub.lng || activeHub.longitude || 73.8446;
  const currentLoad = activeHub.current_load_kg || activeHub.current_load || 170;
  const maxCap = activeHub.max_capacity_kg || activeHub.capacity || 250;
  const capacityPct = Math.round((currentLoad / Math.max(maxCap, 1)) * 100);
  const locationLabel = activeHub.location_name || activeHub.area || "Pune";

  // Synthesize simulated mapData focused on the selected hub
  const focusedMapData = {
    hubs: [{
      ...activeHub,
      latitude: hubLat,
      longitude: hubLng,
      current_load: currentLoad,
      capacity: maxCap,
      location_name: locationLabel
    }],
    vehicles: [
      {
        id: 101,
        code: "UF-014",
        type: "cargo_van_ev",
        lat: hubLat + 0.008,
        lng: hubLng - 0.006,
        latitude: hubLat + 0.008,
        longitude: hubLng - 0.006,
        max_capacity_kg: 500,
        current_load_kg: 370,
        utilization_pct: 74,
        battery_pct: 85,
        status: "in_transit",
        is_electric: true
      },
      {
        id: 102,
        code: "UF-022",
        type: "two_wheeler_ev",
        lat: hubLat - 0.007,
        lng: hubLng + 0.009,
        latitude: hubLat - 0.007,
        longitude: hubLng + 0.009,
        max_capacity_kg: 80,
        current_load_kg: 62,
        utilization_pct: 77,
        battery_pct: 92,
        status: "in_transit",
        is_electric: true
      }
    ],
    clusters: [
      {
        id: 201,
        code: "CL-01",
        cluster_code: "CL-01",
        lat: hubLat + 0.005,
        lng: hubLng + 0.004,
        latitude: hubLat + 0.005,
        longitude: hubLng + 0.004,
        package_count: 18,
        total_weight_kg: 45,
        assigned_hub_id: activeHub.id,
        status: "consolidated"
      }
    ],
    routes: [
      {
        id: 301,
        code: "ROUTE-01",
        vehicle_id: 101,
        hub_id: activeHub.id,
        distance_km: 8.4,
        total_distance_km: 8.4,
        eta_min: 24.0,
        total_duration_min: 24.0,
        original_eta: 24.0,
        rerouted_eta: 24.0,
        empty_returns_avoided: 2,
        polyline: [
          [hubLat, hubLng],
          [hubLat + 0.005, hubLng + 0.004],
          [hubLat + 0.008, hubLng - 0.006],
        ] as [number, number][],
        stops: [],
        status: "in_progress",
        is_rerouted: false
      }
    ],
    destinations: [],
    traffic_events: [],
    reverse_pickups: []
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#0f172a] tracking-tight">
              Micro-Hub Network Facilities
            </h1>
            <span className="uf-badge uf-badge-neutral text-[11px] font-mono">
              {hubs.length} Active Nodes
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Decoupling long-distance freight from neighborhood last-mile delivery across Pune's high-density corridors.
          </p>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab("planning")}
            className="uf-btn-primary text-xs shadow-xs"
          >
            <span>Propose Candidate Hub</span>
          </button>
        )}
      </div>

      {/* Master-Detail Layout (Section 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 5 Cols: Hubs Directory List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider px-1">
            Network Facilities ({hubs.length})
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {hubs.map((hub) => {
              const isSelected = activeHub.id === hub.id;
              const hLoad = hub.current_load_kg || hub.current_load || 150;
              const hCap = hub.max_capacity_kg || hub.capacity || 250;
              const loadPct = Math.round((hLoad / Math.max(hCap, 1)) * 100);
              const isHigh = loadPct > 80;

              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white border-[#2563eb] shadow-sm ring-2 ring-[#2563eb]/10"
                      : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8f9fa]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1e40af] bg-[#eff6ff] px-1.5 py-0.5 rounded">
                        {hub.code}
                      </span>
                      <span className="text-sm font-semibold text-[#0f172a]">{hub.name}</span>
                    </div>
                    <span className="uf-badge uf-badge-success text-[10px]">
                      Operational
                    </span>
                  </div>

                  <div className="text-xs text-[#64748b] mb-2.5 truncate">
                    {hub.location_name || hub.area}
                  </div>

                  {/* Load Factor Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#64748b]">
                      <span>Operating Load:</span>
                      <span className="font-semibold text-[#0f172a]">{loadPct}% Capacity</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isHigh ? "bg-[#f59e0b]" : "bg-[#10b981]"
                        }`}
                        style={{ width: `${Math.min(100, loadPct)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#f1f5f9] text-[11px] text-[#64748b]">
                    <span>{hLoad} / {hCap} pkgs</span>
                    <span>6 assigned EVs</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-[#2563eb]" : "text-[#94a3b8]"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Selected Hub Detail & Interactive Map (Section 12) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Selected Hub Summary Card */}
          <div className="uf-card p-5 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#f1f5f9]">
              <div>
                <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Active Facility Telemetry
                </span>
                <h2 className="text-base font-bold text-[#0f172a] mt-0.5">
                  {activeHub.name} ({activeHub.code})
                </h2>
                <p className="text-xs text-[#64748b]">{locationLabel}</p>
              </div>
              <span className="uf-badge uf-badge-success text-xs">
                Operational
              </span>
            </div>

            {/* 4 Quick Telemetry Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] text-[#64748b] block uppercase">Storage Capacity</span>
                <span className="text-base font-bold text-[#0f172a] font-mono">{capacityPct}%</span>
              </div>
              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] text-[#64748b] block uppercase">Packages Staged</span>
                <span className="text-base font-bold text-[#0f172a] font-mono">{currentLoad}</span>
              </div>
              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] text-[#64748b] block uppercase">Assigned Fleet</span>
                <span className="text-base font-bold text-[#0f172a] font-mono">6 EVs</span>
              </div>
              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] text-[#64748b] block uppercase">Active Routes</span>
                <span className="text-base font-bold text-[#0f172a] font-mono">12 Routes</span>
              </div>
            </div>

            {/* Interactive Cartography Focused on Selected Hub */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                <span className="font-semibold uppercase tracking-wider">Catchment Area & Staged Dispatches</span>
                <span>Coordinates: {hubLat.toFixed(4)}, {hubLng.toFixed(4)}</span>
              </div>
              <MapComponent
                mapData={focusedMapData as any}
                compactHeight={true}
              />
            </div>

            {/* Nearby Demand & Vehicles List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider block mb-1">
                  Demand Density
                </span>
                <p className="text-xs text-[#0f172a] font-medium">
                  High concentration in {locationLabel.split(',')[0]} sector
                </p>
                <span className="text-[11px] text-[#64748b] mt-0.5 block">
                  18 parcels grouped into 2 upcoming departure waves
                </span>
              </div>

              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider block mb-1">
                  Assigned Cargo Vans
                </span>
                <p className="text-xs text-[#0f172a] font-medium">
                  UF-014 (74% Load) • UF-022 (78% Load)
                </p>
                <span className="text-[11px] text-[#64748b] mt-0.5 block">
                  Departures scheduled every 45 minutes
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
