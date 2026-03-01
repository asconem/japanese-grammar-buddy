import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const msg = await client.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 500,
      system: `You are a Japanese-to-English translator. Translate the given Japanese text into natural, accurate English. 
- Provide ONLY the English translation, no explanations.
- If the text is already in English or not Japanese, still translate/explain it briefly.
- For casual/informal Japanese, reflect that in the English.
- Preserve the tone and register of the original.`,
      messages: [{ role: "user", content: text.trim() }],
    });

    const translation = msg.content[0]?.text?.trim() || "Translation failed";
    return NextResponse.json({ translation });
  } catch (err) {
    console.error("Translate error:", err);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
