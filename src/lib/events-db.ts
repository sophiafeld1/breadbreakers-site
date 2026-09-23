import type { Event as PrismaEvent } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import type { Event, EventFormVariant } from "@/lib/events";

export function rsvpHeadcount(guestCount: number): number {
  return 1 + guestCount;
}

function parseDescription(value: PrismaEvent["description"]): string[] | undefined {
  if (!value || !Array.isArray(value)) {
    return undefined;
  }

  return value.filter((item): item is string => typeof item === "string");
}

export function toPublicEvent(event: PrismaEvent): Event {
  return {
    slug: event.slug,
    title: event.title,
    month: event.month,
    day: event.day,
    dateLabel: event.dateLabel,
    timeLabel: event.timeLabel,
    location: event.venueName ?? undefined,
    mapQuery: event.mapQuery ?? undefined,
    googleCalendarUrl: event.googleCalendarUrl ?? "",
    image: event.image,
    imageAlt: event.imageAlt,
    isUpcoming: event.isUpcoming,
    formVariant: event.formVariant as EventFormVariant,
    formName: event.formName,
    description: parseDescription(event.description),
    calendarStart: event.calendarStart ?? undefined,
    calendarEnd: event.calendarEnd ?? undefined,
  };
}

export async function listPublicEvents(chapter = "Reston"): Promise<Event[]> {
  const events = await prisma.event.findMany({
    where: { chapter },
    orderBy: [{ isUpcoming: "desc" }, { dateLabel: "desc" }],
  });

  return events.map(toPublicEvent);
}

export async function getPublicEventBySlug(slug: string): Promise<Event | null> {
  const event = await prisma.event.findUnique({ where: { slug } });

  if (!event) {
    return null;
  }

  return toPublicEvent(event);
}

export async function getEventBySlugFromDb(slug: string) {
  return prisma.event.findUnique({ where: { slug } });
}

export async function listEventsWithHeadcounts(chapter = "Reston") {
  const events = await prisma.event.findMany({
    where: { chapter },
    include: {
      rsvps: {
        select: { guestCount: true },
      },
    },
    orderBy: [{ isUpcoming: "desc" }, { dateLabel: "desc" }],
  });

  return events.map((event) => ({
    id: event.id,
    slug: event.slug,
    chapter: event.chapter,
    title: event.title,
    dateLabel: event.dateLabel,
    timeLabel: event.timeLabel,
    venueName: event.venueName,
    isUpcoming: event.isUpcoming,
    headcount: event.rsvps.reduce(
      (total, rsvp) => total + rsvpHeadcount(rsvp.guestCount),
      0,
    ),
    rsvpCount: event.rsvps.length,
  }));
}

export async function getEventWithRsvps(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      rsvps: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          guestCount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!event) {
    return null;
  }

  const headcount = event.rsvps.reduce(
    (total, rsvp) => total + rsvpHeadcount(rsvp.guestCount),
    0,
  );

  return {
    ...event,
    headcount,
    rsvps: event.rsvps.map((rsvp) => ({
      ...rsvp,
      headcount: rsvpHeadcount(rsvp.guestCount),
    })),
  };
}

export async function createRsvp(input: {
  eventSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  guestCount: number;
}) {
  const event = await getEventBySlugFromDb(input.eventSlug);

  if (!event) {
    return null;
  }

  return prisma.rsvp.create({
    data: {
      eventId: event.id,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
      guestCount: input.guestCount,
    },
  });
}
