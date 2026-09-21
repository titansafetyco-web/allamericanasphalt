import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-heading text-5xl text-navy">404</p>
      <h1 className="mt-3 font-heading text-2xl text-navy">That page isn’t here</h1>
      <p className="mt-3 text-muted-foreground">Try the home page, or request an estimate and we’ll help you from there.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="rounded-md bg-navy px-4 py-2 font-semibold text-white">
          Home
        </Link>
        <Link href="/contact-us" className="rounded-md bg-red-flag px-4 py-2 font-semibold text-white">
          Free Estimate
        </Link>
      </div>
    </section>
  );
}
