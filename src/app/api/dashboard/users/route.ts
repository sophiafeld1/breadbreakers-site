import { NextResponse } from "next/server";
import { requireMasterSession } from "@/lib/auth/server";
import {
  createDashboardUser,
  listDashboardUsersForMaster,
  MASTER_USERNAME,
} from "@/lib/auth/users";

type CreateUserPayload = {
  username?: string;
  password?: string;
};

export async function GET() {
  try {
    await requireMasterSession();
    const users = await listDashboardUsersForMaster();

    return NextResponse.json({ users });
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("List users error:", error);
    return NextResponse.json({ message: "Unable to load users." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let session;

  try {
    session = await requireMasterSession();
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let payload: CreateUserPayload;

  try {
    payload = (await request.json()) as CreateUserPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const username = payload.username?.trim() ?? "";
  const password = payload.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 },
    );
  }

  if (username.length < 3) {
    return NextResponse.json(
      { message: "Username must be at least 3 characters." },
      { status: 400 },
    );
  }

  if (password.length < 12) {
    return NextResponse.json(
      { message: "Password must be at least 12 characters." },
      { status: 400 },
    );
  }

  if (username === MASTER_USERNAME) {
    return NextResponse.json(
      { message: "That username is reserved." },
      { status: 400 },
    );
  }

  try {
    const user = await createDashboardUser(username, password);

    return NextResponse.json({ user });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "That username is already taken." },
        { status: 409 },
      );
    }

    console.error("Create user error:", error);
    return NextResponse.json({ message: "Unable to create user." }, { status: 500 });
  }
}
