"use client";

import React, { useState } from "react";
import { RevenueRecord } from "@/lib/businessStore";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueModuleProps {
  revenues: RevenueRecord[];
}

export default function RevenueModule({ revenues }: RevenueModuleProps) {
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  // Calculations
  const receivedRecords = revenues.filter((r) => r.category === "Received");
  const totalReceived = receivedRecords.reduce((acc, curr) => acc + curr.amount, 0);

  const pendingRecords = revenues.filter((r) => r.category === "Pending");
  const totalPending = pendingRecords.reduce((acc, curr) => acc + curr.amount, 0);

  const projectedRecords = revenues.filter((r) => r.category === "Projected");
  const totalProjected = projectedRecords.reduce((acc, curr) => acc + curr.amount, 0);

  const lostRecords = revenues.filter((r) => r.category === "Lost");
  const totalLost = lostRecords.reduce((acc, curr) => acc + curr.amount, 0);

  // Timeframes (simulated based on current date)
  const monthlyRevenue = 40000;
  const quarterlyRevenue = 70000;
  const annualRevenue = totalReceived;

  const filteredRevenues = revenues.filter((r) => {
    if (filterCategory === "ALL") return true;
    return r.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Revenue & Financial Analytics</h2>
        <p className="text-xs text-slate-400">
          Track received client milestone deposits, pending disbursements, and projected contract values.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Received */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>Total Revenue (Settled)</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-emerald-400">
            ₹{totalReceived.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-emerald-500/80 mt-1 block">
            Milestones settled via bank transfer / UPI
          </span>
        </div>

        {/* Projected */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/10">
          <div className="flex items-center justify-between text-xs font-semibold text-cyan-400">
            <span>Projected Pipeline</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-cyan-400">
            ₹{totalProjected.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-cyan-500/80 mt-1 block">
            Proposals in negotiation / 90% probability
          </span>
        </div>

        {/* Pending Invoices */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
            <span>Pending Receivables</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-amber-400">
            ₹{totalPending.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-amber-500/80 mt-1 block">
            Invoiced for active project milestones
          </span>
        </div>

        {/* Lost Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Lost Revenue</span>
            <AlertCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-slate-400">
            ₹{totalLost.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Unconverted / declined inquiries
          </span>
        </div>
      </div>

      {/* Timeframe breakdown cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-500 block">Monthly Revenue (Past 30 Days)</span>
          <span className="text-lg font-bold text-slate-200 mt-1 block">
            ₹{monthlyRevenue.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-500 block">Quarterly Revenue (Q3)</span>
          <span className="text-lg font-bold text-slate-200 mt-1 block">
            ₹{quarterlyRevenue.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-500 block">Annual Cumulative</span>
          <span className="text-lg font-bold text-slate-200 mt-1 block">
            ₹{annualRevenue.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Transactions & Ledgers Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Payment & Invoice Ledger
          </h3>

          <div className="flex space-x-1">
            {["ALL", "Received", "Pending", "Projected", "Lost"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  "text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all",
                  filterCategory === cat
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-slate-200 bg-slate-950"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Project & Scope</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRevenues.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-200">{r.project_name}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
                        r.category === "Received"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : r.category === "Pending"
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : r.category === "Projected"
                          ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                          : "bg-slate-700/20 text-slate-400 border-slate-700"
                      )}
                    >
                      {r.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-100">
                    ₹{r.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">{r.payment_date}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
