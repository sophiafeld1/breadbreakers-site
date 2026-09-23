import { NextResponse } from "next/server";
import { requireMasterSession } from "@/lib/auth/server";
import { createEvent } from "@/lib/events-db";
import type { EventEditorValues } from "@/lib/event-editor";

export async function POST(request: Request) {
  try {
    await requireMasterSession();
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let payload: Partial<EventEditorValues>;

  try {
    payload = (await request.json()) as Partial<EventEditorValues>;
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  try {
    const event = await createEvent(payload);

    return NextResponse.json({ event });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "An event with that link name already exists." },
        { status: 409 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("Create event error:", error);
    return NextResponse.json({ message: "Unable to create event." }, { status: 500 });
  }
}
