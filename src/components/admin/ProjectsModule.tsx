"use client";

import React, { useState, useEffect } from "react";
import {
  Project,
  ProjectCategory,
  ProjectPhase,
  PHASE_PROGRESS_MAP,
} from "@/lib/businessStore";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Star,
  Layers,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Calendar,
  X,
  Play,
  Pause,
  XCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectsModuleProps {
  projects: Project[];
  onCompleteProject?: (project: Project) => void;
  onUpdateProject?: (project: Project) => void;
}

const PHASES: ProjectPhase[] = [
  "Discovery",
  "Planning",
  "Design",
  "Development",
  "Testing",
  "Deployment",
  "Support",
];

export default function ProjectsModule({
  projects: initialProjects,
  onCompleteProject,
  onUpdateProject,
}: ProjectsModuleProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeTab, setActiveTab] = useState<"ALL" | "Active" | "Upcoming" | "Completed" | "On Hold" | "Cancelled">("Active");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // New Project State
  const [newProject, setNewProject] = useState({
    name: "",
    client_name: "",
    project_type: "Autonomous AI Agent",
    budget: 35000,
    deadline: new Date(Date.now() + 86400000 * 20).toISOString().split("T")[0],
    start_date: new Date().toISOString().split("T")[0],
    description: "",
    priority: "High" as const,
    phase: "Discovery" as ProjectPhase,
  });

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "ALL") return true;
    return p.status === activeTab;
  });

  const handleUpdatePhase = (projectId: string, newPhase: ProjectPhase) => {
    const newProgress = PHASE_PROGRESS_MAP[newPhase] || 15;
    const isNowCompleted = newPhase === "Support" && newProgress === 100;

    const updatedList = projects.map((p) => {
      if (p.id === projectId) {
        const updated: Project = {
          ...p,
          phase: newPhase,
          current_phase: newPhase,
          progress_pct: newProgress,
          progress: newProgress,
          status: isNowCompleted ? "Completed" : p.status,
        };
        if (isNowCompleted && onCompleteProject) {
          onCompleteProject(updated);
        }
        if (onUpdateProject) onUpdateProject(updated);
        return updated;
      }
      return p;
    });

    setProjects(updatedList);
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({
        ...selectedProject,
        phase: newPhase,
        current_phase: newPhase,
        progress_pct: newProgress,
        progress: newProgress,
        status: isNowCompleted ? "Completed" : selectedProject.status,
      });
    }
  };

  const handleUpdateStatus = (projectId: string, newStatus: ProjectCategory) => {
    const updatedList = projects.map((p) => {
      if (p.id === projectId) {
        const isNowCompleted = newStatus === "Completed";
        const updated: Project = {
          ...p,
          status: newStatus,
          progress: isNowCompleted ? 100 : p.progress || p.progress_pct || 15,
          progress_pct: isNowCompleted ? 100 : p.progress || p.progress_pct || 15,
          current_phase: isNowCompleted ? "Support" : p.current_phase || p.phase || "Discovery",
          phase: isNowCompleted ? "Support" : p.current_phase || p.phase || "Discovery",
        };
        if (isNowCompleted && onCompleteProject) {
          onCompleteProject(updated);
        }
        if (onUpdateProject) onUpdateProject(updated);
        return updated;
      }
      return p;
    });

    setProjects(updatedList);
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({
        ...selectedProject,
        status: newStatus,
        progress: newStatus === "Completed" ? 100 : selectedProject.progress,
        progress_pct: newStatus === "Completed" ? 100 : selectedProject.progress_pct,
      });
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Project = {
      id: `proj-${Date.now()}`,
      project_id: `PROJ-${Date.now().toString().slice(-4)}`,
      name: newProject.name,
      project_name: newProject.name,
      client_name: newProject.client_name,
      description: newProject.description || "Production system delivery.",
      budget: Number(newProject.budget),
      deadline: newProject.deadline,
      start_date: newProject.start_date,
      progress_pct: PHASE_PROGRESS_MAP[newProject.phase],
      progress: PHASE_PROGRESS_MAP[newProject.phase],
      status: "Active",
      phase: newProject.phase,
      current_phase: newProject.phase,
      priority: newProject.priority,
      risk_status: "Low",
      notes: "Newly launched project.",
      created_at: new Date().toISOString(),
    };

    setProjects([created, ...projects]);
    if (onUpdateProject) onUpdateProject(created);
    setIsAddModalOpen(false);
  };

  const calculateDaysRemaining = (deadlineStr: string) => {
    if (!deadlineStr) return "Ongoing";
    const diff = new Date(deadlineStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)}d Overdue`;
    if (days === 0) return "Due Today";
    return `${days} days left`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <span>Project Management & Phase Tracker</span>
          </h2>
          <p className="text-xs text-slate-400">
            Lifecycle phase: Proposal Accepted → <strong className="text-emerald-400">Project Execution</strong> → Completion
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {(["ALL", "Active", "Upcoming", "Completed", "On Hold", "Cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === tab
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-500 text-sm">
          No projects available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => {
          const currentPhase = p.current_phase || p.phase || "Discovery";
          const currentProgress = p.progress ?? p.progress_pct ?? 15;
          const projectName = p.project_name || p.name;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col justify-between group space-y-4 shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                    {p.project_id || "PROJECT"}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase",
                        p.risk_status === "High"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : p.risk_status === "Medium"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      )}
                    >
                      {p.risk_status || "Low"} Risk
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300">
                      {p.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mt-2">
                  {projectName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{p.client_name}</p>

                {/* Progress Bar & Phase */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">
                      Stage: <strong className="text-emerald-400">{currentPhase}</strong>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{currentProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                      style={{ width: `${currentProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Phase Stepper Pills */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {PHASES.map((ph) => {
                    const isCurrent = currentPhase === ph;
                    const isPast = PHASE_PROGRESS_MAP[currentPhase] >= PHASE_PROGRESS_MAP[ph];
                    return (
                      <span
                        key={ph}
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded font-medium",
                          isCurrent
                            ? "bg-emerald-500 text-slate-950 font-bold"
                            : isPast
                            ? "bg-slate-800 text-emerald-400"
                            : "bg-slate-900/60 text-slate-600"
                        )}
                      >
                        {ph}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Footer Stats */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Budget</span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    ₹{p.budget.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">Timeline</span>
                  <span className="text-slate-300 font-medium text-xs">
                    {calculateDaysRemaining(p.deadline)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Project Detail Modal with Lifecycle Actions */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400">
                  {selectedProject.project_id || "PROJECT"}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-1">
                  {selectedProject.project_name || selectedProject.name}
                </h3>
                <p className="text-xs text-slate-400">Client: {selectedProject.client_name}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Budget</span>
                <span className="text-emerald-400 font-bold text-sm">
                  ₹{selectedProject.budget.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Progress</span>
                <span className="text-slate-200 font-bold text-sm">
                  {selectedProject.progress ?? selectedProject.progress_pct ?? 15}%
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Deadline</span>
                <span className="text-slate-300 font-medium text-[11px] block">
                  {selectedProject.deadline}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Status</span>
                <span className="text-emerald-400 font-bold text-xs">{selectedProject.status}</span>
              </div>
            </div>

            {/* Interactive Phase Stepper */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Update Project Stage (Auto-calculates Progress %)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PHASES.map((ph) => {
                  const currentPh = selectedProject.current_phase || selectedProject.phase;
                  const isSelected = currentPh === ph;
                  return (
                    <button
                      key={ph}
                      onClick={() => handleUpdatePhase(selectedProject.id, ph)}
                      className={cn(
                        "p-2 rounded-xl text-left border transition-all text-xs",
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      )}
                    >
                      <div className="font-semibold">{ph}</div>
                      <div className="text-[10px] opacity-70">{PHASE_PROGRESS_MAP[ph]}% Progress</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Phase 4 Actions: Start, Pause, Resume, Complete, Cancel */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                {selectedProject.status !== "Active" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedProject.id, "Active")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{selectedProject.status === "On Hold" ? "Resume Project" : "Start Project"}</span>
                  </button>
                )}
                {selectedProject.status === "Active" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedProject.id, "On Hold")}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Project</span>
                  </button>
                )}
                {selectedProject.status !== "Cancelled" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedProject.id, "Cancelled")}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Project</span>
                  </button>
                )}
              </div>

              {selectedProject.status !== "Completed" && (
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedProject.id, "Completed");
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complete Project (100%) →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Launch New Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Launch New Project</h3>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Crop Disease Detection"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PestRisk Agriculture"
                    value={newProject.client_name}
                    onChange={(e) => setNewProject({ ...newProject, client_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Budget (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Deadline Date</label>
                <input
                  type="date"
                  required
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
