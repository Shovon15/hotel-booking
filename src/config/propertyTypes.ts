import {
  BedDouble,
  Briefcase,
  Building2,
  Gem,
  Heart,
  Home,
  Palmtree,
  Tent,
  TreePine,
  Trees,
  Waves,
  type LucideIcon,
} from "lucide-react";
import categoriesJson from "@/data/categories.json";
import type { BeachStay } from "./resort";

/**
 * Room / stay categories — the DATA lives in src/data/categories.json.
 * Edit that file to add, remove or reorder categories and their listings;
 * `slug` becomes the URL /stays/<slug>.
 *
 * Used by: the home page "Browse by property type" slider, the /stays/[type]
 * pages and the read-only admin page /admin/categories.
 */

/** Raw shape of one entry in categories.json. */
export type CategoryJson = (typeof categoriesJson)[number];

/** `icon` in the JSON is a name; map it to a lucide icon here. Unknown names fall back to Building2. */
const ICONS: Record<string, LucideIcon> = {
  BedDouble,
  Briefcase,
  Gem,
  Heart,
  Home,
  Palmtree,
  Tent,
  TreePine,
  Trees,
  Waves,
};

export type PropertyType = {
  slug: string;
  name: string;
  /** Singular label used on cards, e.g. "Deluxe Room". */
  singular: string;
  icon: LucideIcon;
  iconName: string;
  tagline: string;
  description: string;
  /** Full image URL. */
  image: string;
  listings: BeachStay[];
};

export const PROPERTY_TYPES: PropertyType[] = categoriesJson.map((c) => ({
  slug: c.slug,
  name: c.name,
  singular: c.singular,
  icon: ICONS[c.icon] ?? Building2,
  iconName: c.icon,
  tagline: c.tagline,
  description: c.description,
  image: c.image,
  listings: c.listings.map((l) => ({ ...l, kind: c.singular })),
}));

/** One bookable room / villa with the fields the availability page filters on. */
export type RoomListing = BeachStay & {
  categorySlug: string;
  categoryName: string;
  view: string;
  bed: string;
  sizeSqft: number;
  mealPlan: string;
  freeCancellation: boolean;
  /** Rooms of this type still free; 0 = sold out. */
  roomsLeft: number;
  amenities: string[];
};

/** Every listing across all categories, flattened — used by /availability. */
export const ALL_ROOMS: RoomListing[] = categoriesJson.flatMap((c) =>
  c.listings.map((l) => ({ ...l, kind: c.singular, categorySlug: c.slug, categoryName: c.name })),
);

export const getPropertyType = (slug: string) => PROPERTY_TYPES.find((t) => t.slug === slug);
/** Index of every room / villa category. */
export const STAYS_HREF = "/stays";
export const propertyTypeHref = (slug: string) => `${STAYS_HREF}/${slug}`;
/** Lowest nightly rate across a category's listings. */
export const lowestPrice = (t: PropertyType) => Math.min(...t.listings.map((l) => l.priceFrom));
