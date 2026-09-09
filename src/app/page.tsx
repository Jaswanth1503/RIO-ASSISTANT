"use client";

import React, { useState } from "react";
import {
  Bot,
  ArrowRight,
  Code2,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Zap,
  ChevronRight,
  Terminal,
  Activity,
  Award,
  Clock,
  Flame,
  Truck,
  Leaf,
  Calendar,
  Lock,
  Menu,
  X,
} from "lucide-react";
import MeetingScheduler from "@/components/calendar/MeetingScheduler";

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<string>("ai-agent");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const openRioWithPrompt = (prompt: string) => {
    // Dispatch custom event to RIO widget or open chat
    window.dispatchEvent(new CustomEvent("rio:prompt", { detail: prompt }));
    // Also scroll/focus
    const triggerBtn = document.querySelector('button[aria-label="Open RIO AI Assistant"]') as HTMLButtonElement;
    if (triggerBtn) {
      triggerBtn.click();
    }
  };

  return (
    <main className="min-h-screen relative text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 shadow-md">
              AJ
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-100">
                Annu Jaswanth
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                AI & Full Stack
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <a href="#projects" className="hover:text-emerald-400 transition-colors">
              Projects
            </a>
            <a href="#services" className="hover:text-emerald-400 transition-colors">
              Services
            </a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">
              Pricing Guide
            </a>
            <a href="#stack" className="hover:text-emerald-400 transition-colors">
              Tech Stack
            </a>
            <a href="#book-call" className="hover:text-emerald-400 transition-colors">
              Book Call
            </a>
            <a
              href="/admin"
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1"
              title="Admin Lead Center"
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Portal</span>
            </a>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Direct Portal Login Button - Visible on Both Mobile and Desktop */}
            <a
              href="/admin"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-400 transition-all shadow-sm"
              title="Admin Portal Login"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold">Portal</span>
            </a>

            <a
              href="https://github.com/Jaswanth1503"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 p-2 transition-colors"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/annu-jaswanth-88aa4033b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 p-2 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              href="#book-call"
              className="hidden sm:inline-flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg hover:shadow-emerald-500/25"
            >
              <span>Schedule Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 text-emerald-400" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-xl px-4 py-4 space-y-3 shadow-2xl animate-fade-in">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-300">
              <a
                href="#projects"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/30 hover:text-emerald-400 transition-all flex items-center space-x-2"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Projects</span>
              </a>
              <a
                href="#services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/30 hover:text-emerald-400 transition-all flex items-center space-x-2"
              >
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>Services</span>
              </a>
              <a
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/30 hover:text-emerald-400 transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pricing Guide</span>
              </a>
              <a
                href="#stack"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/30 hover:text-emerald-400 transition-all flex items-center space-x-2"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tech Stack</span>
              </a>
            </div>

            {/* Direct Admin Portal Card in Mobile Menu */}
            <a
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 text-slate-200 hover:text-white transition-all shadow-md group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                    <span>Admin Portal Login</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30 font-bold">
                      ADMIN
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">Leads, calls, pipeline & telemetry</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#book-call"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Strategy Call</span>
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Availability Pill */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 mb-8 shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-200">Open for Client Engagements</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-medium">Represented 24/7 by RIO AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-100">
            Engineering High-Performance <br className="hidden sm:block" />
            <span className="gradient-text-green">Autonomous AI Agents</span> & Full-Stack Systems
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Hi, I’m <strong className="text-slate-200 font-bold">Annu Jaswanth</strong>. I architect revenue-driving web applications, telemetry platforms, and intelligent AI representatives that qualify leads and automate complex workflows.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openRioWithPrompt("What services do you offer and what is your typical turnaround time?")}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-[1.02]"
            >
              <Bot className="w-4 h-4" />
              <span>Converse with RIO (AI Rep)</span>
            </button>

            <a
              href="#projects"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-sm border border-slate-700/80 transition-all"
            >
              <span>View Past Projects</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 text-left">
              <div className="text-2xl font-black text-emerald-400">99+</div>
              <div className="text-xs text-slate-400 mt-1">Lighthouse Speed</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 text-left">
              <div className="text-2xl font-black text-teal-400">28%</div>
              <div className="text-xs text-slate-400 mt-1">Fleet Transit Reduction</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 text-left">
              <div className="text-2xl font-black text-cyan-400">94%+</div>
              <div className="text-xs text-slate-400 mt-1">AI Crop Model Accuracy</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 text-left">
              <div className="text-2xl font-black text-slate-100">100%</div>
              <div className="text-xs text-slate-400 mt-1">Client IP Ownership</div>
            </div>
          </div>
        </div>
      </section>

      {/* RIO AI Showcase Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl glass-panel-glow p-8 sm:p-12 relative overflow-hidden border border-emerald-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Meet RIO • Autonomous Digital Representative</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                Not a Generic Bot. A Dedicated Technical Sales & Qualification Agent.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                RIO is engineered to represent Annu Jaswanth with complete context over his tech stack, project case studies, and pricing models. RIO analyzes inbound client needs, assigns BANT qualification scores, notifies Annu instantly, and books discovery calls.
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => openRioWithPrompt("Tell me about Annu's background and education")}
                  className="text-xs bg-slate-900/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
                >
                  🎓 Background & Education
                </button>
                <button
                  onClick={() => openRioWithPrompt("What is the pricing range for an AI Agent?")}
                  className="text-xs bg-slate-900/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
                >
                  💰 Pricing Ranges
                </button>
                <button
                  onClick={() => openRioWithPrompt("How did Annu build the Veera RMC fleet platform?")}
                  className="text-xs bg-slate-900/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
                >
                  🚚 Veera RMC Case Study
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-400 flex items-center">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> RIO Realtime Core
                </span>
                <span className="text-emerald-400 font-mono">Gemini 2.5 Flash</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Lead scoring (HOT, WARM, COLD)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant email alert to annujaswanth15@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated outbound telephone calls via Vapi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive Google Calendar appointment booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Flagship Engineering <span className="gradient-text-green">Case Studies</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Real-world systems delivering tangible business ROI and mission-critical reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project 1: Veera RMC */}
          <div className="glass-panel rounded-3xl border border-slate-800/80 p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Industrial Telemetry
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                Veera RMC
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-1">
                Ready-Mix Concrete Operations & Fleet Intelligence
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
                Industrial logistics platform solving perishable concrete delivery. Features real-time GPS telemetry, automated dispatch balancing batch plant throughput, and digital proof-of-delivery (e-POD).
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {["Next.js", "PostgreSQL", "WebSockets", "Leaflet", "IoT GPS"].map((t) => (
                  <span key={t} className="text-[10px] bg-slate-900 text-slate-400 px-2.5 py-1 rounded-md border border-slate-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">28% Transit Delay Reduction</span>
              <button
                onClick={() => openRioWithPrompt("Tell me all technical details about Veera RMC")}
                className="text-slate-400 hover:text-white flex items-center space-x-1"
              >
                <span>Ask RIO</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Project 2: PestRisk */}
          <div className="glass-panel rounded-3xl border border-slate-800/80 p-6 sm:p-8 flex flex-col justify-between hover:border-teal-500/40 transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Leaf className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                  Computer Vision & ML
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition-colors">
                PestRisk
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-1">
                AI Crop Disease & Pest Risk Intelligence
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
                Agritech deep learning system delivering sub-second crop disease diagnostics from leaf images. Correlates micro-climate temperature and humidity forecasts to predict fungal outbreaks before crop damage occurs.
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {["PyTorch", "YOLO", "FastAPI", "OpenCV", "EfficientNet"].map((t) => (
                  <span key={t} className="text-[10px] bg-slate-900 text-slate-400 px-2.5 py-1 rounded-md border border-slate-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-teal-400 font-bold">94%+ Classification Accuracy</span>
              <button
                onClick={() => openRioWithPrompt("Explain the PestRisk computer vision model and architecture")}
                className="text-slate-400 hover:text-white flex items-center space-x-1"
              >
                <span>Ask RIO</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Project 3: RIO */}
          <div className="glass-panel rounded-3xl border border-emerald-500/30 p-6 sm:p-8 flex flex-col justify-between bg-emerald-950/10 hover:border-emerald-500/60 transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  AI Representative
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                RIO
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-1">
                Autonomous Sales, Scoping & Lead Qualification
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
                The very AI representative you are interacting with. Features streaming Gemini reasoning, BANT lead qualification scoring, Supabase persistence, automated Resend email dispatch, and Vapi telephone calling.
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {["Next.js 15", "Gemini 2.5", "Supabase", "Resend", "Vapi AI"].map((t) => (
                  <span key={t} className="text-[10px] bg-slate-900 text-slate-400 px-2.5 py-1 rounded-md border border-slate-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">Live Production Agent</span>
              <button
                onClick={() => openRioWithPrompt("How was RIO architected and built?")}
                className="text-emerald-400 font-bold flex items-center space-x-1"
              >
                <span>Interact</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-950/40">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            High-Impact <span className="gradient-text-green">Services & Solutions</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Custom engineered for founders, enterprises, and growth-focused businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Autonomous AI Agents",
              desc: "Multi-step reasoning agents that execute tools, query databases, and automate workflows.",
              turnaround: "1–3 Weeks",
              range: "₹15,000 – ₹1,00,000+",
            },
            {
              title: "AI Chatbots & Assistants",
              desc: "Domain-trained chatbots with streaming, custom knowledge RAG, and lead capture.",
              turnaround: "5–10 Days",
              range: "₹10,000 – ₹50,000",
            },
            {
              title: "Business Web Applications",
              desc: "High-converting modern commercial sites with sub-second performance and clean CMS.",
              turnaround: "1–2 Weeks",
              range: "₹10,000 – ₹50,000",
            },
            {
              title: "Portfolio Websites",
              desc: "Hyper-personalized, sleek dark-mode portfolio positioning you in the top 1%.",
              turnaround: "3–7 Days",
              range: "₹5,000 – ₹15,000",
            },
            {
              title: "Workflow Automation Systems",
              desc: "Connecting CRMs, WhatsApp, Resend, and webhooks into zero-touch event pipelines.",
              turnaround: "3–10 Days",
              range: "Scope Based",
            },
            {
              title: "Custom Dashboards & Portals",
              desc: "Role-based admin management consoles with real-time charts, telemetry, and CRUD.",
              turnaround: "1–3 Weeks",
              range: "Scope Based",
            },
            {
              title: "Full-Stack SaaS Applications",
              desc: "End-to-end production software with auth, billing, database modeling, and edge APIs.",
              turnaround: "2–6 Weeks",
              range: "Scope Based",
            },
            {
              title: "Computer Vision & ML",
              desc: "Bespoke deep learning models for classification, object detection, and predictive scoring.",
              turnaround: "2–4 Weeks",
              range: "Scope Based",
            },
          ].map((srv, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-slate-100">{srv.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{srv.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] flex justify-between items-center">
                <span className="text-slate-400">{srv.turnaround}</span>
                <span className="text-emerald-400 font-bold">{srv.range}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Guide Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <span>Transparent Investment Guide</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Predictable Pricing & <span className="gradient-text-green">Scope Estimates</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Ballpark investment ranges to help you evaluate budget fit. Final pricing is tailored to exact complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Tier 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Entry Level</div>
              <h3 className="text-xl font-bold text-slate-100 mt-1">Portfolio & Brand Site</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-100">₹5,000 – ₹15,000</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Ideal for individual engineers, founders, and consultants needing a standout web presence.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Custom dark-mode responsive design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contact & booking form integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3–7 Days Turnaround</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Source code handover</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => openRioWithPrompt("I am interested in a Portfolio Website. What details do you need?")}
              className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              Discuss Portfolio Scope
            </button>
          </div>

          {/* Tier 2 - Highlighted */}
          <div className="glass-panel-glow p-8 rounded-3xl border border-emerald-500/50 relative flex flex-col justify-between bg-emerald-950/20 shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Requested
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">High Commercial Value</div>
              <h3 className="text-xl font-bold text-slate-100 mt-1">AI Chatbot & Business App</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-emerald-400">₹10,000 – ₹50,000</span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Ideal for growing startups and businesses automating sales qualification and customer support.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gemini / OpenAI streaming AI assistant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lead capture + Supabase / CRM sync</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant Resend email notifications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1–2 Weeks Turnaround</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => openRioWithPrompt("I want to build an AI Chatbot or Business Website. Can you give me an estimate?")}
              className="mt-8 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg transition-all"
            >
              Discuss AI Chatbot Scope
            </button>
          </div>

          {/* Tier 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Advanced Architecture</div>
              <h3 className="text-xl font-bold text-slate-100 mt-1">Autonomous AI Agent / SaaS</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-100">₹15,000 – ₹1,00,000+</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                For enterprises needing function calling, automated telephony (Vapi), or full-stack software.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Autonomous tool-calling & database RAG</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Automated outbound voice calls via Vapi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Protected Admin Lead & Analytics Portal</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dedicated 30-day post-launch warranty</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => openRioWithPrompt("I have a custom AI Agent or SaaS project. Let's discuss requirements.")}
              className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              Discuss Agent Architecture
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500 max-w-xl mx-auto">
          *Note: All prices are indicative estimates. RIO and Annu operate on milestone-based deposits (40% advance, 30% milestone demo, 30% production delivery) with full IP ownership transferred to you.
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="stack" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Modern & Scalable <span className="gradient-text-green">Technology Stack</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Chosen for sub-second performance, rock-solid reliability, and effortless maintainability.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {[
            { name: "Next.js 15", category: "Full-Stack Web" },
            { name: "React 19", category: "UI Architecture" },
            { name: "TypeScript", category: "Type-Safety" },
            { name: "Python", category: "AI / ML Pipelines" },
            { name: "Java", category: "OOP / Algorithms" },
            { name: "Tailwind CSS", category: "Styling & Tokens" },
            { name: "Gemini 2.5 Flash", category: "LLM Reasoning" },
            { name: "Supabase", category: "PostgreSQL & RLS" },
            { name: "Vapi AI", category: "Voice Telephony" },
            { name: "PyTorch & YOLO", category: "Computer Vision" },
            { name: "Whisper & F5-TTS", category: "Speech Audio" },
            { name: "Resend", category: "Transactional Email" },
          ].map((tech, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-2xl border border-slate-800">
              <div className="text-sm font-bold text-slate-200">{tech.name}</div>
              <div className="text-[10px] text-slate-500 mt-1">{tech.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Calendar Strategy Booking Section */}
      <section id="book-call" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <MeetingScheduler />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="font-bold text-slate-200">Annu Jaswanth</span> • AI Developer & Full Stack Architect
          </div>

          <div className="flex items-center space-x-6">
            <a href="mailto:annujaswanth15@gmail.com" className="hover:text-emerald-400 transition-colors flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5" />
              <span>annujaswanth15@gmail.com</span>
            </a>
            <a href="https://github.com/Jaswanth1503" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/annu-jaswanth-88aa4033b/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              LinkedIn
            </a>
            <a
              href="/admin"
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/40 font-semibold transition-all"
            >
              <Lock className="w-3 h-3" />
              <span>Portal Login</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
