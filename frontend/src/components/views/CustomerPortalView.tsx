"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { 
  Package, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Warehouse, 
  Zap, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function CustomerPortalView() {
  const [trackCode, setTrackCode] = useState("UF-PKG-8001");
  const [packageInfo, setPackageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Quick book delivery demo
  const [pickup, setPickup] = useState("Kothrud Depot");
  const [destination, setDestination] = useState("Viman Nagar Market");
  const [weight, setWeight] = useState(2.0);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const handleTrack = async (codeToSearch?: string) => {
    const code = codeToSearch || trackCode;
    if (!code.trim()) return;
    setLoading(true);
    try {
      const data = await fetchApi(`/api/deliveries/track/${code.trim()}`);
      setPackageInfo(data);
    } catch (e) {
      alert("Package code not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleTrack("UF-PKG-8001");
  }, []);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      handleTrack("UF-PKG-8001");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      
      {/* Search Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Package className="w-6 h-6 text-cyan-400" />
          Customer Logistics & Live Tracking Portal
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Track packages moving through Pune's consolidated micro-hub network with transparent environmental savings
        </p>

        {/* Tracking Search Input */}
        <div className="max-w-md mx-auto pt-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 p-1.5 rounded-xl shadow-lg"
          >
            <Search className="w-4 h-4 text-slate-500 ml-2" />
            <input
              type="text"
              value={trackCode}
              onChange={(e) => setTrackCode(e.target.value)}
              placeholder="Enter tracking code (e.g. UF-PKG-8001)"
              className="flex-1 bg-transparent text-white text-xs outline-none px-2 font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
            >
              Track
            </button>
          </form>
        </div>
      </div>

      {/* Package Tracking Progress Timeline */}
      {packageInfo && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 font-bold">
                {packageInfo.tracking_code}
              </div>
              <h2 className="text-base font-bold text-white">To: {packageInfo.recipient}</h2>
              <p className="text-xs text-slate-400">{packageInfo.destination}</p>
            </div>
            
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-right">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                Consolidation Benefit
              </span>
              <span className="text-xs font-bold text-cyan-300 flex items-center justify-end gap-1 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                {packageInfo.consolidation_benefit}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {packageInfo.timeline.map((step: any, idx: number) => {
              const isCompleted = step.status === "completed";
              const isActive = step.status === "active";

              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Step Bullet */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                      isCompleted
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                        : isActive
                        ? "bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20 animate-pulse"
                        : "bg-slate-900 border border-slate-700 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold ${isActive ? "text-cyan-300" : isCompleted ? "text-white" : "text-slate-500"}`}>
                        {step.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">{step.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Book New Delivery Simulation Box (Section 22) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Simulate Customer Delivery Booking (with Instant Consolidation Quote)
        </h3>

        <form onSubmit={handleBook} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Pickup Point</label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-3 flex items-center justify-between pt-2">
            <div className="text-emerald-400 text-xs flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Consolidation Available: Eligible for shared EV Van route via Hub 02
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              {bookedSuccess ? "Booked & Consolidated!" : "Confirm Delivery Request"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
