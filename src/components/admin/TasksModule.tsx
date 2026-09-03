"use client";

import React, { useState } from "react";
import { Task, TaskStatus } from "@/lib/businessStore";
import {
  CheckSquare,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  X,
  Calendar,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TasksModuleProps {
  tasks: Task[];
}

const STATUS_PILLS: Record<TaskStatus, { label: string; color: string }> = {
  Pending: { label: "Pending", color: "bg-slate-800 text-slate-300 border-slate-700" },
  "In Progress": { label: "In Progress", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  Completed: { label: "Completed", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  Blocked: { label: "Blocked", color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  Overdue: { label: "Overdue", color: "bg-red-500/15 text-red-400 border-red-500/30" },
};

export default function TasksModule({ tasks: initialTasks }: TasksModuleProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    name: "",
    project_name: "Veera RMC",
    description: "",
    priority: "High" as const,
    due_date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    assigned_to: "Annu Jaswanth",
  });

  const filteredTasks = tasks.filter((t) => {
    if (selectedStatus === "ALL") return true;
    return t.status === selectedStatus;
  });

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "Completed" ? "Pending" : "Completed",
            }
          : t
      )
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name) return;

    const created: Task = {
      id: `tsk-${Date.now()}`,
      name: newTask.name,
      project_name: newTask.project_name,
      description: newTask.description,
      priority: newTask.priority,
      due_date: newTask.due_date,
      status: "Pending",
      assigned_to: newTask.assigned_to,
    };

    setTasks([created, ...tasks]);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Engineering & Daily Tasks</h2>
          <p className="text-xs text-slate-400">
            Internal task tracking for active deliverables, client revisions, and deployments.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-x-auto">
            {["ALL", "In Progress", "Pending", "Completed"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg font-semibold transition-all",
                  selectedStatus === st
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="divide-y divide-slate-800/80">
          {filteredTasks.map((t) => {
            const isDone = t.status === "Completed";
            const pill = STATUS_PILLS[t.status] || STATUS_PILLS.Pending;
            return (
              <div
                key={t.id}
                className="p-4 flex items-start justify-between hover:bg-slate-900/40 transition-colors group"
              >
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => handleToggleComplete(t.id)}
                    className={cn(
                      "mt-0.5 h-5 w-5 rounded-lg border flex items-center justify-center transition-all",
                      isDone
                        ? "bg-emerald-500 border-emerald-500 text-slate-950"
                        : "border-slate-700 bg-slate-950 hover:border-emerald-400 text-transparent"
                    )}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4
                        className={cn(
                          "text-xs sm:text-sm font-bold",
                          isDone ? "line-through text-slate-500" : "text-slate-100"
                        )}
                      >
                        {t.name}
                      </h4>
                      {t.project_name && (
                        <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.2 rounded">
                          {t.project_name}
                        </span>
                      )}
                    </div>
                    {t.description && (
                      <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                        {t.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-0.5">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> Due: {t.due_date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" /> {t.assigned_to}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold border",
                      pill.color
                    )}
                  >
                    {t.status}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold",
                      t.priority === "Urgent"
                        ? "text-red-400"
                        : t.priority === "High"
                        ? "text-orange-400"
                        : "text-slate-400"
                    )}
                  >
                    {t.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">Create Task</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 my-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  placeholder="e.g. Audit WebSocket reconnect interval"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Associated</label>
                <input
                  type="text"
                  value={newTask.project_name}
                  onChange={(e) => setNewTask({ ...newTask, project_name: e.target.value })}
                  placeholder="e.g. Veera RMC / General"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Optional details or acceptance criteria..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
