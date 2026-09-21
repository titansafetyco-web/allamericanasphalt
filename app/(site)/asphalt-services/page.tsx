import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { getPageCopy, getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Asphalt Paving Services in West Palm Beach, FL" };

export default async function AsphaltServicesPage() {
  const locale = await getLocale();
  const copy = getPageCopy(locale);
  const t = getUi(locale);

  return (
    <>
      <PageHero kicker={t.pages.asphaltKicker} title={copy.asphalt.title} body={copy.asphalt.intro} />
      <section className="mx-auto max-w-4xl px-4 py-14">
        {copy.asphalt.sections.map((s) => (
          <article key={s.title} className="mb-10">
            <h2 className="font-heading text-2xl text-navy">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p.slice(0, 48)} className="mt-4 leading-relaxed text-foreground/85">
                {p}
              </p>
            ))}
          </article>
        ))}
      </section>
      <CtaBand title={t.pages.asphaltCta} body={t.pages.asphaltCtaBody} />
    </>
  );
}
