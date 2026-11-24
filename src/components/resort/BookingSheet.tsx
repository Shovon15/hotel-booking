"use client";

import { useId, useRef, useSyncExternalStore, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useFocusTrap, useScrollLock } from "./lib/hooks";
import type { BookingForm } from "./lib/useBookingForm";
import DateRangePicker from "./DateRangePicker";
import { GuestFields } from "./GuestSelector";
import PromoField from "./PromoField";
import { FieldError } from "./ui";
import { focusFirstError } from "./lib/focusFirstError";
import { cn } from "./lib/cn";

const subscribeNothing = () => () => {};

/** Mobile: full-screen bottom sheet with every booking field stacked. */
export default function BookingSheet({
  open,
  onClose,
  form,
}: {
  open: boolean;
  onClose: () => void;
  form: BookingForm;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dateTriggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Rendered into <body> so no ancestor stacking context (the hero) can put
  // the header or the bottom bar on top of it.
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);

  useFocusTrap(open, panelRef, onClose, dateTriggerRef);
  useScrollLock(open);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { payload, errors } = form.submit();
    if (payload) onClose();
    else focusFirstError(errors, "sheet");
  };

  if (!mounted) return null;

  return createPortal(
    <div
      inert={!open}
      className={cn("fixed inset-0 z-[75] md:hidden transition-[visibility] duration-250", open ? "visible" : "invisible")}
    >
      <div
        aria-hidden
        onClick={onClose}
        className={cn("absolute inset-0 bg-slate-950/50 transition-opacity duration-250", open ? "opacity-100" : "opacity-0")}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute inset-x-0 bottom-0 flex h-[100dvh] flex-col bg-white transition-transform duration-250 ease-out focus:outline-none motion-reduce:transition-none",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 pr-2 pl-5">
          <h2 id={titleId} className="font-resort-serif text-xl font-semibold text-slate-900">
            Find your stay
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid size-11 place-items-center rounded-full text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <form noValidate onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div data-lenis-prevent className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5">
            <section aria-label="Dates">
              <DateRangePicker
                id="sheet-dates"
                variant="inline"
                value={form.range}
                onChange={form.setRange}
                today={form.today}
                error={form.errors.dates}
                triggerRef={dateTriggerRef}
              />
            </section>

            <section aria-labelledby="sheet-guests-title">
              <h3
                id="sheet-guests-title"
                className="mb-1 text-[11px] font-semibold tracking-[0.08em] text-slate-500 uppercase"
              >
                Guests &amp; Rooms
              </h3>
              <GuestFields value={form.guests} onChange={form.setGuests} />
              <FieldError id="sheet-guests-error" message={form.errors.guests} />
            </section>

            <section aria-label="Promo code" className="-mx-2">
              <PromoField
                id="sheet-promo"
                value={form.promo}
                onChange={form.setPromo}
                open={form.promoOpen}
                onOpenChange={form.setPromoOpen}
                error={form.errors.promo}
              />
            </section>
          </div>

          <div className="shrink-0 border-t border-slate-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="submit"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-sand text-base font-bold text-brand-dark shadow-[0_10px_24px_-10px_rgba(191,146,67,0.9)] transition-colors hover:bg-sand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <Search className="size-5" aria-hidden />
              Check Availability
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
