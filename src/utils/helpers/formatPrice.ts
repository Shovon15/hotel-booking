const bdt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** "৳8,500" — Bangladesh uses lakh grouping, same as en-IN. */
export function formatPrice(amount: number): string {
  return `৳${bdt.format(amount)}`;
}

/** Whole-number discount between a regular and a sale price; 0 when there's no discount. */
export function getDiscountPercent(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
