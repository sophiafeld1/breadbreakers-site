import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

import { prisma } from "../src/lib/db";
import { getPostmarkConfig } from "../src/lib/postmark";
import {
  buildAdminRsvpEmail,
  buildAttendeeRsvpEmail,
  type RsvpSubmission,
} from "../src/lib/rsvp-email";

const PRODUCTION = "https://breadbreakerscommunity.org";
const TEST_EMAIL = "form-dry-run-do-not-send@example.invalid";

const sampleSubmission: RsvpSubmission = {
  eventTitle: "BreadBreakers Community Dinner",
  eventSlug: "dry-run",
  formName: "standard",
  firstName: "Dry",
  lastName: "Run",
  email: TEST_EMAIL,
  guestCount: 1,
  phone: "555-0100",
  dietaryNotes: "Vegetarian",
  firstTime: "Yes",
  hearAbout: "Word of Mouth",
  mailingList: true,
};

const sampleEvent = {
  title: "BreadBreakers Community Dinner",
  dateLabel: "Thursday, July 30, 2026",
  timeLabel: "6:30 PM – 8:30 PM",
  venueName: "Reston Community Center Lake Anne",
  mapQuery: "Reston Community Center Lake Anne",
};

async function postRsvp(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    configured?: boolean;
  } | null;

  return { status: response.status, json };
}

async function main() {
  const failures: string[] = [];

  console.log("=== Email template dry-run (no send) ===");
  const adminEmail = buildAdminRsvpEmail(sampleSubmission, sampleEvent);
  const attendeeEmail = buildAttendeeRsvpEmail(sampleSubmission, sampleEvent);

  for (const [label, ok] of [
    ["admin subject", adminEmail.subject.includes("New RSVP")],
    ["admin body has name", adminEmail.textBody.includes("Dry Run")],
    ["admin body has email", adminEmail.textBody.includes(TEST_EMAIL)],
    ["admin body has notes", adminEmail.textBody.includes("Vegetarian")],
    ["attendee subject", attendeeEmail.subject.includes("You're registered")],
    ["attendee greeting", attendeeEmail.textBody.includes("Hi Dry")],
    ["attendee html", attendeeEmail.htmlBody.includes("Vegetarian")],
  ] as const) {
    console.log(ok ? `  ok  ${label}` : `  FAIL ${label}`);
    if (!ok) failures.push(label);
  }

  console.log("\n=== Postmark config ===");
  const postmark = getPostmarkConfig();
  if (postmark) {
    console.log(
      "  Postmark IS configured locally. Dry-run will not call sendPostmarkEmail.",
    );
  } else {
    console.log(
      "  Postmark is not configured locally (no POSTMARK_* in .env.local).",
    );
    console.log("  RSVPs save, but no email would be sent.");
  }

  console.log("\n=== Live API validation (no RSVP created, no email) ===");
  const missingName = await postRsvp(`${PRODUCTION}/api/rsvp`, {
    email: TEST_EMAIL,
    eventSlug: "anything",
  });
  const missingSlug = await postRsvp(`${PRODUCTION}/api/rsvp`, {
    firstName: "Dry",
    email: TEST_EMAIL,
  });
  const unknownEvent = await postRsvp(`${PRODUCTION}/api/rsvp`, {
    firstName: "Dry",
    lastName: "Run",
    email: TEST_EMAIL,
    eventSlug: "this-event-does-not-exist-dry-run",
    guestCount: 0,
  });

  const apiChecks: [string, boolean][] = [
    [
      "missing name -> 400",
      missingName.status === 400 && missingName.json?.success === false,
    ],
    [
      "missing event slug -> 400",
      missingSlug.status === 400 && missingSlug.json?.success === false,
    ],
    [
      "unknown event -> 404",
      unknownEvent.status === 404 && unknownEvent.json?.success === false,
    ],
  ];

  for (const [label, ok] of apiChecks) {
    console.log(ok ? `  ok  ${label}` : `  FAIL ${label}`);
    if (!ok) failures.push(label);
  }

  console.log("\n=== Database save dry-run (create then delete, no email) ===");
  const event = await prisma.event.findFirst({
    where: { isUpcoming: true },
    orderBy: { createdAt: "desc" },
  });

  if (!event) {
    failures.push("no upcoming event in database");
    console.log("  FAIL no upcoming event found");
  } else {
    const created = await prisma.rsvp.create({
      data: {
        eventId: event.id,
        firstName: "Dry",
        lastName: "Run",
        email: TEST_EMAIL,
        guestCount: 1,
        phone: "555-0100",
        dietaryNotes: "Dry-run only — delete me",
        firstTime: "Yes",
        hearAbout: "Word of Mouth",
        mailingList: false,
      },
    });

    const found = await prisma.rsvp.findUnique({ where: { id: created.id } });
    await prisma.rsvp.delete({ where: { id: created.id } });
    const gone = await prisma.rsvp.findUnique({ where: { id: created.id } });

    const saved = Boolean(found);
    const cleaned = gone === null;
    console.log(
      saved ? `  ok  saved test RSVP on "${event.slug}"` : "  FAIL save RSVP",
    );
    console.log(
      cleaned
        ? "  ok  deleted test RSVP (nothing left in the database)"
        : "  FAIL delete test RSVP",
    );
    if (!saved) failures.push("save RSVP");
    if (!cleaned) failures.push("delete RSVP");
  }

  console.log("\n=== Live events page still has the form ===");
  const eventsPage = await fetch(`${PRODUCTION}/events`);
  const html = await eventsPage.text();
  const formChecks: [string, boolean][] = [
    ["events page 200", eventsPage.ok],
    ["first name field", html.includes("First Name")],
    ["email field", html.includes('name="email"') || html.includes("Email")],
    ["submit button", html.includes("Submit")],
  ];
  for (const [label, ok] of formChecks) {
    console.log(ok ? `  ok  ${label}` : `  FAIL ${label}`);
    if (!ok) failures.push(label);
  }

  await prisma.$disconnect();

  if (failures.length > 0) {
    console.error(`\nFAILED: ${failures.join(", ")}`);
    process.exit(1);
  }

  console.log("\nAll dry-run checks passed. No emails were sent.");
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect().catch(() => undefined);
  process.exit(1);
});
