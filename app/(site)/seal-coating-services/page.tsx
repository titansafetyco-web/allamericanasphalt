import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { getPageCopy, getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Asphalt Sealcoating in West Palm Beach, FL" };

export default async function SealCoatingPage() {
  const locale = await getLocale();
  const copy = getPageCopy(locale);
  const t = getUi(locale);

  return (
    <>
      <PageHero kicker={t.pages.sealKicker} title={copy.seal.title} body={copy.seal.intro} />
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 max-md:grid-cols-1">
        <div>
          <h2 className="font-heading text-2xl text-navy">{t.pages.patchwork}</h2>
          <p className="mt-4 leading-relaxed text-foreground/85">{copy.seal.patchwork}</p>
          <h2 className="mt-10 font-heading text-2xl text-navy">{t.pages.stripingTitle}</h2>
          <p className="mt-4 leading-relaxed text-foreground/85">{copy.seal.striping}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6">
          <h3 className="font-heading text-xl text-navy">{t.pages.gemSeal}</h3>
          <ul className="mt-4 space-y-2">
            {copy.seal.gemSeal.map((item) => (
              <li key={item} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-red-flag" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand title={t.pages.sealCta} />
    </>
  );
}
