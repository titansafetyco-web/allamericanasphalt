"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type ServiceZone = {
  id: string;
  name: string;
  query: string;
  zoom: number;
  color: string;
};

const zones: ServiceZone[] = [
  { id: "all", name: "All counties", query: "26.45,-80.22", zoom: 8, color: "#ffffff" },
  { id: "palm-beach", name: "Palm Beach", query: "Palm Beach County, Florida", zoom: 9, color: "#c8102e" },
  { id: "broward", name: "Broward", query: "Broward County, Florida", zoom: 10, color: "#1c5bb8" },
  { id: "martin", name: "Martin", query: "Martin County, Florida", zoom: 10, color: "#f59e0b" },
  { id: "dade", name: "Miami-Dade", query: "Miami-Dade County, Florida", zoom: 9, color: "#38bdf8" },
];

export function ServiceAreaMap({
  label,
  hint,
  allLabel,
  locale = "en",
}: {
  label: string;
  hint: string;
  allLabel: string;
  locale?: "en" | "es";
}) {
  const [active, setActive] = useState("palm-beach");
  const zone = zones.find((item) => item.id === active) ?? zones[1];
  const src = useMemo(() => {
    const params = new URLSearchParams({
      q: zone.query,
      z: String(zone.zoom),
      hl: locale,
      output: "embed",
    });
    return `https://maps.google.com/maps?${params.toString()}`;
  }, [locale, zone]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-navy-deep shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/15 bg-white/10 px-3 py-2">
        {zones.map((item) => {
          const name = item.id === "all" ? allLabel : item.name;
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors",
                selected ? "bg-white text-navy" : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} aria-hidden />
              {name}
            </button>
          );
        })}
      </div>
      <div className="relative aspect-[4/3] min-h-72 w-full md:aspect-auto md:h-[22rem]">
        <iframe
          title={label}
          src={src}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p className="px-3 py-2 text-xs text-white/70">{hint}</p>
    </div>
  );
}
