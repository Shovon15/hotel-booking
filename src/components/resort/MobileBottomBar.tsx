"use client";

import { CalendarCheck } from "lucide-react";
import { whatsappUrl } from "@/config/resort";
import { useBookNow } from "./lib/hooks";
import { WhatsAppIcon } from "./ui";

/** Mobile only: fixed [WhatsApp] [Book Now] bar, 50/50. */
export default function MobileBottomBar() {
  const bookNow = useBookNow();
  return (
    <>
      {/* Keeps the end of the page (footer) clear of the fixed bar. */}
      <div aria-hidden className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.2)] backdrop-blur-md md:hidden">
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#1FA855]/30 bg-[#1FA855]/10 text-[15px] font-semibold text-[#137a3c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <WhatsAppIcon className="size-5" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={bookNow}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-sand text-[15px] font-bold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <CalendarCheck className="size-5" aria-hidden />
          Book Now
        </button>
      </div>
    </>
  );
}
