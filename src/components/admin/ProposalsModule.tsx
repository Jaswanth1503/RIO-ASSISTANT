"use client";

import React, { useState } from "react";
import { Proposal, ProposalStatus, Client } from "@/lib/businessStore";
import {
  FileText,
  Plus,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Briefcase,
  ArrowRight,
  Eye,
  Calendar,
  X,
  Edit,
  Sparkles,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalsModuleProps {
  proposals: Proposal[];
  clients: Client[];
  onUpdateProposal: (proposal: Proposal) => void;
  onCreateProposal: (proposal: Proposal) => void;
  onConvertToProject: (proposal: Proposal) => void;
}

export default function ProposalsModule({
  proposals: initialProposals,
  clients,
  onUpdateProposal,
  onCreateProposal,
  onConvertToProject,
}: ProposalsModuleProps) {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [formData, setFormData] = useState({
    client_id: clients[0]?.id || "",
    client_name: clients[0]?.client_name || "",
    project_name: "",
    scope: "",
    deliverables: "",
    timeline: "3-4 Weeks",
    cost: 35000,
    payment_terms: "50% upfront mobilization, 50% upon deployment signoff",
    notes: "",
  });

  const filteredProposals = proposals.filter((p) => {
    if (statusFilter === "ALL") return true;
    return p.status === statusFilter;
  });

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case "Draft":
        return "bg-slate-700/30 text-slate-300 border-slate-700";
      case "Sent":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "Viewed":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "Accepted":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold";
      case "Rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Expired":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  const handleStatusChange = (proposal: Proposal, newStatus: ProposalStatus) => {
    const updated = { ...proposal, status: newStatus };
    const nextList = proposals.map((p) => (p.id === proposal.id ? updated : p));
    setProposals(nextList);
    onUpdateProposal(updated);
    if (selectedProposal && selectedProposal.id === proposal.id) {
      setSelectedProposal(updated);
    }
  };

  const handleOpenCreate = () => {
    setEditingProposal(null);
    setFormData({
      client_id: clients[0]?.id || "",
      client_name: clients[0]?.client_name || "",
      project_name: "",
      scope: "",
      deliverables: "Custom Responsive Frontend\nBackend API & Database\nTesting & Security Optimization\nPost-Launch Handover Support",
      timeline: "3-4 Weeks",
      cost: 35000,
      payment_terms: "50% upfront mobilization, 50% upon deployment signoff",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Proposal) => {
    setEditingProposal(p);
    setFormData({
      client_id: p.client_id,
      client_name: p.client_name,
      project_name: p.project_name,
      scope: p.scope,
      deliverables: (p.deliverables || []).join("\n"),
      timeline: p.timeline,
      cost: p.cost,
      payment_terms: p.payment_terms,
      notes: p.notes,
    });
    setIsModalOpen(true);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === formData.client_id);
    const clientName = selectedClient ? selectedClient.client_name : formData.client_name;

    const deliverablesArray = formData.deliverables
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    if (editingProposal) {
      const updated: Proposal = {
        ...editingProposal,
        client_id: formData.client_id,
        client_name: clientName,
        project_name: formData.project_name,
        scope: formData.scope,
        deliverables: deliverablesArray,
        timeline: formData.timeline,
        cost: Number(formData.cost),
        payment_terms: formData.payment_terms,
        notes: formData.notes,
      };
      const nextList = proposals.map((p) => (p.id === updated.id ? updated : p));
      setProposals(nextList);
      onUpdateProposal(updated);
      setSelectedProposal(updated);
    } else {
      const created: Proposal = {
        id: `prop-${Date.now()}`,
        proposal_id: `PROP-${Date.now().toString().slice(-4)}`,
        client_id: formData.client_id,
        client_name: clientName,
        project_name: formData.project_name,
        scope: formData.scope,
        deliverables: deliverablesArray,
        timeline: formData.timeline,
        cost: Number(formData.cost),
        payment_terms: formData.payment_terms,
        status: "Draft",
        notes: formData.notes,
        created_at: new Date().toISOString(),
      };
      setProposals([created, ...proposals]);
      onCreateProposal(created);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Proposal Management & Conversion</span>
          </h2>
          <p className="text-xs text-slate-400">
            Lifecycle phase: Discovery Call → <strong className="text-emerald-400">Proposal</strong> → Accepted → Project
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Proposal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {(["ALL", "Draft", "Sent", "Viewed", "Accepted", "Rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              statusFilter === tab
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProposals.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-500 glass-panel rounded-2xl border border-slate-800">
            {proposals.length === 0 ? "No proposals available." : "No proposals found under this filter. Click \"Create Proposal\" to start drafting one."}
          </div>
        ) : (
          filteredProposals.map((prop) => (
            <div
              key={prop.id}
              onClick={() => setSelectedProposal(prop)}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col justify-between group space-y-4 shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                    {prop.proposal_id}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${getStatusBadge(
                      prop.status
                    )}`}
                  >
                    {prop.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mt-2">
                  {prop.project_name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{prop.client_name}</p>

                <p className="text-xs text-slate-400/90 mt-3 line-clamp-2 leading-relaxed">
                  {prop.scope}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Proposed Cost</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    ₹{prop.cost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Target Timeline</span>
                  <span className="text-slate-300 font-medium text-xs">{prop.timeline}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    {selectedProposal.proposal_id}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadge(
                      selectedProposal.status
                    )}`}
                  >
                    {selectedProposal.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mt-1">
                  {selectedProposal.project_name}
                </h3>
                <p className="text-xs text-slate-400">Client: {selectedProposal.client_name}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(selectedProposal)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Edit Proposal"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Total Investment</span>
                <span className="text-emerald-400 font-bold text-sm">
                  ₹{selectedProposal.cost.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Timeline</span>
                <span className="text-slate-200 font-bold text-sm">{selectedProposal.timeline}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Payment Terms</span>
                <span className="text-slate-300 font-medium text-[11px] truncate block">
                  {selectedProposal.payment_terms}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Date Generated</span>
                <span className="text-slate-300 font-medium text-[11px]">
                  {new Date(selectedProposal.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Scope */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Project Scope
              </h4>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed">
                {selectedProposal.scope}
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Key Deliverables & Specifications
              </h4>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                {(selectedProposal.deliverables || []).map((del, i) => (
                  <div key={i} className="flex items-center text-xs text-slate-300 space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedProposal.notes && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Internal Notes
                </h4>
                <p className="text-xs text-slate-400">{selectedProposal.notes}</p>
              </div>
            )}

            {/* Action Buttons: Send, Mark Accepted, Mark Rejected, Convert To Project */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                {selectedProposal.status === "Draft" && (
                  <button
                    onClick={() => handleStatusChange(selectedProposal, "Sent")}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Proposal</span>
                  </button>
                )}
                {selectedProposal.status !== "Accepted" && (
                  <button
                    onClick={() => handleStatusChange(selectedProposal, "Accepted")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Accepted</span>
                  </button>
                )}
                {selectedProposal.status !== "Rejected" && (
                  <button
                    onClick={() => handleStatusChange(selectedProposal, "Rejected")}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Mark Rejected</span>
                  </button>
                )}
              </div>

              {/* Convert to Project */}
              <button
                onClick={() => {
                  onConvertToProject(selectedProposal);
                  setSelectedProposal(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-lg"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Convert To Active Project →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Proposal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-slate-100">
              {editingProposal ? "Edit Proposal" : "Create Technical Proposal"}
            </h3>

            <form onSubmit={handleSubmitModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Client</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => {
                      const cli = clients.find((c) => c.id === e.target.value);
                      setFormData({
                        ...formData,
                        client_id: e.target.value,
                        client_name: cli ? cli.client_name : "",
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.client_name} ({c.company})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Fleet Telematics System"
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Scope of Work</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Architectural overview, system components, target goals..."
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Deliverables (One item per line)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Deliverable 1&#10;Deliverable 2&#10;Deliverable 3"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Total Cost (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Delivery Timeline</label>
                  <input
                    type="text"
                    required
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={formData.payment_terms}
                  onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Internal Notes</label>
                <input
                  type="text"
                  placeholder="Special client considerations..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {editingProposal ? "Update Proposal" : "Save Proposal Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
