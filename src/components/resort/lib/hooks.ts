"use client";

import { useCallback, useEffect, useEffectEvent, useSyncExternalStore, type RefObject } from "react";
import { useRouter } from "next/navigation";
import type Lenis from "lenis";
import { BOOKING_ANCHOR_ID, HEADER_HEIGHT } from "@/config/resort";
import { toISODate } from "./format";

export const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

export const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

export const headerHeight = () => (isDesktop() ? HEADER_HEIGHT.desktop : HEADER_HEIGHT.mobile);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Smooth-scroll to a page y position, through Lenis when it is running. */
export function scrollToY(top: number) {
  const lenis = getLenis();
  const reduce = prefersReducedMotion();
  if (lenis) {
    lenis.scrollTo(top, { duration: reduce ? 0 : 0.9, immediate: reduce, force: true });
  } else {
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }
}

/** Scroll a section into view below the fixed header. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  scrollToY(el.getBoundingClientRect().top + window.scrollY - headerHeight() - 12);
  return true;
}

export type Placement = "bottom" | "top";

/**
 * Open a popover below `anchor` unless it would run off the bottom of the
 * screen and there is room above it (below the fixed header).
 */
export function choosePlacement(anchor: HTMLElement, panelHeight: number): Placement {
  const rect = anchor.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top - headerHeight();
  return spaceBelow < panelHeight + 16 && spaceAbove > spaceBelow ? "top" : "bottom";
}

// ---------------------------------------------------------------------------
// Scroll / time stores (useSyncExternalStore keeps SSR and hydration safe)
// ---------------------------------------------------------------------------

const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  window.addEventListener("resize", cb);
  return () => {
    window.removeEventListener("scroll", cb);
    window.removeEventListener("resize", cb);
  };
};

/** True once the page has scrolled past `threshold` px. */
export function useScrolled(threshold = 8) {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

/** True once `ref`'s top edge reaches the bottom of the fixed header. */
export function useStuckUnderHeader(ref: RefObject<HTMLElement | null>) {
  const getSnapshot = useCallback(() => {
    const el = ref.current;
    return el ? el.getBoundingClientRect().top <= headerHeight() : false;
  }, [ref]);
  return useSyncExternalStore(subscribeScroll, getSnapshot, () => false);
}

const noopSubscribe = () => () => {};

/**
 * Today's date as "YYYY-MM-DD" in the visitor's time zone, or null while
 * server rendering (the server's "today" may be a different day).
 */
export function useTodayKey() {
  return useSyncExternalStore(noopSubscribe, () => toISODate(new Date()), () => null);
}

// ---------------------------------------------------------------------------
// Overlay behaviour
// ---------------------------------------------------------------------------

export type DismissReason = "escape" | "outside";

/** Calls `onDismiss` on Escape or on a pointer press outside `ref`. */
export function useDismiss(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  onDismiss: (reason: DismissReason) => void,
) {
  const dismiss = useEffectEvent(onDismiss);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) dismiss("outside");
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss("escape");
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, ref]);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab focus inside `ref` while open, closes on Escape, focuses
 * `initialFocus` (or the first focusable element) on open and gives focus
 * back to whatever had it before on close.
 */
export function useFocusTrap(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  onEscape: () => void,
  initialFocus?: RefObject<HTMLElement | null>,
) {
  const escape = useEffectEvent(onEscape);

  useEffect(() => {
    const container = ref.current;
    if (!open || !container) return;
    const previous = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
      );

    const frame = requestAnimationFrame(() => {
      const target = initialFocus?.current ?? focusables()[0] ?? container;
      target.focus({ preventScroll: true });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        escape();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !container.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !container.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [open, ref, initialFocus]);
}

let scrollLocks = 0;

/** Stops page scrolling (native and Lenis) while `locked`. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    scrollLocks += 1;
    if (scrollLocks === 1) {
      document.documentElement.style.overflow = "hidden";
      getLenis()?.stop();
    }
    return () => {
      scrollLocks -= 1;
      if (scrollLocks === 0) {
        document.documentElement.style.overflow = "";
        getLenis()?.start();
      }
    };
  }, [locked]);
}

// ---------------------------------------------------------------------------
// "Book Now"
// ---------------------------------------------------------------------------

export const BOOK_NOW_EVENT = "resort:book-now";

/**
 * "Book Now": asks the booking bar on this page to take over (scroll + focus
 * on desktop, open the sheet on mobile); on pages without one, go home.
 */
export function useBookNow() {
  const router = useRouter();
  return useCallback(() => {
    if (document.getElementById(BOOKING_ANCHOR_ID)) {
      window.dispatchEvent(new Event(BOOK_NOW_EVENT));
    } else {
      router.push(`/#${BOOKING_ANCHOR_ID}`);
    }
  }, [router]);
}
