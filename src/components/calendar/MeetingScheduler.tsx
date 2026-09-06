"use client";

import React, { useState } from "react";
import { CheckCircle2, PhoneCall, ArrowRight, Bot, Mail } from "lucide-react";
import confetti from "canvas-confetti";

const TIME_SLOTS = [
  "Immediate / Right Now",
  "10:00 AM IST",
  "11:30 AM IST",
  "02:00 PM IST",
  "04:30 PM IST",
  "06:00 PM IST",
  "08:00 PM IST",
];

export default function MeetingScheduler() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("Immediate / Right Now");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("Autonomous AI Agents");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert("Please provide your name, email, and phone number so RIO can call you.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/calendar/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: selectedDate || new Date().toISOString().split("T")[0],
          time: selectedTime,
          topic,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingSuccess(data);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
        });
      } else {
        alert(data.error || "Failed to initiate AI call. Please reach out to annujaswanth15@gmail.com directly.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong while booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Bot className="w-3.5 h-3.5" />
          <span>Instant Autonomous AI Consultation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Request an AI Phone Consultation with <span className="gradient-text-green">RIO</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          RIO (Annu Jaswanth&apos;s AI Representative) will immediately dial your phone to break down services, pricing ranges (₹20k–₹1.5L+), and technical stack. Both you and Annu receive full email summaries instantly.
        </p>
      </div>

      {bookingSuccess ? (
        <div className="text-center py-8 space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 animate-pulse">
            <PhoneCall className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1"></span>
              <span>Autonomous AI Phone Call Initiated</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">RIO is Calling You Shortly!</h3>
            <p className="text-slate-300 text-sm mt-1 max-w-md mx-auto">
              Our AI Representative is preparing to dial <span className="text-emerald-400 font-semibold">{phone}</span> to discuss your project requirements, pricing models, and Annu&apos;s tech stack.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-lg mx-auto text-left text-xs space-y-2.5 shadow-inner">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
              <span className="text-slate-400">Caller:</span>
              <span className="text-slate-200 font-semibold flex items-center">
                <Bot className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> RIO (Annu Jaswanth&apos;s AI Representative)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Call Mode:</span>
              <span className="text-emerald-400 font-medium">Direct Autonomous Outbound Phone Call</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Recipient Phone:</span>
              <span className="text-slate-200 font-mono font-medium">{phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Scheduled For:</span>
              <span className="text-slate-200 font-medium">{bookingSuccess.meetingDetails?.date || selectedDate || "Today"} ({bookingSuccess.meetingDetails?.time || selectedTime})</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-slate-800">
              <span className="text-slate-400 flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Client Confirmation:</span>
              <span className="text-slate-200 font-medium">{email} (Dispatched)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Annu&apos;s Direct Alert:</span>
              <span className="text-slate-200 font-medium">annujaswanth15@gmail.com (Dispatched)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Dashboard Record:</span>
              <span className="text-emerald-400 font-medium">Synced to Executive Lead Center</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setBookingSuccess(null);
                setName("");
                setEmail("");
                setPhone("");
                setNotes("");
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all shadow-md"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Verma"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@company.com"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Mobile / WhatsApp Number *</span>
                <span className="text-emerald-400 text-[11px] font-normal">RIO dials this number</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210 (with country code)"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Project Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Autonomous AI Agents">Autonomous AI Agents (Gemini / LangChain / Tools)</option>
                <option value="AI Chatbot & Lead Automation">AI Chatbot & Lead Automation</option>
                <option value="Full Stack SaaS Application">Full Stack SaaS Application (Next.js 15 / Supabase)</option>
                <option value="High-Converting Business Website">High-Converting Business Website</option>
                <option value="Veera-style Telemetry Dashboard">Veera-style Telemetry Dashboard (28% delay reduction)</option>
                <option value="PestRisk-style Computer Vision Model">PestRisk-style Computer Vision Model (94%+ accuracy)</option>
                <option value="Portfolio / Custom Engineering">Portfolio / Custom Engineering</option>
              </select>
            </div>
          </div>

          {/* Date & Time selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Preferred Call Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Call Window / Time Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`text-[11px] font-medium py-2 px-1 rounded-lg border transition-all text-center truncate ${
                      selectedTime === slot
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow"
                        : "bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-500"
                    }`}
                    title={slot}
                  >
                    {slot.replace(" IST", "")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Overview / Target Timeline / Specific Questions
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell RIO briefly what you're planning to build, target deadline, or any technical questions..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Placing AI Call & Dispatching Emails...</span>
            ) : (
              <>
                <PhoneCall className="w-4 h-4" />
                <span>Request Instant AI Phone Call from RIO →</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
