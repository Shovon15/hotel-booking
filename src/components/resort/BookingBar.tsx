"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CalendarDays, CircleCheckBig, Search } from "lucide-react";
import { BOOKING_ANCHOR_ID } from "@/config/resort";
import { formatCompactRange, formatShortDate, nightsBetween, plural } from "./lib/format";
import {
  BOOK_NOW_EVENT,
  headerHeight,
  isDesktop,
  scrollToY,
  useStuckUnderHeader,
} from "./lib/hooks";
import { useBookingForm, type BookingPayload } from "./lib/useBookingForm";
import DateRangePicker from "./DateRangePicker";
import GuestSelector from "./GuestSelector";
import PromoField from "./PromoField";
import BookingSheet from "./BookingSheet";
import { cn } from "./lib/cn";
import { focusFirstError } from "./lib/focusFirstError";

const HIGHLIGHT_MS = 1400;

function SearchSummary({ search }: { search: BookingPayload }) {
  const guests = search.adults + search.children.length;
  return (
    <p
      role="status"
      className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5 text-sm text-brand-dark animate-[resort-fade-in_200ms_ease-out]"
    >
      <CircleCheckBig className="size-4 shrink-0" aria-hidden />
      <span>
        Checking {plural(search.nights, "night", "nights")} for {plural(guests, "guest", "guests")}
        {search.promoCode ? ` with code ${search.promoCode}` : ""}… (payload logged to the console)
      </span>
    </p>
  );
}

/**
 * Availability search. Sits in the hero and pins itself under the header
 * once its slot scrolls up to it. Desktop: one row. Mobile: a pill that opens
 * the full-screen BookingSheet.
 */
export default function BookingBar() {
  const form = useBookingForm();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [slotHeight, setSlotHeight] = useState<number>();
  const slotRef = useRef<HTMLDivElement>(null);
  const dateTriggerRef = useRef<HTMLButtonElement>(null);
  const highlightTimer = useRef<number | undefined>(undefined);
  const stuck = useStuckUnderHeader(slotRef);

  // Remember the in-hero height so the page doesn't jump when the bar pins.
  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const observer = new ResizeObserver(([entry]) => setSlotHeight(entry.contentRect.height));
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  // "Book Now" (header, drawer, mobile bottom bar).
  useEffect(() => {
    const onBookNow = () => {
      if (!isDesktop()) {
        setSheetOpen(true);
        return;
      }
      const slot = slotRef.current;
      if (slot && slot.getBoundingClientRect().top > headerHeight()) {
        scrollToY(slot.getBoundingClientRect().top + window.scrollY - headerHeight() - 24);
      }
      dateTriggerRef.current?.focus({ preventScroll: true });
      setHighlight(true);
      window.clearTimeout(highlightTimer.current);
      highlightTimer.current = window.setTimeout(() => setHighlight(false), HIGHLIGHT_MS);
    };
    window.addEventListener(BOOK_NOW_EVENT, onBookNow);
    return () => {
      window.removeEventListener(BOOK_NOW_EVENT, onBookNow);
      window.clearTimeout(highlightTimer.current);
    };
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { payload, errors } = form.submit();
    if (!payload) focusFirstError(errors, "bar");
  };

  const { range, guests } = form;
  const guestCount = guests.adults + guests.childAges.length;
  const pillLabel = range ? formatCompactRange(range.from, range.to) : "Select dates";

  return (
    <>
      <div
        ref={slotRef}
        id={BOOKING_ANCHOR_ID}
        style={stuck && slotHeight ? { height: slotHeight } : undefined}
        className="relative z-30"
      >
        <div
          className={cn(
            stuck
              ? "fixed inset-x-0 top-16 z-40 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)] backdrop-blur-md animate-[resort-slide-down_200ms_ease-out] md:top-20"
              : "relative",
          )}
        >
          <div className={cn(stuck && "mx-auto max-w-site px-4 py-2 sm:px-6 lg:px-8")}>
            {/* ---------- Desktop / tablet: one row ---------- */}
            <form
              noValidate
              onSubmit={onSubmit}
              aria-label="Check availability"
              className={cn(
                "hidden items-start gap-1 md:grid md:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)_auto_auto]",
                stuck
                  ? "lg:items-center"
                  : "rounded-2xl bg-white p-2 shadow-[0_30px_70px_-20px_rgba(2,24,20,0.55)] ring-1 ring-black/5",
              )}
            >
              <DateRangePicker
                id="bar-dates"
                variant="popover"
                value={range}
                onChange={form.setRange}
                today={form.today}
                error={form.errors.dates}
                triggerRef={dateTriggerRef}
                highlight={highlight}
                compact={stuck}
              />
              <div className="lg:border-l lg:border-slate-200 lg:pl-1">
                <GuestSelector
                  id="bar-guests"
                  value={guests}
                  onChange={form.setGuests}
                  error={form.errors.guests}
                  compact={stuck}
                />
              </div>
              <div className="lg:w-52 lg:border-l lg:border-slate-200 lg:pl-1">
                <PromoField
                  id="bar-promo"
                  value={form.promo}
                  onChange={form.setPromo}
                  open={form.promoOpen}
                  onOpenChange={form.setPromoOpen}
                  error={form.errors.promo}
                  compact={stuck}
                />
              </div>
              <button
                type="submit"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl bg-sand px-6 font-bold whitespace-nowrap text-brand-dark shadow-[0_12px_28px_-12px_rgba(191,146,67,0.95)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-sand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:translate-y-0 motion-reduce:transition-none",
                  stuck ? "h-12 text-[15px]" : "h-16 text-base",
                )}
              >
                <Search className="size-5" aria-hidden />
                Check Availability
              </button>
            </form>

            {/* ---------- Mobile: tappable pill ---------- */}
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
              aria-label={
                range
                  ? `Search availability: ${formatShortDate(range.from)} to ${formatShortDate(range.to)}, ${plural(nightsBetween(range.from, range.to), "night", "nights")}, ${plural(guestCount, "guest", "guests")}`
                  : "Search availability"
              }
              className={cn(
                "flex h-14 w-full items-center gap-3 rounded-full bg-white pr-1.5 pl-5 text-left text-[15px] font-semibold text-slate-900 transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 md:hidden",
                stuck ? "ring-1 ring-slate-200" : "shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6)]",
              )}
            >
              <CalendarDays className="size-5 shrink-0 text-brand" aria-hidden />
              <span className="min-w-0 flex-1 truncate">
                {pillLabel} <span className="text-slate-400">·</span> {plural(guestCount, "guest", "guests")}
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sand text-brand-dark">
                <Search className="size-5" aria-hidden />
              </span>
            </button>
          </div>
        </div>

        {!stuck && form.lastSearch && <SearchSummary search={form.lastSearch} />}
      </div>

      {/* Outside the pinned bar: its transform/backdrop-filter would trap position:fixed. */}
      <BookingSheet open={sheetOpen} onClose={() => setSheetOpen(false)} form={form} />
    </>
  );
}
