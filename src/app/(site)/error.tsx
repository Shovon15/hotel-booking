"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { CloudRain } from "lucide-react";
import StatusScreen from "@/components/common/fallback/StatusScreen";
import routes from "@/config/routes";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  /** Re-fetches and re-renders the failed segment (Next 16.3+). */
  retry: () => void;
}) {
  useEffect(() => {
    // TODO: send to an error reporting service.
    console.error(error);
  }, [error]);

  // Server errors carry a digest that matches the server log entry.
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest?: string }).digest ?? "")
      : "";

  return (
    <StatusScreen
      code="Oops"
      icon={CloudRain}
      badge="Something went wrong"
      title="A little rain on your plans"
      description="Something unexpected stopped this page from loading. Please try again — if it keeps happening, call or WhatsApp us and we'll help you book."
      actions={[
        { label: "Try again", onClick: () => retry() },
        { label: "Back to home", href: routes.home, variant: "secondary" },
      ]}
      footnote={digest ? <>Error reference: {digest}</> : undefined}
    />
  );
}
