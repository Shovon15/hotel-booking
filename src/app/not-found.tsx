import type { Metadata } from "next";
import { Compass } from "lucide-react";
import StatusScreen from "@/components/common/fallback/StatusScreen";
import SiteShell from "@/components/layout/SiteShell";
import { BOOKING_ANCHOR_ID } from "@/config/resort";
import routes from "@/config/routes";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** 404. This file sits at the app root (outside the (site) group), so it adds the site chrome itself. */
export default function NotFound() {
  return (
    <SiteShell>
      <StatusScreen
        code="404"
        icon={Compass}
        badge="Page not found"
        title="Looks like you've wandered off the trail"
        description="The page you're looking for has moved or no longer exists. Let's get you back to the lake, the tea gardens and your next stay."
        actions={[
          { label: "Back to home", href: routes.home },
          { label: "Check availability", href: `/#${BOOKING_ANCHOR_ID}`, variant: "secondary" },
        ]}
      />
    </SiteShell>
  );
}
