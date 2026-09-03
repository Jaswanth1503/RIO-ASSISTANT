import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    const openAiKey = process.env.OPENAI_API_KEY;

    if (openAiKey && !openAiKey.includes("your-openai")) {
      const whisperFormData = new FormData();
      whisperFormData.append("file", audioFile, "audio.webm");
      whisperFormData.append("model", "whisper-1");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiKey}`,
        },
        body: whisperFormData,
      });

      const data = await response.json();
      return NextResponse.json({ text: data.text });
    }

    // Default simulation or client fallback
    return NextResponse.json({
      text: "Tell me about Annu's services and pricing.",
      provider: "simulated-whisper",
    });
  } catch (error: any) {
    console.error("Error in /api/voice/stt:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
