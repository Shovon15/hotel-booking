"use client";

import { useRef } from "react";
import { Tag, X } from "lucide-react";
import { FieldError } from "./ui";
import { cn } from "./lib/cn";

/** "Have a promo code?" link that expands into a small input. */
export default function PromoField({
  id,
  value,
  onChange,
  open,
  onOpenChange,
  error,
  compact = false,
}: {
  id: string;
  value: string;
  onChange: (next: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error?: string;
  compact?: boolean;
}) {
  // Only the instance the visitor clicked grabs focus when the input appears
  // (the desktop bar and the mobile sheet share this state).
  const focusPending = useRef(false);
  const errorId = `${id}-error`;

  if (!open) {
    return (
      <div className={cn("flex items-center", compact ? "min-h-12" : "min-h-16")}>
        <button
          type="button"
          aria-expanded={false}
          onClick={() => {
            focusPending.current = true;
            onOpenChange(true);
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-brand underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Tag className="size-4" aria-hidden />
          Have a promo code?
        </button>
      </div>
    );
  }

  return (
    <div className={cn("animate-[resort-fade-in_180ms_ease-out]", compact ? "px-1" : "px-2 py-1")}>
      <label htmlFor={id} className="mb-1 block text-[11px] font-semibold tracking-[0.08em] text-slate-500 uppercase">
        Promo code
      </label>
      <div className="relative">
        <Tag className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          ref={(el) => {
            if (el && focusPending.current) {
              focusPending.current = false;
              el.focus();
            }
          }}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="SUMMER25"
          autoComplete="off"
          spellCheck={false}
          maxLength={20}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-11 w-full min-w-0 rounded-lg border bg-white pr-11 pl-9 text-sm font-semibold tracking-wider text-slate-900 uppercase placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 placeholder:normal-case focus:ring-2 focus:outline-none",
            error ? "border-red-400 focus:ring-red-500/30" : "border-slate-300 focus:border-brand focus:ring-brand/30",
          )}
        />
        <button
          type="button"
          aria-label="Remove promo code"
          onClick={() => {
            onChange("");
            onOpenChange(false);
          }}
          className="absolute top-0 right-0 grid size-11 place-items-center rounded-lg text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
