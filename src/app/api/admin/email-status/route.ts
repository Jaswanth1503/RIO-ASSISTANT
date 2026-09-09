import { NextRequest, NextResponse } from "next/server";
import { getEmailConfigStatus, dispatchEmailWithRetry } from "@/lib/resend";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const status = getEmailConfigStatus();
    return NextResponse.json({
      success: true,
      emailConfig: status,
      instructions: !status.ready
        ? "To enable emails in production, add SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT to your Vercel Project Settings > Environment Variables."
        : "Email service is configured and ready.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to check email status" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetEmail = body.testEmail || process.env.NOTIFICATION_EMAIL || "annujaswanth15@gmail.com";

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const result = await dispatchEmailWithRetry({
      to: targetEmail,
      subject: `RIO Email Diagnostic Verification [${timestamp}]`,
      html: `
        <div style="font-family:sans-serif;background:#0b0f19;color:#f3f4f6;padding:24px;border-radius:12px;">
          <h2 style="color:#22c55e;">⚡ RIO Email Dispatch Verified</h2>
          <p>This is a live diagnostic verification email sent from your RIO Business Operating System.</p>
          <div style="background:#1f2937;padding:16px;border-radius:8px;font-size:13px;">
            <p><strong>Recipient:</strong> ${targetEmail}</p>
            <p><strong>Timestamp:</strong> ${timestamp} IST</p>
            <p><strong>Server Status:</strong> Operational</p>
          </div>
          <p style="font-size:12px;color:#9ca3af;margin-top:16px;">
            Both client booking confirmations and Annu's lead alerts use this channel.
          </p>
        </div>
      `,
      text: `RIO Email Diagnostic Verification\nRecipient: ${targetEmail}\nTimestamp: ${timestamp} IST\nServer Status: Operational`,
    });

    return NextResponse.json({
      success: result.success,
      result,
      targetEmail,
      config: getEmailConfigStatus(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Diagnostic test failed" }, { status: 500 });
  }
}
