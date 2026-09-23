import { NextResponse } from "next/server";
import { createRsvp, rsvpHeadcount } from "@/lib/events-db";

type RsvpPayload = {
  eventTitle: string;
  eventSlug: string;
  formName: string;
  firstName: string;
  lastName: string;
  email: string;
  guestCount?: number;
  phone?: string;
  dietaryNotes?: string;
  firstTime?: string;
  hearAbout?: string;
  mailingList?: boolean;
};

function formatRsvpEmail(payload: RsvpPayload, headcount: number): string {
  const guestCount = payload.guestCount ?? 0;
  const lines = [
    `New RSVP for ${payload.eventTitle}`,
    `Form: ${payload.formName}`,
    `Event slug: ${payload.eventSlug}`,
    "",
    `Name: ${payload.firstName} ${payload.lastName}`.trim(),
    `Email: ${payload.email}`,
    `Guests bringing: ${guestCount}`,
    `Headcount from this RSVP: ${headcount}`,
  ];

  if (payload.phone) lines.push(`Phone: ${payload.phone}`);
  if (payload.dietaryNotes) {
    lines.push(`Dietary/Accessibility Notes: ${payload.dietaryNotes}`);
  }
  if (payload.firstTime) {
    lines.push(`First BreadBreakers event: ${payload.firstTime}`);
  }
  if (payload.hearAbout) {
    lines.push(`How they heard about us: ${payload.hearAbout}`);
  }
  lines.push(`Mailing list opt-in: ${payload.mailingList ? "Yes" : "No"}`);

  return lines.join("\n");
}

export async function POST(request: Request) {
  let payload: RsvpPayload;

  try {
    payload = (await request.json()) as RsvpPayload;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid form data." },
      { status: 400 },
    );
  }

  if (!payload.firstName?.trim() || !payload.email?.trim()) {
    return NextResponse.json(
      { success: false, message: "Name and email are required." },
      { status: 400 },
    );
  }

  const guestCount = Math.max(0, Number(payload.guestCount) || 0);
  const headcount = rsvpHeadcount(guestCount);

  try {
    const rsvp = await createRsvp({
      eventSlug: payload.eventSlug,
      firstName: payload.firstName,
      lastName: payload.lastName ?? "",
      email: payload.email,
      guestCount,
    });

    if (!rsvp) {
      return NextResponse.json(
        { success: false, message: "This event could not be found." },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("RSVP save error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit form. Please try again later.",
      },
      { status: 500 },
    );
  }

  const token = process.env.POSTMARK_SERVER_TOKEN;
  const from = process.env.POSTMARK_FROM_EMAIL;
  const to = process.env.POSTMARK_TO_EMAIL;

  if (!token || !from || !to) {
    console.log("RSVP received (Postmark not configured):", payload);

    return NextResponse.json({
      success: true,
      configured: false,
      message: "Thank you!",
    });
  }

  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": token,
    },
    body: JSON.stringify({
      From: from,
      To: to,
      Subject: `RSVP: ${payload.eventTitle}`,
      TextBody: formatRsvpEmail(payload, headcount),
      ReplyTo: payload.email,
    }),
  });

  if (!response.ok) {
    console.error("Postmark error:", await response.text());

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit form. Please try again later.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    configured: true,
    message: "Thank you!",
  });
}
