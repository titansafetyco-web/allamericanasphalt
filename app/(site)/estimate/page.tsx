import type { Metadata } from "next";
import { EstimateForm } from "@/components/site/EstimateForm";
import { PageHero } from "@/components/site/PageHero";
import { company } from "@/content/company";
import { getTrustPoints, getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Free Estimate" };

export default async function EstimatePage() {
  const locale = await getLocale();
  const t = getUi(locale);
  const points = getTrustPoints(locale);

  return (
    <>
      <PageHero kicker={t.freeEstimate} title={t.home.getEstimate} body={t.home.estimateHint} />
      <section className="mx-auto grid max-w-7xl grid-cols-[0.9fr_1.1fr] gap-10 px-4 py-14 max-md:grid-cols-1">
        <div>
          <h2 className="font-heading text-2xl text-navy">{company.shortName}</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">{t.home.estimateHint}</p>
          <p className="mt-4">
            <a className="font-semibold text-navy" href={company.phones.westPalmBeach.href}>
              West Palm Beach / Stuart {company.phones.westPalmBeach.display}
            </a>
          </p>
          <p>
            <a className="font-semibold text-navy" href={company.phones.fortLauderdale.href}>
              Fort Lauderdale {company.phones.fortLauderdale.display}
            </a>
          </p>
          <ul className="mt-6 space-y-2 text-sm text-foreground/80">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-2xl text-navy">{t.form.requestEstimate}</h2>
          <EstimateForm locale={locale} />
        </div>
      </section>
    </>
  );
}
