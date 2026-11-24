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

/** "Looking for a beach trip?" slider on the home page. Edit freely. */
export type BeachStay = {
  id: string;
  name: string;
  kind: string;
  location: string;
  image: string;
  /** Lowest nightly rate in BDT. */
  priceFrom: number;
  rating: number;
  reviews: number;
  sleeps: number;
  tag?: string;
};

export const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`;

export const BEACH_STAYS: BeachStay[] = [
  { id: "ocean-villa", name: "Ocean Front Villa", kind: "Villa", location: "Cox's Bazar", image: unsplash("1499793983690-e29da59ef1c2"), priceFrom: 28500, rating: 4.9, reviews: 128, sleeps: 6, tag: "Beachfront" },
  { id: "sunset-suite", name: "Sunset Pool Suite", kind: "Suite", location: "Inani Beach", image: unsplash("1520250497591-112f2f40a3f4"), priceFrom: 19500, rating: 4.8, reviews: 96, sleeps: 3, tag: "Private pool" },
  { id: "palm-room", name: "Palm Garden Room", kind: "Room", location: "Cox's Bazar", image: unsplash("1566073771259-6a8506099945"), priceFrom: 9500, rating: 4.6, reviews: 210, sleeps: 2 },
  { id: "coral-room", name: "Coral Deluxe Room", kind: "Room", location: "Saint Martin's", image: unsplash("1582719508461-905c673771fd"), priceFrom: 11000, rating: 4.7, reviews: 74, sleeps: 2, tag: "Sea view" },
  { id: "lagoon-villa", name: "Lagoon Family Villa", kind: "Villa", location: "Kuakata", image: unsplash("1540541338287-41700207dee6"), priceFrom: 32000, rating: 4.9, reviews: 52, sleeps: 8, tag: "Popular" },
  { id: "dune-cottage", name: "Dune Cottage", kind: "Cottage", location: "Inani Beach", image: unsplash("1573843981267-be1999ff37cd"), priceFrom: 15500, rating: 4.5, reviews: 63, sleeps: 4 },
  { id: "tide-suite", name: "High Tide Suite", kind: "Suite", location: "Saint Martin's", image: unsplash("1602002418082-a4443e081dd1"), priceFrom: 21500, rating: 4.8, reviews: 41, sleeps: 3 },
  { id: "shore-villa", name: "Shoreline Pool Villa", kind: "Villa", location: "Cox's Bazar", image: unsplash("1590523277543-a94d2e4eb00b"), priceFrom: 36500, rating: 5.0, reviews: 38, sleeps: 6, tag: "Luxury" },
];
