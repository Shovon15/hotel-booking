"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, Search, X } from "lucide-react";
import { RESORT } from "@/config/resort";
import { useFocusTrap, useScrollLock } from "./lib/hooks";
import { FieldError } from "./ui";
import { cn } from "./lib/cn";

const BOOKING_ID_PATTERN = /^[A-Z0-9-]{4,20}$/;
/** Bangladeshi mobile: 01XXXXXXXXX, optionally prefixed with +88 / 88. */
const BD_PHONE_PATTERN = /^(?:\+?88)?01[3-9]\d{8}$/;

type Errors = Partial<Record<"bookingId" | "phone", string>>;

export default function MyBookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const [bookingId, setBookingId] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  useFocusTrap(open, panelRef, onClose, firstFieldRef);
  useScrollLock(open);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const id = bookingId.trim().toUpperCase();
    const digits = phone.replace(/[\s-]/g, "");
    const found: Errors = {};
    if (!id) found.bookingId = "Enter your booking ID.";
    else if (!BOOKING_ID_PATTERN.test(id)) found.bookingId = "Booking IDs are 4–20 letters, numbers or dashes.";
    if (!digits) found.phone = "Enter the phone number used for the booking.";
    else if (!BD_PHONE_PATTERN.test(digits)) found.phone = "Enter a valid Bangladeshi mobile number, e.g. 01712345678.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    console.log("[My Booking] Find booking", { bookingId: id, phone: digits });
    setState("loading");
    // Mock lookup — no backend yet.
    window.setTimeout(() => setState("done"), 700);
  };

  return (
    <div
      inert={!open}
      className={cn(
        "fixed inset-0 z-[80] flex items-end justify-center p-0 transition-[visibility] duration-200 sm:items-center sm:p-4",
        open ? "visible" : "invisible",
      )}
    >
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-lenis-prevent
        className={cn(
          "relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl transition-[opacity,transform] duration-200 ease-out focus:outline-none motion-reduce:transition-none sm:rounded-2xl sm:p-7",
          open ? "translate-y-0 opacity-100 sm:scale-100" : "translate-y-4 opacity-0 sm:scale-95",
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="font-resort-serif text-2xl font-semibold text-slate-900">
              My Booking
            </h2>
            <p className="mt-1 text-sm text-slate-500">View or manage an existing reservation.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <form noValidate onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="my-booking-id" className="mb-1.5 block text-sm font-medium text-slate-700">
              Booking ID
            </label>
            <input
              ref={firstFieldRef}
              id="my-booking-id"
              value={bookingId}
              onChange={(e) => {
                setBookingId(e.target.value);
                setErrors((p) => ({ ...p, bookingId: undefined }));
                setState("idle");
              }}
              placeholder="e.g. RS-24816"
              autoComplete="off"
              aria-invalid={Boolean(errors.bookingId)}
              aria-describedby={errors.bookingId ? "my-booking-id-error" : undefined}
              className={cn(
                "h-12 w-full rounded-xl border px-4 text-[15px] uppercase placeholder:normal-case focus:ring-2 focus:outline-none",
                errors.bookingId ? "border-red-400 focus:ring-red-500/30" : "border-slate-300 focus:border-brand focus:ring-brand/30",
              )}
            />
            <FieldError id="my-booking-id-error" message={errors.bookingId} />
          </div>
          <div>
            <label htmlFor="my-booking-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
              Phone number
            </label>
            <input
              id="my-booking-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((p) => ({ ...p, phone: undefined }));
                setState("idle");
              }}
              placeholder="01XXXXXXXXX"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "my-booking-phone-error" : undefined}
              className={cn(
                "h-12 w-full rounded-xl border px-4 text-[15px] focus:ring-2 focus:outline-none",
                errors.phone ? "border-red-400 focus:ring-red-500/30" : "border-slate-300 focus:border-brand focus:ring-brand/30",
              )}
            />
            <FieldError id="my-booking-phone-error" message={errors.phone} />
          </div>

          <button
            type="submit"
            disabled={state === "loading"}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-70"
          >
            {state === "loading" ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden />
            ) : (
              <Search className="size-5" aria-hidden />
            )}
            {state === "loading" ? "Looking up…" : "Find Booking"}
          </button>

          <p role="status" aria-live="polite" className="min-h-5 text-sm text-slate-600">
            {state === "done" && (
              <>
                We couldn&apos;t find that booking (demo — no backend). Call{" "}
                <a href={`tel:${RESORT.phoneTel}`} className="font-semibold text-brand underline-offset-2 hover:underline">
                  {RESORT.phoneDisplay}
                </a>{" "}
                for help.
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
