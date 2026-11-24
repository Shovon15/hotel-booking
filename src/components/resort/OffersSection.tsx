import Image from "next/image";
import { CalendarClock, CircleCheck, Sparkles } from "lucide-react";
import { OFFERS, type Offer } from "@/config/offers";
import { BookOfferButton, CopyCode } from "./OfferActions";
import { formatBDT } from "./lib/format";

const percentOff = (o: Offer) =>
  o.oldPrice ? Math.round((1 - o.price / o.oldPrice) * 100) : 0;

function Price({ offer, size = "lg" }: { offer: Offer; size?: "lg" | "md" }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 leading-none">
      <span
        className={
          size === "lg"
            ? "text-2xl font-bold text-brand"
            : "text-xl font-bold text-brand"
        }
      >
        {formatBDT(offer.price)}
      </span>
      {offer.oldPrice && (
        <span className="text-sm text-slate-400 line-through">
          {formatBDT(offer.oldPrice)}
        </span>
      )}
      <span className="text-xs text-slate-500">{offer.unit}</span>
    </p>
  );
}

/** Big card for the first offer: photo on top (side on desktop), perks, price and CTA. */
function FeaturedOffer({ offer }: { offer: Offer }) {
  const off = percentOff(offer);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] lg:row-span-2 lg:grid lg:grid-cols-[36%_1fr]">
      <div className="relative h-56 overflow-hidden sm:h-64 lg:h-full">
        <Image
          src={offer.image}
          alt=""
          fill
          unoptimized
          sizes="(min-width:1024px) 20vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
        />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-dark shadow">
          <Sparkles className="size-3.5 text-sand-dark" aria-hidden />
          {offer.tag}
        </span>
      </div>
      {off > 0 && (
        // Discount seal: straddles the photo's bottom edge on mobile (top = photo height minus half the seal);
        // sits in the photo's bottom-left corner on desktop, where the photo is beside the text.
        <span className="absolute top-44 right-6 z-10 grid size-24 place-items-center rounded-full bg-sand text-center text-brand-dark shadow-xl ring-8 ring-white sm:top-52 lg:top-auto lg:right-auto lg:bottom-4 lg:left-4 lg:size-[72px] lg:ring-4 lg:ring-white/80">
          <span
            aria-hidden
            className="absolute inset-1.5 animate-[spin_18s_linear_infinite] rounded-full border-2 border-dashed border-brand-dark/25"
          />
          <span className="leading-none">
            <span className="block text-3xl font-extrabold lg:text-xl">
              {off}%
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase">
              off
            </span>
          </span>
        </span>
      )}

      <div className="flex flex-1 flex-col p-6 lg:p-5 xl:p-6">
        <p className="mb-1 inline-flex items-center gap-1.5 pr-28 text-xs text-slate-500 lg:pr-0">
          <CalendarClock className="size-3.5" aria-hidden /> Valid till{" "}
          {offer.validTill}
        </p>
        <h3 className="font-resort-serif pr-28 text-2xl font-semibold text-slate-900 lg:pr-0">
          {offer.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {offer.detail}
        </p>

        <ul className="mt-3 mb-4 grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
          {offer.perks.map((perk) => (
            <li
              key={perk}
              className="flex items-start gap-2 text-sm text-slate-700"
            >
              <CircleCheck
                className="mt-px size-4 shrink-0 text-brand"
                aria-hidden
              />
              {perk}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
          <Price offer={offer} />
          <div className="flex flex-wrap items-center gap-2">
            <CopyCode code={offer.code} />
            <BookOfferButton variant="brand" />
          </div>
        </div>
      </div>
    </article>
  );
}

/** Ticket-style card: photo stub on the left, perforated edge, details on the right. */
function TicketOffer({ offer }: { offer: Offer }) {
  const off = percentOff(offer);
  return (
    <article className="group relative grid overflow-hidden rounded-[24px] bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] sm:grid-cols-[150px_1fr]">
      <div className="relative h-40 overflow-hidden sm:h-auto">
        <Image
          src={offer.image}
          alt=""
          fill
          unoptimized
          sizes="(min-width:640px) 150px, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {off > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-sand px-2.5 py-1 text-xs font-extrabold text-brand-dark shadow">
            -{off}%
          </span>
        )}
      </div>

      {/* Perforation + punched notches between the stub and the body (desktop). */}
      <span
        aria-hidden
        className="absolute top-0 bottom-0 left-[150px] hidden border-l-2 border-dashed border-slate-200 sm:block"
      />
      <span
        aria-hidden
        className="absolute -top-3 left-[138px] hidden size-6 rounded-full bg-brand-dark sm:block"
      />
      <span
        aria-hidden
        className="absolute -bottom-3 left-[138px] hidden size-6 rounded-full bg-brand-dark sm:block"
      />

      <div className="flex flex-col p-4 sm:py-4 sm:pr-5 sm:pl-6">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="text-xs font-semibold tracking-[0.14em] text-sand-dark uppercase">
            {offer.tag}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
            <CalendarClock className="size-3" aria-hidden /> Till{" "}
            {offer.validTill}
          </span>
        </div>
        <h3 className="mt-0.5 text-lg font-semibold text-slate-900">
          {offer.title}
        </h3>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {offer.perks.map((perk) => (
            <li
              key={perk}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
            >
              {perk}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <Price offer={offer} size="md" />
          <CopyCode code={offer.code} />
        </div>
      </div>
    </article>
  );
}

/** Home page "Offers & Packages": dark brand band, featured offer + ticket cards. Data: src/config/offers.ts. */
export default function OffersSection() {
  const [featured, ...rest] = OFFERS;
  if (!featured) return null;

  return (
    <section
      id="offers"
      aria-labelledby="offers-title"
      className="relative isolate scroll-mt-40 overflow-hidden bg-brand-dark"
    >
      {/* Decorative glows + dotted texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 -z-10 size-[520px] rounded-full bg-brand blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-48 -z-10 size-[480px] rounded-full bg-sand/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]"
      />

      {/* Sized to fit one laptop screen (about 1366x768) below the pinned header + booking bar (~146px). */}
      <div className="mx-auto max-w-site px-4 py-16 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 lg:mb-6">
          <div className="max-w-2xl">
            <p className="mb-2.5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-sand uppercase ring-1 ring-white/15">
              <Sparkles className="size-3.5" aria-hidden /> Limited-time deals
            </p>
            <h2
              id="offers-title"
              className="font-resort-serif text-3xl font-semibold text-white sm:text-4xl"
            >
              Offers &amp; <span className="text-sand italic">Packages</span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base lg:hidden">
              Bundled stays with the extras already included. Copy a code and
              apply it in the booking bar.
            </p>
          </div>
          <BookOfferButton label="Check availability" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <FeaturedOffer offer={featured} />
          {rest.map((offer) => (
            <TicketOffer key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
}
