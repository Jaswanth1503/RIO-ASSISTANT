import { supabase, isSupabaseConfigured } from "./supabase";
import { Lead } from "./validations";
import { evaluateLeadScore } from "./leadScorer";
import { sendLeadNotificationEmail } from "./resend";
import { triggerVapiOutboundCall } from "./vapi";

// Fallback in-memory lead repository for offline/demo operation
const defaultMockLeads: Lead[] = [];

const globalForLeads = globalThis as unknown as { __rio_mock_leads?: Lead[] };
if (!globalForLeads.__rio_mock_leads) {
  globalForLeads.__rio_mock_leads = [];
}
const mockLeads: Lead[] = globalForLeads.__rio_mock_leads;

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

      if (!error && data) {
        return data as Lead[];
      }
    } catch (err) {
      console.error("Error fetching leads from Supabase, returning local store:", err);
    }
  }
  return mockLeads;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const leads = await getAllLeads();
  return leads.find((l) => l.id === id) || null;
}
