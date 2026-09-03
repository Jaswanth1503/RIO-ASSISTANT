"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectsModuleProps {
  projects: Project[];
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

export default function ProjectsModule({ projects: initialProjects }: ProjectsModuleProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeTab, setActiveTab] = useState<"ALL" | "Active" | "Upcoming" | "Completed" | "On Hold">("Active");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    const newProgress = PHASE_PROGRESS_MAP[newPhase];
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              phase: newPhase,
              progress_pct: newProgress,
              status: newPhase === "Support" ? "Completed" : p.status,
            }
          : p
      )
    );
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({
        ...selectedProject,
        phase: newPhase,
        progress_pct: newProgress,
      });
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.client_name) return;

    const created: Project = {
      id: `prj-${Date.now()}`,
      name: newProject.name,
      client_name: newProject.client_name,
      project_type: newProject.project_type,
      description: newProject.description,
      budget: Number(newProject.budget),
      deadline: newProject.deadline,
      start_date: newProject.start_date,
      progress_pct: PHASE_PROGRESS_MAP[newProject.phase],
      status: "Active",
      phase: newProject.phase,
      priority: newProject.priority,
      assigned_resources: "Annu Jaswanth",
      risk_status: "Low",
      probability_pct: 100,
      notes: "Project initiated through business operations dashboard.",
    };

    setProjects([created, ...projects]);
    setIsAddModalOpen(false);
  };

  const calculateDaysRemaining = (deadlineStr: string) => {
    const now = new Date().getTime();
    const target = new Date(deadlineStr).getTime();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days left` : "Deadline today";
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Project Operations Hub</h2>
          <p className="text-xs text-slate-400">
            Track active engineering deliverables, upcoming pipelines, and completed architectures.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            {(["Active", "Upcoming", "Completed", "ALL"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg font-semibold transition-all",
                  activeTab === tab
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProject(p)}
            className="glass-panel rounded-3xl border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all cursor-pointer group bg-slate-950/70"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {p.project_type}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mt-0.5">
                    {p.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">Client: {p.client_name}</div>
                </div>

                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold border",
                    p.status === "Active"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : p.status === "Upcoming"
                      ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  )}
                >
                  {p.status}
                </span>
              </div>

              {/* Progress Bar & Phase */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Phase: <strong className="text-slate-200">{p.phase}</strong></span>
                  <span className="font-bold text-emerald-400">{p.progress_pct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                    style={{ width: `${p.progress_pct}%` }}
                  ></div>
                </div>
              </div>

              {/* Phase Stepper Pills */}
              <div className="mt-4 flex flex-wrap gap-1">
                {PHASES.map((ph, idx) => {
                  const isCurrent = p.phase === ph;
                  const isPast = PHASE_PROGRESS_MAP[p.phase] >= PHASE_PROGRESS_MAP[ph];
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
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
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
        ))}
      </div>

      {/* Project Detail & Phase Updating Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400">
                  {selectedProject.project_type}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-1">{selectedProject.name}</h3>
                <p className="text-xs text-slate-400">Client: {selectedProject.client_name}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Phase Updater */}
            <div className="my-6">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Update Project Stage (Automatically recalculates progress)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PHASES.map((ph) => {
                  const isSelected = selectedProject.phase === ph;
                  return (
                    <button
                      key={ph}
                      onClick={() => handleUpdatePhase(selectedProject.id, ph)}
                      className={cn(
                        "p-2.5 rounded-xl text-xs font-semibold border transition-all text-center",
                        isSelected
                          ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      )}
                    >
                      <div>{ph}</div>
                      <span className="text-[10px] opacity-75">{PHASE_PROGRESS_MAP[ph]}%</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description & Overview */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Total Budget</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    ₹{selectedProject.budget.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Start Date</span>
                  <span className="text-slate-200 font-medium">{selectedProject.start_date}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Deadline</span>
                  <span className="text-slate-200 font-medium">{selectedProject.deadline}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Risk Status</span>
                  <span className="text-emerald-400 font-bold">{selectedProject.risk_status}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Architecture & Scope Notes
                </h4>
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  {selectedProject.description || selectedProject.notes}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100">Create New Project</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4 my-6 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. AI Customer Concierge"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newProject.client_name}
                    onChange={(e) => setNewProject({ ...newProject, client_name: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Budget (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initial Phase</label>
                <select
                  value={newProject.phase}
                  onChange={(e) => setNewProject({ ...newProject, phase: e.target.value as ProjectPhase })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  {PHASES.map((ph) => (
                    <option key={ph} value={ph}>
                      {ph} ({PHASE_PROGRESS_MAP[ph]}%)
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                Add Project to Operations
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
