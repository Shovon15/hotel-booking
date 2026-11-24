import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HERO_IMAGE } from "@/config/resort";
import { getPropertyType } from "@/config/propertyTypes";
import AvailabilityResults from "@/components/resort/availability/AvailabilityResults";
import ModifySearch from "@/components/resort/availability/ModifySearch";
import { parseAvailabilitySearch } from "@/components/resort/lib/availability";

export const metadata: Metadata = {
  title: "Check availability",
  description: "See which rooms, suites and villas are free for your dates and filter by price, view and more.",
  robots: { index: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AvailabilityPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const search = parseAvailabilitySearch(params);
  const categoryParam = Array.isArray(params.category) ? params.category[0] : params.category;
  const initialCategory = categoryParam && getPropertyType(categoryParam) ? categoryParam : "";

  return (
    <div className="font-resort bg-slate-50 text-slate-700">
      {/* Banner + search summary */}
      <section className="relative isolate overflow-hidden bg-brand-dark">
        <Image src={HERO_IMAGE} alt="" fill priority unoptimized sizes="100vw" className="-z-10 object-cover opacity-35" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark via-brand-dark/85 to-brand-dark/40" />

        <div className="mx-auto max-w-site px-4 pt-28 pb-10 sm:px-6 md:pt-32 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/70">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <ChevronRight className="size-4" aria-hidden />
              <li aria-current="page" className="font-medium text-white">
                Availability
              </li>
            </ol>
          </nav>
          <h1 className="font-resort-serif text-3xl font-semibold text-white sm:text-4xl">Available stays</h1>

          {/* Remount on a new search so the modal starts from the URL's values. */}
          <ModifySearch key={JSON.stringify(search)} search={search} />
        </div>
      </section>

      {/* Not keyed by search: filters survive a modified search. */}
      <AvailabilityResults search={search} initialCategory={initialCategory} />
    </div>
  );
}
