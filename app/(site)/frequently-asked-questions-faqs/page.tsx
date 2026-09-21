import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getFaqs, getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Frequently Asked Questions" };

export default async function FaqsPage() {
  const locale = await getLocale();
  const t = getUi(locale);
  const items = getFaqs(locale);

  return (
    <>
      <PageHero kicker={t.pages.faqsKicker} title={t.pages.faqsTitle} body={t.pages.faqsBody} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-white px-4">
          {items.map((f) => (
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
