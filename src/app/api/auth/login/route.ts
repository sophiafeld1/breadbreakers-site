import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { sessionRoleFromUser, authenticateUser } from "@/lib/auth/users";

type LoginPayload = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  if (!process.env.AUTH_SECRET) {
    return NextResponse.json(
      { success: false, message: "Dashboard auth is not configured." },
      { status: 503 },
    );
  }

  let payload: LoginPayload;

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  const username = payload.username?.trim() ?? "";
  const password = payload.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { success: false, message: "Username and password are required." },
      { status: 400 },
    );
  }

  try {
    const user = await authenticateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 },
      );
    }

    const session = await getSession();
    session.isLoggedIn = true;
    session.username = user.username;
    session.userId = user.id;
    session.role = sessionRoleFromUser(user.role);
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to sign in right now." },
      { status: 503 },
    );
  }
}
