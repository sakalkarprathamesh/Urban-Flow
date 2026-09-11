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
  RefreshCw, 
  Zap, 
  Navigation,
  CheckCircle2
} from "lucide-react";

interface MapProps {
  mapData: MapDataResponse | null;
  onSimulateReroute?: () => void;
  onClearClosure?: () => void;
  onSelectHub?: (hub: MicroHub) => void;
  onSelectVehicle?: (veh: Vehicle) => void;
  isRerouted?: boolean;
}

export default function MapComponent({
  mapData,
  onSimulateReroute,
  onClearClosure,
  onSelectHub,
  onSelectVehicle,
  isRerouted = false,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer Visibility Controls
  const [showHubs, setShowHubs] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showClusters, setShowClusters] = useState(true);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showDestinations, setShowDestinations] = useState(true);
  const [showReverse, setShowReverse] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on central Pune
    const map = L.map(mapContainerRef.current, {
      center: [18.535, 73.850],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // CartoDB Dark Matter Tiles (Smart city dark theme)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Pune Urban Flow',
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

  // Update Layers when mapData or visibility flags change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || !mapData) return;

    const lg = layerGroupRef.current;
    lg.clearLayers();

    // 1. Render Active Routes
    if (showRoutes && mapData.routes) {
      mapData.routes.forEach((route) => {
        if (route.polyline && route.polyline.length > 0) {
          const latLngs: [number, number][] = route.polyline.map(([lat, lng]) => [lat, lng]);
          
          const isRerouteActive = route.is_rerouted || route.status === "rerouted";
          const polyline = L.polyline(latLngs, {
            color: isRerouteActive ? "#f59e0b" : "#06b6d4",
            weight: isRerouteActive ? 4 : 3.5,
            opacity: 0.9,
            dashArray: isRerouteActive ? "8, 6" : undefined,
          });

          polyline.bindPopup(`
            <div style="font-size: 13px;">
              <div style="font-weight: 700; color: ${isRerouteActive ? '#f59e0b' : '#06b6d4'}; margin-bottom: 4px;">
                ${route.code} ${isRerouteActive ? '(DYNAMIC DETOUR)' : '(CONSOLIDATED ROUTE)'}
              </div>
              <div style="color: #94a3b8; font-size: 11px;">Status: <b style="color: #f1f5f9;">${route.status.toUpperCase()}</b></div>
              <div style="color: #94a3b8; font-size: 11px;">Distance: <b style="color: #f1f5f9;">${route.distance_km} km</b></div>
              <div style="color: #94a3b8; font-size: 11px;">Current ETA: <b style="color: #38bdf8;">${route.eta_min} min</b></div>
              ${route.empty_returns_avoided > 0 ? `<div style="color: #10b981; font-size: 11px; margin-top: 4px;">✓ ${route.empty_returns_avoided} Empty Return(s) Avoided</div>` : ''}
            </div>
          `);
          lg.addLayer(polyline);
        }
      });
    }

    // 2. Render Micro-Hubs
    if (showHubs && mapData.hubs) {
      mapData.hubs.forEach((hub) => {
        const utilColor = hub.utilization_pct > 80 ? "#ef4444" : hub.utilization_pct > 60 ? "#f59e0b" : "#06b6d4";
        const hubIcon = L.divIcon({
          className: "custom-hub-marker",
          html: `
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 10px;
              background: #0f172a;
              border: 2px solid ${utilColor};
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              box-shadow: 0 4px 14px rgba(6, 182, 212, 0.4);
              cursor: pointer;
            ">
              <span style="font-size: 9px; font-weight: 800; color: ${utilColor};">${hub.code.replace('HUB_', 'H')}</span>
              <span style="font-size: 8px; color: #94a3b8;">${Math.round(hub.utilization_pct)}%</span>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([hub.lat, hub.lng], { icon: hubIcon });
        marker.bindPopup(`
          <div style="font-size: 13px; line-height: 1.4;">
            <div style="font-weight: bold; color: #38bdf8; font-size: 14px;">${hub.name}</div>
            <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;">${hub.area} Urban Node</div>
            <div style="border-top: 1px solid #334155; padding-top: 6px;">
              <div>Capacity: <b>${hub.current_load_kg} / ${hub.max_capacity_kg} kg</b></div>
              <div>Utilization: <b style="color: ${utilColor};">${hub.utilization_pct}%</b></div>
              <div>Status: <span style="color: #10b981; font-weight: bold;">${hub.status.toUpperCase()}</span></div>
            </div>
          </div>
        `);
        marker.on("click", () => onSelectHub && onSelectHub(hub));
        lg.addLayer(marker);
      });
    }

    // 3. Render Vehicles
    if (showVehicles && mapData.vehicles) {
      mapData.vehicles.forEach((veh) => {
        const isTransit = veh.status === "in_transit";
        const vehColor = isTransit ? "#10b981" : veh.status === "loading" ? "#f59e0b" : "#64748b";
        
        const vehIcon = L.divIcon({
          className: `custom-veh-marker ${isTransit ? "pulse-marker-cyan" : ""}`,
          html: `
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: #0f172a;
              border: 2px solid ${vehColor};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.5);
              cursor: pointer;
            ">
              <span style="font-size: 9px; font-weight: 700; color: ${vehColor};">
                ${veh.type === 'motorcycle' ? '🛵' : veh.type === 'ev_cargo' ? '⚡' : '🚚'}
              </span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([veh.lat, veh.lng], { icon: vehIcon });
        marker.bindPopup(`
          <div style="font-size: 13px;">
            <div style="font-weight: bold; color: #10b981; font-size: 14px;">${veh.code}</div>
            <div style="color: #94a3b8; font-size: 11px;">Type: <b style="color: #f8fafc;">${veh.type.replace('_', ' ').toUpperCase()}</b></div>
            <div style="color: #94a3b8; font-size: 11px;">Status: <b style="color: #38bdf8;">${veh.status.toUpperCase()}</b></div>
            <div style="color: #94a3b8; font-size: 11px;">Current Load: <b>${veh.current_load_kg} / ${veh.max_capacity_kg} kg (${veh.utilization_pct}%)</b></div>
            <div style="color: #94a3b8; font-size: 11px;">Battery/Fuel: <b>${veh.battery_pct}%</b></div>
          </div>
        `);
        marker.on("click", () => onSelectVehicle && onSelectVehicle(veh));
        lg.addLayer(marker);
      });
    }

    // 4. Render Delivery Clusters
    if (showClusters && mapData.clusters) {
      mapData.clusters.forEach((cluster) => {
        const clusterIcon = L.divIcon({
          className: "custom-cluster-marker",
          html: `
            <div style="
              padding: 3px 8px;
              border-radius: 12px;
              background: rgba(99, 102, 241, 0.9);
              border: 1px solid #a5b4fc;
              color: white;
              font-size: 10px;
              font-weight: bold;
              display: flex;
              align-items: center;
              gap: 4px;
              box-shadow: 0 4px 12px rgba(99, 102, 241, 0.5);
              white-space: nowrap;
            ">
              <span>📦 ${cluster.package_count} pkgs</span>
            </div>
          `,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        });

        const marker = L.marker([cluster.lat, cluster.lng], { icon: clusterIcon });
        marker.bindPopup(`
          <div style="font-size: 13px;">
            <div style="font-weight: bold; color: #818cf8;">Cluster ${cluster.code}</div>
            <div style="color: #94a3b8; font-size: 11px;">Consolidated Deliveries: <b>${cluster.package_count} packages</b></div>
            <div style="color: #94a3b8; font-size: 11px;">Total Weight: <b>${cluster.total_weight_kg} kg</b></div>
            <div style="color: #94a3b8; font-size: 11px;">Status: <b style="color: #34d399;">${cluster.status.toUpperCase()}</b></div>
          </div>
        `);
        lg.addLayer(marker);
      });
    }

    // 5. Render Traffic Incident / Blocked Road Hazards
    if (showTraffic && mapData.traffic_events) {
      mapData.traffic_events.forEach((te) => {
        const hazardIcon = L.divIcon({
          className: "pulse-marker-red",
          html: `
            <div style="
              width: 34px;
              height: 34px;
              border-radius: 8px;
              background: #7f1d1d;
              border: 2px solid #ef4444;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fecaca;
              font-size: 16px;
              box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
            ">
              ⛔
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([te.from_lat, te.from_lng], { icon: hazardIcon });
        marker.bindPopup(`
          <div style="font-size: 13px;">
            <div style="font-weight: bold; color: #ef4444; font-size: 14px;">ROAD CLOSURE / INCIDENT</div>
            <div style="color: #f8fafc; font-weight: 600; margin: 3px 0;">${te.road}</div>
            <div style="color: #94a3b8; font-size: 11px;">Area: ${te.area}</div>
            <div style="color: #fca5a5; font-size: 11px; margin-top: 4px;">${te.description}</div>
            <div style="margin-top: 6px; font-size: 11px; color: #f59e0b; font-weight: 600;">
              ⚡ Dynamic Rerouting Engine Active
            </div>
          </div>
        `);
        lg.addLayer(marker);
      });
    }

    // 6. Render Sample Delivery Destination points
    if (showDestinations && mapData.destinations) {
      mapData.destinations.forEach((dest) => {
        const circle = L.circleMarker([dest.lat, dest.lng], {
          radius: 4,
          fillColor: dest.status === "DELIVERED" ? "#10b981" : "#f59e0b",
          color: "#0f172a",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.7,
        });
        circle.bindPopup(`
          <div style="font-size: 12px;">
            <div style="font-weight: bold; color: #f59e0b;">Destination: ${dest.area}</div>
            <div style="color: #94a3b8;">Code: ${dest.tracking_code}</div>
            <div style="color: #94a3b8;">Weight: ${dest.weight} kg</div>
            <div style="color: #38bdf8;">Status: ${dest.status}</div>
          </div>
        `);
        lg.addLayer(circle);
      });
    }

    // 7. Render Reverse Logistics Pickups
    if (showReverse && mapData.reverse_pickups) {
      mapData.reverse_pickups.forEach((rp) => {
        const revIcon = L.divIcon({
          className: "custom-reverse-marker",
          html: `
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: #047857;
              border: 1.5px solid #34d399;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 10px;
            ">
              🔄
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        const marker = L.marker([rp.lat, rp.lng], { icon: revIcon });
        marker.bindPopup(`
          <div style="font-size: 12px;">
            <div style="font-weight: bold; color: #10b981;">Reverse Pickup Point</div>
            <div>Item: ${rp.item}</div>
            <div>Customer: ${rp.customer} (${rp.area})</div>
            <div style="color: #34d399; font-weight: 600;">Vehicle: ${rp.vehicle_code || 'Matched'}</div>
          </div>
        `);
        lg.addLayer(marker);
      });
    }
  }, [
    mapData,
    showHubs,
    showVehicles,
    showRoutes,
    showClusters,
    showTraffic,
    showDestinations,
    showReverse,
  ]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Top Left: Map Layers Filter Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-700/70 shadow-lg text-xs">
        <button
          onClick={() => setShowHubs(!showHubs)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
            showHubs ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          <Warehouse className="w-3.5 h-3.5" />
          Hubs
        </button>
        <button
          onClick={() => setShowVehicles(!showVehicles)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
            showVehicles ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Vehicles
        </button>
        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
            showRoutes ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Routes
        </button>
        <button
          onClick={() => setShowClusters(!showClusters)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
            showClusters ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Clusters
        </button>
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
            showTraffic ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Traffic Incidents
        </button>
        <button
          onClick={() => setShowReverse(!showReverse)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
            showReverse ? "bg-teal-500/20 text-teal-300 border border-teal-500/40" : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reverse Pickups
        </button>
      </div>

      {/* Top Right: Demonstration Controls (Section 13) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {!isRerouted ? (
          <button
            onClick={onSimulateReroute}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-xl border border-amber-400/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            title="Demonstrate dynamic rerouting when road closure occurs on FC Road"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            Simulate Road Closure
          </button>
        ) : (
          <button
            onClick={onClearClosure}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-xl border border-emerald-400/40 transition-all"
            title="Clear active incident and restore normal transit corridor"
          >
            <CheckCircle2 className="w-4 h-4" />
            Clear Road Incident
          </button>
        )}
      </div>

      {/* Bottom Left: Quick Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/60 shadow-md text-[11px] text-slate-300 flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded bg-cyan-400 inline-block"></span> Hubs
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> Fleet
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block"></span> Clusters
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"></span> Drop-offs
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span> Hazard
        </span>
      </div>
    </div>
  );
}
