"use client";

import React, { useState } from "react";
import { Calendar, Clock, CheckCircle2, Video, ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

const TIME_SLOTS = [
  "10:00 AM IST",
  "11:30 AM IST",
  "02:00 PM IST",
  "04:30 PM IST",
  "06:00 PM IST",
  "08:00 PM IST",
];

export default function MeetingScheduler() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("11:30 AM IST");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("AI Agent / Web Application Architecture");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/calendar/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: selectedDate || new Date(Date.now() + 86400000).toISOString().split("T")[0],
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
        alert("Failed to schedule meeting. Please reach out to annujaswanth15@gmail.com directly.");
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
          <Sparkles className="w-3.5 h-3.5" />
          <span>Direct Strategy Session</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Schedule a 30-Minute Discovery Call with <span className="gradient-text-green">Annu</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Discuss your project scope, review architectural viability, and receive an estimated timeline and investment range.
        </p>
      </div>

      {bookingSuccess ? (
        <div className="text-center py-8 space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-100">Discovery Call Requested!</h3>
            <p className="text-slate-300 text-sm mt-1 max-w-md mx-auto">
              Annu has received your request for <span className="text-emerald-400 font-semibold">{bookingSuccess.meetingDetails.date}</span> at <span className="text-emerald-400 font-semibold">{bookingSuccess.meetingDetails.time}</span>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Host:</span>
              <span className="text-slate-200 font-medium">Annu Jaswanth (AI Developer)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Platform:</span>
              <span className="text-slate-200 font-medium flex items-center">
                <Video className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Google Meet
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Confirmation Sent To:</span>
              <span className="text-slate-200 font-medium">{email}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={bookingSuccess.googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Add to Google Calendar</span>
            </a>
            <button
              onClick={() => setBookingSuccess(null)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
            >
              Book Another Time
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone / WhatsApp (Optional for instant callback)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
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
                <option value="Autonomous AI Agents">Autonomous AI Agents</option>
                <option value="AI Chatbot & Lead Automation">AI Chatbot & Lead Automation</option>
                <option value="Full Stack SaaS Application">Full Stack SaaS Application</option>
                <option value="High-Converting Business Website">High-Converting Business Website</option>
                <option value="Veera-style Telemetry Dashboard">Veera-style Telemetry Dashboard</option>
                <option value="PestRisk-style Computer Vision Model">PestRisk-style Computer Vision Model</option>
                <option value="Portfolio Website">Portfolio Website</option>
              </select>
            </div>
          </div>

          {/* Date & Time selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Preferred Date
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
                Select Time Slot (IST)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`text-[11px] font-medium py-2 px-1 rounded-lg border transition-all text-center ${
                      selectedTime === slot
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold"
                        : "bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {slot.replace(" IST", "")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Overview / Target Launch Date
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell Annu briefly what features you're planning, your target deadline, or any specific questions..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span>Confirming Strategy Session...</span>
            ) : (
              <>
                <span>Confirm 30-Min Discovery Call</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
