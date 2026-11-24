import { Star } from "lucide-react";
import { cn } from "@/utils/helpers/cn";

type Props = {
  /** 0–5, halves allowed (rounded to the nearest half star). */
  value: number;
  reviews?: number;
  size?: number;
  className?: string;
};

/** Compact star rating: five stars (with half-star support) + optional review count. */
export default function Rating({ value, reviews, size = 14, className }: Props) {
  const rounded = Math.round(Math.min(5, Math.max(0, value)) * 2) / 2;

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => {
          const fill = rounded >= n ? 1 : rounded >= n - 0.5 ? 0.5 : 0;
          return (
            <span key={n} className="relative inline-block" style={{ width: size, height: size }} aria-hidden>
              <Star size={size} className="absolute inset-0 fill-slate-200 text-slate-200" />
              {fill > 0 && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                  <Star size={size} className="fill-amber-400 text-amber-400" />
                </span>
              )}
            </span>
          );
        })}
      </span>
      {reviews !== undefined && <span className="text-[11px] text-slate-500 tabular-nums">({reviews})</span>}
    </span>
  );
}
