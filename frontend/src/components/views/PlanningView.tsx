"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Building,
  Info
} from "lucide-react";

export default function PlanningView() {
  const [hubName, setHubName] = useState("Hub 09 — Wakad Commercial Point");
  const [area, setArea] = useState("Wakad");
  const [lat, setLat] = useState(18.5987);
  const [lng, setLng] = useState(73.7686);
  const [capacity, setCapacity] = useState(1200);

  const [loading, setLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  const candidateSites = [
    { name: "Wakad Junction Micro-Hub", area: "Wakad", lat: 18.5987, lng: 73.7686, desc: "Bypasses Hinjewadi-Baner arterial bottleneck" },
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
    <div className="space-y-5 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#202124] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#1a73e8]" />
          Plan the Network • Predictive Infrastructure Designer
        </h1>
        <p className="text-xs text-[#5f6368]">
          Simulate placing new micro-hubs in candidate urban zones to quantify vehicle distance and congestion reduction
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form Column */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Candidate Locations */}
          <div className="google-card p-5 bg-white space-y-3">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f29900]" />
              Recommended Candidate Sites (AI Density Analysis)
            </h3>
            <div className="space-y-2">
              {candidateSites.map((site, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSite(site)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    area === site.area
                      ? "bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]"
                      : "bg-[#f8fafd] border-[#e8eaed] text-[#3c4043] hover:border-[#dadce0]"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{site.name}</span>
                    <span className="text-[11px] text-[#5f6368] font-mono">[{site.lat}, {site.lng}]</span>
                  </div>
                  <div className="text-[11px] text-[#5f6368] mt-0.5">{site.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Proposal Customization Form */}
          <form onSubmit={handleEvaluateProposal} className="google-card p-5 bg-white space-y-3 text-xs">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              Proposed Micro-Hub Parameters
            </h3>
            
            <div>
              <label className="block text-[#5f6368] mb-1 font-medium">Facility Name</label>
              <input
                type="text"
                value={hubName}
                onChange={(e) => setHubName(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-2.5 text-[#202124] outline-none focus:border-[#1a73e8] focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[#5f6368] mb-1 font-medium">Target Zone</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-2.5 text-[#202124] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[#5f6368] mb-1 font-medium">Capacity (kg)</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-2.5 text-[#202124] outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono">
              <div>
                <label className="block text-[#5f6368] mb-1 font-sans font-medium">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-2 text-[#202124] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[#5f6368] mb-1 font-sans font-medium">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-2 text-[#202124] outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Simulate Network Impact</span>
            </button>
          </form>

        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7">
          {evalResult ? (
            <div className="google-card p-6 bg-white border-[#d2e3fc] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e8eaed]">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-bold">
                    PROPOSAL EVALUATION RESULT
                  </span>
                  <h2 className="text-base font-bold text-[#202124] mt-1">{evalResult.name}</h2>
                  <p className="text-xs text-[#5f6368]">Target Area: {evalResult.area}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-[#188038]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* 3 Impact Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#f8fafd] border border-[#e8eaed] text-center">
                  <div className="text-2xl font-bold text-[#1a73e8]">
                    -{evalResult.metrics.distance_saved_pct}%
                  </div>
                  <div className="text-xs font-semibold text-[#202124] mt-1">Delivery Distance</div>
                  <div className="text-[11px] text-[#5f6368]">Cut from last-mile transit</div>
                </div>

                <div className="p-4 rounded-xl bg-[#f8fafd] border border-[#e8eaed] text-center">
                  <div className="text-2xl font-bold text-[#34a853]">
                    -{evalResult.metrics.route_time_saved_pct}%
                  </div>
                  <div className="text-xs font-semibold text-[#202124] mt-1">Route Duration</div>
                  <div className="text-[11px] text-[#5f6368]">Turnaround acceleration</div>
                </div>

                <div className="p-4 rounded-xl bg-[#f8fafd] border border-[#e8eaed] text-center">
                  <div className="text-2xl font-bold text-[#b06000]">
                    -{evalResult.metrics.hub_congestion_reduction_pct}%
                  </div>
                  <div className="text-xs font-semibold text-[#202124] mt-1">Hub Congestion</div>
                  <div className="text-[11px] text-[#5f6368]">Adjacent hub load shedding</div>
                </div>
              </div>

              {/* Assessment */}
              <div className="p-4 rounded-xl bg-[#e8f0fe]/40 border border-[#d2e3fc] text-xs space-y-1 text-[#202124]">
                <span className="text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider block">
                  Network Engineering Assessment:
                </span>
                <p>{evalResult.recommendation}</p>
                <p className="text-[11px] text-[#188038] font-semibold pt-1">
                  Estimated annual carbon reduction: {evalResult.metrics.estimated_co2_avoided_tons_per_year} metric tons CO2.
                </p>
              </div>

            </div>
          ) : (
            <div className="google-card p-12 bg-white text-center space-y-3">
              <Building className="w-12 h-12 text-[#bdc1c6] mx-auto" />
              <h3 className="text-sm font-bold text-[#202124]">No Proposal Evaluated Yet</h3>
              <p className="text-xs text-[#5f6368] max-w-sm mx-auto">
                Select a candidate site on the left or enter custom coordinates in Pune to simulate how adding a micro-hub transforms city logistics efficiency.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
