import Image from "next/image";
import type { CSSProperties } from "react";
import { BadgePercent, Leaf, MapPin, Star, Waves } from "lucide-react";
import { HERO_IMAGE, RESORT, ROOMS } from "@/config/resort";
import BookingBar from "./BookingBar";
import { formatBDT } from "./lib/format";

const LOWEST_RATE = Math.min(...ROOMS.map((r) => r.priceFrom));

/** Staggered entrance: each block rises in `step` ms after the previous one. */
const rise = (step: number): { className: string; style: CSSProperties } => ({
  className: "animate-[resort-rise_900ms_cubic-bezier(0.22,1,0.36,1)_both]",
  style: { animationDelay: `${150 + step * 120}ms` },
});

const HIGHLIGHTS = [
  { icon: Waves, label: "Infinity pool" },
  { icon: Leaf, label: "Tea-garden trails" },
  { icon: BadgePercent, label: "Best rate, book direct" },
];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative z-20 flex min-h-[680px] flex-col md:min-h-[760px] lg:h-[100svh] lg:min-h-[640px] lg:max-h-[960px]"
    >
      {/* Background: photo with a slow zoom-out, brand-tinted scrims, soft vignette */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-brand-dark">
        <Image
          src={HERO_IMAGE}
          alt="Turquoise pool in front of thatched-roof villas with sun loungers and umbrellas"
          fill
          priority
          // Unsplash already serves a sized, compressed image (see the URL params).
          unoptimized
          sizes="100vw"
          className="animate-[resort-hero-zoom_14s_cubic-bezier(0.22,1,0.36,1)_both] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-brand-dark/20 to-brand-dark/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]" />
        {/* Warm sun-glow behind the headline */}
        <div className="absolute top-1/4 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-sand/20 blur-[120px]" />
      </div>

      {/* Floating glass cards (large screens only, so they never crowd the headline) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[30%] left-8 hidden animate-[resort-float_7s_ease-in-out_infinite] xl:block 2xl:left-16"
      >
        <div className="rounded-2xl bg-white/10 p-4 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur-xl">
          <p className="text-xs text-white/70">Tonight from</p>
          <p className="text-2xl font-bold">{formatBDT(LOWEST_RATE)}</p>
          <p className="text-xs text-white/70">per night · breakfast incl.</p>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] right-8 hidden animate-[resort-float_8s_ease-in-out_1.5s_infinite] xl:block 2xl:right-16"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur-xl">
          <span className="grid size-11 place-items-center rounded-xl bg-sand text-brand-dark">
            <Star className="size-5 fill-brand-dark" />
          </span>
          <div>
            <p className="text-lg leading-tight font-bold">4.9 / 5</p>
            <p className="text-xs text-white/70">Guest rating 2026</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-site flex-1 flex-col items-center justify-center px-4 pt-24 pb-8 text-center sm:px-6 md:pt-28 md:pb-12 lg:px-8 lg:pb-14">
        {/* Social-proof pill */}
        <div
          style={rise(0).style}
          className={`${rise(0).className} mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 py-1.5 pr-4 pl-1.5 text-sm text-white ring-1 ring-white/20 backdrop-blur-md`}
        >
          <span className="flex -space-x-2" aria-hidden>
            {["bg-sand", "bg-emerald-400", "bg-sky-400"].map((c, i) => (
              <span
                key={c}
                className={`grid size-7 place-items-center rounded-full ${c} text-[10px] font-bold text-brand-dark ring-2 ring-brand-dark/40`}
              >
                {["AR", "SK", "MH"][i]}
              </span>
            ))}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Star className="size-4 fill-sand text-sand" aria-hidden />
            4.9
          </span>
          <span className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden />
          <span className="hidden items-center gap-1.5 text-white/85 sm:inline-flex">
            <MapPin className="size-3.5" aria-hidden />
            {RESORT.location}
          </span>
        </div>

        <h1
          id="hero-title"
          style={rise(1).style}
          className={`${rise(1).className} font-resort-serif max-w-5xl text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-[4.25rem] xl:text-7xl`}
        >
          Slow mornings by the water,{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span className="text-sand italic">starlit evenings</span>
            {/* Hand-drawn underline */}
            <svg
              aria-hidden
              viewBox="0 0 300 20"
              preserveAspectRatio="none"
              className="absolute -bottom-3 left-0 h-3 w-full text-brand sm:-bottom-5 sm:h-4 lg:-bottom-6"
            >
              <path
                d="M3 14 C 60 4, 140 2, 297 9"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          in the hills.
        </h1>

        <p
          style={rise(2).style}
          className={`${rise(2).className} mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg`}
        >
          Lakeside villas, an infinity pool and tea-garden trails — two and a
          half hours from Dhaka.
        </p>

        <ul
          style={rise(3).style}
          className={`${rise(3).className} mt-6 flex flex-wrap justify-center gap-2`}
        >
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3.5 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-md sm:text-sm"
            >
              <Icon className="size-4 text-sand" aria-hidden />
              {label}
            </li>
          ))}
        </ul>

        <div
          style={rise(4).style}
          // Opacity-only fade: a transform/filter animation here would make this wrapper the
          // containing block for the pinned (position: fixed) booking bar and break sticking.
          className="mt-8 w-full animate-[resort-fade-in_900ms_ease-out_backwards] text-left md:mt-10"
        >
          <BookingBar />
        </div>
      </div>
    </section>
  );
}
