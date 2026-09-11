"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MapDataResponse, MicroHub, Vehicle } from "@/types";
import { 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Warehouse, 
  Truck, 
  Package, 
  X
} from "lucide-react";

const MapComponent = dynamic(() => import("../MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-white border border-[#e8eaed] rounded-2xl text-[#5f6368] text-xs">
      Loading Pune Urban Flow Geospatial Layer...
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
    <div className="relative w-full h-[calc(100vh-4.2rem)] flex flex-col p-5 max-w-7xl mx-auto space-y-3">
      
      {/* Top Banner on Live Map view */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#202124] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#1a73e8]" />
            Live Geospatial Map • Pune Pilot Area
          </h1>
          <p className="text-xs text-[#5f6368]">
            Real-time movement coordination layer across 8 micro-hubs, 30 fleet units, and active multi-drop delivery routes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isRerouted ? (
            <button
              onClick={onSimulateReroute}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#fce8e6] text-[#d93025] border border-[#f5c6cb] text-xs font-medium shadow-xs transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#ea4335]" />
              <span>Simulate FC Road Closure</span>
            </button>
          ) : (
            <button
              onClick={onClearClosure}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e6f4ea] hover:bg-[#ceead6] text-[#137333] border border-[#a8dab5] text-xs font-semibold shadow-xs transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#188038]" />
              <span>Clear Road Incident</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 rounded-2xl overflow-hidden shadow-xs border border-[#e8eaed] bg-white">
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

        {/* Floating Inspector Panel for Selected Micro-Hub (Item 8) */}
        {inspectedHub && (
          <div className="absolute bottom-6 right-6 z-[1050] w-80 bg-white border border-[#dadce0] rounded-2xl p-4 shadow-xl space-y-3 text-xs animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#e8eaed]">
              <div className="flex items-center gap-2 font-bold text-[#202124] text-sm">
                <Warehouse className="w-4 h-4 text-[#1a73e8]" />
                {inspectedHub.name}
              </div>
              <button
                onClick={() => setInspectedHub(null)}
                className="text-[#5f6368] hover:text-[#202124]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-[#3c4043]">
              <div>Urban Zone: <b className="text-[#202124]">{inspectedHub.area}, Pune</b></div>
              <div>Current Storage: <b className="text-[#1a73e8]">{inspectedHub.current_load_kg} / {inspectedHub.max_capacity_kg} kg</b></div>
              <div>Capacity Utilization: <b className="text-[#34a853]">{inspectedHub.utilization_pct}%</b></div>
              <div>Operating Status: <span className="text-[#188038] font-bold">{inspectedHub.status.toUpperCase()}</span></div>
              <div className="text-[11px] text-[#5f6368] font-mono pt-1">
                Coordinates: [{inspectedHub.lat.toFixed(4)}, {inspectedHub.lng.toFixed(4)}]
              </div>
            </div>
          </div>
        )}

        {/* Floating Inspector Panel for Selected Vehicle (Item 8 example) */}
        {inspectedVehicle && (
          <div className="absolute bottom-6 right-6 z-[1050] w-80 bg-white border border-[#dadce0] rounded-2xl p-4 shadow-xl space-y-3 text-xs animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#e8eaed]">
              <div className="flex items-center gap-2 font-bold text-[#202124] text-sm">
                <Truck className="w-4 h-4 text-[#34a853]" />
                Vehicle {inspectedVehicle.code}
              </div>
              <button
                onClick={() => setInspectedVehicle(null)}
                className="text-[#5f6368] hover:text-[#202124]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-[#3c4043]">
              <div>Vehicle Type: <b className="text-[#202124] capitalize">{inspectedVehicle.type.replace('_', ' ')}</b></div>
              <div>Status: <span className="text-[#1a73e8] font-semibold">{inspectedVehicle.status.toUpperCase()}</span></div>
              <div>Load: <b className="text-[#34a853]">{inspectedVehicle.utilization_pct}%</b> ({inspectedVehicle.current_load_kg} / {inspectedVehicle.max_capacity_kg} kg)</div>
              <div>Current Route: <b className="text-[#1a73e8]">{inspectedVehicle.route_id ? `Hub 01 → Route ${inspectedVehicle.route_id}` : "Assigned to Depot"}</b></div>
              <div>Battery / Fuel: <b className="text-[#202124]">{inspectedVehicle.battery_pct}%</b></div>
              <div>Estimated Arrival: <b className="text-[#1a73e8]">18 min</b></div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
