"use client";

import { Vehicle } from "@/types";
import { Truck, BatteryCharging, Navigation, CheckCircle2, Clock } from "lucide-react";

interface VehiclesProps {
  vehicles: Vehicle[];
}

export default function VehiclesView({ vehicles }: VehiclesProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-400" />
          Vehicle Fleet Management ({vehicles.length} Units Active)
        </h1>
        <p className="text-xs text-slate-400">
          Electric cargo vans, mini-trucks, and 2-wheeler couriers coordinated by capacity and zone
        </p>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {vehicles.map((v) => {
          const isTransit = v.status === "in_transit";
          const isLoading = v.status === "loading";
          const statusBadge = isTransit 
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            : isLoading
            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
            : "bg-slate-800 text-slate-400 border-slate-700";

          return (
            <div
              key={v.id}
              className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-xs flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isTransit ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`}></span>
                  {v.code}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                  {v.status.toUpperCase()}
                </span>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-200 capitalize">
                  {v.type.replace("_", " ")}
                </div>
                <div className="text-[11px] text-slate-400">
                  Route: <b className="text-cyan-400">{v.route_id ? `UF-R00${v.route_id}` : "Idle"}</b>
                </div>
              </div>

              {/* Capacity Utilization */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Utilization</span>
                  <span className="font-bold text-emerald-400">{v.utilization_pct}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(v.utilization_pct, 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {v.current_load_kg} kg / {v.max_capacity_kg} kg
                </div>
              </div>

              {/* Battery / Fuel */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-400" />
                  Battery/Fuel
                </span>
                <span className="font-mono text-white font-bold">{v.battery_pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
