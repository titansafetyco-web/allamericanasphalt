import type { Metadata } from "next";
import { EstimateForm } from "@/components/site/EstimateForm";
import { PageHero } from "@/components/site/PageHero";
import { ReviewGrid } from "@/components/site/Reviews";

export const metadata: Metadata = { title: "Reviews" };

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        kicker="Testimonials"
        title="Reviews"
        body="Customers across South Florida hire All American Asphalt for driveways, seal coating, and commercial lots. Here’s what they say."
      />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <ReviewGrid />
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-white p-6">
          <h2 className="mb-4 font-heading text-2xl text-navy">Leave a testimonial</h2>
          <EstimateForm type="feedback" />
        </div>
      </section>
    </>
  );
}
