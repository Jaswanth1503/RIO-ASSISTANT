import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/leadStore";
import { sendAdminCallAlertEmail, sendClientCallConfirmationEmail } from "@/lib/resend";
import { scheduleCallLifecycle } from "@/lib/businessStore";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, topic, message, notes, date, time } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required fields." },
        { status: 400 }
      );
    }

    const projectDesc = message || notes || "Contact inquiry submitted via portfolio.";
    const projectTopic = topic || "AI & Full-Stack Systems";
    const meetingDate = date || new Date().toISOString().split("T")[0];
    const meetingTime = time || "Immediate / Scoping Call";

    // 1. Save Lead into database / local store (skip generic lead email, dedicated alert sent below)
    const lead = await saveLead(
      {
        name,
        email,
        phone: phone || "",
        project_type: projectTopic,
        requirements: projectDesc,
        timeline: "Inbound Contact Form Submission",
        lead_score: phone ? "HOT" : "WARM",
      },
      { skipEmailNotification: true }
    );

    // 2. Automate lifecycle creation (client, meeting, timeline events)
    const lifecycle = scheduleCallLifecycle({
      name,
      email,
      phone: phone || "",
      topic: projectTopic,
      date: meetingDate,
      time: meetingTime,
      notes: projectDesc,
    });

    // Try persisting to Supabase if configured
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
          project_type: lifecycle.meeting.project_type,
          meeting_date: lifecycle.meeting.meeting_date,
          meeting_time: lifecycle.meeting.meeting_time,
          meeting_mode: "Inbound Contact / Scoping Call",
          meeting_status: "Scheduled",
          notes: lifecycle.meeting.notes,
        });
      } catch (dbErr) {
        console.warn("Supabase contact lifecycle insert fallback:", dbErr);
      }
    }

    // 3. Trigger dual email notifications
    const [adminResult, clientResult] = await Promise.allSettled([
      sendAdminCallAlertEmail({
        name,
        email,
        phone: phone || "",
        topic: projectTopic,
        date: meetingDate,
        time: meetingTime,
        notes: projectDesc,
      }),
      sendClientCallConfirmationEmail({
        clientName: name,
        clientEmail: email,
        phone: phone || "",
        topic: projectTopic,
        notes: projectDesc,
        date: meetingDate,
        time: meetingTime,
        meetingType: "Direct Strategy Consultation",
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been received. Confirmation email dispatched.",
      emailStatus: {
        adminAlert: adminResult.status === "fulfilled" ? adminResult.value : { success: false },
        clientConfirmation: clientResult.status === "fulfilled" ? clientResult.value : { success: false },
      },
      lead,
    });
  } catch (err: any) {
    console.error("Error processing contact submission:", err);
    return NextResponse.json(
      { error: "Failed to process inquiry. Please try again or contact annujaswanth15@gmail.com directly." },
      { status: 500 }
    );
  }
}
