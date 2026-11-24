import { photo } from "./facilities";

export const GALLERY_CATEGORIES = ["Rooms", "Pool", "Dining", "Wellness", "Nature"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type GalleryImage = {
  id: string;
  /** Unsplash photo id (the part after "photo-"). */
  photoId: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  /** Grid shape on desktop: tall = 1×2, wide = 2×1, normal = 1×1. */
  shape?: "tall" | "wide";
};

/** Home page gallery. Add, remove or reorder freely. */
export const GALLERY: GalleryImage[] = [
  { id: "g1", photoId: "1571896349842-33c89424de2d", alt: "Resort pool lit up at dusk", caption: "Evening at the main pool", category: "Pool", shape: "wide" },
  { id: "g2", photoId: "1582719508461-905c673771fd", alt: "Deluxe king room with garden view", caption: "Deluxe King, Garden View", category: "Rooms", shape: "tall" },
  { id: "g3", photoId: "1470770841072-f978cf4d019e", alt: "Lake with a wooden house beneath forested hills", caption: "Morning mist on the lake", category: "Nature" },
  { id: "g4", photoId: "1414235077428-338989a2e8c0", alt: "Plated dinner on a set table", caption: "Chef's tasting menu", category: "Dining" },
  { id: "g5", photoId: "1544161515-4ab6ce6db874", alt: "Guest receiving an oil massage", caption: "Signature massage", category: "Wellness" },
  { id: "g6", photoId: "1520250497591-112f2f40a3f4", alt: "Pool villas surrounded by palm trees", caption: "Private pool villas", category: "Pool", shape: "tall" },
  { id: "g7", photoId: "1631049307264-da0ec9d70304", alt: "Bright twin room with large windows", caption: "Premium Suite bedroom", category: "Rooms" },
  { id: "g8", photoId: "1504754524776-8f4f37790ca0", alt: "Breakfast spread with fruit, pastries and coffee", caption: "Breakfast on the terrace", category: "Dining", shape: "wide" },
  { id: "g9", photoId: "1439066615861-d1af74d74000", alt: "Wooden jetty on a calm blue lake", caption: "The jetty at sunrise", category: "Nature" },
  { id: "g10", photoId: "1506126613408-eca07ce68773", alt: "Person meditating at sunset", caption: "Sunset meditation", category: "Wellness" },
  { id: "g11", photoId: "1445019980597-93fa8acb246c", alt: "Daybeds on a hilltop deck overlooking the valley", caption: "Hilltop sundeck", category: "Nature", shape: "wide" },
  { id: "g12", photoId: "1514362545857-3bc16c4c7d1b", alt: "Cocktail on a bar counter", caption: "Pool bar signatures", category: "Dining" },
  { id: "g13", photoId: "1590523277543-a94d2e4eb00b", alt: "Villa with a private pool", caption: "Shoreline Pool Villa", category: "Rooms" },
  { id: "g14", photoId: "1449158743715-0a90ebb6d2d8", alt: "Wooden cabin among tall forest trees", caption: "Forest cabins", category: "Nature" },
  { id: "g15", photoId: "1475483768296-6163e08872a1", alt: "Friends around a campfire at night", caption: "Bonfire nights", category: "Nature" },
  { id: "g16", photoId: "1540555700478-4be289fbecef", alt: "Spa towels, oil bottle and flowers", caption: "Spa rituals", category: "Wellness" },
];

export const galleryPhoto = (img: GalleryImage, w = 900) => photo(img.photoId, w);
