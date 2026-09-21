import type { Metadata } from "next";
import { EstimateForm } from "@/components/site/EstimateForm";
import { PageHero } from "@/components/site/PageHero";
import { addressLine, company } from "@/content/company";
import { getPageCopy, getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const locale = await getLocale();
  const copy = getPageCopy(locale);
  const t = getUi(locale);

  return (
    <>
      <PageHero kicker={t.pages.contactKicker} title={copy.contact.title} body={copy.contact.intro} />
      <section className="mx-auto grid max-w-7xl grid-cols-[0.9fr_1.1fr] gap-10 px-4 py-14 max-md:grid-cols-1">
        <div>
          <h2 className="font-heading text-2xl text-navy">West Palm Beach</h2>
          <p className="mt-3 text-foreground/80">{addressLine}</p>
          <p className="mt-2">
            <a className="font-semibold text-navy" href={company.phones.westPalmBeach.href}>
              {company.phones.westPalmBeach.display}
            </a>
          </p>
          <p className="text-sm text-muted-foreground">{t.fax}: {company.phones.fax.display}</p>
          <p className="mt-2">
            <a className="font-semibold text-navy" href={company.phones.fortLauderdale.href}>
              Fort Lauderdale {company.phones.fortLauderdale.display}
            </a>
          </p>
          <p className="mt-2">
            <a className="text-navy" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </p>
          <p className="mt-6 leading-relaxed text-foreground/80">{copy.contact.prompt}</p>
          <ul className="mt-6 space-y-1 text-sm text-muted-foreground">
            {company.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-6 max-w-xs">
                <span>{t.days[h.day]}</span>
                <span>{h.day === "Sunday" ? t.closed : h.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-2xl text-navy">{t.pages.sendMessage}</h2>
          <EstimateForm type="contact" locale={locale} />
        </div>
      </section>
    </>
  );
}
