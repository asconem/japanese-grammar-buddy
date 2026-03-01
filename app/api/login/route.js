import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "jgb_user";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getValidUsers() {
  // Scan environment variables for USER_*_PASSWORD pattern
  const users = {};
  for (const [key, value] of Object.entries(process.env)) {
    const match = key.match(/^USER_([A-Z0-9_]+)_PASSWORD$/);
    if (match) {
      const username = match[1].toLowerCase();
      users[username] = value;
    }
  }
  return users;
}

// GET — check current auth status
export async function GET() {
  const cookieStore = cookies();
  const user = cookieStore.get(COOKIE_NAME)?.value;

  if (user) {
    return NextResponse.json({ user });
  }
  return NextResponse.json({ user: null });
}

// POST — login
export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password required" },
        { status: 400 }
      );
    }

    const users = getValidUsers();
    const normalizedUser = username.toLowerCase().trim();

    if (!users[normalizedUser] || users[normalizedUser] !== password) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: normalizedUser,
    });

    response.cookies.set(COOKIE_NAME, normalizedUser, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}

// DELETE — logout
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
