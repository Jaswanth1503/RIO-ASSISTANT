"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingsModuleProps {
  meetings: Meeting[];
}

const STATUS_MAP: Record<MeetingStatus, { label: string; color: string }> = {
  Scheduled: { label: "Scheduled", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  Completed: { label: "Completed", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  Cancelled: { label: "Cancelled", color: "bg-slate-700/20 text-slate-400 border-slate-700" },
  Rescheduled: { label: "Rescheduled", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};

export default function MeetingsModule({ meetings: initialMeetings }: MeetingsModuleProps) {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);

  const handleUpdateStatus = (id: string, status: MeetingStatus) => {
    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    if (activeMeeting && activeMeeting.id === id) {
      setActiveMeeting({ ...activeMeeting, status });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Client Strategy Sessions & Meetings</h2>
        <p className="text-xs text-slate-400">
          Scheduled discovery calls, architecture reviews, and delivery demos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetings.map((m) => {
          const conf = STATUS_MAP[m.status] || STATUS_MAP.Scheduled;
          return (
            <div
              key={m.id}
              onClick={() => setActiveMeeting(m)}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold border",
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
                  <span className="truncate">{m.meeting_type}</span>
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
                <span className="text-[11px] text-slate-400 group-hover:text-white">View Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meeting Details Modal */}
      {activeMeeting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Strategy Session</span>
                <h3 className="text-lg font-bold text-slate-100 mt-0.5">{activeMeeting.client_name}</h3>
                <p className="text-xs text-slate-400">
                  {activeMeeting.meeting_date} at {activeMeeting.meeting_time}
                </p>
              </div>
              <button
                onClick={() => setActiveMeeting(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-6 space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Meeting Status:</span>
                <div className="flex space-x-1">
                  {(["Scheduled", "Completed", "Cancelled"] as MeetingStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(activeMeeting.id, st)}
                      className={cn(
                        "px-2.5 py-1 rounded text-[10px] font-bold transition-all",
                        activeMeeting.status === st
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-900 text-slate-400 hover:text-slate-200"
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Agenda & Client Discussion Topics
                </h4>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  {activeMeeting.notes}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Call Outcome & Next Action
                </h4>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  <p><strong className="text-slate-200">Outcome:</strong> {activeMeeting.outcome}</p>
                  <p className="mt-1"><strong className="text-emerald-400">Next Action:</strong> {activeMeeting.next_action}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
