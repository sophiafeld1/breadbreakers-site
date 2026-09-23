import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { listEventsWithHeadcounts } from "@/lib/events-db";

export default async function DashboardEventsPage() {
  const session = await getSession();

  if (session.role !== "master") {
    redirect("/dashboard");
  }

  const events = await listEventsWithHeadcounts("Reston");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-brown-dark">Events</h2>
        <p className="mt-1 text-brown">
          RSVP headcounts by chapter. Reston is the only chapter for now.
        </p>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h3 className="text-lg font-semibold text-brown-dark">Reston</h3>

        {events.length === 0 ? (
          <p className="mt-4 text-sm text-brown">
            No events yet. Run <code className="text-brown-dark">npm run db:seed</code>{" "}
            to load events.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-brown/10">
            {events.map((event) => (
              <li key={event.id} className="py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-brown-dark">{event.title}</p>
                    <p className="text-sm text-brown">
                      {event.dateLabel} · {event.timeLabel}
                    </p>
                    {event.venueName ? (
                      <p className="text-sm text-brown">{event.venueName}</p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-brand">
                        {event.headcount}
                      </p>
                      <p className="text-xs text-brown">
                        {event.rsvpCount} RSVP{event.rsvpCount === 1 ? "" : "s"}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/events/${event.slug}`}
                      className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-cream transition hover:opacity-90"
                    >
                      View RSVPs
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
