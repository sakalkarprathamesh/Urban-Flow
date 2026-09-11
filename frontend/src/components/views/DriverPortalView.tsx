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
  Package,
  ArrowRight,
  ShieldCheck,
  User
} from "lucide-react";

interface DriverPortalProps {
  onBackToAdmin?: () => void;
}

export default function DriverPortalView({ onBackToAdmin }: DriverPortalProps) {
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
      <div className="p-16 text-center text-[#64748b] text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1e3a8a]" />
        Loading Delivery Agent Web Portal...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner & Active Driver Identity */}
      <div className="uf-card p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eff6ff] text-[#1e40af] flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1e40af] uppercase tracking-wider">
                  Delivery Agent Web Portal
                </span>
                <span className="uf-badge uf-badge-success text-[10px]">
                  Online & Dispatch Assigned
                </span>
              </div>
              <h2 className="text-base font-bold text-[#0f172a] mt-0.5">
                Ramesh Shinde (Agent #04) • Route {routeData?.route_code || "UF-R001"}
              </h2>
            </div>
          </div>

          {onBackToAdmin && (
            <button
              onClick={onBackToAdmin}
              className="uf-btn-secondary text-xs"
            >
              Switch to City Admin Console
            </button>
          )}
        </div>

        {/* 3 Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#f1f5f9] text-center text-xs">
          <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0]">
            <span className="text-[#64748b] block text-[10px] uppercase">Assigned Vehicle</span>
            <span className="font-bold text-[#0f172a]">{routeData?.vehicle?.code} (EV Cargo Van)</span>
          </div>
          <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0]">
            <span className="text-[#64748b] block text-[10px] uppercase">Route Length</span>
            <span className="font-bold text-[#0f172a] font-mono">{routeData?.total_distance_km} km</span>
          </div>
          <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0]">
            <span className="text-[#64748b] block text-[10px] uppercase">Turnaround ETA</span>
            <span className="font-bold text-[#1e40af] font-mono">{routeData?.eta_min} min</span>
          </div>
        </div>

        {routeData?.is_rerouted && (
          <div className="p-3 rounded-lg bg-[#fffbeb] border border-[#fde68a] text-[#92400e] text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
            <span>Active Detour: FC Road blocked. Urban Flow recalculation active via Senapati Bapat Road.</span>
          </div>
        )}
      </div>

      {/* Stop Sequence Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
            Sequential Delivery Drops ({routeData?.stops?.length || 0} Stops)
          </h3>
          <span className="text-[11px] text-[#64748b]">
            Tap action button upon arrival or drop completion
          </span>
        </div>

        <div className="space-y-3">
          {routeData?.stops?.map((stop: any) => {
            const isDone = stop.status === "completed";
            const isArrived = stop.status === "arrived";
            const isReverse = stop.type === "reverse_pickup";
            const isHubReturn = stop.type === "hub_return";

            return (
              <div
                key={stop.id}
                className={`uf-card p-5 bg-white space-y-3 transition-all ${
                  isDone
                    ? "opacity-60 bg-[#f8f9fa]"
                    : isArrived
                    ? "border-[#2563eb] ring-2 ring-[#2563eb]/10"
                    : isReverse
                    ? "border-[#a7f3d0] bg-[#f0fdf4]/50"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone
                        ? "bg-[#10b981] text-white"
                        : isReverse
                        ? "bg-[#059669] text-white"
                        : isArrived
                        ? "bg-[#2563eb] text-white"
                        : "bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]"
                    }`}>
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : stop.sequence}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0f172a]">
                          {stop.area}
                        </span>
                        {isReverse && (
                          <span className="uf-badge uf-badge-success text-[10px]">
                            <RotateCcw className="w-3 h-3" />
                            <span>Piggyback Return Pickup</span>
                          </span>
                        )}
                        {isHubReturn && (
                          <span className="uf-badge uf-badge-neutral text-[10px]">
                            Facility Return
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748b] mt-0.5">{stop.address}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-[#64748b]">
                      ETA: {stop.eta_min} min
                    </span>
                    <span className="block text-[10px] text-[#94a3b8]">
                      {stop.packages_count} packages
                    </span>
                  </div>
                </div>

                {/* Driver Action Buttons */}
                {!isDone && (
                  <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-end gap-2">
                    {!isArrived && (
                      <button
                        onClick={() => handleUpdateStop(stop.id, "arrived")}
                        disabled={actionLoading === stop.id}
                        className="uf-btn-secondary text-xs py-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#2563eb]" />
                        <span>Arrived at Location</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleUpdateStop(stop.id, "completed")}
                      disabled={actionLoading === stop.id}
                      className="uf-btn-primary text-xs py-1.5 bg-[#059669] hover:bg-[#047857]"
                    >
                      {actionLoading === stop.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : isReverse ? (
                        <RotateCcw className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{isReverse ? "Confirm Return Pickup" : "Confirm Delivery"}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
