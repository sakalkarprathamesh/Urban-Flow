"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Navigation, 
  Package, 
  RotateCcw,
  RefreshCw
} from "lucide-react";

export default function DriverPortalView() {
  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadRoute = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/api/driver/current-route");
      setRouteData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoute();
  }, []);

  const handleUpdateStop = async (stopId: number, action: string) => {
    setActionLoading(stopId);
    try {
      await fetchApi("/api/driver/update-stop", {
        method: "POST",
        body: JSON.stringify({ stop_id: stopId, action })
      });
      loadRoute();
    } catch (e) {
      alert("Failed to update stop status.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && !routeData) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
        Loading Driver Dispatch Portal...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Mobile-Friendly Driver Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Driver Navigation Console
              </span>
              <h2 className="text-base font-bold text-white">Route {routeData?.route_code || "UF-R001"}</h2>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            {routeData?.status?.toUpperCase() || "ACTIVE"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
          <div className="p-2 rounded bg-slate-950/60">
            <span className="text-slate-500 block text-[10px]">Vehicle:</span>
            <span className="font-bold text-white">{routeData?.vehicle?.code} ({routeData?.vehicle?.type})</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60">
            <span className="text-slate-500 block text-[10px]">Total Distance:</span>
            <span className="font-bold text-white">{routeData?.total_distance_km} km</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60">
            <span className="text-slate-500 block text-[10px]">Route ETA:</span>
            <span className="font-bold text-sky-400">{routeData?.eta_min} min</span>
          </div>
        </div>

        {routeData?.is_rerouted && (
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Active Detour: Fergusson College Rd blocked. Navigation rerouted via SB Road.</span>
          </div>
        )}
      </div>

      {/* Stop by Stop Checklist */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Stop Sequence ({routeData?.stops?.length || 0} Waypoints)
        </h3>

        {routeData?.stops?.map((stop: any) => {
          const isDone = stop.status === "completed";
          const isArrived = stop.status === "arrived";
          const isReverse = stop.type === "reverse_pickup";
          const isHubReturn = stop.type === "hub_return";

          return (
            <div
              key={stop.id}
              className={`p-4 rounded-xl border transition-all ${
                isDone
                  ? "bg-slate-900/40 border-slate-800/80 opacity-70"
                  : isArrived
                  ? "bg-cyan-950/20 border-cyan-500/50 shadow-md"
                  : isReverse
                  ? "bg-teal-950/20 border-teal-500/40"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? "bg-emerald-500 text-slate-950"
                      : isReverse
                      ? "bg-teal-500 text-slate-950"
                      : "bg-slate-800 text-cyan-300 border border-cyan-500/30"
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : stop.sequence}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {isHubReturn ? "Return Depot" : isReverse ? "Reverse Return Pickup" : `Stop ${stop.sequence}`}
                      {isReverse && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-normal">
                          Piggyback
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400">{stop.area} • {stop.address}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isDone ? "bg-emerald-500/20 text-emerald-300" :
                  isArrived ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400"
                }`}>
                  {stop.status.toUpperCase()}
                </span>
              </div>

              {/* Action Buttons for Driver */}
              {!isDone && !isHubReturn && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    disabled={actionLoading === stop.id || isArrived}
                    onClick={() => handleUpdateStop(stop.id, "arrived")}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-40 transition-all"
                  >
                    Arrived
                  </button>
                  <button
                    disabled={actionLoading === stop.id}
                    onClick={() => handleUpdateStop(stop.id, isReverse ? "pickup_completed" : "delivered")}
                    className={`flex-1 py-1.5 rounded-lg text-white text-xs font-bold transition-all ${
                      isReverse ? "bg-teal-600 hover:bg-teal-500" : "bg-emerald-600 hover:bg-emerald-500"
                    }`}
                  >
                    {isReverse ? "Pickup Completed" : "Delivered"}
                  </button>
                  <button
                    disabled={actionLoading === stop.id}
                    onClick={() => handleUpdateStop(stop.id, "failed")}
                    className="px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-950/40 text-xs"
                    title="Unable to Deliver"
                  >
                    ✕
                  </button>
                </div>
              )}

              {isDone && (
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Stop completed successfully
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
