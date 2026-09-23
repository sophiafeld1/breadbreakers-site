import { NextResponse } from "next/server";
import { requireMasterSession } from "@/lib/auth/server";
import {
  countMasterUsers,
  deleteDashboardUser,
  listDashboardUsers,
  updateDashboardUserPassword,
} from "@/lib/auth/users";
import { UserRole } from "@/generated/prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdateUserPayload = {
  password?: string;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireMasterSession();
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let payload: UpdateUserPayload;

  try {
    payload = (await request.json()) as UpdateUserPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const password = payload.password ?? "";

  if (password.length < 12) {
    return NextResponse.json(
      { message: "Password must be at least 12 characters." },
      { status: 400 },
    );
  }

  try {
    const users = await listDashboardUsers();
    const target = users.find((user) => user.id === id);

    if (!target) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const user = await updateDashboardUserPassword(id, password);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update user password error:", error);
    return NextResponse.json(
      { message: "Unable to update password." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  let session;

  try {
    session = await requireMasterSession();
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (id === session.userId) {
    return NextResponse.json(
      { message: "You cannot remove your own account while signed in." },
      { status: 400 },
    );
  }

  try {
    const users = await listDashboardUsers();
    const target = users.find((user) => user.id === id);

    if (!target) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (target.role === UserRole.MASTER) {
      const masterCount = await countMasterUsers();

      if (masterCount <= 1) {
        return NextResponse.json(
          { message: "At least one master account must remain." },
          { status: 400 },
        );
      }
    }

    await deleteDashboardUser(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ message: "Unable to remove user." }, { status: 500 });
  }
}
