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
  ShieldCheck,
  RotateCcw
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-semibold">
          <Package className="w-3.5 h-3.5" />
          <span>Customer Logistics Web Portal</span>
        </div>
        <h1 className="text-3xl font-bold text-[#202124]">
          Track Your Urban Flow Delivery
        </h1>
        <p className="text-xs text-[#5f6368] max-w-md mx-auto">
          Real-time package journey across Pune's consolidated micro-hub network
        </p>

        {/* Tracking Search Input */}
        <div className="max-w-md mx-auto pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex items-center gap-2 bg-white border border-[#dadce0] p-1.5 rounded-full shadow-md focus-within:border-[#1a73e8]"
          >
            <Search className="w-4 h-4 text-[#5f6368] ml-3" />
            <input
              type="text"
              value={trackCode}
              onChange={(e) => setTrackCode(e.target.value)}
              placeholder="Enter tracking code (e.g. UF-PKG-8001)"
              className="flex-1 bg-transparent text-[#202124] text-xs outline-none px-2 font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs transition-all"
            >
              Track
            </button>
          </form>
        </div>
      </div>

      {/* Package Timeline Card (Item 9) */}
      {packageInfo && (
        <div className="google-card p-6 bg-white space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e8eaed]">
            <div>
              <div className="text-xs font-mono text-[#1a73e8] font-bold">
                {packageInfo.tracking_code}
              </div>
              <h2 className="text-base font-bold text-[#202124] mt-0.5">To: {packageInfo.recipient}</h2>
              <p className="text-xs text-[#5f6368]">{packageInfo.destination}</p>
            </div>
            
            <div className="p-3 rounded-2xl bg-[#e6f4ea] border border-[#ceead6] text-right">
              <span className="text-[10px] text-[#137333] block uppercase tracking-wider font-bold">
                Environmental Savings
              </span>
              <span className="text-xs font-semibold text-[#188038] flex items-center justify-end gap-1 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-[#34a853]" />
                {packageInfo.consolidation_benefit}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e8eaed]">
            {packageInfo.timeline.map((step: any, idx: number) => {
              const isCompleted = step.status === "completed";
              const isActive = step.status === "active";

              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Step Bullet */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                      isCompleted
                        ? "bg-[#34a853] text-white"
                        : isActive
                        ? "bg-[#1a73e8] text-white ring-4 ring-[#e8f0fe]"
                        : "bg-white border border-[#dadce0] text-[#80868b]"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-semibold ${isActive ? "text-[#1a73e8]" : isCompleted ? "text-[#202124]" : "text-[#80868b]"}`}>
                        {step.name}
                      </h4>
                      <span className="text-[11px] text-[#80868b] font-mono">{step.time}</span>
                    </div>
                    <p className="text-xs text-[#5f6368] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Book New Delivery Simulation Box */}
      <div className="google-card p-6 bg-white space-y-4">
        <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#f29900]" />
          Book Customer Package (with Instant Micro-Hub Consolidation)
        </h3>

        <form onSubmit={handleBook} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[#5f6368] mb-1 font-medium">Pickup Point</label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-2.5 text-[#202124] outline-none focus:border-[#1a73e8] focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[#5f6368] mb-1 font-medium">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-2.5 text-[#202124] outline-none focus:border-[#1a73e8] focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[#5f6368] mb-1 font-medium">Weight (kg)</label>
            <input
              type="number"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-2.5 text-[#202124] outline-none focus:border-[#1a73e8] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3 flex items-center justify-between pt-2">
            <div className="text-[#137333] text-xs flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
              Consolidation Available: Eligible for shared EV Van route via Hub 02
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs shadow-xs transition-all"
            >
              {bookedSuccess ? "Booked & Consolidated!" : "Confirm Delivery Request"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
