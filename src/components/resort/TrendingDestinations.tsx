import Image from "next/image";
import { MapPin, TrendingUp } from "lucide-react";
import { TRENDING_DESTINATIONS } from "@/config/destinations";
import { cn } from "./lib/cn";
import { formatBDT } from "./lib/format";

/*
 * Bento gallery layout (4 columns on desktop, 2 on mobile):
 *   [ 0 big  ][1][2]
 *   [ 0 big  ][3][4]
 *   [ 5 wide ][6][7]
 */
const TILE_LAYOUT: Record<number, string> = {
  0: "col-span-2 row-span-2",
  5: "col-span-2",
};

/** Home page: "Trending destinations" gallery, under the property-type slider. Data: src/config/destinations.ts. */
export default function TrendingDestinations() {
  return (
    <section
      aria-labelledby="trending-title"
      className="mx-auto max-w-site px-4 pt-16 pb-4 sm:px-6 lg:px-8 lg:pt-24"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
        <div className="max-w-2xl">
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] text-sand-dark uppercase">
            <TrendingUp className="size-4" aria-hidden />
            Where everyone&apos;s going
          </p>
          <h2
            id="trending-title"
            className="font-resort-serif text-3xl font-semibold text-slate-900 sm:text-4xl"
          >
            Trending destinations
          </h2>
          {/* <p className="mt-3 text-base leading-relaxed text-slate-600">
            The most-booked places this season, from sea beaches to cloud-top hills.
          </p> */}
        </div>
      </div>

      <ul className="grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 md:grid-cols-4 lg:auto-rows-[230px]">
        {TRENDING_DESTINATIONS.map((d, i) => {
          const big = i === 0;
          return (
            <li
              key={d.id}
              className={cn(
                "group relative isolate overflow-hidden rounded-3xl bg-brand-dark shadow-[0_18px_40px_-24px_rgba(10,66,56,0.6)]",
                TILE_LAYOUT[i],
              )}
            >
              <Image
                src={d.image}
                alt={`${d.name}, ${d.region}`}
                fill
                unoptimized
                sizes={
                  big
                    ? "(min-width:768px) 50vw, 100vw"
                    : "(min-width:768px) 25vw, 50vw"
                }
                className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-colors duration-500 group-hover:from-brand-dark/90"
              />

              <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-dark shadow-sm backdrop-blur sm:top-4 sm:left-4">
                #{i + 1}
                {big && <span className="font-semibold"> Most popular</span>}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <h3
                  className={cn(
                    "font-semibold leading-tight",
                    big
                      ? "font-resort-serif text-3xl sm:text-4xl"
                      : "text-lg sm:text-xl",
                  )}
                >
                  {d.name}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-white/80 sm:text-sm">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  {d.region}
                </p>
                {big && (
                  <p className="mt-3 max-w-sm text-sm text-white/85 sm:text-base">
                    {d.highlight}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                  <span className="rounded-full bg-white/15 px-2.5 py-0.5 ring-1 ring-white/20 backdrop-blur">
                    {d.properties} stays
                  </span>
                  <span className="text-white/85">
                    from{" "}
                    <span className="font-semibold text-sand">
                      {formatBDT(d.priceFrom)}
                    </span>
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
