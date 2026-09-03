"use client";

import React, { useState } from "react";
import { Lead } from "@/lib/validations";
import { PipelineStage } from "@/lib/businessStore";
import { Flame, Sparkles, User, Mail, DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineBoardProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: "NEW LEAD", label: "New Lead", color: "border-blue-500/40 text-blue-400 bg-blue-500/10" },
  { id: "CONTACT REQUIRED", label: "Contact Required", color: "border-purple-500/40 text-purple-400 bg-purple-500/10" },
  { id: "CONTACTED", label: "Contacted", color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10" },
  { id: "QUALIFIED", label: "Qualified", color: "border-teal-500/40 text-teal-400 bg-teal-500/10" },
  { id: "PROPOSAL SENT", label: "Proposal Sent", color: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
  { id: "NEGOTIATION", label: "Negotiation", color: "border-orange-500/40 text-orange-400 bg-orange-500/10" },
  { id: "PROJECT STARTED", label: "Project Started", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
  { id: "PROJECT COMPLETED", label: "Completed", color: "border-green-600/40 text-green-400 bg-green-600/10" },
  { id: "PROJECT LOST", label: "Lost", color: "border-red-500/40 text-red-400 bg-red-500/10" },
];

export default function PipelineBoard({ leads, onSelectLead }: PipelineBoardProps) {
  // Mapping lead id to pipeline stage
  const [stageMap, setStageMap] = useState<Record<string, PipelineStage>>(() => {
    const map: Record<string, PipelineStage> = {};
    leads.forEach((l, idx) => {
      if (l.lead_score === "HOT" && idx === 0) {
        map[l.id || `lead-${idx}`] = "PROJECT STARTED";
      } else if (l.lead_score === "HOT") {
        map[l.id || `lead-${idx}`] = "PROPOSAL SENT";
      } else if (l.lead_score === "WARM") {
        map[l.id || `lead-${idx}`] = "QUALIFIED";
      } else {
        map[l.id || `lead-${idx}`] = "NEW LEAD";
      }
    });
    return map;
  });

  const handleStageChange = (leadId: string, newStage: PipelineStage) => {
    setStageMap((prev) => ({ ...prev, [leadId]: newStage }));
  };

  const getLeadsInStage = (stage: PipelineStage) => {
    return leads.filter((l, idx) => {
      const current = stageMap[l.id || `lead-${idx}`] || "NEW LEAD";
      return current === stage;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Leads Sales Pipeline</h2>
          <p className="text-xs text-slate-400">
            Track lead lifecycle from first contact to project kickoff
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-6 scrollbar-thin">
        <div className="flex gap-4 min-w-[1400px]">
          {STAGES.map((stage) => {
            const items = getLeadsInStage(stage.id);
            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 glass-panel rounded-2xl border border-slate-800 p-3 flex flex-col bg-slate-950/70"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <span
                    className={cn(
                      "text-xs font-bold px-2.5 py-1 rounded-full border",
                      stage.color
                    )}
                  >
                    {stage.label}
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                    {items.length}
                  </span>
                </div>

                {/* Lead Cards */}
                <div className="flex-1 space-y-2.5 min-h-[350px]">
                  {items.length === 0 ? (
                    <div className="h-32 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-[11px] text-slate-600">
                      Empty stage
                    </div>
                  ) : (
                    items.map((lead, idx) => {
                      const leadId = lead.id || `lead-${idx}`;
                      return (
                        <div
                          key={leadId}
                          onClick={() => onSelectLead(lead)}
                          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 shadow-md cursor-pointer transition-all space-y-2 group"
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-xs text-slate-100 group-hover:text-emerald-400 transition-colors">
                              {lead.name}
                            </h4>
                            {lead.lead_score === "HOT" && (
                              <span className="flex items-center text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/30 font-bold">
                                <Flame className="w-3 h-3 mr-0.5" /> HOT
                              </span>
                            )}
                            {lead.lead_score === "WARM" && (
                              <span className="flex items-center text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                                WARM
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 font-medium truncate">
                            {lead.business_name || "Individual Client"}
                          </div>

                          <div className="text-[11px] text-slate-500 bg-slate-950/60 px-2 py-1 rounded-md truncate">
                            {lead.project_type}
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                            <span className="text-emerald-400 font-bold">{lead.budget}</span>
                            <span className="text-[10px] text-slate-400">{lead.timeline}</span>
                          </div>

                          {/* Quick Stage Mover */}
                          <div
                            className="pt-1.5 flex items-center justify-between text-[10px] text-slate-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Move:</span>
                            <select
                              value={stage.id}
                              onChange={(e) =>
                                handleStageChange(leadId, e.target.value as PipelineStage)
                              }
                              className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none"
                            >
                              {STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
