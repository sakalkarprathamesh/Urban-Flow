"use client";

import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Warehouse, 
  Truck, 
  CheckCircle2, 
  Leaf,
  Layers,
  Clock,
  Gauge,
  RotateCcw
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

export default function AnalyticsView() {
  // Hourly Vehicle Utilization & Consolidation Trend
  const hourlyEfficiency = [
    { time: "08:00", utilization: 52, consolidation: 60, emptyRate: 35 },
    { time: "10:00", utilization: 72, consolidation: 74, emptyRate: 18 },
    { time: "12:00", utilization: 78, consolidation: 79, emptyRate: 14 },
    { time: "14:00", utilization: 68, consolidation: 71, emptyRate: 20 },
    { time: "16:00", utilization: 82, consolidation: 84, emptyRate: 11 },
    { time: "18:00", utilization: 85, consolidation: 86, emptyRate: 9 },
    { time: "20:00", utilization: 64, consolidation: 68, emptyRate: 22 },
  ];

  // 8 Pune Micro-Hub Capacity Utilization
  const hubUtilization = [
    { name: "Shivajinagar", load: 74 },
    { name: "Kothrud", load: 68 },
    { name: "Hinjewadi", load: 82 },
    { name: "Viman Nagar", load: 71 },
    { name: "Hadapsar", load: 65 },
    { name: "Kalyani Nagar", load: 58 },
    { name: "Baner", load: 76 },
    { name: "Swargate", load: 69 },
  ];

  // Corridor Routing Efficiency
  const corridorMetrics = [
    { corridor: "Shivajinagar ➔ Deccan", density: "High", stopsPerKm: 2.8, energySaved: "34%", status: "Optimal" },
    { corridor: "Hinjewadi Phase 1-3", density: "Very High", stopsPerKm: 3.2, energySaved: "41%", status: "Optimal" },
    { corridor: "Kothrud ➔ Karve Road", density: "Medium", stopsPerKm: 2.1, energySaved: "28%", status: "Balanced" },
    { corridor: "Viman Nagar ➔ KP", density: "High", stopsPerKm: 2.6, energySaved: "36%", status: "Optimal" },
    { corridor: "Hadapsar ➔ Magarpatta", density: "Medium", stopsPerKm: 1.9, energySaved: "24%", status: "Balanced" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#0f172a] tracking-tight">
              City Logistics Analytics & Performance
            </h1>
            <span className="uf-badge uf-badge-neutral font-mono text-[11px]">
              Continuous Telemetry
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Empirical efficiency curves, capacity dynamics, and empty return mitigation metrics across Pune.
          </p>
        </div>
      </div>

      {/* 4 Core Prioritized KPI Cards (Section 17) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Utilization</span>
            <Gauge className="w-4 h-4 text-[#1e3a8a]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            74.2%
          </div>
          <div className="text-xs text-[#065f46] font-medium mt-1">
            +33% vs conventional point-to-point
          </div>
        </div>

        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Consolidation Rate</span>
            <Layers className="w-4 h-4 text-[#2563eb]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            74.2%
          </div>
          <div className="text-xs text-[#64748b] mt-1">
            Packages grouped into micro-hubs
          </div>
        </div>

        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Delivery Time</span>
            <Clock className="w-4 h-4 text-[#0284c7]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            24.5 min
          </div>
          <div className="text-xs text-[#065f46] font-medium mt-1">
            -14.2 min faster last-mile cycle
          </div>
        </div>

        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Empty Return Rate</span>
            <RotateCcw className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            14.0%
          </div>
          <div className="text-xs text-[#065f46] font-medium mt-1">
            Down from 88% via reverse matching
          </div>
        </div>

      </div>

      {/* Section 1 & Section 2: Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Fleet Utilization & Empty Return Rate Curve */}
        <div className="uf-card p-5 space-y-4">
          <div>
            <div className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
              Fleet Utilization vs Empty Return Rate
            </div>
            <p className="text-[11px] text-[#64748b]">
              Hourly progression during active operating shifts
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyEfficiency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#ffffff", 
                    borderColor: "#e2e8f0", 
                    borderRadius: "8px", 
                    fontSize: "11px" 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line type="monotone" dataKey="utilization" name="Vehicle Utilization (%)" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="emptyRate" name="Empty Return Rate (%)" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Micro-Hub Utilization (Horizontal Bar) */}
        <div className="uf-card p-5 space-y-4">
          <div>
            <div className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
              Micro-Hub Facility Load Factors
            </div>
            <p className="text-[11px] text-[#64748b]">
              Current storage occupancy across 8 Pune neighborhood hubs
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hubUtilization} layout="vertical" margin={{ top: 5, right: 10, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#ffffff", 
                    borderColor: "#e2e8f0", 
                    borderRadius: "8px", 
                    fontSize: "11px" 
                  }} 
                />
                <Bar dataKey="load" name="Capacity Load (%)" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Section 3: Corridor Routing Efficiency Table */}
      <div className="uf-card overflow-hidden">
        <div className="p-4 border-b border-[#e2e8f0]">
          <h2 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
            Corridor Route Efficiency Breakdown
          </h2>
          <p className="text-[11px] text-[#64748b]">
            Spatial density and trip consolidation index per Pune arterial corridor
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-medium text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Logistics Corridor</th>
                <th className="py-3 px-4">Delivery Density</th>
                <th className="py-3 px-4">Stops per Km</th>
                <th className="py-3 px-4">Energy / Carbon Saved</th>
                <th className="py-3 px-4 text-right">Routing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {corridorMetrics.map((c) => (
                <tr key={c.corridor} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#0f172a]">
                    {c.corridor}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">
                    {c.density}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#1e40af]">
                    {c.stopsPerKm} stops/km
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#065f46] font-medium">
                    {c.energySaved}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="uf-badge uf-badge-success text-[10px]">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
