"use client";

import React, { useState, useEffect } from "react";
import { FollowUp, FollowUpStatus, Communication } from "@/lib/businessStore";
import {
  Clock,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Plus,
  CheckCircle2,
  FileText,
  MessageSquare,
  X,
  PhoneCall,
  CalendarCheck,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowUpsModuleProps {
  followUps: FollowUp[];
  communications: Communication[];
  onTriggerCall: (phone: string, name: string) => void;
}

export default function FollowUpsModule({
  followUps: initialList,
  communications,
  onTriggerCall,
}: FollowUpsModuleProps) {
  const [items, setItems] = useState<FollowUp[]>(initialList);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [activeFollowUp, setActiveFollowUp] = useState<FollowUp | null>(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    setItems(initialList);
  }, [initialList]);

  const todayStr = new Date().toISOString().split("T")[0];

  // Dashboard Widgets (Phase 9)
  const todayFollowUps = items.filter(
    (f) => (f.followup_date === todayStr || f.next_date === todayStr) && f.status !== "Completed"
  );
  const upcomingFollowUps = items.filter(
    (f) =>
      (f.followup_date > todayStr || (f.next_date && f.next_date > todayStr)) &&
      f.status !== "Completed"
  );
  const overdueFollowUps = items.filter(
    (f) =>
      (f.followup_date < todayStr || (f.next_date && f.next_date < todayStr)) &&
      f.status !== "Completed"
  );

  const filteredItems = items.filter((f) => {
    if (selectedStatus === "ALL") return true;
    return f.status === selectedStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    if (activeFollowUp && activeFollowUp.id === id) {
      setActiveFollowUp({ ...activeFollowUp, status: newStatus });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
      case "Need Contact":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "Completed":
      case "Closed Won":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold";
      case "Missed":
      case "Closed Lost":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      case "Cancelled":
        return "bg-slate-700/30 text-slate-400 border-slate-700";
      default:
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          <span>Client Follow-Up Management</span>
        </h2>
        <p className="text-xs text-slate-400">
          Ensure zero lead leakage with scheduled outreach and communication tracking.
        </p>
      </div>

      {/* Phase 9 Dashboard Widgets: Today's, Upcoming, Overdue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Follow-Ups */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
            <span>Today's Follow-Ups</span>
            <CalendarCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mt-2 text-amber-300">
            {todayFollowUps.length}
          </div>
          <span className="text-[10px] text-amber-400/70 mt-1 block">Scheduled for today</span>
        </div>

        {/* Upcoming Follow-Ups */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-cyan-400">
            <span>Upcoming Follow-Ups</span>
            <CalendarClock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mt-2 text-cyan-300">
            {upcomingFollowUps.length}
          </div>
          <span className="text-[10px] text-cyan-400/70 mt-1 block">Next 7–14 days</span>
        </div>

        {/* Overdue Follow-Ups */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
            <span>Overdue Follow-Ups</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mt-2 text-rose-400">
            {overdueFollowUps.length}
          </div>
          <span className="text-[10px] text-rose-400/70 mt-1 block">Requires immediate action</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {(["ALL", "Pending", "Completed", "Missed", "Cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedStatus(tab)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              selectedStatus === tab
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Client / Company</th>
                <th className="py-3.5 px-4 font-semibold">Follow-Up Date</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Context Notes</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500 text-xs">
                    {items.length === 0 ? "No follow-ups yet." : "No follow-ups matching this filter."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => setActiveFollowUp(f)}
                    className="hover:bg-slate-900/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{f.client_name}</div>
                      <div className="text-[11px] text-slate-400">{f.company || f.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-emerald-400 font-semibold">
                        {f.followup_date || f.next_date}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border",
                          getStatusColor(f.status)
                        )}
                      >
                        {f.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs text-slate-300 truncate max-w-sm">
                        {f.notes || "Follow-up scheduled."}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {f.status !== "Completed" && (
                          <button
                            onClick={() => handleUpdateStatus(f.id, "Completed")}
                            title="Mark Completed"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {f.phone && (
                          <button
                            onClick={() => onTriggerCall(f.phone!, f.client_name)}
                            title="Call Lead"
                            className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border border-teal-500/30"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {f.email && (
                          <a
                            href={`mailto:${f.email}?subject=Following%20up%20-%20Annu%20Jaswanth`}
                            title="Send Email"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
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
