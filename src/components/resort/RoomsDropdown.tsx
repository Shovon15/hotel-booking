"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PROPERTY_TYPES, STAYS_HREF, lowestPrice, propertyTypeHref } from "@/config/propertyTypes";
import { formatBDT } from "./lib/format";
import { useDismiss } from "./lib/hooks";
import { cn } from "./lib/cn";

const HOVER_CLOSE_DELAY = 160;

/**
 * "Rooms & Villas" menu item: opens on hover (pointer) or click/keyboard.
 * Lists every category from categories.json, linking to /stays/<slug>.
 */
export default function RoomsDropdown({ tone }: { tone: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const inStays = pathname === STAYS_HREF || pathname.startsWith(`${STAYS_HREF}/`);
  const rootRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const panelId = useId();

  const close = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  useDismiss(open, rootRef, (reason) => close(reason === "escape"));

  const items = () => Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);

  const openAndFocus = (index: "first" | "last") => {
    setOpen(true);
    // The panel is always mounted (for the fade), so it can take focus now.
    requestAnimationFrame(() => {
      const links = items();
      (index === "first" ? links[0] : links[links.length - 1])?.focus();
    });
  };

  const onTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openAndFocus("first");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAndFocus("last");
    }
  };

  const onPanelKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const links = items();
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? links.length - 1
          : (current + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
    links[next]?.focus();
  };

  return (
    <li
      ref={rootRef}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        window.clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        closeTimer.current = window.setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY);
      }}
      onBlur={(e) => {
        // Tabbing out of the menu closes it.
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "inline-flex h-11 items-center gap-1 rounded-full px-3 text-[15px] font-medium transition-colors duration-200",
          tone === "light" ? "text-white/90 hover:text-white" : "text-slate-700 hover:text-brand",
          inStays && (tone === "light" ? "text-white" : "text-brand"),
        )}
      >
        Rooms &amp; Villas
        <ChevronDown
          aria-hidden
          className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* pt-3 bridges the gap so the pointer can travel into the panel */}
      <div
        ref={panelRef}
        id={panelId}
        inert={!open}
        onKeyDown={onPanelKeyDown}
        className={cn(
          "absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-xl bg-white p-2 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.25)] ring-1 ring-slate-900/5">
          <ul aria-label="Room types" className="grid grid-cols-2 gap-0.5">
            {PROPERTY_TYPES.map((type) => {
              const href = propertyTypeHref(type.slug);
              const active = pathname === href;
              const Icon = type.icon;
              return (
                <li key={type.slug}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-brand-50 focus-visible:bg-brand-50 focus-visible:outline-none",
                      active && "bg-brand-50",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-lg transition-colors",
                        active ? "bg-brand text-white" : "bg-brand-50 text-brand group-hover:bg-white",
                      )}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">{type.name}</span>
                      <span className="block text-xs text-slate-500">
                        from <span className="font-semibold text-brand">{formatBDT(lowestPrice(type))}</span>/night
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={STAYS_HREF}
            aria-current={pathname === STAYS_HREF ? "page" : undefined}
            onClick={() => setOpen(false)}
            className="mt-1 flex min-h-11 items-center justify-between rounded-lg border-t border-slate-100 px-3 pt-2 text-sm font-semibold text-brand hover:bg-brand-50 focus-visible:bg-brand-50 focus-visible:outline-none"
          >
            View all rooms &amp; villas
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </li>
  );
}
