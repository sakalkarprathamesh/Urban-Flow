"use client";

import { 
  LayoutDashboard, 
  Map, 
  Package, 
  Warehouse, 
  Truck, 
  Route, 
  RotateCcw, 
  Sliders, 
  BarChart3, 
  Bot, 
  Compass, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  Layers
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentRole: string;
  onSelectRole: (role: string) => void;
  onOpenAi: () => void;
  onStartDemoFlow: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  currentRole,
  onSelectRole,
  onOpenAi,
  onStartDemoFlow,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const mainNavItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "map", label: "Live Map", icon: Map },
    { id: "deliveries", label: "Deliveries", icon: Package },
    { id: "hubs", label: "Micro-Hubs", icon: Warehouse },
    { id: "vehicles", label: "Vehicles", icon: Truck },
    { id: "routes", label: "Routes", icon: Route },
    { id: "reverse", label: "Reverse Logistics", icon: RotateCcw },
    { id: "simulation", label: "Simulation", icon: Sliders },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "ai", label: "AI Assistant", icon: Bot, isAction: true },
  ];

  const adminNavItems = [
    { id: "planning", label: "Network Planning", icon: Compass },
    { id: "demo", label: "Faculty Demo", icon: Sparkles, isAction: true },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-[#e8eaed] flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#f1f3f4]">
          <div
            onClick={() => onSelectTab("landing")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Google-Inspired Logo Icon */}
            <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] border border-[#d2e3fc] flex items-center justify-center text-[#1a73e8] font-black text-sm">
              UF
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-base font-semibold tracking-tight text-[#202124] flex items-center gap-1">
                  Urban<span className="text-[#1a73e8]">Flow</span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-[#5f6368]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34a853]"></span>
                  <span>Pune Network</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124] transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation Section */}
        <nav className="p-3 space-y-1">
          <div className={`text-[11px] font-medium text-[#5f6368] px-3 py-1 uppercase tracking-wider ${isCollapsed ? "hidden" : "block"}`}>
            Command Center
          </div>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isAction && item.id === "ai") {
                    onOpenAi();
                  } else {
                    onSelectTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#e8f0fe] text-[#1a73e8] font-semibold"
                    : "text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124]"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#1a73e8]" : "text-[#5f6368]"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Administration Section */}
        <div className="px-3 pt-3 border-t border-[#f1f3f4] space-y-1">
          <div className={`text-[11px] font-medium text-[#5f6368] px-3 py-1 uppercase tracking-wider ${isCollapsed ? "hidden" : "block"}`}>
            Planning & Tools
          </div>

          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isAction && item.id === "demo") {
                    onStartDemoFlow();
                  } else {
                    onSelectTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#e8f0fe] text-[#1a73e8] font-semibold"
                    : "text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124]"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${item.id === "demo" ? "text-[#f29900]" : "text-[#5f6368]"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Role Switcher & User Profile */}
      <div className="p-3 border-t border-[#f1f3f4] bg-[#f8fafd]">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="text-[11px] font-medium text-[#5f6368] px-1 uppercase tracking-wider flex items-center justify-between">
              <span>View Mode</span>
              <span className="text-[10px] bg-[#e8f0fe] text-[#1a73e8] px-1.5 py-0.2 rounded font-mono font-semibold">Web</span>
            </div>

            <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-[#e8eaed]">
              {[
                { id: "admin", label: "City Admin" },
                { id: "business", label: "Business" },
                { id: "driver", label: "Delivery Agent" },
                { id: "customer", label: "Customer" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => onSelectRole(r.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all truncate ${
                    currentRole === r.id
                      ? "bg-[#1a73e8] text-white font-semibold shadow-xs"
                      : "text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-[#80868b] px-1 text-center">
              Urban Flow Web Platform v1.0
            </div>
          </div>
        ) : (
          <button
            onClick={() => onToggleCollapse()}
            className="w-full flex justify-center py-2 text-[#5f6368] hover:text-[#1a73e8]"
            title="Change Role / Settings"
          >
            <User className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
