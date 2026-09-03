"use client";

import Link from "next/link";
import { useState } from "react";
import type { FaqInlinePart, FaqItem } from "@/lib/faq";
import { links } from "@/lib/site";

function InlinePart({ part }: { part: FaqInlinePart }) {
  switch (part.type) {
    case "text":
      return <>{part.content}</>;
    case "email":
      return (
        <a
          href={links.email}
          className="text-brand underline-offset-2 hover:underline"
        >
          {part.address}
        </a>
      );
    case "link":
      return (
        <a
          href={part.href}
          target="_blank"
          rel="noreferrer"
          className="text-brand underline-offset-2 hover:underline"
        >
          {part.label}
        </a>
      );
    case "internal-link":
      return (
        <Link
          href={part.href}
          className="text-brand underline-offset-2 hover:underline"
        >
          {part.label}
        </Link>
      );
    default:
      return null;
  }
}

function FaqAnswer({ paragraphs }: { paragraphs: FaqInlinePart[][] }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-brown md:text-base">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          {paragraph.map((part, partIndex) => (
            <InlinePart key={partIndex} part={part} />
          ))}
        </p>
      ))}
    </div>
  );
}

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleItem(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <ul className="divide-y divide-brown/20 border-y border-brown/20">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `faq-button-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <li key={item.question}>
            <h2>
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-brown-dark md:text-xl"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(index)}
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`relative h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                >
                  <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-brown-dark" />
                  <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-brown-dark" />
                </span>
              </button>
            </h2>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-5"
            >
              <FaqAnswer paragraphs={item.paragraphs} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
