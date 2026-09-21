import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { getPageCopy, getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default async function TermsPage() {
  const locale = await getLocale();
  const copy = getPageCopy(locale);
  const t = getUi(locale);

  return (
    <>
      <PageHero title={t.pages.termsTitle} body={copy.terms.intro} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="font-heading text-2xl text-navy">{t.pages.userComments}</h2>
        {copy.terms.comments.map((p) => (
          <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-foreground/85">
            {p}
          </p>
        ))}
      </section>
    </>
  );
}
