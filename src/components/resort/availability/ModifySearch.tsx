"use client";

import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Loader2, Pencil, Search, Tag, Users, X, type LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import DateRangePicker from "../DateRangePicker";
import { GuestFields } from "../GuestSelector";
import PromoField from "../PromoField";
import { FieldError } from "../ui";
import { cn } from "../lib/cn";
import { formatShortDate, fromISODate, plural } from "../lib/format";
import { useFocusTrap, useScrollLock } from "../lib/hooks";
import { focusFirstError } from "../lib/focusFirstError";
import { guestSummary, useBookingForm } from "../lib/useBookingForm";
import type { AvailabilitySearch } from "../lib/availability";

const subscribeNothing = () => () => {};
type Section = "dates" | "guests";

function Pill({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
    >
      <Icon className="size-5 shrink-0 text-sand" aria-hidden />
      <span className="min-w-0">
        <span className="block text-xs text-white/65">{label}</span>
        <span className="block truncate text-sm font-semibold text-white">
          {value}
          <Pencil
            className="ml-1.5 inline size-3.5 align-[-2px] text-white/0 transition-colors group-hover:text-white/70 group-focus-visible:text-white/70"
            aria-hidden
          />
        </span>
      </span>
    </button>
  );
}

/**
 * Banner search summary on /availability. Each pill (and "Modify search")
 * opens a modal to change dates / guests / promo; saving updates the URL
 * (?checkIn=…&checkOut=…&adults=…&rooms=…), which re-runs the search.
 */
export default function ModifySearch({ search }: { search: AvailabilitySearch }) {
  const form = useBookingForm({
    range:
      search.checkIn && search.checkOut
        ? { from: fromISODate(search.checkIn), to: fromISODate(search.checkOut) }
        : null,
    guests: { adults: search.adults, childAges: search.children, rooms: search.rooms },
    promo: search.promoCode ?? "",
  });
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { isMobile } = useIsMobile();
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);

  const panelRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLElement>(null);
  const initialFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useFocusTrap(open, panelRef, () => setOpen(false), initialFocus);
  useScrollLock(open);

  const openAt = (section: Section) => {
    initialFocus.current =
      section === "guests"
        ? (guestsRef.current?.querySelector<HTMLElement>("button:not([disabled]), select") ?? null)
        : document.getElementById("modify-dates-trigger");
    setOpen(true);
    if (section === "guests") {
      requestAnimationFrame(() => guestsRef.current?.scrollIntoView({ block: "center" }));
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const { payload, errors } = form.submit(); // pushes the new /availability URL
      if (!payload) {
        focusFirstError(errors, "modify");
        return;
      }
      // Part of the transition: the modal closes once the new results are in.
      setOpen(false);
    });
  };

  const guests = search.adults + search.children.length;
  const dateLabel =
    search.checkIn && search.checkOut
      ? `${formatShortDate(fromISODate(search.checkIn))} – ${formatShortDate(fromISODate(search.checkOut))} · ${plural(search.nights, "night", "nights")}`
      : "Add dates";

  return (
    <>
      <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 flex-wrap gap-1 sm:gap-4">
          <Pill icon={CalendarDays} label="Dates" value={dateLabel} onClick={() => openAt("dates")} />
          <Pill
            icon={Users}
            label="Guests"
            value={`${plural(guests, "guest", "guests")} · ${plural(search.rooms, "room", "rooms")}`}
            onClick={() => openAt("guests")}
          />
          {search.promoCode && (
            <Pill icon={Tag} label="Promo" value={search.promoCode} onClick={() => openAt("guests")} />
          )}
        </div>
        <button
          type="button"
          onClick={() => openAt("dates")}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-sand px-5 text-sm font-bold text-brand-dark transition-colors hover:bg-sand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Pencil className="size-4" aria-hidden />
          Modify search
        </button>
      </div>

      {mounted &&
        createPortal(
          <div
            inert={!open}
            className={cn(
              "font-resort fixed inset-0 z-[80] flex items-end justify-center transition-[visibility] duration-250 md:items-center md:p-6",
              open ? "visible" : "invisible",
            )}
          >
            <div
              aria-hidden
              onClick={() => setOpen(false)}
              className={cn(
                "absolute inset-0 bg-slate-950/55 backdrop-blur-sm transition-opacity duration-250",
                open ? "opacity-100" : "opacity-0",
              )}
            />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className={cn(
                "relative flex h-[100dvh] w-full flex-col bg-white shadow-2xl transition-[opacity,transform] duration-250 ease-out focus:outline-none motion-reduce:transition-none md:h-auto md:max-h-[calc(100dvh-3rem)] md:max-w-3xl md:rounded-3xl",
                open
                  ? "translate-y-0 opacity-100 md:scale-100"
                  : "translate-y-full opacity-100 md:translate-y-0 md:scale-95 md:opacity-0",
              )}
            >
              <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 pr-3 pl-6">
                <div>
                  <h2 id={titleId} className="font-resort-serif text-xl font-semibold text-slate-900">
                    Modify your stay
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid size-11 place-items-center rounded-full text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </header>

              <form noValidate onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
                <div data-lenis-prevent className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-6 py-5">
                  <Block title="When are you staying?">
                    <DateRangePicker
                      id="modify-dates"
                      variant="static"
                      months={isMobile ? 1 : 2}
                      value={form.range}
                      onChange={form.setRange}
                      today={form.today}
                      error={form.errors.dates}
                    />
                  </Block>

                  <div className="grid gap-7 md:grid-cols-2 md:gap-8">
                    <section ref={guestsRef} aria-labelledby="modify-guests-title">
                      <h3 id="modify-guests-title" className="mb-1 text-sm font-semibold text-slate-900">
                        Who&apos;s coming?
                      </h3>
                      <GuestFields value={form.guests} onChange={form.setGuests} />
                      <FieldError id="modify-guests-error" message={form.errors.guests} />
                    </section>

                    <Block title="Promo code">
                      <div className="-mx-2">
                        <PromoField
                          id="modify-promo"
                          value={form.promo}
                          onChange={form.setPromo}
                          open={form.promoOpen}
                          onOpenChange={form.setPromoOpen}
                          error={form.errors.promo}
                        />
                      </div>
                    </Block>
                  </div>
                </div>

                <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:rounded-b-3xl">
                  <p className="hidden min-w-0 truncate text-sm text-slate-600 sm:block">{guestSummary(form.guests)}</p>
                  <button
                    type="submit"
                    disabled={pending}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-sand px-6 text-base font-bold text-brand-dark shadow-[0_10px_24px_-10px_rgba(191,146,67,0.9)] transition-colors hover:bg-sand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 sm:flex-none"
                  >
                    {pending ? (
                      <Loader2 className="size-5 animate-spin" aria-hidden />
                    ) : (
                      <Search className="size-5" aria-hidden />
                    )}
                    {pending ? "Updating…" : "Update search"}
                  </button>
                </footer>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}
