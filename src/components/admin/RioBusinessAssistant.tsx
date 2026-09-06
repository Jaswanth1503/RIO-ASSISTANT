"use client";

import React, { useState } from "react";
import {
  Project,
  Meeting,
  Proposal,
  RevenueRecord,
  FollowUp,
  computeRioBusinessSummary,
} from "@/lib/businessStore";
import {
  Bot,
  Sparkles,
  Send,
  Briefcase,
  Flame,
  Calendar,
  FileText,
  DollarSign,
  AlertTriangle,
  Clock,
  ArrowRight,
  UserCheck,
} from "lucide-react";

interface RioBusinessAssistantProps {
  projects: Project[];
  meetings: Meeting[];
  proposals: Proposal[];
  revenues: RevenueRecord[];
  followUps: FollowUp[];
  hotLeadsCount: number;
}

interface ChatMessage {
  id: string;
  sender: "user" | "rio";
  text: string;
  dataSummary?: Record<string, any>;
  timestamp: string;
}

export default function RioBusinessAssistant({
  projects,
  meetings,
  proposals,
  revenues,
  followUps,
  hotLeadsCount,
}: RioBusinessAssistantProps) {
  const summary = computeRioBusinessSummary(
    projects,
    meetings,
    proposals,
    revenues,
    followUps,
    hotLeadsCount
  );

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "rio",
      text: "Hello Annu! I'm RIO, your digital business representative. I have full real-time telemetry over your leads, meetings, proposals, active projects, tasks, and monthly revenue. Ask me anything about your current business operations!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const quickQuestions = [
    "How many active projects?",
    "How many hot leads?",
    "What meetings are scheduled today?",
    "What proposals are pending?",
    "How much revenue this month?",
    "Which projects are overdue?",
    "Which clients need follow-up?",
  ];

  const handleQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    let answer = "";
    const q = queryText.toLowerCase();

    if (q.includes("active project")) {
      answer = `You currently have ${summary.activeProjectsCount} active project(s): ${summary.activeProjectsList.join(
        ", "
      ) || "None currently in development"}.`;
    } else if (q.includes("hot lead")) {
      answer = `You have ${summary.hotLeadsCount} HOT lead(s) with budgets exceeding ₹20,000 and urgent timelines waiting for scoping calls.`;
    } else if (q.includes("meeting") && (q.includes("today") || q.includes("scheduled"))) {
      if (summary.todayMeetingsCount > 0) {
        answer = `You have ${summary.todayMeetingsCount} meeting(s) scheduled for today:\n${summary.todayMeetingsList
          .map((m) => `• ${m}`)
          .join("\n")}`;
      } else {
        answer = "You have no meetings scheduled for today. The calendar is open for deep development work.";
      }
    } else if (q.includes("proposal")) {
      answer = `You have ${summary.pendingProposalsCount} pending proposal(s):\n${summary.pendingProposalsList
        .map((p) => `• ${p}`)
        .join("\n")}`;
    } else if (q.includes("revenue") && q.includes("month")) {
      answer = `Settled revenue for this month is ₹${summary.monthlyRevenue.toLocaleString(
        "en-IN"
      )}. Total lifetime revenue recorded is ₹${summary.totalRevenue.toLocaleString("en-IN")}.`;
    } else if (q.includes("overdue") && q.includes("project")) {
      if (summary.overdueProjectsCount > 0) {
        answer = `Attention: You have ${summary.overdueProjectsCount} project(s) past their target deadline that require review.`;
      } else {
        answer = "Great news! All active projects are currently on track and within deadline limits.";
      }
    } else if (q.includes("follow") || q.includes("client")) {
      answer = `You have ${summary.clientsNeedingFollowupCount} client(s) due for follow-up:\n${summary.clientsNeedingFollowupList
        .map((c) => `• ${c}`)
        .join("\n")}`;
    } else {
      answer = `Operational Summary for Annu Jaswanth:\n• Active Projects: ${summary.activeProjectsCount}\n• HOT Leads: ${summary.hotLeadsCount}\n• Today's Meetings: ${summary.todayMeetingsCount}\n• Pending Proposals: ${summary.pendingProposalsCount}\n• Monthly Settled Revenue: ₹${summary.monthlyRevenue.toLocaleString("en-IN")}\n• Pending Follow-Ups: ${summary.clientsNeedingFollowupCount}`;
    }

    const rioMsg: ChatMessage = {
      id: `rio-${Date.now()}`,
      sender: "rio",
      text: answer,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg, rioMsg]);
    setInputQuery("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Bot className="w-5 h-5 text-emerald-400" />
          <span>RIO Autonomous Business Intelligence</span>
        </h2>
        <p className="text-xs text-slate-400">
          Executive operating copilot with live data telemetry across your entire agency funnel.
        </p>
      </div>

      {/* Real-time Telemetry Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span>Active Projects</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{summary.activeProjectsCount}</div>
          <span className="text-[10px] text-slate-500">In production delivery</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span>Hot Leads</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-1">{summary.hotLeadsCount}</div>
          <span className="text-[10px] text-red-500/70">Score &gt; ₹20k / Urgent</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span>Today's Calls</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{summary.todayMeetingsCount}</div>
          <span className="text-[10px] text-slate-500">AI Phone Consultations</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span>Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            ₹{summary.monthlyRevenue.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-emerald-500/70">Settled this calendar month</span>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Ask RIO Real-time Questions
        </span>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((qq) => (
            <button
              key={qq}
              onClick={() => handleQuery(qq)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all text-left flex items-center space-x-1.5"
            >
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{qq}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Dialogue Console */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[480px]">
        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${
                m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  m.sender === "user"
                    ? "bg-slate-800 border-slate-700 text-slate-200"
                    : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                }`}
              >
                {m.sender === "user" ? (
                  <UserCheck className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.sender === "user"
                    ? "bg-emerald-500 text-slate-950 font-medium ml-auto"
                    : "bg-slate-900 border border-slate-800 text-slate-200 shadow-md"
                }`}
              >
                {m.text}
                <span
                  className={`block text-[10px] mt-1.5 ${
                    m.sender === "user" ? "text-slate-900/60" : "text-slate-500"
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuery(inputQuery);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask RIO: 'How many active projects?', 'How much revenue this month?'..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask RIO</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
