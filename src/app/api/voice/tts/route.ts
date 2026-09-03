import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Voice synthesis endpoint that outputs speech or handles F5-TTS audio requests
export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // In a deployed environment with a running F5-TTS microservice or ElevenLabs/OpenAI TTS:
    const ttsServerUrl = process.env.F5_TTS_SERVER_URL;

    if (ttsServerUrl) {
      const response = await fetch(`${ttsServerUrl}/synthesize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: language || "en" }),
      });
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Client-side Web Speech API / synthesis fallback
    return NextResponse.json({
      success: true,
      text,
      language: language || "en",
      provider: "browser-synthesis",
      note: "Client plays via Web Speech API or F5-TTS audio pipeline",
    });
  } catch (error: any) {
    console.error("Error in /api/voice/tts:", error);
    return NextResponse.json({ error: "Voice synthesis failed" }, { status: 500 });
  }
}
