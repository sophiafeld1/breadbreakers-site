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
};

const standardDescription = [
  "At this dinner, participants will get to choose between three different topics, including some current events. Topics range from the political, to the \"slice of life\", to the spiritual, to the philosophical, to the off-the-wall - but no matter which table you choose to sit at, you can be sure it'll be like no dinner conversation you've had before! You can also suggest a topic by emailing us at BreadBreakersInfo@gmail.com.",
  "Food will be provided for free. We'll have vegetarian and gluten-free options available. If you have any additional dietary restrictions (Celiac Disease, vegan, etc.) please let us know at BreadBreakersInfo@gmail.com so that we can implement the appropriate food handling procedures.",
  "Join us, invite a friend, and be a part of the movement to mend our fractured society and normalize a better way of talking with one another.",
];

export const events: Event[] = [
  {
    slug: "july-30-2026",
    title: "BreadBreakers Community Dinner",
    month: "Jul",
    day: "30",
    dateLabel: "Thursday, July 30, 2026",
    timeLabel: "6:30 PM – 8:30 PM",
    location: "Reston Community Center Lake Anne",
    mapQuery:
      "1609-A Washington Plaza North Reston, Virginia, 20190 United States",
    googleCalendarUrl:
      "http://www.google.com/calendar/event?action=TEMPLATE&text=BreadBreakers%20Community%20Dinner&dates=20260730T223000Z/20260731T003000Z&location=1609-A%20Washington%20Plaza%20North%2C%20Reston%2C%20Virginia%2C%2020190%2C%20United%20States",
    image: "/DSC00573.jpg",
    imageAlt: "BreadBreakers Community Dinner",
    isUpcoming: true,
    formVariant: "standard",
    formName: "RSVP BB 07/30",
    description: [
      "This dinner in particular will be very special as we celebrate America's 250th birthday. How better to honor a semiquincentennial of democracy that spending an evening practicing it?",
      ...standardDescription,
    ],
  },
  {
    slug: "june-24-2026",
    title: "BreadBreakers Community Dinner",
    month: "Jun",
    day: "24",
    dateLabel: "Wednesday, June 24, 2026",
    timeLabel: "6:30 PM – 8:30 PM",
    location: "Reston Community Center Lake Anne",
    mapQuery: "1609-A Washington Plaza N Reston VA 20190",
    googleCalendarUrl:
      "http://www.google.com/calendar/event?action=TEMPLATE&text=BreadBreakers%20Community%20Dinner&dates=20260624T223000Z/20260625T003000Z&location=1609-A%20Washington%20Plaza%20N%2C%20Reston%20VA%2020190",
    image: "/DSC00573.jpg",
    imageAlt: "BreadBreakers Community Dinner",
    isUpcoming: false,
    formVariant: "standard",
    formName: "RSVP BB 6/24",
    description: standardDescription,
  },
  {
    slug: "may-28-2026",
    title: "BreadBreakers Community Dinner",
    month: "May",
    day: "28",
    dateLabel: "Thursday, May 28, 2026",
    timeLabel: "6:30 PM – 8:30 PM",
    googleCalendarUrl:
      "http://www.google.com/calendar/event?action=TEMPLATE&text=BreadBreakers%20Community%20Dinner&dates=20260528T223000Z/20260529T003000Z",
    image: "/unsplash-image.jpg",
    imageAlt: "BreadBreakers Community Dinner",
    isUpcoming: false,
    formVariant: "extended",
    formName: "May 28th Dinner",
  },
];

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((event) => event.slug === slug);
}
