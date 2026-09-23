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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brown-dark">Events</h2>
          <p className="mt-1 text-brown">
            Manage Reston events and RSVP headcounts. Changes update the public
            site immediately.
          </p>
        </div>

        <Link
          href="/dashboard/events/new"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-cream transition hover:opacity-90"
        >
          Add event
        </Link>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h3 className="text-lg font-semibold text-brown-dark">Reston</h3>

        {events.length === 0 ? (
          <p className="mt-4 text-sm text-brown">
            No events yet.{" "}
            <Link href="/dashboard/events/new" className="text-brand hover:underline">
              Add your first event
            </Link>
            .
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

                  <div className="flex flex-wrap items-center gap-3">
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
                      className="rounded-lg border border-brown/20 px-4 py-2 text-sm font-medium text-brown-dark transition hover:bg-brown/5"
                    >
                      View RSVPs
                    </Link>

                    <Link
                      href={`/dashboard/events/${event.slug}/edit`}
                      className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-cream transition hover:opacity-90"
                    >
                      Edit
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
