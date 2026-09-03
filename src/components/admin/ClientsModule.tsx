"use client";

import React, { useState } from "react";
import { Client, Communication } from "@/lib/businessStore";
import {
  UserCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Plus,
  MessageSquare,
  Video,
  FileText,
  PhoneCall,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientsModuleProps {
  clients: Client[];
  communications: Communication[];
}

export default function ClientsModule({
  clients: initialClients,
  communications: initialComms,
}: ClientsModuleProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [comms, setComms] = useState<Communication[]>(initialComms);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [newCommType, setNewCommType] = useState<"Call" | "Email" | "Meeting" | "Note" | "Message">("Call");
  const [newSummary, setNewSummary] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const handleAddCommunication = (clientId: string, clientName: string) => {
    if (!newSummary.trim()) return;

    const newRecord: Communication = {
      id: `comm-${Date.now()}`,
      client_id: clientId,
      client_name: clientName,
      comm_type: newCommType,
      summary: newSummary,
      details: newDetails,
      timestamp: new Date().toISOString(),
    };

    setComms([newRecord, ...comms]);
    setNewSummary("");
    setNewDetails("");
  };

  const clientComms = selectedClient
    ? comms.filter((c) => c.client_id === selectedClient.id || c.client_name === selectedClient.name)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Client CRM & Relationship Directory</h2>
        <p className="text-xs text-slate-400">
          Track client lifetime value, communication history, addresses, and ongoing contract notes.
        </p>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clients.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedClient(c)}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400">
                  {c.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {c.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mt-3">
                {c.name}
              </h3>
              <p className="text-xs text-slate-400">{c.company}</p>

              <div className="mt-3 space-y-1 text-xs text-slate-400">
                <div className="flex items-center text-[11px] truncate">
                  <Mail className="w-3 h-3 mr-1.5 text-slate-500" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center text-[11px]">
                  <Phone className="w-3 h-3 mr-1.5 text-slate-500" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center text-[11px] text-slate-500">
                  <MapPin className="w-3 h-3 mr-1.5 text-slate-500" />
                  <span>{c.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Total Revenue</span>
                <span className="font-extrabold text-emerald-400">
                  ₹{c.total_revenue.toLocaleString("en-IN")}
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                {c.project_count} {c.project_count === 1 ? "Project" : "Projects"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Client Detail & Communication History Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Client CRM Profile</span>
                <h3 className="text-xl font-bold text-slate-100 mt-0.5">{selectedClient.name}</h3>
                <p className="text-xs text-slate-400">{selectedClient.company} • {selectedClient.address}</p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-6 space-y-6">
              {/* Contact Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Total Invoiced</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    ₹{selectedClient.total_revenue.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Project Count</span>
                  <span className="text-slate-200 font-bold text-sm">
                    {selectedClient.project_count}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Phone</span>
                  <span className="text-slate-200 font-medium text-[11px] truncate block">
                    {selectedClient.phone}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Last Contact</span>
                  <span className="text-slate-200 font-medium text-[11px]">{selectedClient.last_contact}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Client Notes
                </h4>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
                  {selectedClient.notes || "No notes on record."}
                </div>
              </div>

              {/* Communication Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Communication History Timeline (Calls, Emails, Meetings, Notes)
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {clientComms.length === 0 ? (
                    <div className="text-slate-500 text-xs py-4 text-center">
                      No communications recorded yet. Log your first call or note below!
                    </div>
                  ) : (
                    clientComms.map((cm) => (
                      <div
                        key={cm.id}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                            {cm.comm_type === "Call" && <PhoneCall className="w-3 h-3 text-emerald-400" />}
                            {cm.comm_type === "Email" && <Mail className="w-3 h-3 text-cyan-400" />}
                            {cm.comm_type === "Meeting" && <Video className="w-3 h-3 text-purple-400" />}
                            {cm.comm_type === "Note" && <FileText className="w-3 h-3 text-amber-400" />}
                            <span>{cm.summary}</span>
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(cm.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {cm.details && (
                          <p className="text-slate-400 text-[11px]">{cm.details}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add new communication log */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Log New Interaction</span>
                  <div className="flex space-x-2">
                    <select
                      value={newCommType}
                      onChange={(e) => setNewCommType(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-200"
                    >
                      <option value="Call">Call</option>
                      <option value="Email">Email</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Note">Note</option>
                      <option value="Message">Message</option>
                    </select>
                    <input
                      type="text"
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                      placeholder="Summary (e.g. Discussed new quote, client approved)..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleAddCommunication(selectedClient.id, selectedClient.name)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shrink-0"
                    >
                      Log
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
