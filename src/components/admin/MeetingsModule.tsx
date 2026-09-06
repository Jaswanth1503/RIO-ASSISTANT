"use client";

import React, { useState, useEffect } from "react";
import { Meeting, MeetingStatus } from "@/lib/businessStore";
import {
  Calendar,
  Clock,
  Video,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ExternalLink,
  Edit,
  XCircle,
  CalendarDays,
  ArrowRight,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingsModuleProps {
  meetings: Meeting[];
  onConvertToProposal?: (meeting: Meeting) => void;
  onUpdateMeeting?: (meeting: Meeting) => void;
}

const STATUS_MAP: Record<MeetingStatus, { label: string; color: string }> = {
  Scheduled: { label: "Scheduled", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  Confirmed: { label: "Confirmed", color: "bg-blue-500/15 text-blue-400 border-blue-500/30 font-bold" },
  Completed: { label: "Completed", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold" },
  Cancelled: { label: "Cancelled", color: "bg-slate-700/20 text-slate-400 border-slate-700" },
  "No Show": { label: "No Show", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  Rescheduled: { label: "Rescheduled", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};

export default function MeetingsModule({
  meetings: initialMeetings,
  onConvertToProposal,
  onUpdateMeeting,
}: MeetingsModuleProps) {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    setMeetings(initialMeetings);
  }, [initialMeetings]);

  // Edit / Reschedule Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    meeting_date: "",
    meeting_time: "",
    meeting_mode: "Autonomous AI Phone Call (RIO)",
    notes: "",
    status: "Scheduled" as MeetingStatus,
  });

  const handleUpdateStatus = (meeting: Meeting, newStatus: MeetingStatus) => {
    const updated = { ...meeting, meeting_status: newStatus, status: newStatus };
    const nextList = meetings.map((m) => (m.id === meeting.id ? updated : m));
    setMeetings(nextList);
    if (activeMeeting && activeMeeting.id === meeting.id) {
      setActiveMeeting(updated);
    }
    if (onUpdateMeeting) onUpdateMeeting(updated);
  };

  const handleOpenEdit = (m: Meeting) => {
    setEditForm({
      meeting_date: m.meeting_date,
      meeting_time: m.meeting_time,
      meeting_mode: m.meeting_mode || "Autonomous AI Phone Call (RIO)",
      notes: m.notes || "",
      status: m.meeting_status || m.status || "Scheduled",
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMeeting) return;

    const updated: Meeting = {
      ...activeMeeting,
      meeting_date: editForm.meeting_date,
      meeting_time: editForm.meeting_time,
      meeting_mode: editForm.meeting_mode,
      notes: editForm.notes,
      meeting_status: editForm.status,
      status: editForm.status,
      updated_at: new Date().toISOString(),
    };

    const nextList = meetings.map((m) => (m.id === activeMeeting.id ? updated : m));
    setMeetings(nextList);
    setActiveMeeting(updated);
    if (onUpdateMeeting) onUpdateMeeting(updated);
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <span>Client Strategy Sessions & Meetings</span>
        </h2>
        <p className="text-xs text-slate-400">
          Scheduled discovery calls, architecture reviews, and delivery demos.
        </p>
      </div>

      {meetings.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-500 text-sm">
          No meetings scheduled.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((m) => {
            const currentStatus = m.meeting_status || m.status || "Scheduled";
            const conf = STATUS_MAP[currentStatus] || STATUS_MAP.Scheduled;
            return (
              <div
                key={m.id}
                onClick={() => setActiveMeeting(m)}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "text-[10px] px-2.5 py-0.5 rounded-full font-bold border",
                        conf.color
                      )}
                    >
                      {conf.label}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {m.meeting_time}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mt-2.5">
                    {m.client_name}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center mt-1">
                    <Video className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                    <span className="truncate">{m.project_type || "Strategy Session"}</span>
                  </div>

                  {m.notes && (
                    <p className="text-xs text-slate-300 mt-3 p-2.5 bg-slate-950/60 rounded-xl border border-slate-850 line-clamp-2">
                      {m.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" /> {m.meeting_date}
                  </span>
                  <span className="text-[11px] text-slate-400 group-hover:text-white">
                    View Actions →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Meeting Details & Actions Modal */}
      {activeMeeting && !isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  {activeMeeting.meeting_id || "Strategy Call"}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-0.5">
                  {activeMeeting.client_name}
                </h3>
                <p className="text-xs text-slate-400">{activeMeeting.email || activeMeeting.company}</p>
              </div>
              <button
                onClick={() => setActiveMeeting(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Date & Time</span>
                <span className="text-slate-200 font-bold">
                  {activeMeeting.meeting_date} • {activeMeeting.meeting_time}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Meeting Platform</span>
                <span className="text-cyan-400 font-semibold">
                  {activeMeeting.meeting_mode || "Autonomous AI Phone Call (RIO)"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Session Agenda & Discovery Notes
              </h4>
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {activeMeeting.notes || activeMeeting.description || "No notes logged."}
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Update Meeting Status:
              </span>
              <div className="flex flex-wrap gap-2">
                {(["Scheduled", "Confirmed", "Completed", "Cancelled", "No Show", "Rescheduled"] as const).map(
                  (st) => {
                    const currentSt = activeMeeting.meeting_status || activeMeeting.status;
                    return (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(activeMeeting, st)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          currentSt === st
                            ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {st}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Actions: Edit, Reschedule, Convert to Proposal */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(activeMeeting)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Edit className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit / Reschedule</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeMeeting, "Cancelled")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center space-x-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>

              {onConvertToProposal && (
                <button
                  onClick={() => {
                    onConvertToProposal(activeMeeting);
                    setActiveMeeting(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Convert To Proposal →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit / Reschedule Modal */}
      {isEditOpen && activeMeeting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">
              Edit Meeting: {activeMeeting.client_name}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Meeting Date</label>
                <input
                  type="date"
                  required
                  value={editForm.meeting_date}
                  onChange={(e) => setEditForm({ ...editForm, meeting_date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Meeting Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 11:00 AM IST"
                  value={editForm.meeting_time}
                  onChange={(e) => setEditForm({ ...editForm, meeting_time: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Meeting Mode</label>
                <input
                  type="text"
                  value={editForm.meeting_mode}
                  onChange={(e) => setEditForm({ ...editForm, meeting_mode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notes & Next Action</label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as MeetingStatus })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No Show">No Show</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
