import Image from "next/image";
import EventRsvpForm from "@/components/EventRsvpForm";
import type { Event } from "@/lib/events";
import { links } from "@/lib/site";

type EventCardProps = {
  event: Event;
};

function DescriptionParagraph({ text }: { text: string }) {
  const parts = text.split(/(BreadBreakersInfo@gmail\.com)/g);

  return (
    <p className="leading-relaxed text-brown-dark">
      {parts.map((part, index) =>
        part === "BreadBreakersInfo@gmail.com" ? (
          <a
            key={index}
            href={links.email}
            className="text-brand underline-offset-2 hover:underline"
          >
            {part}
          </a>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </p>
  );
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="grid gap-8 border-b border-brown/15 pb-12 last:border-b-0 last:pb-0 md:grid-cols-[280px_1fr] md:gap-10">
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden md:aspect-[3/4]">
          <Image
            src={event.image}
            alt={event.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 280px"
          />
        </div>

        <div className="absolute left-4 top-4 min-w-[72px] rounded-md border border-cream/40 bg-brand/95 px-3 py-2 text-center text-cream shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wide">
            {event.month}
          </div>
          <div className="text-3xl font-bold leading-none">{event.day}</div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-brown-dark md:text-4xl">
          {event.title}
        </h2>

        <ul className="mt-4 space-y-2 text-brown">
          <li>{event.dateLabel}</li>
          <li>{event.timeLabel}</li>
          {event.location && (
            <li>
              {event.location}{" "}
              {event.mapQuery && (
                <a
                  href={`http://maps.google.com?q=${encodeURIComponent(event.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand underline-offset-2 hover:underline"
                >
                  (map)
                </a>
              )}
            </li>
          )}
          <li>
            <a
              href={event.googleCalendarUrl}
              target="_blank"
              rel="noreferrer"
              className="text-brand underline-offset-2 hover:underline"
            >
              Google Calendar
            </a>
            <span className="mx-2 text-brown/50">|</span>
            <a
              href={`/api/calendar/${event.slug}`}
              className="text-brand underline-offset-2 hover:underline"
            >
              ICS
            </a>
          </li>
        </ul>

        {event.description && (
          <div className="mt-6 space-y-4">
            {event.description.map((paragraph) => (
              <DescriptionParagraph key={paragraph.slice(0, 40)} text={paragraph} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <EventRsvpForm
            eventTitle={event.title}
            eventSlug={event.slug}
            formName={event.formName}
            variant={event.formVariant}
          />
        </div>
      </div>
    </article>
  );
}
