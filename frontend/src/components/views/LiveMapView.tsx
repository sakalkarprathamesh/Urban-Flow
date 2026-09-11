"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MapDataResponse, MicroHub, Vehicle } from "@/types";
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Warehouse, 
  Truck, 
  Package, 
  X,
  Compass
} from "lucide-react";

const MapComponent = dynamic(() => import("../MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-slate-950 border border-slate-800 rounded-xl text-slate-500 text-xs">
      Loading Pune Urban Flow Geospatial Engine...
    </div>
  ),
});

interface LiveMapProps {
  mapData: MapDataResponse | null;
  onSimulateReroute: () => void;
  onClearClosure: () => void;
  isRerouted: boolean;
}

export default function LiveMapView({
  mapData,
  onSimulateReroute,
  onClearClosure,
  isRerouted,
}: LiveMapProps) {
  const [inspectedHub, setInspectedHub] = useState<MicroHub | null>(null);
  const [inspectedVehicle, setInspectedVehicle] = useState<Vehicle | null>(null);

  return (
    <div className="relative w-full h-[calc(100vh-8.5rem)] flex flex-col p-4 max-w-7xl mx-auto">
      
      {/* Top Banner on Live Map view */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            Pune Smart-City Logistics Geospatial Command Map
          </h1>
          <p className="text-xs text-slate-400">
            Real-time telemetry showing micro-hubs, dynamic delivery clusters, EV fleet routes and road hazard diversions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isRerouted ? (
            <button
              onClick={onSimulateReroute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Simulate FC Road Closure
            </button>
          ) : (
            <button
              onClick={onClearClosure}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Clear Road Closure
            </button>
          )}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
        <MapComponent
          mapData={mapData}
          onSimulateReroute={onSimulateReroute}
          onClearClosure={onClearClosure}
          onSelectHub={(hub) => {
            setInspectedHub(hub);
            setInspectedVehicle(null);
          }}
          onSelectVehicle={(veh) => {
            setInspectedVehicle(veh);
            setInspectedHub(null);
          }}
          isRerouted={isRerouted}
        />

        {/* Floating Inspector Card for Selected Micro-Hub */}
        {inspectedHub && (
          <div className="absolute bottom-6 right-6 z-[1050] w-80 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/50 rounded-xl p-4 shadow-2xl space-y-3 animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Warehouse className="w-4 h-4 text-cyan-400" />
                {inspectedHub.name}
              </div>
              <button
                onClick={() => setInspectedHub(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-slate-300">
              <div>Zone: <b className="text-white">{inspectedHub.area}, Pune</b></div>
              <div>Current Storage: <b className="text-cyan-300">{inspectedHub.current_load_kg} / {inspectedHub.max_capacity_kg} kg</b></div>
              <div>Capacity Utilization: <b className="text-emerald-400">{inspectedHub.utilization_pct}%</b></div>
              <div>Operating Status: <span className="text-emerald-400 font-bold">{inspectedHub.status.toUpperCase()}</span></div>
              <div className="text-[10px] text-slate-500 font-mono pt-1">
                GPS: [{inspectedHub.lat.toFixed(4)}, {inspectedHub.lng.toFixed(4)}]
              </div>
            </div>
          </div>
        )}

        {/* Floating Inspector Card for Selected Vehicle */}
        {inspectedVehicle && (
          <div className="absolute bottom-6 right-6 z-[1050] w-80 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/50 rounded-xl p-4 shadow-2xl space-y-3 animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Truck className="w-4 h-4 text-emerald-400" />
                Fleet Vehicle {inspectedVehicle.code}
              </div>
              <button
                onClick={() => setInspectedVehicle(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-slate-300">
              <div>Vehicle Type: <b className="text-white capitalize">{inspectedVehicle.type.replace('_', ' ')}</b></div>
              <div>Current Load: <b className="text-emerald-300">{inspectedVehicle.current_load_kg} / {inspectedVehicle.max_capacity_kg} kg</b></div>
              <div>Capacity Utilization: <b className="text-emerald-400">{inspectedVehicle.utilization_pct}%</b></div>
              <div>Assigned Route: <b className="text-cyan-400">{inspectedVehicle.route_id ? `UF-R00${inspectedVehicle.route_id}` : "Idle Depot"}</b></div>
              <div>Battery / Fuel: <b className="text-white">{inspectedVehicle.battery_pct}%</b></div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
