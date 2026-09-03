"use client";

import React from "react";
import {
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Target,
  DollarSign,
  Clock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface AnalyticsModuleProps {
  leadCount: number;
  hotLeadCount: number;
  projectCount: number;
}

export default function AnalyticsModule({
  leadCount,
  hotLeadCount,
  projectCount,
}: AnalyticsModuleProps) {
  const conversionRate = leadCount > 0 ? Math.round((projectCount / leadCount) * 100) : 75;
  const projectsWon = 4;
  const projectsLost = 1;
  const totalRevenue = 125000;
  const avgProjectValue = Math.round(totalRevenue / projectsWon);
  const avgResponseTime = "< 1.5 hrs";
  const monthlyGrowth = "+32%";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Business Performance & Conversion Analytics</h2>
        <p className="text-xs text-slate-400">
          Key performance indicators, win/loss ratios, and customer conversion efficiency.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Conversion Rate</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-emerald-400">
            {conversionRate}%
          </div>
          <span className="text-[10px] text-emerald-500/80 mt-1 block">Lead to signed project</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Projects Won / Lost</span>
            <Award className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-slate-100">
            {projectsWon} <span className="text-slate-500 text-lg font-normal">/ {projectsLost}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">80% Win Ratio</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Average Project Value</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-cyan-400">
            ₹{avgProjectValue.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Across delivered contracts</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Monthly Growth</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-emerald-400">
            {monthlyGrowth}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Month-over-month deal flow</span>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Average Response Time</div>
          <div className="text-xl font-bold text-slate-200 mt-1">{avgResponseTime}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Driven by RIO's instant 24/7 lead qualification dialogue.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Qualified Leads Ratio</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {leadCount > 0 ? Math.round((hotLeadCount / leadCount) * 100) : 66}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Percentage of prospects scoring &gt; ₹20,000 budget and urgent timeline.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Revenue Run Rate</div>
          <div className="text-xl font-bold text-teal-400 mt-1">₹4.8L / yr</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Projected annual revenue based on active retainers and pipeline.
          </p>
        </div>
      </div>
    </div>
  );
}
