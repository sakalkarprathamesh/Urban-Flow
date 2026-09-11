"use client";

import { useState, useEffect } from "react";
import { PackageItem, DeliveryCluster } from "@/types";
import { fetchApi } from "@/lib/api";
import { 
  Package, 
  Plus, 
  UploadCloud, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Truck, 
  RotateCcw,
  Layers,
  ChevronDown
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
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  
  // Form fields
  const [recipient, setRecipient] = useState("");
  const [area, setArea] = useState("Kothrud");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState(2.5);
  const [priority, setPriority] = useState("STANDARD");
  const [isReverse, setIsReverse] = useState(false);

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

  const handleCreateDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/api/deliveries", {
        method: "POST",
        body: JSON.stringify({
          recipient_name: recipient,
          dest_area: area,
          dest_address: address || `Near ${area} Market`,
          dest_lat: area === "Kothrud" ? 18.5074 : area === "Hinjewadi" ? 18.5912 : 18.5679,
          dest_lng: area === "Kothrud" ? 73.8077 : area === "Hinjewadi" ? 73.7389 : 73.9143,
          weight_kg: Number(weight),
          priority: priority,
          is_reverse_eligible: isReverse,
          deadline: priority === "EXPRESS" ? "17:00" : "20:00"
        })
      });
      setShowCreateModal(false);
      setRecipient("");
      setAddress("");
      loadPackages();
    } catch (err) {
      alert("Failed to create shipment order.");
    }
  };

  const handleBatchSample = async () => {
    const sampleBatch = [
      { sender_name: "Pune Electronics Corp", recipient_name: "Tech Sol, Hinjewadi", dest_lat: 18.5912, dest_lng: 73.7389, dest_area: "Hinjewadi", dest_address: "Tech Hub Phase 1", weight_kg: 5.2, priority: "EXPRESS" },
      { sender_name: "Pune Fresh Groceries", recipient_name: "Sunita G., Kothrud", dest_lat: 18.5080, dest_lng: 73.8110, dest_area: "Kothrud", dest_address: "Mayur Colony", weight_kg: 3.5, priority: "STANDARD" },
      { sender_name: "MedLife Pharmaceuticals", recipient_name: "Deccan Diagnostics", dest_lat: 18.5245, dest_lng: 73.8402, dest_area: "FC Road / Deccan", dest_address: "FC Road Plaza", weight_kg: 1.2, priority: "EXPRESS" },
      { sender_name: "EastPune Organics", recipient_name: "Viman Nagar Resident", dest_lat: 18.5679, dest_lng: 73.9143, dest_area: "Viman Nagar", dest_address: "Symbiosis Road", weight_kg: 4.1, priority: "STANDARD" },
    ];
    try {
      await fetchApi("/api/deliveries/batch", {
        method: "POST",
        body: JSON.stringify(sampleBatch)
      });
      setShowBatchModal(false);
      loadPackages();
    } catch (e) {
      alert("Batch ingest failed.");
    }
  };

  const filteredPackages = packages.filter((p) => {
    const matchesSearch = p.tracking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.dest_area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.recipient_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#202124] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#1a73e8]" />
            Deliveries & Spatial Clustering
          </h1>
          <p className="text-xs text-[#5f6368]">
            Coordinated goods manifest for the Pune urban network
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBatchModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#f8f9fa] text-[#5f6368] hover:text-[#202124] text-xs font-medium border border-[#dadce0] shadow-xs transition-all"
          >
            <UploadCloud className="w-4 h-4 text-[#5f6368]" />
            <span>Upload Manifest (CSV)</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Delivery</span>
          </button>
          <button
            onClick={onTriggerOptimize}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] text-xs font-semibold border border-[#d2e3fc] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Optimize Network</span>
          </button>
        </div>
      </div>

      {/* Active Clusters Card (Item 9 from spec) */}
      <div className="google-card p-5 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1a73e8]" />
            Active Delivery Clusters Formed ({clusters.length})
          </h2>
          <span className="text-[11px] text-[#5f6368]">
            Grouped by Haversine proximity & Hub capacity thresholds
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {clusters.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#e8eaed] text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1a73e8]">{c.code}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#188038] font-semibold">
                  Consolidated
                </span>
              </div>
              <div className="text-[#202124] font-medium pt-1">
                {c.package_count} Packages • {c.total_weight_kg} kg
              </div>
              <div className="text-[11px] text-[#5f6368]">
                Assigned: <b className="text-[#202124]">Hub 0{c.hub_id || 1}</b>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#e8eaed]">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-[#5f6368] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search delivery ID, business, recipient, or Pune area..."
            className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#202124] outline-none focus:border-[#1a73e8] focus:bg-white transition-all placeholder:text-[#80868b]"
          />
        </div>

        {/* Status Chips (Item 11) */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "ALL", label: "All" },
            { id: "CREATED", label: "Created" },
            { id: "ASSIGNED", label: "Assigned" },
            { id: "AT_MICRO_HUB", label: "At Micro-Hub" },
            { id: "CONSOLIDATED", label: "Consolidated" },
            { id: "IN_TRANSIT", label: "In Transit" },
            { id: "DELIVERED", label: "Delivered" },
            { id: "RETURN_REQUESTED", label: "Return Requested" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedStatus === st.id
                  ? "bg-[#1a73e8] text-white font-semibold"
                  : "bg-[#f1f3f4] text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed]"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table (Item 11 columns) */}
      <div className="google-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafd] text-[#5f6368] uppercase tracking-wider font-semibold text-[11px] border-b border-[#e8eaed]">
              <tr>
                <th className="py-3 px-4">Delivery ID</th>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Hub</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4] text-[#3c4043]">
              {filteredPackages.map((p) => {
                const isDelivered = p.status === "DELIVERED";
                const isTransit = p.status === "IN_TRANSIT";
                const isConsolidated = p.status === "CONSOLIDATED";
                const isReturn = p.status === "RETURN_REQUESTED";

                const chipClass = isDelivered
                  ? "bg-[#e6f4ea] text-[#137333]"
                  : isTransit
                  ? "bg-[#e8f0fe] text-[#1a73e8]"
                  : isConsolidated
                  ? "bg-[#e8f0fe] text-[#1a73e8]"
                  : isReturn
                  ? "bg-[#fef7e0] text-[#b06000]"
                  : "bg-[#f1f3f4] text-[#5f6368]";

                return (
                  <tr key={p.id} className="hover:bg-[#f8fafd] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#202124]">
                      {p.tracking_code}
                    </td>
                    <td className="py-3.5 px-4 text-[#5f6368]">
                      {p.sender_name}
                    </td>
                    <td className="py-3.5 px-4 text-[#202124] font-medium">
                      {p.recipient_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#202124]">{p.dest_area}</span>
                      <div className="text-[11px] text-[#80868b] truncate max-w-[160px]">{p.dest_address}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#5f6368]">
                      {p.weight_kg} kg
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        p.priority === "EXPRESS" ? "bg-[#fce8e6] text-[#c5221f]" : "bg-[#f1f3f4] text-[#5f6368]"
                      }`}>
                        {p.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#1a73e8]">
                      Hub 0{p.assigned_hub_id || 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${chipClass}`}>
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#5f6368]">
                      {p.deadline || "18:00"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Delivery Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[1200] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#dadce0] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#e8eaed]">
              <h3 className="text-base font-bold text-[#202124]">Create Delivery Request</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#5f6368] hover:text-[#202124]">✕</button>
            </div>
            <form onSubmit={handleCreateDelivery} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#5f6368] mb-1 font-medium">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-2 text-[#202124] outline-none focus:border-[#1a73e8] focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#5f6368] mb-1 font-medium">Pune Area</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-2 text-[#202124] outline-none"
                  >
                    <option value="Kothrud">Kothrud</option>
                    <option value="Shivajinagar">Shivajinagar</option>
                    <option value="Hinjewadi">Hinjewadi</option>
                    <option value="Viman Nagar">Viman Nagar</option>
                    <option value="Baner">Baner</option>
                    <option value="Hadapsar">Hadapsar</option>
                    <option value="FC Road / Deccan">FC Road / Deccan</option>
                    <option value="Swargate">Swargate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5f6368] mb-1 font-medium">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-2 text-[#202124] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#5f6368] mb-1 font-medium">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Plot 42, Paud Road, Kothrud"
                  className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-2 text-[#202124] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#5f6368] mb-1 font-medium">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-2 text-[#202124] outline-none"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="EXPRESS">Express (Time Sensitive)</option>
                    <option value="ECONOMY">Economy</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-[#3c4043]">
                    <input
                      type="checkbox"
                      checked={isReverse}
                      onChange={(e) => setIsReverse(e.target.checked)}
                      className="rounded border-[#dadce0] text-[#1a73e8]"
                    />
                    Reverse Return Eligible
                  </label>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Upload Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-[1200] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#dadce0] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#e8eaed]">
              <h3 className="text-base font-bold text-[#202124]">Business Manifest Ingest</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-[#5f6368] hover:text-[#202124]">✕</button>
            </div>
            <p className="text-xs text-[#5f6368]">
              Upload CSV manifests to identify multi-merchant consolidation opportunities across Pune.
            </p>
            <div className="border-2 border-dashed border-[#dadce0] rounded-2xl p-6 text-center space-y-2 bg-[#f8fafd]">
              <UploadCloud className="w-8 h-8 text-[#1a73e8] mx-auto" />
              <div className="text-xs font-medium text-[#202124]">Drop shipment manifest here</div>
              <div className="text-[11px] text-[#80868b]">Supported columns: Delivery ID, Business, Destination, Weight, Priority</div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleBatchSample}
                className="px-3 py-1.5 rounded-lg bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] text-xs font-semibold hover:bg-[#d2e3fc]"
              >
                Ingest Sample Consignment
              </button>
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-[#dadce0] text-[#5f6368] text-xs hover:bg-[#f1f3f4]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
