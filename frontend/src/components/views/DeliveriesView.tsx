"use client";

import { useState, useEffect } from "react";
import { PackageItem, DeliveryCluster } from "@/types";
import { fetchApi } from "@/lib/api";
import { 
  Package, 
  Plus, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Warehouse,
  X,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  MapPin
} from "lucide-react";

interface DeliveriesProps {
  onTriggerOptimize: () => void;
  clusters: DeliveryCluster[];
}

export default function DeliveriesView({ onTriggerOptimize, clusters }: DeliveriesProps) {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<PackageItem[]>("/api/deliveries?limit=100");
      setPackages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  // Filter packages based on search query, status, and priority
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = 
      pkg.tracking_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.dest_area?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "ALL" || 
      pkg.status?.toUpperCase() === selectedStatus;

    const matchesPriority = 
      selectedPriority === "ALL" || 
      pkg.priority?.toUpperCase() === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return <span className="uf-badge uf-badge-success">Delivered</span>;
      case "IN_TRANSIT":
        return <span className="uf-badge uf-badge-info">In Transit</span>;
      case "CONSOLIDATED":
        return <span className="uf-badge uf-badge-neutral font-mono">Consolidated</span>;
      case "PENDING":
        return <span className="uf-badge uf-badge-warning">Pending Hub</span>;
      default:
        return <span className="uf-badge uf-badge-neutral">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "URGENT":
        return <span className="text-[11px] font-semibold text-[#ef4444] flex items-center gap-1">● Urgent</span>;
      case "HIGH":
        return <span className="text-[11px] font-medium text-[#f59e0b] flex items-center gap-1">● High</span>;
      default:
        return <span className="text-[11px] text-[#64748b]">Standard</span>;
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#0f172a] tracking-tight">
              Delivery Manifest & Consolidation
            </h1>
            <span className="uf-badge uf-badge-info font-mono text-[11px]">
              {packages.length} Consignments
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Consolidated parcel orders across Pune neighborhood corridors and micro-hub sorting nodes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onTriggerOptimize}
            className="uf-btn-primary text-xs shadow-xs"
            title="Spatially cluster unassigned packages into micro-hubs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimize Spatial Clusters</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-2xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search by Tracking ID, Area, or Recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#2563eb] text-[#0f172a]"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mr-1 hidden sm:inline">
            Status:
          </span>
          {["ALL", "IN_TRANSIT", "CONSOLIDATED", "PENDING", "DELIVERED"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedStatus === status
                  ? "bg-[#1e3a8a] text-white font-medium"
                  : "bg-[#f8f9fa] text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
              }`}
            >
              {status === "ALL" ? "All Orders" : status.replace('_', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* Clean Manifest Table */}
      <div className="uf-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-medium text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Delivery ID</th>
                <th className="py-3 px-4">Pickup Origin</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Hub</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#64748b]">
                    Loading delivery manifest from Pune network database...
                  </td>
                </tr>
              ) : filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#64748b]">
                    <Package className="w-8 h-8 text-[#cbd5e1] mx-auto mb-2" />
                    <p className="font-semibold text-[#0f172a]">No deliveries found</p>
                    <p className="text-xs text-[#94a3b8]">Try modifying your search or status filter</p>
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <tr
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-[#eff6ff]" 
                          : "hover:bg-[#f8f9fa]"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-medium text-[#1e40af]">
                        {pkg.tracking_number}
                      </td>
                      <td className="py-3 px-4 text-[#475569]">
                        Shivajinagar Central
                      </td>
                      <td className="py-3 px-4 font-medium text-[#0f172a]">
                        {pkg.dest_area}
                        <span className="block text-[11px] text-[#94a3b8] font-normal truncate max-w-[160px]">
                          {pkg.dest_address}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#475569]">
                        <span className="font-mono">{pkg.weight_kg} kg</span>
                        <span className="text-[#94a3b8] text-[10px] block capitalize">{pkg.size_category}</span>
                      </td>
                      <td className="py-3 px-4">
                        {getPriorityBadge(pkg.priority)}
                      </td>
                      <td className="py-3 px-4 text-[#475569] font-mono">
                        {pkg.assigned_vehicle_id ? `V-${String(pkg.assigned_vehicle_id).padStart(2, '0')}` : "—"}
                      </td>
                      <td className="py-3 px-4 text-[#475569]">
                        {pkg.assigned_hub_id ? `Hub 0${pkg.assigned_hub_id}` : "Pending"}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(pkg.status)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#475569]">
                        {pkg.estimated_delivery_time ? new Date(pkg.estimated_delivery_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "18:30 IST"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Delivery Journey Drawer (Progressive Disclosure) */}
      {selectedPackage && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-[#e2e8f0] shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
            <div>
              <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                Consignment Telemetry
              </span>
              <h2 className="text-base font-bold text-[#0f172a] font-mono mt-0.5">
                {selectedPackage.tracking_number}
              </h2>
            </div>
            <button
              onClick={() => setSelectedPackage(null)}
              className="p-1 text-[#94a3b8] hover:text-[#0f172a] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 space-y-5 text-xs">
            {/* Status overview */}
            <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#64748b] block">Current Stage</span>
                <span className="font-semibold text-[#0f172a] capitalize">{selectedPackage.status?.replace('_', ' ')}</span>
              </div>
              {getStatusBadge(selectedPackage.status)}
            </div>

            {/* Lifecycle Timeline */}
            <div>
              <div className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
                Lifecycle Timeline
              </div>
              <div className="space-y-3 pl-2 border-l-2 border-[#e2e8f0]">
                <div className="relative pl-4">
                  <span className="absolute -left-[13px] top-0.5 w-3 h-3 rounded-full bg-[#10b981] border-2 border-white"></span>
                  <div className="font-semibold text-[#0f172a]">Package Ingested</div>
                  <div className="text-[11px] text-[#64748b]">Registered into Pune logistics network manifest</div>
                </div>
                <div className="relative pl-4">
                  <span className="absolute -left-[13px] top-0.5 w-3 h-3 rounded-full bg-[#10b981] border-2 border-white"></span>
                  <div className="font-semibold text-[#0f172a]">Consolidated at Hub</div>
                  <div className="text-[11px] text-[#64748b]">Assigned to Hub 0{selectedPackage.assigned_hub_id || 1} ({selectedPackage.dest_area} zone)</div>
                </div>
                <div className="relative pl-4">
                  <span className={`absolute -left-[13px] top-0.5 w-3 h-3 rounded-full border-2 border-white ${selectedPackage.status === 'DELIVERED' || selectedPackage.status === 'IN_TRANSIT' ? 'bg-[#2563eb]' : 'bg-[#cbd5e1]'}`}></span>
                  <div className="font-semibold text-[#0f172a]">Dispatched on Electric Cargo Van</div>
                  <div className="text-[11px] text-[#64748b]">Assigned vehicle V-0{selectedPackage.assigned_vehicle_id || 4} multi-drop route</div>
                </div>
                <div className="relative pl-4">
                  <span className={`absolute -left-[13px] top-0.5 w-3 h-3 rounded-full border-2 border-white ${selectedPackage.status === 'DELIVERED' ? 'bg-[#10b981]' : 'bg-[#cbd5e1]'}`}></span>
                  <div className="font-semibold text-[#0f172a]">Final Delivery Verification</div>
                  <div className="text-[11px] text-[#64748b]">Estimated handoff to {selectedPackage.recipient_name}</div>
                </div>
              </div>
            </div>

            {/* Consignment Attributes */}
            <div className="pt-3 border-t border-[#f1f5f9] space-y-2">
              <div className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-1">
                Shipment Attributes
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Recipient:</span>
                <span className="font-medium text-[#0f172a]">{selectedPackage.recipient_name}</span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Destination Area:</span>
                <span className="font-medium text-[#0f172a]">{selectedPackage.dest_area}</span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Full Address:</span>
                <span className="font-medium text-[#0f172a] text-right truncate max-w-[200px]">{selectedPackage.dest_address}</span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Weight / Size:</span>
                <span className="font-mono text-[#0f172a]">{selectedPackage.weight_kg} kg ({selectedPackage.size_category})</span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Corridor Priority:</span>
                <span className="font-semibold text-[#0f172a]">{selectedPackage.priority}</span>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-4">
              <button
                onClick={() => setSelectedPackage(null)}
                className="w-full uf-btn-secondary text-xs"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
