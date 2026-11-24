import { Reply, Star } from "lucide-react";
import { Avatar, Button, Card, PageHeader, shortDate } from "@/components/admin/ui";
import { PercentBars } from "@/components/admin/Charts";
import { REVIEWS } from "@/components/admin/mockData";
import { cn } from "@/components/resort/lib/cn";

const DISTRIBUTION = [
  { label: "5 stars", value: 68 },
  { label: "4 stars", value: 22 },
  { label: "3 stars", value: 7 },
  { label: "2 stars", value: 2 },
  { label: "1 star", value: 1 },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={cn("size-4", n <= rating ? "fill-sand text-sand" : "fill-slate-200 text-slate-200")}
        />
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <PageHeader title="Reviews" description="What guests are saying. Reply to keep the conversation going." />
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card title="Overall rating" className="h-fit">
          <div className="mb-6 flex items-end gap-3">
            <p className="text-5xl font-bold tracking-tight text-slate-900">4.6</p>
            <div className="pb-1">
              <Stars rating={5} />
              <p className="mt-1 text-xs text-slate-500">Based on 312 reviews</p>
            </div>
          </div>
          <PercentBars data={DISTRIBUTION} />
        </Card>

        <div className="space-y-4">
          {REVIEWS.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={r.guest} />
                  <div>
                    <p className="font-semibold text-slate-900">{r.guest}</p>
                    <p className="text-xs text-slate-500">
                      {r.room} · {shortDate(r.date)}
                    </p>
                  </div>
                </div>
                <Stars rating={r.rating} />
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">{r.text}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                {r.replied ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Replied</span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    Awaiting reply
                  </span>
                )}
                <Button variant="ghost" icon={Reply}>
                  Reply
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
