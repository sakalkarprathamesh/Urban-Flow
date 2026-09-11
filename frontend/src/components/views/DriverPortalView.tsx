"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RotateCcw,
  RefreshCw,
  XCircle,
  Package
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
      <div className="p-16 text-center text-[#5f6368] text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1a73e8]" />
        Loading Delivery Agent Web Portal...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      
      {/* Agent Web Console Header (Item 9) */}
      <div className="google-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wider">
                Delivery Agent Web Portal
              </span>
              <h2 className="text-lg font-bold text-[#202124]">
                Active Route {routeData?.route_code || "UF-R001"}
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#137333]">
            {routeData?.status?.toUpperCase() || "ACTIVE"}
          </span>
        </div>

        {/* 3 Overview Badges */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#f1f3f4] text-center text-xs">
          <div className="p-3 rounded-xl bg-[#f8fafd] border border-[#e8eaed]">
            <span className="text-[#80868b] block text-[11px]">Assigned Vehicle</span>
            <span className="font-bold text-[#202124]">{routeData?.vehicle?.code} ({routeData?.vehicle?.type})</span>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafd] border border-[#e8eaed]">
            <span className="text-[#80868b] block text-[11px]">Total Route Distance</span>
            <span className="font-bold text-[#202124]">{routeData?.total_distance_km} km</span>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafd] border border-[#e8eaed]">
            <span className="text-[#80868b] block text-[11px]">Estimated Turnaround</span>
            <span className="font-bold text-[#1a73e8]">{routeData?.eta_min} min</span>
          </div>
        </div>

        {routeData?.is_rerouted && (
          <div className="p-3 rounded-xl bg-[#fef7e0] border border-[#fbbc04] text-[#804000] text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f29900] shrink-0" />
            <span>Active Detour: FC Road blocked. Rerouted via Senapati Bapat Road.</span>
          </div>
        )}
      </div>

      {/* Stop Sequence Checklist */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#5f6368] uppercase tracking-wider px-1">
          Route Stop Checklist ({routeData?.stops?.length || 0} Stops)
        </h3>

        {routeData?.stops?.map((stop: any) => {
          const isDone = stop.status === "completed";
          const isArrived = stop.status === "arrived";
          const isReverse = stop.type === "reverse_pickup";
          const isHubReturn = stop.type === "hub_return";

          return (
            <div
              key={stop.id}
              className={`google-card p-5 bg-white space-y-3 transition-all ${
                isDone
                  ? "opacity-60 bg-[#f8fafd]"
                  : isArrived
                  ? "border-[#1a73e8] ring-1 ring-[#1a73e8]/20"
                  : isReverse
                  ? "border-[#ceead6]"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? "bg-[#34a853] text-white"
                      : isReverse
                      ? "bg-[#e6f4ea] text-[#137333] border border-[#34a853]"
                      : "bg-[#e8f0fe] text-[#1a73e8]"
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : stop.sequence}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                      {isHubReturn ? "Return Depot" : isReverse ? "Reverse Return Pickup" : `Stop ${stop.sequence}`}
                      {isReverse && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] font-semibold">
                          Piggyback Return
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#5f6368]">{stop.area} • {stop.address}</p>
                  </div>
                </div>

                <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                  isDone ? "bg-[#e6f4ea] text-[#137333]" :
                  isArrived ? "bg-[#e8f0fe] text-[#1a73e8]" : "bg-[#f1f3f4] text-[#5f6368]"
                }`}>
                  {stop.status.toUpperCase()}
                </span>
              </div>

              {/* Large Clear Action Buttons (Item 9: Arrived, Delivered, Pickup Completed, Unable to Deliver) */}
              {!isDone && !isHubReturn && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#f1f3f4]">
                  <button
                    disabled={actionLoading === stop.id || isArrived}
                    onClick={() => handleUpdateStop(stop.id, "arrived")}
                    className="flex-1 py-2.5 rounded-xl bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] text-xs font-semibold disabled:opacity-40 transition-all"
                  >
                    Arrived
                  </button>
                  <button
                    disabled={actionLoading === stop.id}
                    onClick={() => handleUpdateStop(stop.id, isReverse ? "pickup_completed" : "delivered")}
                    className={`flex-1 py-2.5 rounded-xl text-white text-xs font-semibold shadow-xs transition-all ${
                      isReverse ? "bg-[#34a853] hover:bg-[#188038]" : "bg-[#1a73e8] hover:bg-[#1557b0]"
                    }`}
                  >
                    {isReverse ? "Pickup Completed" : "Delivered"}
                  </button>
                  <button
                    disabled={actionLoading === stop.id}
                    onClick={() => handleUpdateStop(stop.id, "failed")}
                    className="px-3.5 py-2.5 rounded-xl border border-[#f5c6cb] text-[#d93025] hover:bg-[#fce8e6] text-xs font-medium"
                    title="Unable to Deliver"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isDone && (
                <div className="text-xs text-[#188038] font-medium flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4" /> Stop completed successfully
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
