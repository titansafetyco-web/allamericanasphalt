import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { cities } from "@/content/areas";
import { footerNav } from "@/content/nav";
import { posts } from "@/lib/content";

export const metadata: Metadata = { title: "Sitemap" };

export default function SitemapPage() {
  return (
    <>
      <PageHero title="Sitemap" body="Every public page on the new All American Asphalt website." />
      <section className="mx-auto grid max-w-6xl grid-cols-3 gap-10 px-4 py-12 max-md:grid-cols-1">
        <div>
          <h2 className="font-heading text-xl text-navy">Main pages</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <Link className="text-navy hover:underline" href="/">
                Home
              </Link>
            </li>
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link className="text-navy hover:underline" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-navy hover:underline" href="/sign-in">
                Sign In
              </Link>
            </li>
            <li>
              <Link className="text-navy hover:underline" href="/sign-up">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-xl text-navy">Service areas</h2>
          <ul className="mt-3 space-y-1">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link className="text-navy hover:underline" href={`/${c.slug}`}>
                  Paving Company in {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-xl text-navy">Blog</h2>
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
