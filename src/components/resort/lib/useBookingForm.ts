"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BOOKING_RULES } from "@/config/resort";
import { fromISODate, nightsBetween, plural, toISODate } from "./format";
import { useTodayKey } from "./hooks";
import { availabilityHref } from "./availability";

export type DateRange = { from: Date; to: Date };

export type Guests = {
  adults: number;
  /** One entry per child: their age, or null until chosen. */
  childAges: (number | null)[];
  rooms: number;
};

export type BookingErrors = Partial<Record<"dates" | "guests" | "promo", string>>;

export type BookingPayload = {
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number[];
  rooms: number;
  promoCode: string | null;
};

export const guestSummary = ({ adults, childAges, rooms }: Guests) =>
  [
    plural(adults, "Adult", "Adults"),
    childAges.length > 0 ? plural(childAges.length, "Child", "Children") : null,
    plural(rooms, "Room", "Rooms"),
  ]
    .filter(Boolean)
    .join(" · ");

/** Problems with the guest selection, shown live inside the selector too. */
export function guestError({ adults, childAges, rooms }: Guests) {
  if (adults < rooms) {
    return `Each room needs at least one adult. Add ${plural(rooms - adults, "adult", "adults")} or choose fewer rooms.`;
  }
  if (childAges.some((age) => age === null)) return "Please select an age for each child.";
  return undefined;
}

const PROMO_PATTERN = /^[A-Z0-9-]{3,20}$/;

export function validateBooking(
  range: DateRange | null,
  guests: Guests,
  promo: string,
  today: Date | null,
): BookingErrors {
  const errors: BookingErrors = {};
  const { minStayNights, maxStayNights } = BOOKING_RULES;

  if (!range || !today) {
    errors.dates = "Please choose your check-in and check-out dates.";
  } else {
    const nights = nightsBetween(range.from, range.to);
    if (range.from < today) errors.dates = "Check-in can't be in the past.";
    else if (nights < minStayNights)
      errors.dates = `Minimum stay is ${plural(minStayNights, "night", "nights")}.`;
    else if (nights > maxStayNights)
      errors.dates = `Stays are limited to ${plural(maxStayNights, "night", "nights")}. Call us for longer stays.`;
  }

  const guestProblem = guestError(guests);
  if (guestProblem) errors.guests = guestProblem;

  const code = promo.trim();
  if (code && !PROMO_PATTERN.test(code)) {
    errors.promo = "Promo codes are 3–20 letters, numbers or dashes.";
  }
  return errors;
}

export type BookingFormInitial = { range?: DateRange | null; guests?: Guests; promo?: string };

/** Shared state for the desktop booking bar, the mobile sheet and the modify-search modal. */
export function useBookingForm(initial: BookingFormInitial = {}) {
  const router = useRouter();
  const todayKey = useTodayKey();
  const today = todayKey ? fromISODate(todayKey) : null;

  const [pickedRange, setPickedRange] = useState<DateRange | null>(initial.range ?? null);
  const [guests, setGuestsState] = useState<Guests>(
    initial.guests ?? {
      adults: BOOKING_RULES.adults.default,
      childAges: [],
      rooms: BOOKING_RULES.rooms.default,
    },
  );
  const [promo, setPromoState] = useState(initial.promo ?? "");
  const [promoOpen, setPromoOpen] = useState(!!initial.promo);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [lastSearch, setLastSearch] = useState<BookingPayload | null>(null);

  // No dates by default (unless editing an existing search) — the guest picks them.
  const range: DateRange | null = pickedRange;

  const clearError = (field: keyof BookingErrors) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const setRange = (next: DateRange) => {
    setPickedRange(next);
    clearError("dates");
  };
  const setGuests = (next: Guests) => {
    setGuestsState(next);
    clearError("guests");
  };
  const setPromo = (next: string) => {
    setPromoState(next.toUpperCase());
    clearError("promo");
  };

  /** Validates; on success opens /availability with the search in the URL. Returns the payload or the errors. */
  const submit = (): { payload: BookingPayload | null; errors: BookingErrors } => {
    const found = validateBooking(range, guests, promo, today);
    setErrors(found);
    if (Object.keys(found).length > 0 || !range) {
      setLastSearch(null);
      return { payload: null, errors: found };
    }
    const payload: BookingPayload = {
      checkIn: toISODate(range.from),
      checkOut: toISODate(range.to),
      nights: nightsBetween(range.from, range.to),
      adults: guests.adults,
      children: guests.childAges as number[],
      rooms: guests.rooms,
      promoCode: promo.trim() || null,
    };
    setLastSearch(payload);
    router.push(availabilityHref(payload));
    return { payload, errors: found };
  };

  return {
    today,
    range,
    setRange,
    guests,
    setGuests,
    promo,
    setPromo,
    promoOpen,
    setPromoOpen,
    errors,
    lastSearch,
    submit,
  };
}

export type BookingForm = ReturnType<typeof useBookingForm>;
