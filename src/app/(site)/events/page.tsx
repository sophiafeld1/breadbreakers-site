import type { Metadata } from "next";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events | BreadBreakers",
  description: "Upcoming BreadBreakers community dinners in Reston, VA.",
};

export default function EventsPage() {
  const upcomingEvents = events.filter((event) => event.isUpcoming);
  const pastEvents = events.filter((event) => !event.isUpcoming);

  return (
    <>
      <section className="bg-brand px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-center text-3xl font-bold text-cream md:text-4xl">
            Upcoming Reston, VA Events
          </h1>
        </div>
      </section>

      <section className="bg-sand px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-12">
          {upcomingEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}

          {pastEvents.length > 0 && (
            <>
              <hr className="border-brown/20" />
              <div className="space-y-12">
                {pastEvents.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
