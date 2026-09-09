import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/leadStore";
import { scheduleCallLifecycle } from "@/lib/businessStore";
import { sendAdminCallAlertEmail, sendClientCallConfirmationEmail } from "@/lib/resend";
import { triggerVapiOutboundCall } from "@/lib/vapi";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, date, time, notes, topic } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required so RIO can call you." },
        { status: 400 }
      );
    }

    // Safely parse date for calendar reference
    let startDate = new Date(Date.now() + 86400000);
    try {
      if (date) {
        const cleanTime = (time || "10:00").replace(/[^0-9:]/g, "") || "10:00";
        const candidate = new Date(`${date}T${cleanTime.length === 5 ? cleanTime : "10:00"}:00`);
        if (!isNaN(candidate.getTime())) {
          startDate = candidate;
        }
      }
    } catch {
      startDate = new Date(Date.now() + 86400000);
    }
    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 mins

    const formatGCalTime = (d: Date) => {
      try {
        return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      } catch {
        return new Date().toISOString().replace(/-|:|\.\d\d\d/g, "");
      }
    };

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `AI Consultation Call: RIO (for Annu Jaswanth) x ${name}`
    )}&dates=${formatGCalTime(startDate)}/${formatGCalTime(endDate)}&details=${encodeURIComponent(
      `Direct telephone consultation conducted by RIO, the autonomous AI representative for Annu Jaswanth.\n\nTopic: ${
        topic || "AI/Web Application Development"
      }\nClient Phone: ${phone || "Provided by client"}\nNotes: ${
        notes || "Discussing services, pricing ranges, and tech stack."
      }\n\nRIO will dial the client phone directly.`
    )}&add=annujaswanth15@gmail.com,${encodeURIComponent(email)}`;

    // 1. Save Lead Record in Dashboard (skip generic lead email, dedicated alert sent below)
    const lead = await saveLead(
      {
        name,
        email,
        phone,
        business_name: company,
        project_type: topic || "Consultation Call",
        requirements: `Scheduled Direct AI Call for: ${date || "Upcoming"} at ${time || "Morning"}. Phone: ${phone || "None"}. Notes: ${notes || ""}`,
        timeline: "AI Consultation Call Dispatched",
        lead_score: "HOT",
      },
      { skipEmailNotification: true }
    );

    // 2. Automate Lifecycle: Generate Meeting Record, Client Record, and Timeline Events
    const lifecycle = scheduleCallLifecycle({
      name,
      email,
      phone,
      company,
      topic,
      date,
      time,
      notes: notes || "Client requested direct telephone consultation with RIO AI Representative.",
    });

    // Set meeting mode to Direct AI Phone Call
    lifecycle.meeting.meeting_mode = "Autonomous AI Phone Call (RIO)";

    // Try persisting to Supabase if tables exist
    if (supabase) {
      try {
        await supabase.from("clients").upsert({
          id: lifecycle.client.id,
          client_name: lifecycle.client.client_name,
          company: lifecycle.client.company,
          email: lifecycle.client.email,
          phone: lifecycle.client.phone,
          status: "Lead",
          notes: lifecycle.client.notes,
        });

        await supabase.from("meetings").insert({
          id: lifecycle.meeting.id,
          meeting_id: lifecycle.meeting.meeting_id,
          client_id: lifecycle.client.id,
          lead_id: lead.id,
          client_name: lifecycle.meeting.client_name,
          email: lifecycle.meeting.email,
          phone: lifecycle.meeting.phone,
          company: lifecycle.meeting.company,
          project_type: lifecycle.meeting.project_type,
          meeting_date: lifecycle.meeting.meeting_date,
          meeting_time: lifecycle.meeting.meeting_time,
          meeting_mode: "Autonomous AI Phone Call (RIO)",
          meeting_status: "Scheduled",
          notes: lifecycle.meeting.notes,
        });

        await supabase.from("timeline_events").insert(
          lifecycle.timelineEvents.map((te) => ({
            id: te.id,
            client_id: te.client_id,
            event_type: te.event_type,
            event_title: te.event_title,
            description: te.description,
          }))
        );
      } catch (dbErr) {
        console.warn("Supabase lifecycle insertion skipped (operating in fallback mode):", dbErr);
      }
    }

    // 3. Dispatch Emails to BOTH Annu Jaswanth and the Client concurrently
    const [adminResult, clientResult] = await Promise.allSettled([
      sendAdminCallAlertEmail({
        name,
        email,
        phone,
        company,
        topic,
        date,
        time,
        notes,
      }),
      sendClientCallConfirmationEmail({
        clientName: name,
        clientEmail: email,
        phone,
        topic,
        notes,
        date,
        time,
      }),
    ]);

    const adminEmailSuccess = adminResult.status === "fulfilled" && adminResult.value.success;
    const clientEmailSuccess = clientResult.status === "fulfilled" && clientResult.value.success;

    console.log(
      `[Calendar Booking] Email dispatch result - Admin Alert: ${adminEmailSuccess ? "Sent" : "Failed"}, Client Confirmation: ${clientEmailSuccess ? "Sent" : "Failed"}`
    );

    // 4. Trigger Autonomous AI Phone Call via RIO (Vapi) if phone number provided
    let callDispatched = false;
    let callId: string | undefined;
    if (phone) {
      const callResult = await triggerVapiOutboundCall({
        phoneNumber: phone,
        leadName: name,
        projectType: topic || "AI and Full-Stack Systems",
        requirements: notes || "Discussing services, pricing ranges, and Annu Jaswanth's tech stack.",
      });
      callDispatched = callResult.success;
      callId = callResult.callId;
    }

    return NextResponse.json({
      success: true,
      googleCalendarUrl: gcalUrl,
      callDispatched,
      callId,
      emailStatus: {
        adminAlert: adminResult.status === "fulfilled" ? adminResult.value : { success: false, error: "Rejected" },
        clientConfirmation: clientResult.status === "fulfilled" ? clientResult.value : { success: false, error: "Rejected" },
      },
      meetingDetails: {
        host: "RIO (AI Representative for Annu Jaswanth)",
        attendee: name,
        email,
        phone: phone || "Not specified",
        date: date || "Selected slot",
        time: time || "10:00 AM IST",
        method: "Autonomous AI Phone Call",
      },
      lifecycle,
    });
  } catch (error: any) {
    console.error("Error scheduling AI call:", error);
    return NextResponse.json({ error: "Failed to schedule call" }, { status: 500 });
  }
}
