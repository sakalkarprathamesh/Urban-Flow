"use client";

import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Warehouse, 
  Truck, 
  PieChart as PieIcon, 
  CheckCircle2, 
  Leaf,
  Layers
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AnalyticsView() {
  // Deliveries Over Time (24h)
  const hourlyTrends = [
    { time: "06:00", deliveries: 12, consolidated: 8 },
    { time: "08:00", deliveries: 65, consolidated: 48 },
    { time: "10:00", deliveries: 120, consolidated: 92 },
    { time: "12:00", deliveries: 95, consolidated: 72 },
    { time: "14:00", deliveries: 85, consolidated: 64 },
    { time: "16:00", deliveries: 130, consolidated: 102 },
    { time: "18:00", deliveries: 145, consolidated: 114 },
    { time: "20:00", deliveries: 80, consolidated: 60 },
    { time: "22:00", deliveries: 35, consolidated: 26 },
  ];

  // Micro-Hub Capacity Utilization
  const hubUtilization = [
    { name: "Shivajinagar", load: 74, max: 100 },
    { name: "Kothrud", load: 68, max: 100 },
    { name: "Hinjewadi", load: 82, max: 100 },
    { name: "Viman Nagar", load: 71, max: 100 },
    { name: "Hadapsar", load: 65, max: 100 },
    { name: "Kalyani Nagar", load: 58, max: 100 },
    { name: "Baner", load: 76, max: 100 },
    { name: "Swargate", load: 69, max: 100 },
  ];

  // Fleet Type Composition
  const fleetComposition = [
    { name: "EV Cargo Vans", value: 45, color: "#1a73e8" },
    { name: "Mini Trucks", value: 25, color: "#34a853" },
    { name: "Electric 3-Wheelers", value: 20, color: "#fbbc04" },
    { name: "Express 2-Wheelers", value: 10, color: "#ea4335" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#202124] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#1a73e8]" />
          City Logistics Analytics & Performance Trends
        </h1>
        <p className="text-xs text-[#5f6368]">
          Operational throughput, fleet efficiency curves, and consolidation dynamics across Pune urban zone
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="google-card p-5 bg-white space-y-1">
          <div className="text-xs text-[#5f6368] flex items-center justify-between">
            <span>Average Fleet Utilization</span>
            <Activity className="w-4 h-4 text-[#34a853]" />
          </div>
          <div className="text-2xl font-bold text-[#202124]">72.4%</div>
          <p className="text-[11px] text-[#188038] font-medium">+24.4% vs Uncoordinated Dispersal</p>
        </div>

        <div className="google-card p-5 bg-white space-y-1">
          <div className="text-xs text-[#5f6368] flex items-center justify-between">
            <span>Consolidation Rate</span>
            <TrendingUp className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div className="text-2xl font-bold text-[#1a73e8]">74.2%</div>
          <p className="text-[11px] text-[#5f6368]">918 of 1,240 packages grouped</p>
        </div>

        <div className="google-card p-5 bg-white space-y-1">
          <div className="text-xs text-[#5f6368] flex items-center justify-between">
            <span>Empty Return Rate</span>
            <Truck className="w-4 h-4 text-[#188038]" />
          </div>
          <div className="text-2xl font-bold text-[#188038]">11.4%</div>
          <p className="text-[11px] text-[#188038] font-medium">Down from 38% conventional baseline</p>
        </div>

        <div className="google-card p-5 bg-white space-y-1">
          <div className="text-xs text-[#5f6368] flex items-center justify-between">
            <span>Estimated Carbon Saved</span>
            <Leaf className="w-4 h-4 text-[#34a853]" />
          </div>
          <div className="text-2xl font-bold text-[#34a853]">296 kg / day</div>
          <p className="text-[11px] text-[#5f6368]">Via trips avoided & EV routing</p>
        </div>
      </div>

      {/* Chart Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Deliveries Over Time Line Chart */}
        <div className="google-card p-5 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              Deliveries Throughput Over Time (24h Trend)
            </h3>
            <span className="text-[11px] text-[#5f6368]">Peak: 18:00 IST</span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" />
                <XAxis dataKey="time" stroke="#80868b" fontSize={11} />
                <YAxis stroke="#80868b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#dadce0", borderRadius: "12px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Line type="monotone" dataKey="deliveries" stroke="#1a73e8" strokeWidth={2.5} name="Total Ingest" />
                <Line type="monotone" dataKey="consolidated" stroke="#34a853" strokeWidth={2} name="Consolidated Drops" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Micro-Hub Storage Load Bar Chart */}
        <div className="google-card p-5 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              Micro-Hub Capacity Utilization (%)
            </h3>
            <span className="text-[11px] text-[#5f6368]">Avg: 70.8%</span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hubUtilization} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" />
                <XAxis dataKey="name" stroke="#80868b" fontSize={10} interval={0} angle={-20} textAnchor="end" height={45} />
                <YAxis stroke="#80868b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#dadce0", borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="load" fill="#1a73e8" radius={[4, 4, 0, 0]} name="Capacity %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Fleet Mix & Route Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fleet Composition Pie Chart */}
        <div className="google-card p-5 bg-white space-y-3">
          <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
            Fleet Vehicle Distribution
          </h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={fleetComposition} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
                  {fleetComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#dadce0", borderRadius: "12px", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5f6368]">
            {fleetComposition.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }}></span>
                <span>{f.name} ({f.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Efficiency Summary */}
        <div className="lg:col-span-2 google-card p-5 bg-white space-y-4">
          <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
            Pune Urban Corridor Efficiency Summary
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { corridor: "Shivajinagar ➔ FC Road / Deccan", savings: "38.2%", distanceCut: "410 km", status: "Optimal" },
              { corridor: "Kothrud ➔ Karve Nagar Residential", savings: "35.6%", distanceCut: "380 km", status: "Optimal" },
              { corridor: "Hinjewadi Phase 1 ➔ IT Corridor", savings: "44.1%", distanceCut: "520 km", status: "Highest Gain" },
              { corridor: "Viman Nagar ➔ Kalyani Nagar Airport Corridor", savings: "32.8%", distanceCut: "291 km", status: "Optimal" },
            ].map((c, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#f8fafd] border border-[#e8eaed] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#202124]">{c.corridor}</div>
                  <div className="text-[11px] text-[#5f6368] mt-0.5">Saved {c.distanceCut} vehicle-kilometers</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#188038]">-{c.savings}</span>
                  <div className="text-[10px] text-[#1a73e8] font-medium">{c.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
