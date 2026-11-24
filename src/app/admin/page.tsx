import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  CalendarCheck,
  Download,
  LogIn,
  LogOut,
  Percent,
  Star,
  Wallet,
} from "lucide-react";
import { Avatar, BookingStatusBadge, Button, Card, PageHeader, StatCard, shortDate } from "@/components/admin/ui";
import { PercentBars, RevenueChart } from "@/components/admin/Charts";
import { BOOKINGS, OCCUPANCY_BY_TYPE, REVENUE_BY_MONTH, REVIEWS } from "@/components/admin/mockData";
import { formatBDT } from "@/components/resort/lib/format";
import { ADMIN_USER } from "@/config/adminSidebar";

const TODAY = "2026-11-24";

export default function AdminDashboard() {
  const arrivals = BOOKINGS.filter((b) => b.checkIn === TODAY || b.checkIn === "2026-11-25").slice(0, 4);
  const departures = BOOKINGS.filter((b) => b.checkOut === TODAY);
  const recent = BOOKINGS.slice(0, 6);
  const thisMonth = REVENUE_BY_MONTH[REVENUE_BY_MONTH.length - 1].value;
  const lastMonth = REVENUE_BY_MONTH[REVENUE_BY_MONTH.length - 2].value;

  return (
    <>
      <PageHeader
        title={`Good morning, ${ADMIN_USER.name.split(" ")[0]}`}
        description="Here's what's happening at the resort today."
        actions={
          <>
            <Button variant="ghost" icon={Download}>
              Export
            </Button>
            <Button variant="accent" icon={CalendarCheck}>
              New booking
            </Button>
          </>
        }
      />

      {/* Hero strip */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-[#0c5446] to-brand-dark p-6 text-white shadow-[0_24px_48px_-24px_rgba(10,66,56,0.8)] sm:p-8 lg:mb-8">
        <div aria-hidden className="absolute -top-20 -right-10 size-72 rounded-full bg-sand/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-sand uppercase">Monday, 24 November</p>
            <h2 className="font-resort-serif mt-2 text-2xl font-semibold sm:text-3xl">
              {arrivals.length} arrivals and {departures.length} departures today
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/70">
              2 rooms need housekeeping before 2:00 PM check-in. Weather looks clear — great day for the lake tour.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-3">
            {[
              { label: "In-house", value: "18", sub: "guests" },
              { label: "Available", value: "4", sub: "of 9 units" },
              { label: "ADR", value: "৳16.2k", sub: "avg rate" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                <dt className="text-[11px] font-medium text-white/60">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums">{s.value}</dd>
                <dd className="text-[11px] text-white/50">{s.sub}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:mb-8">
        <StatCard
          label="Revenue (Nov)"
          value={formatBDT(thisMonth)}
          delta={((thisMonth - lastMonth) / lastMonth) * 100}
          hint="vs last month"
          icon={Wallet}
        />
        <StatCard label="Bookings" value="142" delta={8.2} hint="this month" icon={CalendarCheck} tone="sand" />
        <StatCard label="Occupancy" value="79%" delta={4.1} hint="30-day average" icon={Percent} tone="sky" />
        <StatCard label="Cancellations" value="6" delta={-12.5} hint="vs last month" icon={BedDouble} tone="rose" />
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-3 lg:mb-8">
        <Card
          title="Monthly revenue"
          description="Last 12 months · hover a column for details"
          className="xl:col-span-2"
          action={
            <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand">
              {formatBDT(REVENUE_BY_MONTH.reduce((s, d) => s + d.value, 0))} total
            </span>
          }
        >
          <RevenueChart data={REVENUE_BY_MONTH} />
        </Card>

        <Card title="Today at the front desk" description="Arrivals & departures">
          <ul className="space-y-1">
            {arrivals.map((b) => (
              <li key={b.id} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50">
                <Avatar name={b.guest} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{b.guest}</p>
                  <p className="truncate text-xs text-slate-500">{b.room}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                  <LogIn className="size-3" aria-hidden /> {b.checkIn === TODAY ? "Today" : "Tomorrow"}
                </span>
              </li>
            ))}
            {departures.map((b) => (
              <li key={b.id} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50">
                <Avatar name={b.guest} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{b.guest}</p>
                  <p className="truncate text-xs text-slate-500">{b.room}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                  <LogOut className="size-3" aria-hidden /> Departing
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card
          title="Recent bookings"
          className="xl:col-span-2"
          bodyClassName="px-0 pb-2 sm:px-0"
          action={
            <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">
              View all <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/60 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <th scope="col" className="px-6 py-3">Guest</th>
                  <th scope="col" className="px-3 py-3">Room</th>
                  <th scope="col" className="px-3 py-3">Stay</th>
                  <th scope="col" className="px-3 py-3 text-right">Amount</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((b) => (
                  <tr key={b.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={b.guest} size="sm" />
                        <div>
                          <p className="font-semibold text-slate-900">{b.guest}</p>
                          <p className="text-xs text-slate-400">{b.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-slate-600">{b.room}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-slate-600">
                      {shortDate(b.checkIn)} – {shortDate(b.checkOut)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-semibold text-slate-900 tabular-nums">{formatBDT(b.amount)}</td>
                    <td className="px-6 py-3.5">
                      <BookingStatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Occupancy by room type" description="This month">
            <PercentBars data={OCCUPANCY_BY_TYPE.map((o) => ({ label: o.type, value: o.value }))} />
          </Card>
          <Card
            title="Latest review"
            action={
              <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-900">
                <Star className="size-4 fill-sand text-sand" aria-hidden /> 4.6
              </span>
            }
          >
            <figure>
              <blockquote className="text-sm leading-relaxed text-slate-600">“{REVIEWS[0].text}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <Avatar name={REVIEWS[0].guest} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{REVIEWS[0].guest}</p>
                  <p className="text-xs text-slate-500">{REVIEWS[0].room}</p>
                </div>
              </figcaption>
            </figure>
          </Card>
        </div>
      </div>
    </>
  );
}
