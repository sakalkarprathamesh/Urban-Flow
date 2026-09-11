"use client";

import { useState, useEffect } from "react";
import { ReversePickupItem } from "@/types";
import { fetchApi } from "@/lib/api";
import { RotateCcw, CheckCircle2, Truck, Package, ArrowRight, Sparkles, TrendingUp, Info } from "lucide-react";

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#202124] flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#188038]" />
            Reverse Logistics Coordination
          </h1>
          <p className="text-xs text-[#5f6368]">
            Synchronizing return packages and customer pickups with active returning delivery vehicles
          </p>
        </div>

        <button
          onClick={handleMatchAction}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Execute Reverse Matcher</span>
        </button>
      </div>

      {/* Core Concept Banner (Item 15) */}
      <div className="bg-[#e6f4ea] border border-[#ceead6] rounded-2xl p-6 text-center space-y-3">
        <span className="text-xs font-bold text-[#188038] uppercase tracking-wider">
          Urban Flow Core Principle
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#137333]">
          “Don't let vehicles return empty.”
        </h2>
        <p className="text-sm text-[#3c4043] max-w-xl mx-auto">
          When a vehicle completes its primary deliveries in a neighborhood, Urban Flow identifies eligible returns in that corridor and inserts reverse pickup waypoints before returning to the micro-hub.
        </p>

        {/* 5-Step Visual Progression (Item 15) */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-3 max-w-3xl mx-auto text-xs text-[#202124]">
          <div className="p-3 bg-white rounded-xl border border-[#ceead6] font-medium">
            1. Delivery completed
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#ceead6] font-medium">
            2. Return demand detected
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#ceead6] font-medium">
            3. Vehicle assigned
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#ceead6] font-medium">
            4. Pickup completed
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#ceead6] font-medium">
            5. Return to hub
          </div>
        </div>
      </div>

      {/* Simulated Metrics (Item 15 - Clearly Labeled) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="google-card p-5 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5f6368]">
            <span>Return Pickups</span>
            <span className="text-[10px] bg-[#f1f3f4] text-[#5f6368] px-2 py-0.5 rounded-full font-medium">Model Estimate</span>
          </div>
          <div className="text-2xl font-bold text-[#202124]">{pickups.length} Registered</div>
          <p className="text-[11px] text-[#5f6368]">Customer exchanges and merchant returns queued</p>
        </div>

        <div className="google-card p-5 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5f6368]">
            <span>Empty Trips Avoided</span>
            <span className="text-[10px] bg-[#f1f3f4] text-[#5f6368] px-2 py-0.5 rounded-full font-medium">Simulated</span>
          </div>
          <div className="text-2xl font-bold text-[#188038]">{avoidedCount} Avoided</div>
          <p className="text-[11px] text-[#5f6368]">Vehicles returned carrying return cargo instead of empty</p>
        </div>

        <div className="google-card p-5 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5f6368]">
            <span>Reverse Capacity Used</span>
            <span className="text-[10px] bg-[#f1f3f4] text-[#5f6368] px-2 py-0.5 rounded-full font-medium">Model Estimate</span>
          </div>
          <div className="text-2xl font-bold text-[#1a73e8]">34.8% Capacity</div>
          <p className="text-[11px] text-[#5f6368]">Vehicle load volume monetized during return transit</p>
        </div>

      </div>

      {/* Reverse Pickups Data Table */}
      <div className="google-card overflow-hidden bg-white">
        <div className="p-4 border-b border-[#e8eaed] flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
            Active Reverse Pickups Queue
          </h3>
          <span className="text-xs text-[#5f6368]">{pickups.length} Pickups Managed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafd] text-[#5f6368] uppercase tracking-wider font-semibold text-[11px] border-b border-[#e8eaed]">
              <tr>
                <th className="py-3 px-4">Item & Description</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Neighborhood</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Assigned Vehicle</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Destination Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4] text-[#3c4043]">
              {pickups.map((rp) => (
                <tr key={rp.id} className="hover:bg-[#f8fafd] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#202124] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#34a853]"></span>
                    {rp.item}
                  </td>
                  <td className="py-3.5 px-4 text-[#202124]">
                    {rp.customer}
                  </td>
                  <td className="py-3.5 px-4 text-[#5f6368]">
                    {rp.area}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#5f6368]">
                    {rp.weight_kg || 1.5} kg
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#1a73e8]">
                    {rp.vehicle_code || "UF-V001 (En Route)"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#e6f4ea] text-[#137333]">
                      {rp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#5f6368]">
                    Shivajinagar Central Depot
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
