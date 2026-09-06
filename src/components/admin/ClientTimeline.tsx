"use client";

import React, { useState } from "react";
import { TimelineEvent, TimelineEventType } from "@/lib/businessStore";
import {
  Calendar,
  CheckCircle2,
  FileText,
  DollarSign,
  Rocket,
  Clock,
  UserCheck,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ClientTimelineProps {
  clientId: string;
  clientName: string;
  events: TimelineEvent[];
  onAddEvent?: (event: TimelineEvent) => void;
}

export default function ClientTimeline({
  clientId,
  clientName,
  events,
  onAddEvent,
}: ClientTimelineProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventType, setEventType] = useState<TimelineEventType>("Follow Up Added");
  const [eventTitle, setEventTitle] = useState("");
  const [description, setDescription] = useState("");

  const clientEvents = events
    .filter((e) => e.client_id === clientId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;

    const newEvent: TimelineEvent = {
      id: `tl-${Date.now()}`,
      client_id: clientId,
      event_type: eventType,
      event_title: eventTitle,
      description: description || `Event logged for ${clientName}`,
      created_at: new Date().toISOString(),
    };

    if (onAddEvent) {
      onAddEvent(newEvent);
    }
    setShowAddModal(false);
    setEventTitle("");
    setDescription("");
  };

  const getEventIcon = (type: TimelineEventType) => {
    switch (type) {
      case "Lead Created":
        return <UserCheck className="w-4 h-4 text-cyan-400" />;
      case "Meeting Scheduled":
      case "Meeting Completed":
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case "Proposal Sent":
      case "Proposal Accepted":
      case "Proposal Rejected":
        return <FileText className="w-4 h-4 text-amber-400" />;
      case "Project Started":
      case "Project Completed":
        return <Rocket className="w-4 h-4 text-emerald-400" />;
      case "Payment Received":
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case "Follow Up Added":
      default:
        return <Clock className="w-4 h-4 text-teal-400" />;
    }
  };

  const getBadgeColor = (type: TimelineEventType) => {
    switch (type) {
      case "Lead Created":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Meeting Scheduled":
      case "Meeting Completed":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Proposal Sent":
      case "Proposal Accepted":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Proposal Rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Project Started":
      case "Project Completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Payment Received":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Client Lifecycle Timeline</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            End-to-end event progression for {clientName}
          </p>
        </div>
        {onAddEvent && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Event</span>
          </button>
        )}
      </div>

      {clientEvents.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800">
          No lifecycle milestones logged yet. New bookings, proposals, and milestones will appear here.
        </div>
      ) : (
        <div className="relative pl-6 border-l border-slate-800 space-y-6 my-2">
          {clientEvents.map((evt, idx) => {
            const formatted = formatDate(evt.created_at);
            return (
              <div key={evt.id} className="relative group">
                {/* Node Circle */}
                <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow">
                  {getEventIcon(evt.event_type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {formatted.day}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{evt.event_title}</span>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeColor(
                        evt.event_type
                      )}`}
                    >
                      {evt.event_type}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-auto">{formatted.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-1">
                    {evt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Log Lifecycle Event</h3>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as TimelineEventType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Lead Created">Lead Created</option>
                  <option value="Meeting Scheduled">Meeting Scheduled</option>
                  <option value="Meeting Completed">Meeting Completed</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Proposal Accepted">Proposal Accepted</option>
                  <option value="Proposal Rejected">Proposal Rejected</option>
                  <option value="Project Started">Project Started</option>
                  <option value="Project Completed">Project Completed</option>
                  <option value="Payment Received">Payment Received</option>
                  <option value="Follow Up Added">Follow Up Added</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scope Discussion Handover"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Details & Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide context, deliverables, or outcome notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
