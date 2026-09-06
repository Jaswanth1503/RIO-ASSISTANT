"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskStatus, TaskPriority } from "@/lib/businessStore";
import {
  CheckSquare,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  X,
  Calendar,
  User,
  Trash2,
  Edit,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TasksModuleProps {
  tasks: Task[];
  onUpdateTask?: (task: Task) => void;
  onCreateTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

const STATUS_PILLS: Record<TaskStatus, { label: string; color: string }> = {
  Pending: { label: "Pending", color: "bg-slate-800 text-slate-300 border-slate-700" },
  "In Progress": { label: "In Progress", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  Completed: { label: "Completed", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  Blocked: { label: "Blocked", color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  Overdue: { label: "Overdue", color: "bg-red-500/15 text-red-400 border-red-500/30 font-bold" },
};

export default function TasksModule({
  tasks: initialTasks,
  onUpdateTask,
  onCreateTask,
  onDeleteTask,
}: TasksModuleProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const [taskForm, setTaskForm] = useState({
    title: "",
    project_name: "General Operations",
    description: "",
    priority: "High" as TaskPriority,
    status: "Pending" as TaskStatus,
    due_date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
  });

  const filteredTasks = tasks.filter((t) => {
    if (selectedStatus === "ALL") return true;
    return t.status === selectedStatus;
  });

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated: Task = {
            ...t,
            status: t.status === "Completed" ? "Pending" : "Completed",
          };
          if (onUpdateTask) onUpdateTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (onDeleteTask) onDeleteTask(id);
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setTaskForm({
      title: "",
      project_name: "General Operations",
      description: "",
      priority: "High",
      status: "Pending",
      due_date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Task) => {
    setEditingTask(t);
    setTaskForm({
      title: t.title || t.name || "",
      project_name: t.project_name || "General Operations",
      description: t.description || "",
      priority: t.priority || "Medium",
      status: t.status || "Pending",
      due_date: t.due_date,
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    if (editingTask) {
      const updated: Task = {
        ...editingTask,
        title: taskForm.title,
        name: taskForm.title,
        project_name: taskForm.project_name,
        description: taskForm.description,
        priority: taskForm.priority,
        status: taskForm.status,
        due_date: taskForm.due_date,
      };
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      if (onUpdateTask) onUpdateTask(updated);
    } else {
      const created: Task = {
        id: `task-${Date.now()}`,
        title: taskForm.title,
        name: taskForm.title,
        project_name: taskForm.project_name,
        description: taskForm.description,
        priority: taskForm.priority,
        status: taskForm.status,
        due_date: taskForm.due_date,
        created_at: new Date().toISOString(),
      };
      setTasks([created, ...tasks]);
      if (onCreateTask) onCreateTask(created);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <span>Task Management & Project Workstreams</span>
          </h2>
          <p className="text-xs text-slate-400">
            Internal engineering, deliverable sprints, and priority milestones.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {(["ALL", "Pending", "In Progress", "Completed", "Blocked", "Overdue"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                selectedStatus === status
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Tasks List */}
      <div className="glass-panel rounded-2xl border border-slate-800 divide-y divide-slate-800/80 shadow-2xl overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            {tasks.length === 0 ? "No tasks yet." : "No tasks found matching this status filter."}
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isCompleted = t.status === "Completed";
            const pill = STATUS_PILLS[t.status] || STATUS_PILLS.Pending;
            return (
              <div
                key={t.id}
                className="p-4 hover:bg-slate-900/40 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <button
                    onClick={() => handleToggleComplete(t.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-slate-950"
                        : "border-slate-700 bg-slate-950 hover:border-emerald-500"
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span
                        className={cn(
                          "font-bold text-sm truncate",
                          isCompleted ? "line-through text-slate-500" : "text-slate-100"
                        )}
                      >
                        {t.title || t.name}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] px-2 py-0.5 rounded-full font-bold border shrink-0",
                          pill.color
                        )}
                      >
                        {t.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{t.description}</p>

                    <div className="flex items-center space-x-4 mt-2 text-[10px] text-slate-500">
                      <span className="text-slate-300 font-medium">{t.project_name || "General"}</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-slate-500" />
                        Due: {t.due_date}
                      </span>
                      <span
                        className={cn(
                          "font-bold",
                          t.priority === "Critical"
                            ? "text-rose-400"
                            : t.priority === "High"
                            ? "text-amber-400"
                            : "text-slate-400"
                        )}
                      >
                        {t.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    title="Edit Task"
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    title="Delete Task"
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">
              {editingTask ? "Edit Task" : "Add Project Task"}
            </h3>

            <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Optimize SQL index for fleet telemetry"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Project Workstream</label>
                <input
                  type="text"
                  placeholder="e.g. Veera RMC Telematics"
                  value={taskForm.project_name}
                  onChange={(e) => setTaskForm({ ...taskForm, project_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description / Spec</label>
                <textarea
                  rows={2}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, status: e.target.value as TaskStatus })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
