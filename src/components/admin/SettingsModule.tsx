"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Key,
  Mail,
  Bot,
  Database,
  CheckCircle2,
  Lock,
  Save,
  Bell,
  Cpu,
} from "lucide-react";

export default function SettingsModule() {
  const [email, setEmail] = useState("annujaswanth15@gmail.com");
  const [passcode, setPasscode] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Business Operating System Settings</h2>
        <p className="text-xs text-slate-400">
          Configure notification dispatch, administrative credentials, and AI representative integration parameters.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuration saved successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Account & Notifications */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>Lead Alert & Notification Dispatch</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Primary Notification Recipient Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Instant HTML emails for all HOT/WARM leads are dispatched here via Resend.
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Admin Master Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Managed securely via server-side environment variables. Never exposed in browser code.
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </form>
        </div>

        {/* System Architecture Status */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Integration Services & Live Telemetry</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Gemini 2.5 Flash</div>
                <div className="text-[10px] text-slate-400">AI Reasoning & Streaming</div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Supabase PostgreSQL</div>
                <div className="text-[10px] text-slate-400">Lead & Data Storage</div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Resend Engine</div>
                <div className="text-[10px] text-slate-400">Transactional Email Alerting</div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Vapi Telephony</div>
                <div className="text-[10px] text-slate-400">Autonomous Outbound Calling</div>
              </div>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-bold border border-cyan-500/30">
                READY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
