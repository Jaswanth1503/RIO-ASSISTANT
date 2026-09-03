"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Minus,
  Maximize2,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Calendar,
  CheckCircle2,
  PhoneCall,
  Flame,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  leadCaptured?: any;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  "What services do you offer?",
  "Tell me about Veera RMC",
  "What is your pricing?",
  "Can you build an AI chatbot?",
  "How long will a business website take?",
];

export default function RioWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "👋 Hello! I'm **RIO**, the personal AI representative for **Annu Jaswanth**.\n\nI can explain Annu's services, showcase his flagship projects (like **Veera RMC** and **PestRisk**), discuss pricing ranges, or help you schedule a strategy call.\n\nWhat kind of project are you looking to build?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeechSynthesisEnabled, setIsSpeechSynthesisEnabled] = useState(true);
  const [hasUnread, setHasUnread] = useState(true);
  const [leadCapturedNotice, setLeadCapturedNotice] = useState<any | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen, isMinimized]);

  // Speech Recognition (Web Speech API with graceful fallback)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
            handleSendMessage(transcript);
          }
          setIsVoiceActive(false);
        };

        recognition.onerror = () => {
          setIsVoiceActive(false);
        };

        recognition.onend = () => {
          setIsVoiceActive(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isVoiceActive) {
      recognitionRef.current.stop();
      setIsVoiceActive(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsVoiceActive(true);
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!isSpeechSynthesisEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    // Clean markdown formatting for spoken speech
    const cleanText = text
      .replace(/[*#_`>]/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .substring(0, 250);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setInput("");
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, initialAssistantMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive stream from RIO");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body reader available");

      const decoder = new TextDecoder();
      let fullAssistantText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.type === "text") {
              fullAssistantText += data.content;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId ? { ...msg, content: fullAssistantText } : msg
                )
              );
            } else if (data.type === "lead_captured") {
              setLeadCapturedNotice(data.lead);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId ? { ...msg, leadCaptured: data.lead } : msg
                )
              );
            }
          } catch (jsonErr) {
            console.warn("Parse line warning:", jsonErr);
          }
        }
      }

      // Voice response
      if (fullAssistantText) {
        speakText(fullAssistantText);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  "I apologize, I experienced a brief connectivity hiccup. However, you can reach Annu directly at [annujaswanth15@gmail.com](mailto:annujaswanth15@gmail.com)!",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Lead Captured Toast Notification */}
      {leadCapturedNotice && (
        <div className="mb-3 w-80 rounded-xl bg-gradient-to-r from-emerald-900/90 to-slate-900 border border-emerald-500/50 p-3 shadow-2xl backdrop-blur-md animate-fade-in flex items-start space-x-3">
          <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-300">
              <span>Lead Captured & Sent</span>
              {leadCapturedNotice.lead_score === "HOT" && (
                <span className="flex items-center text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/30">
                  <Flame className="w-3 h-3 mr-0.5" /> HOT
                </span>
              )}
            </div>
            <p className="text-slate-300 mt-0.5">
              Annu was notified at <span className="text-emerald-400">annujaswanth15@gmail.com</span>
            </p>
          </div>
          <button
            onClick={() => setLeadCapturedNotice(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center space-x-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-3.5 sm:px-5 sm:py-3.5 text-slate-950 font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/30 focus:outline-none"
          aria-label="Open RIO AI Assistant"
        >
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-emerald-400 shadow-inner">
              <Bot className="h-5 w-5 animate-pulse" />
            </div>
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-extrabold tracking-wide text-slate-950">Chat with RIO</span>
              <span className="inline-block h-2 w-2 rounded-full bg-slate-950"></span>
            </div>
            <p className="text-[11px] font-medium text-slate-900/80">AI Representative for Annu</p>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "flex flex-col rounded-2xl glass-panel-glow border border-emerald-500/30 shadow-2xl transition-all duration-300 overflow-hidden",
            isMinimized
              ? "h-16 w-80"
              : "h-[620px] max-h-[88vh] w-[92vw] sm:w-[420px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900/95 px-4 py-3.5 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-sm text-slate-100">RIO</h3>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    AI Representative
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Representing Annu Jaswanth</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-1.5">
              {/* Voice toggle */}
              <button
                onClick={() => setIsSpeechSynthesisEnabled(!isSpeechSynthesisEnabled)}
                title={isSpeechSynthesisEnabled ? "Mute RIO Voice" : "Enable RIO Voice"}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isSpeechSynthesisEnabled
                    ? "text-emerald-400 hover:bg-emerald-500/10"
                    : "text-slate-500 hover:bg-slate-800"
                )}
              >
                {isSpeechSynthesisEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Minimize */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col space-y-1 max-w-[85%]",
                      msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className="flex items-center space-x-1 text-[10px] text-slate-500 px-1">
                      {msg.role === "assistant" ? (
                        <>
                          <Bot className="w-3 h-3 text-emerald-400" />
                          <span>RIO • {msg.timestamp}</span>
                        </>
                      ) : (
                        <>
                          <span>You • {msg.timestamp}</span>
                          <User className="w-3 h-3 text-slate-400" />
                        </>
                      )}
                    </div>

                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm",
                        msg.role === "user"
                          ? "bg-emerald-600 text-slate-950 font-medium rounded-tr-xs"
                          : "bg-slate-900/90 text-slate-200 border border-slate-800/80 rounded-tl-xs"
                      )}
                    >
                      <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                        {msg.content}
                      </div>

                      {/* Lead Captured Card */}
                      {msg.leadCaptured && (
                        <div className="mt-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 p-2.5 text-xs">
                          <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                            <span className="flex items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Lead Qualified: {msg.leadCaptured.lead_score}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px]">
                            Annu received your details and will prepare a tailored scope.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-slate-400 bg-slate-900/80 px-3 py-2 rounded-xl w-24 border border-slate-800 text-xs">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions Pills */}
              <div className="px-3 py-2 bg-slate-900/40 border-t border-slate-800/60 overflow-x-auto flex space-x-1.5 scrollbar-none">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    disabled={isLoading}
                    className="shrink-0 text-[11px] rounded-full bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 px-3 py-1 border border-slate-700/60 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800">
                <div className="flex items-center space-x-2 bg-slate-950/90 border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-emerald-500/60 transition-colors">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isVoiceActive ? "Listening to your voice..." : "Ask RIO about projects, pricing..."
                    }
                    className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                    disabled={isLoading}
                  />

                  {/* Mic Button */}
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      isVoiceActive
                        ? "bg-red-500 text-white animate-pulse"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    )}
                    title={isVoiceActive ? "Stop listening" : "Speak to RIO"}
                  >
                    {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      "p-1.5 rounded-lg font-bold transition-all",
                      input.trim() && !isLoading
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        : "text-slate-600 cursor-not-allowed"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500">
                  <span>Powered by Gemini 2.5 Flash</span>
                  <a
                    href="#book-call"
                    onClick={() => setIsMinimized(true)}
                    className="text-emerald-400 hover:underline flex items-center"
                  >
                    <Calendar className="w-3 h-3 mr-1" /> Book 30-min Call
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
