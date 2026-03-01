import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { phrase, translation, messages } = await req.json();
    if (!messages?.length) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    const systemPrompt = `You are a friendly, knowledgeable Japanese grammar tutor helping someone who is learning Japanese (likely at beginner to intermediate level, possibly using Duolingo).

${phrase ? `The student is currently exploring the Japanese phrase: "${phrase}"` : ""}
${translation ? `English translation: "${translation}"` : ""}

Guidelines:
- Explain Japanese grammar clearly and concisely
- Use romaji sparingly — prefer showing Japanese text (kanji/kana) with explanations
- When explaining kanji, mention the reading(s) relevant to this context
- Explain particles, verb forms, conjugation patterns, and sentence structure
- Give examples when helpful, but keep them short
- If the student asks about something unrelated to the current phrase, help them anyway
- Be encouraging and patient — learning Japanese is hard!
- Keep responses focused — no need for lengthy preambles
- Use markdown bold (**word**) for emphasis on key terms`;

    // Build message history for Claude
    const apiMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const msg = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: apiMessages,
    });

    const reply = msg.content[0]?.text?.trim() || "Sorry, I couldn't generate a response.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
