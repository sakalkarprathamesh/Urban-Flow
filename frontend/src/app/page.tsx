"use client";

import { useState, useEffect } from "react";
import { DashboardStats, MapDataResponse, MicroHub, Vehicle } from "@/types";
import { fetchApi } from "@/lib/api";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardView from "@/components/views/DashboardView";
import LiveMapView from "@/components/views/LiveMapView";
import DeliveriesView from "@/components/views/DeliveriesView";
import HubsView from "@/components/views/HubsView";
import VehiclesView from "@/components/views/VehiclesView";
import RoutesView from "@/components/views/RoutesView";
import ReverseLogisticsView from "@/components/views/ReverseLogisticsView";
import SimulationView from "@/components/views/SimulationView";
import AnalyticsView from "@/components/views/AnalyticsView";
import PlanningView from "@/components/views/PlanningView";

import AiAssistantDrawer from "@/components/AiAssistantDrawer";
import DemoFlowModal from "@/components/DemoFlowModal";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

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

      if (mapRes.routes && mapRes.routes.some((r) => r.is_rerouted)) {
        setIsRerouted(true);
      }
    } catch (err) {
      console.error("Telemetry load error:", err);
    }
  };

  useEffect(() => {
    loadTelemetry();
    const interval = setInterval(loadTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  // Action: Optimize Network
  const handleOptimizeNetwork = async () => {
    try {
      const res = await fetchApi<any>("/api/deliveries/optimize", { method: "POST" });
      await loadTelemetry();
      alert(`Network Optimization Complete: Formed ${res.new_clusters_formed} new clusters, consolidating undelivered packages!`);
    } catch (e) {
      alert("Optimization trigger failed.");
    }
  };

  // Action: Simulate Road Closure
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

  // Action: Reverse Logistics Matcher
  const handleReverseMatch = async () => {
    try {
      const res = await fetchApi<any>("/api/reverse-logistics/match", { method: "POST" });
      await loadTelemetry();
      alert(`Reverse Logistics Match Active: Paired ${res.newly_matched_pickups} return packages with returning delivery vehicles!`);
    } catch (e) {
      alert("Reverse matcher failed.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fa] text-[#0f172a] font-sans antialiased">
      
      {/* Slim Desktop Navigation Sidebar (Section 7) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAi={() => setIsAiOpen(true)}
        onStartDemoFlow={() => setIsDemoOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Platform Content */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenAi={() => setIsAiOpen(true)}
          onStartDemoFlow={() => setIsDemoOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* View Router */}
        <main className="flex-1 w-full pb-12">
          {currentTab === "overview" && (
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
            <HubsView
              hubs={mapData?.hubs || []}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === "vehicles" && (
            <VehiclesView vehicles={mapData?.vehicles || []} />
          )}

          {currentTab === "routes" && (
            <RoutesView
              routes={mapData?.routes || []}
              onNavigateToMap={() => setCurrentTab("map")}
            />
          )}

          {currentTab === "reverse" && (
            <ReverseLogisticsView
              onTriggerReverseMatch={handleReverseMatch}
            />
          )}

          {currentTab === "simulation" && (
            <SimulationView />
          )}

          {currentTab === "analytics" && (
            <AnalyticsView />
          )}

          {currentTab === "planning" && (
            <PlanningView />
          )}
        </main>
      </div>

      {/* Split-Screen Logistics Intelligence Drawer (Section 19) */}
      <AiAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

      {/* Faculty Demonstration Walkthrough Modal */}
      <DemoFlowModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigateTab={(tab) => {
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
