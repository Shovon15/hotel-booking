"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Ticket } from "lucide-react";
import { NAV_LINKS, RESORT, whatsappUrl } from "@/config/resort";
import { useBookNow, useScrolled } from "./lib/hooks";
import RoomsDropdown from "./RoomsDropdown";
import MyBookingModal from "./MyBookingModal";
import MobileDrawer from "./MobileDrawer";
import SectionLink from "./SectionLink";
import { WhatsAppIcon } from "./ui";
import { cn } from "./lib/cn";

/**
 * Fixed top navigation. Transparent over the home hero, solid white with a
 * shadow once the page scrolls (and always on other pages).
 */
export default function Header() {
  const isHome = usePathname() === "/";
  const scrolled = useScrolled(8);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const bookNow = useBookNow();

  const solid = !isHome || scrolled;
  const tone = solid ? "dark" : "light";

  const iconBtn = cn(
    "inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2",
    solid
      ? "text-slate-700 hover:bg-slate-100 hover:text-brand focus-visible:ring-brand"
      : "text-white hover:bg-white/15 focus-visible:ring-white",
  );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-[90] rounded-lg bg-white px-4 py-2 font-semibold text-brand shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "font-resort fixed inset-x-0 top-0 z-50 h-16 transition-[background-color,box-shadow,border-color] duration-200 ease-out md:h-20",
          solid
            ? "border-b border-slate-200/70 bg-white shadow-[0_4px_20px_-8px_rgba(15,23,42,0.18)]"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-full max-w-site items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label={`${RESORT.name} — home`}
            className={cn(
              "font-resort-serif mr-auto shrink-0 rounded-md text-xl font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 md:text-2xl xl:mr-0",
              solid ? "text-brand focus-visible:ring-brand" : "text-white focus-visible:ring-white",
            )}
          >
            {RESORT.name}
          </Link>

          <nav aria-label="Main" className="mx-auto hidden xl:block">
            <ul className="flex items-center gap-0.5">
              <RoomsDropdown tone={tone} />
              {NAV_LINKS.slice(1).map((link) => (
                <li key={link.id}>
                  <SectionLink
                    id={link.id}
                    className={cn(
                      "inline-flex h-11 items-center rounded-full px-3 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2",
                      solid
                        ? "text-slate-700 hover:text-brand focus-visible:ring-brand"
                        : "text-white/90 hover:text-white focus-visible:ring-white",
                    )}
                  >
                    {link.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1 md:gap-1.5">
            <a href={`tel:${RESORT.phoneTel}`} aria-label={`Call ${RESORT.phoneDisplay}`} className={iconBtn}>
              <Phone className="size-5" aria-hidden />
              <span className="hidden 2xl:inline">{RESORT.phoneDisplay}</span>
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp (opens in a new tab)"
              className={cn(iconBtn, "hidden md:inline-flex")}
            >
              <WhatsAppIcon className="size-5" />
            </a>
            {/* Decorative divider between the contact icons and the booking actions. */}
            <span
              aria-hidden
              className={cn(
                "mx-1.5 hidden h-7 w-px bg-gradient-to-b from-transparent to-transparent transition-colors duration-200 md:block",
                solid ? "via-slate-300" : "via-white/50",
              )}
            />
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={bookingOpen}
              onClick={() => setBookingOpen(true)}
              className={cn(iconBtn, "hidden px-3 md:inline-flex")}
            >
              <Ticket className="size-5 lg:hidden" aria-hidden />
              <span className="sr-only lg:not-sr-only">My Booking</span>
            </button>
            <button
              type="button"
              onClick={bookNow}
              className="ml-1 hidden h-11 items-center rounded-full bg-sand px-5 text-[15px] font-bold text-brand-dark shadow-[0_8px_20px_-10px_rgba(191,146,67,0.9)] transition-colors duration-200 hover:bg-sand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand md:inline-flex"
            >
              Book Now
            </button>
            <button
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className={cn(iconBtn, "xl:hidden")}
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Pages other than home start below the fixed header. */}
      {!isHome && <div aria-hidden className="h-16 md:h-20" />}

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onMyBooking={() => {
          setDrawerOpen(false);
          setBookingOpen(true);
        }}
        onBookNow={() => {
          setDrawerOpen(false);
          // After the drawer's scroll lock is released.
          requestAnimationFrame(bookNow);
        }}
      />
      <MyBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
