import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { WpContent } from "@/components/site/WpContent";
import { cities, cityBySlug } from "@/content/areas";
import { decodeHtml, getPage } from "@/lib/content";

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
  const { slug } = await params;
  const city = cityBySlug(slug);
  const page = getPage(slug);
  if (!city || !page) notFound();

  return (
    <>
      <PageHero kicker={city.name} title={decodeHtml(page.title)} body={`Licensed asphalt paving and seal coating for properties in ${city.name} and nearby South Florida communities.`} />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <WpContent html={page.html} />
      </section>
      <CtaBand title={`Need paving in ${city.name}?`} body="Call (561) 684-9183 or request a free estimate." />
    </>
  );
}
