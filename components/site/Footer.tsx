import Image from "next/image";
import { company, addressLine } from "@/content/company";
import { cities } from "@/content/areas";
import { getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export async function Footer() {
  const t = getUi(await getLocale());

  return (
    <footer className="mt-auto w-full bg-asphalt text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-10 px-4 py-14 max-md:grid-cols-1">
        <div>
          <Image src="/logo.png" alt="All American Asphalt, LLC" width={2000} height={760} className="mb-4 h-28 w-auto" quality={100} unoptimized />
          <p className="mt-4 text-sm leading-relaxed text-white/80">{t.footerBlurb}</p>
        </div>

        <div>
          <h2 className="mb-3 font-heading text-lg tracking-wide">{t.contact}</h2>
          <p className="text-sm text-white/80">{addressLine}</p>
          <p className="mt-2 text-sm">
            <a className="hover:text-red-flag" href={company.phones.westPalmBeach.href}>
              West Palm Beach / Stuart {company.phones.westPalmBeach.display}
            </a>
          </p>
          <p className="text-sm">
            <a className="hover:text-red-flag" href={company.phones.fortLauderdale.href}>
              Fort Lauderdale {company.phones.fortLauderdale.display}
            </a>
          </p>
          <p className="mt-2 text-sm text-white/80">{t.fax} {company.phones.fax.display}</p>
          <p className="text-sm">
            <a className="hover:text-red-flag" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </p>
          <ul className="mt-4 space-y-1 text-sm text-white/75">
            {company.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{t.days[h.day]}</span>
                <span>{h.day === "Sunday" ? t.closed : h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-heading text-lg tracking-wide">{t.licenses}</h2>
          <ul className="space-y-1 text-sm text-white/80">
            {company.licenses.map((l) => (
              <li key={l.county}>
                {l.county}: {l.number}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wider text-white/60">{t.serviceAreas}</h3>
          <ul className="columns-2 gap-4 text-sm text-white/80">
            {cities.map((c) => (
              <li key={c.slug} className="break-inside-avoid">
                <a className="hover:text-white" href={`/${c.slug}`}>
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © 2026 {company.name}. {t.rights}
        {" · "}
        <a className="hover:text-white" href="/terms-and-conditions">
          {t.terms}
        </a>
        {" · "}
        <a className="hover:text-white" href="/sitemap">
          {t.sitemap}
        </a>
      </div>
    </footer>
  );
}
