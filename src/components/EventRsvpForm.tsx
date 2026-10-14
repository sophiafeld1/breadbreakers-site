"use client";

import { useEffect, useRef, useState } from "react";
import { links } from "@/lib/site";

type EventRsvpFormProps = {
  eventSlug: string;
};

const embedSrc = `${links.signupForm}?embedded=true`;

export default function EventRsvpForm({ eventSlug }: EventRsvpFormProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const formId = `signup-form-${eventSlug}`;

  useEffect(() => {
    if (!open) {
      return;
    }

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [open]);

  return (
    <div ref={formRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={formId}
        onClick={() => setOpen((current) => !current)}
        className="rounded-full bg-[#c0532a] px-8 py-3 text-base font-bold text-white shadow-md shadow-[#c0532a]/30 transition-all hover:bg-[#a8461f] hover:shadow-lg"
      >
        {open ? "Hide form" : "Sign Up"}
      </button>

      {open ? (
        <div
          id={formId}
          className="mt-6 overflow-hidden rounded-2xl bg-white shadow-md"
        >
          <iframe
            title="BreadBreakers sign up form"
            src={embedSrc}
            className="block h-[1600px] w-full border-0"
          >
            Loading…
          </iframe>
        </div>
      ) : null}
    </div>
  );
}
