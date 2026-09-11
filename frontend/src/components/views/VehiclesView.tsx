"use client";

import { Vehicle } from "@/types";
import { Truck, BatteryCharging, Route, CheckCircle2, Clock } from "lucide-react";

interface VehiclesProps {
  vehicles: Vehicle[];
}

export default function VehiclesView({ vehicles }: VehiclesProps) {
  return (
    <div className="space-y-5 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#202124] flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#1a73e8]" />
          Vehicle Fleet Management ({vehicles.length} Units)
        </h1>
        <p className="text-xs text-[#5f6368]">
          Electric cargo vans, mini-trucks, and 2-wheeler couriers coordinated by capacity and zone
        </p>
      </div>

      {/* Vehicles Grid (Item 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {vehicles.map((v) => {
          const isTransit = v.status === "in_transit";
          const isLoading = v.status === "loading";
          const statusBadge = isTransit 
            ? "bg-[#e6f4ea] text-[#137333]"
            : isLoading
            ? "bg-[#fef7e0] text-[#b06000]"
            : "bg-[#f1f3f4] text-[#5f6368]";

          return (
            <div
              key={v.id}
              className="google-card p-4 space-y-3 bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#202124] text-xs flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isTransit ? "bg-[#34a853] animate-pulse" : "bg-[#80868b]"}`}></span>
                  {v.code}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge}`}>
                  {v.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#202124] capitalize">
                  {v.type.replace("_", " ")}
                </div>
                <div className="text-[11px] text-[#5f6368]">
                  Route: <b className="text-[#1a73e8]">{v.route_id ? `UF-R00${v.route_id}` : "Idle Depot"}</b>
                </div>
              </div>

              {/* Visual Utilization Indicator (Item 13) */}
              <div className="space-y-1 bg-[#f8fafd] p-2.5 rounded-xl border border-[#e8eaed]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5f6368]">Capacity</span>
                  <span className="font-bold text-[#202124]">{v.utilization_pct}% utilized</span>
                </div>
                <div className="w-full bg-[#e8eaed] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#1a73e8] rounded-full transition-all"
                    style={{ width: `${Math.min(v.utilization_pct, 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#5f6368] font-mono pt-0.5">
                  {v.current_load_kg} kg / {v.max_capacity_kg} kg
                </div>
              </div>

              {/* Location & Battery/Fuel */}
              <div className="pt-2 border-t border-[#f1f3f4] flex items-center justify-between text-xs text-[#5f6368]">
                <span className="flex items-center gap-1 text-[11px]">
                  <BatteryCharging className="w-3.5 h-3.5 text-[#34a853]" />
                  {v.battery_pct}%
                </span>
                <span className="text-[11px] text-[#1a73e8] font-medium font-mono">
                  ETA 18 min
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
