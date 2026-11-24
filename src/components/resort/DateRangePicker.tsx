"use client";

import { useRef, useState, type Ref } from "react";
import { DayPicker, type Matcher } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import { BOOKING_RULES } from "@/config/resort";
import { addDays, formatShortDate, nightsBetween, plural } from "./lib/format";
import { choosePlacement, useDismiss, type Placement } from "./lib/hooks";
import type { DateRange } from "./lib/useBookingForm";
import { FieldError } from "./ui";
import { cn } from "./lib/cn";

type Draft = { from: Date };

/** Approximate height of the two-month popover, used to pick a side. */
const CALENDAR_HEIGHT = 430;

/**
 * One picker for check-in → check-out.
 * - popover: desktop bar (two months, closes once the range is complete)
 * - inline: mobile sheet (one month, expands in place)
 */
export default function DateRangePicker({
  id,
  value,
  onChange,
  today,
  variant,
  error,
  triggerRef,
  highlight = false,
  compact = false,
}: {
  id: string;
  value: DateRange | null;
  onChange: (range: DateRange) => void;
  /** null while server rendering. */
  today: Date | null;
  variant: "popover" | "inline";
  error?: string;
  triggerRef?: Ref<HTMLButtonElement>;
  /** Briefly ring the field (after "Book Now"). */
  highlight?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  // Check-in picked, waiting for check-out. Abandoned if the picker closes.
  const [draft, setDraft] = useState<Draft | null>(null);
  // Open upward when the calendar would run off the bottom of the screen.
  const [placement, setPlacement] = useState<Placement>("bottom");
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { minStayNights } = BOOKING_RULES;

  const close = (returnFocus: boolean) => {
    setOpen(false);
    setDraft(null);
    if (returnFocus) document.getElementById(`${id}-trigger`)?.focus();
  };

  useDismiss(open && variant === "popover", rootRef, (reason) => close(reason === "escape"));

  const toggle = () => {
    if (open) {
      close(false);
      return;
    }
    if (variant === "popover" && rootRef.current) {
      setPlacement(choosePlacement(rootRef.current, CALENDAR_HEIGHT));
    }
    setOpen(true);
    // Move keyboard focus onto the calendar's focus target day.
    requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>('.rdp-day_button[tabindex="0"]')?.focus(),
    );
  };

  const onDayClick = (day: Date) => {
    if (!draft || day <= draft.from) {
      setDraft({ from: day });
      return;
    }
    onChange({ from: draft.from, to: day });
    close(true);
  };

  const disabled: Matcher[] = [];
  if (today) disabled.push({ before: today });
  if (draft && minStayNights > 1) {
    // Check-out must be at least minStayNights after check-in.
    disabled.push({ after: draft.from, before: addDays(draft.from, minStayNights) });
  }

  const nights = value ? nightsBetween(value.from, value.to) : 0;
  const summary = draft
    ? `${formatShortDate(draft.from)} → Select check-out`
    : value
      ? `${formatShortDate(value.from)} → ${formatShortDate(value.to)} · ${plural(nights, "night", "nights")}`
      : "Select dates";

  const panelId = `${id}-calendar`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const calendar = (
    <div ref={panelRef} className="resort-rdp">
      <p id={hintId} className="mb-2 px-1 pr-10 text-sm font-medium text-slate-600" aria-live="polite">
        {draft ? "Now select your check-out date" : "Select your check-in date"}
        {minStayNights > 1 && (
          <span className="text-slate-400"> · minimum {plural(minStayNights, "night", "nights")}</span>
        )}
      </p>
      <DayPicker
        mode="range"
        selected={draft ? { from: draft.from, to: undefined } : value ?? undefined}
        onSelect={(_, day) => onDayClick(day)}
        disabled={disabled}
        defaultMonth={value?.from ?? today ?? undefined}
        startMonth={today ?? undefined}
        numberOfMonths={variant === "popover" ? 2 : 1}
        showOutsideDays={false}
      />
    </div>
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-describedby={error ? errorId : undefined}
        onClick={toggle}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl text-left transition-[background-color,box-shadow] duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          compact ? "min-h-12 px-3 py-1.5" : "min-h-16 px-4 py-2.5",
          variant === "inline" && "bg-slate-50 ring-1 ring-slate-200",
          error && "ring-2 ring-red-500/70",
          highlight && "ring-4 ring-sand/70",
        )}
      >
        <CalendarDays className="size-5 shrink-0 text-brand" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold tracking-[0.08em] text-slate-500 uppercase">
            Check-in → Check-out
          </span>
          <span className="block truncate text-[15px] font-semibold text-slate-900">{summary}</span>
        </span>
        <ChevronDown
          aria-hidden
          className={cn("size-4 shrink-0 text-slate-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <FieldError id={errorId} message={error} />

      {variant === "popover" ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Choose check-in and check-out dates"
          inert={!open}
          className={cn(
            // w-max: size to both months side by side, not to the narrow date cell.
            "absolute left-0 z-[60] w-max max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-4 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5 transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none",
            placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
            open
              ? "visible translate-y-0 opacity-100"
              : cn("invisible opacity-0", placement === "bottom" ? "-translate-y-1" : "translate-y-1"),
          )}
        >
          <button
            type="button"
            onClick={() => close(true)}
            aria-label="Close calendar"
            className="absolute top-2 right-2 grid size-9 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="size-4" aria-hidden />
          </button>
          {calendar}
          <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-600">
              {draft ? `Check-in ${formatShortDate(draft.from)}` : value ? summary : "No dates selected"}
            </p>
            <button
              type="button"
              onClick={() => close(true)}
              className="h-10 rounded-lg bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              {draft ? "Cancel" : "Done"}
            </button>
          </div>
        </div>
      ) : (
        <div
          id={panelId}
          role="group"
          aria-label="Choose check-in and check-out dates"
          inert={!open}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="pt-3">{calendar}</div>
          </div>
        </div>
      )}
    </div>
  );
}
