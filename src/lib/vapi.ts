interface VapiCallParams {
  phoneNumber: string;
  leadName?: string;
  projectType?: string;
  requirements?: string;
}

export async function triggerVapiOutboundCall(params: VapiCallParams): Promise<{ success: boolean; callId?: string }> {
  const vapiApiKey = process.env.VAPI_API_KEY || "";
  const vapiAssistantId = process.env.VAPI_ASSISTANT_ID || "";
  const vapiPhoneNumberId = process.env.VAPI_PHONE_NUMBER_ID || "";

  if (!vapiApiKey || vapiApiKey.includes("your-vapi") || !vapiAssistantId) {
    console.log(`\n======================================================`);
    console.log(`[VAPI SIMULATION] Automated Outbound Call Triggered`);
    console.log(`Target Phone: ${params.phoneNumber}`);
    console.log(`Lead Name: ${params.leadName || "Prospect"}`);
    console.log(`Project: ${params.projectType}`);
    console.log(`Purpose: Requirement Gathering & Strategy Scheduling`);
    console.log(`======================================================\n`);
    return { success: true, callId: `sim-vapi-${Date.now()}` };
  }

  try {
    const response = await fetch("https://api.vapi.ai/call/phone", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vapiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId: vapiAssistantId,
        phoneNumberId: vapiPhoneNumberId || undefined,
        customer: {
          number: params.phoneNumber,
          name: params.leadName || "Client",
        },
        assistantOverrides: {
          variableValues: {
            leadName: params.leadName || "Friend",
            projectType: params.projectType || "software project",
            requirements: params.requirements || "discussing your requirements",
          },
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Vapi call error:", data);
      return { success: false };
    }

    return { success: true, callId: data.id };
  } catch (err) {
    console.error("Failed to initiate Vapi outbound call:", err);
    return { success: false };
  }
}
