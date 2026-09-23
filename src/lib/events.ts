export type EventFormVariant = "standard" | "extended";

export type Event = {
  slug: string;
  title: string;
  month: string;
  day: string;
  dateLabel: string;
  timeLabel: string;
  location?: string;
  mapQuery?: string;
  googleCalendarUrl: string;
  image: string;
  imageAlt: string;
  isUpcoming: boolean;
  formVariant: EventFormVariant;
  formName: string;
  description?: string[];
  calendarStart?: string;
  calendarEnd?: string;
};

export const standardEventDescription = [
  "At this dinner, participants will get to choose between three different topics, including some current events. Topics range from the political, to the \"slice of life\", to the spiritual, to the philosophical, to the off-the-wall - but no matter which table you choose to sit at, you can be sure it'll be like no dinner conversation you've had before! You can also suggest a topic by emailing us at BreadBreakersInfo@gmail.com.",
  "Food will be provided for free. We'll have vegetarian and gluten-free options available. If you have any additional dietary restrictions (Celiac Disease, vegan, etc.) please let us know at BreadBreakersInfo@gmail.com so that we can implement the appropriate food handling procedures.",
  "Join us, invite a friend, and be a part of the movement to mend our fractured society and normalize a better way of talking with one another.",
] as const;
