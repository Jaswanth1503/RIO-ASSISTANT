"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Users,
  Briefcase,
  CheckSquare,
  Calendar,
  FileText,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { Lead } from "@/lib/validations";
import { Client, Project, Task, Meeting, Proposal } from "@/lib/businessStore";
import { AdminTab } from "./AdminSidebar";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: AdminTab, id?: string) => void;
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  meetings: Meeting[];
  proposals?: Proposal[];
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  onNavigate,
  leads,
  clients,
  projects,
  tasks,
  meetings,
  proposals = [],
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle search
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingLeads = q
    ? leads.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.business_name && l.business_name.toLowerCase().includes(q))
      )
    : [];

  const matchingProjects = q
    ? projects.filter(
        (p) =>
          (p.project_name || p.name || "").toLowerCase().includes(q) ||
          (p.client_name || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      )
    : [];

  const matchingClients = q
    ? clients.filter(
        (c) =>
          (c.client_name || c.name || "").toLowerCase().includes(q) ||
          (c.company || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q)
      )
    : [];

  const matchingTasks = q
    ? tasks.filter(
        (t) =>
          (t.title || t.name || "").toLowerCase().includes(q) ||
          (t.project_name && t.project_name.toLowerCase().includes(q))
      )
    : [];

  const matchingMeetings = q
    ? meetings.filter(
        (m) =>
          (m.client_name || "").toLowerCase().includes(q) ||
          (m.notes || "").toLowerCase().includes(q) ||
          (m.project_type || (m as any).meeting_type || "").toLowerCase().includes(q)
      )
    : [];

  const matchingProposals = q && proposals
    ? proposals.filter(
        (pr) =>
          (pr.project_name || "").toLowerCase().includes(q) ||
          (pr.client_name || "").toLowerCase().includes(q) ||
          (pr.scope || "").toLowerCase().includes(q)
      )
    : [];

  const totalMatches =
    matchingLeads.length +
    matchingProjects.length +
    matchingClients.length +
    matchingTasks.length +
    matchingMeetings.length +
    matchingProposals.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/80">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across Leads, Clients, Projects, Tasks, Meetings, Notes... (ESC to close)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Type keywords like <span className="text-slate-400">"Veera"</span>,{" "}
              <span className="text-slate-400">"PestRisk"</span>,{" "}
              <span className="text-slate-400">"Suresh"</span>, or{" "}
              <span className="text-slate-400">"Meeting"</span> to search everything.
            </div>
          ) : totalMatches === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No results found for "{query}".
            </div>
          ) : (
            <>
              {/* Projects */}
              {matchingProjects.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <Briefcase className="w-3.5 h-3.5 mr-1 text-teal-400" /> Projects (
                    {matchingProjects.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchingProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigate("projects", p.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-100">{p.name}</div>
                          <div className="text-[11px] text-slate-400">
                            Client: {p.client_name} • Phase: {p.phase} • Status: {p.status}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">
                          ₹{p.budget.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leads */}
              {matchingLeads.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Leads (
                    {matchingLeads.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchingLeads.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          onNavigate("leads", l.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-100">{l.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {l.email} • {l.business_name || "Individual"}
                          </div>
                        </div>
                        <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                          {l.lead_score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clients */}
              {matchingClients.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <UserCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Clients (
                    {matchingClients.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchingClients.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onNavigate("clients", c.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-100">{c.name}</div>
                          <div className="text-[11px] text-slate-400">{c.company}</div>
                        </div>
                        <span className="text-xs text-slate-300 font-medium">
                          {c.project_count} Projects
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {matchingTasks.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <CheckSquare className="w-3.5 h-3.5 mr-1 text-amber-400" /> Tasks (
                    {matchingTasks.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchingTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onNavigate("tasks", t.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-100">{t.name}</div>
                          <div className="text-[11px] text-slate-400">
                            Due: {t.due_date} • Priority: {t.priority}
                          </div>
                        </div>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meetings */}
              {matchingMeetings.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-purple-400" /> Meetings (
                    {matchingMeetings.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchingMeetings.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          onNavigate("meetings", m.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-100">{m.client_name}</div>
                          <div className="text-[11px] text-slate-400">
                            {m.meeting_date} at {m.meeting_time}
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">{m.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Proposals */}
              {matchingProposals.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Proposals (
                    {matchingProposals.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchingProposals.map((pr) => (
                      <div
                        key={pr.id}
                        onClick={() => {
                          onNavigate("proposals", pr.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-100">{pr.project_name}</div>
                          <div className="text-[11px] text-slate-400">{pr.client_name} • {pr.timeline}</div>
                        </div>
                        <span className="text-xs text-emerald-400 font-bold">
                          ₹{pr.cost.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
