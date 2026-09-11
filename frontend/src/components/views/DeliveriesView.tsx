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
  Layers
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
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  
  // New package form state
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
          dest_address: address || `Near ${area} Circle`,
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
      alert("Failed to submit delivery request.");
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
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            Consignment & Package Management
          </h1>
          <p className="text-xs text-slate-400">
            Real-time status of orders progressing through the Pune logistics coordination network
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowBatchModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <UploadCloud className="w-4 h-4 text-slate-400" />
            Bulk CSV Upload
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Delivery Request
          </button>
          <button
            onClick={onTriggerOptimize}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Optimize Network
          </button>
        </div>
      </div>

      {/* Active Clusters Showcase (Section 9) */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Active Delivery Clusters Formed ({clusters.length})
          </h2>
          <span className="text-[11px] text-cyan-400">
            Intelligently grouped by Haversine proximity & Hub capacity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {clusters.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-lg bg-slate-900/90 border border-indigo-500/30 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300">{c.code}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                  CONSOLIDATED
                </span>
              </div>
              <div className="text-slate-300 font-medium">
                {c.package_count} Packages • {c.total_weight_kg} kg
              </div>
              <div className="text-[11px] text-slate-400">
                Hub: <b className="text-slate-200">Hub 0{c.hub_id || 1}</b>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                Centroid: [{c.lat.toFixed(3)}, {c.lng.toFixed(3)}]
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracking code, recipient, or Pune area..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-200 outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "CREATED", "CONSOLIDATED", "IN_TRANSIT", "DELIVERED", "RETURN_REQUESTED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                selectedStatus === st
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Sender / Merchant</th>
                <th className="py-3 px-4">Recipient & Address</th>
                <th className="py-3 px-4">Destination Area</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Network Status</th>
                <th className="py-3 px-4">Cluster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredPackages.map((p) => {
                const isConsolidated = p.status === "CONSOLIDATED" || p.status === "IN_TRANSIT" || p.status === "DELIVERED";
                return (
                  <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      {p.tracking_code}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{p.sender_name}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      <div>{p.recipient_name}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{p.dest_address}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {p.dest_area}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{p.weight_kg} kg</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.priority === "EXPRESS" ? "bg-amber-500/20 text-amber-300" : "bg-slate-800 text-slate-400"
                      }`}>
                        {p.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "DELIVERED" ? "bg-emerald-500/20 text-emerald-300" :
                        p.status === "IN_TRANSIT" ? "bg-sky-500/20 text-sky-300" :
                        p.status === "CONSOLIDATED" ? "bg-indigo-500/20 text-indigo-300" :
                        p.status === "RETURN_REQUESTED" ? "bg-teal-500/20 text-teal-300" :
                        "bg-slate-800 text-slate-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-indigo-400 font-semibold">
                      {p.cluster_id ? `UF-C00${p.cluster_id}` : "Unclustered"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Delivery Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[1200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Create New Delivery Request</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateDelivery} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Pune Area</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
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
                  <label className="block text-slate-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Plot 42, Mayur Colony, Paud Road"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="EXPRESS">Express (Time Sensitive)</option>
                    <option value="ECONOMY">Economy</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={isReverse}
                      onChange={(e) => setIsReverse(e.target.checked)}
                      className="rounded border-slate-700"
                    />
                    Reverse Return Eligible
                  </label>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
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
        <div className="fixed inset-0 z-[1200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Business Consignment Ingest</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-slate-400">
              Businesses can upload manifests containing multiple delivery orders to evaluate consolidation opportunities.
            </p>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center space-y-2">
              <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto" />
              <div className="text-xs font-semibold text-slate-200">Drag & drop CSV shipment manifest</div>
              <div className="text-[10px] text-slate-500">Supports columns: Package ID, Destination, Weight, Priority, Deadline</div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleBatchSample}
                className="px-3 py-1.5 rounded bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/50 transition-all"
              >
                Ingest Sample Enterprise Batch
              </button>
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-400 text-xs"
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
