"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { 
  Users, 
  ShieldCheck, 
  Truck, 
  Store, 
  User, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

interface UsersViewProps {
  onSwitchRole?: (role: string) => void;
}

export default function UsersView({ onSwitchRole }: UsersViewProps) {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<UserAccount[]>("/api/users");
      setUsers(data);
    } catch (e) {
      console.error("Failed to load users:", e);
      // Fallback initial seeds if network error
      setUsers([
        { id: 1, name: "Pune City Logistics Administrator", email: "admin@urbanflow.in", role: "admin" },
        { id: 2, name: "Vikramaditya Rao (Control Officer)", email: "operations@urbanflow.in", role: "admin" },
        { id: 3, name: "Ramesh Shinde (Fleet Agent #04)", email: "driver.ramesh@urbanflow.in", role: "driver" },
        { id: 4, name: "Suresh Pawar (EV Courier #12)", email: "driver.suresh@urbanflow.in", role: "driver" },
        { id: 5, name: "Amit Kadam (Two-Wheeler Express #21)", email: "driver.amit@urbanflow.in", role: "driver" },
        { id: 6, name: "Pune Daily Fresh Market", email: "merchant.fresh@urbanflow.in", role: "business" },
        { id: 7, name: "Deccan MedLife Pharmaceuticals", email: "merchant.medlife@urbanflow.in", role: "business" },
        { id: 8, name: "Aditi Joshi", email: "aditi.joshi@gmail.com", role: "customer" },
        { id: 9, name: "Rahul Deshmukh", email: "rahul.deshmukh@gmail.com", role: "customer" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === "ALL" || u.role.toLowerCase() === selectedRole.toLowerCase();
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <span className="uf-badge uf-badge-critical font-medium">City Administrator</span>;
      case "driver":
        return <span className="uf-badge uf-badge-info font-medium">Delivery Agent</span>;
      case "business":
        return <span className="uf-badge uf-badge-warning font-medium">Merchant Partner</span>;
      case "customer":
        return <span className="uf-badge uf-badge-success font-medium">Consumer</span>;
      default:
        return <span className="uf-badge uf-badge-neutral">{role}</span>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <ShieldCheck className="w-4 h-4 text-[#ef4444]" />;
      case "driver":
        return <Truck className="w-4 h-4 text-[#2563eb]" />;
      case "business":
        return <Store className="w-4 h-4 text-[#f59e0b]" />;
      default:
        return <User className="w-4 h-4 text-[#10b981]" />;
    }
  };

  const roleCounts = {
    admin: users.filter(u => u.role === "admin").length,
    driver: users.filter(u => u.role === "driver").length,
    business: users.filter(u => u.role === "business").length,
    customer: users.filter(u => u.role === "customer").length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#0f172a] tracking-tight">
              User Accounts & Fleet Personnel Directory
            </h1>
            <span className="uf-badge uf-badge-info font-mono text-[11px]">
              {users.length} Active Accounts
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Registered administrators, delivery courier agents, business merchants, and customer profiles across Pune.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="uf-btn-secondary text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Database</span>
        </button>
      </div>

      {/* 4 Role KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => setSelectedRole("admin")}
          className={`uf-card p-4 cursor-pointer transition-all ${
            selectedRole === "admin" ? "ring-2 ring-[#ef4444] border-transparent" : "hover:border-[#cbd5e1]"
          }`}
        >
          <div className="flex items-center justify-between text-[#64748b] mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">City Admins</span>
            <ShieldCheck className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div className="text-2xl font-bold text-[#0f172a] font-mono">{roleCounts.admin}</div>
          <span className="text-[11px] text-[#64748b]">Command center access</span>
        </div>

        <div 
          onClick={() => setSelectedRole("driver")}
          className={`uf-card p-4 cursor-pointer transition-all ${
            selectedRole === "driver" ? "ring-2 ring-[#2563eb] border-transparent" : "hover:border-[#cbd5e1]"
          }`}
        >
          <div className="flex items-center justify-between text-[#64748b] mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivery Agents</span>
            <Truck className="w-4 h-4 text-[#2563eb]" />
          </div>
          <div className="text-2xl font-bold text-[#0f172a] font-mono">{roleCounts.driver}</div>
          <span className="text-[11px] text-[#2563eb] font-medium">Fleet couriers active</span>
        </div>

        <div 
          onClick={() => setSelectedRole("business")}
          className={`uf-card p-4 cursor-pointer transition-all ${
            selectedRole === "business" ? "ring-2 ring-[#f59e0b] border-transparent" : "hover:border-[#cbd5e1]"
          }`}
        >
          <div className="flex items-center justify-between text-[#64748b] mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Merchants</span>
            <Store className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-2xl font-bold text-[#0f172a] font-mono">{roleCounts.business}</div>
          <span className="text-[11px] text-[#64748b]">Partner businesses</span>
        </div>

        <div 
          onClick={() => setSelectedRole("customer")}
          className={`uf-card p-4 cursor-pointer transition-all ${
            selectedRole === "customer" ? "ring-2 ring-[#10b981] border-transparent" : "hover:border-[#cbd5e1]"
          }`}
        >
          <div className="flex items-center justify-between text-[#64748b] mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Customers</span>
            <User className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="text-2xl font-bold text-[#0f172a] font-mono">{roleCounts.customer}</div>
          <span className="text-[11px] text-[#065f46] font-medium">Tracking shipments</span>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search accounts by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#2563eb] text-[#0f172a]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mr-1 hidden sm:inline">
            Role Filter:
          </span>
          {["ALL", "admin", "driver", "business", "customer"].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedRole === r
                  ? "bg-[#1e3a8a] text-white font-medium"
                  : "bg-[#f8f9fa] text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
              }`}
            >
              {r === "ALL" ? "All Accounts" : r === "driver" ? "Delivery Agents" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Directory Table */}
      <div className="uf-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-medium text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Account Holder</th>
                <th className="py-3 px-4">Role & Permissions</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Operating Sector</th>
                <th className="py-3 px-4">Assigned Unit</th>
                <th className="py-3 px-4 text-right">Switch Perspective</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b]">
                    Loading account registry from Urban Flow database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b]">
                    No accounts found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center shrink-0">
                          {getRoleIcon(u.role)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0f172a]">{u.name}</div>
                          <span className="text-[10px] text-[#94a3b8] font-mono">ID: ACC-00{u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#475569]">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">
                      {u.role === "driver" ? "Shivajinagar ➔ Kothrud Corridor" : u.role === "business" ? "Central Pune Merchant Grid" : "City-Wide Network"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#0f172a]">
                      {u.role === "driver" ? `EV Cargo Van UF-0${u.id}` : u.role === "business" ? "Hub 01 Dispatch" : "Command Console"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {onSwitchRole && (
                        <button
                          onClick={() => onSwitchRole(u.role)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#1e40af] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-md transition-colors"
                        >
                          View as {u.role === "driver" ? "Agent" : u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
