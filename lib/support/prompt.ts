import { company } from "@/content/company";
import { faqs } from "@/content/faqs";
import type { Locale } from "@/lib/i18n/locale";

const hours = company.hours.map((row) => `${row.day}: ${row.time}`).join("; ");

export function supportInstructions(locale: Locale) {
  const language = locale === "es" ? "Spanish" : "English";
  const faqBlock = faqs.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n");

  return `You are the website assistant for ${company.shortName} (${company.name}), a family-owned asphalt paving contractor in South Florida owned by ${company.owner}. Reply in ${language}. Keep answers short, practical, and friendly. Never invent prices, availability, or promises. If a quote is needed, tell them to request a free estimate at /estimate or call ${company.phones.westPalmBeach.display}. If they want a person, tell them they can request a live agent or text the office from this chat.

Facts you can use:
- Services: asphalt paving, repair, overlay, milling, seal coating, parking lot striping, speed bumps, bollards, HOA and community roads, commercial lots, residential driveways.
- Counties: Broward, Palm Beach, Martin, and Miami-Dade. Same-day service on qualifying jobs in West Palm Beach, Fort Lauderdale, Plantation, and Davie.
- Phones: West Palm Beach / Stuart ${company.phones.westPalmBeach.display}; Fort Lauderdale ${company.phones.fortLauderdale.display}. Email ${company.email}.
- Office: ${company.address.line1}, ${company.address.line2}, ${company.address.city}, ${company.address.state} ${company.address.zip}.
- Hours: ${hours}.
- Licensed, bonded, and insured. Licenses: Broward ${company.licenses[0].number}, Palm Beach ${company.licenses[1].number}, Martin ${company.licenses[2].number}.
- Fresh asphalt: wait 72 hours before driving or walking on driveways and lots. Seal coat about every 2 years. Average asphalt life is about 15 years.

FAQs:
${faqBlock}`;
}

export function fallbackSupportReply(question: string, locale: Locale) {
  const q = question.toLowerCase();
  const es = locale === "es";

  if (/seal|sello|coating/.test(q)) {
    return es
      ? "El sellado protege el asfalto y suele hacerse cada 2 años. El costo depende del tamaño. Pida un estimado gratis o solicite un agente en vivo."
      : "Seal coating protects asphalt and is typically done every 2 years. Cost depends on the size of the job. Request a free estimate or ask for a live agent.";
  }
  if (/price|cost|quote|estimado|precio|cuánto|cuanto/.test(q)) {
    return es
      ? `No damos precios aquí porque cada trabajo es distinto. Pida un estimado gratis o llame al ${company.phones.westPalmBeach.display}.`
      : `We don’t quote prices here because every job is different. Request a free estimate or call ${company.phones.westPalmBeach.display}.`;
  }
  if (/hour|horario|open|abierto/.test(q)) {
    return es
      ? "Estamos abiertos de lunes a sábado, 9 AM a 6 PM. Domingo cerrado."
      : "We’re open Monday through Saturday, 9 AM to 6 PM. Closed Sunday.";
  }
  if (/area|county|condado|broward|miami|martin|palm beach/.test(q)) {
    return es
      ? "Servimos Broward, Palm Beach, Martin y Miami-Dade. Hay servicio el mismo día en trabajos que califican en West Palm Beach, Fort Lauderdale, Plantation y Davie."
      : "We serve Broward, Palm Beach, Martin, and Miami-Dade. Same-day service is available on qualifying jobs in West Palm Beach, Fort Lauderdale, Plantation, and Davie.";
  }
  if (/driveway|entrada|parking|estacionamiento|hoa|road|calle/.test(q)) {
    return es
      ? "Hacemos entradas, estacionamientos, calles de HOA, sellado, rayado, reductores y bolardos. Cuéntenos la ciudad y el tipo de trabajo, o pida un estimado."
      : "We pave driveways, parking lots, and HOA roads, plus seal coating, striping, speed bumps, and bollards. Share the city and the work you need, or request an estimate.";
  }

  return es
    ? `Puedo ayudar con servicios, áreas y horarios. Para un precio o para hablar con alguien, pida un estimado, envíe un texto o solicite un agente en vivo. También puede llamar al ${company.phones.westPalmBeach.display}.`
    : `I can help with services, areas, and hours. For a price or to talk with someone, request an estimate, send a text, or ask for a live agent. You can also call ${company.phones.westPalmBeach.display}.`;
}
