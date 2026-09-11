"use client";

import { MicroHub } from "@/types";
import { Warehouse, Truck, CheckCircle2, AlertTriangle, ShieldCheck, MapPin, Activity } from "lucide-react";

interface HubsProps {
  hubs: MicroHub[];
}

export default function HubsView({ hubs }: HubsProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-cyan-400" />
            Pune Micro-Hub Network ({hubs.length} Active Nodes)
          </h1>
          <p className="text-xs text-slate-400">
            Strategically located urban consolidation points decoupling line-haul and last-mile goods transit
          </p>
        </div>
      </div>

      {/* Grid of 8 Micro Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hubs.map((hub) => {
          const isHigh = hub.utilization_pct > 80;
          const isMed = hub.utilization_pct > 60;
          const colorClass = isHigh ? "text-rose-400" : isMed ? "text-amber-400" : "text-cyan-400";
          const progressBg = isHigh ? "bg-rose-500" : isMed ? "bg-amber-500" : "bg-cyan-500";

          return (
            <div
              key={hub.id}
              className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all hover:scale-[1.01]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                    {hub.code}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-white leading-tight">{hub.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {hub.area}, Pune
                </p>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Storage Load</span>
                  <span className={`font-bold ${colorClass}`}>
                    {hub.utilization_pct}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
                    style={{ width: `${Math.min(hub.utilization_pct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{hub.current_load_kg} kg current</span>
                  <span>{hub.max_capacity_kg} kg cap</span>
                </div>
              </div>

              {/* Coordinates and Operational Metadata */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div>
                  <span className="text-slate-500 block">Hours:</span>
                  <span className="text-slate-300 font-medium">{hub.operating_hours || "06:00 - 23:00"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">GPS Coords:</span>
                  <span className="font-mono text-slate-300">{hub.lat.toFixed(3)}, {hub.lng.toFixed(3)}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
