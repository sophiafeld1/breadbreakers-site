import { NextResponse } from "next/server";
import { requireMasterSession } from "@/lib/auth/server";

export async function requireMasterApi() {
  try {
    await requireMasterSession();
    return null;
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
