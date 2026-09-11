"use client";

import { useState, useEffect } from "react";
import { DashboardStats, MapDataResponse, MicroHub, Vehicle } from "@/types";
import { fetchApi } from "@/lib/api";

import Navbar from "@/components/Navbar";
import LandingView from "@/components/views/LandingView";
import DashboardView from "@/components/views/DashboardView";
import LiveMapView from "@/components/views/LiveMapView";
import DeliveriesView from "@/components/views/DeliveriesView";
import HubsView from "@/components/views/HubsView";
import VehiclesView from "@/components/views/VehiclesView";
import ReverseLogisticsView from "@/components/views/ReverseLogisticsView";
import SimulationView from "@/components/views/SimulationView";
import PlanningView from "@/components/views/PlanningView";
import DriverPortalView from "@/components/views/DriverPortalView";
import CustomerPortalView from "@/components/views/CustomerPortalView";

import AiAssistantDrawer from "@/components/AiAssistantDrawer";
import DemoFlowModal from "@/components/DemoFlowModal";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [currentRole, setCurrentRole] = useState<string>("admin");

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [mapData, setMapData] = useState<MapDataResponse | null>(null);
  const [isRerouted, setIsRerouted] = useState(false);
  const [rerouteDetails, setRerouteDetails] = useState<any>(null);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Load telemetry from FastAPI backend
  const loadTelemetry = async () => {
    try {
      const [statsRes, mapRes] = await Promise.all([
        fetchApi<DashboardStats>("/api/dashboard/stats"),
        fetchApi<MapDataResponse>("/api/dashboard/map-data"),
      ]);
      setStats(statsRes);
      setMapData(mapRes);

      // Check if any route is rerouted
      if (mapRes.routes && mapRes.routes.some((r) => r.is_rerouted)) {
        setIsRerouted(true);
      }
    } catch (err) {
      console.error("Telemetry load failed:", err);
    }
  };

  useEffect(() => {
    loadTelemetry();
    const interval = setInterval(loadTelemetry, 15000); // 15s auto polling
    return () => clearInterval(interval);
  }, []);

  // Action: Optimize Network (Clustering Algorithm)
  const handleOptimizeNetwork = async () => {
    try {
      const res = await fetchApi<any>("/api/deliveries/optimize", { method: "POST" });
      await loadTelemetry();
      alert(`Network Optimization Complete: Formed ${res.new_clusters_formed} new clusters, consolidating undelivered packages!`);
    } catch (e) {
      alert("Optimization trigger failed.");
    }
  };

  // Action: Simulate Road Closure & Dynamic Rerouting (Section 13)
  const handleSimulateReroute = async () => {
    try {
      const res = await fetchApi<any>("/api/routes/simulate-road-closure", {
        method: "POST",
        body: JSON.stringify({
          road_name: "Fergusson College Road",
          area: "FC Road / Deccan"
        })
      });
      setIsRerouted(true);
      setRerouteDetails(res);
      await loadTelemetry();
    } catch (e) {
      alert("Rerouting simulation failed.");
    }
  };

  // Action: Clear Road Closure
  const handleClearClosure = async () => {
    try {
      await fetchApi<any>("/api/routes/clear-road-closure", { method: "POST" });
      setIsRerouted(false);
      setRerouteDetails(null);
      await loadTelemetry();
    } catch (e) {
      alert("Clear closure failed.");
    }
  };

  // Action: Reverse Logistics Matcher (Section 14)
  const handleReverseMatch = async () => {
    try {
      const res = await fetchApi<any>("/api/reverse-logistics/match", { method: "POST" });
      await loadTelemetry();
      alert(`Reverse Logistics Piggybacking Active: Paired ${res.newly_matched_pickups} return packages with returning delivery vehicles!`);
    } catch (e) {
      alert("Reverse matcher failed.");
    }
  };

  // Handle Role Switching
  const handleSelectRole = (role: string) => {
    setCurrentRole(role);
    if (role === "driver") {
      setCurrentTab("driver");
    } else if (role === "customer") {
      setCurrentTab("customer");
    } else if (role === "business") {
      setCurrentTab("deliveries");
    } else {
      setCurrentTab("dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        onToggleAi={() => setIsAiOpen(!isAiOpen)}
        onStartDemoFlow={() => setIsDemoOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full">
        {/* Role-Specific Overrides */}
        {currentRole === "driver" && <DriverPortalView />}
        {currentRole === "customer" && <CustomerPortalView />}

        {/* Admin / Business Normal Views */}
        {currentRole !== "driver" && currentRole !== "customer" && (
          <>
            {currentTab === "landing" && (
              <LandingView onExplore={() => setCurrentTab("dashboard")} />
            )}

            {currentTab === "dashboard" && (
              <DashboardView
                stats={stats}
                mapData={mapData}
                onSimulateReroute={handleSimulateReroute}
                onClearClosure={handleClearClosure}
                onOptimizeNetwork={handleOptimizeNetwork}
                onSelectHub={(h) => {}}
                onSelectVehicle={(v) => {}}
                isRerouted={isRerouted}
                rerouteDetails={rerouteDetails}
              />
            )}

            {currentTab === "map" && (
              <LiveMapView
                mapData={mapData}
                onSimulateReroute={handleSimulateReroute}
                onClearClosure={handleClearClosure}
                isRerouted={isRerouted}
              />
            )}

            {currentTab === "deliveries" && (
              <DeliveriesView
                onTriggerOptimize={handleOptimizeNetwork}
                clusters={mapData?.clusters || []}
              />
            )}

            {currentTab === "hubs" && (
              <HubsView hubs={mapData?.hubs || []} />
            )}

            {currentTab === "vehicles" && (
              <VehiclesView vehicles={mapData?.vehicles || []} />
            )}

            {currentTab === "reverse" && (
              <ReverseLogisticsView
                onTriggerReverseMatch={handleReverseMatch}
              />
            )}

            {currentTab === "simulation" && (
              <SimulationView />
            )}

            {currentTab === "planning" && (
              <PlanningView />
            )}
          </>
        )}
      </main>

      {/* Floating Urban Intelligence Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

      {/* Faculty Demonstration Walkthrough Modal (Section 30) */}
      <DemoFlowModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigateTab={(tab) => {
          setCurrentRole("admin");
          setCurrentTab(tab);
        }}
        onTriggerOptimize={handleOptimizeNetwork}
        onTriggerRoadClosure={handleSimulateReroute}
        onTriggerReverseMatch={handleReverseMatch}
        onOpenAi={() => setIsAiOpen(true)}
      />

    </div>
  );
}
