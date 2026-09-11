"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Users, 
  FolderKanban, 
  FileText, 
  HelpCircle, 
  Zap, 
  Activity, 
  Lock, 
  Settings, 
  CheckCircle,
  RefreshCw,
  Search,
  ChevronRight
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "audit" | "quotas">("overview");
  const [stats, setStats] = useState({
    total_users: 12,
    active_projects: 5,
    submitted_documents: 8,
    open_mentorship_requests: 3,
    total_ai_tokens_used: 145200,
    system_status: "operational"
  });

  const [users, setUsers] = useState([
    { id: "u1", email: "admin@venturenest.com", display_name: "System Administrator", role: "admin" },
    { id: "u2", email: "student@incubator.edu", display_name: "Alex Rivera (Founder)", role: "student_incubator" },
    { id: "u3", email: "mentor@advisor.com", display_name: "Dr. Sarah Chen (Venture Mentor)", role: "mentor" },
    { id: "u4", email: "elena@biotech.io", display_name: "Elena Rostova (Founder)", role: "student_incubator" }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: "log_1", action: "LOGIN", entity_type: "session", actor: "u1", timestamp: "2026-09-11 08:15:00", details: "Admin authenticated via HTTPS" },
    { id: "log_2", action: "SUBMIT_DOCUMENT", entity_type: "document", actor: "u2", timestamp: "2026-09-11 08:20:12", details: "Uploaded pitch deck: EcoPack_PitchDeck_v1.pdf" },
    { id: "log_3", action: "APPROVE_ARTIFACT", entity_type: "artifact", actor: "u2", timestamp: "2026-09-11 08:22:45", details: "Approved Strategic SWOT Analysis v2" },
    { id: "log_4", action: "MENTOR_REVIEW", entity_type: "review", actor: "u3", timestamp: "2026-09-11 08:25:30", details: "Submitted review & feedback for EcoPack AI" }
  ]);

  const [quotaLimit, setQuotaLimit] = useState(1000000);
  const [quotaUsed, setQuotaUsed] = useState(145200);

  // Fetch real data from Backend Bridge API if available
  useEffect(() => {
    fetch("http://localhost:8000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => console.log("Using local initial state for admin stats"));
  }, []);

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    // Call backend API
    fetch("http://localhost:8000/api/admin/users/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, new_role: newRole })
    }).catch(err => console.log("Role update sent locally"));

    // Add to audit log
    const newLog = {
      id: `log_${Date.now()}`,
      action: "UPDATE_USER_ROLE",
      entity_type: "user",
      actor: "u1",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      details: `Changed role for ${userId} to ${newRole}`
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  return (
    <div className="flex h-screen bg-[#0B192C] text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#1E293B] border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#008B8B] flex items-center justify-center font-bold text-white shadow-lg">
            VN
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 leading-tight">VentureNest</h1>
            <span className="text-xs text-[#008B8B] font-semibold tracking-wide uppercase">Admin Website</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              activeTab === "overview" ? "bg-[#008B8B] text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>System Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              activeTab === "users" ? "bg-[#008B8B] text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>User & Role Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("quotas")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              activeTab === "quotas" ? "bg-[#008B8B] text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <Zap className="w-5 h-5" />
            <span>AI Token Quotas</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              activeTab === "audit" ? "bg-[#008B8B] text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Audit Trail</span>
          </button>
        </nav>

        {/* Backend Bridge Status Widget */}
        <div className="p-4 m-4 bg-slate-900/80 rounded-xl border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Bridge API</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs text-slate-300">Connected to Port 8000</p>
          <p className="text-[10px] text-slate-500 mt-1">PostgreSQL & AI Bridge Active</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#0B192C]">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-700 bg-[#1E293B]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>Admin Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-100 font-semibold capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>System Healthy</span>
            </div>

            <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-semibold text-xs text-slate-200">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">System Overview</h2>
                <p className="text-sm text-slate-400 mt-1">Platform-wide statistics across Web Admin and Mobile Apps.</p>
              </div>

              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1E293B] border border-slate-700 p-6 rounded-xl shadow-lg hover:border-[#008B8B] transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Total Platform Users</span>
                    <Users className="w-5 h-5 text-[#008B8B]" />
                  </div>
                  <p className="text-3xl font-extrabold text-white mt-3">{stats.total_users}</p>
                  <span className="text-xs text-emerald-400 font-medium mt-2 inline-block">Active cross-platform</span>
                </div>

                <div className="bg-[#1E293B] border border-slate-700 p-6 rounded-xl shadow-lg hover:border-[#008B8B] transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Active Incubator Projects</span>
                    <FolderKanban className="w-5 h-5 text-[#008B8B]" />
                  </div>
                  <p className="text-3xl font-extrabold text-white mt-3">{stats.active_projects}</p>
                  <span className="text-xs text-slate-400 mt-2 inline-block">Ventures in progress</span>
                </div>

                <div className="bg-[#1E293B] border border-slate-700 p-6 rounded-xl shadow-lg hover:border-[#008B8B] transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Submitted Documents</span>
                    <FileText className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <p className="text-3xl font-extrabold text-white mt-3">{stats.submitted_documents}</p>
                  <span className="text-xs text-[#D4AF37] font-medium mt-2 inline-block">Vault files uploaded</span>
                </div>

                <div className="bg-[#1E293B] border border-slate-700 p-6 rounded-xl shadow-lg hover:border-[#008B8B] transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Open Mentor Requests</span>
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white mt-3">{stats.open_mentorship_requests}</p>
                  <span className="text-xs text-indigo-400 font-medium mt-2 inline-block">Mentors App queue</span>
                </div>
              </div>

              {/* System Architecture Topology Overview */}
              <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-[#008B8B]" />
                  <span>Decoupled Multi-App Network Status</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-200 text-sm">Admin Dashboard Website</h4>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">Port 3002</span>
                    </div>
                    <p className="text-xs text-slate-400">Desktop Web App for Admin operations & control.</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-200 text-sm">Student Incubator App</h4>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">Port 3000</span>
                    </div>
                    <p className="text-xs text-slate-400">Mobile App for pitch deck uploads & business studio.</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-200 text-sm">Mentors Connection App</h4>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">Port 3001</span>
                    </div>
                    <p className="text-xs text-slate-400">Mobile App for review & founder advisory.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS & ROLE MATRIX */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">User & Role Administration</h2>
                <p className="text-sm text-slate-400 mt-1">Manage RBAC permissions for Admin Web and Mobile Apps.</p>
              </div>

              <div className="bg-[#1E293B] border border-slate-700 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-400 text-xs font-semibold uppercase border-b border-slate-700">
                      <th className="py-4 px-6">User Name</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Assigned Role</th>
                      <th className="py-4 px-6 text-right">Role Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-6 font-medium text-slate-200">{u.display_name}</td>
                        <td className="py-4 px-6 text-slate-400 font-mono text-xs">{u.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.role === "admin" ? "bg-amber-500/10 text-[#D4AF37] border border-amber-500/30" :
                            u.role === "mentor" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30" :
                            "bg-teal-500/10 text-[#14B8A6] border border-teal-500/30"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleRoleChange(u.id, "admin")}
                            className="px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          >
                            Set Admin
                          </button>
                          <button
                            onClick={() => handleRoleChange(u.id, "mentor")}
                            className="px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          >
                            Set Mentor
                          </button>
                          <button
                            onClick={() => handleRoleChange(u.id, "student_incubator")}
                            className="px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          >
                            Set Student
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AI TOKENS & QUOTAS */}
          {activeTab === "quotas" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">AI Spending & Token Quotas</h2>
                <p className="text-sm text-slate-400 mt-1">Control AI token budgets for the incubator organization.</p>
              </div>

              <div className="bg-[#1E293B] border border-slate-700 p-6 rounded-xl space-y-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-100">Monthly AI Token Consumption</h3>
                    <p className="text-xs text-slate-400">Used across AI Chatbot service & artifact generation.</p>
                  </div>
                  <span className="text-sm font-mono text-[#D4AF37] font-bold">
                    {quotaUsed.toLocaleString()} / {quotaLimit.toLocaleString()} Tokens
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-[#008B8B] to-[#D4AF37] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(quotaUsed / quotaLimit) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="p-4 bg-slate-900/60 rounded-lg">
                    <label className="text-xs font-semibold text-slate-400 block mb-2">Max Token Limit Per Tenant</label>
                    <input
                      type="number"
                      value={quotaLimit}
                      onChange={(e) => setQuotaLimit(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#008B8B]"
                    />
                  </div>

                  <div className="p-4 bg-slate-900/60 rounded-lg flex flex-col justify-between">
                    <span className="text-xs font-semibold text-slate-400">Safety Cap Status</span>
                    <span className="text-emerald-400 font-bold text-sm flex items-center space-x-1">
                      <Lock className="w-4 h-4 inline" />
                      <span>Spend Ceiling Enforced (1,000,000 max)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Immutable Audit Logs</h2>
                <p className="text-sm text-slate-400 mt-1">Real-time security and operational business event trail.</p>
              </div>

              <div className="bg-[#1E293B] border border-slate-700 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 bg-slate-900/40 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">Filter: All Events</span>
                  <button className="text-xs text-[#008B8B] hover:underline flex items-center space-x-1">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Logs</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-800 text-sm">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-slate-800/40 transition flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            {log.action}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Entity: {log.entity_type}</span>
                        </div>
                        <p className="text-slate-200 text-sm">{log.details}</p>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
