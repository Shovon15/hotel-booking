import { Mail, MapPin, Navigation, Phone, type LucideIcon } from "lucide-react";
import { RESORT, whatsappUrl } from "@/config/resort";
import { WhatsAppIcon } from "./ui";

const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESORT.address)}`;

function Item({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <li className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-sand ring-1 ring-white/15">
        <Icon className="size-[18px]" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold tracking-[0.12em] text-white/55 uppercase">{label}</span>
        <span className="block text-sm font-medium break-words text-white">{children}</span>
      </span>
    </li>
  );
}

/** Slim contact band: address / phone / email + WhatsApp and directions. */
export default function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-40 bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="relative mx-auto max-w-site overflow-hidden rounded-3xl bg-brand px-6 py-7 shadow-[0_24px_60px_-30px_rgba(10,66,56,0.8)] sm:px-8 lg:py-8">
        <div aria-hidden className="pointer-events-none absolute -top-16 -left-10 size-56 rounded-full bg-sand/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-10 -bottom-20 size-64 rounded-full bg-brand-dark/60 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="shrink-0">
            <p className="text-xs font-semibold tracking-[0.18em] text-sand uppercase">Get in touch</p>
            <h2 id="contact-title" className="font-resort-serif mt-1 text-2xl font-semibold text-white">
              Plan your stay with us
            </h2>
          </div>

          <ul className="flex flex-1 flex-wrap gap-x-8 gap-y-4 lg:border-l lg:border-white/15 lg:pl-10">
            <Item icon={MapPin} label="Visit">
              <span title={RESORT.address}>{RESORT.location}</span>
            </Item>
            <Item icon={Phone} label="Call">
              <a href={`tel:${RESORT.phoneTel}`} className="hover:text-sand">
                {RESORT.phoneDisplay}
              </a>
            </Item>
            <Item icon={Mail} label="Email">
              <a href={`mailto:${RESORT.email}`} className="hover:text-sand">
                {RESORT.email}
              </a>
            </Item>
          </ul>

          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-sand px-5 text-sm font-bold text-brand-dark transition-colors hover:bg-sand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Navigation className="size-4" aria-hidden /> Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
