"use client";

import { useId, useRef, useState } from "react";
import { ChevronDown, Minus, Plus, Users } from "lucide-react";
import { BOOKING_RULES } from "@/config/resort";
import { choosePlacement, useDismiss, type Placement } from "./lib/hooks";
import { guestError, guestSummary, type Guests } from "./lib/useBookingForm";
import { FieldError } from "./ui";
import { cn } from "./lib/cn";

function Stepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  const labelId = useId();
  const btn =
    "grid size-11 place-items-center rounded-full border border-slate-300 text-slate-700 transition-colors duration-150 hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-300 disabled:hover:text-slate-700";
  return (
    <div role="group" aria-labelledby={labelId} className="flex items-center justify-between gap-4 py-3">
      <div id={labelId}>
        <span className="block text-[15px] font-semibold text-slate-900">{label}</span>
        <span className="block text-xs text-slate-500">{hint}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={btn}
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <Minus className="size-4" aria-hidden />
        </button>
        <output aria-live="polite" className="w-6 text-center text-base font-semibold tabular-nums text-slate-900">
          {value}
        </output>
        <button
          type="button"
          className={btn}
          aria-label={`More ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/** Steppers + child ages. Used inside the popover and inline in the sheet. */
export function GuestFields({ value, onChange }: { value: Guests; onChange: (next: Guests) => void }) {
  const { adults, children, rooms, childAge: ageRange } = BOOKING_RULES;
  const problem = guestError(value);
  // Only the adults-vs-rooms rule is worth flagging live; missing ages are
  // obvious from the empty selects and get reported on search.
  const liveProblem = value.adults < value.rooms ? problem : undefined;
  const ages = Array.from({ length: ageRange.max - ageRange.min + 1 }, (_, i) => ageRange.min + i);

  return (
    <div>
      <div className="divide-y divide-slate-100">
        <Stepper
          label="Adults"
          hint="Ages 18+"
          value={value.adults}
          min={adults.min}
          max={adults.max}
          onChange={(n) => onChange({ ...value, adults: n })}
        />
        <Stepper
          label="Children"
          hint={`Ages ${ageRange.min}–${ageRange.max}`}
          value={value.childAges.length}
          min={children.min}
          max={children.max}
          onChange={(n) =>
            onChange({
              ...value,
              childAges:
                n > value.childAges.length ? [...value.childAges, null] : value.childAges.slice(0, n),
            })
          }
        />
        <Stepper
          label="Rooms"
          hint={`Up to ${rooms.max}`}
          value={value.rooms}
          min={rooms.min}
          max={rooms.max}
          onChange={(n) => onChange({ ...value, rooms: n })}
        />
      </div>

      {value.childAges.length > 0 && (
        <fieldset className="mt-1 border-t border-slate-100 pt-3">
          <legend className="sr-only">Children&apos;s ages</legend>
          <p className="mb-2 text-xs text-slate-500">Age on the check-in date</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {value.childAges.map((age, i) => (
              <label key={i} className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600">Child {i + 1}</span>
                <select
                  value={age ?? ""}
                  aria-invalid={age === null}
                  onChange={(e) => {
                    const next = [...value.childAges];
                    next[i] = e.target.value === "" ? null : Number(e.target.value);
                    onChange({ ...value, childAges: next });
                  }}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900 focus:border-brand focus:ring-2 focus:ring-brand/30 focus:outline-none"
                >
                  <option value="">Age</option>
                  {ages.map((a) => (
                    <option key={a} value={a}>
                      {a === 0 ? "Under 1" : `${a} yr${a === 1 ? "" : "s"}`}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {liveProblem && (
        <p role="status" className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          {liveProblem}
        </p>
      )}
    </div>
  );
}

/** Desktop field: summary trigger + popover with the steppers. */
export default function GuestSelector({
  id,
  value,
  onChange,
  error,
  compact = false,
}: {
  id: string;
  value: Guests;
  onChange: (next: Guests) => void;
  error?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>("bottom");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = `${id}-panel`;
  const errorId = `${id}-error`;

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };
  useDismiss(open, rootRef, (reason) => close(reason === "escape"));

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
        onClick={() => {
          if (!open && rootRef.current) setPlacement(choosePlacement(rootRef.current, 380));
          setOpen((v) => !v);
        }}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl text-left transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          compact ? "min-h-12 px-3 py-1.5" : "min-h-16 px-4 py-2.5",
          error && "ring-2 ring-red-500/70",
        )}
      >
        <Users className="size-5 shrink-0 text-brand" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold tracking-[0.08em] text-slate-500 uppercase">
            Guests &amp; Rooms
          </span>
          <span className="block truncate text-[15px] font-semibold text-slate-900">{guestSummary(value)}</span>
        </span>
        <ChevronDown
          aria-hidden
          className={cn("size-4 shrink-0 text-slate-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <FieldError id={errorId} message={error} />

      <div
        id={panelId}
        role="dialog"
        aria-label="Guests and rooms"
        inert={!open}
        className={cn(
          "absolute left-0 z-[60] w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-5 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5 transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none",
          placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
          open
            ? "visible translate-y-0 opacity-100"
            : cn("invisible opacity-0", placement === "bottom" ? "-translate-y-1" : "translate-y-1"),
        )}
      >
        <GuestFields value={value} onChange={onChange} />
        <button
          type="button"
          onClick={() => close(true)}
          className="mt-4 h-11 w-full rounded-xl bg-brand text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Done
        </button>
      </div>
    </div>
  );
}
