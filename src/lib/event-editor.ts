import { scheduleToCalendarFields } from "@/lib/event-datetime";

export type EventEditorValues = {
  slug: string;
  chapter: string;
  title: string;
  month: string;
  day: string;
  dateLabel: string;
  timeLabel: string;
  venueName: string;
  mapQuery: string;
  googleCalendarUrl: string;
  image: string;
  imageAlt: string;
  isUpcoming: boolean;
  formName: string;
  descriptionText: string;
};

export function descriptionToText(description?: string[] | null): string {
  if (!description?.length) {
    return "";
  }

  return description.join("\n\n");
}

export function textToDescription(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export const emptyEventEditorValues: EventEditorValues = {
  slug: "",
  chapter: "Reston",
  title: "BreadBreakers Community Dinner",
  month: "",
  day: "",
  dateLabel: "",
  timeLabel: "6:30 PM – 8:30 PM",
  venueName: "Reston Community Center Lake Anne",
  mapQuery:
    "1609-A Washington Plaza North Reston, Virginia, 20190 United States",
  googleCalendarUrl: "",
  image: "",
  imageAlt: "BreadBreakers Community Dinner",
  isUpcoming: true,
  formName: "",
  descriptionText: "",
};

export function eventToEditorValues(event: {
  slug: string;
  chapter: string;
  title: string;
  month: string;
  day: string;
  dateLabel: string;
  timeLabel: string;
  venueName: string | null;
  mapQuery: string | null;
  googleCalendarUrl: string | null;
  image: string;
  imageAlt: string;
  isUpcoming: boolean;
  formName: string;
  description: unknown;
}): EventEditorValues {
  const description = Array.isArray(event.description)
    ? event.description.filter((item): item is string => typeof item === "string")
    : undefined;

  return {
    slug: event.slug,
    chapter: event.chapter,
    title: event.title,
    month: event.month,
    day: event.day,
    dateLabel: event.dateLabel,
    timeLabel: event.timeLabel,
    venueName: event.venueName ?? "",
    mapQuery: event.mapQuery ?? "",
    googleCalendarUrl: event.googleCalendarUrl ?? "",
    image: event.image,
    imageAlt: event.imageAlt,
    isUpcoming: event.isUpcoming,
    formName: event.formName,
    descriptionText: descriptionToText(description),
  };
}

export function editorValuesToCalendarFields(values: EventEditorValues): {
  calendarStart: string;
  calendarEnd: string;
} {
  return scheduleToCalendarFields({
    dateLabel: values.dateLabel,
    timeLabel: values.timeLabel,
  });
}

export function parseEventEditorPayload(
  payload: Partial<EventEditorValues>,
): { data: EventEditorValues; error?: string } {
  const values: EventEditorValues = {
    slug: slugify(payload.slug ?? ""),
    chapter: payload.chapter?.trim() || "Reston",
    title: payload.title?.trim() ?? "",
    month: payload.month?.trim() ?? "",
    day: payload.day?.trim() ?? "",
    dateLabel: payload.dateLabel?.trim() ?? "",
    timeLabel: payload.timeLabel?.trim() ?? "",
    venueName: payload.venueName?.trim() ?? "",
    mapQuery: payload.mapQuery?.trim() ?? "",
    googleCalendarUrl: payload.googleCalendarUrl?.trim() ?? "",
    image: payload.image?.trim() ?? "",
    imageAlt: payload.imageAlt?.trim() || "BreadBreakers Community Dinner",
    isUpcoming: Boolean(payload.isUpcoming),
    formName: payload.formName?.trim() ?? "",
    descriptionText: payload.descriptionText ?? "",
  };

  if (!values.title) {
    return { data: values, error: "Title is required." };
  }

  if (!values.slug || !isValidSlug(values.slug)) {
    return {
      data: values,
      error:
        "Link name is required and can only use lowercase letters, numbers, and hyphens.",
    };
  }

  if (!values.month || !values.day || !values.dateLabel || !values.timeLabel) {
    return { data: values, error: "Date fields are required." };
  }

  if (!values.formName) {
    return { data: values, error: "RSVP form name is required." };
  }

  if (!values.image) {
    return { data: values, error: "Event photo is required." };
  }

  const { calendarStart, calendarEnd } = editorValuesToCalendarFields(values);

  if (!calendarStart || !calendarEnd) {
    return {
      data: values,
      error:
        'Time must be a range on one day, like "6:30 PM – 8:30 PM", and date must look like "Thursday, July 30, 2026".',
    };
  }

  return { data: values };
}
