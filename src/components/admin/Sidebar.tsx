"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ExternalLink, Palmtree } from "lucide-react";
import { ADMIN_BRAND, ADMIN_NAV, ADMIN_USER, type AdminNavItem } from "@/config/adminSidebar";
import { cn } from "@/components/resort/lib/cn";

export const isActivePath = (pathname: string, href: string) =>
  href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

function NavLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: AdminNavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand",
        collapsed && "justify-center px-0",
        active
          ? "bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "text-white/65 hover:bg-white/[0.06] hover:text-white",
      )}
    >
      {/* Active indicator */}
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-0 h-5 w-1 -translate-x-[3px] -translate-y-1/2 rounded-full bg-sand transition-all duration-200",
          active ? "opacity-100" : "h-0 opacity-0",
        )}
      />
      <Icon
        aria-hidden
        className={cn(
          "size-[18px] shrink-0 transition-colors duration-200",
          active ? "text-sand" : "text-white/55 group-hover:text-white",
        )}
      />
      <span className={cn("truncate", collapsed && "sr-only")}>{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            "rounded-full text-[10px] font-bold",
            collapsed
              ? "absolute top-1.5 right-1.5 size-2 bg-sand p-0 text-transparent"
              : "ml-auto bg-sand px-2 py-0.5 text-brand-dark",
          )}
        >
          {collapsed ? <span className="sr-only">{item.badge}</span> : item.badge}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  onNavigate,
  mobile = false,
}: {
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#062b24] text-white">
      {/* Decorative glows */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-16 size-64 rounded-full bg-brand/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-sand/15 blur-3xl" />

      <div className={cn("relative flex h-[72px] shrink-0 items-center gap-3 px-5", collapsed && "justify-center px-0")}>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sand to-sand-dark text-brand-dark shadow-[0_8px_20px_-8px_rgba(217,179,108,0.8)]">
          <Palmtree className="size-5" aria-hidden />
        </span>
        <div className={cn("min-w-0", collapsed && "sr-only")}>
          <p className="font-resort-serif truncate text-lg leading-tight font-semibold">{ADMIN_BRAND.name}</p>
          <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{ADMIN_BRAND.subtitle}</p>
        </div>
      </div>

      <nav aria-label="Admin" className="relative flex-1 overflow-y-auto px-3 pt-2 pb-4">
        {ADMIN_NAV.map((group) => (
          <div key={group.title} className="mb-5">
            <p
              className={cn(
                "mb-2 px-3 text-[10px] font-bold tracking-[0.16em] text-white/35 uppercase",
                collapsed && "sr-only",
              )}
            >
              {group.title}
            </p>
            {collapsed && <div aria-hidden className="mx-auto mb-2 h-px w-6 bg-white/10" />}
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    active={isActivePath(pathname, item.href)}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="relative shrink-0 space-y-3 border-t border-white/10 p-3">
        {!collapsed && (
          <div className="rounded-2xl bg-gradient-to-br from-white/[0.10] to-white/[0.03] p-4 ring-1 ring-white/10">
            <p className="text-xs font-medium text-white/60">Tonight&apos;s occupancy</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">82%</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-sand to-sand-dark" />
            </div>
            <Link
              href="/"
              target="_blank"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sand hover:text-white"
            >
              View website <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          </div>
        )}

        <div className={cn("flex items-center gap-3 rounded-xl p-2", collapsed && "justify-center")}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-xs font-bold ring-2 ring-sand/60">
            {ADMIN_USER.initials}
          </span>
          <div className={cn("min-w-0 flex-1", collapsed && "sr-only")}>
            <p className="truncate text-sm font-semibold">{ADMIN_USER.name}</p>
            <p className="truncate text-xs text-white/50">{ADMIN_USER.role}</p>
          </div>
        </div>

        {!mobile && onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
          >
            <ChevronsLeft className={cn("size-4 transition-transform duration-200", collapsed && "rotate-180")} aria-hidden />
            {!collapsed && "Collapse"}
          </button>
        )}
      </div>
    </div>
  );
}
