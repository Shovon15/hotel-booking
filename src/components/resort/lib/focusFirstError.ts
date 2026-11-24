import type { BookingErrors } from "./useBookingForm";

/** After a failed search, move focus to the first field with a problem. */
export function focusFirstError(errors: BookingErrors, prefix: "bar" | "sheet" | "modify") {
  const target = (() => {
    if (errors.dates) return document.getElementById(`${prefix}-dates-trigger`);
    if (errors.guests) {
      if (prefix === "bar") return document.getElementById("bar-guests-trigger");
      const section = document.getElementById(`${prefix}-guests-title`)?.parentElement;
      return (
        section?.querySelector<HTMLElement>('select[aria-invalid="true"]') ??
        section?.querySelector<HTMLElement>("button:not([disabled])")
      );
    }
    if (errors.promo) return document.getElementById(`${prefix}-promo`);
    return null;
  })();
  target?.focus();
}
