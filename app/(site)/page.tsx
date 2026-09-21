import Image from "next/image";
import { CheckCircle2, Clock, MapPin, Shield, Truck } from "lucide-react";
import { EstimateForm } from "@/components/site/EstimateForm";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { CtaBand } from "@/components/site/PageHero";
import { SiteLogo } from "@/components/site/SiteLogo";
import { ReviewGrid, TrustBadges } from "@/components/site/Reviews";
import { cities } from "@/content/areas";
import { company } from "@/content/company";
import { getHomeServices, getPageCopy, getTrustPoints, getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

const heroCityHrefs = [
  "/asphalt-paving-company-west-palm-beach-fl",
  "/fort-lauderdale-fl",
  "/asphalt-paving-company-stuart-fl",
] as const;

export default async function HomePage() {
  const locale = await getLocale();
  const copy = getPageCopy(locale);
  const t = getUi(locale);
  const services = getHomeServices(locale);
  const points = getTrustPoints(locale);

  return (
    <>
      <section className="relative isolate min-h-[44rem] overflow-hidden bg-[#071018] text-white md:min-h-[52rem]">
        <Image
          src="/images/hero.webp"
          alt="Asphalt roller and paving crew on a newly paved road at sunset"
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover object-[28%_38%] brightness-[1.28] contrast-[1.12] saturate-[1.2]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/42" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy/30 to-navy/20" />
        <div className="relative mx-auto grid min-h-[44rem] max-w-7xl grid-cols-[1.15fr_0.85fr] items-stretch gap-10 px-4 pb-10 pt-5 max-md:min-h-0 max-md:grid-cols-1 max-md:py-8 md:min-h-[52rem] md:pb-14 md:pt-6">
          <div className="flex flex-col max-md:order-2">
            <nav
              aria-label={t.serviceAreas}
              className="mt-10 inline-flex max-w-full items-center gap-1 self-start rounded-full border border-white/30 bg-white/15 p-1 shadow-[0_8px_28px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-flag text-white">
                <MapPin className="size-3.5" strokeWidth={2.4} aria-hidden />
              </span>
              <div className="flex min-w-0 flex-wrap items-center">
                {copy.home.heroKicker.split(" • ").map((city, i) => (
                  <span key={city} className="inline-flex items-center">
                    {i > 0 ? (
                      <span className="mx-0.5 size-1 rounded-full bg-red-flag" aria-hidden />
                    ) : null}
                    <a
                      href={heroCityHrefs[i]}
                      className="rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/20 md:text-xs"
                    >
                      {city}
                    </a>
                  </span>
                ))}
              </div>
            </nav>
            <div className="mt-16">
            <h1 className="whitespace-pre-line font-heading text-5xl leading-[1.05] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] md:text-7xl">{copy.home.heroTitle}</h1>
            <p className="mt-6 max-w-xl border-l-4 border-red-flag pl-5 text-base leading-relaxed text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] md:text-lg">
              {copy.home.heroBody}
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-white">
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-red-flag" aria-hidden />
                {company.experienceYears}+ {t.home.years}
              </li>
              <li className="flex items-center gap-2">
                <Shield className="size-4 text-red-flag" aria-hidden />
                {t.home.licensed}
              </li>
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-red-flag" aria-hidden />
                {t.home.sameDay}
              </li>
            </ul>
            <div
              aria-label={t.home.licensed}
              className="mt-6 inline-flex max-w-full items-center gap-1 self-start rounded-full border border-white/30 bg-white/15 p-1 shadow-[0_8px_28px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-flag text-white">
                <Shield className="size-3.5" strokeWidth={2.4} aria-hidden />
              </span>
              <div className="flex min-w-0 flex-wrap items-center">
                {company.licenses.map((l, i) => (
                  <span key={l.county} className="inline-flex items-center">
                    {i > 0 ? (
                      <span className="mx-0.5 size-1 rounded-full bg-red-flag" aria-hidden />
                    ) : null}
                    <span className="rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white md:text-xs">
                      {l.county} {l.number}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            </div>
          </div>
          <div className="flex min-h-[36rem] flex-col items-center justify-between max-md:order-1 max-md:min-h-0 max-md:gap-10 md:min-h-[46rem]">
            <SiteLogo
              priority
              className="mx-auto"
              imageClassName="h-36 drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)] md:h-40"
            />
            <div className="w-full rounded-2xl border border-white/40 bg-white/45 p-3.5 text-foreground shadow-2xl backdrop-blur-xl md:p-6">
              <h2 className="font-heading text-xl text-red-flag md:text-2xl">{t.home.getEstimate}</h2>
              <p className="mb-2 hidden text-sm text-black md:mb-4 md:block">
                {t.home.estimateHint}
              </p>
              <EstimateForm compact locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-4 px-4 max-md:grid-cols-2">
          {[
            { icon: Shield, title: t.home.licensedInsured, body: t.home.licensedBody },
            { icon: Clock, title: `${company.experienceYears}+ ${t.home.years}`, body: `${t.home.yearsBody} ${company.established}.` },
            { icon: Truck, title: t.home.sameDayTitle, body: t.home.sameDayBody },
            { icon: CheckCircle2, title: t.home.startFinish, body: t.home.startFinishBody },
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
          <h2 className="font-heading text-3xl text-navy md:text-4xl">{t.home.chooseTitle}</h2>
          <p className="mt-3 text-muted-foreground">{t.home.chooseBody}</p>
        </div>
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {services.map((s) => (
            <a key={s.slug} href={s.href} className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="relative h-44">
                <Image src={s.image} alt={s.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{s.body}</p>
                <span className="mt-4 inline-block text-sm font-bold text-red-flag">{t.home.learnMore}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-10 px-4 max-md:grid-cols-1">
          <div>
            <h2 className="font-heading text-3xl text-navy md:text-4xl">{copy.home.midTitle}</h2>
            <p className="mt-4 leading-relaxed text-foreground/80">{copy.home.midBody}</p>
            <div className="mt-6 overflow-hidden rounded-2xl">
              <Image src="/images/before-after.jpg" alt="Asphalt paving before and after" width={900} height={600} className="h-auto w-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-red-flag">{copy.home.whyLead}</p>
            <h2 className="mt-2 font-heading text-3xl text-navy">{copy.home.whyTitle}</h2>
            {copy.home.whyBody.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-foreground/80">
                {p}
              </p>
            ))}
            <ul className="mt-6 space-y-3">
              {copy.home.whyPoints.map((p) => (
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
            <h2 className="font-heading text-3xl text-navy">{t.home.recentWork}</h2>
            <p className="text-muted-foreground">{t.home.recentBody}</p>
          </div>
          <a href="/gallery" className="font-semibold text-navy hover:text-red-flag">
            {t.home.viewGallery}
          </a>
        </div>
        <GalleryGrid limit={8} locale={locale} />
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 font-heading text-3xl text-navy">{t.home.reviewsTitle}</h2>
          <ReviewGrid limit={3} />
          <div className="mt-8">
            <TrustBadges />
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-muted-foreground">{copy.home.award}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-heading text-3xl text-navy">{t.home.areasTitle}</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {t.home.serving} {company.serviceCounties.join(", ")} {t.home.counties}
        </p>
        <ul className="mt-6 grid grid-cols-4 gap-2 max-md:grid-cols-2">
          {cities.map((c) => (
            <li key={c.slug}>
              <a href={`/${c.slug}`} className="text-navy hover:text-red-flag">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-8 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          {points.map((point) => (
            <li key={point} className="flex gap-2">
              <CheckCircle2 className="size-4 text-red-flag" />
              {point}
            </li>
          ))}
        </ul>
      </section>

      <CtaBand title={t.home.ctaTitle} body={t.home.ctaBody} />
    </>
  );
}
