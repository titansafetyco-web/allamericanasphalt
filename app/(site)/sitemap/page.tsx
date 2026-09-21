import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { cities } from "@/content/areas";
import { getFooterNav, getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";
import { posts } from "@/lib/content";

export const metadata: Metadata = { title: "Sitemap" };

export default async function SitemapPage() {
  const locale = await getLocale();
  const t = getUi(locale);
  const nav = getFooterNav(locale);

  return (
    <>
      <PageHero title={t.pages.sitemapTitle} body={t.pages.sitemapBody} />
      <section className="mx-auto grid max-w-6xl grid-cols-3 gap-10 px-4 py-12 max-md:grid-cols-1">
        <div>
          <h2 className="font-heading text-xl text-navy">{t.pages.mainPages}</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <Link className="text-navy hover:underline" href="/">
                {t.nav.Home}
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link className="text-navy hover:underline" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-navy hover:underline" href="/sign-in">
                {t.signIn}
              </Link>
            </li>
            <li>
              <Link className="text-navy hover:underline" href="/sign-up">
                {t.signUp}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-xl text-navy">{t.serviceAreas}</h2>
          <ul className="mt-3 space-y-1">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link className="text-navy hover:underline" href={`/${c.slug}`}>
                  {t.pages.pavingIn} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-xl text-navy">{t.pages.blog}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link className="text-navy hover:underline" href={`/blog/${p.slug}`}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
