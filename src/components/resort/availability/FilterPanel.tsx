"use client";

import { useId, type ReactNode } from "react";
import { Check, ChevronDown, Star, Umbrella } from "lucide-react";
import type { PropertyType } from "@/config/propertyTypes";
import { cn } from "../lib/cn";
import { formatBDT } from "../lib/format";
import type { AvailabilityFilters } from "../lib/availability";

export type FacetOptions = {
  views: string[];
  beds: string[];
  mealPlans: string[];
  amenities: string[];
};

type Props = {
  filters: AvailabilityFilters;
  onChange: (next: AvailabilityFilters) => void;
  onReset: () => void;
  activeCount: number;
  categories: PropertyType[];
  facets: FacetOptions;
  bounds: { min: number; max: number };
  /** Rooms per category / view / … for the current search, shown beside each option. */
  counts: (key: keyof FacetOptions | "category", value: string) => number;
};

const PRICE_STEP = 500;
const RATINGS = [0, 4, 4.5, 4.8];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-slate-200 py-5 first:border-t-0 first:pt-0">
      <legend className="float-left mb-3 w-full text-sm font-semibold text-slate-900">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function CheckOption({
  label,
  checked,
  onToggle,
  count,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  count?: number;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-sm text-slate-700">
      <input type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-1",
          checked ? "border-brand bg-brand text-white" : "border-slate-300 bg-white group-hover:border-brand/60",
        )}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-slate-400 tabular-nums">{count}</span>}
    </label>
  );
}

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

/** Right-hand filter column on desktop; the body of the filter sheet on mobile. */
export default function FilterPanel({
  filters,
  onChange,
  onReset,
  activeCount,
  categories,
  facets,
  bounds,
  counts,
}: Props) {
  const categoryId = useId();
  const minId = useId();
  const maxId = useId();
  const set = <K extends keyof AvailabilityFilters>(key: K, value: AvailabilityFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const span = bounds.max - bounds.min || 1;
  const left = ((filters.minPrice - bounds.min) / span) * 100;
  const right = 100 - ((filters.maxPrice - bounds.min) / span) * 100;

  const thumb =
    "pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand [&::-moz-range-thumb]:bg-white focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-brand/25";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-resort-serif text-xl font-semibold text-slate-900">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-brand px-2 py-0.5 align-middle font-sans text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0}
          className="text-sm font-semibold text-brand underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
        >
          Clear all
        </button>
      </div>

      <Section title="Room category">
        <label htmlFor={categoryId} className="sr-only">
          Room category
        </label>
        <div className="relative">
          <select
            id={categoryId}
            value={filters.category}
            onChange={(e) => set("category", e.target.value)}
            className="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white pr-10 pl-4 text-sm font-medium text-slate-900 transition-colors hover:border-brand/60 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({counts("category", c.slug)})
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-slate-500" />
        </div>
      </Section>

      <Section title="Price per night">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-900 tabular-nums">
          <span>{formatBDT(filters.minPrice)}</span>
          <span>
            {formatBDT(filters.maxPrice)}
            {filters.maxPrice === bounds.max && "+"}
          </span>
        </div>
        <div className="relative mt-3 h-6">
          <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-slate-200" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand"
            style={{ left: `${left}%`, right: `${right}%` }}
          />
          <label htmlFor={minId} className="sr-only">
            Minimum price per night
          </label>
          <input
            id={minId}
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={PRICE_STEP}
            value={filters.minPrice}
            aria-valuetext={formatBDT(filters.minPrice)}
            onChange={(e) => set("minPrice", Math.min(Number(e.target.value), filters.maxPrice - PRICE_STEP))}
            className={thumb}
          />
          <label htmlFor={maxId} className="sr-only">
            Maximum price per night
          </label>
          <input
            id={maxId}
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={PRICE_STEP}
            value={filters.maxPrice}
            aria-valuetext={formatBDT(filters.maxPrice)}
            onChange={(e) => set("maxPrice", Math.max(Number(e.target.value), filters.minPrice + PRICE_STEP))}
            className={thumb}
          />
        </div>
      </Section>

      <Section title="Beach view">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-sky-50 px-4 py-3 ring-1 ring-sky-100">
          <span className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
            <Umbrella className="size-5 text-sky-600" aria-hidden />
            Beach view only
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={filters.beachViewOnly}
            onChange={(e) => set("beachViewOnly", e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2",
              filters.beachViewOnly ? "bg-brand" : "bg-slate-300",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
                filters.beachViewOnly && "translate-x-5",
              )}
            />
          </span>
        </label>
      </Section>

      <Section title="View">
        {facets.views.map((v) => (
          <CheckOption
            key={v}
            label={`${v} view`}
            checked={filters.views.includes(v)}
            onToggle={() => set("views", toggle(filters.views, v))}
            count={counts("views", v)}
          />
        ))}
      </Section>

      <Section title="Guest rating">
        <div className="grid grid-cols-4 gap-2">
          {RATINGS.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={filters.minRating === r}
              onClick={() => set("minRating", r)}
              className={cn(
                "flex h-10 items-center justify-center gap-1 rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                filters.minRating === r
                  ? "border-brand bg-brand text-white"
                  : "border-slate-300 text-slate-700 hover:border-brand/60",
              )}
            >
              {r === 0 ? (
                "Any"
              ) : (
                <>
                  {r}+ <Star className="size-3.5 fill-current" aria-hidden />
                </>
              )}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Meal plan">
        {facets.mealPlans.map((m) => (
          <CheckOption
            key={m}
            label={m}
            checked={filters.mealPlans.includes(m)}
            onToggle={() => set("mealPlans", toggle(filters.mealPlans, m))}
            count={counts("mealPlans", m)}
          />
        ))}
      </Section>

      <Section title="Booking policy">
        <CheckOption
          label="Free cancellation"
          checked={filters.freeCancellation}
          onToggle={() => set("freeCancellation", !filters.freeCancellation)}
        />
      </Section>

      <Section title="Bed type">
        {facets.beds.map((b) => (
          <CheckOption
            key={b}
            label={b === "Multiple" ? "Multiple beds" : `${b} bed`}
            checked={filters.beds.includes(b)}
            onToggle={() => set("beds", toggle(filters.beds, b))}
            count={counts("beds", b)}
          />
        ))}
      </Section>

      <Section title="Amenities">
        {facets.amenities.map((a) => (
          <CheckOption
            key={a}
            label={a}
            checked={filters.amenities.includes(a)}
            onToggle={() => set("amenities", toggle(filters.amenities, a))}
            count={counts("amenities", a)}
          />
        ))}
      </Section>

      <Section title="Availability">
        <CheckOption
          label="Show sold-out & unsuitable rooms"
          checked={filters.showUnavailable}
          onToggle={() => set("showUnavailable", !filters.showUnavailable)}
        />
      </Section>
    </div>
  );
}
