/**
 * Admin sidebar — edit this file to add, remove, rename or reorder menu items.
 *
 * - `href` must match a folder under src/app/admin (e.g. "/admin/bookings"
 *   → src/app/admin/bookings/page.tsx).
 * - `icon` is any icon from https://lucide.dev/icons (import it below).
 * - `badge` (optional) shows a small count/label next to the item.
 */
import {
  BedDouble,
  CalendarCheck,
  LayoutDashboard,
  Layers,
  MessageSquareQuote,
  Settings,
  TicketPercent,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const ADMIN_BRAND = {
  name: "Resort Name",
  subtitle: "Admin Console",
};

export const ADMIN_USER = {
  name: "Admin User",
  role: "Front Office Manager",
  initials: "AU",
};

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Reservations",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck, badge: 12 },
      { label: "Rooms & Villas", href: "/admin/rooms", icon: BedDouble },
      { label: "Categories", href: "/admin/categories", icon: Layers },
      { label: "Guests", href: "/admin/guests", icon: Users },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Offers & Packages", href: "/admin/offers", icon: TicketPercent },
      { label: "Reviews", href: "/admin/reviews", icon: MessageSquareQuote, badge: "New" },
    ],
  },
  {
    title: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];
