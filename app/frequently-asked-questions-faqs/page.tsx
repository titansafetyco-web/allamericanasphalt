import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { faqs } from "@/content/faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = { title: "Frequently Asked Questions" };

export default function FaqsPage() {
  return (
    <>
      <PageHero
        kicker="FAQs"
        title="Frequently asked questions"
        body="Fifteen years is the average lifespan of asphalt. Depending on the surface’s use and wear, it should be sealed every 2 years for protection. For answers on a specific project, call us."
      />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-white px-4">
          {faqs.map((f) => (
            <AccordionItem key={f.question} value={f.question}>
              <AccordionTrigger className="py-4 text-base text-navy">{f.question}</AccordionTrigger>
              <AccordionContent className="text-foreground/80">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
