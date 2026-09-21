import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site/PageHero";
import { WpContent } from "@/components/site/WpContent";
import { decodeHtml, getPost, posts } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Blog" };
  return { title: decodeHtml(post.title), description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-flag">{post.date}</p>
        <h1 className="mt-2 font-heading text-3xl text-navy md:text-4xl">{decodeHtml(post.title)}</h1>
        <div className="mt-8">
          <WpContent html={post.html} />
        </div>
      </article>
      <CtaBand title="Need this work done on your property?" body="Get a free estimate from All American Asphalt LLC." />
    </>
  );
}
