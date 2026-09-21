import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, Shield, Truck } from "lucide-react";
import { EstimateForm } from "@/components/site/EstimateForm";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { CtaBand } from "@/components/site/PageHero";
import { ReviewGrid, TrustBadges } from "@/components/site/Reviews";
import { cities } from "@/content/areas";
import { company, trustPoints } from "@/content/company";
import { pageCopy } from "@/content/copy";
import { homeServices } from "@/content/services";

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-deep text-white">
        <Image
          src="/images/hero.jpg"
          alt="Paving contractor in West Palm Beach, FL"
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy/40" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-[1.15fr_0.85fr] gap-10 px-4 py-20 max-md:grid-cols-1 max-md:py-12">
          <div className="flex flex-col justify-center">
            <div className="mb-5 flex flex-wrap gap-2">
              {pageCopy.home.heroKicker.split(" • ").map((city) => (
                <span
                  key={city}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                >
                  {city}
                </span>
              ))}
            </div>
            <h1 className="font-heading text-4xl leading-[1.05] text-white md:text-6xl">{pageCopy.home.heroTitle}</h1>
            <p className="mt-6 max-w-xl border-l-4 border-red-flag pl-5 text-base leading-relaxed text-white/90 md:text-lg">
              {pageCopy.home.heroBody}
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-white">
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-red-flag" aria-hidden />
                {company.experienceYears}+ years experience
              </li>
              <li className="flex items-center gap-2">
                <Shield className="size-4 text-red-flag" aria-hidden />
                Licensed, bonded & insured
              </li>
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-red-flag" aria-hidden />
                Same-day service available
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {company.licenses.map((l) => (
                <span
                  key={l.county}
                  className="rounded-md border border-white/20 bg-navy-deep/50 px-3 py-1.5 text-xs font-semibold tracking-wide text-white"
                >
                  {l.county} {l.number}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-3.5 text-foreground shadow-2xl md:p-6">
            <h2 className="font-heading text-xl text-navy md:text-2xl">Get a free estimate</h2>
            <p className="mb-2 hidden text-sm text-muted-foreground md:mb-4 md:block">
              Tell us about the job. We typically respond the same business day.
            </p>
            <EstimateForm compact />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-4 px-4 max-md:grid-cols-2">
          {[
            { icon: Shield, title: "Licensed & insured", body: "Broward, Palm Beach, and Martin licenses." },
            { icon: Clock, title: `${company.experienceYears}+ years`, body: `Family-owned since ${company.established}.` },
            { icon: Truck, title: "Same-day service", body: "Available on qualifying jobs in WPB, Fort Lauderdale, Plantation, and Davie." },
            { icon: CheckCircle2, title: "Start to finish", body: "Site prep, paving, seal coating, striping, and safety installs." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="mt-0.5 size-6 text-red-flag" />
              <div>
                <p className="font-heading text-lg text-navy">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 max-w-3xl">
          <h2 className="font-heading text-3xl text-navy md:text-4xl">Choose West Palm Beach’s trusted paving company</h2>
          <p className="mt-3 text-muted-foreground">Clear services. Straightforward next step. Pick the work you need.</p>
        </div>
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {homeServices.map((s) => (
            <Link key={s.slug} href={s.href} className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="relative h-44">
                <Image src={s.image} alt={s.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{s.body}</p>
                <span className="mt-4 inline-block text-sm font-bold text-red-flag">Learn more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-10 px-4 max-md:grid-cols-1">
          <div>
            <h2 className="font-heading text-3xl text-navy md:text-4xl">{pageCopy.home.midTitle}</h2>
            <p className="mt-4 leading-relaxed text-foreground/80">{pageCopy.home.midBody}</p>
            <div className="mt-6 overflow-hidden rounded-2xl">
              <Image src="/images/before-after.jpg" alt="Asphalt paving before and after" width={900} height={600} className="h-auto w-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-red-flag">{pageCopy.home.whyLead}</p>
            <h2 className="mt-2 font-heading text-3xl text-navy">{pageCopy.home.whyTitle}</h2>
            {pageCopy.home.whyBody.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-foreground/80">
                {p}
              </p>
            ))}
            <ul className="mt-6 space-y-3">
              {pageCopy.home.whyPoints.map((p) => (
                <li key={p} className="flex gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-red-flag" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl text-navy">Recent work</h2>
            <p className="text-muted-foreground">Parking lots, driveways, HOA roads, and seal coating across South Florida.</p>
          </div>
          <Link href="/gallery" className="font-semibold text-navy hover:text-red-flag">
            View gallery →
          </Link>
        </div>
        <GalleryGrid limit={8} />
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 font-heading text-3xl text-navy">What customers say</h2>
          <ReviewGrid limit={3} />
          <div className="mt-8">
            <TrustBadges />
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-muted-foreground">{pageCopy.home.award}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-heading text-3xl text-navy">Providing asphalt and seal coating across South Florida</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Serving {company.serviceCounties.join(", ")} Counties — including these cities:
        </p>
        <ul className="mt-6 grid grid-cols-4 gap-2 max-md:grid-cols-2">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}`} className="text-navy hover:text-red-flag">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-8 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          {trustPoints.map((t) => (
            <li key={t} className="flex gap-2">
              <CheckCircle2 className="size-4 text-red-flag" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title="Asphalt, seal coating — we’re ready to pave."
        body="Call All American Asphalt LLC today for a free estimate on an upcoming project."
      />
    </>
  );
}
