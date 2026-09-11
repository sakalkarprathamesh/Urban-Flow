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
  X,
  Layers,
  MapPin
} from "lucide-react";

const MapComponent = dynamic(() => import("../MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] text-xs">
      Loading Pune Urban Flow Cartography...
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
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      
      {/* Top Header Controls & Live Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            <h1 className="text-base font-bold text-[#0f172a] tracking-tight">
              Live Pune Geospatial Layer
            </h1>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Real-time movement coordination layer across 8 micro-hubs, 30 fleet units, and active delivery routes.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#475569]">
            <Warehouse className="w-3.5 h-3.5 text-[#1e3a8a]" />
            <span className="font-semibold text-[#0f172a]">{mapData?.hubs?.length || 8}</span>
            <span className="text-[#94a3b8]">Hubs</span>
          </div>
          <div className="h-4 w-px bg-[#e2e8f0]"></div>
          <div className="flex items-center gap-1.5 text-[#475569]">
            <Truck className="w-3.5 h-3.5 text-[#2563eb]" />
            <span className="font-semibold text-[#0f172a]">{mapData?.vehicles?.length || 30}</span>
            <span className="text-[#94a3b8]">Fleet</span>
          </div>
          <div className="h-4 w-px bg-[#e2e8f0]"></div>
          <div className="flex items-center gap-1.5 text-[#475569]">
            <Package className="w-3.5 h-3.5 text-[#0284c7]" />
            <span className="font-semibold text-[#0f172a]">{mapData?.clusters?.length || 8}</span>
            <span className="text-[#94a3b8]">Clusters</span>
          </div>
        </div>
      </div>

      {/* Full-Height Interactive Map Canvas */}
      <div className="w-full relative">
        <MapComponent
          mapData={mapData}
          onSimulateReroute={onSimulateReroute}
          onClearClosure={onClearClosure}
          onSelectHub={(h) => {
            setInspectedHub(h);
            setInspectedVehicle(null);
          }}
          onSelectVehicle={(v) => {
            setInspectedVehicle(v);
            setInspectedHub(null);
          }}
          isRerouted={isRerouted}
          compactHeight={false}
        />
      </div>

    </div>
  );
}
