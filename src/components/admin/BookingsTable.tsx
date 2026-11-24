"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react";
import { cn } from "@/components/resort/lib/cn";
import { formatBDT } from "@/components/resort/lib/format";
import { BOOKINGS, type BookingStatus } from "./mockData";
import { Avatar, BookingStatusBadge, bookingStatusLabel, shortDate } from "./ui";

const FILTERS: ("all" | BookingStatus)[] = ["all", "confirmed", "pending", "checked-in", "checked-out", "cancelled"];

export default function BookingsTable() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const rows = BOOKINGS.filter(
    (b) =>
      (filter === "all" || b.status === filter) &&
      (!q || b.guest.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.room.toLowerCase().includes(q)),
  );
  const count = (f: (typeof FILTERS)[number]) => (f === "all" ? BOOKINGS.length : BOOKINGS.filter((b) => b.status === f).length);

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Filter by status" className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100/80 p-1">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-all duration-150",
                  active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800",
                )}
              >
                {f === "all" ? "All" : bookingStatusLabel(f)}
                <span
                  className={cn(
                    "rounded-md px-1.5 text-[11px] font-semibold tabular-nums",
                    active ? "bg-brand text-white" : "bg-slate-200/80 text-slate-600",
                  )}
                >
                  {count(f)}
                </span>
              </button>
            );
          })}
        </div>
        <label className="relative">
          <span className="sr-only">Search bookings</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Guest, booking ID or room"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-10 text-sm focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none lg:w-72"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="bg-slate-50/60 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th scope="col" className="px-5 py-3">Booking</th>
              <th scope="col" className="px-3 py-3">Room</th>
              <th scope="col" className="px-3 py-3">Check-in</th>
              <th scope="col" className="px-3 py-3">Check-out</th>
              <th scope="col" className="px-3 py-3">Guests</th>
              <th scope="col" className="px-3 py-3">Source</th>
              <th scope="col" className="px-3 py-3 text-right">Amount</th>
              <th scope="col" className="px-3 py-3">Status</th>
              <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((b) => (
              <tr key={b.id} className="transition-colors hover:bg-brand-50/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={b.guest} size="sm" />
                    <div>
                      <p className="font-semibold text-slate-900">{b.guest}</p>
                      <p className="text-xs text-slate-400">
                        {b.id} · {b.phone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-slate-600">{b.room}</td>
                <td className="px-3 py-3.5 whitespace-nowrap text-slate-600">{shortDate(b.checkIn)}</td>
                <td className="px-3 py-3.5 whitespace-nowrap text-slate-600">
                  {shortDate(b.checkOut)} <span className="text-xs text-slate-400">· {b.nights}N</span>
                </td>
                <td className="px-3 py-3.5 text-slate-600 tabular-nums">{b.guests}</td>
                <td className="px-3 py-3.5">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{b.source}</span>
                </td>
                <td className="px-3 py-3.5 text-right font-semibold text-slate-900 tabular-nums">{formatBDT(b.amount)}</td>
                <td className="px-3 py-3.5">
                  <BookingStatusBadge status={b.status} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    aria-label={`Actions for ${b.id}`}
                    className="grid size-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <MoreHorizontal className="size-4" aria-hidden />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-semibold text-slate-900">No bookings found</p>
            <p className="mt-1 text-sm text-slate-500">Try another filter or search term.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
        <p>
          Showing <span className="font-semibold text-slate-900">{rows.length}</span> of {BOOKINGS.length} bookings
        </p>
        <div className="flex gap-1">
          <button type="button" aria-label="Previous page" disabled className="grid size-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-40">
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button type="button" aria-label="Next page" disabled className="grid size-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-40">
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
