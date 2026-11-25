"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PROPERTY_TYPES, propertyTypeHref } from "@/config/propertyTypes";
import { cn } from "./lib/cn";

type Metrics = {
  /** Visible width ÷ total width (1 = nothing to scroll). */
  ratio: number;
  /** 0 → 1 scroll progress. */
  progress: number;
};

/**
 * Category tabs on /stays/<type>: a horizontally scrolling row with a custom
 * scrollbar (rounded, draggable thumb), fade edges and arrow buttons. The
 * native scrollbar is hidden — Windows draws it with square arrows.
 */
export default function CategoryTabs({ activeSlug, anchor }: { activeSlug: string; anchor: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scrollLeft: number } | null>(null);
  const [m, setM] = useState<Metrics>({ ratio: 1, progress: 0 });

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setM({ ratio: el.clientWidth / el.scrollWidth, progress: max > 0 ? el.scrollLeft / max : 0 });
  }, []);

  // Keep the current category centred: instantly on first load, smoothly when switching.
  const firstCentre = useRef(true);
  useEffect(() => {
    const el = scrollerRef.current;
    const active = el?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el || !active) return;
    el.scrollTo({
      left: active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2,
      behavior: firstCentre.current ? "auto" : "smooth",
    });
    firstCentre.current = false;
  }, [activeSlug]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    measure();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [measure]);

  const scrollable = m.ratio < 0.999;
  const atStart = m.progress <= 0.005;
  const atEnd = m.progress >= 0.995;
  const thumbWidth = Math.max(m.ratio * 100, 8);
  const thumbLeft = m.progress * (100 - thumbWidth);

  const page = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  /* ---- Thumb drag & track click ---- */
  const onThumbDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, scrollLeft: el.scrollLeft };
  };
  const onThumbMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!drag.current || !el || !track) return;
    // Thumb travel (track width minus thumb) maps onto the full scroll range.
    const travel = track.clientWidth * (1 - thumbWidth / 100);
    const max = el.scrollWidth - el.clientWidth;
    el.scrollLeft = drag.current.scrollLeft + ((e.clientX - drag.current.x) / travel) * max;
  };
  const onThumbUp = () => {
    drag.current = null;
  };
  const onTrackDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const rect = track.getBoundingClientRect();
    const p = (e.clientX - rect.left) / rect.width;
    el.scrollTo({ left: p * el.scrollWidth - el.clientWidth / 2, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-brand shadow-[0_4px_14px_-4px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 transition-[opacity,background-color,color] duration-200 hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:grid";

  return (
    <nav aria-label="Property types" className="mx-auto max-w-site px-4 pt-4 pb-3 sm:px-6 lg:px-8">
      <div className="relative">
        {scrollable && (
          <>
            <button
              type="button"
              aria-label="Scroll categories left"
              onClick={() => page(-1)}
              tabIndex={atStart ? -1 : 0}
              className={cn(arrow, "-left-1", atStart && "pointer-events-none opacity-0")}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() => page(1)}
              tabIndex={atEnd ? -1 : 0}
              className={cn(arrow, "-right-1", atEnd && "pointer-events-none opacity-0")}
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            {/* Fade edges hint that there is more to scroll */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 z-[5] w-16 bg-gradient-to-r from-white to-transparent transition-opacity duration-200",
                atStart && "opacity-0",
              )}
            />
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 z-[5] w-16 bg-gradient-to-l from-white to-transparent transition-opacity duration-200",
                atEnd && "opacity-0",
              )}
            />
          </>
        )}

        <div
          ref={scrollerRef}
          data-lenis-prevent
          className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex w-max gap-2 py-1">
            {PROPERTY_TYPES.map((t) => {
              const active = t.slug === activeSlug;
              const Icon = t.icon;
              return (
                <li key={t.slug}>
                  <Link
                    href={`${propertyTypeHref(t.slug)}#${anchor}`}
                    scroll={false}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-slate-200 text-slate-700 hover:border-brand/40 hover:bg-brand-50 hover:text-brand",
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                    {t.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Custom scrollbar (decorative: the row is still scrollable by touch, wheel, keyboard and the arrows) */}
      <div
        ref={trackRef}
        aria-hidden
        onPointerDown={onTrackDown}
        className={cn(
          "group mt-3 h-1.5 cursor-pointer rounded-full bg-brand-50 transition-opacity duration-200",
          scrollable ? "opacity-100" : "invisible opacity-0",
        )}
      >
        <div
          onPointerDown={onThumbDown}
          onPointerMove={onThumbMove}
          onPointerUp={onThumbUp}
          onPointerCancel={onThumbUp}
          style={{ width: `${thumbWidth}%`, transform: `translateX(${(thumbLeft / thumbWidth) * 100}%)` }}
          className="h-full cursor-grab touch-none rounded-full bg-brand/45 transition-colors duration-200 group-hover:bg-brand active:cursor-grabbing"
        />
      </div>
    </nav>
  );
}
