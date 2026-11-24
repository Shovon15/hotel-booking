"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { scrollToSection } from "./lib/hooks";

/**
 * Link to a home-page section. On the home page it smooth-scrolls (below the
 * fixed header) without a navigation; elsewhere it goes to "/#id".
 */
export default function SectionLink({
  id,
  className,
  children,
  onNavigate,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const isHome = usePathname() === "/";

  if (!isHome) {
    return (
      <Link href={`/#${id}`} className={className} onClick={onNavigate}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={`#${id}`}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        // The site-wide Lenis anchor handler (useSmoothScroll) also listens on
        // document; we scroll with the header offset ourselves instead.
        e.nativeEvent.stopImmediatePropagation();
        onNavigate?.();
        // Next frame: closing a drawer first releases its scroll lock, and
        // restarting Lenis would cancel a scroll started before that.
        requestAnimationFrame(() => {
          if (scrollToSection(id)) window.history.replaceState(window.history.state, "", `#${id}`);
        });
      }}
    >
      {children}
    </a>
  );
}
