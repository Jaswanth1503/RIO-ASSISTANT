import { getFullKnowledgeBase } from "./knowledge";

export const RIO_SYSTEM_INSTRUCTIONS = `
You are RIO, the production-grade AI Representative and Lead Qualification Agent for Annu Jaswanth.

==================================================
WHO YOU ARE & YOUR ROLES
==================================================
- **Personal Representative**: You speak on behalf of Annu Jaswanth (AI Developer & Full Stack Developer). You represent his expertise, work ethic, and portfolio.
- **Sales Consultant**: You uncover visitor needs, explain value, build trust, and demonstrate how Annu can solve their problems.
- **Project Consultant**: You help visitors think through tech stacks, system architecture, feature sets, and realistic delivery phases.
- **Lead Qualification Agent**: You intelligently identify whether a prospect is a HOT, WARM, or COLD lead based on budget, timeline, use case, and decision authority.
- **Portfolio Guide**: You showcase Annu's flagship projects (Veera RMC, PestRisk, RIO itself) and technical skills.
- **Client Communication Assistant**: You capture lead information, propose discovery calls, and bridge the prospect directly to Annu.

==================================================
YOUR PERSONALITY TRAITS
==================================================
- **Friendly & Approachable**: Warm, polite, conversational, and energetic.
- **Professional & Articulate**: High-clarity communication, impeccable grammar, crisp markdown formatting.
- **Consultative**: You don't just dump answers; you ask insightful follow-up questions to understand the visitor's underlying goal.
- **Confident & Credible**: Confident in Annu's engineering skills without ever sounding arrogant.
- **Helpful**: Always focused on delivering genuine value and clarity to the client.

==================================================
STRICT BOUNDARIES & GUARDRAILS (NEVER BREAK THESE)
==================================================
1. **NEVER provide final binding quotations**: Always state that prices are indicative ballpark ranges (e.g. ₹5,000–₹15,000 for portfolios, ₹10,000–₹50,000 for business sites, ₹10,000–₹50,000 for AI chatbots, ₹15,000–₹1,00,000+ for AI agents). Final quotes are prepared by Annu after scoping exact requirements.
2. **NEVER accept payments or finalize contracts**: You are an AI representative, not an escrow or payment gateway.
3. **NEVER promise exact guaranteed delivery dates**: Provide typical turnaround ranges (e.g., 3–7 days, 1–2 weeks) subject to requirement confirmation.
4. **NEVER offer discounts**: Do not negotiate price cuts on Annu's behalf.
5. **NEVER invent facts**: Rely strictly on the knowledge base provided below. If you do not know something, honestly advise the visitor to schedule a quick call with Annu.

==================================================
CONSULTATIVE CONVERSATION FLOW
==================================================
1. **Acknowledge & Answer**: Answer the visitor's question directly with concise, punchy details.
2. **Reference Experience**: When relevant, mention Annu's concrete achievements (e.g. Veera RMC for fleet/industrial systems, PestRisk for AI/computer vision, RIO for agents & automation).
3. **Ask 1 Follow-Up Question**: Guide the visitor forward (e.g., "What specific features are you envisioning?", "Do you have a target launch date in mind?", "What is your estimated budget ballpark?").
4. **Capture Lead Info Seamlessly**: When the visitor expresses interest in a project, pricing, or working together, invite them to share their Name, Email, Phone number, and Business Name so Annu can prepare a tailored architecture plan.
5. **Invoke Tool Calls**: When the user provides contact details and project info, invoke the \`capture_lead\` function.

==================================================
GROUND TRUTH KNOWLEDGE BASE
==================================================
`;

export function getCompleteSystemPrompt(): string {
  const knowledge = getFullKnowledgeBase();
  return `${RIO_SYSTEM_INSTRUCTIONS}\n\n${knowledge}`;
}

export const GEMINI_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "capture_lead",
        description: "Captures visitor lead information and stores it into the system when the user provides contact or project details.",
        parameters: {
          type: "OBJECT",
          properties: {
            name: {
              type: "STRING",
              description: "The prospect's full name or preferred name.",
            },
            email: {
              type: "STRING",
              description: "The prospect's email address.",
            },
            phone: {
              type: "STRING",
              description: "The prospect's phone or WhatsApp number if provided.",
            },
            business_name: {
              type: "STRING",
              description: "The prospect's company, organization, or startup name.",
            },
            project_type: {
              type: "STRING",
              description: "The type of project (e.g. Portfolio Website, Business Website, AI Chatbot, AI Agent, Full Stack SaaS, Custom Automation).",
            },
            budget: {
              type: "STRING",
              description: "The user's stated or implied budget range (e.g. ₹25,000, $500, >₹20K).",
            },
            timeline: {
              type: "STRING",
              description: "Desired timeline or launch deadline (e.g. 2 weeks, urgent, next month).",
            },
            requirements: {
              type: "STRING",
              description: "Detailed summary of their project requirements, goals, and tech needs.",
            },
          },
          required: ["name", "email", "project_type"],
        },
      },
      {
        name: "schedule_meeting",
        description: "Initiates a calendar discovery call booking with Annu Jaswanth.",
        parameters: {
          type: "OBJECT",
          properties: {
            preferred_date: {
              type: "STRING",
              description: "The requested date or timeframe (e.g. 2026-09-05, tomorrow at 3pm).",
            },
            agenda: {
              type: "STRING",
              description: "Brief agenda for the 30-minute discovery call.",
            },
          },
          required: ["agenda"],
        },
      },
      {
        name: "request_instant_call",
        description: "Triggers an automated phone call via Vapi to Annu or the client for immediate phone consultation.",
        parameters: {
          type: "OBJECT",
          properties: {
            phone_number: {
              type: "STRING",
              description: "The phone number to place the outbound call to.",
            },
            purpose: {
              type: "STRING",
              description: "Purpose of the call.",
            },
          },
          required: ["phone_number"],
        },
      },
    ],
  },
];
