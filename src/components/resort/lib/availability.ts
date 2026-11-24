import { BOOKING_RULES } from "../../../config/resort";
import type { RoomListing } from "@/config/propertyTypes";
import type { BookingPayload } from "./useBookingForm";
import { fromISODate, nightsBetween } from "./format";

export const AVAILABILITY_PATH = "/availability";

/** The search the guest ran from the booking bar, as read from the URL. */
export type AvailabilitySearch = {
  checkIn: string | null;
  checkOut: string | null;
  nights: number;
  adults: number;
  children: number[];
  rooms: number;
  promoCode: string | null;
};

/** /availability?checkIn=…&checkOut=…&adults=…&children=5,8&rooms=…&promo=… */
export function availabilityHref(p: BookingPayload) {
  const q = new URLSearchParams({
    checkIn: p.checkIn,
    checkOut: p.checkOut,
    adults: String(p.adults),
    rooms: String(p.rooms),
  });
  if (p.children.length) q.set("children", p.children.join(","));
  if (p.promoCode) q.set("promo", p.promoCode);
  return `${AVAILABILITY_PATH}?${q}`;
}

type RawParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const ISO = /^\d{4}-\d{2}-\d{2}$/;

const clampInt = (raw: string | undefined, min: number, max: number, fallback: number) => {
  const n = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

/** Reads the URL leniently: bad or missing values fall back to defaults. */
export function parseAvailabilitySearch(params: RawParams): AvailabilitySearch {
  const { adults, rooms, childAge, maxStayNights } = BOOKING_RULES;
  let checkIn = first(params.checkIn) ?? null;
  let checkOut = first(params.checkOut) ?? null;
  if (!checkIn || !ISO.test(checkIn) || !checkOut || !ISO.test(checkOut)) checkIn = checkOut = null;

  let nights = 1;
  if (checkIn && checkOut) {
    nights = nightsBetween(fromISODate(checkIn), fromISODate(checkOut));
    if (nights < 1 || nights > maxStayNights) {
      checkIn = checkOut = null;
      nights = 1;
    }
  }

  const children = (first(params.children) ?? "")
    .split(",")
    .filter(Boolean)
    .map((a) => clampInt(a, childAge.min, childAge.max, childAge.min))
    .slice(0, BOOKING_RULES.children.max);

  const promo = first(params.promo)?.trim().toUpperCase();
  return {
    checkIn,
    checkOut,
    nights,
    adults: clampInt(first(params.adults), adults.min, adults.max, adults.default),
    children,
    rooms: clampInt(first(params.rooms), rooms.min, rooms.max, rooms.default),
    promoCode: promo && /^[A-Z0-9-]{3,20}$/.test(promo) ? promo : null,
  };
}

/* ------------------------------------------------------------------ */
/* Filters                                                              */
/* ------------------------------------------------------------------ */

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Guest rating" },
  { value: "size", label: "Room size" },
] as const;
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export type AvailabilityFilters = {
  /** "" = all categories. */
  category: string;
  minPrice: number;
  maxPrice: number;
  beachViewOnly: boolean;
  views: string[];
  beds: string[];
  mealPlans: string[];
  amenities: string[];
  minRating: number;
  freeCancellation: boolean;
  /** Also list sold-out / too-small rooms (greyed out). */
  showUnavailable: boolean;
  sort: SortValue;
};

export const BEACH_VIEW = "Beach";

export const priceBounds = (rooms: RoomListing[]) => {
  const prices = rooms.map((r) => r.priceFrom);
  // Round to the nearest 500 so the slider has tidy ends.
  return {
    min: Math.floor(Math.min(...prices) / 500) * 500,
    max: Math.ceil(Math.max(...prices) / 500) * 500,
  };
};

export const defaultFilters = (rooms: RoomListing[], category = ""): AvailabilityFilters => {
  const { min, max } = priceBounds(rooms);
  return {
    category,
    minPrice: min,
    maxPrice: max,
    beachViewOnly: false,
    views: [],
    beds: [],
    mealPlans: [],
    amenities: [],
    minRating: 0,
    freeCancellation: false,
    showUnavailable: false,
    sort: "recommended",
  };
};

/** Unique values of a field, most common first — used to build checkbox lists. */
export function facetValues(rooms: RoomListing[], pick: (r: RoomListing) => string | string[]) {
  const counts = new Map<string, number>();
  for (const r of rooms) {
    const v = pick(r);
    for (const value of Array.isArray(v) ? v : [v]) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([value]) => value);
}

/** Why a room can't be booked for this search, or null if it can. */
export function unavailableReason(room: RoomListing, search: AvailabilitySearch): string | null {
  if (room.roomsLeft === 0) return "Sold out for your dates";
  if (room.roomsLeft < search.rooms) return `Only ${room.roomsLeft} left — you need ${search.rooms}`;
  const guestsPerRoom = Math.ceil((search.adults + search.children.length) / search.rooms);
  if (room.sleeps < guestsPerRoom) return `Sleeps ${room.sleeps} — too small for ${guestsPerRoom} per room`;
  return null;
}

/** Matches the room against every filter except availability. */
function matchesFilters(r: RoomListing, f: AvailabilityFilters) {
  const has = (list: string[], v: string) => list.length === 0 || list.includes(v);
  return (
    (!f.category || r.categorySlug === f.category) &&
    r.priceFrom >= f.minPrice &&
    r.priceFrom <= f.maxPrice &&
    (!f.beachViewOnly || r.view === BEACH_VIEW) &&
    has(f.views, r.view) &&
    has(f.beds, r.bed) &&
    has(f.mealPlans, r.mealPlan) &&
    f.amenities.every((a) => r.amenities.includes(a)) &&
    r.rating >= f.minRating &&
    (!f.freeCancellation || r.freeCancellation)
  );
}

export type RoomResult = { room: RoomListing; unavailable: string | null };

export function filterRooms(
  rooms: RoomListing[],
  filters: AvailabilityFilters,
  search: AvailabilitySearch,
): { results: RoomResult[]; availableCount: number } {
  const matched = rooms
    .filter((r) => matchesFilters(r, filters))
    .map((room) => ({ room, unavailable: unavailableReason(room, search) }));
  const availableCount = matched.filter((m) => !m.unavailable).length;
  const visible = filters.showUnavailable ? matched : matched.filter((m) => !m.unavailable);

  const sorters: Record<SortValue, (a: RoomListing, b: RoomListing) => number> = {
    recommended: (a, b) => b.rating * Math.log(b.reviews + 1) - a.rating * Math.log(a.reviews + 1),
    "price-asc": (a, b) => a.priceFrom - b.priceFrom,
    "price-desc": (a, b) => b.priceFrom - a.priceFrom,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    size: (a, b) => b.sizeSqft - a.sizeSqft,
  };
  const sort = sorters[filters.sort];
  // Bookable rooms always come before unavailable ones.
  const results = [...visible].sort(
    (a, b) => Number(!!a.unavailable) - Number(!!b.unavailable) || sort(a.room, b.room),
  );
  return { results, availableCount };
}

/** How many filters differ from the defaults (for the "Filters (3)" badge). */
export function activeFilterCount(f: AvailabilityFilters, d: AvailabilityFilters) {
  return [
    f.category !== d.category,
    f.minPrice !== d.minPrice || f.maxPrice !== d.maxPrice,
    f.beachViewOnly,
    f.views.length > 0,
    f.beds.length > 0,
    f.mealPlans.length > 0,
    f.amenities.length > 0,
    f.minRating > 0,
    f.freeCancellation,
  ].filter(Boolean).length;
}
