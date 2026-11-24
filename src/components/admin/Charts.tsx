"use client";

import { useState } from "react";
import { cn } from "@/components/resort/lib/cn";
import { formatBDT } from "@/components/resort/lib/format";

/** "৳20.5L" — lakh notation for axis labels. */
const lakh = (v: number) => `৳${(v / 100000).toFixed(v % 100000 === 0 ? 0 : 1)}L`;

/**
 * Single-series column chart (one hue, so no legend — the card title names
 * it). Hover/focus a column for its exact value; a visually hidden table
 * carries the same data for screen readers.
 */
export function RevenueChart({ data }: { data: { month: string; value: number }[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value));
  const top = Math.ceil(max / 500000) * 500000;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * top);
  const last = data.length - 1;

  return (
    <div>
      <div className="flex gap-3">
        {/* Y axis */}
        <div className="flex h-64 flex-col-reverse justify-between pb-6 text-right text-[11px] text-slate-400 tabular-nums" aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="-mb-1.5 leading-none">
              {lakh(t)}
            </span>
          ))}
        </div>

        <div className="relative h-64 flex-1">
          {/* Gridlines */}
          <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col-reverse justify-between" aria-hidden>
            {ticks.map((t) => (
              <div key={t} className={cn("border-t", t === 0 ? "border-slate-300" : "border-dashed border-slate-200")} />
            ))}
          </div>

          {/* Columns */}
          <div className="absolute inset-x-0 top-0 bottom-0 flex items-stretch gap-[2px]" onPointerLeave={() => setActive(null)}>
            {data.map((d, i) => {
              const pct = (d.value / top) * 100;
              const isActive = active === i;
              return (
                <div
                  key={d.month}
                  tabIndex={0}
                  role="img"
                  aria-label={`${d.month}: ${formatBDT(d.value)}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group relative flex flex-1 flex-col items-center outline-none"
                >
                  <div className="relative flex w-full flex-1 items-end justify-center pb-6">
                    {/* Hover band (bigger hit target than the bar) */}
                    <div
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 top-0 bottom-6 rounded-lg transition-colors duration-150",
                        isActive ? "bg-brand-50" : "bg-transparent",
                      )}
                    />
                    <div
                      className={cn(
                        "relative w-full max-w-9 rounded-t-[4px] transition-[background-color,height] duration-300 ease-out group-focus-visible:ring-2 group-focus-visible:ring-sand",
                        i === last ? "bg-brand" : isActive ? "bg-brand" : "bg-brand/70",
                      )}
                      style={{ height: `${pct}%` }}
                    />
                    {isActive && (
                      <div className="pointer-events-none absolute z-10 -translate-y-2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-center whitespace-nowrap text-white shadow-lg" style={{ bottom: `calc(${pct}% + 1.5rem)` }}>
                        <p className="text-[10px] text-white/60">{d.month}</p>
                        <p className="text-xs font-semibold tabular-nums">{formatBDT(d.value)}</p>
                      </div>
                    )}
                  </div>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute bottom-0 text-[11px]",
                      i === last || isActive ? "font-semibold text-slate-700" : "text-slate-400",
                    )}
                  >
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>Monthly revenue</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.month}>
              <td>{d.month}</td>
              <td>{formatBDT(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Horizontal percentage bars, one hue, value labelled at the end. */
export function PercentBars({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ul className="space-y-4">
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="font-medium text-slate-700">{d.label}</span>
            <span className="font-semibold text-slate-900 tabular-nums">{d.value}%</span>
          </div>
          <div
            role="meter"
            aria-label={`${d.label} occupancy`}
            aria-valuenow={d.value}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 overflow-hidden rounded-full bg-slate-100"
          >
            <div className="h-full rounded-full bg-gradient-to-r from-brand/80 to-brand" style={{ width: `${d.value}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
