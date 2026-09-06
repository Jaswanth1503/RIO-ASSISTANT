"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  Briefcase,
  DollarSign,
  Calendar,
  CheckSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bot,
  UserCheck,
  FileText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab =
  | "dashboard"
  | "leads"
  | "followups"
  | "clients"
  | "proposals"
  | "projects"
  | "revenue"
  | "meetings"
  | "tasks"
  | "analytics"
  | "assistant"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  counts: {
    leads: number;
    followups: number;
    activeProjects: number;
    tasks: number;
    meetings: number;
    proposals?: number;
  };
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  counts,
}: AdminSidebarProps) {
  const menuItems = [
    {
      id: "dashboard" as AdminTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "leads" as AdminTab,
      label: "Leads",
      icon: Users,
      badge: counts.leads > 0 ? counts.leads : null,
    },
    {
      id: "followups" as AdminTab,
      label: "Follow-Ups",
      icon: Clock,
      badge: counts.followups > 0 ? counts.followups : null,
    },
    {
      id: "clients" as AdminTab,
      label: "Clients",
      icon: UserCheck,
      badge: null,
    },
    {
      id: "proposals" as AdminTab,
      label: "Proposals",
      icon: FileText,
      badge: counts.proposals && counts.proposals > 0 ? counts.proposals : null,
    },
    {
      id: "projects" as AdminTab,
      label: "Projects",
      icon: Briefcase,
      badge: counts.activeProjects > 0 ? counts.activeProjects : null,
    },
    {
      id: "revenue" as AdminTab,
      label: "Revenue",
      icon: DollarSign,
      badge: null,
    },
    {
      id: "meetings" as AdminTab,
      label: "Meetings",
      icon: Calendar,
      badge: counts.meetings > 0 ? counts.meetings : null,
    },
    {
      id: "tasks" as AdminTab,
      label: "Tasks",
      icon: CheckSquare,
      badge: counts.tasks > 0 ? counts.tasks : null,
    },
    {
      id: "assistant" as AdminTab,
      label: "RIO Assistant",
      icon: Bot,
      badge: "AI",
    },
    {
      id: "analytics" as AdminTab,
      label: "Analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "settings" as AdminTab,
      label: "Settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={cn(
        "bg-slate-950/95 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between z-30 shrink-0 select-none",
        isCollapsed ? "w-16 sm:w-20" : "w-60 sm:w-64"
      )}
    >
      {/* Sidebar Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shadow-md">
                R
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-100 tracking-tight">RIO</span>
                <span className="text-[10px] text-emerald-400 font-bold block leading-none">
                  BUSINESS OS
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm mx-auto shadow-md">
              R
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden sm:flex text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center rounded-xl text-xs font-semibold transition-all relative group",
                  isCollapsed ? "justify-center p-3" : "px-3.5 py-2.5 space-x-3",
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-emerald-400" : "text-slate-400"
                  )}
                />

                {!isCollapsed && <span className="truncate">{item.label}</span>}

                {!isCollapsed && item.badge !== null && (
                  <span
                    className={cn(
                      "ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold",
                      isActive
                        ? "bg-emerald-500 text-slate-950"
                        : item.badge === "AI"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="p-3 border-t border-slate-800/80">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0">
              AJ
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">Annu Jaswanth</div>
              <div className="text-[10px] text-emerald-400/90 truncate flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse"></span>
                Executive Mode
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-400 mx-auto"
            title="Annu Jaswanth (Executive Mode)"
          >
            AJ
          </div>
        )}
      </div>
    </aside>
  );
}
