import type { Metadata } from "next";
import { EstimateForm } from "@/components/site/EstimateForm";
import { PageHero } from "@/components/site/PageHero";
import { ReviewGrid } from "@/components/site/Reviews";
import { getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const locale = await getLocale();
  const t = getUi(locale);

  return (
    <>
      <PageHero kicker={t.pages.reviewsKicker} title={t.pages.reviewsTitle} body={t.pages.reviewsBody} />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <ReviewGrid />
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-white p-6">
          <h2 className="mb-4 font-heading text-2xl text-navy">{t.pages.leaveTestimonial}</h2>
          <EstimateForm type="feedback" locale={locale} />
        </div>
      </section>
    </>
  );
}
