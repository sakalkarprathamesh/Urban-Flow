"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { RouteData } from "@/types";
import { 
  Route as RouteIcon, 
  MapPin, 
  Truck, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2,
  ChevronRight,
  Package,
  Gauge
} from "lucide-react";

const MapComponent = dynamic(() => import("../MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[440px] flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] text-xs">
      Loading Pune Route Telemetry...
    </div>
  ),
});

interface RoutesProps {
  routes: RouteData[];
  onNavigateToMap: () => void;
}

export default function RoutesView({ routes, onNavigateToMap }: RoutesProps) {
  // Ensure we have at least 3 realistic routes for demonstration
  const displayRoutes: RouteData[] = routes.length > 0 ? routes : [
    {
      id: 1,
      code: "ROUTE-01",
      vehicle_id: 101,
      hub_id: 1,
      distance_km: 14.2,
      total_distance_km: 14.2,
      eta_min: 28.0,
      total_duration_min: 28.0,
      original_eta: 28.0,
      rerouted_eta: 28.0,
      empty_returns_avoided: 2,
      stops: [
        { id: 1, sequence_order: 1, address: "Shivajinagar Hub", is_completed: true },
        { id: 2, sequence_order: 2, address: "FC Road Market", is_completed: true },
        { id: 3, sequence_order: 3, address: "Deccan Gymkhana", is_completed: false },
        { id: 4, sequence_order: 4, address: "Kothrud Depot", is_completed: false },
      ],
      polyline: [
        [18.5314, 73.8446],
        [18.5246, 73.8415],
        [18.5167, 73.8378],
        [18.5074, 73.8077],
      ],
      status: "in_progress",
      is_rerouted: false
    },
    {
      id: 2,
      code: "ROUTE-02",
      vehicle_id: 102,
      hub_id: 3,
      distance_km: 18.6,
      total_distance_km: 18.6,
      eta_min: 35.0,
      total_duration_min: 35.0,
      original_eta: 35.0,
      rerouted_eta: 35.0,
      empty_returns_avoided: 1,
      stops: [
        { id: 5, sequence_order: 1, address: "Hinjewadi Phase 1", is_completed: true },
        { id: 6, sequence_order: 2, address: "Wakad Chowk", is_completed: false },
        { id: 7, sequence_order: 3, address: "Baner Highway", is_completed: false },
      ],
      polyline: [
        [18.5912, 73.7389],
        [18.5987, 73.7621],
        [18.5590, 73.7868],
      ],
      status: "in_progress",
      is_rerouted: false
    },
    {
      id: 3,
      code: "ROUTE-03",
      vehicle_id: 103,
      hub_id: 4,
      distance_km: 11.4,
      total_distance_km: 11.4,
      eta_min: 22.0,
      total_duration_min: 22.0,
      original_eta: 22.0,
      rerouted_eta: 22.0,
      empty_returns_avoided: 3,
      stops: [
        { id: 8, sequence_order: 1, address: "Viman Nagar Hub", is_completed: true },
        { id: 9, sequence_order: 2, address: "Kalyani Nagar Circle", is_completed: false },
        { id: 10, sequence_order: 3, address: "Koregaon Park", is_completed: false },
      ],
      polyline: [
        [18.5679, 73.9143],
        [18.5463, 73.9033],
        [18.5362, 73.8940],
      ],
      status: "completed",
      is_rerouted: false
    }
  ];

  const [selectedRoute, setSelectedRoute] = useState<RouteData>(displayRoutes[0]);

  const focusedMapData = {
    hubs: [
      {
        id: selectedRoute.hub_id || 1,
        name: selectedRoute.hub_id === 3 ? "Hinjewadi Hub" : selectedRoute.hub_id === 4 ? "Viman Nagar Hub" : "Shivajinagar Hub",
        code: `HUB-0${selectedRoute.hub_id || 1}`,
        location_name: "Pune Hub Depot",
        latitude: selectedRoute.polyline?.[0]?.[0] || 18.5314,
        longitude: selectedRoute.polyline?.[0]?.[1] || 73.8446,
        capacity: 250,
        current_load: 170,
        utilization_pct: 68.0,
        status: "active"
      }
    ],
    vehicles: [
      {
        id: selectedRoute.vehicle_id || 101,
        code: `UF-0${selectedRoute.vehicle_id ? String(selectedRoute.vehicle_id).slice(-2) : '12'}`,
        type: "cargo_van_ev",
        max_capacity_kg: 500,
        current_load_kg: 380,
        latitude: selectedRoute.polyline?.[1]?.[0] || 18.5246,
        longitude: selectedRoute.polyline?.[1]?.[1] || 73.8415,
        status: "in_transit",
        is_electric: true
      }
    ],
    routes: [selectedRoute],
    clusters: [],
    traffic_events: []
  };

  const isDetour = selectedRoute.is_rerouted || selectedRoute.status === "rerouted";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#0f172a] tracking-tight">
              Delivery Routes & Corridor Geometry
            </h1>
            <span className="uf-badge uf-badge-neutral font-mono text-[11px]">
              {displayRoutes.length} Active Corridors
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Capacity-constrained multi-drop routing solving the urban vehicle routing problem (VRP) across Pune neighborhoods.
          </p>
        </div>
      </div>

      {/* Split View: Left Route List + Right Interactive Map (Section 14) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 5 Cols: Route List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider px-1">
            Dispatch Sequences ({displayRoutes.length})
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {displayRoutes.map((r) => {
              const isSelected = selectedRoute.id === r.id;
              const hasDetour = r.is_rerouted || r.status === "rerouted";

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoute(r)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white border-[#2563eb] shadow-sm ring-2 ring-[#2563eb]/10"
                      : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8f9fa]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1e40af] bg-[#eff6ff] px-1.5 py-0.5 rounded">
                        {r.code || `ROUTE-0${r.id}`}
                      </span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {r.hub_id === 3 ? "Hinjewadi Corridor" : r.hub_id === 4 ? "Airport / Viman Nagar" : "Shivajinagar ➔ Kothrud"}
                      </span>
                    </div>

                    {/* Status: "Optimized" or "Needs attention" (Section 14) */}
                    <span className={`uf-badge text-[10px] ${
                      hasDetour ? "uf-badge-critical" : "uf-badge-success"
                    }`}>
                      {hasDetour ? "Needs attention" : "Optimized"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 text-xs border-y border-[#f1f5f9] my-2 text-[#64748b]">
                    <div>
                      <span className="text-[10px] text-[#94a3b8] block">Distance</span>
                      <span className="font-mono font-medium text-[#0f172a]">{r.total_distance_km} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94a3b8] block">Est. Time</span>
                      <span className="font-mono font-medium text-[#0f172a]">{r.total_duration_min} min</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94a3b8] block">Stops</span>
                      <span className="font-mono font-medium text-[#0f172a]">{r.stops?.length || 4} drops</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                    <span>Assigned: EV Van UF-0{r.vehicle_id ? String(r.vehicle_id).slice(-2) : '12'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-[#2563eb]" : "text-[#94a3b8]"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Interactive Map Highlighting Selected Route (Section 14) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="uf-card p-5 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#f1f5f9]">
              <div>
                <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Selected Route Geography
                </span>
                <h2 className="text-base font-bold text-[#0f172a] mt-0.5">
                  {selectedRoute.code || `ROUTE-0${selectedRoute.id}`} • {selectedRoute.total_distance_km} km
                </h2>
                <p className="text-xs text-[#64748b]">
                  {isDetour ? "Detour via Senapati Bapat Road active (+4.5 min ETA)" : "Nominal arterial routing via Shivaji Road corridor"}
                </p>
              </div>

              {/* Optimization Status Badge */}
              <span className={`uf-badge text-xs ${
                isDetour ? "uf-badge-critical" : "uf-badge-success"
              }`}>
                {isDetour ? "Needs attention" : "Optimized"}
              </span>
            </div>

            {/* Interactive Route Map */}
            <div className="space-y-1.5">
              <MapComponent
                mapData={focusedMapData as any}
                selectedRouteId={selectedRoute.id}
                compactHeight={true}
              />
            </div>

            {/* Sequence of Stops (Progressive Disclosure) */}
            <div>
              <div className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                Sequenced Drop Sequence ({selectedRoute.stops?.length || 4} stops)
              </div>
              <div className="space-y-2">
                {(selectedRoute.stops || []).map((stop, idx) => (
                  <div 
                    key={stop.id || idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0] text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-mono font-bold text-[10px]">
                        {stop.sequence_order || idx + 1}
                      </span>
                      <span className="font-medium text-[#0f172a]">{stop.address}</span>
                    </div>
                    <span className="text-[11px] text-[#64748b] font-mono">
                      {stop.is_completed ? "Completed" : "Scheduled"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
