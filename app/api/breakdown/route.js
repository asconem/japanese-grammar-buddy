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
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: `You are a Japanese language analysis tool. Break down the given Japanese sentence into its individual morphemes/words.

For each element, provide:
1. "japanese" — the original Japanese text (kanji, hiragana, or katakana as written)
2. "reading" — the full hiragana reading (important for kanji words; for pure hiragana/katakana words, repeat the same text)
3. "english" — concise English meaning in this context
4. "pos" — part of speech: NOUN, VERB, ADJ, ADV, PART (particle), AUX (auxiliary), CONJ, DET, COUNTER, COPULA, PREFIX, SUFFIX, INTERJ, or EXPR (expression)

Important rules:
- Segment into meaningful units (not individual characters, but not overly large chunks either)
- Particles should be their own element (は, が, を, に, で, etc.)
- Verb endings/conjugations: keep the verb as one unit in its conjugated form
- For compound words, keep them together if they function as one unit
- The "reading" field should always be in hiragana

Respond with ONLY a JSON array, no markdown formatting, no code blocks. Example:
[{"japanese":"食べ","reading":"たべ","english":"eat","pos":"VERB"},{"japanese":"ます","reading":"ます","english":"(polite)","pos":"AUX"}]`,
      messages: [{ role: "user", content: text.trim() }],
    });

    let raw = msg.content[0]?.text?.trim() || "[]";

    // Strip markdown code fences if present
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

    let words;
    try {
      words = JSON.parse(raw);
    } catch {
      console.error("Breakdown parse error. Raw:", raw);
      return NextResponse.json({ words: [] });
    }

    // Validate structure
    if (!Array.isArray(words)) {
      return NextResponse.json({ words: [] });
    }

    words = words.map((w) => ({
      japanese: w.japanese || "",
      reading: w.reading || "",
      english: w.english || "",
      pos: w.pos || "?",
    }));

    return NextResponse.json({ words });
  } catch (err) {
    console.error("Breakdown error:", err);
    return NextResponse.json({ error: "Breakdown failed" }, { status: 500 });
  }
}
