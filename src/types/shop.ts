/** Product shape used by the shop-style ProductCard (src/components/common/cards/ProductCard.tsx). */
export type ShopProduct = {
  id: string | number;
  slug: string;
  title: string;
  image: string;
  /** Slug-like category, e.g. "spa-products" (dashes are shown as spaces). */
  category: string;
  price: number;
  /** Regular price, shown struck through; enables the -% badge. */
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  /** e.g. "500 g", "per night". */
  unit?: string;
  badge?: "hot" | "new" | "sale";
};
