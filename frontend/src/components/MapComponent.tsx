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

    // CartoDB Voyager Light Tiles (Clean Google Maps-inspired light style)
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
            color: isRerouteActive ? "#ea4335" : "#1a73e8",
            weight: isRerouteActive ? 4.5 : 3.5,
            opacity: 0.85,
            dashArray: isRerouteActive ? "8, 6" : undefined,
          });

          polyline.bindPopup(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px;">
              <div style="font-weight: 700; color: ${isRerouteActive ? '#ea4335' : '#1a73e8'}; font-size: 13px; margin-bottom: 4px;">
                ${route.code} ${isRerouteActive ? '• Detour Active' : '• Consolidated Route'}
              </div>
              <div style="color: #5f6368; font-size: 12px; line-height: 1.5;">
                <div>Status: <b style="color: #202124;">${route.status.toUpperCase()}</b></div>
                <div>Distance: <b style="color: #202124;">${route.distance_km} km</b></div>
                <div>Estimated Arrival: <b style="color: #1a73e8;">${route.eta_min} min</b></div>
                ${route.empty_returns_avoided > 0 ? `<div style="color: #34a853; font-weight: 600; margin-top: 4px;">✓ ${route.empty_returns_avoided} Empty Return Avoided</div>` : ''}
              </div>
            </div>
          `);
          lg.addLayer(polyline);
        }
      });
    }

    // 2. Render Micro-Hubs (Google Blue Pin)
    if (showHubs && mapData.hubs) {
      mapData.hubs.forEach((hub) => {
        const utilColor = hub.utilization_pct > 80 ? "#ea4335" : hub.utilization_pct > 60 ? "#f29900" : "#1a73e8";
        const hubIcon = L.divIcon({
          className: "custom-hub-marker",
          html: `
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 12px;
              background: #ffffff;
              border: 2px solid ${utilColor};
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #202124;
              box-shadow: 0 3px 10px rgba(60,64,67,0.2);
              cursor: pointer;
            ">
              <span style="font-size: 9px; font-weight: 800; color: ${utilColor};">${hub.code.replace('HUB_', 'H')}</span>
              <span style="font-size: 8px; color: #5f6368; font-weight: 600;">${Math.round(hub.utilization_pct)}%</span>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([hub.lat, hub.lng], { icon: hubIcon });
        marker.bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px;">
            <div style="font-weight: 700; color: #1a73e8; font-size: 14px;">${hub.name}</div>
            <div style="color: #5f6368; font-size: 11px; margin-bottom: 6px;">${hub.area} Urban Logistics Node</div>
            <div style="border-top: 1px solid #e8eaed; padding-top: 6px; font-size: 12px; color: #3c4043; line-height: 1.5;">
              <div>Capacity Load: <b>${hub.current_load_kg} / ${hub.max_capacity_kg} kg</b></div>
              <div>Utilization: <b style="color: ${utilColor};">${hub.utilization_pct}%</b></div>
              <div>Operating Status: <span style="color: #34a853; font-weight: bold;">${hub.status.toUpperCase()}</span></div>
            </div>
          </div>
        `);
        marker.on("click", () => onSelectHub && onSelectHub(hub));
        lg.addLayer(marker);
      });
    }

    // 3. Render Vehicles (Google Green Pin)
    if (showVehicles && mapData.vehicles) {
      mapData.vehicles.forEach((veh) => {
        const isTransit = veh.status === "in_transit";
        const vehColor = isTransit ? "#34a853" : veh.status === "loading" ? "#fbbc04" : "#5f6368";
        
        const vehIcon = L.divIcon({
          className: `custom-veh-marker ${isTransit ? "marker-pulse-blue" : ""}`,
          html: `
            <div style="
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: #ffffff;
              border: 2px solid ${vehColor};
              display: flex;
              align-items: center;
              justify-content: center;
              color: #202124;
              box-shadow: 0 2px 8px rgba(60,64,67,0.25);
              cursor: pointer;
            ">
              <span style="font-size: 11px;">
                ${veh.type === 'motorcycle' ? '🛵' : veh.type === 'ev_cargo' ? '⚡' : '🚚'}
              </span>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([veh.lat, veh.lng], { icon: vehIcon });
        marker.bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px;">
            <div style="font-weight: 700; color: #34a853; font-size: 13px;">${veh.code} • ${veh.type.replace('_', ' ').toUpperCase()}</div>
            <div style="font-size: 12px; color: #5f6368; line-height: 1.5; margin-top: 4px;">
              <div>Status: <b style="color: #202124;">${veh.status.toUpperCase()}</b></div>
              <div>Current Load: <b style="color: #202124;">${veh.current_load_kg} / ${veh.max_capacity_kg} kg (${veh.utilization_pct}%)</b></div>
              <div>Battery / Fuel: <b style="color: #202124;">${veh.battery_pct}%</b></div>
            </div>
          </div>
        `);
        marker.on("click", () => onSelectVehicle && onSelectVehicle(veh));
        lg.addLayer(marker);
      });
    }

    // 4. Render Delivery Clusters (Blue Pill Badge)
    if (showClusters && mapData.clusters) {
      mapData.clusters.forEach((cluster) => {
        const clusterIcon = L.divIcon({
          className: "custom-cluster-marker",
          html: `
            <div style="
              padding: 3px 10px;
              border-radius: 14px;
              background: #ffffff;
              border: 1.5px solid #1a73e8;
              color: #1a73e8;
              font-size: 11px;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 4px;
              box-shadow: 0 2px 8px rgba(26,115,232,0.2);
              white-space: nowrap;
            ">
              <span>📦 ${cluster.package_count} pkgs</span>
            </div>
          `,
          iconSize: [85, 26],
          iconAnchor: [42, 13],
        });

        const marker = L.marker([cluster.lat, cluster.lng], { icon: clusterIcon });
        marker.bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px;">
            <div style="font-weight: 700; color: #1a73e8; font-size: 13px;">Cluster ${cluster.code}</div>
            <div style="font-size: 12px; color: #5f6368; line-height: 1.5; margin-top: 4px;">
              <div>Consolidated Packages: <b style="color: #202124;">${cluster.package_count} items</b></div>
              <div>Combined Weight: <b style="color: #202124;">${cluster.total_weight_kg} kg</b></div>
              <div>Assigned Hub: <b style="color: #1a73e8;">Hub 0${cluster.hub_id || 1}</b></div>
            </div>
          </div>
        `);
        lg.addLayer(marker);
      });
    }

    // 5. Render Traffic Hazards / Blocked Road Closures (Google Red Badge)
    if (showTraffic && mapData.traffic_events) {
      mapData.traffic_events.forEach((te) => {
        const hazardIcon = L.divIcon({
          className: "marker-pulse-red",
          html: `
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 10px;
              background: #fce8e6;
              border: 2px solid #ea4335;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ea4335;
              font-size: 15px;
              box-shadow: 0 2px 8px rgba(234,67,53,0.3);
            ">
              ⛔
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([te.from_lat, te.from_lng], { icon: hazardIcon });
        marker.bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px;">
            <div style="font-weight: 700; color: #ea4335; font-size: 13px;">Road Incident • Closed Corridor</div>
            <div style="font-weight: 600; color: #202124; font-size: 12px; margin: 3px 0;">${te.road} (${te.area})</div>
            <div style="color: #5f6368; font-size: 11px;">${te.description}</div>
            <div style="margin-top: 4px; font-size: 11px; color: #1a73e8; font-weight: 600;">
              ✓ Dynamic Rerouting Detour Active
            </div>
          </div>
        `);
        lg.addLayer(marker);
      });
    }

    // 6. Render Sample Delivery Destination points (Yellow / Green subtle dots)
    if (showDestinations && mapData.destinations) {
      mapData.destinations.forEach((dest) => {
        const circle = L.circleMarker([dest.lat, dest.lng], {
          radius: 4.5,
          fillColor: dest.status === "DELIVERED" ? "#34a853" : "#fbbc04",
          color: "#ffffff",
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.9,
        });
        circle.bindPopup(`
          <div style="font-size: 11px; font-family: sans-serif;">
            <b>${dest.area}</b><br/>
            Code: ${dest.tracking_code}<br/>
            Weight: ${dest.weight} kg<br/>
            Status: ${dest.status}
          </div>
        `);
        lg.addLayer(circle);
      });
    }

    // 7. Render Reverse Logistics Pickups (Green Pill)
    if (showReverse && mapData.reverse_pickups) {
      mapData.reverse_pickups.forEach((rp) => {
        const revIcon = L.divIcon({
          className: "custom-reverse-marker",
          html: `
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #e6f4ea;
              border: 1.5px solid #34a853;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #137333;
              font-size: 11px;
              font-weight: bold;
              box-shadow: 0 1px 4px rgba(52,168,83,0.3);
            ">
              ↺
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        const marker = L.marker([rp.lat, rp.lng], { icon: revIcon });
        marker.bindPopup(`
          <div style="font-size: 11px; font-family: sans-serif;">
            <b style="color: #188038;">Reverse Pickup Location</b><br/>
            Item: ${rp.item}<br/>
            Customer: ${rp.customer} (${rp.area})<br/>
            Vehicle: <b>${rp.vehicle_code || 'Matched'}</b>
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
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-[#e8eaed] shadow-xs bg-white">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Top Left: Clean Google Maps-Style Filter Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-[#dadce0] shadow-md text-xs">
        <button
          onClick={() => setShowHubs(!showHubs)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            showHubs ? "bg-[#e8f0fe] text-[#1a73e8] font-semibold" : "text-[#5f6368] hover:bg-[#f1f3f4]"
          }`}
        >
          <Warehouse className="w-3.5 h-3.5" />
          Hubs
        </button>
        <button
          onClick={() => setShowVehicles(!showVehicles)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            showVehicles ? "bg-[#e6f4ea] text-[#188038] font-semibold" : "text-[#5f6368] hover:bg-[#f1f3f4]"
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Vehicles
        </button>
        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            showRoutes ? "bg-[#e8f0fe] text-[#1a73e8] font-semibold" : "text-[#5f6368] hover:bg-[#f1f3f4]"
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Routes
        </button>
        <button
          onClick={() => setShowClusters(!showClusters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            showClusters ? "bg-[#e8f0fe] text-[#1a73e8] font-semibold" : "text-[#5f6368] hover:bg-[#f1f3f4]"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Clusters
        </button>
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            showTraffic ? "bg-[#fce8e6] text-[#c5221f] font-semibold" : "text-[#5f6368] hover:bg-[#f1f3f4]"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Incidents
        </button>
        <button
          onClick={() => setShowReverse(!showReverse)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            showReverse ? "bg-[#e6f4ea] text-[#137333] font-semibold" : "text-[#5f6368] hover:bg-[#f1f3f4]"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reverse
        </button>
      </div>

      {/* Top Right: Demonstration Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {!isRerouted ? (
          <button
            onClick={onSimulateReroute}
            className="flex items-center gap-2 bg-white hover:bg-[#fce8e6] text-[#d93025] border border-[#f5c6cb] font-medium text-xs px-3.5 py-2 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            title="Demonstrate dynamic rerouting when road closure occurs on FC Road"
          >
            <AlertTriangle className="w-4 h-4 text-[#ea4335]" />
            Simulate Road Closure
          </button>
        ) : (
          <button
            onClick={onClearClosure}
            className="flex items-center gap-2 bg-[#e6f4ea] hover:bg-[#ceead6] text-[#137333] border border-[#a8dab5] font-semibold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all"
            title="Clear active incident and restore normal transit corridor"
          >
            <CheckCircle2 className="w-4 h-4 text-[#188038]" />
            Clear Incident (Restore Route)
          </button>
        )}
      </div>

      {/* Bottom Left: Clean Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#dadce0] shadow-sm text-xs text-[#5f6368] flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded bg-[#1a73e8] inline-block"></span> Micro-Hubs
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34a853] inline-block"></span> Active Fleet
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded bg-[#1a73e8] border border-[#1a73e8] inline-block"></span> Clusters
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fbbc04] inline-block"></span> Drop-offs
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded bg-[#ea4335] inline-block"></span> Closure
        </span>
      </div>
    </div>
  );
}
