"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CardSlider from "@/components/common/slider/CardSlider";
import {
  PROPERTY_TYPES,
  propertyTypeHref,
  type PropertyType,
} from "@/config/propertyTypes";
import { unsplash } from "@/config/resort";
import { plural } from "./lib/format";

// Narrower tiles than the beach-trip cards, so more types fit on screen.
const BREAKPOINTS = {
  0: { slidesPerView: 2.2, spaceBetween: 12 },
  560: { slidesPerView: 3.2, spaceBetween: 14 },
  900: { slidesPerView: 4, spaceBetween: 16 },
  1100: { slidesPerView: 5, spaceBetween: 18, slidesPerGroup: 2 },
  1360: { slidesPerView: 6, spaceBetween: 20, slidesPerGroup: 2 },
};

function PropertyTypeTile({
  type: { slug, name, icon: Icon, tagline, image, listings },
}: {
  type: PropertyType;
}) {
  return (
    <Link
      href={propertyTypeHref(slug)}
      className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-brand-dark shadow-[0_18px_40px_-22px_rgba(10,66,56,0.6)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sand/70"
    >
      <Image
        src={unsplash(image)}
        alt=""
        fill
        unoptimized
        sizes="(min-width:1280px) 16vw, (min-width:768px) 33vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      {/* Brand-tinted scrim: darker at the bottom for legible text, deepens on hover. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/35 to-transparent transition-opacity duration-500 group-hover:from-brand-dark group-hover:via-brand-dark/60"
      />

      <span className="absolute top-3 left-3 grid size-10 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors duration-300 group-hover:bg-sand group-hover:text-brand-dark sm:top-4 sm:left-4">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="absolute top-3 right-3 grid size-9 -translate-y-1 rotate-[-45deg] place-items-center rounded-full bg-white text-brand-dark opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:rotate-0 group-hover:opacity-100 sm:top-4 sm:right-4">
        <ArrowUpRight className="size-[18px]" aria-hidden />
      </span>

      <span className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
        <span className="block text-lg font-semibold sm:text-xl">{name}</span>
        <span className="mt-0.5 block text-sm text-white/75">
          {plural(listings.length, "property", "properties")}
        </span>
        {/* Tagline slides open on hover (always visible on touch screens). */}
        <span className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-focus-visible:grid-rows-[1fr]">
          <span className="overflow-hidden">
            <span className="mt-3 block border-t border-white/20 pt-3 text-xs leading-relaxed text-white/85 sm:text-[13px]">
              {tagline}
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}

/**
 * Home page, right under the hero: a slider of tall image tiles, one per
 * property type, with arrows centred on the left/right edges. Each tile links
 * to /stays/<slug>. Data: src/config/propertyTypes.ts.
 */
export default function PropertyTypeSection() {
  return (
    <section
      aria-label="Browse by property type"
      className="mx-auto max-w-site px-4 pt-16 pb-4 sm:px-6 lg:px-8 lg:pt-24"
    >
      <CardSlider
        items={PROPERTY_TYPES}
        getKey={(t) => t.slug}
        renderItem={(t) => <PropertyTypeTile type={t} />}
        eyebrow="Find your kind of stay"
        title="Browse by property type"
        headerAlign="left"
        navPosition="sides"
        breakpoints={BREAKPOINTS}
        ariaLabel="Property types"
      />
    </section>
  );
}
