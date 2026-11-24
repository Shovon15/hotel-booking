import { Building, Building2, Castle, Gem, Home, Hotel, Leaf, Palmtree, Tent, Trees, type LucideIcon } from "lucide-react";
import { unsplash, type BeachStay } from "./resort";

/**
 * "Browse by property type" section + the /stays/[type] pages.
 * Add / remove / reorder entries here. `slug` becomes the URL: /stays/<slug>.
 * Each type's `listings` are what its page shows (demo data for now).
 */
export type PropertyType = {
  slug: string;
  name: string;
  /** Singular label used on cards, e.g. "Hotel". */
  singular: string;
  icon: LucideIcon;
  tagline: string;
  description: string;
  image: string;
  listings: BeachStay[];
};

type Seed = [name: string, location: string, image: string, price: number, rating: number, reviews: number, sleeps: number, tag?: string];

const listings = (singular: string, prefix: string, seeds: Seed[]): BeachStay[] =>
  seeds.map(([name, location, image, priceFrom, rating, reviews, sleeps, tag], i) => ({
    id: `${prefix}-${i + 1}`,
    name,
    kind: singular,
    location,
    image: unsplash(image),
    priceFrom,
    rating,
    reviews,
    sleeps,
    tag,
  }));

export const PROPERTY_TYPES: PropertyType[] = [
  {
    slug: "hotels",
    name: "Hotels",
    singular: "Hotel",
    icon: Hotel,
    tagline: "Full service, right in town",
    description: "Room service, restaurants and a 24-hour front desk — city and seaside hotels with everything taken care of.",
    image: "1566073771259-6a8506099945",
    listings: listings("Hotel", "hotel", [
      ["Grand Bay Hotel", "Cox's Bazar", "1542314831-068cd1dbfeeb", 9800, 4.7, 412, 2, "Sea view"],
      ["Harbour Light Hotel", "Chattogram", "1551882547-ff40c63fe5fa", 7600, 4.5, 236, 2],
      ["The Tea Garden Hotel", "Sreemangal", "1566073771259-6a8506099945", 8200, 4.6, 188, 3, "Breakfast incl."],
      ["Riverside Plaza", "Dhaka", "1582719508461-905c673771fd", 11500, 4.4, 520, 2],
    ]),
  },
  {
    slug: "apartments",
    name: "Apartments",
    singular: "Apartment",
    icon: Building2,
    tagline: "Space to live like a local",
    description: "Serviced apartments with kitchens and living rooms — ideal for longer stays, families and remote work.",
    image: "1522708323590-d24dbb6b0267",
    listings: listings("Apartment", "apt", [
      ["Skyline Serviced Apartment", "Gulshan, Dhaka", "1522708323590-d24dbb6b0267", 6500, 4.6, 142, 4, "Long stay deal"],
      ["Marine Drive Flat", "Cox's Bazar", "1502672260266-1c1ef2d93688", 5400, 4.5, 98, 4],
      ["Hillview Loft", "Chattogram", "1505693416388-ac5ce068fe85", 4800, 4.3, 61, 3],
      ["Lakeside Studio", "Dhanmondi, Dhaka", "1618773928121-c32242e63f39", 3900, 4.4, 77, 2],
    ]),
  },
  {
    slug: "resorts",
    name: "Resorts",
    singular: "Resort",
    icon: Palmtree,
    tagline: "Pools, spas and nowhere to be",
    description: "All-in escapes with pools, spas, restaurants and activities on site, so you never have to leave.",
    image: "1571896349842-33c89424de2d",
    listings: listings("Resort", "resort", [
      ["Lake Breeze Resort", "Gazipur", "1571896349842-33c89424de2d", 14500, 4.8, 310, 3, "Popular"],
      ["Coral Sands Resort", "Inani Beach", "1540541338287-41700207dee6", 18900, 4.9, 204, 3, "Beachfront"],
      ["Green Valley Retreat", "Sreemangal", "1520250497591-112f2f40a3f4", 12800, 4.7, 156, 2],
      ["Palm Grove Resort", "Kuakata", "1573843981267-be1999ff37cd", 11200, 4.5, 89, 4],
    ]),
  },
  {
    slug: "villas",
    name: "Villas",
    singular: "Villa",
    icon: Castle,
    tagline: "Private pools, all to yourself",
    description: "Whole villas with private pools, gardens and room for the whole group — privacy with hotel comfort.",
    image: "1613490493576-7fde63acd811",
    listings: listings("Villa", "villa", [
      ["Ocean Front Villa", "Cox's Bazar", "1499793983690-e29da59ef1c2", 28500, 4.9, 128, 6, "Beachfront"],
      ["Sunrise Pool Villa", "Gazipur", "1613490493576-7fde63acd811", 24000, 4.8, 74, 6, "Private pool"],
      ["Modern Glass Villa", "Purbachal", "1580587771525-78b9dba3b914", 31500, 4.9, 42, 8, "Luxury"],
      ["Shoreline Pool Villa", "Inani Beach", "1590523277543-a94d2e4eb00b", 36500, 5.0, 38, 6],
    ]),
  },
  {
    slug: "cottages",
    name: "Cottages",
    singular: "Cottage",
    icon: Home,
    tagline: "Cosy, quiet and close to nature",
    description: "Stand-alone cottages among tea gardens, hills and lakes — slow mornings and starry nights.",
    image: "1449158743715-0a90ebb6d2d8",
    listings: listings("Cottage", "cottage", [
      ["Tea Hill Cottage", "Sreemangal", "1449158743715-0a90ebb6d2d8", 7200, 4.8, 118, 4, "Nature stay"],
      ["Cloud Nine Cottage", "Sajek Valley", "1510798831971-661eb04b3739", 6800, 4.7, 203, 4, "Hill view"],
      ["Lake View Cottage", "Rangamati", "1602002418082-a4443e081dd1", 8500, 4.6, 87, 2],
      ["Dune Cottage", "Inani Beach", "1573843981267-be1999ff37cd", 9500, 4.5, 63, 4],
    ]),
  },
  {
    slug: "guest-houses",
    name: "Guest Houses",
    singular: "Guest House",
    icon: Building,
    tagline: "Friendly hosts, honest prices",
    description: "Family-run guest houses with home-cooked breakfast and hosts who know every local secret.",
    image: "1564013799919-ab600027ffc6",
    listings: listings("Guest House", "gh", [
      ["Banyan Tree Guest House", "Bandarban", "1564013799919-ab600027ffc6", 3200, 4.7, 156, 3, "Home-cooked meals"],
      ["Old Town Guest House", "Old Dhaka", "1555854877-bab0e564b8d5", 2800, 4.4, 98, 2],
      ["Sea Breeze Guest House", "Saint Martin's", "1505693416388-ac5ce068fe85", 3600, 4.5, 72, 3],
      ["Riverbank Guest House", "Sylhet", "1618773928121-c32242e63f39", 2500, 4.3, 45, 2],
    ]),
  },
  {
    slug: "resort-villages",
    name: "Resort Villages",
    singular: "Resort Village",
    icon: Trees,
    tagline: "A whole village of cottages and pools",
    description: "Clusters of cottages around shared pools, gardens and restaurants — the space of a village with resort service.",
    image: "1596394516093-501ba68a0ba6",
    listings: listings("Resort Village", "village", [
      ["Nilgiri Resort Village", "Bandarban", "1596394516093-501ba68a0ba6", 13500, 4.8, 167, 4, "Hill views"],
      ["Bamboo Grove Village", "Sreemangal", "1520250497591-112f2f40a3f4", 11800, 4.6, 112, 4],
      ["Sundarban Edge Village", "Mongla", "1540541338287-41700207dee6", 10500, 4.5, 58, 5, "Nature stay"],
      ["Padma Riverside Village", "Munshiganj", "1571896349842-33c89424de2d", 9200, 4.4, 81, 4],
    ]),
  },
  {
    slug: "boutique-hotels",
    name: "Boutique Hotels",
    singular: "Boutique Hotel",
    icon: Gem,
    tagline: "Small, stylish and full of character",
    description: "Design-led hotels with only a handful of rooms, personal service and a story behind every corner.",
    image: "1445019980597-93fa8acb246c",
    listings: listings("Boutique Hotel", "boutique", [
      ["The Indigo House", "Gulshan, Dhaka", "1445019980597-93fa8acb246c", 12500, 4.8, 143, 2, "Design pick"],
      ["Jute Mill Hotel", "Narayanganj", "1631049307264-da0ec9d70304", 9800, 4.6, 66, 2],
      ["Seashell Boutique Stay", "Cox's Bazar", "1582719508461-905c673771fd", 11200, 4.7, 98, 2, "Sea view"],
      ["Heritage Haveli", "Old Dhaka", "1618773928121-c32242e63f39", 8700, 4.5, 54, 3],
    ]),
  },
  {
    slug: "eco-lodges",
    name: "Eco Lodges",
    singular: "Eco Lodge",
    icon: Leaf,
    tagline: "Low impact, high on nature",
    description: "Solar-powered lodges built from local materials, with farm-to-table food and guided nature walks.",
    image: "1470770841072-f978cf4d019e",
    listings: listings("Eco Lodge", "eco", [
      ["Lalakhal Eco Lodge", "Sylhet", "1470770841072-f978cf4d019e", 7800, 4.8, 121, 3, "Solar powered"],
      ["Lawachara Forest Lodge", "Sreemangal", "1449158743715-0a90ebb6d2d8", 6900, 4.7, 95, 4],
      ["Kaptai Lake Lodge", "Rangamati", "1602002418082-a4443e081dd1", 7400, 4.6, 70, 2, "Lake view"],
      ["Mangrove Eco Lodge", "Khulna", "1510798831971-661eb04b3739", 6200, 4.4, 39, 3],
    ]),
  },
  {
    slug: "glamping",
    name: "Glamping",
    singular: "Glamping Tent",
    icon: Tent,
    tagline: "Camping, minus the hard parts",
    description: "Proper beds, real bathrooms and campfires under the stars — the outdoors without roughing it.",
    image: "1504280390367-361c6d9f38f4",
    listings: listings("Glamping Tent", "glamp", [
      ["Sajek Sky Camp", "Sajek Valley", "1504280390367-361c6d9f38f4", 5800, 4.7, 188, 2, "Stargazing"],
      ["Nafakhum Riverside Camp", "Bandarban", "1470770841072-f978cf4d019e", 5200, 4.5, 64, 3],
      ["Inani Dune Camp", "Inani Beach", "1573843981267-be1999ff37cd", 6400, 4.6, 77, 2, "Beachfront"],
      ["Tea Estate Tents", "Sreemangal", "1449158743715-0a90ebb6d2d8", 4900, 4.4, 42, 2],
    ]),
  },
];

export const getPropertyType = (slug: string) => PROPERTY_TYPES.find((t) => t.slug === slug);
export const propertyTypeHref = (slug: string) => `/stays/${slug}`;
