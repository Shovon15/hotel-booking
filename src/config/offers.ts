import { unsplash } from "./resort";

/**
 * "Offers & Packages" on the home page. Edit freely.
 * The FIRST offer is shown as the large featured card.
 */
export type Offer = {
  id: string;
  title: string;
  tag: string;
  detail: string;
  perks: string[];
  image: string;
  /** Package price in BDT. */
  price: number;
  /** Regular price, shown struck through. */
  oldPrice?: number;
  /** "per package", "per night"… */
  unit: string;
  code: string;
  /** Shown as "Valid till …". */
  validTill: string;
};

export const OFFERS: Offer[] = [
  {
    id: "honeymoon",
    title: "Honeymoon Package",
    tag: "Most loved",
    detail: "Three slow days for two — sunsets by the pool and dinners by candlelight.",
    perks: ["2 nights, Pool Suite", "Candle-lit dinner", "Couples spa", "Late checkout"],
    image: unsplash("1520250497591-112f2f40a3f4"),
    price: 32500,
    oldPrice: 39000,
    unit: "per package",
    code: "LOVE17",
    validTill: "31 Dec 2026",
  },
  {
    id: "weekend",
    title: "Weekend Escape",
    tag: "Save 15%",
    detail: "Friday to Sunday with breakfast and a sunset boat ride on the lake.",
    perks: ["2 nights", "Breakfast", "Lake boat ride"],
    image: unsplash("1566073771259-6a8506099945"),
    price: 19900,
    oldPrice: 23400,
    unit: "per package",
    code: "WEEKEND15",
    validTill: "15 Jan 2027",
  },
  {
    id: "family",
    title: "Family Fun Days",
    tag: "Kids stay free",
    detail: "Kids under 12 stay and eat free, plus a full activity pass for everyone.",
    perks: ["3 nights", "Kids eat free", "Activity pass"],
    image: unsplash("1540541338287-41700207dee6"),
    price: 41000,
    oldPrice: 48500,
    unit: "per package",
    code: "FAMILYFUN",
    validTill: "28 Feb 2027",
  },
];
