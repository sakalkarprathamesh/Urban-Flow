"use client";

import { useState } from "react";
import { Vehicle } from "@/types";
import { 
  Truck, 
  BatteryCharging, 
  Route, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Filter,
  Search,
  Gauge,
  Zap
} from "lucide-react";

interface VehiclesProps {
  vehicles: Vehicle[];
}

export default function VehiclesView({ vehicles }: VehiclesProps) {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filteredVehicles = vehicles.filter((v) => {
    const matchesType = filterType === "ALL" || (filterType === "EV" ? v.is_electric : !v.is_electric);
    const matchesStatus = filterStatus === "ALL" || v.status?.toUpperCase() === filterStatus;
    return matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in_transit":
        return <span className="uf-badge uf-badge-info">In Transit</span>;
      case "loading":
        return <span className="uf-badge uf-badge-warning">Loading</span>;
      case "idle":
        return <span className="uf-badge uf-badge-neutral">Idle at Hub</span>;
      default:
        return <span className="uf-badge uf-badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#0f172a] tracking-tight">
              Vehicle Fleet Management
            </h1>
            <span className="uf-badge uf-badge-info font-mono text-[11px]">
              {vehicles.length} Units Coordinated
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Electric cargo vans, mini-trucks, and 2-wheeler couriers monitored by capacity, route, and battery status.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterType(filterType === "ALL" ? "EV" : "ALL")}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              filterType === "EV"
                ? "bg-[#1e3a8a] text-white border-[#1e3a8a] font-medium"
                : "bg-white text-[#475569] border-[#e2e8f0] hover:bg-[#f8f9fa]"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>EV Only ({vehicles.filter(v => v.is_electric).length})</span>
          </button>
        </div>
      </div>

      {/* Fleet Cards Grid (Section 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredVehicles.map((v) => {
          const utilPct = Math.round((v.current_load_kg / Math.max(v.max_capacity_kg, 1)) * 100);
          const isHighLoad = utilPct >= 70;

          return (
            <div
              key={v.id}
              className="uf-card p-4 space-y-3 bg-white hover:border-[#cbd5e1] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Code & Status */}
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0f172a]">
                      {v.code}
                    </span>
                    {v.is_electric && (
                      <span className="px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#065f46] text-[10px] font-semibold">
                        EV
                      </span>
                    )}
                  </div>
                  {getStatusBadge(v.status)}
                </div>

                {/* Vehicle Attributes */}
                <div className="py-2 space-y-1 text-xs">
                  <div className="font-semibold text-[#0f172a] capitalize">
                    {v.type?.replace("_", " ")}
                  </div>
                  <div className="text-[11px] text-[#64748b] flex items-center gap-1">
                    <Route className="w-3 h-3 text-[#2563eb]" />
                    <span>Route: <b>{v.route_id ? `Route #${v.route_id}` : "Shivajinagar Loop"}</b></span>
                  </div>
                  <div className="text-[11px] text-[#64748b] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#94a3b8]" />
                    <span>ETA next stop: <b className="text-[#0f172a]">14 min</b></span>
                  </div>
                </div>
              </div>

              {/* Visual Load Indicator (Section 13) */}
              <div className="pt-2 border-t border-[#f1f5f9] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#64748b] text-[11px]">Load Factor</span>
                  <span className="font-bold text-[#0f172a] font-mono">
                    {utilPct}% <span className="text-[10px] font-normal text-[#64748b]">Utilized</span>
                  </span>
                </div>

                <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isHighLoad ? "bg-[#1e3a8a]" : "bg-[#2563eb]"
                    }`}
                    style={{ width: `${Math.min(100, utilPct)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-[#94a3b8] font-mono">
                  <span>{v.current_load_kg} kg current</span>
                  <span>{v.max_capacity_kg} kg max</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
