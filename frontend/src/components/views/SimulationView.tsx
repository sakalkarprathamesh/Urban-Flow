"use client";

import { useState } from "react";
import { SimulationResult } from "@/types";
import { fetchApi } from "@/lib/api";
import { 
  Sliders, 
  Play, 
  BarChart3, 
  Clock, 
  TrendingDown, 
  RefreshCw,
  Info
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
  // Input parameters (Item 16)
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

  useState(() => {
    handleRunSimulation();
  });

  const comparisonBarData = result ? [
    {
      metric: "Vehicle Trips",
      Conventional: result.conventional.trips,
      UrbanFlow: result.urban_flow.trips,
    },
    {
      metric: "Total Km (÷10)",
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
          <h1 className="text-xl font-bold text-[#202124] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#1a73e8]" />
            Logistics Network Simulation Center
          </h1>
          <p className="text-xs text-[#5f6368]">
            Comparative modeling: Conventional uncoordinated point-to-point dispatch vs Urban Flow shared coordination
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          <span>Run Simulation</span>
        </button>
      </div>

      {/* Control Panel (Item 16) */}
      <div className="google-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1a73e8]" />
            Simulation Control Parameters
          </h2>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#f1f3f4] text-[#5f6368] font-medium flex items-center gap-1">
            <Info className="w-3 h-3" />
            Simulation / Model Estimate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-xs">
          
          {/* Packages */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#3c4043]">
              <span className="font-medium">Packages Ingest:</span>
              <span className="font-mono font-bold text-[#1a73e8]">{packages.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="50"
              value={packages}
              onChange={(e) => setPackages(Number(e.target.value))}
              className="w-full accent-[#1a73e8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#80868b]">
              <span>200</span>
              <span>2,500 pkgs</span>
            </div>
          </div>

          {/* Vehicles */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#3c4043]">
              <span className="font-medium">Fleet Size:</span>
              <span className="font-mono font-bold text-[#188038]">{vehicles} units</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={vehicles}
              onChange={(e) => setVehicles(Number(e.target.value))}
              className="w-full accent-[#34a853] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#80868b]">
              <span>10</span>
              <span>100 vehicles</span>
            </div>
          </div>

          {/* Micro-Hubs */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#3c4043]">
              <span className="font-medium">Active Micro-Hubs:</span>
              <span className="font-mono font-bold text-[#1a73e8]">{hubs} hubs</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              step="1"
              value={hubs}
              onChange={(e) => setHubs(Number(e.target.value))}
              className="w-full accent-[#1a73e8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#80868b]">
              <span>3 hubs</span>
              <span>10 hubs</span>
            </div>
          </div>

          {/* Traffic Level */}
          <div className="space-y-1.5">
            <label className="block text-[#3c4043] font-medium">Pune Traffic Level:</label>
            <select
              value={traffic}
              onChange={(e) => setTraffic(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-2 text-xs text-[#202124] outline-none focus:border-[#1a73e8]"
            >
              <option value="Low">Low (Off-Peak)</option>
              <option value="Normal">Normal (Midday)</option>
              <option value="Heavy">Heavy (Peak Hours)</option>
              <option value="Gridlock">Gridlock (Monsoon)</option>
            </select>
          </div>

          {/* Demand Surge */}
          <div className="space-y-1.5">
            <label className="block text-[#3c4043] font-medium">Demand Increase:</label>
            <select
              value={demandMultiplier}
              onChange={(e) => setDemandMultiplier(Number(e.target.value))}
              className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-2 text-xs text-[#202124] outline-none focus:border-[#1a73e8]"
            >
              <option value={1.0}>Baseline (1.0x)</option>
              <option value={1.3}>Festival Surge (+30%)</option>
              <option value={1.6}>E-Commerce Mega Sale (+60%)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Side-by-Side Comparison (Item 16: Conventional vs Urban Flow) */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Conventional Model Card */}
            <div className="google-card p-6 bg-white border-[#f5c6cb] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
                <div>
                  <h3 className="text-base font-bold text-[#d93025]">CONVENTIONAL MODEL</h3>
                  <p className="text-xs text-[#5f6368]">Uncoordinated point-to-point deliveries</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#fce8e6] text-[#c5221f] font-semibold">
                  Siloed Dispersed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#e8eaed]">
                  <div className="text-[#5f6368]">Vehicle Trips:</div>
                  <div className="text-xl font-bold text-[#202124]">{result.conventional.trips.toLocaleString()}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#e8eaed]">
                  <div className="text-[#5f6368]">Total Distance:</div>
                  <div className="text-xl font-bold text-[#202124]">{result.conventional.total_distance_km.toLocaleString()} km</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#e8eaed]">
                  <div className="text-[#5f6368]">Average Utilization:</div>
                  <div className="text-xl font-bold text-[#d93025]">{result.conventional.avg_utilization_pct}%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#e8eaed]">
                  <div className="text-[#5f6368]">Empty Returns:</div>
                  <div className="text-xl font-bold text-[#d93025]">{result.conventional.empty_returns}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#e8eaed]">
                  <div className="text-[#5f6368]">Avg Delivery Time:</div>
                  <div className="text-xl font-bold text-[#202124]">{result.conventional.avg_delivery_time_min} min</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#e8eaed]">
                  <div className="text-[#5f6368]">Packages Consolidated:</div>
                  <div className="text-xl font-bold text-[#5f6368]">{result.conventional.packages_consolidated} pkgs</div>
                </div>
              </div>
            </div>

            {/* Urban Flow Model Card */}
            <div className="google-card p-6 bg-white border-[#ceead6] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
                <div>
                  <h3 className="text-base font-bold text-[#188038]">URBAN FLOW MODEL</h3>
                  <p className="text-xs text-[#5f6368]">Clustered micro-hubs + reverse logistics</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333] font-semibold">
                  Shared Layer
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#ceead6]">
                  <div className="text-[#5f6368]">Vehicle Trips:</div>
                  <div className="text-xl font-bold text-[#188038]">
                    {result.urban_flow.trips.toLocaleString()}
                    <span className="text-xs font-normal text-[#188038] ml-1.5">
                      (-{result.deltas.trips_avoided})
                    </span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#ceead6]">
                  <div className="text-[#5f6368]">Total Distance:</div>
                  <div className="text-xl font-bold text-[#188038]">
                    {result.urban_flow.total_distance_km.toLocaleString()} km
                    <span className="text-xs font-normal text-[#188038] ml-1.5">
                      (-{result.deltas.distance_saved_pct}%)
                    </span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#ceead6]">
                  <div className="text-[#5f6368]">Average Utilization:</div>
                  <div className="text-xl font-bold text-[#188038]">
                    {result.urban_flow.avg_utilization_pct}%
                    <span className="text-xs font-normal text-[#188038] ml-1.5">
                      (+{result.deltas.utilization_gain_pct}%)
                    </span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#ceead6]">
                  <div className="text-[#5f6368]">Empty Returns:</div>
                  <div className="text-xl font-bold text-[#188038]">
                    {result.urban_flow.empty_returns}
                    <span className="text-xs font-normal text-[#188038] ml-1.5">
                      (-{result.deltas.empty_returns_avoided})
                    </span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#ceead6]">
                  <div className="text-[#5f6368]">Avg Delivery Time:</div>
                  <div className="text-xl font-bold text-[#188038]">
                    {result.urban_flow.avg_delivery_time_min} min
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#ceead6]">
                  <div className="text-[#5f6368]">Packages Consolidated:</div>
                  <div className="text-xl font-bold text-[#188038]">
                    {result.urban_flow.packages_consolidated} pkgs
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Charts: Recharts Bar Chart & 24-Hour Area Chart in Google Colors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Comparative Bar Chart */}
            <div className="google-card p-5 bg-white space-y-3">
              <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1a73e8]" />
                Key Metric Comparison (Model Estimate)
              </h4>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" />
                    <XAxis dataKey="metric" stroke="#80868b" fontSize={11} />
                    <YAxis stroke="#80868b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#dadce0", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                    <Bar dataKey="Conventional" fill="#ea4335" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="UrbanFlow" fill="#1a73e8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hourly Trips Area Chart */}
            <div className="google-card p-5 bg-white space-y-3">
              <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#34a853]" />
                24-Hour Road Load Comparison (Pune City Roads)
              </h4>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.hourly_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" />
                    <XAxis dataKey="hour" stroke="#80868b" fontSize={10} interval={3} />
                    <YAxis stroke="#80868b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#dadce0", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="conventional_trips" stroke="#ea4335" fill="#ea4335" fillOpacity={0.15} name="Conventional Trips" />
                    <Area type="monotone" dataKey="urban_flow_trips" stroke="#34a853" fill="#34a853" fillOpacity={0.25} name="Urban Flow Trips" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Neighborhood Breakdown */}
          <div className="google-card p-5 bg-white">
            <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider mb-3">
              Simulated Savings by Pune Neighborhood Corridor
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {result.neighborhood_breakdown.map((n, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#f8fafd] border border-[#e8eaed]">
                  <div className="font-bold text-[#202124] mb-1">{n.name}</div>
                  <div className="text-[11px] text-[#5f6368]">{n.packages} deliveries</div>
                  <div className="text-[11px] text-[#188038] font-bold mt-1">
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
