import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { decodeHtml, posts } from "@/lib/content";

export const metadata: Metadata = { title: "Blog" };

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        kicker="Insights"
        title="Asphalt planning for property managers, HOAs, and owners"
        body="Guides on seal coating, resurfacing, hurricane prep, and parking-lot safety written for South Florida properties."
      />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <ul className="space-y-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="block rounded-2xl border border-border bg-white p-5 hover:border-navy">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-flag">{post.date}</p>
                <h2 className="mt-1 font-heading text-xl text-navy">{decodeHtml(post.title)}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-foreground/75">{post.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
