import { NextRequest, NextResponse } from "next/server";
import { triggerVapiOutboundCall } from "@/lib/vapi";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is a webhook from Vapi or an outbound trigger request
    if (body.message && body.message.type) {
      // Vapi Server Webhook callback (call ended, transcript, etc.)
      console.log(`[VAPI WEBHOOK] Received event: ${body.message.type}`, body.message);
      return NextResponse.json({ success: true, handled: true });
    }

    const { phoneNumber, leadName, projectType, requirements } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const result = await triggerVapiOutboundCall({
      phoneNumber,
      leadName,
      projectType,
      requirements,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/calls/vapi:", error);
    return NextResponse.json({ error: "Failed to process call" }, { status: 500 });
  }
}
