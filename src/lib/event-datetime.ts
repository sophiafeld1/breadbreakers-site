import { DateTime } from "luxon";

export const EVENT_TIMEZONE = "America/New_York";

export type EventDateFields = {
  month: string;
  day: string;
  dateLabel: string;
};

export function parseEventDateLabel(dateLabel: string): DateTime | null {
  if (!dateLabel.trim()) {
    return null;
  }

  const parsed = DateTime.fromFormat(
    dateLabel.trim(),
    "EEEE, MMMM d, yyyy",
    { zone: EVENT_TIMEZONE },
  );

  return parsed.isValid ? parsed : null;
}

export function eventDateToFields(date: DateTime): EventDateFields {
  return {
    month: date.toFormat("MMM"),
    day: date.toFormat("d"),
    dateLabel: date.toFormat("EEEE, MMMM d, yyyy"),
  };
}

export function selectedEventDate(fields: EventDateFields): DateTime | null {
  return parseEventDateLabel(fields.dateLabel);
}

const TIME_RANGE_PATTERN =
  /(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s*[–-]\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/i;

function parseTimeOnDate(date: DateTime, timeStr: string): DateTime | null {
  const normalized = timeStr.trim().replace(/\s+/g, " ");
  const datePart = date.toFormat("yyyy-MM-dd");

  const withMinutes = DateTime.fromFormat(
    `${datePart} ${normalized}`,
    "yyyy-MM-dd h:mm a",
    { zone: EVENT_TIMEZONE },
  );

  if (withMinutes.isValid) {
    return withMinutes;
  }

  const withoutMinutes = DateTime.fromFormat(
    `${datePart} ${normalized}`,
    "yyyy-MM-dd h a",
    { zone: EVENT_TIMEZONE },
  );

  return withoutMinutes.isValid ? withoutMinutes : null;
}

function toCalendarValue(eastern: DateTime): string {
  return eastern.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
}

export function scheduleToCalendarFields(input: {
  dateLabel: string;
  timeLabel: string;
}): { calendarStart: string; calendarEnd: string } {
  const date = DateTime.fromFormat(input.dateLabel.trim(), "EEEE, MMMM d, yyyy", {
    zone: EVENT_TIMEZONE,
  });

  if (!date.isValid) {
    return { calendarStart: "", calendarEnd: "" };
  }

  const match = input.timeLabel.match(TIME_RANGE_PATTERN);

  if (!match) {
    return { calendarStart: "", calendarEnd: "" };
  }

  const start = parseTimeOnDate(date, match[1]);
  const end = parseTimeOnDate(date, match[2]);

  if (!start || !end || end <= start) {
    return { calendarStart: "", calendarEnd: "" };
  }

  return {
    calendarStart: toCalendarValue(start),
    calendarEnd: toCalendarValue(end),
  };
}
