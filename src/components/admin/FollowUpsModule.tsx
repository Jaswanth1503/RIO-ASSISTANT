"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowUpsModuleProps {
  followUps: FollowUp[];
  communications: Communication[];
  onTriggerCall: (phone: string, name: string) => void;
}

const STATUS_CONFIG: Record<FollowUpStatus, { label: string; color: string }> = {
  "Need Contact": { label: "Need Contact", color: "bg-red-500/15 text-red-400 border-red-500/30" },
  Contacted: { label: "Contacted", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  "Meeting Scheduled": {
    label: "Meeting Scheduled",
    color: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
  "Proposal Sent": {
    label: "Proposal Sent",
    color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  "Waiting Response": {
    label: "Waiting Response",
    color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  },
  Negotiation: {
    label: "Negotiation",
    color: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  },
  "Closed Won": {
    label: "Closed Won",
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  "Closed Lost": { label: "Closed Lost", color: "bg-slate-700/30 text-slate-400 border-slate-700" },
};

export default function FollowUpsModule({
  followUps: initialList,
  communications,
  onTriggerCall,
}: FollowUpsModuleProps) {
  const [items, setItems] = useState<FollowUp[]>(initialList);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [activeFollowUp, setActiveFollowUp] = useState<FollowUp | null>(null);
  const [newNote, setNewNote] = useState("");

  const filteredItems = items.filter((f) => {
    if (selectedStatus === "ALL") return true;
    return f.status === selectedStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: FollowUpStatus) => {
    setItems((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: newStatus,
              last_contact: new Date().toISOString().split("T")[0],
            }
          : f
      )
    );
  };

  const handleAddNote = (id: string) => {
    if (!newNote.trim()) return;
    setItems((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              notes: `${f.notes ? f.notes + "\n" : ""}[${new Date().toLocaleDateString()}]: ${newNote}`,
            }
          : f
      )
    );
    setNewNote("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Client Follow-Up Management</h2>
          <p className="text-xs text-slate-400">
            Never lose an opportunity with automated next-contact reminders and interaction logs.
          </p>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5">
          {["ALL", "Need Contact", "Proposal Sent", "Negotiation", "Closed Won"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-xl font-medium transition-all",
                selectedStatus === st
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Follow-ups table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Client & Company</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Next Follow-Up</th>
                <th className="py-3.5 px-4 font-semibold">Last Contact</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.map((item) => {
                const conf = STATUS_CONFIG[item.status] || {
                  label: item.status,
                  color: "bg-slate-800 text-slate-300",
                };
                return (
                  <tr
                    key={item.id}
                    onClick={() => setActiveFollowUp(item)}
                    className="hover:bg-slate-900/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{item.client_name}</div>
                      <div className="text-xs text-slate-400">{item.company}</div>
                      <div className="text-[11px] text-slate-500 mt-1 truncate max-w-xs">
                        {item.notes}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border",
                          conf.color
                        )}
                      >
                        {conf.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "text-xs font-bold",
                          item.priority === "Urgent"
                            ? "text-red-400"
                            : item.priority === "High"
                            ? "text-orange-400"
                            : "text-slate-400"
                        )}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center text-xs font-medium text-emerald-400">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>{item.next_date}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-400">{item.last_contact}</td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {item.phone && (
                          <button
                            onClick={() => onTriggerCall(item.phone, item.client_name)}
                            title="Call via Vapi"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={`mailto:${item.email}?subject=Following%20up%20-%20Annu%20Jaswanth`}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Follow-Up Drawer / Modal */}
      {activeFollowUp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-100">{activeFollowUp.client_name}</h3>
                <p className="text-xs text-slate-400">{activeFollowUp.company}</p>
              </div>
              <button
                onClick={() => setActiveFollowUp(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-500 block">Status</span>
                  <select
                    value={activeFollowUp.status}
                    onChange={(e) => {
                      const newSt = e.target.value as FollowUpStatus;
                      handleUpdateStatus(activeFollowUp.id, newSt);
                      setActiveFollowUp({ ...activeFollowUp, status: newSt });
                    }}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  >
                    {Object.keys(STATUS_CONFIG).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-500 block">Next Follow-Up Date</span>
                  <input
                    type="date"
                    value={activeFollowUp.next_date}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setItems((prev) =>
                        prev.map((f) =>
                          f.id === activeFollowUp.id ? { ...f, next_date: newDate } : f
                        )
                      );
                      setActiveFollowUp({ ...activeFollowUp, next_date: newDate });
                    }}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Follow-Up History & Notes
                </h4>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {activeFollowUp.notes || "No notes logged yet."}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Add Interaction Note
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g. Discussed AI agent pricing, requested quotation by Friday..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => handleAddNote(activeFollowUp.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
