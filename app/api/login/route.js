import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "jgb_user";
const DEFAULT_USER = "default";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// GET — always return default user and set cookie if missing
export async function GET() {
  const cookieStore = cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;

  if (existing) {
    return NextResponse.json({ user: existing });
  }

  const response = NextResponse.json({ user: DEFAULT_USER });
  response.cookies.set(COOKIE_NAME, DEFAULT_USER, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return response;
}

// POST — not needed but keep for compatibility
export async function POST() {
  const response = NextResponse.json({ success: true, user: DEFAULT_USER });
  response.cookies.set(COOKIE_NAME, DEFAULT_USER, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return response;
}

// DELETE — clear cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
