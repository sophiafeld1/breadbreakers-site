"use client";

import { DateTime } from "luxon";
import { useEffect, useId, useRef, useState } from "react";
import {
  EVENT_TIMEZONE,
  eventDateToFields,
  selectedEventDate,
  type EventDateFields,
} from "@/lib/event-datetime";

type EventDatePickerProps = {
  value: EventDateFields;
  onChange: (value: EventDateFields) => void;
};

type HeaderPicker = "month" | "year" | null;

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const YEAR_RANGE = 10;

function fieldClassName() {
  return "w-full rounded-lg border border-brown/20 bg-white px-3 py-2 text-left text-brown-dark outline-none ring-brand/30 focus:ring-2";
}

function buildMonthOptions(viewMonth: DateTime) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = viewMonth.set({ month: index + 1, day: 1 });
    return {
      value: index + 1,
      label: month.toFormat("MMMM"),
    };
  });
}

function buildYearOptions(viewMonth: DateTime) {
  const center = viewMonth.year;
  return Array.from({ length: YEAR_RANGE * 2 + 1 }, (_, index) => center - YEAR_RANGE + index);
}

export default function EventDatePicker({ value, onChange }: EventDatePickerProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const monthListRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);
  const selected = selectedEventDate(value);
  const [open, setOpen] = useState(false);
  const [headerPicker, setHeaderPicker] = useState<HeaderPicker>(null);
  const [viewMonth, setViewMonth] = useState(() =>
    (selected ?? DateTime.now().setZone(EVENT_TIMEZONE)).startOf("month"),
  );

  useEffect(() => {
    if (selected) {
      setViewMonth(selected.startOf("month"));
    }
  }, [selected?.toISODate()]);

  useEffect(() => {
    if (!open) {
      setHeaderPicker(null);
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHeaderPicker(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (headerPicker) {
          setHeaderPicker(null);
          return;
        }

        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, headerPicker]);

  useEffect(() => {
    if (headerPicker !== "month") {
      return;
    }

    const selectedButton = monthListRef.current?.querySelector(
      '[data-selected="true"]',
    );

    selectedButton?.scrollIntoView({ block: "center" });
  }, [headerPicker, viewMonth.month]);

  useEffect(() => {
    if (headerPicker !== "year") {
      return;
    }

    const selectedButton = yearListRef.current?.querySelector(
      '[data-selected="true"]',
    );

    selectedButton?.scrollIntoView({ block: "center" });
  }, [headerPicker, viewMonth.year]);

  function selectDate(date: DateTime) {
    onChange(eventDateToFields(date));
    setOpen(false);
    setHeaderPicker(null);
  }

  function selectMonth(month: number) {
    setViewMonth((current) => current.set({ month, day: 1 }));
    setHeaderPicker(null);
  }

  function selectYear(year: number) {
    setViewMonth((current) => current.set({ year, day: 1 }));
    setHeaderPicker(null);
  }

  const monthStart = viewMonth.startOf("month");
  const leadingDays = monthStart.weekday % 7;
  const daysInMonth = viewMonth.daysInMonth ?? 31;
  const cells: Array<{ key: string; date: DateTime | null }> = [];

  for (let index = 0; index < leadingDays; index += 1) {
    cells.push({ key: `blank-${index}`, date: null });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = monthStart.set({ day });
    cells.push({ key: date.toISODate() ?? `day-${day}`, date });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `trail-${cells.length}`, date: null });
  }

  const today = DateTime.now().setZone(EVENT_TIMEZONE).startOf("day");
  const displayLabel = selected
    ? selected.toFormat("EEEE, MMMM d, yyyy")
    : "Choose a date";
  const monthOptions = buildMonthOptions(viewMonth);
  const yearOptions = buildYearOptions(viewMonth);

  return (
    <div ref={containerRef} className="relative grid gap-1 text-sm">
      <span className="font-medium text-brown-dark">Event date</span>

      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={`${fieldClassName()} flex items-center justify-between gap-3`}
      >
        <span className={selected ? "text-brown-dark" : "text-brown"}>
          {displayLabel}
        </span>
        <span className="inline-flex min-w-[3rem] flex-col items-center rounded-md border border-cream/40 bg-brand px-2 py-1 text-center text-xs font-semibold text-cream">
          <span className="uppercase tracking-wide">
            {selected ? selected.toFormat("MMM") : "---"}
          </span>
          <span className="text-lg leading-none">
            {selected ? selected.toFormat("d") : "--"}
          </span>
        </span>
      </button>

      <input
        type="text"
        tabIndex={-1}
        aria-hidden
        required
        value={value.dateLabel}
        readOnly
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <span className="text-xs text-brown">
        Shown on the event card and used for the calendar download.
      </span>

      {open ? (
        <div
          id={listboxId}
          role="dialog"
          aria-label="Choose event date"
          className="absolute left-0 top-full z-20 mt-2 w-full min-w-[18rem] max-w-sm rounded-xl border border-brown/15 bg-white p-4 shadow-lg ring-1 ring-brown/10"
        >
          <div className="relative mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => {
                setHeaderPicker(null);
                setViewMonth((current) => current.minus({ months: 1 }));
              }}
              className="rounded-md px-2 py-1 text-brown-dark transition hover:bg-cream"
            >
              ‹
            </button>

            <div className="relative flex items-center justify-center gap-1">
              <button
                type="button"
                aria-expanded={headerPicker === "month"}
                aria-haspopup="listbox"
                onClick={() =>
                  setHeaderPicker((current) =>
                    current === "month" ? null : "month",
                  )
                }
                className="rounded-md px-1.5 py-0.5 text-sm font-semibold text-brown-dark underline decoration-brand/30 underline-offset-2 transition hover:bg-cream hover:decoration-brand"
              >
                {viewMonth.toFormat("MMMM")}
              </button>
              <button
                type="button"
                aria-expanded={headerPicker === "year"}
                aria-haspopup="listbox"
                onClick={() =>
                  setHeaderPicker((current) =>
                    current === "year" ? null : "year",
                  )
                }
                className="rounded-md px-1.5 py-0.5 text-sm font-semibold text-brown-dark underline decoration-brand/30 underline-offset-2 transition hover:bg-cream hover:decoration-brand"
              >
                {viewMonth.toFormat("yyyy")}
              </button>

              {headerPicker === "month" ? (
                <div
                  ref={monthListRef}
                  role="listbox"
                  aria-label="Choose month"
                  className="absolute left-1/2 top-full z-30 mt-1 max-h-44 w-40 -translate-x-1/2 overflow-y-auto rounded-lg border border-brown/15 bg-white py-1 shadow-lg ring-1 ring-brown/10"
                >
                  {monthOptions.map((month) => {
                    const isCurrent = month.value === viewMonth.month;

                    return (
                      <button
                        key={month.value}
                        type="button"
                        role="option"
                        aria-selected={isCurrent}
                        data-selected={isCurrent ? "true" : undefined}
                        onClick={() => selectMonth(month.value)}
                        className={`block w-full px-3 py-2 text-left text-sm transition ${
                          isCurrent
                            ? "bg-brand font-semibold text-cream"
                            : "text-brown-dark hover:bg-cream"
                        }`}
                      >
                        {month.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {headerPicker === "year" ? (
                <div
                  ref={yearListRef}
                  role="listbox"
                  aria-label="Choose year"
                  className="absolute left-1/2 top-full z-30 mt-1 max-h-44 w-28 -translate-x-1/2 overflow-y-auto rounded-lg border border-brown/15 bg-white py-1 shadow-lg ring-1 ring-brown/10"
                >
                  {yearOptions.map((year) => {
                    const isCurrent = year === viewMonth.year;

                    return (
                      <button
                        key={year}
                        type="button"
                        role="option"
                        aria-selected={isCurrent}
                        data-selected={isCurrent ? "true" : undefined}
                        onClick={() => selectYear(year)}
                        className={`block w-full px-3 py-2 text-left text-sm transition ${
                          isCurrent
                            ? "bg-brand font-semibold text-cream"
                            : "text-brown-dark hover:bg-cream"
                        }`}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              aria-label="Next month"
              onClick={() => {
                setHeaderPicker(null);
                setViewMonth((current) => current.plus({ months: 1 }));
              }}
              className="rounded-md px-2 py-1 text-brown-dark transition hover:bg-cream"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-brown">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="py-1">
                {label}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((cell) => {
              if (!cell.date) {
                return <div key={cell.key} aria-hidden className="h-9" />;
              }

              const isSelected =
                selected?.toISODate() === cell.date.toISODate();
              const isToday = today.toISODate() === cell.date.toISODate();

              return (
                <button
                  key={cell.key}
                  type="button"
                  aria-label={cell.date.toFormat("EEEE, MMMM d, yyyy")}
                  aria-pressed={isSelected}
                  onClick={() => selectDate(cell.date!)}
                  className={`h-9 rounded-md text-sm transition ${
                    isSelected
                      ? "bg-brand font-semibold text-cream"
                      : isToday
                        ? "border border-brand/40 text-brown-dark hover:bg-cream"
                        : "text-brown-dark hover:bg-cream"
                  }`}
                >
                  {cell.date.day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
