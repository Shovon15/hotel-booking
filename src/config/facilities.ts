import {
  Baby,
  Bike,
  Car,
  ConciergeBell,
  Dumbbell,
  Flame,
  Leaf,
  PartyPopper,
  Plane,
  Sparkles,
  Utensils,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";

/** Unsplash photo URL at a given width. */
export const photo = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export type Facility = {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  /** Opening hours or a short note shown as a chip. */
  hours: string;
  image: string;
  /**
   * Size in the bento grid (desktop):
   * hero = 2×2, wide = 2×1, tile = 1×1. Order matters — the grid fills left to right.
   */
  size: "hero" | "wide" | "tile";
};

/** Home page "Facilities" bento grid. Edit freely. */
export const FACILITIES: Facility[] = [
  {
    id: "pool",
    name: "Infinity Pool",
    icon: Waves,
    description: "A 30-metre heated pool that seems to spill into the hills, with sun loungers and a swim-up bar.",
    hours: "6 am – 9 pm",
    image: photo("1584132967334-10e028bd69f7", 1400),
    size: "hero",
  },
  {
    id: "spa",
    name: "Spa & Wellness",
    icon: Sparkles,
    description: "Hot-stone, Ayurvedic and couples' treatments in garden pavilions.",
    hours: "10 am – 8 pm",
    image: photo("1600334089648-b0d9d3028eb2", 1200),
    size: "wide",
  },
  {
    id: "restaurant",
    name: "Lakeside Restaurant",
    icon: Utensils,
    description: "Bengali, Asian and grill menus on a deck over the water.",
    hours: "7 am – 11 pm",
    image: photo("1559339352-11d035aa65de"),
    size: "tile",
  },
  {
    id: "tea-lounge",
    name: "Tea Lounge",
    icon: Leaf,
    description: "Single-estate Sreemangal teas, brewed the slow way.",
    hours: "8 am – 10 pm",
    image: photo("1576092768241-dec231879fc3"),
    size: "tile",
  },
  {
    id: "fitness",
    name: "Fitness Studio",
    icon: Dumbbell,
    description: "Cardio, free weights and sunrise yoga on the lawn.",
    hours: "Open 24 hours",
    image: photo("1534438327276-14e5300c3a48"),
    size: "tile",
  },
  {
    id: "kids",
    name: "Kids' Club",
    icon: Baby,
    description: "Supervised play, crafts and nature walks for ages 4–12.",
    hours: "9 am – 6 pm",
    image: photo("1503454537195-1dcabb73ffb9"),
    size: "tile",
  },
  {
    id: "events",
    name: "Event Lawn & Hall",
    icon: PartyPopper,
    description: "Weddings, retreats and celebrations for up to 300 guests, catered by our kitchen.",
    hours: "By arrangement",
    image: photo("1464366400600-7168b8af9bc3", 1200),
    size: "wide",
  },
];

/** "Also included" chips under the grid. */
export const FACILITY_EXTRAS: { icon: LucideIcon; label: string }[] = [
  { icon: Wifi, label: "Free high-speed Wi-Fi" },
  { icon: Car, label: "Free parking" },
  { icon: Plane, label: "Airport pick-up" },
  { icon: ConciergeBell, label: "24-hour front desk" },
  { icon: Flame, label: "Bonfire nights" },
  { icon: Bike, label: "Bicycle hire" },
];
