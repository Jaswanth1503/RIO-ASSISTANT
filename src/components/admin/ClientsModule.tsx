"use client";

import React, { useState, useEffect } from "react";
import {
  Client,
  Project,
  Meeting,
  Proposal,
  RevenueRecord,
  TimelineEvent,
  Communication,
} from "@/lib/businessStore";
import {
  UserCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Plus,
  MessageSquare,
  Video,
  FileText,
  PhoneCall,
  X,
  Sparkles,
  Layers,
  Calendar,
} from "lucide-react";
import ClientTimeline from "./ClientTimeline";
import { cn } from "@/lib/utils";

interface ClientsModuleProps {
  clients: Client[];
  projects?: Project[];
  meetings?: Meeting[];
  proposals?: Proposal[];
  revenues?: RevenueRecord[];
  timelineEvents?: TimelineEvent[];
  communications?: Communication[];
  onAddTimelineEvent?: (event: TimelineEvent) => void;
}

export default function ClientsModule({
  clients: initialClients,
  projects = [],
  meetings = [],
  proposals = [],
  revenues = [],
  timelineEvents = [],
  communications = [],
  onAddTimelineEvent,
}: ClientsModuleProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  const [activeTab, setActiveTab] = useState<
    "timeline" | "projects" | "meetings" | "proposals" | "revenue" | "notes"
  >("timeline");

  const clientProjects = selectedClient
    ? projects.filter((p) => p.client_id === selectedClient.id || p.client_name.includes(selectedClient.client_name || selectedClient.name || ""))
    : [];

  const clientMeetings = selectedClient
    ? meetings.filter((m) => m.client_id === selectedClient.id || m.client_name.includes(selectedClient.client_name || selectedClient.name || ""))
    : [];

  const clientProposals = selectedClient
    ? proposals.filter((p) => p.client_id === selectedClient.id || p.client_name.includes(selectedClient.client_name || selectedClient.name || ""))
    : [];

  const clientRevenues = selectedClient
    ? revenues.filter((r) => r.client_id === selectedClient.id || (r.client_name && r.client_name.includes(selectedClient.client_name || selectedClient.name || "")))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          <span>Client CRM & Lifecycle Dossier</span>
        </h2>
        <p className="text-xs text-slate-400">
          Complete client profiles with integrated Projects, Meetings, Proposals, Revenue, and Timeline Milestones.
        </p>
      </div>

      {/* Clients Grid */}
      {clients.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-500 text-sm">
          No clients yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {clients.map((c) => {
            const clientDisplayName = c.client_name || c.name || "Valued Client";
            return (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedClient(c);
                  setActiveTab("timeline");
                }}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col justify-between group space-y-4 shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400 shadow">
                      {clientDisplayName.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {c.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mt-3">
                    {clientDisplayName}
                  </h3>
                  <p className="text-xs text-slate-400">{c.company}</p>

                  <div className="mt-3 space-y-1 text-xs text-slate-400">
                    <div className="flex items-center text-[11px] truncate">
                      <Mail className="w-3 h-3 mr-1.5 text-slate-500 shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </div>
                    <div className="flex items-center text-[11px]">
                      <Phone className="w-3 h-3 mr-1.5 text-slate-500 shrink-0" />
                      <span>{c.phone || "No phone listed"}</span>
                    </div>
                    <div className="flex items-center text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 mr-1.5 text-slate-500 shrink-0" />
                      <span className="truncate">{c.address || "India"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Revenue</span>
                    <span className="font-extrabold text-emerald-400">
                      ₹{c.total_revenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    {c.project_count} {c.project_count === 1 ? "Project" : "Projects"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  Client Profile & Operating Lifecycle
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-0.5">
                  {selectedClient.client_name || selectedClient.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedClient.company} • {selectedClient.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Total Revenue</span>
                <span className="text-emerald-400 font-bold text-sm">
                  ₹{selectedClient.total_revenue.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Projects</span>
                <span className="text-slate-200 font-bold text-sm">
                  {selectedClient.project_count}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Phone</span>
                <span className="text-slate-200 font-medium text-[11px] truncate block">
                  {selectedClient.phone || "—"}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Status</span>
                <span className="text-emerald-400 font-bold text-xs">{selectedClient.status}</span>
              </div>
            </div>

            {/* Section Tabs: Timeline, Projects, Meetings, Proposals, Revenue, Notes */}
            <div className="flex items-center space-x-1 border-b border-slate-800 overflow-x-auto pb-1 text-xs">
              {(
                [
                  { id: "timeline", label: "Timeline", icon: Sparkles },
                  { id: "projects", label: `Projects (${clientProjects.length})`, icon: Briefcase },
                  { id: "meetings", label: `Meetings (${clientMeetings.length})`, icon: Calendar },
                  { id: "proposals", label: `Proposals (${clientProposals.length})`, icon: FileText },
                  { id: "revenue", label: `Revenue (${clientRevenues.length})`, icon: DollarSign },
                  { id: "notes", label: "Notes", icon: MessageSquare },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-xl font-semibold transition-all shrink-0 ${
                      activeTab === tab.id
                        ? "bg-slate-800 text-emerald-400 border-t-2 border-emerald-500"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div>
              {/* 1. Timeline */}
              {activeTab === "timeline" && (
                <ClientTimeline
                  clientId={selectedClient.id}
                  clientName={selectedClient.client_name || selectedClient.name || "Client"}
                  events={timelineEvents}
                  onAddEvent={onAddTimelineEvent}
                />
              )}

              {/* 2. Projects */}
              {activeTab === "projects" && (
                <div className="space-y-3">
                  {clientProjects.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800">
                      No projects currently logged for this client.
                    </div>
                  ) : (
                    clientProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-100">{p.project_name || p.name}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{p.description}</div>
                          <div className="flex items-center space-x-3 mt-2 text-[10px] text-slate-500">
                            <span>Phase: <strong className="text-emerald-400">{p.current_phase || p.phase}</strong></span>
                            <span>Progress: <strong className="text-slate-300">{p.progress || p.progress_pct}%</strong></span>
                            <span>Deadline: <strong className="text-slate-300">{p.deadline}</strong></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 text-sm block">
                            ₹{p.budget.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300">
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 3. Meetings */}
              {activeTab === "meetings" && (
                <div className="space-y-3">
                  {clientMeetings.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800">
                      No meetings logged for this client.
                    </div>
                  ) : (
                    clientMeetings.map((m) => (
                      <div
                        key={m.id}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-100">{m.project_type || "Strategy Session"}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            {m.meeting_date} at {m.meeting_time} • {m.meeting_mode || "Autonomous AI Phone Call (RIO)"}
                          </div>
                          {m.notes && <p className="text-slate-300 text-[11px] mt-1">{m.notes}</p>}
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          {m.meeting_status || m.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 4. Proposals */}
              {activeTab === "proposals" && (
                <div className="space-y-3">
                  {clientProposals.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800">
                      No technical proposals generated for this client yet.
                    </div>
                  ) : (
                    clientProposals.map((pr) => (
                      <div
                        key={pr.id}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-100">{pr.project_name}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{pr.scope}</div>
                          <span className="text-[10px] text-slate-500 mt-1 block">Timeline: {pr.timeline}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 text-sm block">
                            ₹{pr.cost.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {pr.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 5. Revenue */}
              {activeTab === "revenue" && (
                <div className="space-y-3">
                  {clientRevenues.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800">
                      No invoices recorded for this client.
                    </div>
                  ) : (
                    clientRevenues.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-100">{rev.project_name || "Settlement"}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            {rev.payment_type} • Received: {rev.received_date}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 text-sm block">
                            ₹{rev.amount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {rev.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 6. Notes */}
              {activeTab === "notes" && (
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed">
                  {selectedClient.notes || "No additional notes on record."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
