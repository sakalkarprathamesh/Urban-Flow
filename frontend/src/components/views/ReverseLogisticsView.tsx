"use client";

import { useState, useEffect } from "react";
import { ReversePickupItem } from "@/types";
import { fetchApi } from "@/lib/api";
import { RotateCcw, CheckCircle2, Truck, Package, ArrowRight, Sparkles, TrendingUp } from "lucide-react";

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
      
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-teal-400" />
            Reverse Logistics & Empty Return Optimization
          </h1>
          <p className="text-xs text-slate-400">
            Intelligently pairs returning vehicles with customer returns and merchant pickups to eliminate empty legs
          </p>
        </div>

        <button
          onClick={handleMatchAction}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-bold shadow-lg shadow-teal-500/20 transition-all transform hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          Run Reverse Logistics Matcher
        </button>
      </div>

      {/* KPI Highlight Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-teal-500/30 bg-teal-950/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <RotateCcw className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{avoidedCount}</div>
            <div className="text-xs font-bold text-teal-400">Empty Return Trips Avoided</div>
            <div className="text-[11px] text-slate-400">Vehicles returned carrying reverse cargo</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">~340 km</div>
            <div className="text-xs font-bold text-cyan-400">Deadhead Distance Saved</div>
            <div className="text-[11px] text-slate-400">Avoided zero-load transit in Pune</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">+18.4%</div>
            <div className="text-xs font-bold text-emerald-400">Return Leg Fleet Efficiency</div>
            <div className="text-[11px] text-slate-400">Capacity monetized during depot return</div>
          </div>
        </div>
      </div>

      {/* Reverse Pickups Table */}
      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Piggybacked Return Pickups Queue
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            {pickups.length} Registered reverse opportunities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Item & Description</th>
                <th className="py-3 px-4">Customer & Area</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Matched Delivery Vehicle</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Return Hub Depot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {pickups.map((rp) => (
                <tr key={rp.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                    {rp.item}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{rp.customer}</div>
                    <div className="text-[10px] text-slate-500">{rp.area}</div>
                  </td>
                  <td className="py-3 px-4 font-mono">{rp.weight_kg || 1.5} kg</td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {rp.vehicle_code || "UF-V001 (En Route)"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300">
                      {rp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
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
