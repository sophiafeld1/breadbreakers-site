"use client";

import { useState } from "react";
import type { EventFormVariant } from "@/lib/events";

type EventRsvpFormProps = {
  eventTitle: string;
  eventSlug: string;
  formName: string;
  variant: EventFormVariant;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  guestCount: string;
  phone: string;
  dietaryNotes: string;
  firstTime: "" | "Yes" | "No";
  hearAbout: string;
  mailingList: boolean;
};

const hearAboutOptions = {
  standard: [
    "Social Media",
    "Word of Mouth",
    "Event or Conference",
    "meetup.com",
    "Other",
  ],
  extended: [
    "Social Media",
    "Word of Mouth",
    "Event or Conference",
    "Meet-up",
    "Other",
  ],
} as const;

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  guestCount: "0",
  phone: "",
  dietaryNotes: "",
  firstTime: "",
  hearAbout: "",
  mailingList: false,
};

export default function EventRsvpForm({
  eventTitle,
  eventSlug,
  formName,
  variant,
}: EventRsvpFormProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const options = variant === "extended" ? hearAboutOptions.extended : hearAboutOptions.standard;
  const hearAboutLabel =
    variant === "extended" ? "Dropdown" : "How did you hear about us?";

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle,
          eventSlug,
          formName,
          ...form,
          guestCount: Math.max(0, Number(form.guestCount) || 0),
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        configured?: boolean;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Unable to submit form. Please try again later.");
      }

      setStatus("success");
      setMessage(data.message ?? "Thank you!");
      setForm(initialFormState);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit form. Please try again later.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <p className="text-lg font-medium text-brown-dark">{message}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-6 shadow-md md:p-8"
    >
      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-brown-dark">
            <span>
              First Name <span className="text-brown">(required)</span>
            </span>
            <input
              type="text"
              name="firstName"
              required
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              className="rounded-md border border-brown/25 px-3 py-2 text-base text-brown-dark outline-none focus:border-brand"
            />
          </label>

          <label className="grid gap-2 text-sm text-brown-dark">
            <span>Last Name</span>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              className="rounded-md border border-brown/25 px-3 py-2 text-base text-brown-dark outline-none focus:border-brand"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-brown-dark">
          <span>
            Email <span className="text-brown">(required)</span>
          </span>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="rounded-md border border-brown/25 px-3 py-2 text-base text-brown-dark outline-none focus:border-brand"
          />
        </label>

        <label className="grid gap-2 text-sm text-brown-dark">
          <span>How many guests are you bringing?</span>
          <input
            type="number"
            name="guestCount"
            min={0}
            max={20}
            value={form.guestCount}
            onChange={(event) => updateField("guestCount", event.target.value)}
            className="w-full max-w-[8rem] rounded-md border border-brown/25 px-3 py-2 text-base text-brown-dark outline-none focus:border-brand"
          />
          <span className="text-xs text-brown">
            Not including yourself. We use this for a dinner headcount.
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-brown-dark">
          <input
            type="checkbox"
            name="mailingList"
            checked={form.mailingList}
            onChange={(event) => updateField("mailingList", event.target.checked)}
            className="mt-1"
          />
          <span>Sign up for news and updates</span>
        </label>

        {variant === "extended" && (
          <>
            <label className="grid gap-2 text-sm text-brown-dark">
              <span>Phone (if you want get text updates)</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="rounded-md border border-brown/25 px-3 py-2 text-base text-brown-dark outline-none focus:border-brand"
              />
            </label>

            <label className="grid gap-2 text-sm text-brown-dark">
              <span>Dietary Restrictions/Accessibility Notes</span>
              <textarea
                name="dietaryNotes"
                rows={4}
                value={form.dietaryNotes}
                onChange={(event) =>
                  updateField("dietaryNotes", event.target.value)
                }
                className="rounded-md border border-brown/25 px-3 py-2 text-base text-brown-dark outline-none focus:border-brand"
              />
            </label>
          </>
        )}

        <fieldset className="grid gap-3">
          <legend className="text-sm text-brown-dark">
            Will this be your first BreadBreakers event?
          </legend>
          <label className="flex items-center gap-2 text-sm text-brown-dark">
            <input
              type="radio"
              name="firstTime"
              value="Yes"
              checked={form.firstTime === "Yes"}
              onChange={() => updateField("firstTime", "Yes")}
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm text-brown-dark">
            <input
              type="radio"
              name="firstTime"
              value="No"
              checked={form.firstTime === "No"}
              onChange={() => {
                updateField("firstTime", "No");
                updateField("hearAbout", "");
              }}
            />
            No
          </label>
        </fieldset>

        {form.firstTime === "Yes" && (
          <label className="grid gap-2 text-sm text-brown-dark">
            <span>{hearAboutLabel}</span>
            <select
              name="hearAbout"
              value={form.hearAbout}
              onChange={(event) => updateField("hearAbout", event.target.value)}
              className="rounded-md border border-brown/25 px-3 py-2 text-base text-brown-dark outline-none focus:border-brand"
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}

        {status === "error" && (
          <p className="text-sm text-red-700" role="alert">
            {message}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}
