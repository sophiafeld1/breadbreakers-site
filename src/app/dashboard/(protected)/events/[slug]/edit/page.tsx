import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import EventEditorForm from "@/components/EventEditorForm";
import { getSession } from "@/lib/auth/server";
import { eventToEditorValues } from "@/lib/event-editor";
import { getEventBySlugFromDb } from "@/lib/events-db";

type EditEventPageProps = PageProps<"/dashboard/events/[slug]/edit">;

export default async function EditEventPage({ params }: EditEventPageProps) {
  const session = await getSession();

  if (session.role !== "master") {
    redirect("/dashboard");
  }

  const { slug } = await params;
  const event = await getEventBySlugFromDb(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/events/${slug}`}
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to RSVPs
        </Link>
        <h2 className="mt-2 text-xl font-semibold text-brown-dark">
          Edit event
        </h2>
        <p className="mt-1 text-brown">{event.title}</p>
      </div>

      <EventEditorForm
        mode="edit"
        currentSlug={slug}
        initialValues={eventToEditorValues(event)}
      />
    </div>
  );
}
