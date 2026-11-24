import Image from "next/image";
import { Clock } from "lucide-react";
import { FACILITIES, FACILITY_EXTRAS, type Facility } from "@/config/facilities";
import { cn } from "./lib/cn";

const SIZE: Record<Facility["size"], string> = {
  hero: "col-span-2 row-span-2",
  wide: "col-span-2",
  tile: "col-span-1",
};

function FacilityCard({ facility }: { facility: Facility }) {
  const { name, icon: Icon, description, hours, image, size } = facility;
  const big = size !== "tile";
  return (
    <li
      className={cn(
        "group relative isolate overflow-hidden rounded-3xl bg-brand-dark shadow-[0_18px_40px_-22px_rgba(10,66,56,0.6)]",
        SIZE[size],
      )}
    >
      <Image
        src={image}
        alt=""
        fill
        unoptimized
        sizes={size === "hero" ? "(min-width:1024px) 50vw, 100vw" : big ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
        className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent transition-opacity duration-500 group-hover:via-brand-dark/60"
      />

      <span className="absolute top-3 left-3 grid size-10 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors duration-300 group-hover:bg-sand group-hover:text-brand-dark sm:top-4 sm:left-4 sm:size-11">
        <Icon className="size-5" aria-hidden />
      </span>
      <span
        className={cn(
          "absolute top-3 right-3 items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-md sm:top-4 sm:right-4",
          big ? "inline-flex" : "hidden sm:inline-flex",
        )}
      >
        <Clock className="size-3.5" aria-hidden />
        {hours}
      </span>

      <div className={cn("absolute inset-x-0 bottom-0 text-white", size === "hero" ? "p-5 sm:p-8" : "p-4 sm:p-5")}>
        <h3
          className={cn(
            "font-semibold",
            size === "hero" ? "font-resort-serif text-2xl sm:text-4xl" : "text-base sm:text-lg",
          )}
        >
          {name}
        </h3>
        {big ? (
          <p className={cn("mt-1.5 max-w-md text-white/80", size === "hero" ? "text-sm sm:text-base" : "text-sm")}>
            {description}
          </p>
        ) : (
          // Tiles: description slides open on hover (always shown on touch screens).
          <span className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:group-hover:grid-rows-[1fr]">
            <span className="overflow-hidden">
              <span className="mt-1 block text-xs leading-relaxed text-white/80 sm:text-sm">{description}</span>
            </span>
          </span>
        )}
      </div>
    </li>
  );
}

/** Home page facilities: photo bento grid + "also included" chips. */
export default function FacilitiesSection() {
  return (
    <section id="facilities" className="relative scroll-mt-40 overflow-hidden bg-gradient-to-b from-white via-brand-50/60 to-white">
      {/* Soft decorative glow */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-sand/20 blur-3xl" />

      <div className="relative mx-auto max-w-site px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-sand-dark uppercase">Unwind</p>
            <h2 className="font-resort-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
              Facilities made for slow days
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-slate-600">
            Swim, unwind, eat well and play — everything is a short garden walk from your room.
          </p>
        </div>

        <ul className="grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[210px] sm:gap-4 lg:auto-rows-[230px] lg:grid-cols-4">
          {FACILITIES.map((f) => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200 sm:p-6 lg:flex-row lg:items-center">
          <p className="shrink-0 text-sm font-semibold text-slate-900 lg:w-36">Also included</p>
          <ul className="flex flex-wrap gap-2">
            {FACILITY_EXTRAS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-2 text-sm font-medium text-brand-dark"
              >
                <Icon className="size-4 text-brand" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
