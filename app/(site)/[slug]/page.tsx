import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { WpContent } from "@/components/site/WpContent";
import { cities, cityBySlug } from "@/content/areas";
import { decodeHtml, getPage } from "@/lib/content";
import { getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  const city = cityBySlug(slug);
  if (!page || !city) return { title: "Service area" };
  return {
    title: decodeHtml(page.title),
    description: `Asphalt paving, seal coating, and striping in ${city.name} from All American Asphalt LLC.`,
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const city = cityBySlug(slug);
  const page = getPage(slug);
  if (!city || !page) notFound();
  const t = getUi(locale);

  return (
    <>
      <PageHero
        kicker={city.name}
        title={decodeHtml(page.title)}
        body={t.pages.cityBody.replace("{city}", city.name)}
      />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <WpContent html={page.html} />
      </section>
      <CtaBand
        title={t.pages.cityCta.replace("{city}", city.name)}
        body={t.pages.cityCtaBody}
      />
    </>
  );
}
