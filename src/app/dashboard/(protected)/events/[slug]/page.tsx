import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { getEventWithRsvps } from "@/lib/events-db";

type EventDetailPageProps = PageProps<"/dashboard/events/[slug]">;

export default async function DashboardEventDetailPage({
  params,
}: EventDetailPageProps) {
  const session = await getSession();

  if (session.role !== "master") {
    redirect("/dashboard");
  }

  const { slug } = await params;
  const event = await getEventWithRsvps(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/events"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to events
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold text-brown-dark">{event.title}</h2>
          <Link
            href={`/dashboard/events/${slug}/edit`}
            className="rounded-lg border border-brown/20 px-3 py-1.5 text-sm font-medium text-brown-dark transition hover:bg-brown/5"
          >
            Edit event
          </Link>
        </div>
        <p className="mt-1 text-brown">
          {event.dateLabel} · {event.timeLabel}
        </p>
        {event.venueName ? (
          <p className="text-sm text-brown">{event.venueName}</p>
        ) : null}
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brown">
              Total headcount
            </p>
            <p className="text-3xl font-semibold text-brand">{event.headcount}</p>
          </div>
          <p className="text-sm text-brown">
            {event.rsvps.length} RSVP{event.rsvps.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h3 className="text-lg font-semibold text-brown-dark">RSVPs</h3>

        {event.rsvps.length === 0 ? (
          <p className="mt-4 text-sm text-brown">No RSVPs yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brown/10 text-brown">
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Phone</th>
                  <th className="px-3 py-2 font-medium">Guests</th>
                  <th className="px-3 py-2 font-medium">Headcount</th>
                  <th className="px-3 py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {event.rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-brown/5">
                    <td className="px-3 py-3 text-brown-dark">
                      {[rsvp.firstName, rsvp.lastName].filter(Boolean).join(" ")}
                    </td>
                    <td className="px-3 py-3 text-brown">{rsvp.email}</td>
                    <td className="px-3 py-3 text-brown">{rsvp.phone ?? "—"}</td>
                    <td className="px-3 py-3 text-brown">{rsvp.guestCount}</td>
                    <td className="px-3 py-3 font-medium text-brown-dark">
                      {rsvp.headcount}
                    </td>
                    <td className="max-w-xs px-3 py-3 text-brown">
                      {[rsvp.dietaryNotes, rsvp.mailingList ? "Mailing list" : null]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
