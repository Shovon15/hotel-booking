"use client";

import { useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowUpDown, ChevronDown, SearchX, SlidersHorizontal, X } from "lucide-react";
import { ALL_ROOMS, PROPERTY_TYPES } from "@/config/propertyTypes";
import { cn } from "../lib/cn";
import { plural } from "../lib/format";
import { useFocusTrap, useScrollLock } from "../lib/hooks";
import {
  SORT_OPTIONS,
  activeFilterCount,
  defaultFilters,
  facetValues,
  filterRooms,
  priceBounds,
  type AvailabilityFilters,
  type AvailabilitySearch,
  type SortValue,
} from "../lib/availability";
import FilterPanel, { type FacetOptions } from "./FilterPanel";
import RoomResultCard from "./RoomResultCard";

const subscribeNothing = () => () => {};

const FACETS: FacetOptions = {
  views: facetValues(ALL_ROOMS, (r) => r.view),
  beds: facetValues(ALL_ROOMS, (r) => r.bed),
  mealPlans: facetValues(ALL_ROOMS, (r) => r.mealPlan),
  amenities: facetValues(ALL_ROOMS, (r) => r.amenities),
};
const BOUNDS = priceBounds(ALL_ROOMS);

/** Results list (left) + filter column (right). Filters live in local state. */
export default function AvailabilityResults({
  search,
  initialCategory,
}: {
  search: AvailabilitySearch;
  initialCategory: string;
}) {
  const defaults = useMemo(() => defaultFilters(ALL_ROOMS), []);
  const [filters, setFilters] = useState<AvailabilityFilters>(() => ({ ...defaults, category: initialCategory }));
  const [sheetOpen, setSheetOpen] = useState(false);
  const sortId = useId();

  const { results, availableCount } = useMemo(() => filterRooms(ALL_ROOMS, filters, search), [filters, search]);
  const activeCount = activeFilterCount(filters, defaults);
  const reset = () => setFilters({ ...defaults, sort: filters.sort, showUnavailable: filters.showUnavailable });

  // Option counts: how many bookable rooms each option would give, with every OTHER filter applied.
  const counts = (key: keyof FacetOptions | "category", value: string) => {
    if (key === "category") {
      return filterRooms(ALL_ROOMS, { ...filters, category: value, showUnavailable: false }, search).availableCount;
    }
    const field = { views: "view", beds: "bed", mealPlans: "mealPlan", amenities: "amenities" } as const;
    const others = { ...filters, [key]: key === "amenities" ? filters.amenities.filter((a) => a !== value) : [] };
    return filterRooms(ALL_ROOMS, { ...others, showUnavailable: false }, search).results.filter(({ room }) => {
      const v = room[field[key]];
      return Array.isArray(v) ? v.includes(value) : v === value;
    }).length;
  };

  const panel = (
    <FilterPanel
      filters={filters}
      onChange={setFilters}
      onReset={reset}
      activeCount={activeCount}
      categories={PROPERTY_TYPES}
      facets={FACETS}
      bounds={BOUNDS}
      counts={counts}
    />
  );

  const categoryName = PROPERTY_TYPES.find((c) => c.slug === filters.category)?.name;

  return (
    <div className="mx-auto max-w-site px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Results */}
        <section aria-labelledby="results-heading" className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="results-heading" className="text-xl font-semibold text-slate-900" aria-live="polite">
                {plural(availableCount, "stay", "stays")} available
              </h2>
              <p className="text-sm text-slate-500">{categoryName ?? "All categories"}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                aria-haspopup="dialog"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand lg:hidden"
              >
                <SlidersHorizontal className="size-4" aria-hidden />
                Filters
                {activeCount > 0 && (
                  <span className="rounded-full bg-brand px-1.5 text-xs text-white">{activeCount}</span>
                )}
              </button>

              <label htmlFor={sortId} className="sr-only">
                Sort by
              </label>
              <div className="relative">
                <ArrowUpDown aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
                <select
                  id={sortId}
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value as SortValue })}
                  className="h-11 appearance-none rounded-full border border-slate-300 bg-white pr-9 pl-10 text-sm font-semibold text-slate-800 hover:border-brand focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>

          {results.length > 0 ? (
            <ul className="space-y-5">
              {results.map(({ room, unavailable }) => (
                <li key={room.id}>
                  <RoomResultCard room={room} search={search} unavailable={unavailable} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-3xl bg-brand-50 px-6 py-16 text-center">
              <SearchX className="size-10 text-brand" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No stays match these filters</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-600">
                Try widening the price range, picking another category or clearing a few filters.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Filters — right column on desktop */}
        <aside
          aria-label="Filters"
          data-lenis-prevent
          className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white p-6 ring-1 ring-slate-200 lg:block"
        >
          {panel}
        </aside>
      </div>

      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} resultCount={availableCount}>
        {panel}
      </FilterSheet>
    </div>
  );
}

/** Mobile / tablet: the same filters in a bottom sheet. */
function FilterSheet({
  open,
  onClose,
  resultCount,
  children,
}: {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
  useFocusTrap(open, panelRef, onClose);
  useScrollLock(open);

  if (!mounted) return null;
  return createPortal(
    <div
      inert={!open}
      className={cn("fixed inset-0 z-[75] transition-[visibility] duration-250 lg:hidden", open ? "visible" : "invisible")}
    >
      <div
        aria-hidden
        onClick={onClose}
        className={cn("absolute inset-0 bg-slate-950/50 transition-opacity duration-250", open ? "opacity-100" : "opacity-0")}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col rounded-t-3xl bg-white transition-transform duration-250 ease-out focus:outline-none motion-reduce:transition-none",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 pr-2 pl-5">
          <h2 id={titleId} className="text-base font-semibold text-slate-900">
            Filter stays
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="grid size-11 place-items-center rounded-full text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>
        <div className="shrink-0 border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-xl bg-brand text-base font-semibold text-white hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Show {plural(resultCount, "stay", "stays")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
