"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Menu, Plus, Search, X } from "lucide-react";
import { ADMIN_NAV, ADMIN_USER } from "@/config/adminSidebar";
import { useFocusTrap, useScrollLock } from "@/components/resort/lib/hooks";
import { cn } from "@/components/resort/lib/cn";
import Sidebar, { isActivePath } from "./Sidebar";

function currentLabel(pathname: string) {
  for (const group of ADMIN_NAV) {
    for (const item of group.items) {
      if (isActivePath(pathname, item.href)) return { group: group.title, label: item.label };
    }
  }
  return { group: "Admin", label: "Page" };
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { group, label } = currentLabel(pathname);

  useFocusTrap(mobileOpen, drawerRef, () => setMobileOpen(false));
  useScrollLock(mobileOpen);

  // Ctrl/Cmd + K focuses the search box.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="font-resort min-h-dvh bg-[#f4f6f5] text-slate-700">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-250 ease-out lg:block",
          collapsed ? "w-[84px]" : "w-[272px]",
        )}
      >
        <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />
      </aside>

      {/* Mobile drawer */}
      <div
        inert={!mobileOpen}
        className={cn("fixed inset-0 z-50 transition-[visibility] duration-250 lg:hidden", mobileOpen ? "visible" : "invisible")}
      >
        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className={cn("absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-250", mobileOpen ? "opacity-100" : "opacity-0")}
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
          tabIndex={-1}
          className={cn(
            "absolute inset-y-0 left-0 w-[280px] max-w-[85vw] shadow-2xl transition-transform duration-250 ease-out focus:outline-none",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Sidebar collapsed={false} mobile onNavigate={() => setMobileOpen(false)} />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="absolute top-4 right-3 grid size-10 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className={cn("transition-[padding] duration-250 ease-out", collapsed ? "lg:pl-[84px]" : "lg:pl-[272px]")}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#f4f6f5]/80 backdrop-blur-xl">
          <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>

            <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex">
              <span className="text-slate-400">{group}</span>
              <ChevronRight className="size-4 text-slate-300" aria-hidden />
              <span className="truncate font-semibold text-slate-900">{label}</span>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <label className="relative hidden md:block">
                <span className="sr-only">Search</span>
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Search bookings, guests…"
                  className="h-10 w-64 rounded-xl border border-slate-200 bg-white pr-14 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition-[width,box-shadow] duration-200 focus:w-80 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none xl:w-72"
                />
                <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                  Ctrl K
                </kbd>
              </label>

              <button
                type="button"
                aria-label="Notifications (3 new)"
                className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:text-brand"
              >
                <Bell className="size-[18px]" aria-hidden />
                <span aria-hidden className="absolute top-2 right-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              <button
                type="button"
                className="hidden h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(15,92,77,0.9)] transition-colors hover:bg-brand-dark sm:inline-flex"
              >
                <Plus className="size-4" aria-hidden />
                New booking
              </button>

              <span
                title={ADMIN_USER.name}
                className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xs font-bold text-white ring-2 ring-white"
              >
                {ADMIN_USER.initials}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
