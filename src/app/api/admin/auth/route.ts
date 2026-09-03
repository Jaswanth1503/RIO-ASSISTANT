import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function getExpectedPasscode(): string {
  return process.env.ADMIN_PASSCODE || "rio2026";
}

function generateSessionToken(): string {
  const secret = process.env.SESSION_SECRET || "rio_admin_session_secret_key_2026";
  const timestamp = Date.now().toString();
  const hash = crypto.createHmac("sha256", secret).update(timestamp).digest("hex");
  return `${timestamp}.${hash}`;
}

function isValidSessionToken(token: string): boolean {
  if (!token || !token.includes(".")) return false;
  const [timestampStr, providedHash] = token.split(".");
  const timestamp = parseInt(timestampStr, 10);

  // Expire session after 7 days
  if (isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
    return false;
  }

  const secret = process.env.SESSION_SECRET || "rio_admin_session_secret_key_2026";
  const expectedHash = crypto.createHmac("sha256", secret).update(timestampStr).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(providedHash), Buffer.from(expectedHash));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, token } = body;

    // Check token validation mode
    if (token) {
      if (isValidSessionToken(token)) {
        return NextResponse.json({ success: true, authenticated: true });
      }
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    // Passcode authentication mode
    if (!passcode) {
      return NextResponse.json({ success: false, error: "Passcode required" }, { status: 400 });
    }

    const expected = getExpectedPasscode();

    // Constant-time comparison to prevent timing attacks
    const isMatch =
      passcode.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(passcode), Buffer.from(expected));

    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const sessionToken = generateSessionToken();

    return NextResponse.json({
      success: true,
      authenticated: true,
      token: sessionToken,
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
