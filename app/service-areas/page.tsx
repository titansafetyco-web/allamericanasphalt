import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { cities, extraServiceCities } from "@/content/areas";

export const metadata: Metadata = { title: "Service Areas" };

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        kicker="South Florida"
        title="Where we pave"
        body="All American Asphalt LLC provides asphalt paving, seal coating, striping, speed bumps, and bollards throughout Broward, Palm Beach, and Martin Counties. No job is too big or too small."
      />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-heading text-2xl text-navy">City pages</h2>
        <ul className="mt-4 grid grid-cols-3 gap-3 max-md:grid-cols-1">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}`} className="block rounded-xl border border-border bg-white px-4 py-3 font-semibold text-navy hover:border-navy">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-12 font-heading text-2xl text-navy">Also serving</h2>
        <ul className="mt-4 columns-3 gap-6 text-foreground/80 max-md:columns-1">
          {extraServiceCities.map((c) => (
            <li key={c} className="mb-1">
              {c}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
