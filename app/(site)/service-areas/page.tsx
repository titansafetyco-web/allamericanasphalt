import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { ServiceAreaMap } from "@/components/site/ServiceAreaMap";
import { cities, extraServiceCities } from "@/content/areas";
import { getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Service Areas" };

export default async function ServiceAreasPage() {
  const locale = await getLocale();
  const t = getUi(locale);

  return (
    <>
      <PageHero
        kicker={t.pages.areasKicker}
        title={t.pages.areasTitle}
        body={t.pages.areasBody}
        aside={
          <ServiceAreaMap
            locale={locale}
            label={t.pages.serviceMap}
            hint={t.pages.serviceMapHint}
            allLabel={t.pages.allCounties}
          />
        }
      />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-heading text-2xl text-navy">{t.pages.cityPages}</h2>
        <ul className="mt-4 grid grid-cols-3 gap-3 max-md:grid-cols-1">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}`} className="block rounded-xl border border-border bg-white px-4 py-3 font-semibold text-navy hover:border-navy">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-12 font-heading text-2xl text-navy">{t.pages.alsoServing}</h2>
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
