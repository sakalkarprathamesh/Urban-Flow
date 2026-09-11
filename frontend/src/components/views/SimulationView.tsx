"use client";

import { useState } from "react";
import { SimulationResult } from "@/types";
import { fetchApi } from "@/lib/api";
import { 
  Sliders, 
  Play, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  Truck, 
  Compass, 
  RotateCcw, 
  Zap, 
  Clock, 
  Leaf,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export default function SimulationView() {
  // Input parameters
  const [packages, setPackages] = useState(1000);
  const [vehicles, setVehicles] = useState(50);
  const [hubs, setHubs] = useState(5);
  const [traffic, setTraffic] = useState("Normal");
  const [demandMultiplier, setDemandMultiplier] = useState(1.0);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<SimulationResult>("/api/simulation/run", {
        method: "POST",
        body: JSON.stringify({
          package_count: packages,
          vehicle_count: vehicles,
          hub_count: hubs,
          traffic_level: traffic,
          demand_multiplier: demandMultiplier
        })
      });
      setResult(data);
    } catch (e) {
      console.error("Simulation run failed:", e);
    } finally {
      setLoading(false);
    }
  };

  // Run initial simulation on load if none exists
  useState(() => {
    handleRunSimulation();
  });

  // Prepare chart comparison data
  const comparisonBarData = result ? [
    {
      metric: "Vehicle Trips",
      Conventional: result.conventional.trips,
      UrbanFlow: result.urban_flow.trips,
    },
    {
      metric: "Total Km (x10)",
      Conventional: Math.round(result.conventional.total_distance_km / 10),
      UrbanFlow: Math.round(result.urban_flow.total_distance_km / 10),
    },
    {
      metric: "Empty Returns",
      Conventional: result.conventional.empty_returns,
      UrbanFlow: result.urban_flow.empty_returns,
    },
    {
      metric: "Avg Time (min)",
      Conventional: Math.round(result.conventional.avg_delivery_time_min),
      UrbanFlow: Math.round(result.urban_flow.avg_delivery_time_min),
    }
  ] : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Urban Logistics Simulation Center
          </h1>
          <p className="text-xs text-slate-400">
            Comparative evaluation of Conventional Dispersed Delivery vs Urban Flow Consolidated Coordination
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-bold shadow-xl shadow-amber-500/20 transition-all transform hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          RUN SIMULATION
        </button>
      </div>

      {/* Control Sliders Panel */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Simulation Control Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-xs">
          
          {/* Packages Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Packages Ingest:</span>
              <span className="font-mono font-bold text-cyan-400">{packages.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="50"
              value={packages}
              onChange={(e) => setPackages(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>200</span>
              <span>2,500</span>
            </div>
          </div>

          {/* Vehicles Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Vehicle Fleet:</span>
              <span className="font-mono font-bold text-emerald-400">{vehicles}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={vehicles}
              onChange={(e) => setVehicles(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10</span>
              <span>100</span>
            </div>
          </div>

          {/* Micro-Hubs Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Micro-Hubs:</span>
              <span className="font-mono font-bold text-indigo-400">{hubs}</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              step="1"
              value={hubs}
              onChange={(e) => setHubs(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>3 hubs</span>
              <span>10 hubs</span>
            </div>
          </div>

          {/* Traffic Congestion Select */}
          <div className="space-y-2">
            <label className="block text-slate-300">Pune Traffic Condition:</label>
            <select
              value={traffic}
              onChange={(e) => setTraffic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none focus:border-amber-500"
            >
              <option value="Low">Low (Off-Peak)</option>
              <option value="Normal">Normal (Midday)</option>
              <option value="Heavy">Heavy (Peak Hours)</option>
              <option value="Gridlock">Gridlock (Monsoon / Roadwork)</option>
            </select>
          </div>

          {/* Demand Multiplier */}
          <div className="space-y-2">
            <label className="block text-slate-300">Demand Stress Test:</label>
            <select
              value={demandMultiplier}
              onChange={(e) => setDemandMultiplier(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none focus:border-rose-500"
            >
              <option value={1.0}>Baseline Demand (1.0x)</option>
              <option value={1.3}>Festival Surge (+30%)</option>
              <option value={1.6}>E-Commerce Mega Sale (+60%)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Before vs After Side-by-Side Comparison (Section 19) */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Conventional Model Card */}
            <div className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-950/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-red-500/20">
                <div>
                  <h3 className="text-base font-bold text-red-400">Conventional Logistics Model</h3>
                  <p className="text-xs text-slate-400">Direct point-to-point uncoordinated delivery</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-red-500/20 text-red-300 font-bold">
                  Siloed Dispersed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Vehicle Trips:</div>
                  <div className="text-xl font-black text-white">{result.conventional.trips.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Total Distance:</div>
                  <div className="text-xl font-black text-white">{result.conventional.total_distance_km.toLocaleString()} km</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Average Utilization:</div>
                  <div className="text-xl font-black text-red-400">{result.conventional.avg_utilization_pct}%</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Empty Return Trips:</div>
                  <div className="text-xl font-black text-red-400">{result.conventional.empty_returns}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Avg Delivery Time:</div>
                  <div className="text-xl font-black text-white">{result.conventional.avg_delivery_time_min} min</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">CO2 Emissions:</div>
                  <div className="text-xl font-black text-slate-300">{result.conventional.co2_emissions_kg} kg</div>
                </div>
              </div>
            </div>

            {/* Urban Flow Model Card */}
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div>
                  <h3 className="text-base font-bold text-emerald-400">Urban Flow Coordination Model</h3>
                  <p className="text-xs text-slate-400">Clustered micro-hubs + reverse logistics</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Shared Layer
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Vehicle Trips:</div>
                  <div className="text-xl font-black text-emerald-400">
                    {result.urban_flow.trips.toLocaleString()}
                    <span className="text-xs font-normal text-emerald-300 ml-1.5">
                      (-{result.deltas.trips_avoided})
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Total Distance:</div>
                  <div className="text-xl font-black text-emerald-400">
                    {result.urban_flow.total_distance_km.toLocaleString()} km
                    <span className="text-xs font-normal text-emerald-300 ml-1.5">
                      (-{result.deltas.distance_saved_pct}%)
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Average Utilization:</div>
                  <div className="text-xl font-black text-emerald-400">
                    {result.urban_flow.avg_utilization_pct}%
                    <span className="text-xs font-normal text-emerald-300 ml-1.5">
                      (+{result.deltas.utilization_gain_pct}%)
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Empty Return Trips:</div>
                  <div className="text-xl font-black text-emerald-400">
                    {result.urban_flow.empty_returns}
                    <span className="text-xs font-normal text-emerald-300 ml-1.5">
                      (-{result.deltas.empty_returns_avoided})
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Avg Delivery Time:</div>
                  <div className="text-xl font-black text-emerald-400">
                    {result.urban_flow.avg_delivery_time_min} min
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">CO2 Emissions Saved:</div>
                  <div className="text-xl font-black text-emerald-300">
                    {result.deltas.co2_saved_kg} kg avoided
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Charts: Recharts Comparison BarChart and Hourly Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Comparative Bar Chart */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Conventional vs Urban Flow Core Metrics
              </h4>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                    <Bar dataKey="Conventional" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="UrbanFlow" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 24-Hour Trips Distribution Area Chart */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                24-Hour Road Load Comparison (Vehicle Trips on Pune Roads)
              </h4>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.hourly_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} interval={3} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="conventional_trips" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} name="Conventional Trips" />
                    <Area type="monotone" dataKey="urban_flow_trips" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Urban Flow Trips" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Neighborhood Breakdown Table */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Simulated Savings by Pune Urban Corridor
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {result.neighborhood_breakdown.map((n, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="font-bold text-white mb-1">{n.name}</div>
                  <div className="text-[11px] text-slate-400">{n.packages} deliveries</div>
                  <div className="text-[11px] text-emerald-400 font-bold mt-1">
                    -{n.saved_km} km saved
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
