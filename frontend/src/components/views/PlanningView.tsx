"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { 
  Compass, 
  Plus, 
  MapPin, 
  TrendingDown, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw,
  Building,
  ArrowRight
} from "lucide-react";

export default function PlanningView() {
  const [hubName, setHubName] = useState("Hub 09 — Wakad Commercial Point");
  const [area, setArea] = useState("Wakad");
  const [lat, setLat] = useState(18.5987);
  const [lng, setLng] = useState(73.7686);
  const [capacity, setCapacity] = useState(1200);

  const [loading, setLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  // Candidate suggested sites across Pune
  const candidateSites = [
    { name: "Wakad Junction Micro-Hub", area: "Wakad", lat: 18.5987, lng: 73.7686, desc: "Bypasses Hinjewadi-Baner bottleneck" },
    { name: "Magarpatta Cybercity Hub", area: "Magarpatta", lat: 18.5158, lng: 73.9272, desc: "Relieves Hadapsar urban depot overload" },
    { name: "Pune Railway Cargo Terminal", area: "Station", lat: 18.5284, lng: 73.8739, desc: "Intermodal rail-to-road hub connection" },
    { name: "Katraj South Consolidation Point", area: "Katraj", lat: 18.4550, lng: 73.8670, desc: "Covers southern highway delivery influx" }
  ];

  const handleSelectSite = (site: typeof candidateSites[0]) => {
    setHubName(site.name);
    setArea(site.area);
    setLat(site.lat);
    setLng(site.lng);
  };

  const handleEvaluateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchApi("/api/planning/evaluate-hub", {
        method: "POST",
        body: JSON.stringify({
          name: hubName,
          area: area,
          lat: Number(lat),
          lng: Number(lng),
          estimated_capacity_kg: Number(capacity)
        })
      });
      setEvalResult(data);
    } catch (e) {
      alert("Failed to evaluate network expansion proposal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-400" />
          Plan the Network — Predictive Infrastructure Designer
        </h1>
        <p className="text-xs text-slate-400">
          Simulate placing new micro-hubs in candidate urban zones to assess system-wide vehicle distance and congestion reduction
        </p>
      </div>

      {/* Main Grid: Form / Candidate Selector (Left) & Impact Simulation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form & Candidates */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Candidate Locations */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Recommended Candidate Sites (AI Density Analysis)
            </h3>
            <div className="space-y-2">
              {candidateSites.map((site, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSite(site)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    area === site.area
                      ? "bg-indigo-950/60 border-indigo-500/60 text-white"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{site.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">[{site.lat}, {site.lng}]</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{site.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Proposal Customization Form */}
          <form onSubmit={handleEvaluateProposal} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Proposed Micro-Hub Parameters
            </h3>
            
            <div>
              <label className="block text-slate-400 mb-1">Hub Facility Name</label>
              <input
                type="text"
                value={hubName}
                onChange={(e) => setHubName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Target Urban Zone</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Storage Capacity (kg)</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono">
              <div>
                <label className="block text-slate-400 mb-1 font-sans">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-sans">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Simulate Network Impact
            </button>
          </form>

        </div>

        {/* Right Column: Impact Output Display */}
        <div className="lg:col-span-7">
          {evalResult ? (
            <div className="glass-panel p-6 rounded-xl border border-indigo-500/40 bg-indigo-950/10 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                    PROPOSAL EVALUATION RESULT
                  </span>
                  <h2 className="text-base font-bold text-white mt-1">{evalResult.name}</h2>
                  <p className="text-xs text-slate-400">Target Area: {evalResult.area}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* Impact Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-cyan-400">
                    -{evalResult.metrics.distance_saved_pct}%
                  </div>
                  <div className="text-xs font-bold text-white mt-1">Delivery Distance</div>
                  <div className="text-[10px] text-slate-400">Cut from last-mile transit</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-emerald-400">
                    -{evalResult.metrics.route_time_saved_pct}%
                  </div>
                  <div className="text-xs font-bold text-white mt-1">Average Route Time</div>
                  <div className="text-[10px] text-slate-400">Accelerated delivery turnaround</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-amber-400">
                    -{evalResult.metrics.hub_congestion_reduction_pct}%
                  </div>
                  <div className="text-xs font-bold text-white mt-1">Hub Congestion</div>
                  <div className="text-[10px] text-slate-400">Decoupled line-haul loads</div>
                </div>
              </div>

              {/* Strategic AI Recommendation */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-500/20 text-xs space-y-1 text-slate-200">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Network Engineering Assessment:
                </span>
                <p>{evalResult.recommendation}</p>
                <p className="text-[11px] text-emerald-400 font-semibold pt-1">
                  Estimated annual carbon reduction: {evalResult.metrics.estimated_co2_avoided_tons_per_year} metric tons CO2.
                </p>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-xl border border-slate-800 text-center space-y-3">
              <Building className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No Proposal Evaluated Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a candidate site on the left or enter custom coordinates in Pune to simulate how a new micro-hub transforms city logistics efficiency.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
