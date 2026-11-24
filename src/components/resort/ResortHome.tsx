import { BedDouble, Coffee, Dumbbell, Gift, Mail, MapPin, Phone, Sparkles, Sun, Users, Utensils, Wifi } from "lucide-react";
import { RESORT, ROOMS } from "@/config/resort";
import Hero from "./Hero";
import { formatBDT } from "./lib/format";

/**
 * Demo page (the "App"): hero + booking bar, then enough dummy content to
 * test the sticky header and the pinned booking bar.
 */

const OFFERS = [
  { title: "Weekend Escape", detail: "2 nights + breakfast + lake boat ride", price: 19900, tag: "Save 15%" },
  { title: "Honeymoon Package", detail: "Candle-lit dinner, spa for two, late checkout", price: 32500, tag: "Popular" },
  { title: "Family Fun Days", detail: "Kids stay & eat free, activity pass included", price: 41000, tag: "Kids free" },
];

const FACILITIES = [
  { icon: Sun, name: "Infinity pool" },
  { icon: Sparkles, name: "Spa & wellness" },
  { icon: Utensils, name: "Lakeside restaurant" },
  { icon: Coffee, name: "Tea lounge" },
  { icon: Dumbbell, name: "Fitness studio" },
  { icon: Wifi, name: "Free high-speed Wi-Fi" },
  { icon: Users, name: "Kids' club" },
  { icon: Gift, name: "Event lawn" },
];

const GALLERY_TONES = [
  "from-emerald-700 to-teal-900",
  "from-amber-300 to-orange-500",
  "from-sky-500 to-cyan-800",
  "from-lime-600 to-emerald-900",
  "from-stone-400 to-stone-700",
  "from-teal-500 to-emerald-800",
];

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-sand-dark uppercase">{eyebrow}</p>
      <h2 className="font-resort-serif text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
      {intro && <p className="mt-3 text-base leading-relaxed text-slate-600">{intro}</p>}
    </div>
  );
}

export default function ResortHome() {
  return (
    <div className="font-resort bg-white text-slate-700">
      <Hero />

      <section id="rooms" className="mx-auto max-w-7xl scroll-mt-40 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Stay"
          title="Rooms & Villas"
          intro="Every room opens onto greenery or water. Rates are per night, including breakfast and taxes."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ROOMS.map((room, i) => (
            <article
              key={room.id}
              id={`room-${room.id}`}
              className="group scroll-mt-40 overflow-hidden rounded-xl bg-white shadow-[0_12px_40px_-18px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5"
            >
              <div className={`grid aspect-[4/3] place-items-center bg-gradient-to-br ${GALLERY_TONES[i]}`}>
                <BedDouble className="size-12 text-white/70 transition-transform duration-300 group-hover:scale-110" aria-hidden />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{room.description}</p>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-sm text-slate-500">
                    from <span className="text-lg font-bold text-brand">{formatBDT(room.priceFrom)}</span>/night
                  </p>
                  <p className="text-xs text-slate-500">Sleeps {room.sleeps}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="offers" className="scroll-mt-40 bg-brand-50/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading eyebrow="Offers" title="Offers & Packages" />
          <div className="grid gap-6 md:grid-cols-3">
            {OFFERS.map((offer) => (
              <article key={offer.title} className="rounded-xl bg-white p-6 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.3)]">
                <span className="inline-block rounded-full bg-sand/25 px-3 py-1 text-xs font-semibold text-brand-dark">
                  {offer.tag}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{offer.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{offer.detail}</p>
                <p className="mt-5 text-sm text-slate-500">
                  <span className="text-2xl font-bold text-brand">{formatBDT(offer.price)}</span> per package
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="facilities" className="mx-auto max-w-7xl scroll-mt-40 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading eyebrow="Unwind" title="Facilities" intro="Everything you need, nothing you don't." />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {FACILITIES.map(({ icon: Icon, name }) => (
            <li key={name} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="text-sm font-medium text-slate-800">{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="gallery" className="scroll-mt-40 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading eyebrow="Look around" title="Gallery" />
          <div className="grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-3">
            {GALLERY_TONES.map((tone, i) => (
              <div
                key={tone}
                className={`rounded-xl bg-gradient-to-br ${tone} ${i === 0 ? "row-span-2" : ""}`}
                role="img"
                aria-label={`Gallery placeholder ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl scroll-mt-40 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading eyebrow="Get in touch" title="Contact" />
        <ul className="grid gap-4 md:grid-cols-3">
          <li className="flex gap-3 rounded-xl border border-slate-200 p-5">
            <MapPin className="size-5 shrink-0 text-brand" aria-hidden />
            <span className="text-sm">{RESORT.address}</span>
          </li>
          <li className="flex gap-3 rounded-xl border border-slate-200 p-5">
            <Phone className="size-5 shrink-0 text-brand" aria-hidden />
            <a href={`tel:${RESORT.phoneTel}`} className="text-sm font-medium hover:text-brand">
              {RESORT.phoneDisplay}
            </a>
          </li>
          <li className="flex gap-3 rounded-xl border border-slate-200 p-5">
            <Mail className="size-5 shrink-0 text-brand" aria-hidden />
            <a href={`mailto:${RESORT.email}`} className="text-sm font-medium hover:text-brand">
              {RESORT.email}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
