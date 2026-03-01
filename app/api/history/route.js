import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KEY_PREFIX = "jgb:history:";

async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: "no-store",
  });
  const data = await res.json();
  return data.result;
}

async function kvSet(key, value) {
  await fetch(`${KV_URL}/set/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });
}

function getUser() {
  const cookieStore = cookies();
  return cookieStore.get("jgb_user")?.value;
}

// GET — load saved phrases
export async function GET() {
  try {
    const user = getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await kvGet(`${KEY_PREFIX}${user}`);
    let phrases = [];
    if (data) {
      try {
        phrases = typeof data === "string" ? JSON.parse(data) : data;
      } catch {
        phrases = [];
      }
    }

    return NextResponse.json({ phrases });
  } catch (err) {
    console.error("History GET error:", err);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}

// POST — save phrases
export async function POST(req) {
  try {
    const user = getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { phrases } = await req.json();
    await kvSet(`${KEY_PREFIX}${user}`, phrases);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("History POST error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
