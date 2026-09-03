import { getEventBySlug } from "@/lib/events";
import { NextResponse } from "next/server";

const eventTimes: Record<string, { start: string; end: string }> = {
  "july-30-2026": { start: "20260730T223000Z", end: "20260731T003000Z" },
  "june-24-2026": { start: "20260624T223000Z", end: "20260625T003000Z" },
  "may-28-2026": { start: "20260528T223000Z", end: "20260529T003000Z" },
};

function buildIcs(event: NonNullable<ReturnType<typeof getEventBySlug>>) {
  const times = eventTimes[event.slug];
  const location = event.location ?? "";
  const uid = `${event.slug}@breadbreakerscommunity.org`;
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BreadBreakers//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${times.start}`,
    `DTEND:${times.end}`,
    `SUMMARY:${event.title}`,
    location ? `LOCATION:${location}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event || !eventTimes[slug]) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const ics = buildIcs(event);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
