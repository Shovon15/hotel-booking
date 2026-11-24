"use client";

import { CircleX } from "lucide-react";
import { LANGUAGES, type LanguageCode } from "@/config/resort";
import { cn } from "./lib/cn";

/** WhatsApp glyph (lucide-react ships no brand icons). */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.24-1.37A9.9 9.9 0 1 0 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.23 8.23 0 1 1 6.97 3.85Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.35-2.93c-.25-.44.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.48a.92.92 0 0 0-.66.31 2.78 2.78 0 0 0-.87 2.07 4.83 4.83 0 0 0 1.01 2.56 11.05 11.05 0 0 0 4.23 3.74c1.58.68 2.2.74 2.99.62.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600">
      <CircleX className="mt-px size-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

export function LanguageToggle({
  value,
  onChange,
  tone = "dark",
  className,
}: {
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
  /** "light" = white text over the hero, "dark" = on white backgrounds. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex rounded-full p-1 text-sm font-medium ring-1 transition-colors duration-200",
        tone === "light" ? "ring-white/40" : "ring-slate-200",
        className,
      )}
    >
      {LANGUAGES.map((lang) => {
        const active = lang.code === value;
        return (
          <button
            key={lang.code}
            type="button"
            lang={lang.code}
            aria-pressed={active}
            aria-label={lang.name}
            onClick={() => onChange(lang.code)}
            className={cn(
              "min-h-9 rounded-full px-3 transition-colors duration-200",
              active
                ? tone === "light"
                  ? "bg-white text-brand-dark"
                  : "bg-brand text-white"
                : tone === "light"
                  ? "text-white/85 hover:text-white"
                  : "text-slate-600 hover:text-brand",
            )}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
