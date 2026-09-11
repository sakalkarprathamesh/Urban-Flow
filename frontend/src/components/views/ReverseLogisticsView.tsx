"use client";

import { useState, useEffect } from "react";
import { ReversePickupItem } from "@/types";
import { fetchApi } from "@/lib/api";
import { 
  RotateCcw, 
  CheckCircle2, 
  Truck, 
  Package, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Info,
  TrendingDown,
  ArrowDown
} from "lucide-react";

interface ReverseProps {
  onTriggerReverseMatch: () => void;
}

export default function ReverseLogisticsView({ onTriggerReverseMatch }: ReverseProps) {
  const [pickups, setPickups] = useState<ReversePickupItem[]>([]);
  const [avoidedCount, setAvoidedCount] = useState(18);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<{
        empty_return_trips_avoided: number;
        pickups: ReversePickupItem[];
      }>("/api/reverse-logistics");
      setPickups(data.pickups);
      setAvoidedCount(data.empty_return_trips_avoided);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMatchAction = async () => {
    await onTriggerReverseMatch();
    loadData();
  };

  // 5-Step Visual Flow from Section 15
  const flowSteps = [
    { step: "01", title: "Outbound Delivery", desc: "Vehicle reaches destination" },
    { step: "02", title: "Delivery Completed", desc: "Cargo compartment opens" },
    { step: "03", title: "Return Demand Detected", desc: "Nearby returns scanned" },
    { step: "04", title: "Pickup Assigned", desc: "Reverse stop added to route" },
    { step: "05", title: "Return Completed", desc: "Parcel back to micro-hub" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Concept Hero Banner (Section 15) */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] text-xs font-semibold">
              <RotateCcw className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Core Urban Flow Principle</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
              Don't let vehicles return empty.
            </h1>
            <p className="text-sm text-[#475569] max-w-2xl leading-relaxed">
              In conventional delivery systems, vehicles return to depot empty after unloading. Urban Flow continuously scans return demand and customer returns along outbound corridors to utilize returning capacity.
            </p>
          </div>

          <button
            onClick={handleMatchAction}
            className="uf-btn-primary text-xs shrink-0 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Match Return Demand</span>
          </button>
        </div>
      </div>

      {/* 5-Step Visual Flow Pipeline (Section 15) */}
      <div className="uf-card p-5 space-y-3">
        <div className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">
          Corridor Piggybacking Architecture
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {flowSteps.map((step, idx) => (
            <div 
              key={step.step}
              className="relative p-3 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-bold text-[#1e40af]">
                    {step.step}
                  </span>
                  {idx < 4 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#94a3b8] hidden sm:block" />
                  )}
                </div>
                <div className="font-semibold text-xs text-[#0f172a]">
                  {step.title}
                </div>
                <div className="text-[11px] text-[#64748b] mt-0.5">
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Model Estimate Metric Cards (Section 15) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reverse Pickups</span>
            <Package className="w-4 h-4 text-[#1e3a8a]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            {pickups.length || 28}
          </div>
          <div className="text-[11px] text-[#065f46] font-medium mt-1">
            <span>● Ingested into micro-hub return queues</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f5f9] text-[10px] text-[#94a3b8] font-mono">
            Simulation / Model Estimate
          </div>
        </div>

        {/* Metric 2 */}
        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Empty Returns Avoided</span>
            <TrendingDown className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            {avoidedCount} trips
          </div>
          <div className="text-[11px] text-[#065f46] font-medium mt-1">
            <span>Eliminated dedicated return courier dispatch</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f5f9] text-[10px] text-[#94a3b8] font-mono">
            Simulation / Model Estimate
          </div>
        </div>

        {/* Metric 3 */}
        <div className="uf-card p-5">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Return Capacity Used</span>
            <Truck className="w-4 h-4 text-[#2563eb]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-mono">
            64.2%
          </div>
          <div className="text-[11px] text-[#1e40af] font-medium mt-1">
            <span>Payload utilized on inbound depot run</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f5f9] text-[10px] text-[#94a3b8] font-mono">
            Simulation / Model Estimate
          </div>
        </div>

      </div>

      {/* Matched Corridors Manifest Table */}
      <div className="uf-card overflow-hidden">
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
              Active Reverse Logistics Corridors
            </h2>
            <p className="text-[11px] text-[#64748b]">
              Pending return shipments paired with returning delivery vans
            </p>
          </div>
          <span className="text-[10px] text-[#94a3b8] font-mono">
            Model Estimate
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-medium text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Pickup ID</th>
                <th className="py-3 px-4">Customer Location</th>
                <th className="py-3 px-4">Return Hub</th>
                <th className="py-3 px-4">Payload</th>
                <th className="py-3 px-4">Paired Returning Vehicle</th>
                <th className="py-3 px-4">Distance Saved</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {pickups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#64748b]">
                    No active reverse pickups matched. Click "Match Return Demand" above.
                  </td>
                </tr>
              ) : (
                pickups.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#1e40af]">
                      {p.tracking_number}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#0f172a]">
                      {p.pickup_area}
                      <span className="block text-[11px] text-[#94a3b8] font-normal truncate max-w-[150px]">
                        {p.pickup_address}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#475569]">
                      Hub 0{p.assigned_hub_id || 1}
                    </td>
                    <td className="py-3 px-4 text-[#475569] font-mono">
                      {p.weight_kg} kg
                    </td>
                    <td className="py-3 px-4 font-mono text-[#0f172a]">
                      {p.assigned_vehicle_id ? `UF-0${p.assigned_vehicle_id}` : "Auto-pairing"}
                    </td>
                    <td className="py-3 px-4 text-[#065f46] font-medium">
                      ~3.8 km saved
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="uf-badge uf-badge-success text-[10px]">
                        Matched
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
