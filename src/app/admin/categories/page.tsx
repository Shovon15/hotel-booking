import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ExternalLink, FileJson, Layers, ListChecks, Star, Wallet } from "lucide-react";
import { PageHeader, StatCard } from "@/components/admin/ui";
import { PROPERTY_TYPES, propertyTypeHref } from "@/config/propertyTypes";
import { formatBDT } from "@/components/resort/lib/format";

/**
 * Read-only view of src/data/categories.json (the same data the home page
 * "Browse by property type" slider and the /stays/<slug> pages use).
 * No create / edit / delete — change the JSON file to change what shows here.
 */

const stats = (prices: number[]) => ({ min: Math.min(...prices), max: Math.max(...prices) });

export default function CategoriesPage() {
  const allListings = PROPERTY_TYPES.flatMap((c) => c.listings);
  const overall = stats(allListings.map((l) => l.priceFrom));
  const avgRating = allListings.reduce((sum, l) => sum + l.rating, 0) / (allListings.length || 1);

  return (
    <>
      <PageHeader
        title="Categories"
        description="Room & stay categories shown on the website. Read-only — data comes from a JSON file."
      />

      <p className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-brand/30 bg-brand-50/60 px-4 py-3 text-sm text-brand-dark">
        <FileJson className="size-4 shrink-0" aria-hidden />
        Source:
        <code className="rounded-md bg-white px-2 py-0.5 font-mono text-xs ring-1 ring-brand/15">src/data/categories.json</code>
        <span className="text-brand-dark/70">— edit that file to add, rename or reorder categories.</span>
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Categories" value={String(PROPERTY_TYPES.length)} icon={Layers} hint="shown in the home slider" />
        <StatCard label="Listings" value={String(allListings.length)} icon={ListChecks} tone="sky" hint="across all categories" />
        <StatCard
          label="Price range / night"
          value={`${formatBDT(overall.min)}–${formatBDT(overall.max)}`}
          icon={Wallet}
          tone="sand"
        />
        <StatCard label="Average rating" value={`${avgRating.toFixed(2)} / 5`} icon={Star} tone="rose" />
      </div>

      <ul className="space-y-4">
        {PROPERTY_TYPES.map((cat, index) => {
          const Icon = cat.icon;
          const range = stats(cat.listings.map((l) => l.priceFrom));
          const rating = cat.listings.reduce((s, l) => s + l.rating, 0) / (cat.listings.length || 1);
          return (
            <li key={cat.slug}>
              <details className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] open:shadow-[0_16px_40px_-16px_rgba(15,23,42,0.22)]">
                <summary className="flex cursor-pointer list-none items-center gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                  <span className="w-6 shrink-0 text-center text-sm font-semibold text-slate-400 tabular-nums">{index + 1}</span>
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:size-20">
                    <Image src={cat.image} alt="" fill unoptimized sizes="80px" className="object-cover" />
                    <span className="absolute bottom-1 left-1 grid size-6 place-items-center rounded-md bg-white/95 text-brand shadow-sm">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{cat.name}</span>
                      <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">{cat.slug}</code>
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-slate-500">{cat.tagline}</span>
                  </span>

                  <span className="hidden shrink-0 grid-cols-3 gap-6 text-right md:grid">
                    <span>
                      <span className="block text-xs text-slate-500">Listings</span>
                      <span className="font-semibold text-slate-900 tabular-nums">{cat.listings.length}</span>
                    </span>
                    <span>
                      <span className="block text-xs text-slate-500">Price / night</span>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        {formatBDT(range.min)}–{formatBDT(range.max)}
                      </span>
                    </span>
                    <span>
                      <span className="block text-xs text-slate-500">Rating</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-900 tabular-nums">
                        <Star className="size-3.5 fill-sand text-sand" aria-hidden />
                        {rating.toFixed(1)}
                      </span>
                    </span>
                  </span>

                  <ChevronDown
                    className="size-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>

                <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <p className="max-w-2xl text-sm text-slate-600">{cat.description}</p>
                    <Link
                      href={propertyTypeHref(cat.slug)}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand/40 hover:text-brand"
                    >
                      View on site <ExternalLink className="size-3.5" aria-hidden />
                    </Link>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200/70 bg-white">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <caption className="sr-only">{cat.name} listings</caption>
                      <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        <tr>
                          <th scope="col" className="px-4 py-3">Listing</th>
                          <th scope="col" className="px-4 py-3">Area</th>
                          <th scope="col" className="px-4 py-3 text-right">Sleeps</th>
                          <th scope="col" className="px-4 py-3 text-right">Rating</th>
                          <th scope="col" className="px-4 py-3 text-right">From / night</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cat.listings.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-50/70">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                  <Image src={l.image} alt="" fill unoptimized sizes="40px" className="object-cover" />
                                </span>
                                <div>
                                  <p className="font-medium text-slate-900">{l.name}</p>
                                  {l.tag && (
                                    <span className="mt-0.5 inline-block rounded-full bg-sand/20 px-2 py-0.5 text-[11px] font-semibold text-brand-dark">
                                      {l.tag}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{l.location}</td>
                            <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{l.sleeps}</td>
                            <td className="px-4 py-3 text-right tabular-nums">
                              <span className="font-semibold text-slate-900">{l.rating.toFixed(1)}</span>
                              <span className="text-slate-400"> ({l.reviews})</span>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums">
                              {formatBDT(l.priceFrom)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </>
  );
}
