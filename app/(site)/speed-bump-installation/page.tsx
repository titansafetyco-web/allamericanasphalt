import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { pageCopy } from "@/content/copy";

export const metadata: Metadata = { title: "Speed Bump & Bollard Installation in West Palm Beach, FL" };

export default function SpeedBumpPage() {
  return (
    <>
      <PageHero kicker="Safety installs" title={pageCopy.speed.title} body={pageCopy.speed.intro} />
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 max-md:grid-cols-1">
        <article className="rounded-2xl border border-border bg-white p-6">
          <h2 className="font-heading text-2xl text-navy">Speed control devices</h2>
          <p className="mt-4 leading-relaxed text-foreground/85">{pageCopy.speed.devices}</p>
        </article>
        <article className="rounded-2xl border border-border bg-white p-6">
          <h2 className="font-heading text-2xl text-navy">Bollards</h2>
          <p className="mt-4 leading-relaxed text-foreground/85">{pageCopy.speed.bollards}</p>
        </article>
      </section>
      <CtaBand title="Invest in your property’s safety." body="We’re ready to install speed bumps, humps, tables, and bollards across West Palm Beach and surrounding cities." />
    </>
  );
}
