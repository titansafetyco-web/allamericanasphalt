import type { Metadata } from "next";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = { title: "Project Gallery" };

export default function GalleryPage() {
  return (
    <>
      <PageHero
        kicker="Our work"
        title="Project gallery"
        body="Asphalt paving and seal coating across parking lots, driveways, HOA roads, churches, and commercial properties in Broward, Palm Beach, and Martin Counties."
      />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <GalleryGrid />
      </section>
    </>
  );
}
