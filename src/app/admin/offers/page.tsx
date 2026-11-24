import { CalendarClock, Plus, TicketPercent } from "lucide-react";
import { Button, PageHeader, shortDate } from "@/components/admin/ui";
import Toggle from "@/components/admin/Toggle";
import { OFFERS } from "@/components/admin/mockData";
import { cn } from "@/components/resort/lib/cn";

export default function OffersPage() {
  return (
    <>
      <PageHeader
        title="Offers & Packages"
        description="Promo codes guests can apply in the booking bar."
        actions={
          <Button variant="accent" icon={Plus}>
            Create offer
          </Button>
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        {OFFERS.map((offer) => (
          <article
            key={offer.id}
            className={cn(
              "relative overflow-hidden rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_16px_40px_-16px_rgba(15,23,42,0.22)]",
              offer.active ? "border-slate-200/70" : "border-dashed border-slate-300 bg-slate-50/60",
            )}
          >
            {/* Ticket notches */}
            <span aria-hidden className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full border border-slate-200/70 bg-[#f4f6f5]" />
            <span aria-hidden className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full border border-slate-200/70 bg-[#f4f6f5]" />

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-xl",
                    offer.active ? "bg-gradient-to-br from-sand to-sand-dark text-brand-dark" : "bg-slate-200 text-slate-500",
                  )}
                >
                  <TicketPercent className="size-6" aria-hidden />
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">{offer.title}</h2>
                  <p className="text-2xl font-bold tracking-tight text-brand">{offer.discount}</p>
                </div>
              </div>
              <Toggle label={`${offer.title} active`} defaultChecked={offer.active} hideLabel />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4 text-sm">
              <code className="rounded-lg bg-brand-50 px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-brand-dark">
                {offer.code}
              </code>
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <CalendarClock className="size-4" aria-hidden />
                Until {shortDate(offer.validTill)}
              </span>
              <span className="text-slate-500">
                <span className="font-semibold text-slate-900 tabular-nums">{offer.redemptions}</span> redeemed
              </span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
