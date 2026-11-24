"use client";

import Image from "next/image";
import { toast } from "sonner";
import { BedDouble, CircleCheck, Coffee, Maximize2, MapPin, Mountain, Star, Users } from "lucide-react";
import type { RoomListing } from "@/config/propertyTypes";
import { cn } from "../lib/cn";
import { formatBDT, plural } from "../lib/format";
import { BEACH_VIEW, type AvailabilitySearch } from "../lib/availability";

const MAX_AMENITIES = 4;

/** Wide card for one room on /availability, with the total for the searched stay. */
export default function RoomResultCard({
  room,
  search,
  unavailable,
}: {
  room: RoomListing;
  search: AvailabilitySearch;
  unavailable: string | null;
}) {
  const total = room.priceFrom * search.nights * search.rooms;
  const hasDates = !!search.checkIn;
  const extraAmenities = room.amenities.length - MAX_AMENITIES;

  const reserve = () => {
    console.log("[Booking] Reserve", { roomId: room.id, ...search, total });
    toast.success(`${room.name} held for you`, {
      description: "Our team will call you shortly to confirm your reservation.",
    });
  };

  return (
    <article
      className={cn(
        "group grid overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_-20px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5 transition-shadow duration-300 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]",
        unavailable ? "opacity-70" : "hover:shadow-[0_24px_50px_-22px_rgba(15,92,77,0.45)]",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-50 sm:aspect-auto sm:min-h-full">
        <Image
          src={room.image}
          alt={`${room.name}, ${room.location}`}
          fill
          unoptimized
          sizes="(min-width:640px) 17rem, 100vw"
          className={cn("object-cover transition-transform duration-700 group-hover:scale-105", unavailable && "grayscale")}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand-dark shadow-sm">
            {room.kind}
          </span>
          {room.tag && (
            <span className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-semibold text-brand-dark shadow-sm">
              {room.tag}
            </span>
          )}
        </div>
        {room.view === BEACH_VIEW && (
          <span className="absolute bottom-3 left-3 rounded-full bg-sky-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            Beach view
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-4 p-5 md:flex-row md:p-6">
        {/* Details */}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <MapPin className="size-3.5" aria-hidden />
            {room.location} · {room.categoryName}
          </p>
          <h3 className="mt-1 text-lg leading-snug font-semibold text-slate-900">{room.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800">
            <Star className="size-4 fill-sand text-sand" aria-hidden />
            {room.rating.toFixed(1)}
            <span className="font-normal text-slate-500">({room.reviews} reviews)</span>
          </p>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600">
            <li className="flex items-center gap-1.5">
              <Users className="size-4 text-slate-400" aria-hidden /> Sleeps {room.sleeps}
            </li>
            <li className="flex items-center gap-1.5">
              <BedDouble className="size-4 text-slate-400" aria-hidden />
              {room.bed === "Multiple" ? "Multiple beds" : `${room.bed} bed`}
            </li>
            <li className="flex items-center gap-1.5">
              <Maximize2 className="size-4 text-slate-400" aria-hidden /> {room.sizeSqft} sq ft
            </li>
            <li className="flex items-center gap-1.5">
              <Mountain className="size-4 text-slate-400" aria-hidden /> {room.view} view
            </li>
          </ul>

          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Amenities">
            {room.amenities.slice(0, MAX_AMENITIES).map((a) => (
              <li key={a} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                {a}
              </li>
            ))}
            {extraAmenities > 0 && (
              <li
                className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500"
                title={room.amenities.slice(MAX_AMENITIES).join(", ")}
              >
                +{extraAmenities} more
              </li>
            )}
          </ul>

          <ul className="mt-3 space-y-1 text-sm">
            <li className="flex items-center gap-1.5 text-slate-700">
              <Coffee className="size-4 text-slate-400" aria-hidden /> {room.mealPlan}
            </li>
            {room.freeCancellation && (
              <li className="flex items-center gap-1.5 font-medium text-emerald-700">
                <CircleCheck className="size-4" aria-hidden /> Free cancellation
              </li>
            )}
          </ul>
        </div>

        {/* Price + action */}
        <div className="flex shrink-0 flex-row items-end justify-between gap-3 border-t border-slate-100 pt-4 md:w-44 md:flex-col md:items-end md:border-t-0 md:border-l md:pt-0 md:pl-5 md:text-right">
          <div>
            {!unavailable && room.roomsLeft <= 2 && (
              <p className="mb-2 text-xs font-semibold text-rose-600">Only {plural(room.roomsLeft, "room", "rooms")} left</p>
            )}
            <p className="text-2xl font-bold text-brand">{formatBDT(room.priceFrom)}</p>
            <p className="text-xs text-slate-500">per night</p>
            {hasDates && (
              <p className="mt-1.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">{formatBDT(total)}</span> total
                <br />
                {plural(search.nights, "night", "nights")}, {plural(search.rooms, "room", "rooms")}
              </p>
            )}
          </div>

          {unavailable ? (
            <p className="max-w-40 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">{unavailable}</p>
          ) : (
            <button
              type="button"
              onClick={reserve}
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Reserve
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
