import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_SESSION_DURATION = 60 * 60 * 24; // 24 hours in seconds

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return NextResponse.json(
        { error: "Admin authentication is not configured" },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Set admin session cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ADMIN_SESSION_DURATION,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "An error occurred during authentication" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}

// Helper function to check admin authentication
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get(ADMIN_COOKIE_NAME);
    return adminSession?.value === "authenticated";
  } catch {
    return false;
  }
}


