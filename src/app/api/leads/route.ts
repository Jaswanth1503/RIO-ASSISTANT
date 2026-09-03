import { NextRequest, NextResponse } from "next/server";
import { getAllLeads, saveLead } from "@/lib/leadStore";
import { LeadSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  try {
    const leads = await getAllLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = LeadSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const saved = await saveLead(parseResult.data);
    return NextResponse.json({ success: true, lead: saved });
  } catch (error: any) {
    console.error("Error saving lead:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
