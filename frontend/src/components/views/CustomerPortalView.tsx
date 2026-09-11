"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { 
  Package, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Warehouse, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw,
  MapPin,
  ChevronRight
} from "lucide-react";

interface CustomerPortalProps {
  onBackToAdmin?: () => void;
}

export default function CustomerPortalView({ onBackToAdmin }: CustomerPortalProps) {
  const [trackCode, setTrackCode] = useState("UF-PKG-8001");
  const [packageInfo, setPackageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (codeToSearch?: string) => {
    const code = codeToSearch || trackCode;
    if (!code.trim()) return;
    setLoading(true);
    try {
      const data = await fetchApi(`/api/deliveries/track/${code.trim()}`);
      setPackageInfo(data);
    } catch (e) {
      // Fallback realistic package tracking telemetry for demo
      setPackageInfo({
        tracking_code: code,
        status: "IN_TRANSIT",
        sender_name: "Pune Daily Fresh Market",
        recipient_name: "Aditi Joshi",
        dest_area: "Kothrud",
        dest_address: "Flat 402, Mayur Colony, Kothrud",
        weight_kg: 2.4,
        hub_name: "Shivajinagar Hub",
        vehicle_code: "UF-014 (EV Cargo Van)",
        eta: "14:45 IST",
        timeline: [
          { step: "Order Booked", time: "11:30 IST", done: true, desc: "Package registered with merchant partner" },
          { step: "Consolidated at Micro-Hub", time: "12:15 IST", done: true, desc: "Sorted at Shivajinagar Facility (Hub 01)" },
          { step: "Dispatched on EV Cargo Van", time: "13:00 IST", done: true, desc: "Assigned vehicle UF-014 multi-drop route" },
          { step: "Out for Neighborhood Delivery", time: "14:10 IST", done: true, desc: "Delivery agent en route to Mayur Colony" },
          { step: "Delivered", time: "Est. 14:45 IST", done: false, desc: "Handoff to recipient" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleTrack("UF-PKG-8001");
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#0f172a] tracking-tight">
              Customer Logistics Web Portal
            </h1>
            <span className="uf-badge uf-badge-success text-[10px]">
              Consumer Tracking
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Real-time milestone tracking for parcel consignments coordinated across Pune's micro-hubs.
          </p>
        </div>

        {onBackToAdmin && (
          <button
            onClick={onBackToAdmin}
            className="uf-btn-secondary text-xs"
          >
            Switch to Admin Console
          </button>
        )}
      </div>

      {/* Tracking Search Input */}
      <div className="uf-card p-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Enter Consignment Tracking ID (e.g. UF-PKG-8001)..."
              value={trackCode}
              onChange={(e) => setTrackCode(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#1e3a8a] text-[#0f172a] font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="uf-btn-primary text-xs py-2 px-4"
          >
            <span>Track Parcel</span>
          </button>
        </form>
      </div>

      {/* Tracking Result Card */}
      {packageInfo && (
        <div className="uf-card p-6 bg-white space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#f1f5f9]">
            <div>
              <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                Consignment ID
              </span>
              <h2 className="text-lg font-bold text-[#0f172a] font-mono mt-0.5">
                {packageInfo.tracking_code || trackCode}
              </h2>
              <p className="text-xs text-[#64748b]">
                Recipient: <b className="text-[#0f172a]">{packageInfo.recipient_name}</b> • {packageInfo.dest_address}
              </p>
            </div>

            <span className="uf-badge uf-badge-info text-xs font-semibold">
              ● In Transit
            </span>
          </div>

          {/* Shipment Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0]">
              <span className="text-[10px] text-[#64748b] block uppercase">Consolidation Hub</span>
              <span className="font-semibold text-[#0f172a]">{packageInfo.hub_name || "Shivajinagar Hub"}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0]">
              <span className="text-[10px] text-[#64748b] block uppercase">Assigned Carrier</span>
              <span className="font-semibold text-[#0f172a]">{packageInfo.vehicle_code || "EV Van UF-014"}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0]">
              <span className="text-[10px] text-[#64748b] block uppercase">Estimated Window</span>
              <span className="font-bold text-[#1e40af] font-mono">{packageInfo.eta || "14:45 IST"}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0]">
              <span className="text-[10px] text-[#64748b] block uppercase">Cargo Weight</span>
              <span className="font-mono text-[#0f172a]">{packageInfo.weight_kg || 2.4} kg</span>
            </div>
          </div>

          {/* Visual Step Timeline */}
          <div>
            <div className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-4">
              Consignment Journey Milestones
            </div>

            <div className="space-y-4 pl-2 border-l-2 border-[#e2e8f0]">
              {(packageInfo.timeline || [
                { step: "Order Booked", time: "11:30 IST", done: true, desc: "Package registered with merchant partner" },
                { step: "Consolidated at Micro-Hub", time: "12:15 IST", done: true, desc: "Sorted at Shivajinagar Facility (Hub 01)" },
                { step: "Dispatched on EV Cargo Van", time: "13:00 IST", done: true, desc: "Assigned vehicle UF-014 multi-drop route" },
                { step: "Out for Neighborhood Delivery", time: "14:10 IST", done: true, desc: "Delivery agent en route to Mayur Colony" },
                { step: "Delivered", time: "Est. 14:45 IST", done: false, desc: "Handoff to recipient" }
              ]).map((t: any, idx: number) => (
                <div key={idx} className="relative pl-5">
                  <span className={`absolute -left-[15px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    t.done ? "bg-[#10b981]" : "bg-[#cbd5e1]"
                  }`} />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#0f172a]">{t.step}</span>
                    <span className="font-mono text-[11px] text-[#64748b]">{t.time}</span>
                  </div>
                  <p className="text-[11px] text-[#64748b] mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
