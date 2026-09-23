import type { Event as PrismaEvent } from "@/generated/prisma/client";
import { rsvpHeadcount } from "@/lib/events-db";

export type RsvpSubmission = {
  eventTitle: string;
  eventSlug: string;
  formName: string;
  firstName: string;
  lastName: string;
  email: string;
  guestCount: number;
  phone?: string;
  dietaryNotes?: string;
  firstTime?: string;
  hearAbout?: string;
  mailingList?: boolean;
};

function fullName(submission: RsvpSubmission): string {
  return [submission.firstName, submission.lastName].filter(Boolean).join(" ");
}

function guestSummary(guestCount: number): string {
  if (guestCount === 0) {
    return "Just you";
  }

  if (guestCount === 1) {
    return "You plus 1 guest";
  }

  return `You plus ${guestCount} guests`;
}

function eventLocation(event: Pick<PrismaEvent, "venueName" | "mapQuery">): string {
  if (event.venueName && event.mapQuery) {
    return `${event.venueName} (${event.mapQuery})`;
  }

  return event.venueName ?? event.mapQuery ?? "Location details coming soon";
}

function submissionDetails(submission: RsvpSubmission, headcount: number): string[] {
  const lines = [
    `Name: ${fullName(submission)}`,
    `Email: ${submission.email}`,
    guestSummary(submission.guestCount),
    `Headcount from this RSVP: ${headcount}`,
  ];

  if (submission.phone?.trim()) {
    lines.push(`Phone: ${submission.phone.trim()}`);
  }

  if (submission.dietaryNotes?.trim()) {
    lines.push(`Dietary / accessibility notes: ${submission.dietaryNotes.trim()}`);
  }

  if (submission.firstTime) {
    lines.push(`First BreadBreakers event: ${submission.firstTime}`);
  }

  if (submission.hearAbout) {
    lines.push(`How they heard about us: ${submission.hearAbout}`);
  }

  lines.push(`Mailing list opt-in: ${submission.mailingList ? "Yes" : "No"}`);

  return lines;
}

export function buildAdminRsvpEmail(
  submission: RsvpSubmission,
  event: Pick<
    PrismaEvent,
    "dateLabel" | "timeLabel" | "venueName" | "mapQuery"
  >,
): { subject: string; textBody: string } {
  const headcount = rsvpHeadcount(submission.guestCount);
  const lines = [
    `New RSVP for ${submission.eventTitle}`,
    `Form: ${submission.formName}`,
    "",
    `Event date: ${event.dateLabel}`,
    `Event time: ${event.timeLabel}`,
    `Location: ${eventLocation(event)}`,
    "",
    ...submissionDetails(submission, headcount),
  ];

  return {
    subject: `New RSVP: ${submission.eventTitle}`,
    textBody: lines.join("\n"),
  };
}

export function buildAttendeeRsvpEmail(
  submission: RsvpSubmission,
  event: Pick<
    PrismaEvent,
    "title" | "dateLabel" | "timeLabel" | "venueName" | "mapQuery"
  >,
): { subject: string; textBody: string; htmlBody: string } {
  const headcount = rsvpHeadcount(submission.guestCount);
  const greetingName = submission.firstName.trim() || fullName(submission);
  const location = eventLocation(event);
  const yourRegistration = submissionDetails(submission, headcount);

  const textBody = [
    `Hi ${greetingName},`,
    "",
    `Thank you for RSVPing to ${event.title}!`,
    "",
    "Event details",
    `When: ${event.dateLabel}`,
    `Time: ${event.timeLabel}`,
    `Where: ${location}`,
    "",
    "Your registration",
    ...yourRegistration.map((line) => `- ${line}`),
    "",
    "We look forward to seeing you there.",
    "",
    "BreadBreakers Community",
  ].join("\n");

  const htmlBody = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #3d2b1f; line-height: 1.6; max-width: 560px;">
      <p>Hi ${escapeHtml(greetingName)},</p>
      <p>Thank you for RSVPing to <strong>${escapeHtml(event.title)}</strong>!</p>
      <h2 style="font-size: 18px; color: #204c74; margin-bottom: 8px;">Event details</h2>
      <ul style="padding-left: 20px;">
        <li><strong>When:</strong> ${escapeHtml(event.dateLabel)}</li>
        <li><strong>Time:</strong> ${escapeHtml(event.timeLabel)}</li>
        <li><strong>Where:</strong> ${escapeHtml(location)}</li>
      </ul>
      <h2 style="font-size: 18px; color: #204c74; margin-bottom: 8px;">Your registration</h2>
      <ul style="padding-left: 20px;">
        ${yourRegistration.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
      </ul>
      <p>We look forward to seeing you there.</p>
      <p style="margin-top: 24px;">BreadBreakers Community</p>
    </div>
  `.trim();

  return {
    subject: `You're registered: ${event.title}`,
    textBody,
    htmlBody,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
