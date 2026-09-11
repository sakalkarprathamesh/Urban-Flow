"use client";

import { MicroHub } from "@/types";
import { Warehouse, MapPin, Truck, Package, ExternalLink, Activity } from "lucide-react";

interface HubsProps {
  hubs: MicroHub[];
  onNavigateTab?: (tab: string) => void;
}

export default function HubsView({ hubs, onNavigateTab }: HubsProps) {
  return (
    <div className="space-y-5 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#202124] flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-[#1a73e8]" />
            Micro-Hub Network Facilities ({hubs.length} Active Hubs)
          </h1>
          <p className="text-xs text-[#5f6368]">
            Strategically located urban consolidation points decoupling arterial and last-mile goods transit across Pune
          </p>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab("planning")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <span>Propose New Micro-Hub</span>
          </button>
        )}
      </div>

      {/* Grid of 8 Micro-Hub Cards (Item 12) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hubs.map((hub) => {
          const isHigh = hub.utilization_pct > 80;
          const isMed = hub.utilization_pct > 60;
          const colorClass = isHigh ? "text-[#d93025]" : isMed ? "text-[#b06000]" : "text-[#1a73e8]";
          const progressBg = isHigh ? "bg-[#ea4335]" : isMed ? "bg-[#fbbc04]" : "bg-[#1a73e8]";

          return (
            <div
              key={hub.id}
              className="google-card p-5 flex flex-col justify-between space-y-4 bg-white"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#e8f0fe] text-[#1a73e8]">
                    {hub.code}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#188038]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34a853]"></span>
                    Operational
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-[#202124]">{hub.name}</h3>
                <p className="text-xs text-[#5f6368] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#80868b]" />
                  {hub.area}, Pune
                </p>
              </div>

              {/* Capacity Progress Bar (Item 12) */}
              <div className="space-y-1.5 bg-[#f8fafd] p-3 rounded-xl border border-[#e8eaed]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5f6368]">Capacity</span>
                  <span className={`font-bold ${colorClass}`}>
                    {hub.utilization_pct}%
                  </span>
                </div>
                <div className="w-full bg-[#e8eaed] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
                    style={{ width: `${Math.min(hub.utilization_pct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#5f6368] font-mono pt-1">
                  <span>{hub.current_load_kg} kg current</span>
                  <span>{hub.max_capacity_kg} kg max</span>
                </div>
              </div>

              {/* Hub Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#f1f3f4]">
                <div>
                  <span className="text-[#80868b] block text-[11px]">Active Packages</span>
                  <span className="font-semibold text-[#202124]">{Math.round(hub.current_load_kg / 12)} pkgs</span>
                </div>
                <div>
                  <span className="text-[#80868b] block text-[11px]">Vehicles</span>
                  <span className="font-semibold text-[#202124]">4 connected</span>
                </div>
              </div>

              {/* Action Links (Item 12: View on Map, View Packages, View Vehicles) */}
              <div className="pt-2 border-t border-[#f1f3f4] flex items-center justify-between text-xs text-[#1a73e8] font-medium">
                <button
                  onClick={() => onNavigateTab && onNavigateTab("map")}
                  className="hover:underline"
                >
                  View on Map
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab("deliveries")}
                  className="hover:underline"
                >
                  Packages
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab("vehicles")}
                  className="hover:underline"
                >
                  Vehicles
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
