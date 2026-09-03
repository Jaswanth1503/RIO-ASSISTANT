import { supabase, isSupabaseConfigured } from "./supabase";
import { Lead } from "./validations";
import { evaluateLeadScore } from "./leadScorer";
import { sendLeadNotificationEmail } from "./resend";
import { triggerVapiOutboundCall } from "./vapi";

// Fallback in-memory lead repository for offline/demo operation
const mockLeads: Lead[] = [
  {
    id: "demo-lead-1",
    name: "Suresh Reddy",
    email: "suresh.reddy@techventures.io",
    phone: "+91 98480 22334",
    business_name: "Reddy Infrastructure & ReadyMix",
    project_type: "Full Stack Automation & Fleet Dashboard",
    budget: "₹65,000",
    timeline: "3 weeks",
    requirements: "Need an industrial dispatch telemetry dashboard similar to Veera RMC for our mixer trucks and batch plant.",
    lead_score: "HOT",
    summary: "High budget commercial inquiry looking for industrial fleet automation. Decision maker ready to start.",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "demo-lead-2",
    name: "Ananya Sharma",
    email: "ananya@growthpulse.co",
    phone: "+91 99887 76655",
    business_name: "GrowthPulse Marketing",
    project_type: "AI Chatbot & Lead Agent",
    budget: "₹25,000",
    timeline: "Next month",
    requirements: "Looking for an intelligent chatbot like RIO to qualify B2B SaaS leads and book discovery calls.",
    lead_score: "HOT",
    summary: "Marketing agency seeking AI agent integration with booking calendar and email alerts.",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "demo-lead-3",
    name: "Vikram Malhotra",
    email: "vikram.m@gmail.com",
    phone: "+91 91234 56789",
    business_name: "Personal Brand",
    project_type: "Portfolio Website",
    budget: "₹12,000",
    timeline: "Flexible",
    requirements: "Clean personal portfolio with dark mode, blogs, and project showcase.",
    lead_score: "WARM",
    summary: "Standard portfolio site inquiry with moderate budget.",
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

export async function saveLead(rawLead: Partial<Lead>): Promise<Lead> {
  // Score the lead using the qualification engine
  const scoreResult = evaluateLeadScore(rawLead);
  const leadScore = rawLead.lead_score || scoreResult.score;

  const leadToSave: Lead = {
    id: rawLead.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: rawLead.name || "Anonymous Prospect",
    email: rawLead.email || "unknown@example.com",
    phone: rawLead.phone || "",
    business_name: rawLead.business_name || "",
    project_type: rawLead.project_type || "Custom Project",
    budget: rawLead.budget || "Undisclosed",
    timeline: rawLead.timeline || "Flexible",
    requirements: rawLead.requirements || "",
    lead_score: leadScore,
    summary:
      rawLead.summary ||
      `Lead qualified as ${leadScore} (${scoreResult.points} pts). Reasons: ${scoreResult.reasons.join("; ")}`,
    created_at: rawLead.created_at || new Date().toISOString(),
  };

  // 1. Supabase Storage (if configured)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("leads").insert([leadToSave]).select().single();
      if (error) {
        console.error("Supabase insert error, falling back to local store:", error);
        mockLeads.unshift(leadToSave);
      } else if (data) {
        leadToSave.id = data.id;
      }
    } catch (err) {
      console.error("Failed to connect to Supabase, saving to local store:", err);
      mockLeads.unshift(leadToSave);
    }
  } else {
    mockLeads.unshift(leadToSave);
  }

  // 2. Automated Email Alert to Annu (Phase 6)
  try {
    await sendLeadNotificationEmail(leadToSave);
  } catch (emailErr) {
    console.error("Error triggering Resend email:", emailErr);
  }

  // 3. Automated Vapi Call Trigger if HOT lead with phone (Phase 10)
  if (leadToSave.lead_score === "HOT" && leadToSave.phone) {
    try {
      await triggerVapiOutboundCall({
        phoneNumber: leadToSave.phone,
        leadName: leadToSave.name,
        projectType: leadToSave.project_type,
        requirements: leadToSave.requirements,
      });
    } catch (vapiErr) {
      console.error("Error triggering Vapi call:", vapiErr);
    }
  }

  return leadToSave;
}

export async function getAllLeads(): Promise<Lead[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Lead[];
      }
    } catch (err) {
      console.error("Error fetching leads from Supabase, returning mock dataset:", err);
    }
  }
  return mockLeads;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const leads = await getAllLeads();
  return leads.find((l) => l.id === id) || null;
}
