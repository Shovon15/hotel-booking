"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Star, Users } from "lucide-react";
import type { BeachStay } from "@/config/resort";
import { cn } from "./lib/cn";
import { formatBDT } from "./lib/format";
import { useBookNow } from "./lib/hooks";

/** Room / villa card used by the beach-trip slider. */
export default function StayCard({ stay }: { stay: BeachStay }) {
  const [saved, setSaved] = useState(false);
  const bookNow = useBookNow();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_-18px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(15,92,77,0.45)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        <Image
          src={stay.image}
          alt={`${stay.name}, ${stay.location}`}
          fill
          unoptimized
          sizes="(min-width:1280px) 25vw, (min-width:900px) 33vw, (min-width:560px) 50vw, 85vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand-dark shadow-sm backdrop-blur">
            {stay.kind}
          </span>
          {stay.tag && (
            <span className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-semibold text-brand-dark shadow-sm">
              {stay.tag}
            </span>
          )}
        </div>

        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${stay.name} from saved` : `Save ${stay.name}`}
          onClick={() => setSaved((v) => !v)}
          className={cn(
            "absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand",
            saved ? "text-rose-500" : "text-slate-600 hover:text-rose-500",
          )}
        >
          <Heart className={cn("size-[18px]", saved && "fill-rose-500")} aria-hidden />
        </button>

        <p className="absolute bottom-3 left-3 flex items-center gap-1 text-sm font-medium text-white">
          <MapPin className="size-4" aria-hidden />
          {stay.location}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug font-semibold text-slate-900">{stay.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-slate-800">
            <Star className="size-4 fill-sand text-sand" aria-hidden />
            {stay.rating.toFixed(1)}
            <span className="font-normal text-slate-500">({stay.reviews})</span>
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
          <Users className="size-4" aria-hidden />
          Sleeps {stay.sleeps}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-sm text-slate-500">
            from <span className="block text-xl font-bold text-brand">{formatBDT(stay.priceFrom)}</span>
            <span className="text-xs">per night</span>
          </p>
          <button
            type="button"
            onClick={bookNow}
            className="rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Book now
          </button>
        </div>
      </div>
    </article>
  );
}
