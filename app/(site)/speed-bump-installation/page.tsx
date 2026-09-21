import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { getPageCopy, getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Speed Bump & Bollard Installation in West Palm Beach, FL" };

export default async function SpeedBumpPage() {
  const locale = await getLocale();
  const copy = getPageCopy(locale);
  const t = getUi(locale);

  return (
    <>
      <PageHero kicker={t.pages.speedKicker} title={copy.speed.title} body={copy.speed.intro} />
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 max-md:grid-cols-1">
        <article className="rounded-2xl border border-border bg-white p-6">
          <h2 className="font-heading text-2xl text-navy">{t.pages.speedDevices}</h2>
          <p className="mt-4 leading-relaxed text-foreground/85">{copy.speed.devices}</p>
        </article>
        <article className="rounded-2xl border border-border bg-white p-6">
          <h2 className="font-heading text-2xl text-navy">{t.pages.bollards}</h2>
          <p className="mt-4 leading-relaxed text-foreground/85">{copy.speed.bollards}</p>
        </article>
      </section>
      <CtaBand title={t.pages.speedCta} body={t.pages.speedCtaBody} />
    </>
  );
}
