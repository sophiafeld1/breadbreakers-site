"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  emptyEventEditorValues,
  slugify,
  type EventEditorValues,
} from "@/lib/event-editor";
import EventDatePicker from "@/components/EventDatePicker";
import { standardEventDescription } from "@/lib/events";

type EventEditorFormProps = {
  mode: "create" | "edit";
  initialValues?: EventEditorValues;
  currentSlug?: string;
};

function fieldClassName() {
  return "w-full rounded-lg border border-brown/20 bg-white px-3 py-2 text-brown-dark outline-none ring-brand/30 focus:ring-2";
}

export default function EventEditorForm({
  mode,
  initialValues,
  currentSlug,
}: EventEditorFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<EventEditorValues>(
    initialValues ?? {
      ...emptyEventEditorValues,
      descriptionText: standardEventDescription.join("\n\n"),
    },
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  function updateField<K extends keyof EventEditorValues>(
    key: K,
    value: EventEditorValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/dashboard/events/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        message?: string;
        url?: string;
      };

      if (!response.ok || !data.url) {
        setError(data.message ?? "Unable to upload photo.");
        return;
      }

      updateField("image", data.url);
    } catch {
      setError("Unable to upload photo.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url =
        mode === "create"
          ? "/api/dashboard/events"
          : `/api/dashboard/events/${currentSlug}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as {
        message?: string;
        event?: { slug: string };
      };

      if (!response.ok) {
        setError(data.message ?? "Unable to save event.");
        return;
      }

      router.push(`/dashboard/events/${data.event?.slug ?? values.slug}`);
      router.refresh();
    } catch {
      setError("Unable to save event.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (mode !== "edit" || !currentSlug) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${values.title}"? This removes the event and all RSVPs.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/dashboard/events/${currentSlug}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Unable to delete event.");
        return;
      }

      router.push("/dashboard/events");
      router.refresh();
    } catch {
      setError("Unable to delete event.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h3 className="text-lg font-semibold text-brown-dark">Basics</h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 grid gap-1 text-sm">
            <span className="font-medium text-brown-dark">Title</span>
            <input
              required
              value={values.title}
              onChange={(event) => {
                const title = event.target.value;
                updateField("title", title);
                if (mode === "create" && !values.slug) {
                  updateField("slug", slugify(title));
                }
              }}
              className={fieldClassName()}
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-brown-dark">Link name</span>
            <input
              required
              value={values.slug}
              onChange={(event) =>
                updateField("slug", slugify(event.target.value))
              }
              className={fieldClassName()}
            />
            <span className="text-xs text-brown">
              A short name for this event&apos;s web address, like{" "}
              {values.slug || "july-30-2026"}.
            </span>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-brown-dark">Community</span>
            <input
              required
              value={values.chapter}
              onChange={(event) => updateField("chapter", event.target.value)}
              className={fieldClassName()}
            />
          </label>

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={values.isUpcoming}
              onChange={(event) =>
                updateField("isUpcoming", event.target.checked)
              }
            />
            <span className="text-brown-dark">Show as upcoming on the public site</span>
          </label>
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h3 className="text-lg font-semibold text-brown-dark">Date & time</h3>

        <div className="mt-4 grid gap-4">
          <EventDatePicker
            value={{
              month: values.month,
              day: values.day,
              dateLabel: values.dateLabel,
            }}
            onChange={(dateFields) =>
              setValues((current) => ({ ...current, ...dateFields }))
            }
          />

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-brown-dark">Time</span>
            <input
              required
              value={values.timeLabel}
              onChange={(event) => updateField("timeLabel", event.target.value)}
              placeholder="6:30 PM – 8:30 PM"
              className={fieldClassName()}
            />
            <span className="text-xs text-brown">
              Start and end on the same day. Also used for the calendar download.
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h3 className="text-lg font-semibold text-brown-dark">Location & links</h3>

        <div className="mt-4 grid gap-4">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-brown-dark">Venue name</span>
            <input
              value={values.venueName}
              onChange={(event) => updateField("venueName", event.target.value)}
              className={fieldClassName()}
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-brown-dark">Address for map link</span>
            <input
              value={values.mapQuery}
              onChange={(event) => updateField("mapQuery", event.target.value)}
              className={fieldClassName()}
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-brown-dark">Google Calendar URL</span>
            <input
              value={values.googleCalendarUrl}
              onChange={(event) =>
                updateField("googleCalendarUrl", event.target.value)
              }
              className={fieldClassName()}
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h3 className="text-lg font-semibold text-brown-dark">Page content</h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 text-sm">
            <span className="font-medium text-brown-dark">Event photo</span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center rounded-lg border border-brown/20 bg-cream px-4 py-2 text-sm font-medium text-brown-dark transition hover:bg-white">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploading || saving}
                  className="sr-only"
                />
                {uploading ? "Uploading…" : "Choose photo"}
              </label>
              {values.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.image}
                    alt="Event photo preview"
                    className="h-16 w-16 rounded-md object-cover ring-1 ring-brown/10"
                  />
                  <button
                    type="button"
                    onClick={() => updateField("image", "")}
                    disabled={uploading || saving}
                    className="text-xs text-brown underline-offset-2 hover:underline disabled:opacity-60"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <span className="text-xs text-brown">No photo selected yet.</span>
              )}
            </div>
            <span className="text-xs text-brown">
              JPEG, PNG, WebP, or GIF up to 5 MB.
            </span>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-brown-dark">Photo description</span>
            <input
              required
              value={values.imageAlt}
              onChange={(event) => updateField("imageAlt", event.target.value)}
              className={fieldClassName()}
            />
          </label>

          <label className="sm:col-span-2 grid gap-1 text-sm">
            <span className="font-medium text-brown-dark">Description</span>
            <textarea
              rows={8}
              value={values.descriptionText}
              onChange={(event) =>
                updateField("descriptionText", event.target.value)
              }
              className={fieldClassName()}
            />
            <span className="text-xs text-brown">
              Separate paragraphs with a blank line.
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h3 className="text-lg font-semibold text-brown-dark">RSVP form</h3>

        <div className="mt-4 grid gap-4">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-brown-dark">RSVP name</span>
            <input
              required
              value={values.formName}
              onChange={(event) => updateField("formName", event.target.value)}
              placeholder="RSVP BB 07/30"
              className={fieldClassName()}
            />
            <span className="text-xs text-brown">
              Used in RSVP emails so you know which event someone signed up for.
            </span>
          </label>
        </div>
      </section>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving || deleting}
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-cream transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : mode === "create" ? "Create event" : "Update event"}
        </button>

        {mode === "edit" ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete event"}
          </button>
        ) : null}
      </div>
    </form>
  );
}
