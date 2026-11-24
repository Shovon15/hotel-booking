const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_MS = 86_400_000;

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, days: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);

/** Whole nights between two dates (DST-safe). */
export const nightsBetween = (from: Date, to: Date) =>
  Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);

/** "2026-12-12" in local time. */
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fromISODate = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** "Fri, 12 Dec" */
export const formatShortDate = (d: Date) =>
  `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;

/** "12–14 Dec", or "30 Dec – 2 Jan" across months. */
export const formatCompactRange = (from: Date, to: Date) =>
  from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()
    ? `${from.getDate()}–${to.getDate()} ${MONTHS[to.getMonth()]}`
    : `${from.getDate()} ${MONTHS[from.getMonth()]} – ${to.getDate()} ${MONTHS[to.getMonth()]}`;

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const bdt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
/** "৳8,500" — Bangladesh uses lakh grouping, same as en-IN. */
export const formatBDT = (amount: number) => `৳${bdt.format(amount)}`;
