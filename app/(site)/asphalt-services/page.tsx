import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { pageCopy } from "@/content/copy";

export const metadata: Metadata = { title: "Asphalt Paving Services in West Palm Beach, FL" };

export default function AsphaltServicesPage() {
  return (
    <>
      <PageHero kicker="Asphalt services" title={pageCopy.asphalt.title} body={pageCopy.asphalt.intro} />
      <section className="mx-auto max-w-4xl px-4 py-14">
        {pageCopy.asphalt.sections.map((s) => (
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
      <CtaBand title="Questions about milling, overlays, or seal coating?" body="Call West Palm Beach at (561) 684-9183." />
    </>
  );
}
