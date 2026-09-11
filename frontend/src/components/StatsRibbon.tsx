"use client";

import { DashboardStats } from "@/types";
import { 
  Package, 
  Truck, 
  Warehouse, 
  TrendingDown, 
  Compass, 
  RotateCcw, 
  Zap,
  Leaf
} from "lucide-react";

interface StatsProps {
  stats: DashboardStats | null;
}

export default function StatsRibbon({ stats }: StatsProps) {
  const cards = [
    {
      title: "Active Packages",
      value: stats ? stats.active_packages.toLocaleString() : "1,240",
      subtext: `${stats ? stats.packages_in_transit : "480"} in active transit`,
      icon: Package,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/30",
    },
    {
      title: "Consolidated Rate",
      value: `${stats ? stats.consolidation_rate_pct : 74.2}%`,
      subtext: `${stats ? stats.packages_consolidated : "918"} items grouped`,
      icon: Zap,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/30",
    },
    {
      title: "Active Vehicles",
      value: `${stats ? stats.active_vehicles : 30}`,
      subtext: `${stats ? stats.average_vehicle_utilization_pct : 72.4}% avg utilization`,
      icon: Truck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
    {
      title: "Active Micro-Hubs",
      value: `${stats ? stats.active_micro_hubs : 8}`,
      subtext: "Pune strategic logistics nodes",
      icon: Warehouse,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "Trips Avoided",
      value: stats ? stats.simulated_trips_avoided.toLocaleString() : "471",
      subtext: "Simulated redundant runs cut",
      icon: TrendingDown,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
    },
    {
      title: "Distance Saved",
      value: `${stats ? stats.simulated_distance_saved_km.toLocaleString() : "1,601"} km`,
      subtext: "Consolidated vs independent",
      icon: Compass,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
    },
    {
      title: "Empty Returns Avoided",
      value: stats ? stats.empty_returns_avoided : 18,
      subtext: "Reverse logistics piggybacked",
      icon: RotateCcw,
      color: "text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/30",
    },
    {
      title: "Emissions Reduced",
      value: `${stats ? stats.simulated_co2_saved_kg : 296} kg`,
      subtext: "Simulated CO2 avoided",
      icon: Leaf,
      color: "text-emerald-300",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 w-full">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className={`p-3 rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:scale-[1.02] ${c.bg}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                {c.title}
              </span>
              <Icon className={`w-3.5 h-3.5 ${c.color}`} />
            </div>
            <div>
              <div className="text-lg font-bold text-white tracking-tight">
                {c.value}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                {c.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
