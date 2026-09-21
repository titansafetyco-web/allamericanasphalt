import type { Metadata } from "next";
import { EstimateForm } from "@/components/site/EstimateForm";
import { PageHero } from "@/components/site/PageHero";
import { getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Customer Feedback" };

export default async function FeedbackPage() {
  const locale = await getLocale();
  const t = getUi(locale);

  return (
    <>
      <PageHero kicker={t.pages.feedbackKicker} title={t.pages.feedbackTitle} body={t.pages.feedbackBody} />
      <section className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <EstimateForm type="feedback" locale={locale} />
        </div>
      </section>
    </>
  );
}
