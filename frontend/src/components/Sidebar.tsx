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
  Layers,
  Users,
  ShieldCheck,
  User,
  Store
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
  const primaryNavItems = [
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

  const secondaryNavItems = [
    { id: "planning", label: "Network Planning", icon: Compass },
    { id: "users", label: "Accounts & Directory", icon: Users },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-[#e2e8f0] flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Brand Header */}
      <div className="overflow-y-auto">
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#f1f5f9]">
          <div
            onClick={() => onSelectTab("overview")}
            className="flex items-center gap-3 cursor-pointer select-none overflow-hidden"
          >
            {/* Custom Monogram */}
            <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs tracking-tight shrink-0 shadow-xs">
              UF
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-[#0f172a] uppercase">
                  Urban Flow
                </span>
                <span className="text-[11px] text-[#64748b] truncate">
                  The second road network
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-[#64748b] hover:bg-[#f8f9fa] hover:text-[#0f172a] transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Navigation List */}
        <nav className="p-3 space-y-1">
          {!isCollapsed && (
            <div className="text-[10px] font-semibold text-[#94a3b8] px-3 py-1 uppercase tracking-wider">
              Network Operations
            </div>
          )}

          {primaryNavItems.map((item) => {
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
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-[#eff6ff] text-[#1e40af] font-semibold border-l-2 border-[#1e40af]"
                    : "text-[#475569] hover:bg-[#f8f9fa] hover:text-[#0f172a]"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1e40af]" : "text-[#64748b]"}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}

          {/* Secondary Planning & Accounts Item */}
          <div className="pt-3 mt-3 border-t border-[#f1f5f9]">
            {!isCollapsed && (
              <div className="text-[10px] font-semibold text-[#94a3b8] px-3 py-1 uppercase tracking-wider">
                Planning & Accounts
              </div>
            )}
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-[#eff6ff] text-[#1e40af] font-semibold border-l-2 border-[#1e40af]"
                      : "text-[#475569] hover:bg-[#f8f9fa] hover:text-[#0f172a]"
                  } ${isCollapsed ? "justify-center px-0" : ""}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1e40af]" : "text-[#64748b]"}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Bottom: Active Perspective Switcher & Account Badge */}
      <div className="p-3 border-t border-[#f1f5f9] bg-[#f8f9fa] space-y-2.5">
        {!isCollapsed ? (
          <>
            {/* Faculty Presentation Demo Launcher */}
            <button
              onClick={onStartDemoFlow}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] hover:bg-[#f1f5f9] transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Faculty Presentation Demo</span>
            </button>

            {/* Stakeholder Account Switcher */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider px-1">
                <span>Active Account Persona</span>
              </div>

              <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-lg border border-[#e2e8f0]">
                {[
                  { id: "admin", label: "Admin", sub: "admin@urbanflow.in" },
                  { id: "driver", label: "Agent #04", sub: "driver.ramesh@urbanflow.in" },
                  { id: "business", label: "Merchant", sub: "merchant.fresh@urbanflow.in" },
                  { id: "customer", label: "Consumer", sub: "aditi.joshi@gmail.com" },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSelectRole(r.id)}
                    className={`py-1.5 px-2 rounded-md text-xs font-medium transition-all text-left truncate ${
                      currentRole === r.id
                        ? "bg-[#1e3a8a] text-white font-semibold shadow-2xs"
                        : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                    }`}
                    title={r.sub}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-[11px] text-[#64748b]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                <span className="text-[10px]">Pune Pilot Network</span>
              </div>
              <span className="font-mono text-[10px] text-[#94a3b8]">v1.0</span>
            </div>
          </>
        ) : (
          <div className="space-y-2 flex flex-col items-center">
            <button
              onClick={onStartDemoFlow}
              className="p-2 rounded-lg text-[#f59e0b] hover:bg-white"
              title="Faculty Presentation Demo"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectRole(currentRole === "admin" ? "driver" : "admin")}
              className="p-2 rounded-lg text-[#1e3a8a] hover:bg-white"
              title={`Switch Persona (Current: ${currentRole})`}
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
