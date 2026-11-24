import { unsplash } from "./resort";

/**
 * "Trending destinations" gallery on the home page. Edit freely.
 * The FIRST entry gets the big tile; the 6th gets a wide tile (see TrendingDestinations.tsx).
 * Images are generic stock photos — replace with real photos of each place.
 */
export type Destination = {
  id: string;
  name: string;
  region: string;
  image: string;
  properties: number;
  /** Lowest nightly rate in BDT. */
  priceFrom: number;
  highlight: string;
};

export const TRENDING_DESTINATIONS: Destination[] = [
  { id: "coxs-bazar", name: "Cox's Bazar", region: "Chattogram", image: unsplash("1507525428034-b723cf961d3e"), properties: 248, priceFrom: 3500, highlight: "World's longest natural sea beach" },
  { id: "sajek", name: "Sajek Valley", region: "Rangamati", image: unsplash("1470071459604-3b5ec3a7fe05"), properties: 64, priceFrom: 2800, highlight: "Above the clouds" },
  { id: "sreemangal", name: "Sreemangal", region: "Sylhet", image: unsplash("1500530855697-b586d89ba3ee"), properties: 92, priceFrom: 3200, highlight: "Tea capital" },
  { id: "saint-martins", name: "Saint Martin's", region: "Cox's Bazar", image: unsplash("1519046904884-53103b34b206"), properties: 57, priceFrom: 3600, highlight: "Coral island" },
  { id: "bandarban", name: "Bandarban", region: "Chattogram Hill Tracts", image: unsplash("1506905925346-21bda4d32df4"), properties: 71, priceFrom: 2500, highlight: "Peaks & waterfalls" },
  { id: "sundarbans", name: "Sundarbans", region: "Khulna", image: unsplash("1441974231531-c6227db76b6e"), properties: 33, priceFrom: 4200, highlight: "Largest mangrove forest" },
  { id: "kuakata", name: "Kuakata", region: "Patuakhali", image: unsplash("1505142468610-359e7d316be0"), properties: 46, priceFrom: 2900, highlight: "Sunrise & sunset beach" },
  { id: "rangamati", name: "Rangamati", region: "Chattogram Hill Tracts", image: unsplash("1501785888041-af3ef285b470"), properties: 52, priceFrom: 3100, highlight: "Kaptai Lake" },
];
