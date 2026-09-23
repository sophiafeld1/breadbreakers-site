import { NextResponse } from "next/server";
import { createRsvp } from "@/lib/events-db";
import { getPostmarkConfig, sendPostmarkEmail } from "@/lib/postmark";
import {
  buildAdminRsvpEmail,
  buildAttendeeRsvpEmail,
  type RsvpSubmission,
} from "@/lib/rsvp-email";

export async function POST(request: Request) {
  let payload: RsvpSubmission;

  try {
    payload = (await request.json()) as RsvpSubmission;
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

  if (!payload.eventSlug?.trim()) {
    return NextResponse.json(
      { success: false, message: "This event could not be found." },
      { status: 400 },
    );
  }

  const guestCount = Math.max(0, Number(payload.guestCount) || 0);
  const submission: RsvpSubmission = {
    ...payload,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName?.trim() ?? "",
    email: payload.email.trim(),
    guestCount,
  };

  let result;

  try {
    result = await createRsvp({
      eventSlug: submission.eventSlug,
      firstName: submission.firstName,
      lastName: submission.lastName,
      email: submission.email,
      guestCount: submission.guestCount,
      phone: submission.phone,
      dietaryNotes: submission.dietaryNotes,
      firstTime: submission.firstTime,
      hearAbout: submission.hearAbout,
      mailingList: submission.mailingList,
    });
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

  if (!result) {
    return NextResponse.json(
      { success: false, message: "This event could not be found." },
      { status: 404 },
    );
  }

  const { event } = result;
  const postmark = getPostmarkConfig();

  if (!postmark) {
    console.log("RSVP received (Postmark not configured):", submission);

    return NextResponse.json({
      success: true,
      configured: false,
      message:
        "Thank you! Your RSVP was saved. We'll be in touch with event details soon.",
    });
  }

  const adminEmail = buildAdminRsvpEmail(submission, event);
  const attendeeEmail = buildAttendeeRsvpEmail(submission, event);

  const adminResult = await sendPostmarkEmail({
    token: postmark.token,
    from: postmark.from,
    to: postmark.adminTo,
    subject: adminEmail.subject,
    textBody: adminEmail.textBody,
    replyTo: submission.email,
  });

  if (!adminResult.ok) {
    console.error("Postmark admin email error:", adminResult.error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit form. Please try again later.",
      },
      { status: 502 },
    );
  }

  const attendeeResult = await sendPostmarkEmail({
    token: postmark.token,
    from: postmark.from,
    to: submission.email,
    subject: attendeeEmail.subject,
    textBody: attendeeEmail.textBody,
    htmlBody: attendeeEmail.htmlBody,
    replyTo: postmark.from,
  });

  if (!attendeeResult.ok) {
    console.error("Postmark attendee email error:", attendeeResult.error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Your RSVP was saved, but we couldn't send your confirmation email. Please contact us if you need help.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    configured: true,
    message:
      "Thank you! Check your email for a confirmation with the event details.",
  });
}
