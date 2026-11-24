"use client";

import { useId, useRef, useState } from "react";
import { ChevronDown, Phone, Ticket, X } from "lucide-react";
import { NAV_LINKS, RESORT, ROOMS, whatsappUrl, type LanguageCode } from "@/config/resort";
import { formatBDT } from "./lib/format";
import { useFocusTrap, useScrollLock } from "./lib/hooks";
import { LanguageToggle, WhatsAppIcon } from "./ui";
import SectionLink from "./SectionLink";
import { cn } from "./lib/cn";

/** Slide-in menu for mobile and tablet. */
export default function MobileDrawer({
  open,
  onClose,
  lang,
  onLangChange,
  onMyBooking,
  onBookNow,
}: {
  open: boolean;
  onClose: () => void;
  lang: LanguageCode;
  onLangChange: (code: LanguageCode) => void;
  onMyBooking: () => void;
  onBookNow: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const roomsId = useId();
  const [roomsOpen, setRoomsOpen] = useState(false);

  useFocusTrap(open, panelRef, onClose);
  useScrollLock(open);

  const linkClass =
    "flex min-h-12 items-center rounded-xl px-4 text-base font-medium text-slate-800 transition-colors hover:bg-brand-50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  return (
    <div
      inert={!open}
      className={cn("fixed inset-0 z-[70] transition-[visibility] duration-250", open ? "visible" : "invisible")}
    >
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-slate-950/50 transition-opacity duration-250",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-lenis-prevent
        className={cn(
          "absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-250 ease-out focus:outline-none motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 pr-2 pl-5">
          <p id={titleId} className="font-resort-serif text-xl font-semibold text-brand">
            {RESORT.name}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-full text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                aria-expanded={roomsOpen}
                aria-controls={roomsId}
                onClick={() => setRoomsOpen((v) => !v)}
                className={cn(linkClass, "w-full justify-between")}
              >
                Rooms &amp; Villas
                <ChevronDown
                  aria-hidden
                  className={cn("size-5 text-slate-400 transition-transform duration-200", roomsOpen && "rotate-180")}
                />
              </button>
              <div
                id={roomsId}
                inert={!roomsOpen}
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  roomsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <ul className="overflow-hidden">
                  {ROOMS.map((room) => (
                    <li key={room.id}>
                      <SectionLink
                        id={`room-${room.id}`}
                        onNavigate={onClose}
                        className="ml-4 flex min-h-11 items-center justify-between rounded-lg border-l-2 border-brand-100 px-4 text-[15px] text-slate-700 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        {room.name}
                        <span className="text-xs text-slate-500">
                          from <span className="font-semibold text-brand">{formatBDT(room.priceFrom)}</span>
                        </span>
                      </SectionLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            {NAV_LINKS.slice(1).map((link) => (
              <li key={link.id}>
                <SectionLink id={link.id} onNavigate={onClose} className={linkClass}>
                  {link.label}
                </SectionLink>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-3 border-t border-slate-100 px-1 pt-6">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-medium text-slate-600">Language</span>
              <LanguageToggle value={lang} onChange={onLangChange} />
            </div>
            <button
              type="button"
              onClick={onMyBooking}
              className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-base font-medium text-slate-800 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Ticket className="size-5 text-brand" aria-hidden />
              My Booking
            </button>
            <a href={`tel:${RESORT.phoneTel}`} className={cn(linkClass, "gap-3")}>
              <Phone className="size-5 text-brand" aria-hidden />
              {RESORT.phoneDisplay}
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={cn(linkClass, "gap-3")}>
              <WhatsAppIcon className="size-5 text-[#1FA855]" />
              Chat on WhatsApp
            </a>
          </div>
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onBookNow}
            className="h-12 w-full rounded-xl bg-sand text-base font-semibold text-brand-dark shadow-sm transition-colors hover:bg-sand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
