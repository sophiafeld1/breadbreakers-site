import Link from "next/link";
import { redirect } from "next/navigation";
import EventEditorForm from "@/components/EventEditorForm";
import { getSession } from "@/lib/auth/server";

export default async function NewEventPage() {
  const session = await getSession();

  if (session.role !== "master") {
    redirect("/dashboard");
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
        <h2 className="mt-2 text-xl font-semibold text-brown-dark">
          Add event
        </h2>
        <p className="mt-1 text-brown">
          Creates a new Reston event in Postgres. It will appear on the public
          events page after you save.
        </p>
      </div>

      <EventEditorForm mode="create" />
    </div>
  );
}
