"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, Clock, Calendar, Briefcase, Users, AlertTriangle, X } from "lucide-react";
import { NotificationItem } from "@/lib/businessStore";
import { cn } from "@/lib/utils";

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAllRead,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "lead":
        return <Users className="w-4 h-4 text-emerald-400" />;
      case "meeting":
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case "followup":
        return <Clock className="w-4 h-4 text-amber-400" />;
      case "project":
        return <Briefcase className="w-4 h-4 text-teal-400" />;
      case "task":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel-glow border border-slate-700 shadow-2xl p-4 z-50 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center"
                >
                  <Check className="w-3 h-3 mr-1" /> Mark read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto mt-2">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "py-3 px-2 flex items-start space-x-3 rounded-xl transition-colors",
                    notif.unread ? "bg-slate-900/60" : "hover:bg-slate-900/40"
                  )}
                >
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-slate-200 flex items-center justify-between">
                      <span>{notif.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{notif.time || notif.timestamp}</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">
                      {notif.description || notif.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
