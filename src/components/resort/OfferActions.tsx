"use client";

import { useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { cn } from "./lib/cn";
import { useBookNow } from "./lib/hooks";

/** Promo code chip that copies itself to the clipboard. */
export function CopyCode({ code, dark = false }: { code: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the code is still visible to type by hand */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `Code ${code} copied` : `Copy promo code ${code}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-dashed px-3 py-2 font-mono text-sm font-bold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand",
        dark
          ? "border-sand/60 bg-white/5 text-sand hover:bg-white/10"
          : "border-brand/40 bg-brand-50 text-brand-dark hover:bg-brand-100",
      )}
    >
      {code}
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4 opacity-70" aria-hidden />}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}

/** "Book this offer" — hands over to the booking bar (same as the header's Book Now). */
export function BookOfferButton({
  variant = "sand",
  label = "Book this offer",
}: {
  variant?: "sand" | "brand";
  label?: string;
}) {
  const bookNow = useBookNow();
  return (
    <button
      type="button"
      onClick={bookNow}
      className={cn(
        "group/btn inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variant === "sand"
          ? "bg-sand text-brand-dark hover:bg-sand-dark focus-visible:ring-sand focus-visible:ring-offset-brand-dark"
          : "bg-brand text-white hover:bg-brand-dark focus-visible:ring-brand",
      )}
    >
      {label}
      <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden />
    </button>
  );
}
