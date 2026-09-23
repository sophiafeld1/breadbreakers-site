import Link from "next/link";
import { getSession } from "@/lib/auth/server";
import { listEventsWithHeadcounts } from "@/lib/events-db";

export default async function DashboardPage() {
  const session = await getSession();
  const isMaster = session.role === "master";
  const events = isMaster ? await listEventsWithHeadcounts("Reston") : [];
  const upcomingEvent = events.find((event) => event.isUpcoming);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h2 className="text-xl font-semibold text-brown-dark">
          Welcome{session.username ? `, ${session.username}` : ""}
        </h2>
        <p className="mt-2 text-brown">
          {isMaster
            ? "You have master access. View event RSVPs, manage users, and track dinner headcounts."
            : "You are signed in to the BreadBreakers internal dashboard."}
        </p>

        {isMaster ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/dashboard/events"
              className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-cream transition hover:opacity-90"
            >
              View Reston events
            </Link>
            <Link
              href="/dashboard/users"
              className="rounded-lg border border-brown/20 px-4 py-2.5 text-sm font-medium text-brown-dark transition hover:bg-brown/5"
            >
              Manage user access
            </Link>
          </div>
        ) : null}
      </section>

      {isMaster && upcomingEvent ? (
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
          <h3 className="font-semibold text-brown-dark">Next Reston event</h3>
          <p className="mt-1 text-brown">{upcomingEvent.dateLabel}</p>
          <p className="mt-3 text-2xl font-semibold text-brand">
            {upcomingEvent.headcount}{" "}
            <span className="text-base font-normal text-brown">
              expected attendees
            </span>
          </p>
          <Link
            href={`/dashboard/events/${upcomingEvent.slug}`}
            className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
          >
            View RSVP list →
          </Link>
        </section>
      ) : null}
    </div>
  );
}
