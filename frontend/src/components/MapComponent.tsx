"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapDataResponse, MicroHub, Vehicle, RouteData } from "@/types";
import { 
  Layers, 
  Truck, 
  Warehouse, 
  AlertTriangle, 
  Package, 
  RotateCcw, 
  Navigation,
  CheckCircle2,
  X,
  ArrowRight,
  Clock,
  Gauge,
  MapPin
} from "lucide-react";

interface MapProps {
  mapData: MapDataResponse | null;
  onSimulateReroute?: () => void;
  onClearClosure?: () => void;
  onSelectHub?: (hub: MicroHub) => void;
  onSelectVehicle?: (veh: Vehicle) => void;
  isRerouted?: boolean;
  selectedRouteId?: number | null;
  compactHeight?: boolean;
}

type SelectedMapObject = 
  | { type: "vehicle"; data: Vehicle }
  | { type: "hub"; data: MicroHub }
  | { type: "route"; data: RouteData }
  | { type: "traffic"; data: any }
  | { type: "cluster"; data: any }
  | null;

export default function MapComponent({
  mapData,
  onSimulateReroute,
  onClearClosure,
  onSelectHub,
  onSelectVehicle,
  isRerouted = false,
  selectedRouteId = null,
  compactHeight = false,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer Visibility Controls
  const [showVehicles, setShowVehicles] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showHubs, setShowHubs] = useState(true);
  const [showDeliveries, setShowDeliveries] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Inspector Side Drawer State
  const [selectedObject, setSelectedObject] = useState<SelectedMapObject>(null);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on central Pune
    const map = L.map(mapContainerRef.current, {
      center: [18.532, 73.852],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // CartoDB Voyager Light Tiles (Clean, modern geographic clarity)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Pune Urban Flow Network',
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Markers and Polylines
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || !mapData) return;

    const lg = layerGroupRef.current;
    lg.clearLayers();

    // 1. Render Active Routes
    if (showRoutes && mapData.routes) {
      mapData.routes.forEach((route) => {
        if (route.polyline && route.polyline.length > 0) {
          const latLngs: [number, number][] = route.polyline.map(([lat, lng]) => [lat, lng]);
          const isSelected = selectedRouteId === route.id;
          const isRerouteActive = route.is_rerouted || route.status === "rerouted";

          const polyline = L.polyline(latLngs, {
            color: isRerouteActive ? "#ef4444" : isSelected ? "#1d4ed8" : "#2563eb",
            weight: isSelected ? 5.5 : isRerouteActive ? 4.5 : 3,
            opacity: isSelected ? 0.95 : 0.75,
            dashArray: isRerouteActive ? "8, 6" : undefined,
          });

          polyline.on("click", () => {
            setSelectedObject({ type: "route", data: route });
          });

          polyline.addTo(lg);
        }
      });
    }

    // 2. Render Micro-Hubs
    if (showHubs && mapData.hubs) {
      mapData.hubs.forEach((hub) => {
        const hubLoad = hub.current_load_kg ?? hub.current_load ?? 150;
        const hubCap = hub.max_capacity_kg ?? hub.capacity ?? 250;
        const capacityPct = Math.round((hubLoad / Math.max(hubCap, 1)) * 100);
        const isHighLoad = capacityPct > 80;

        const iconHtml = `
          <div style="
            background: #ffffff;
            border: 2px solid ${isHighLoad ? '#f59e0b' : '#1e3a8a'};
            border-radius: 8px;
            padding: 3px 6px;
            font-size: 11px;
            font-weight: 600;
            color: #0f172a;
            box-shadow: 0 2px 6px rgba(15,23,42,0.15);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            cursor: pointer;
          ">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${isHighLoad ? '#f59e0b' : '#10b981'};"></span>
            <span>${hub.name.replace(' Hub', '')}</span>
          </div>
        `;

        const marker = L.marker([hub.lat ?? hub.latitude ?? 18.53, hub.lng ?? hub.longitude ?? 73.85], {
          icon: L.divIcon({
            html: iconHtml,
            className: "custom-hub-marker",
            iconSize: [80, 26],
            iconAnchor: [40, 13],
          }),
        });

        marker.on("click", () => {
          setSelectedObject({ type: "hub", data: hub });
          if (onSelectHub) onSelectHub(hub);
        });

        marker.addTo(lg);
      });
    }

    // 3. Render Vehicles
    if (showVehicles && mapData.vehicles) {
      mapData.vehicles.forEach((veh) => {
        const utilPct = Math.round((veh.current_load_kg / Math.max(veh.max_capacity_kg, 1)) * 100);
        const isSelected = selectedObject?.type === "vehicle" && (selectedObject.data as Vehicle).id === veh.id;

        const iconHtml = `
          <div style="
            background: ${isSelected ? '#1e3a8a' : '#ffffff'};
            border: 1.5px solid ${isSelected ? '#1e3a8a' : '#cbd5e1'};
            border-radius: 9999px;
            padding: 3px 7px;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 2px 5px rgba(15,23,42,0.12);
            font-size: 10px;
            font-weight: 600;
            color: ${isSelected ? '#ffffff' : '#0f172a'};
            cursor: pointer;
          ">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${veh.status === 'in_transit' ? '#2563eb' : '#94a3b8'};"></span>
            <span>${veh.code || `V-${veh.id}`}</span>
            <span style="color:${isSelected ? '#93c5fd' : '#64748b'}; font-size:9px;">${utilPct}%</span>
          </div>
        `;

        const marker = L.marker([veh.lat ?? veh.latitude ?? 18.53, veh.lng ?? veh.longitude ?? 73.85], {
          icon: L.divIcon({
            html: iconHtml,
            className: "custom-veh-marker",
            iconSize: [64, 22],
            iconAnchor: [32, 11],
          }),
        });

        marker.on("click", () => {
          setSelectedObject({ type: "vehicle", data: veh });
          if (onSelectVehicle) onSelectVehicle(veh);
        });

        marker.addTo(lg);
      });
    }

    // 4. Render Traffic Incidents
    if (showTraffic && mapData.traffic_events) {
      mapData.traffic_events.forEach((te) => {
        const iconHtml = `
          <div class="marker-pulse-amber" style="
            background: #fffbeb;
            border: 2px solid #f59e0b;
            border-radius: 9999px;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            cursor: pointer;
          ">
            ⚠️
          </div>
        `;

        const marker = L.marker([te.from_lat ?? te.latitude ?? 18.53, te.from_lng ?? te.longitude ?? 73.85], {
          icon: L.divIcon({
            html: iconHtml,
            className: "custom-traffic-marker",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          }),
        });

        marker.on("click", () => {
          setSelectedObject({ type: "traffic", data: te });
        });

        marker.addTo(lg);
      });
    }

    // 5. Render Delivery Clusters (if toggled)
    if (showDeliveries && mapData.clusters) {
      mapData.clusters.forEach((cl) => {
        const marker = L.circleMarker([cl.lat ?? cl.latitude ?? 18.53, cl.lng ?? cl.longitude ?? 73.85], {
          radius: Math.min(Math.max(cl.package_count * 1.5, 6), 18),
          color: "#0284c7",
          fillColor: "#e0f2fe",
          fillOpacity: 0.6,
          weight: 1.5,
        });

        marker.on("click", () => {
          setSelectedObject({ type: "cluster", data: cl });
        });

        marker.addTo(lg);
      });
    }

  }, [mapData, showVehicles, showRoutes, showHubs, showDeliveries, showTraffic, selectedRouteId]);

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#f8f9fa] ${compactHeight ? "h-[440px]" : "h-[620px]"}`}>
      
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left: Layer Control Pill & Toggles */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-xs border border-[#e2e8f0] rounded-lg shadow-xs">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#0f172a] hover:bg-[#f8f9fa] rounded-md transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Map Layers</span>
          </button>
          
          <div className="h-4 w-px bg-[#e2e8f0]"></div>

          {/* Quick Active Layer Badges */}
          <button 
            onClick={() => setShowVehicles(!showVehicles)}
            className={`px-2 py-0.5 text-[11px] rounded-md transition-all ${
              showVehicles ? "bg-[#eff6ff] text-[#1e40af] font-medium" : "text-[#94a3b8] hover:text-[#0f172a]"
            }`}
          >
            Vehicles
          </button>
          <button 
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2 py-0.5 text-[11px] rounded-md transition-all ${
              showRoutes ? "bg-[#eff6ff] text-[#1e40af] font-medium" : "text-[#94a3b8] hover:text-[#0f172a]"
            }`}
          >
            Routes
          </button>
          <button 
            onClick={() => setShowHubs(!showHubs)}
            className={`px-2 py-0.5 text-[11px] rounded-md transition-all ${
              showHubs ? "bg-[#eff6ff] text-[#1e40af] font-medium" : "text-[#94a3b8] hover:text-[#0f172a]"
            }`}
          >
            Hubs
          </button>
        </div>

        {/* Extended Layer Dropdown Menu */}
        {isLayerMenuOpen && (
          <div className="w-48 p-2.5 bg-white border border-[#e2e8f0] rounded-lg shadow-md space-y-2 text-xs text-[#0f172a] animate-in fade-in duration-100">
            <div className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">
              Display Layers
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={showVehicles} 
                onChange={(e) => setShowVehicles(e.target.checked)}
                className="rounded text-[#1e3a8a] focus:ring-0" 
              />
              <span>Vehicles ({mapData?.vehicles?.length || 0})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={showRoutes} 
                onChange={(e) => setShowRoutes(e.target.checked)}
                className="rounded text-[#1e3a8a] focus:ring-0" 
              />
              <span>Active Routes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={showHubs} 
                onChange={(e) => setShowHubs(e.target.checked)}
                className="rounded text-[#1e3a8a] focus:ring-0" 
              />
              <span>Micro-Hubs (8)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={showDeliveries} 
                onChange={(e) => setShowDeliveries(e.target.checked)}
                className="rounded text-[#1e3a8a] focus:ring-0" 
              />
              <span>Delivery Clusters</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={showTraffic} 
                onChange={(e) => setShowTraffic(e.target.checked)}
                className="rounded text-[#1e3a8a] focus:ring-0" 
              />
              <span>Traffic & Incidents</span>
            </label>
          </div>
        )}
      </div>

      {/* Top Right: Demonstration Incident Trigger */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        {onSimulateReroute && (
          <button
            onClick={isRerouted ? onClearClosure : onSimulateReroute}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 ${
              isRerouted 
                ? "bg-[#ef4444] text-white hover:bg-[#dc2626]" 
                : "bg-white text-[#92400e] border border-[#fde68a] hover:bg-[#fef3c7]"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{isRerouted ? "Clear FC Road Incident" : "Simulate Incident (FC Road)"}</span>
          </button>
        )}
      </div>

      {/* Slide-over Object Inspector Side Panel (Progressive Disclosure) */}
      {selectedObject && (
        <div className="absolute bottom-3 left-3 sm:left-auto sm:right-3 z-[1001] w-[calc(100%-1.5rem)] sm:w-80 bg-white border border-[#e2e8f0] rounded-xl shadow-lg p-4 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-start justify-between pb-2 border-b border-[#f1f5f9]">
            <div>
              <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                {selectedObject.type === "vehicle" && "Vehicle Inspector"}
                {selectedObject.type === "hub" && "Micro-Hub Facility"}
                {selectedObject.type === "route" && "Route Telemetry"}
                {selectedObject.type === "traffic" && "Traffic Hazard"}
                {selectedObject.type === "cluster" && "Delivery Cluster"}
              </span>
              <h3 className="text-sm font-bold text-[#0f172a] mt-0.5">
                {selectedObject.type === "vehicle" && (selectedObject.data.code || `Vehicle #${selectedObject.data.id}`)}
                {selectedObject.type === "hub" && selectedObject.data.name}
                {selectedObject.type === "route" && `Route #${selectedObject.data.id}`}
                {selectedObject.type === "traffic" && (selectedObject.data.road_name || "Road Hazard")}
                {selectedObject.type === "cluster" && `Cluster ${selectedObject.data.cluster_code || selectedObject.data.id}`}
              </h3>
            </div>
            <button
              onClick={() => setSelectedObject(null)}
              className="p-1 text-[#94a3b8] hover:text-[#0f172a] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2.5 text-xs">
            {/* Vehicle Details */}
            {selectedObject.type === "vehicle" && (
              <>
                <div className="flex justify-between text-[#64748b]">
                  <span>Vehicle Type:</span>
                  <span className="font-medium text-[#0f172a] capitalize">{selectedObject.data.type?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-[#64748b]">
                  <span>Operational Status:</span>
                  <span className="font-medium text-[#2563eb] capitalize">{selectedObject.data.status?.replace('_', ' ')}</span>
                </div>
                <div>
                  <div className="flex justify-between text-[#64748b] mb-1">
                    <span>Cargo Utilization:</span>
                    <span className="font-bold text-[#0f172a]">
                      {Math.round((selectedObject.data.current_load_kg / Math.max(selectedObject.data.max_capacity_kg, 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1e3a8a] rounded-full"
                      style={{ width: `${Math.min(100, (selectedObject.data.current_load_kg / Math.max(selectedObject.data.max_capacity_kg, 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-[#64748b]">
                  <span>Current Payload:</span>
                  <span className="font-mono text-[#0f172a]">{selectedObject.data.current_load_kg} / {selectedObject.data.max_capacity_kg} kg</span>
                </div>
              </>
            )}

            {/* Micro-Hub Details */}
            {selectedObject.type === "hub" && (
              <>
                <div className="flex justify-between text-[#64748b]">
                  <span>Location:</span>
                  <span className="font-medium text-[#0f172a]">{selectedObject.data.location_name || selectedObject.data.area || "Pune"}</span>
                </div>
                <div>
                  <div className="flex justify-between text-[#64748b] mb-1">
                    <span>Storage Capacity:</span>
                    <span className="font-bold text-[#0f172a]">
                      {Math.round(((selectedObject.data.current_load_kg ?? selectedObject.data.current_load ?? 150) / Math.max((selectedObject.data.max_capacity_kg ?? selectedObject.data.capacity ?? 250), 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#10b981] rounded-full"
                      style={{ width: `${Math.min(100, ((selectedObject.data.current_load_kg ?? selectedObject.data.current_load ?? 150) / Math.max((selectedObject.data.max_capacity_kg ?? selectedObject.data.capacity ?? 250), 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-[#64748b]">
                  <span>Packages Staged:</span>
                  <span className="font-mono text-[#0f172a]">
                    {(selectedObject.data.current_load_kg ?? selectedObject.data.current_load ?? 150)} / {(selectedObject.data.max_capacity_kg ?? selectedObject.data.capacity ?? 250)} units
                  </span>
                </div>
              </>
            )}

            {/* Route Details */}
            {selectedObject.type === "route" && (
              <>
                <div className="flex justify-between text-[#64748b]">
                  <span>Total Stops:</span>
                  <span className="font-mono text-[#0f172a]">{selectedObject.data.stops?.length || 5} drops</span>
                </div>
                <div className="flex justify-between text-[#64748b]">
                  <span>Est. Distance:</span>
                  <span className="font-mono text-[#0f172a]">{selectedObject.data.total_distance_km} km</span>
                </div>
                <div className="flex justify-between text-[#64748b]">
                  <span>Est. Duration:</span>
                  <span className="font-mono text-[#0f172a]">{selectedObject.data.total_duration_min} min</span>
                </div>
                <div className="flex justify-between text-[#64748b]">
                  <span>Optimization:</span>
                  <span className={`font-semibold ${selectedObject.data.is_rerouted ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                    {selectedObject.data.is_rerouted ? "Rerouted (Incident Detour)" : "Optimized (VRP 2-Opt)"}
                  </span>
                </div>
              </>
            )}

            {/* Traffic Hazard */}
            {selectedObject.type === "traffic" && (
              <>
                <div className="p-2 bg-[#fffbeb] border border-[#fde68a] rounded-md text-[#92400e] text-[11px] leading-relaxed">
                  {selectedObject.data.description || "Road closure reported on corridor. Urban Flow dynamic rerouting active."}
                </div>
                <div className="flex justify-between text-[#64748b]">
                  <span>Detour Status:</span>
                  <span className="font-semibold text-[#ef4444]">Active (+4.5 min ETA)</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
