import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, RESORT, ROOMS, whatsappUrl } from "@/config/resort";
import { formatBDT } from "./lib/format";
import SectionLink from "./SectionLink";
import { WhatsAppIcon } from "./ui";

const linkClass =
  "rounded text-sm text-white/70 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-semibold tracking-[0.16em] text-sand uppercase">{title}</h2>
      {children}
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="font-resort bg-brand-dark text-white">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:px-8 lg:py-16">
        <div>
          <Link
            href="/"
            className="font-resort-serif rounded text-2xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
          >
            {RESORT.name}
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            A lakeside retreat in {RESORT.location} with villas, an infinity pool and tea-garden trails.
          </p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
          >
            <WhatsAppIcon className="size-5 text-[#25D366]" />
            Chat on WhatsApp
          </a>
        </div>

        <Column title="Explore">
          <ul className="space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <SectionLink id={link.id} className={linkClass}>
                  {link.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Rooms">
          <ul className="space-y-2.5">
            {ROOMS.map((room) => (
              <li key={room.id}>
                <SectionLink id={`room-${room.id}`} className={linkClass}>
                  {room.name}
                  <span className="ml-1.5 text-white/45">from {formatBDT(room.priceFrom)}</span>
                </SectionLink>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Contact">
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sand" aria-hidden />
              <span>{RESORT.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-sand" aria-hidden />
              <a href={`tel:${RESORT.phoneTel}`} className={linkClass}>
                {RESORT.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-sand" aria-hidden />
              <a href={`mailto:${RESORT.email}`} className={linkClass}>
                {RESORT.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-sand" aria-hidden />
              <span>Check-in 2:00 PM · Check-out 12:00 PM</span>
            </li>
          </ul>
        </Column>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-site flex-col gap-3 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} {RESORT.name}. All rights reserved.</p>
          <ul className="flex gap-5">
            <li>
              <a href="#" className="hover:text-white">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
            </li>
            <li>
              <a href="#" className="hover:text-white">Cancellation Policy</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
