import SiteShell from "@/components/layout/SiteShell";

/** Every public page gets the site header, footer and scroll behaviour. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
