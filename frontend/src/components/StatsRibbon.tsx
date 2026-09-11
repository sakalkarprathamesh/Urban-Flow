"use client";

import { DashboardStats } from "@/types";
import { 
  Truck, 
  Package, 
  Route, 
  Warehouse, 
  Activity, 
  Zap, 
  TrendingDown, 
  RotateCcw 
} from "lucide-react";

interface StatsProps {
  stats: DashboardStats | null;
}

export default function StatsRibbon({ stats }: StatsProps) {
  const cards = [
    {
      title: "Active Vehicles",
      value: stats ? stats.active_vehicles : 30,
      subtext: `${stats ? stats.vehicles_in_transit : 18} currently moving`,
      icon: Truck,
      color: "text-[#1a73e8]",
      accentBg: "bg-[#e8f0fe]",
    },
    {
      title: "Packages In Transit",
      value: stats ? stats.packages_in_transit.toLocaleString() : "480",
      subtext: `Out of ${stats ? stats.active_packages.toLocaleString() : "1,240"} active`,
      icon: Package,
      color: "text-[#1a73e8]",
      accentBg: "bg-[#e8f0fe]",
    },
    {
      title: "Active Routes",
      value: stats ? stats.active_routes : 31,
      subtext: "Dynamic multi-drop loops",
      icon: Route,
      color: "text-[#1a73e8]",
      accentBg: "bg-[#e8f0fe]",
    },
    {
      title: "Micro-Hubs",
      value: stats ? stats.active_micro_hubs : 8,
      subtext: "Pune strategic logistics nodes",
      icon: Warehouse,
      color: "text-[#1a73e8]",
      accentBg: "bg-[#e8f0fe]",
    },
    {
      title: "Vehicle Utilization",
      value: `${stats ? stats.average_vehicle_utilization_pct : 72.4}%`,
      subtext: "+24.4% vs uncoordinated",
      icon: Activity,
      color: "text-[#34a853]",
      accentBg: "bg-[#e6f4ea]",
    },
    {
      title: "Packages Consolidated",
      value: stats ? stats.packages_consolidated.toLocaleString() : "918",
      subtext: `${stats ? stats.consolidation_rate_pct : 74.2}% consolidation rate`,
      icon: Zap,
      color: "text-[#34a853]",
      accentBg: "bg-[#e6f4ea]",
    },
    {
      title: "Trips Avoided",
      value: stats ? stats.simulated_trips_avoided.toLocaleString() : "471",
      subtext: "Simulated redundant runs cut",
      icon: TrendingDown,
      color: "text-[#34a853]",
      accentBg: "bg-[#e6f4ea]",
    },
    {
      title: "Reverse Pickups",
      value: stats ? stats.empty_returns_avoided : 18,
      subtext: "Empty return runs avoided",
      icon: RotateCcw,
      color: "text-[#188038]",
      accentBg: "bg-[#e6f4ea]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 w-full">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="google-card p-3.5 flex flex-col justify-between bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wider">
                {c.title}
              </span>
              <div className={`w-6 h-6 rounded-md ${c.accentBg} flex items-center justify-center`}>
                <Icon className={`w-3.5 h-3.5 ${c.color}`} />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#202124] tracking-tight">
                {c.value}
              </div>
              <div className="text-[11px] text-[#5f6368] mt-0.5 truncate">
                {c.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
