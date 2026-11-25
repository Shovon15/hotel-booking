import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Phone, Star, Users } from "lucide-react";
import {
  PROPERTY_TYPES,
  lowestPrice,
  propertyTypeHref,
} from "@/config/propertyTypes";
import {
  BOOKING_ANCHOR_ID,
  HERO_IMAGE,
  RESORT,
  whatsappUrl,
} from "@/config/resort";
import { WhatsAppIcon } from "@/components/resort/ui";
import { formatBDT, plural } from "@/components/resort/lib/format";

export const metadata: Metadata = {
  title: "Rooms & Villas",
  description:
    "Every room, suite, villa and cottage at the resort — compare categories and find your stay.",
};

const allListings = PROPERTY_TYPES.flatMap((t) => t.listings);
const STATS = [
  ["Categories", String(PROPERTY_TYPES.length)],
  ["Rooms & villas", String(allListings.length)],
  [
    "From",
    `${formatBDT(Math.min(...allListings.map((l) => l.priceFrom)))}/night`,
  ],
];

/** /stays — index of every category; each card opens /stays/<slug>. */
export default function StaysPage() {
  return (
    <div className="font-resort bg-white text-slate-700">
      {/* Banner */}
      <section className="relative isolate overflow-hidden bg-brand-dark">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="-z-10 object-cover opacity-60"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark via-brand-dark/60 to-brand-dark/0"
        />

        <div className="mx-auto max-w-site px-4 pt-28 pb-14 sm:px-6 md:pt-36 md:pb-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/70">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <ChevronRight className="size-4" aria-hidden />
              <li aria-current="page" className="font-medium text-white">
                Rooms &amp; Villas
              </li>
            </ol>
          </nav>
          <h1 className="font-resort-serif max-w-2xl text-4xl font-semibold text-white sm:text-5xl">
            Rooms &amp; Villas
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            From garden rooms to private pool villas — pick the kind of stay
            that suits you, then choose your room.
          </p>

          <dl className="mt-8 flex flex-wrap gap-3">
            {STATS.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur"
              >
                <dt className="text-xs text-white/65">{label}</dt>
                <dd className="text-lg font-semibold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Categories */}
      <section
        aria-labelledby="categories-heading"
        className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <h2
          id="categories-heading"
          className="mb-8 text-xl font-semibold text-slate-900"
        >
          {plural(PROPERTY_TYPES.length, "category", "categories")}
        </h2>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROPERTY_TYPES.map((type) => {
            const Icon = type.icon;
            const rating =
              type.listings.reduce((s, l) => s + l.rating, 0) /
              type.listings.length;
            const maxSleeps = Math.max(...type.listings.map((l) => l.sleeps));
            return (
              <li key={type.slug}>
                <Link
                  href={propertyTypeHref(type.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_-18px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(15,92,77,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-50">
                    <Image
                      src={type.image}
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent"
                    />
                    <span className="absolute top-3 left-3 grid size-11 place-items-center rounded-xl bg-sand text-brand-dark shadow-md">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-dark shadow-sm">
                      {plural(type.listings.length, "option", "options")}
                    </span>
                    <p className="absolute bottom-3 left-4 text-sm font-medium text-white/90">
                      {type.tagline}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-resort-serif text-xl font-semibold text-slate-900">
                      {type.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {type.description}
                    </p>

                    <p className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Star
                          className="size-4 fill-sand text-sand"
                          aria-hidden
                        />
                        <span className="font-semibold text-slate-800">
                          {rating.toFixed(1)}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-4" aria-hidden /> Up to{" "}
                        {maxSleeps} guests
                      </span>
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <p className="text-sm text-slate-500">
                        from{" "}
                        <span className="block text-xl font-bold text-brand">
                          {formatBDT(lowestPrice(type))}
                        </span>
                        <span className="text-xs">per night</span>
                      </p>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                        Explore
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Help CTA */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand-50 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="font-resort-serif text-2xl font-semibold text-slate-900">
              Know your dates already?
            </h2>
            <p className="mt-2 text-slate-600">
              Check what&apos;s free across every category, or talk to us for a
              suggestion.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/#${BOOKING_ANCHOR_ID}`}
              className="inline-flex items-center gap-2 rounded-full bg-sand px-5 py-3 text-sm font-bold text-brand-dark hover:bg-sand-dark"
            >
              Check availability
            </Link>
            <a
              href={`tel:${RESORT.phoneTel}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              <Phone className="size-4" aria-hidden /> Call{" "}
              {RESORT.phoneDisplay}
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-white px-5 py-3 text-sm font-semibold text-brand hover:border-brand"
            >
              <WhatsAppIcon className="size-4" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
