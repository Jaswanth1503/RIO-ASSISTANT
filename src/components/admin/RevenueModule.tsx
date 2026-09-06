"use client";

import React, { useState } from "react";
import { RevenueRecord, PaymentStatus } from "@/lib/businessStore";
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  FileText,
  Plus,
  ArrowUpRight,
  Target,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueModuleProps {
  revenues: RevenueRecord[];
}

export default function RevenueModule({ revenues: initialRevenues }: RevenueModuleProps) {
  const [revenues, setRevenues] = useState<RevenueRecord[]>(initialRevenues);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const todayStr = new Date().toISOString().split("T")[0];
  const currentMonthStr = todayStr.slice(0, 7);

  // Phase 8 Metrics
  const paidRecords = revenues.filter((r) => r.status === "Paid");
  const totalRevenue = paidRecords.reduce((acc, curr) => acc + curr.amount, 0);

  const pendingRecords = revenues.filter(
    (r) => r.status === "Pending" || r.status === "Partially Paid"
  );
  const pendingRevenue = pendingRecords.reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyRevenue = paidRecords
    .filter((r) => (r.received_date || "").startsWith(currentMonthStr))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const annualRevenue = totalRevenue;
  const avgProjectValue = paidRecords.length > 0 ? Math.round(totalRevenue / paidRecords.length) : 0;

  const filteredRevenues = revenues.filter((r) => {
    if (filterStatus === "ALL") return true;
    return r.status === filterStatus;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold";
      case "Pending":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30 font-medium";
      case "Partially Paid":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "Overdue":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold";
      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <span>Revenue Tracking & Cashflow Ledger</span>
        </h2>
        <p className="text-xs text-slate-400">
          Financial performance, milestone disbursements, and accounts receivable.
        </p>
      </div>

      {/* Phase 8 KPI Cards (5 Metrics: Total, Pending, Monthly, Annual, Average Project Value) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-emerald-400">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-emerald-500/80 mt-1 block">Settled client disbursements</span>
        </div>

        {/* Pending Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
            <span>Pending Revenue</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-amber-300">
            ₹{pendingRevenue.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-amber-400/80 mt-1 block">Active milestone receivables</span>
        </div>

        {/* Monthly Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-cyan-400">
            <span>Monthly Revenue</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-cyan-400">
            ₹{monthlyRevenue.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-cyan-500/80 mt-1 block">Current calendar month</span>
        </div>

        {/* Annual Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-purple-950/10 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>Annual Revenue</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-purple-300">
            ₹{annualRevenue.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-purple-400/80 mt-1 block">FY 2026 recognized total</span>
        </div>

        {/* Average Project Value */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-lg col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Avg Project Value</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-slate-100">
            ₹{avgProjectValue.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Across delivered contracts</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {(["ALL", "Paid", "Pending", "Partially Paid", "Overdue"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              filterStatus === status
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Transaction & Disbursement Ledger */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Project / Milestone</th>
                <th className="py-3.5 px-4 font-semibold">Client</th>
                <th className="py-3.5 px-4 font-semibold">Method</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
                <th className="py-3.5 px-4 font-semibold">Payment Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Received Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRevenues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                    {revenues.length === 0 ? "No revenue recorded." : "No transactions matching this filter."}
                  </td>
                </tr>
              ) : (
                filteredRevenues.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{r.project_name || "Milestone"}</div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">
                        {r.id}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 font-medium">
                        {r.client_name || "Enterprise Client"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs text-slate-400">{r.payment_type}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "font-extrabold text-sm",
                          r.status === "Paid" ? "text-emerald-400" : "text-amber-400"
                        )}
                      >
                        ₹{r.amount.toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                          getStatusBadge(r.status)
                        )}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs text-slate-400 font-mono">
                        {r.received_date || "Pending"}
                      </span>
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
