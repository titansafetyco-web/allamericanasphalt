import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { pageCopy } from "@/content/copy";
import { referralGroups } from "@/content/referrals";

export const metadata: Metadata = { title: "Referral Program" };

export default function ReferralsPage() {
  return (
    <>
      <PageHero kicker="Trusted partners" title="Referrals" body={pageCopy.referrals.intro} />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
          <article>
            <h2 className="font-heading text-2xl text-navy">Give a referral</h2>
            <p className="mt-3 leading-relaxed text-foreground/85">{pageCopy.referrals.give}</p>
          </article>
          <article>
            <h2 className="font-heading text-2xl text-navy">Get a referral</h2>
            <p className="mt-3 leading-relaxed text-foreground/85">{pageCopy.referrals.get}</p>
          </article>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 max-md:grid-cols-1">
          {referralGroups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-border bg-white p-5">
              <h3 className="font-heading text-xl text-navy">{group.title}</h3>
              <ul className="mt-3 space-y-1 text-sm text-foreground/80">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title="Refer us for the job" body="If someone referred you, please share their name when you contact us." />
    </>
  );
}
