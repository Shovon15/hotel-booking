/**
 * Resort header + booking bar configuration.
 * Everything a non-developer may want to change lives here.
 */

export const RESORT = {
  name: "Resort Name",
  location: "Sreemangal, Sylhet",
  phoneDisplay: "+880 1700-000000",
  /** Used in the tel: link — digits and a leading + only. */
  phoneTel: "+8801700000000",
  /** International format without + or spaces, as wa.me expects. */
  whatsappNumber: "8801700000000",
  address: "Lake Road, Sreemangal, Sylhet 3210, Bangladesh",
  email: "reservations@example.com",
};

export const whatsappUrl = () => `https://wa.me/${RESORT.whatsappNumber}`;

export const BOOKING_RULES = {
  /** Minimum nights per booking. */
  minStayNights: 1,
  /** Maximum nights per booking (validated on search). */
  maxStayNights: 30,
  adults: { min: 1, max: 10, default: 2 },
  children: { min: 0, max: 6, default: 0 },
  rooms: { min: 1, max: 5, default: 1 },
  childAge: { min: 0, max: 17 },
} as const;

export type Room = {
  id: string;
  name: string;
  /** Lowest nightly rate in BDT. */
  priceFrom: number;
  description: string;
  sleeps: number;
};

export const ROOMS: Room[] = [
  {
    id: "deluxe-room",
    name: "Deluxe Room",
    priceFrom: 8500,
    description: "Garden-facing room with a king bed and a private balcony.",
    sleeps: 2,
  },
  {
    id: "premium-suite",
    name: "Premium Suite",
    priceFrom: 14500,
    description: "Separate living area, soaking tub and pool views.",
    sleeps: 3,
  },
  {
    id: "family-villa",
    name: "Family Villa",
    priceFrom: 22000,
    description: "Two bedrooms, a kitchenette and a shaded private deck.",
    sleeps: 5,
  },
  {
    id: "lake-view-cottage",
    name: "Lake View Cottage",
    priceFrom: 18000,
    description: "Stand-alone cottage on stilts, steps from the water.",
    sleeps: 2,
  },
];

/** Section ids on the home page that the menu links scroll to. */
export const NAV_LINKS = [
  { id: "rooms", label: "Rooms & Villas" },
  { id: "offers", label: "Offers & Packages" },
  { id: "facilities", label: "Facilities" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
] as const;

export const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "bn", label: "বাংলা", name: "Bangla" },
] as const;
export type LanguageCode = (typeof LANGUAGES)[number]["code"];

/** Header heights in px — keep in sync with h-16 / md:h-20 in Header. */
export const HEADER_HEIGHT = { mobile: 64, desktop: 80 };

/** Element id of the booking bar; "Book Now" scrolls here. */
export const BOOKING_ANCHOR_ID = "booking";

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=80";
