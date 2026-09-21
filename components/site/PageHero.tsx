import type { ReactNode } from "react";
import { company } from "@/content/company";
import { getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export async function PageHero({
  kicker,
  title,
  body,
  aside,
}: {
  kicker?: string;
  title: string;
  body?: string;
  aside?: ReactNode;
}) {
  const t = getUi(await getLocale());
  const copy = (
    <>
      {kicker ? <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-flag">{kicker}</p> : null}
      <h1 className="max-w-4xl font-heading text-3xl leading-tight md:text-5xl">{title}</h1>
      {body ? <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">{body}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="/estimate" className="rounded-md bg-red-flag px-5 py-3 font-semibold text-white hover:bg-red-flag/90">
          {t.freeEstimate}
        </a>
        <a
          href={company.phones.westPalmBeach.href}
          className="rounded-md border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10"
        >
          {t.call} {company.phones.westPalmBeach.display}
        </a>
      </div>
    </>
  );
  return (
    <section className="bg-navy-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {aside ? (
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>{copy}</div>
            <div className="min-w-0">{aside}</div>
          </div>
        ) : (
          copy
        )}
      </div>
    </section>
  );
}

export async function CtaBand({ title, body }: { title: string; body?: string }) {
  const t = getUi(await getLocale());
  return (
    <section className="bg-red-flag text-white">
      <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-6 px-4 py-10 max-md:flex-col max-md:items-start">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl">{title}</h2>
          {body ? <p className="mt-2 max-w-2xl text-white/90">{body}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/estimate" className="rounded-md bg-white px-5 py-3 font-bold text-navy hover:bg-white/90">
            {t.requestEstimate}
          </a>
          <a href="/contact-us" className="rounded-md bg-navy px-5 py-3 font-bold text-white hover:bg-navy-deep">
            {t.contact}
          </a>
          <a href={company.phones.westPalmBeach.href} className="rounded-md border border-white/40 px-5 py-3 font-semibold hover:bg-white/10">
            {company.phones.westPalmBeach.display}
          </a>
        </div>
      </div>
    </section>
  );
}
