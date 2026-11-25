import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Phone, SlidersHorizontal } from "lucide-react";
import { PROPERTY_TYPES, STAYS_HREF, getPropertyType } from "@/config/propertyTypes";
import { RESORT, whatsappUrl } from "@/config/resort";
import StayCard from "@/components/resort/StayCard";
import CategoryTabs from "@/components/resort/CategoryTabs";
import { WhatsAppIcon } from "@/components/resort/ui";
import { formatBDT, plural } from "@/components/resort/lib/format";

const TYPES_ANCHOR = "property-types";

/** One page per entry in PROPERTY_TYPES: /stays/hotels, /stays/villas, … */
export const dynamicParams = false;
export function generateStaticParams() {
  return PROPERTY_TYPES.map((t) => ({ type: t.slug }));
}

export default async function PropertyTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const propertyType = getPropertyType(type);
  if (!propertyType) notFound();

  const { name, icon: Icon, description, image, listings } = propertyType;
  const lowest = Math.min(...listings.map((l) => l.priceFrom));
  const avgRating = listings.reduce((sum, l) => sum + l.rating, 0) / listings.length;

  return (
    <div className="font-resort bg-white text-slate-700">
      {/* Banner */}
      <section className="relative isolate overflow-hidden bg-brand-dark">
        <Image src={image} alt="" fill priority unoptimized sizes="100vw" className="-z-10 object-cover opacity-60" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark via-brand-dark/60 to-brand-dark/0" />

        <div className="mx-auto max-w-site px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/70">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <ChevronRight className="size-4" aria-hidden />
              <li>
                <Link href={STAYS_HREF} className="hover:text-white">
                  Rooms &amp; Villas
                </Link>
              </li>
              <ChevronRight className="size-4" aria-hidden />
              <li aria-current="page" className="font-medium text-white">
                {name}
              </li>
            </ol>
          </nav>

          <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-sand text-brand-dark shadow-lg">
            <Icon className="size-7" aria-hidden />
          </span>
          <h1 className="font-resort-serif max-w-2xl text-4xl font-semibold text-white sm:text-5xl">{name}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{description}</p>

          <dl className="mt-8 flex flex-wrap gap-3">
            {[
              ["Properties", String(listings.length)],
              ["From", `${formatBDT(lowest)}/night`],
              ["Avg. rating", `${avgRating.toFixed(1)} / 5`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
                <dt className="text-xs text-white/65">{label}</dt>
                <dd className="text-lg font-semibold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Type switcher. Switching type lands here (just under the fixed header), not at the page top. */}
      <div id={TYPES_ANCHOR} data-scroll-under-header className="border-b border-slate-200 bg-white">
        <CategoryTabs activeSlug={type} anchor={TYPES_ANCHOR} />
      </div>

      {/* Listings */}
      <section className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {plural(listings.length, "property", "properties")} available
          </h2>
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <SlidersHorizontal className="size-4" aria-hidden />
            Sorted by: <span className="font-medium text-slate-800">Recommended</span>
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((stay) => (
            <StayCard key={stay.id} stay={stay} />
          ))}
        </div>

        {/* Help CTA */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand-50 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="font-resort-serif text-2xl font-semibold text-slate-900">Not sure which one to pick?</h2>
            <p className="mt-2 text-slate-600">Tell us your dates and group size — we&apos;ll suggest the best match.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${RESORT.phoneTel}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              <Phone className="size-4" aria-hidden /> Call {RESORT.phoneDisplay}
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
