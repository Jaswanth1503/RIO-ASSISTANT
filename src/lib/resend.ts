import { Resend } from "resend";
import nodemailer from "nodemailer";
import { Lead } from "./validations";

interface SendMailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

function getEmailEnv() {
  const recipientEmail = process.env.NOTIFICATION_EMAIL || "annujaswanth15@gmail.com";
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  const resendFromEmail = process.env.RESEND_FROM_EMAIL || "RIO Representative <onboarding@resend.dev>";

  const smtpHost = (process.env.SMTP_HOST || "").trim();
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = (process.env.SMTP_USER || "").trim();
  const smtpPass = (process.env.SMTP_PASS || "").trim();
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
  const smtpFrom = process.env.SMTP_FROM || `RIO Representative <${smtpUser || "annujaswanth15@gmail.com"}>`;

  const isResendConfigured = Boolean(resendApiKey && resendApiKey.startsWith("re_"));
  const isSmtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);
  const resend = isResendConfigured ? new Resend(resendApiKey) : null;

  return {
    recipientEmail,
    resendApiKey,
    resendFromEmail,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpSecure,
    smtpFrom,
    isResendConfigured,
    isSmtpConfigured,
    resend,
  };
}

/**
 * Core email sender with dual-transport (SMTP + Resend), retries, and comprehensive error logging.
 */
export async function dispatchEmailWithRetry(
  payload: SendMailPayload,
  maxRetries = 2
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const env = getEmailEnv();
  let lastError = "";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Strategy 1: Attempt SMTP if configured
    if (env.isSmtpConfigured) {
      try {
        const transporter = nodemailer.createTransport({
          host: env.smtpHost,
          port: env.smtpPort,
          secure: env.smtpSecure,
          auth: {
            user: env.smtpUser,
            pass: env.smtpPass,
          },
        });

        const info = await transporter.sendMail({
          from: payload.from || env.smtpFrom,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        });

        console.log(
          `[Email Dispatcher - SMTP Success] Email delivered to ${payload.to} (MessageID: ${info.messageId})`
        );
        return { success: true, messageId: info.messageId };
      } catch (smtpErr: any) {
        lastError = `SMTP error (attempt ${attempt}): ${smtpErr?.message || smtpErr}`;
        console.error(`[Email Dispatcher - SMTP Failed]`, smtpErr);
      }
    }

    // Strategy 2: Attempt Resend if configured
    if (env.resend) {
      try {
        const { data, error } = await env.resend.emails.send({
          from: payload.from || env.resendFromEmail,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        });

        if (error) {
          lastError = `Resend error (attempt ${attempt}): ${error.message || JSON.stringify(error)}`;
          console.error(`[Email Dispatcher - Resend Error] To: ${payload.to} | Error:`, error);
          // If Resend test domain restriction (cannot send to unverified third-party addresses on free tier)
          if (error.message && error.message.includes("testing emails to your own email address")) {
            console.warn(
              `[Resend Notice] Resend test domain (onboarding@resend.dev) can only deliver to the account owner (${env.recipientEmail}). To send to client emails (${payload.to}), verify your custom domain on resend.com/domains.`
            );
            return {
              success: false,
              error: `Resend test domain restricted to account owner (${env.recipientEmail}). Verify your custom domain to email clients directly.`,
            };
          }
        } else if (data?.id) {
          console.log(
            `[Email Dispatcher - Resend Success] Live email dispatched to ${payload.to} (ID: ${data.id})`
          );
          return { success: true, messageId: data.id };
        }
      } catch (resendErr: any) {
        lastError = `Resend exception (attempt ${attempt}): ${resendErr?.message || resendErr}`;
        console.error(`[Email Dispatcher - Resend Exception]`, resendErr);
      }
    }

    // Wait before next retry attempt
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  // If neither provider is configured in environment
  if (!env.isResendConfigured && !env.isSmtpConfigured) {
    const errorMsg =
      "Neither RESEND_API_KEY nor SMTP_HOST/SMTP_USER/SMTP_PASS is configured in .env.local.";
    console.warn(`\n[EMAIL AUDIT WARNING] ${errorMsg}`);
    console.warn(`[EMAIL AUDIT ACTION REQUIRED]`);
    console.warn(`  To enable live emails, add either:`);
    console.warn(`    1. RESEND_API_KEY=re_your_api_key`);
    console.warn(`    2. SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER=..., SMTP_PASS=...\n`);

    // Log payload in console so nothing is lost during testing
    console.log(`[DISPATCH SIMULATION - PENDING CREDENTIALS]`);
    console.log(`To: ${payload.to} | Subject: ${payload.subject}`);
    console.log(`====================================================\n`);

    return {
      success: true, // Marked true to not block client UI during setup, but warning emitted
      messageId: "sim-credentials-pending",
      error: errorMsg,
    };
  }

  return { success: false, error: lastError || "Failed to dispatch email after retry attempts" };
}

