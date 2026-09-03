"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Flame,
  Clock,
  Sparkles,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Lock,
  ArrowUpDown,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  DollarSign,
  FileText,
  X,
  PhoneCall,
  Columns,
  List,
} from "lucide-react";
import { Lead } from "@/lib/validations";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import NotificationCenter from "@/components/admin/NotificationCenter";
import GlobalSearchModal from "@/components/admin/GlobalSearchModal";
import PipelineBoard from "@/components/admin/PipelineBoard";
import FollowUpsModule from "@/components/admin/FollowUpsModule";
import ProjectsModule from "@/components/admin/ProjectsModule";
import RevenueModule from "@/components/admin/RevenueModule";
import TasksModule from "@/components/admin/TasksModule";
import MeetingsModule from "@/components/admin/MeetingsModule";
import AnalyticsModule from "@/components/admin/AnalyticsModule";
import ClientsModule from "@/components/admin/ClientsModule";
import SettingsModule from "@/components/admin/SettingsModule";
import {
  initialClients,
  initialProjects,
  initialTasks,
  initialMeetings,
  initialFollowUps,
  initialCommunications,
  initialRevenues,
  initialNotifications,
} from "@/lib/businessStore";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [leadsViewMode, setLeadsViewMode] = useState<"table" | "pipeline">("table");

  // Existing Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"ALL" | "HOT" | "WARM" | "COLD">("ALL");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [callStatusNotice, setCallStatusNotice] = useState<string | null>(null);

  // Operational State
  const [clients, setClients] = useState(initialClients);
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [meetings, setMeetings] = useState(initialMeetings);
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [communications, setCommunications] = useState(initialCommunications);
  const [revenues, setRevenues] = useState(initialRevenues);
  const [notifications, setNotifications] = useState(initialNotifications);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Check session token with server
    const savedToken = sessionStorage.getItem("rio_admin_session");
    if (savedToken) {
      fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: savedToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem("rio_admin_session");
          }
        })
        .catch(() => {});
    }
    fetchLeads();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    setIsAuthenticating(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (data.authenticated && data.token) {
        setIsAuthenticated(true);
        sessionStorage.setItem("rio_admin_session", data.token);
        setPasscodeError(false);
      } else {
        setPasscodeError(true);
      }
    } catch {
      setPasscodeError(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleTriggerVapiCall = async (lead: Lead | { phone?: string; name?: string }) => {
    if (!lead.phone) {
      alert("No phone number on record for this lead.");
      return;
    }

    setCallStatusNotice(`Calling ${lead.name} at ${lead.phone}...`);
    try {
      const res = await fetch("/api/calls/vapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: lead.phone,
          leadName: lead.name,
          projectType: (lead as any).project_type || "Business Consultation",
          requirements: (lead as any).requirements || "Discussing project requirements",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCallStatusNotice(`Outbound AI phone call initiated successfully! Call ID: ${data.callId || "Vapi Call"}`);
      } else {
        setCallStatusNotice("Failed to trigger call. Check Vapi configuration.");
      }
    } catch (err) {
      setCallStatusNotice("Error initiating Vapi call.");
    }

    setTimeout(() => setCallStatusNotice(null), 6000);
  };

  const exportToCSV = () => {
    const headers = ["ID,Name,Email,Phone,Business,Project Type,Budget,Timeline,Score,Requirements,Created At\n"];
    const rows = filteredLeads.map((l) =>
      `"${l.id}","${l.name}","${l.email}","${l.phone || ""}","${l.business_name || ""}","${l.project_type}","${l.budget}","${l.timeline}","${l.lead_score}","${(l.requirements || "").replace(/"/g, '""')}","${l.created_at}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `rio-leads-export-${new Date().toISOString().split("T")[0]}.csv`);
    a.click();
  };

  // Metrics
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.lead_score === "HOT").length;
  const warmLeads = leads.filter((l) => l.lead_score === "WARM").length;
  const coldLeads = leads.filter((l) => l.lead_score === "COLD").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayLeads = leads.filter((l) => (l.created_at || "").startsWith(todayStr)).length;

  const filteredLeads = leads.filter((l) => {
    const matchesScore = scoreFilter === "ALL" || l.lead_score === scoreFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.business_name && l.business_name.toLowerCase().includes(q)) ||
      (l.requirements && l.requirements.toLowerCase().includes(q)) ||
      l.project_type.toLowerCase().includes(q);
    return matchesScore && matchesSearch;
  });

  const sidebarCounts = {
    leads: leads.length,
    followups: followUps.filter((f) => f.status !== "Closed Won" && f.status !== "Closed Lost").length,
    activeProjects: projects.filter((p) => p.status === "Active").length,
    tasks: tasks.filter((t) => t.status !== "Completed").length,
    meetings: meetings.filter((m) => m.status === "Scheduled").length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl text-center">
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 mb-1">RIO Admin Portal</h1>
          <p className="text-xs text-slate-400 mb-6">
            Authorized access for Annu Jaswanth to view qualified leads and AI transcripts.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                placeholder="Enter Administrator Passcode"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {passcodeError && (
                <p className="text-xs text-red-400 mt-1.5 text-left">
                  Access denied. Incorrect administrator passcode.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all disabled:opacity-50"
            >
              {isAuthenticating ? "Verifying Access..." : "Authenticate to Dashboard"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            <a href="/" className="hover:text-emerald-400 transition-colors">
              ← Return to Annu's Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Common Preserved Dashboard View (renders identically as approved)
  const renderDashboardLeadCenter = () => (
    <>
      {/* Call notification alert */}
      {callStatusNotice && (
        <div className="max-w-7xl mx-auto mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>{callStatusNotice}</span>
          </div>
          <button onClick={() => setCallStatusNotice(null)} className="text-emerald-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-4 my-8">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Leads</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mt-2 text-slate-100">{totalLeads}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Captured by RIO</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today's Inquiries</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mt-2 text-teal-400">{todayLeads}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Past 24 hours</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-red-500/20 bg-red-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400">Hot Leads</span>
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mt-2 text-red-400">{hotLeads}</div>
          <span className="text-[10px] text-red-400/70 mt-1 block">Budget &gt; ₹20k / Urgent</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400">Warm Leads</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mt-2 text-amber-400">{warmLeads}</div>
          <span className="text-[10px] text-amber-400/70 mt-1 block">Needs scoping call</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cold Leads</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mt-2 text-slate-400">{coldLeads}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Browsing / Informational</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, email, project..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {(["ALL", "HOT", "WARM", "COLD"] as const).map((score) => (
            <button
              key={score}
              onClick={() => setScoreFilter(score)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                scoreFilter === score
                  ? score === "HOT"
                    ? "bg-red-500 text-white font-bold"
                    : score === "WARM"
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : score === "COLD"
                    ? "bg-slate-700 text-slate-200 font-bold"
                    : "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {score}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Prospect</th>
                <th className="py-3.5 px-4 font-semibold">Company / Use Case</th>
                <th className="py-3.5 px-4 font-semibold">Project Type</th>
                <th className="py-3.5 px-4 font-semibold">Budget & Timeline</th>
                <th className="py-3.5 px-4 font-semibold">Qualification</th>
                <th className="py-3.5 px-4 font-semibold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 text-sm">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-slate-900/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.email}</div>
                      {lead.phone && <div className="text-[11px] text-emerald-400/90">{lead.phone}</div>}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">
                        {lead.business_name || "Individual / Startup"}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {lead.requirements ? lead.requirements.substring(0, 50) + "..." : "No specific notes"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="rounded bg-slate-800/80 px-2 py-1 text-xs text-slate-300 border border-slate-700/60">
                        {lead.project_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400">{lead.budget}</div>
                      <div className="text-[11px] text-slate-400">{lead.timeline}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          lead.lead_score === "HOT"
                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                            : lead.lead_score === "WARM"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-slate-700/20 text-slate-400 border-slate-700/40"
                        }`}
                      >
                        {lead.lead_score === "HOT" && <Flame className="w-3 h-3 mr-1" />}
                        {lead.lead_score}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {lead.phone && (
                          <button
                            onClick={() => handleTriggerVapiCall(lead)}
                            title="Trigger Vapi AI Outbound Call"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={`mailto:${lead.email}?subject=Regarding%20your%20project%20inquiry%20-%20Annu%20Jaswanth`}
                          title="Send Email"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Collapsible Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        counts={sidebarCounts}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-4 sm:p-8 flex flex-col justify-between overflow-x-hidden">
        <div>
          {/* Top Bar (Preserved and Enhanced with Notification Center and Global Search) */}
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  RIO <span className="gradient-text-green">Executive Lead Center</span>
                </h1>
                <span className="flex items-center text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Live Sync
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real-time qualified pipeline for Annu Jaswanth • Notifications routed to <span className="text-slate-300">annujaswanth15@gmail.com</span>
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              {/* Global Search Shortcut */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors text-slate-300"
                title="Global Search (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Search</span>
                <kbd className="hidden md:inline-block text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
                  Ctrl K
                </kbd>
              </button>

              {/* Notification Center */}
              <NotificationCenter
                notifications={notifications}
                onMarkAllRead={() =>
                  setNotifications(notifications.map((n) => ({ ...n, unread: false })))
                }
              />

              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors text-slate-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <a
                href="/"
                className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors flex items-center space-x-1.5"
              >
                <span className="hidden sm:inline">Live Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  sessionStorage.removeItem("rio_admin_session");
                  sessionStorage.removeItem("rio_admin_auth");
                }}
                className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1"
              >
                Lock
              </button>
            </div>
          </div>

          {/* Render Active View */}
          <div className="mt-6 max-w-7xl mx-auto">
            {activeTab === "dashboard" && renderDashboardLeadCenter()}

            {activeTab === "leads" && (
              <div className="space-y-6">
                {/* View Mode Switcher */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">Leads & Inbound Inquiries</h2>
                    <p className="text-xs text-slate-400">
                      Switch between executive table view and interactive drag-and-drop pipeline board.
                    </p>
                  </div>

                  <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => setLeadsViewMode("table")}
                      className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        leadsViewMode === "table"
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Table View</span>
                    </button>
                    <button
                      onClick={() => setLeadsViewMode("pipeline")}
                      className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        leadsViewMode === "pipeline"
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span>Pipeline Board</span>
                    </button>
                  </div>
                </div>

                {leadsViewMode === "table" ? (
                  renderDashboardLeadCenter()
                ) : (
                  <PipelineBoard leads={leads} onSelectLead={(lead) => setSelectedLead(lead)} />
                )}
              </div>
            )}

            {activeTab === "followups" && (
              <FollowUpsModule
                followUps={followUps}
                communications={communications}
                onTriggerCall={(phone, name) => handleTriggerVapiCall({ phone, name })}
              />
            )}

            {activeTab === "clients" && (
              <ClientsModule clients={clients} communications={communications} />
            )}

            {activeTab === "projects" && <ProjectsModule projects={projects} />}

            {activeTab === "revenue" && <RevenueModule revenues={revenues} />}

            {activeTab === "meetings" && <MeetingsModule meetings={meetings} />}

            {activeTab === "tasks" && <TasksModule tasks={tasks} />}

            {activeTab === "analytics" && (
              <AnalyticsModule
                leadCount={leads.length}
                hotLeadCount={hotLeads}
                projectCount={projects.length}
              />
            )}

            {activeTab === "settings" && <SettingsModule />}
          </div>
        </div>

        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={(tab) => {
            setActiveTab(tab);
            setIsSearchOpen(false);
          }}
          leads={leads}
          clients={clients}
          projects={projects}
          tasks={tasks}
          meetings={meetings}
        />

        {/* Lead Detail Drawer / Modal (Preserved verbatim) */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-slate-100">{selectedLead.name}</h2>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        selectedLead.lead_score === "HOT"
                          ? "bg-red-500 text-white"
                          : selectedLead.lead_score === "WARM"
                          ? "bg-amber-500 text-slate-950"
                          : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      {selectedLead.lead_score} LEAD
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Received: {new Date(selectedLead.created_at || "").toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 block">Email Address</span>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="text-emerald-400 font-medium text-sm hover:underline"
                  >
                    {selectedLead.email}
                  </a>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 block">Phone / WhatsApp</span>
                  <span className="text-slate-200 font-medium text-sm">
                    {selectedLead.phone || "Not specified"}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 block">Budget Ballpark</span>
                  <span className="text-emerald-400 font-bold text-sm">{selectedLead.budget}</span>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 block">Target Timeline</span>
                  <span className="text-slate-200 font-medium text-sm">{selectedLead.timeline}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Project Type & Company
                  </h4>
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200">
                    <div className="font-semibold text-slate-100">{selectedLead.project_type}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Company: {selectedLead.business_name || "Independent / Startup"}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Client Requirements & Dialogue Scope
                  </h4>
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.requirements || "No additional requirements notes logged."}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    RIO AI Qualification Rationale
                  </h4>
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300">
                    {selectedLead.summary || "Qualified via RIO conversation."}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                {selectedLead.phone && (
                  <button
                    onClick={() => handleTriggerVapiCall(selectedLead)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40 text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Launch Vapi AI Call</span>
                  </button>
                )}
                <a
                  href={`mailto:${selectedLead.email}?subject=Strategy%20Follow-up%20-%20Annu%20Jaswanth`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Compose Email</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
