"use client";

import { useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import type { SwiperOptions } from "swiper/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

import { cn } from "@/utils/helpers/cn";

/**
 * Generic horizontal card slider (Swiper). Pass any list plus a renderItem
 * function — rooms, villas, offers, reviews… The header with prev/next arrows
 * is built in; leave `title` empty to render just the track.
 */
type Props<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string | number;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  /** Optional link/button rendered next to the arrows (e.g. "View all"). */
  headerExtra?: ReactNode;
  autoplay?: boolean;
  /** White text for dark backgrounds. */
  light?: boolean;
  breakpoints?: SwiperOptions["breakpoints"];
  ariaLabel?: string;
  /** "header": arrows beside the title. "sides": arrows centred on the left/right edges of the track. */
  navPosition?: "header" | "sides";
  headerAlign?: "left" | "center";
  className?: string;
};

// Mobile shows one card plus a peek of the next so it's obvious the row
// scrolls; larger screens show whole cards with arrow navigation.
const DEFAULT_BREAKPOINTS: SwiperOptions["breakpoints"] = {
  0: { slidesPerView: 1.2, spaceBetween: 14 },
  560: { slidesPerView: 2.15, spaceBetween: 16 },
  900: { slidesPerView: 3, spaceBetween: 20, slidesPerGroup: 1 },
  1280: { slidesPerView: 4, spaceBetween: 24, slidesPerGroup: 2 },
};

function NavButton({
  dir,
  disabled,
  onClick,
  light,
  floating = false,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  light?: boolean;
  floating?: boolean;
}) {
  const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous slides" : "Next slides"}
      className={cn(
        "grid size-11 place-items-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2",
        floating
          ? // Centred on the track edges: solid white disc that hides at either end.
            cn(
              "absolute top-[calc(50%-1rem)] z-10 size-12 -translate-y-1/2 border-white bg-white text-brand-dark shadow-[0_10px_30px_-8px_rgba(15,23,42,0.45)] hover:scale-105 hover:border-brand hover:bg-brand hover:text-white",
              dir === "prev" ? "left-1 md:-left-6" : "right-1 md:-right-6",
              "disabled:scale-90 disabled:opacity-0",
            )
          : cn(
              light
                ? "border-white/30 text-white hover:border-white hover:bg-white hover:text-brand-dark"
                : "border-slate-300 text-slate-700 hover:border-brand hover:bg-brand hover:text-white",
              "disabled:opacity-35",
            ),
        "disabled:pointer-events-none",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}

export default function CardSlider<T>({
  items,
  renderItem,
  getKey,
  title,
  eyebrow,
  subtitle,
  headerExtra,
  autoplay = false,
  light = false,
  breakpoints = DEFAULT_BREAKPOINTS,
  ariaLabel,
  navPosition = "header",
  headerAlign = "left",
  className,
}: Props<T>) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [edges, setEdges] = useState({ isBeginning: true, isEnd: false });

  const syncEdges = (s: SwiperInstance) =>
    setEdges({ isBeginning: s.isBeginning, isEnd: s.isEnd });

  return (
    <div className={cn("relative w-full", className)}>
      {(title || headerExtra) && (
        <div
          className={cn(
            "mb-8 flex flex-wrap items-end gap-6 md:mb-10",
            headerAlign === "center"
              ? "flex-col items-center text-center"
              : "justify-between",
          )}
        >
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-sand-dark uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className={cn(
                  "font-resort-serif text-3xl font-semibold sm:text-4xl",
                  light ? "text-white" : "text-slate-900",
                )}
              >
                {title}
              </h2>
            )}
            {/* {subtitle && (
              <p
                className={cn(
                  "mt-3 text-base leading-relaxed",
                  light ? "text-white/75" : "text-slate-600",
                )}
              >
                {subtitle}
              </p>
            )} */}
          </div>
          {(headerExtra || navPosition === "header") && (
            <div className="flex items-center gap-3">
              {headerExtra}
              {navPosition === "header" && (
                <>
                  <NavButton
                    dir="prev"
                    light={light}
                    disabled={edges.isBeginning}
                    onClick={() => swiper?.slidePrev()}
                  />
                  <NavButton
                    dir="next"
                    light={light}
                    disabled={edges.isEnd}
                    onClick={() => swiper?.slideNext()}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <Swiper
          onSwiper={(s) => {
            setSwiper(s);
            syncEdges(s);
          }}
          onSlideChange={syncEdges}
          onResize={syncEdges}
          onReachBeginning={syncEdges}
          onReachEnd={syncEdges}
          modules={[Pagination, Autoplay, Keyboard, A11y]}
          breakpoints={breakpoints}
          pagination={{ type: "progressbar" }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          autoplay={
            autoplay
              ? {
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          speed={600}
          grabCursor
          aria-label={ariaLabel ?? title}
          style={
            {
              "--swiper-theme-color": "var(--color-sand)",
              "--swiper-pagination-progressbar-bg-color": light
                ? "rgba(255,255,255,0.15)"
                : "rgba(15,23,42,0.08)",
              "--swiper-pagination-progressbar-size": "3px",
            } as React.CSSProperties
          }
          // Room for the card hover lift / shadow, and the progress bar sits below the cards.
          className="card-slider !-mx-2 !px-2 !pt-2 !pb-10 [&_.swiper-pagination-progressbar]:!top-auto [&_.swiper-pagination-progressbar]:!bottom-0 [&_.swiper-pagination-progressbar]:rounded-full"
        >
          {items.map((item, i) => (
            <SwiperSlide key={getKey(item, i)} className="!h-auto">
              {renderItem(item, i)}
            </SwiperSlide>
          ))}
        </Swiper>
        {navPosition === "sides" && (
          <>
            <NavButton
              floating
              dir="prev"
              disabled={edges.isBeginning}
              onClick={() => swiper?.slidePrev()}
            />
            <NavButton
              floating
              dir="next"
              disabled={edges.isEnd}
              onClick={() => swiper?.slideNext()}
            />
          </>
        )}
      </div>
    </div>
  );
}
