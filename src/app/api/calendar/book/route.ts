import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/leadStore";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, date, time, notes, topic } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Generate Google Calendar direct add URL
    const startIso = date ? `${date}T${time || "10:00"}:00` : new Date(Date.now() + 86400000).toISOString();
    const startDate = new Date(startIso);
    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 mins

    const formatGCalTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Discovery Strategy Call: Annu Jaswanth x ${name}`
    )}&dates=${formatGCalTime(startDate)}/${formatGCalTime(endDate)}&details=${encodeURIComponent(
      `Strategy and Architecture Discovery Session with Annu Jaswanth (AI & Full Stack Developer).\n\nTopic: ${
        topic || "AI/Web Application Development"
      }\nClient Notes: ${notes || "Discussing project requirements."}\n\nGoogle Meet link will be provided.`
    )}&add=annujaswanth15@gmail.com,${encodeURIComponent(email)}`;

    // Save/update the lead
    await saveLead({
      name,
      email,
      project_type: topic || "Consultation Call",
      requirements: `Scheduled Meeting for: ${date || "Upcoming"} at ${time || "Morning"}. Notes: ${notes || ""}`,
      timeline: "Meeting Booked",
      lead_score: "HOT",
    });

    return NextResponse.json({
      success: true,
      googleCalendarUrl: gcalUrl,
      meetingDetails: {
        host: "Annu Jaswanth",
        attendee: name,
        email,
        date: date || "Selected slot",
        time: time || "10:00 AM IST",
        duration: "30 Minutes",
      },
    });
  } catch (error: any) {
    console.error("Error booking meeting:", error);
    return NextResponse.json({ error: "Failed to schedule meeting" }, { status: 500 });
  }
}
