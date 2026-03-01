import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { image, mediaType } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const type = validTypes.includes(mediaType) ? mediaType : "image/png";

    const msg = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: type,
                data: image,
              },
            },
            {
              type: "text",
              text: `This is a screenshot from a language learning app (likely Duolingo). Extract all Japanese phrases/sentences visible in the image.

Rules:
- Only extract Japanese text (hiragana, katakana, kanji, or mixed)
- Ignore UI elements, buttons, English text, and navigation
- Return each complete phrase/sentence as a separate item
- If there are word bank tiles, try to identify the complete sentence if one is being constructed
- Return ONLY a JSON array of strings, no markdown, no explanation

Example: ["今日は天気がいいです", "明日学校に行きます"]

If no Japanese text is found, return: []`,
            },
          ],
        },
      ],
    });

    let raw = msg.content[0]?.text?.trim() || "[]";
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

    let phrases;
    try {
      phrases = JSON.parse(raw);
    } catch {
      console.error("Screenshot parse error. Raw:", raw);
      return NextResponse.json({ phrases: [] });
    }

    if (!Array.isArray(phrases)) {
      return NextResponse.json({ phrases: [] });
    }

    // Filter to only strings
    phrases = phrases.filter((p) => typeof p === "string" && p.trim());

    return NextResponse.json({ phrases });
  } catch (err) {
    console.error("Screenshot error:", err);
    return NextResponse.json({ error: "Parse failed" }, { status: 500 });
  }
}