/**
 * Sends real-time notification to Annu Jaswanth for standard lead capture
 * Subject: NEW LEAD - RIO
 */
export async function sendLeadNotificationEmail(
  lead: Lead
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const submissionTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 24px; }
          .card { background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .header { border-bottom: 1px solid #1f2937; padding-bottom: 20px; margin-bottom: 24px; }
          .title { font-size: 22px; font-weight: 800; color: #22c55e; margin: 0 0 6px 0; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1f2937; font-size: 13px; }
          .label { color: #9ca3af; }
          .value { color: #f9fafb; font-weight: 600; text-align: right; }
          .box { background-color: #1f2937; border-radius: 8px; padding: 14px; font-size: 13px; color: #d1d5db; line-height: 1.5; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">⚡ NEW LEAD - RIO</h1>
            <p style="margin: 0; color: #9ca3af; font-size: 13px;">New client inquiry captured via portfolio</p>
          </div>

          <div class="row"><span class="label">Client Name:</span><span class="value">${lead.name}</span></div>
          <div class="row"><span class="label">Email:</span><span class="value"><a href="mailto:${lead.email}" style="color: #4ade80;">${lead.email}</a></span></div>
          <div class="row"><span class="label">Phone:</span><span class="value" style="color: #22c55e; font-size: 14px;">${lead.phone || "Not provided"}</span></div>
          <div class="row"><span class="label">Project Topic:</span><span class="value">${lead.project_type}</span></div>
          <div class="row"><span class="label">Meeting Time:</span><span class="value">Pending Scoping Call</span></div>
          <div class="row"><span class="label">Submission Time:</span><span class="value">${submissionTime}</span></div>

          <div style="font-size: 13px; font-weight: 700; color: #e5e7eb; margin-top: 16px;">Project Description:</div>
          <div class="box">${lead.requirements || lead.summary || "No specific requirements provided."}</div>
        </div>
      </body>
    </html>
  `;

  const emailText = `
NEW LEAD - RIO
------------------------------------------
Client Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || "Not provided"}
Project Topic: ${lead.project_type}
Meeting Time: Pending Scoping Call
Project Description: ${lead.requirements || lead.summary || "None"}
Submission Time: ${submissionTime}
  `.trim();

  return dispatchEmailWithRetry({
    to: process.env.NOTIFICATION_EMAIL || "annujaswanth15@gmail.com",
    subject: "NEW LEAD - RIO",
    html: emailHtml,
    text: emailText,
  });
}

/**
 * Sends urgent alert to Annu Jaswanth when a client submits the call scheduling / contact form
 * Subject: NEW LEAD - RIO
 * Contents: Client Name, Email, Phone, Project Topic, Meeting Time, Project Description, Submission Time
 */
export async function sendAdminCallAlertEmail(params: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  topic?: string;
  date?: string;
  time?: string;
  notes?: string;
  description?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const submissionTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
  const meetingTimeFormatted = `${params.date || "Today"} at ${params.time || "Immediate / Scheduled Slot"}`;
  const projectDesc = params.notes || params.description || "Client requested consultation call regarding services and pricing.";

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 24px; }
          .card { background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .header { border-bottom: 1px solid #1f2937; padding-bottom: 16px; margin-bottom: 20px; }
          .title { font-size: 22px; font-weight: 800; color: #22c55e; margin: 0 0 6px 0; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1f2937; font-size: 13px; }
          .label { color: #9ca3af; }
          .val { color: #f9fafb; font-weight: 600; text-align: right; }
          .box { background-color: #1f2937; border-radius: 8px; padding: 14px; font-size: 13px; color: #d1d5db; line-height: 1.5; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">⚡ NEW LEAD - RIO</h1>
            <p style="margin: 0; color: #9ca3af; font-size: 13px;">Inbound consultation request submitted</p>
          </div>

          <div class="row"><span class="label">Client Name:</span><span class="val">${params.name}</span></div>
          <div class="row"><span class="label">Email:</span><span class="val"><a href="mailto:${params.email}" style="color: #4ade80;">${params.email}</a></span></div>
          <div class="row"><span class="label">Phone:</span><span class="val" style="color: #22c55e; font-size: 15px;">${params.phone || "Not provided"}</span></div>
          <div class="row"><span class="label">Project Topic:</span><span class="val">${params.topic || "AI / Full-Stack Project"}</span></div>
          <div class="row"><span class="label">Meeting Time:</span><span class="val">${meetingTimeFormatted}</span></div>
          <div class="row"><span class="label">Submission Time:</span><span class="val">${submissionTime}</span></div>

          <div style="font-size: 13px; font-weight: 700; color: #e5e7eb; margin-top: 16px;">Project Description:</div>
          <div class="box">${projectDesc}</div>

          <p style="font-size: 11px; color: #6b7280; margin-top: 20px; text-align: center;">
            This lead has been synchronized to your RIO Executive Lead Center.
          </p>
        </div>
      </body>
    </html>
  `;

  const emailText = `
NEW LEAD - RIO
------------------------------------------
Client Name: ${params.name}
Email: ${params.email}
Phone: ${params.phone || "Not provided"}
Project Topic: ${params.topic || "AI / Full-Stack Project"}
Meeting Time: ${meetingTimeFormatted}
Project Description: ${projectDesc}
Submission Time: ${submissionTime}
  `.trim();

  return dispatchEmailWithRetry({
    to: process.env.NOTIFICATION_EMAIL || "annujaswanth15@gmail.com",
    subject: "NEW LEAD - RIO",
    html: emailHtml,
    text: emailText,
  });
}

/**
 * Sends booking confirmation email directly to the client
 * Subject: Booking Confirmation
 * Contents: Name, Meeting Date, Meeting Time, Meeting Type, Project Topic, Confirmation Message
 */
export async function sendClientCallConfirmationEmail(params: {
  clientName: string;
  clientEmail: string;
  phone?: string;
  topic?: string;
  notes?: string;
  date?: string;
  time?: string;
  meetingType?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const meetingType = params.meetingType || "Autonomous AI Phone Consultation (RIO)";
  const meetingDate = params.date || "Today";
  const meetingTime = params.time || "Immediate / Scheduled Slot";

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 24px; }
          .card { background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; max-width: 620px; margin: 0 auto; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .title { font-size: 24px; font-weight: 800; color: #22c55e; margin: 0 0 6px 0; }
          .subtitle { color: #9ca3af; font-size: 14px; margin: 0 0 20px 0; }
          .box { background-color: #1f2937; border-radius: 10px; padding: 16px; margin: 16px 0; border-left: 3px solid #22c55e; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px solid #1f2937; }
          .label { color: #9ca3af; }
          .val { color: #f3f4f6; font-weight: 600; text-align: right; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
          .item { background-color: #0d121f; padding: 12px; border-radius: 8px; border: 1px solid #1f2937; font-size: 12px; }
          .item-title { font-weight: 700; color: #22c55e; margin-bottom: 4px; }
          .footer { text-align: center; color: #6b7280; font-size: 11px; margin-top: 24px; border-top: 1px solid #1f2937; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1 class="title">Booking Confirmation</h1>
          <p class="subtitle">Annu Jaswanth • Represented by RIO AI Representative</p>

          <p style="font-size: 14px; line-height: 1.6; color: #e5e7eb;">
            Hello <strong>${params.clientName}</strong>,<br/><br/>
            Thank you for requesting a strategy session. Your consultation booking has been received and confirmed. <strong>RIO</strong>, the autonomous AI Representative for Annu Jaswanth, has scheduled your call.
          </p>

          <div class="box">
            <div style="font-weight: 700; color: #22c55e; font-size: 13px; margin-bottom: 8px;">📋 Consultation Details:</div>
            <div class="row"><span class="label">Name:</span><span class="val">${params.clientName}</span></div>
            <div class="row"><span class="label">Meeting Date:</span><span class="val">${meetingDate}</span></div>
            <div class="row"><span class="label">Meeting Time:</span><span class="val">${meetingTime}</span></div>
            <div class="row"><span class="label">Meeting Type:</span><span class="val">${meetingType}</span></div>
            <div class="row"><span class="label">Project Topic:</span><span class="val">${params.topic || "AI / Full-Stack Engineering"}</span></div>
          </div>

          <div style="font-size: 13px; line-height: 1.6; color: #d1d5db; margin: 16px 0;">
            <strong>Confirmation Message:</strong><br/>
            Your consultation request is registered. RIO will discuss your project scope, review architectural viability, and provide estimated turnaround times and investment models.
          </div>

          <h3 style="color: #f9fafb; font-size: 15px; margin-top: 24px;">1. Services Overview</h3>
          <div class="grid">
            <div class="item">
              <div class="item-title">Autonomous AI Agents</div>
              Conversational representatives, automated phone calling (Vapi), workflow automation with Gemini 2.5.
            </div>
            <div class="item">
              <div class="item-title">Industrial Telematics</div>
              High-frequency GPS & IoT tracking (Proven 28% fleet transit delay reduction at Veera RMC).
            </div>
            <div class="item">
              <div class="item-title">Computer Vision Models</div>
              AI pest/disease classification (Validated 94%+ field accuracy with PestRisk Agriculture).
            </div>
            <div class="item">
              <div class="item-title">Full-Stack Web Apps</div>
              Ultra-fast web platforms with Next.js 15, Supabase, Tailwind, achieving 99+ Lighthouse speed.
            </div>
          </div>

          <h3 style="color: #f9fafb; font-size: 15px; margin-top: 20px;">2. Transparent Pricing Ranges</h3>
          <ul style="font-size: 13px; color: #d1d5db; line-height: 1.7; padding-left: 20px;">
            <li><strong>Prototypes & AI Agents:</strong> ₹20,000 – ₹45,000 (1–2 weeks delivery)</li>
            <li><strong>Full-Stack Production Platforms:</strong> ₹50,000 – ₹1,20,000 (3–5 weeks delivery)</li>
            <li><strong>Enterprise Retainers & Custom AI Systems:</strong> ₹1,50,000+</li>
          </ul>

          <h3 style="color: #f9fafb; font-size: 15px; margin-top: 20px;">3. Production Tech Stack</h3>
          <p style="font-size: 13px; color: #9ca3af; line-height: 1.5;">
            Next.js 15 • TypeScript • React 19 • Python • Gemini 2.5 Flash • Supabase • PostgreSQL • Docker • Vapi Telephony • Resend
          </p>

          <p style="font-size: 13px; color: #e5e7eb; margin-top: 24px; line-height: 1.5;">
            If you need to reschedule or have questions before the call, reply directly to this email or write to Annu at <a href="mailto:annujaswanth15@gmail.com" style="color: #4ade80;">annujaswanth15@gmail.com</a>.
          </p>

          <div class="footer">
            Annu Jaswanth • AI & Full Stack Developer • Bengaluru, India<br/>
            Represented 24/7 by RIO Autonomous AI Agent
          </div>
        </div>
      </body>
    </html>
  `;

  const emailText = `
Booking Confirmation
------------------------------------------
Hello ${params.clientName},

Thank you for your consultation request. Your booking is confirmed!

Booking Details:
- Name: ${params.clientName}
- Meeting Date: ${meetingDate}
- Meeting Time: ${meetingTime}
- Meeting Type: ${meetingType}
- Project Topic: ${params.topic || "AI / Full-Stack Engineering"}

Confirmation Message:
Your consultation is locked in. RIO will reach out to discuss your project requirements, estimated timelines, and transparent pricing ranges (₹20k - ₹1.5L+).

Contact: annujaswanth15@gmail.com
  `.trim();

  const primaryResult = await dispatchEmailWithRetry({
    to: params.clientEmail,
    subject: "Booking Confirmation",
    html: emailHtml,
    text: emailText,
  });

  // If primary dispatch to client email was restricted (e.g. Resend sandbox onboarding@resend.dev domain restriction),
  // forward a copy to Annu's inbox immediately so Annu can see the client confirmation.
  if (!primaryResult.success) {
    const adminEmail = process.env.NOTIFICATION_EMAIL || "annujaswanth15@gmail.com";
    if (params.clientEmail.toLowerCase() !== adminEmail.toLowerCase()) {
      console.warn(`[Client Confirmation Fallback] Forwarding client copy to ${adminEmail}`);
      await dispatchEmailWithRetry({
        to: adminEmail,
        subject: `Booking Confirmation [Client Copy: ${params.clientName} - ${params.clientEmail}]`,
        html: `<div style="padding:12px;background:#1e293b;color:#38bdf8;border-radius:8px;margin-bottom:16px;font-size:13px;border:1px solid #3b82f6;">
          ℹ️ <strong>Client Delivery Notice:</strong> This confirmation email was intended for client <strong>${params.clientEmail}</strong>.<br/>
          <em>Note: Resend's free sandbox (<code>onboarding@resend.dev</code>) restricts delivery to the account owner (${adminEmail}). To deliver directly into client inboxes from your email address, either verify your domain on <a href="https://resend.com/domains" style="color:#60a5fa;">resend.com/domains</a> or add Gmail SMTP in <code>.env.local</code>.</em>
        </div>` + emailHtml,
        text: `[Client Confirmation Copy for: ${params.clientEmail}]\n\n` + emailText,
      });
    }
  }

  return primaryResult;
}
