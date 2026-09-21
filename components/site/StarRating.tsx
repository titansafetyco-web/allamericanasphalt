"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  name,
  label,
  starLabel,
  required = true,
}: {
  name: string;
  label: string;
  starLabel: (value: number) => string;
  required?: boolean;
}) {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(0);
  const filled = hover || value;

  return (
    <fieldset className="grid gap-1 md:gap-1.5">
      <legend className="text-xs font-bold text-black md:text-sm">{label}</legend>
      <div
        role="radiogroup"
        aria-label={label}
        aria-required={required}
        className="flex items-center gap-1"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= filled;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={starLabel(n)}
              onClick={() => setValue(n)}
              onMouseEnter={() => setHover(n)}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-md transition-colors",
                active ? "text-amber-500" : "text-black/25 hover:text-amber-400",
              )}
            >
              <Star className="size-8" strokeWidth={1.6} fill={active ? "currentColor" : "none"} aria-hidden />
            </button>
          );
        })}
      </div>
      <input
        type="text"
        name={name}
        value={value ? String(value) : ""}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="sr-only"
      />
    </fieldset>
  );
}
