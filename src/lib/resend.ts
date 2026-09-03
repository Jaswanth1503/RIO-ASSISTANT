import { Resend } from "resend";
import { Lead } from "./validations";

const resendApiKey = process.env.RESEND_API_KEY || "";
const resend = resendApiKey && !resendApiKey.includes("your-resend") ? new Resend(resendApiKey) : null;

export async function sendLeadNotificationEmail(lead: Lead): Promise<{ success: boolean; messageId?: string }> {
  const recipient = process.env.NOTIFICATION_EMAIL || "annujaswanth15@gmail.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "RIO Representative <onboarding@resend.dev>";

  const badgeColor =
    lead.lead_score === "HOT"
      ? "#ef4444"
      : lead.lead_score === "WARM"
      ? "#f59e0b"
      : "#6b7280";

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 24px; }
          .card { background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .header { border-bottom: 1px solid #1f2937; padding-bottom: 20px; margin-bottom: 24px; }
          .title { font-size: 24px; font-weight: 700; color: #22c55e; margin: 0 0 6px 0; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; color: #ffffff; background-color: ${badgeColor}; }
          .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #1f2937; }
          .label { color: #9ca3af; font-size: 14px; font-weight: 500; }
          .value { color: #f9fafb; font-size: 14px; font-weight: 600; text-align: right; }
          .section-title { font-size: 16px; font-weight: 600; color: #e5e7eb; margin: 24px 0 8px 0; }
          .box { background-color: #1f2937; border-radius: 8px; padding: 16px; font-size: 14px; color: #d1d5db; line-height: 1.6; }
          .btn { display: inline-block; background-color: #22c55e; color: #000000; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">⚡ NEW LEAD - RIO</h1>
            <p style="margin: 0; color: #9ca3af; font-size: 14px;">A new prospect has been qualified by RIO</p>
            <div style="margin-top: 12px;">
              <span class="badge">${lead.lead_score} LEAD</span>
            </div>
          </div>

          <div class="row">
            <span class="label">Name:</span>
            <span class="value">${lead.name}</span>
          </div>
          <div class="row">
            <span class="label">Email:</span>
            <span class="value"><a href="mailto:${lead.email}" style="color: #4ade80;">${lead.email}</a></span>
          </div>
          <div class="row">
            <span class="label">Phone:</span>
            <span class="value">${lead.phone || "Not provided"}</span>
          </div>
          <div class="row">
            <span class="label">Company:</span>
            <span class="value">${lead.business_name || "Individual / Startup"}</span>
          </div>
          <div class="row">
            <span class="label">Project Type:</span>
            <span class="value">${lead.project_type}</span>
          </div>
          <div class="row">
            <span class="label">Stated Budget:</span>
            <span class="value" style="color: #22c55e; font-weight: 700;">${lead.budget}</span>
          </div>
          <div class="row">
            <span class="label">Desired Timeline:</span>
            <span class="value">${lead.timeline}</span>
          </div>

          <div class="section-title">Requirements & Scope</div>
          <div class="box">${lead.requirements || "No detailed requirements specified."}</div>

          <div class="section-title">RIO Qualification Summary</div>
          <div class="box" style="border-left: 3px solid ${badgeColor};">${lead.summary || "Qualified via RIO consultative dialogue."}</div>

          <div style="text-align: center;">
            <a href="mailto:${lead.email}?subject=Follow-up%20on%20your%20project%20inquiry%20-%20Annu%20Jaswanth" class="btn">
              Reply to ${lead.name}
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    console.log(`\n======================================================`);
    console.log(`[RESEND SIMULATION] New Lead Alert for ${recipient}`);
    console.log(`Subject: NEW LEAD - RIO (${lead.lead_score})`);
    console.log(`Name: ${lead.name} | Phone: ${lead.phone} | Budget: ${lead.budget}`);
    console.log(`Requirements: ${lead.requirements}`);
    console.log(`======================================================\n`);
    return { success: true, messageId: "simulated-email-id" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipient,
      subject: `NEW LEAD - RIO [${lead.lead_score}] - ${lead.name}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error:", error);
      return { success: false };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error("Failed to send Resend email:", err);
    return { success: false };
  }
}
