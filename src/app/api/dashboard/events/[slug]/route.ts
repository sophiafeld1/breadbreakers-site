import { NextResponse } from "next/server";
import { requireMasterSession } from "@/lib/auth/server";
import { deleteEvent, updateEvent } from "@/lib/events-db";
import type { EventEditorValues } from "@/lib/event-editor";

type RouteContext = {
  params: Promise<{ slug: string }>;
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

  const { slug } = await context.params;

  let payload: Partial<EventEditorValues>;

  try {
    payload = (await request.json()) as Partial<EventEditorValues>;
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  try {
    const event = await updateEvent(slug, payload);

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

    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ message: "Event not found." }, { status: 404 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("Update event error:", error);
    return NextResponse.json({ message: "Unable to update event." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireMasterSession();
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;

  try {
    await deleteEvent(slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ message: "Event not found." }, { status: 404 });
    }

    console.error("Delete event error:", error);
    return NextResponse.json({ message: "Unable to delete event." }, { status: 500 });
  }
}
