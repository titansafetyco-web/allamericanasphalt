import type { Metadata } from "next";
import { EstimateForm } from "@/components/site/EstimateForm";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = { title: "Customer Feedback" };

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        kicker="Compliments · Complaints · Concerns"
        title="How did we do?"
        body="We take customer feedback seriously. Tell us if you had a positive experience, or an unfavorable one."
      />
      <section className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <EstimateForm type="feedback" />
        </div>
      </section>
    </>
  );
}
