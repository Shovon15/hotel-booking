import AdminShell from "@/components/admin/AdminShell";

/** /admin — no authentication yet. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
