"use client";

import { useState } from "react";
import { cn } from "@/components/resort/lib/cn";

/** Accessible on/off switch. Uncontrolled by default; pass onChange to listen. */
export default function Toggle({
  label,
  defaultChecked = false,
  onChange,
  hideLabel = false,
}: {
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  hideLabel?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={hideLabel ? label : undefined}
      onClick={() => {
        setChecked(!checked);
        onChange?.(!checked);
      }}
      className="group inline-flex items-center gap-3 rounded-full focus-visible:outline-none"
    >
      <span
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 group-focus-visible:ring-2 group-focus-visible:ring-brand group-focus-visible:ring-offset-2",
          checked ? "bg-brand" : "bg-slate-300",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </span>
      {!hideLabel && <span className="text-sm font-medium text-slate-700">{label}</span>}
    </button>
  );
}
