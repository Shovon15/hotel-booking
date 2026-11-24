import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/components/resort/lib/cn";
import type { BookingStatus, RoomStatus } from "./mockData";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6">
          <div>
            {title && <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5 sm:p-6", title && "pt-4 sm:pt-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Button({
  children,
  variant = "primary",
  icon: Icon,
  className,
  type = "button",
}: {
  children: ReactNode;
  variant?: "primary" | "accent" | "ghost";
  icon?: LucideIcon;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-[0.98]",
        variant === "primary" && "bg-brand text-white shadow-sm hover:bg-brand-dark",
        variant === "accent" && "bg-sand text-brand-dark shadow-[0_8px_20px_-10px_rgba(191,146,67,0.9)] hover:bg-sand-dark",
        variant === "ghost" && "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
        className,
      )}
    >
      {Icon && <Icon className="size-4" aria-hidden />}
      {children}
    </button>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  tone = "brand",
}: {
  label: string;
  value: string;
  /** Percent change vs. previous period. */
  delta?: number;
  hint?: string;
  icon: LucideIcon;
  tone?: "brand" | "sand" | "sky" | "rose";
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] transition-shadow duration-200 hover:shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)]">
      <div
        aria-hidden
        className={cn(
          "absolute -top-10 -right-10 size-32 rounded-full opacity-60 blur-2xl transition-opacity group-hover:opacity-90",
          tone === "brand" && "bg-brand-100",
          tone === "sand" && "bg-sand/30",
          tone === "sky" && "bg-sky-100",
          tone === "rose" && "bg-rose-100",
        )}
      />
      <div className="relative flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span
          className={cn(
            "grid size-10 place-items-center rounded-xl",
            tone === "brand" && "bg-brand-50 text-brand",
            tone === "sand" && "bg-sand/20 text-sand-dark",
            tone === "sky" && "bg-sky-50 text-sky-700",
            tone === "rose" && "bg-rose-50 text-rose-600",
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
      <p className="relative mt-2 text-[28px] leading-tight font-bold tracking-tight text-slate-900 tabular-nums">
        {value}
      </p>
      <div className="relative mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold",
              up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
            )}
          >
            {up ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
            {up ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
        )}
        {hint && <span className="text-slate-500">{hint}</span>}
      </div>
    </div>
  );
}

const BOOKING_STATUS: Record<BookingStatus, { label: string; className: string; dot: string }> = {
  confirmed: { label: "Confirmed", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", dot: "bg-emerald-500" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-800 ring-amber-600/20", dot: "bg-amber-500" },
  "checked-in": { label: "Checked in", className: "bg-sky-50 text-sky-700 ring-sky-600/15", dot: "bg-sky-500" },
  "checked-out": { label: "Checked out", className: "bg-slate-100 text-slate-600 ring-slate-500/15", dot: "bg-slate-400" },
  cancelled: { label: "Cancelled", className: "bg-rose-50 text-rose-700 ring-rose-600/15", dot: "bg-rose-500" },
};

export const bookingStatusLabel = (s: BookingStatus) => BOOKING_STATUS[s].label;

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const s = BOOKING_STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1 ring-inset", s.className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

const ROOM_STATUS: Record<RoomStatus, { label: string; className: string; dot: string }> = {
  available: { label: "Available", className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  occupied: { label: "Occupied", className: "bg-sky-50 text-sky-700", dot: "bg-sky-500" },
  cleaning: { label: "Cleaning", className: "bg-amber-50 text-amber-800", dot: "bg-amber-500" },
  maintenance: { label: "Maintenance", className: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const s = ROOM_STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", s.className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

const AVATAR_TONES = [
  "bg-brand-100 text-brand-dark",
  "bg-sand/30 text-[#7a5a1e]",
  "bg-sky-100 text-sky-800",
  "bg-rose-100 text-rose-800",
  "bg-violet-100 text-violet-800",
];

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const tone = AVATAR_TONES[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % AVATAR_TONES.length];
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold",
        size === "sm" ? "size-8 text-xs" : "size-10 text-sm",
        tone,
      )}
    >
      {initials}
    </span>
  );
}

const DATE_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-11-24" → "24 Nov" */
export const shortDate = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${DATE_MONTHS[m - 1]}`;
};
