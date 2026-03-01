import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "No text" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "TTS not configured" }, { status: 500 });
    }

    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: text.trim() },
          voice: {
            languageCode: "ja-JP",
            name: "ja-JP-Wavenet-A",
            ssmlGender: "FEMALE",
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 0.9, // Slightly slower for learners
            pitch: 0,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("TTS error:", err);
      return NextResponse.json({ error: "TTS failed" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ audio: data.audioContent });
  } catch (err) {
    console.error("Speak error:", err);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
