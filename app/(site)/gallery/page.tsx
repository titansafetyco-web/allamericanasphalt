import type { Metadata } from "next";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { PageHero } from "@/components/site/PageHero";
import { getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Project Gallery" };

export default async function GalleryPage() {
  const locale = await getLocale();
  const t = getUi(locale);

  return (
    <>
      <PageHero kicker={t.pages.galleryKicker} title={t.pages.galleryTitle} body={t.pages.galleryBody} />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <GalleryGrid locale={locale} />
      </section>
    </>
  );
}
