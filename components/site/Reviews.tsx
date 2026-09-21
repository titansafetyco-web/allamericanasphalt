import Image from "next/image";
import { reviews } from "@/content/reviews";

export function ReviewGrid({ limit }: { limit?: number }) {
  const items = limit ? reviews.slice(0, limit) : reviews;
  return (
    <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
      {items.map((r) => (
        <figure key={r.name + r.date} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="mb-3 text-amber-500" aria-label="5 stars">
            ★★★★★
          </div>
          <blockquote className="text-[15px] leading-relaxed text-foreground/90">“{r.quote}”</blockquote>
          <figcaption className="mt-4 text-sm font-semibold text-navy">
            {r.name}
            <span className="block font-normal text-muted-foreground">{r.date}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function TrustBadges() {
  const badges: { src: string; alt: string; width: number; height: number; unoptimized?: boolean }[] = [
    { src: "/badges/top3.webp", alt: "Top 3 West Palm Beach Asphalt Contractor 2026", width: 280, height: 140 },
    { src: "/badges/angie.jpg", alt: "Angie Award 2025", width: 280, height: 140 },
    { src: "/badges/chamber.webp", alt: "Chamber of Commerce", width: 450, height: 45, unoptimized: true },
    { src: "/badges/sba.png", alt: "SBA", width: 280, height: 140 },
    { src: "/badges/wbe.png", alt: "WBE", width: 280, height: 140 },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {badges.map((b) => (
        <Image
          key={b.src}
          src={b.src}
          alt={b.alt}
          width={b.width}
          height={b.height}
          quality={100}
          unoptimized={b.unoptimized}
          className={b.unoptimized ? "h-[45px] w-auto max-w-full object-contain" : "h-12 w-auto object-contain"}
        />
      ))}
    </div>
  );
}
