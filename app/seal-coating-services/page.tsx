import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { pageCopy } from "@/content/copy";

export const metadata: Metadata = { title: "Asphalt Sealcoating in West Palm Beach, FL" };

export default function SealCoatingPage() {
  return (
    <>
      <PageHero kicker="Seal coating" title={pageCopy.seal.title} body={pageCopy.seal.intro} />
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 max-md:grid-cols-1">
        <div>
          <h2 className="font-heading text-2xl text-navy">Patchwork</h2>
          <p className="mt-4 leading-relaxed text-foreground/85">{pageCopy.seal.patchwork}</p>
          <h2 className="mt-10 font-heading text-2xl text-navy">Parking lot striping and pavement marking</h2>
          <p className="mt-4 leading-relaxed text-foreground/85">{pageCopy.seal.striping}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6">
          <h3 className="font-heading text-xl text-navy">Gem Seal pavement sealer</h3>
          <ul className="mt-4 space-y-2">
            {pageCopy.seal.gemSeal.map((item) => (
              <li key={item} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-red-flag" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand title="Protect your pavement before the next Florida rainy season." />
    </>
  );
}
