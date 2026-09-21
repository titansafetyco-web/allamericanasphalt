import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { pageCopy } from "@/content/copy";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms and Conditions" body={pageCopy.terms.intro} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="font-heading text-2xl text-navy">User comments</h2>
        {pageCopy.terms.comments.map((p) => (
          <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-foreground/85">
            {p}
          </p>
        ))}
      </section>
    </>
  );
}
