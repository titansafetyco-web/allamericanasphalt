"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { galleryImages, type GalleryCategory } from "@/content/gallery";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getUi } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

export function GalleryGrid({
  limit,
  category,
  locale = "en",
}: {
  limit?: number;
  category?: GalleryCategory;
  locale?: Locale;
}) {
  const [filter, setFilter] = useState<"all" | GalleryCategory>(category ?? "all");
  const [active, setActive] = useState<(typeof galleryImages)[number] | null>(null);
  const t = getUi(locale);
  const filters: { id: "all" | GalleryCategory; label: string }[] = [
    { id: "all", label: t.pages.allWork },
    { id: "paving", label: t.pages.asphaltPaving },
    { id: "sealcoating", label: t.pages.sealCoating },
  ];

  const items = useMemo(() => {
    const list = galleryImages.filter((img) => (filter === "all" ? true : img.category === filter));
    return limit ? list.slice(0, limit) : list;
  }, [filter, limit]);

  return (
    <div>
      {category ? null : (
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              suppressHydrationWarning
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold",
                filter === f.id ? "border-navy bg-navy text-white" : "border-border bg-white text-navy hover:border-navy",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">
        {items.map((img) => (
          <button
            key={img.src}
            type="button"
            suppressHydrationWarning
            onClick={() => setActive(img)}
            className="group overflow-hidden rounded-xl bg-asphalt"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={600}
              className="aspect-[4/3] h-full w-full object-cover transition duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              loading={limit ? "eager" : undefined}
            />
          </button>
        ))}
      </div>
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-5xl border-0 bg-black p-0">
          <DialogTitle className="sr-only">{active?.alt}</DialogTitle>
          {active ? (
            <Image src={active.src} alt={active.alt} width={1600} height={1200} className="h-auto w-full object-contain" />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
