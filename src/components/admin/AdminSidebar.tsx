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
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab =
  | "dashboard"
  | "leads"
  | "followups"
  | "clients"
  | "projects"
  | "revenue"
  | "meetings"
  | "tasks"
  | "analytics"
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
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    },
    {
      id: "clients" as AdminTab,
      label: "Clients",
      icon: UserCheck,
      badge: null,
    },
    {
      id: "projects" as AdminTab,
      label: "Projects",
      icon: Briefcase,
      badge: counts.activeProjects > 0 ? counts.activeProjects : null,
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
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
      badgeColor: "bg-red-500/20 text-red-400 border border-red-500/30",
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
        "relative flex flex-col justify-between bg-slate-950 border-r border-slate-800 transition-all duration-300 select-none z-30 shrink-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Top Brand area */}
      <div>
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/80">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-xs shadow-md shrink-0">
                RIO
              </div>
              <div className="leading-tight truncate">
                <span className="font-extrabold text-sm text-slate-100 block truncate">
                  Annu Jaswanth
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wide uppercase">
                  Business OS
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-xs mx-auto shadow-md">
              RIO
            </div>
          )}

          {/* Collapse toggle button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors",
              isCollapsed && "hidden"
            )}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsed expander trigger */}
        {isCollapsed && (
          <div className="text-center py-2 border-b border-slate-800/50">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center rounded-xl text-xs font-semibold transition-all group py-2.5",
                  isCollapsed ? "justify-center px-0" : "justify-between px-3",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                )}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== null && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-2",
                      item.badgeColor || "bg-slate-800 text-slate-300 border border-slate-700"
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

      {/* Bottom Profile Summary */}
      <div className="p-3 border-t border-slate-800/80">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-500/30">
              AJ
            </div>
            <div className="overflow-hidden leading-tight text-left">
              <span className="text-xs font-bold text-slate-200 block truncate">Annu Jaswanth</span>
              <span className="text-[10px] text-slate-500 truncate block">AI & Full Stack</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              AJ
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
