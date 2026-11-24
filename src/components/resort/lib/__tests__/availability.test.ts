import { describe, expect, it } from "vitest";
import type { RoomListing } from "@/config/propertyTypes";
import {
  availabilityHref,
  defaultFilters,
  filterRooms,
  parseAvailabilitySearch,
  unavailableReason,
} from "../availability";

const room = (over: Partial<RoomListing>): RoomListing => ({
  id: "r",
  name: "Room",
  kind: "Room",
  location: "Wing",
  image: "",
  priceFrom: 10000,
  rating: 4.5,
  reviews: 10,
  sleeps: 2,
  categorySlug: "deluxe-room",
  categoryName: "Deluxe Rooms",
  view: "Garden",
  bed: "King",
  sizeSqft: 400,
  mealPlan: "Room only",
  freeCancellation: true,
  roomsLeft: 3,
  amenities: ["Free Wi-Fi"],
  ...over,
});

describe("availability search params", () => {
  it("round-trips a booking payload through the URL", () => {
    const href = availabilityHref({
      checkIn: "2026-12-10",
      checkOut: "2026-12-13",
      nights: 3,
      adults: 2,
      children: [5, 9],
      rooms: 1,
      promoCode: "WINTER-10",
    });
    const params = Object.fromEntries(new URL(href, "http://x").searchParams);
    expect(parseAvailabilitySearch(params)).toEqual({
      checkIn: "2026-12-10",
      checkOut: "2026-12-13",
      nights: 3,
      adults: 2,
      children: [5, 9],
      rooms: 1,
      promoCode: "WINTER-10",
    });
  });

  it("falls back to defaults for junk input", () => {
    const s = parseAvailabilitySearch({ checkIn: "nope", checkOut: "2026-01-01", adults: "abc", rooms: "99" });
    expect(s.checkIn).toBeNull();
    expect(s.adults).toBe(2);
    expect(s.rooms).toBe(5);
  });
});

describe("filterRooms", () => {
  const search = parseAvailabilitySearch({ adults: "2", rooms: "1" });
  const rooms = [
    room({ id: "beach", view: "Beach", priceFrom: 20000 }),
    room({ id: "garden", view: "Garden", priceFrom: 8000 }),
    room({ id: "sold", roomsLeft: 0 }),
    room({ id: "small", sleeps: 1 }),
  ];

  it("hides sold-out and too-small rooms unless asked", () => {
    const f = defaultFilters(rooms);
    expect(filterRooms(rooms, f, search).results.map((r) => r.room.id).sort()).toEqual(["beach", "garden"]);
    const all = filterRooms(rooms, { ...f, showUnavailable: true }, search);
    expect(all.results).toHaveLength(4);
    expect(all.availableCount).toBe(2);
    expect(all.results.slice(-2).every((r) => r.unavailable)).toBe(true);
  });

  it("applies beach view and price filters", () => {
    const f = defaultFilters(rooms);
    expect(filterRooms(rooms, { ...f, beachViewOnly: true }, search).results.map((r) => r.room.id)).toEqual(["beach"]);
    expect(filterRooms(rooms, { ...f, maxPrice: 9000 }, search).results.map((r) => r.room.id)).toEqual(["garden"]);
  });

  it("explains why a room is unavailable", () => {
    const big = parseAvailabilitySearch({ adults: "4", rooms: "1" });
    expect(unavailableReason(room({ sleeps: 2 }), big)).toMatch(/too small/);
    expect(unavailableReason(room({ roomsLeft: 1 }), parseAvailabilitySearch({ adults: "2", rooms: "2" }))).toMatch(/Only 1 left/);
  });
});
