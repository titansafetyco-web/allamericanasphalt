import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  customers,
  defaultQuoteLines,
  estimates as seedEstimates,
  leads as seedLeads,
  quoteSubtotal,
  serviceTypes,
  type Customer,
  type Estimate,
  type EstimateLine,
  type EstimateStatus,
  type Lead,
  type LeadStatus,
  type ServiceType,
} from "@/lib/crm/data";

const quotesPath = path.join(process.cwd(), "data", "crm-quotes.json");
const leadsPath = path.join(process.cwd(), "data", "crm-leads.json");

export type QuoteIntent = "save" | "send" | "approve" | "decline";

export type QuoteControllerInput = {
  id: string;
  service: string;
  city: string;
  notes: string;
  validUntil: string;
  lines: EstimateLine[];
  intent: QuoteIntent;
};

const quoteStatuses = new Set<EstimateStatus>(["draft", "sent", "approved", "declined"]);
const intents = new Set<QuoteIntent>(["save", "send", "approve", "decline"]);

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function parseService(value: string): ServiceType {
  return serviceTypes.includes(value as ServiceType) ? (value as ServiceType) : "Asphalt paving";
}

function parseStatus(value: unknown): EstimateStatus {
  return quoteStatuses.has(value as EstimateStatus) ? (value as EstimateStatus) : "draft";
}

function parseIntent(value: string): QuoteIntent {
  return intents.has(value as QuoteIntent) ? (value as QuoteIntent) : "save";
}

function parseLines(value: unknown): EstimateLine[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const qty = Number(row.qty);
      const unitPrice = Number(row.unitPrice);
      return {
        id: String(row.id ?? `line-${index + 1}`),
        description: String(row.description ?? "").trim() || "Line item",
        qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
        unit: String(row.unit ?? "LS") || "LS",
        unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
      };
    })
    .filter((line): line is EstimateLine => Boolean(line));
}

function normalizeQuote(quote: Estimate): Estimate {
  const lines = defaultQuoteLines(quote);
  return {
    ...quote,
    status: parseStatus(quote.status),
    notes: quote.notes ?? "",
    lines,
    amount: quoteSubtotal(lines) || quote.amount,
  };
}

function mergeById<T extends { id: string }>(...lists: T[][]) {
  const byId = new Map<string, T>();
  for (const list of lists) {
    for (const item of list) byId.set(item.id, item);
  }
  return [...byId.values()];
}

async function readJson<T>(file: string): Promise<T[]> {
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJson<T>(file: string, value: T[]) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

export async function listQuotes() {
  const fromFile = await readJson<Estimate>(quotesPath);
  return mergeById(seedEstimates.map(normalizeQuote), fromFile.map(normalizeQuote)).sort((a, b) =>
    b.number.localeCompare(a.number),
  );
}

export async function listLeads() {
  const fromFile = await readJson<Lead>(leadsPath);
  return mergeById(seedLeads, fromFile).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function countyForCity(city: string): Customer["county"] {
  const match =
    customers.find((customer) => customer.city.toLowerCase() === city.toLowerCase()) ??
    seedLeads.find((lead) => lead.city.toLowerCase() === city.toLowerCase());
  return match?.county ?? "Palm Beach";
}

function contactForCustomer(name: string) {
  return customers.find((customer) => customer.name === name);
}

function leadForQuote(leads: Lead[], quote: Estimate) {
  return (
    leads.find((lead) => lead.id === `qlead-${quote.id}`) ??
    leads.find((lead) => lead.company === quote.customer)
  );
}

function nextStatuses(intent: QuoteIntent, current: EstimateStatus): { quote: EstimateStatus; lead: LeadStatus } {
  if (intent === "approve") return { quote: "approved", lead: "won" };
  if (intent === "decline") return { quote: "declined", lead: "lost" };
  if (intent === "send") return { quote: "sent", lead: "quoted" };
  if (current === "approved") return { quote: current, lead: "won" };
  if (current === "declined") return { quote: current, lead: "lost" };
  if (current === "sent") return { quote: current, lead: "quoted" };
  return { quote: "draft", lead: "contacted" };
}

function upsertLeadFromQuote(existing: Lead | undefined, quote: Estimate, status: LeadStatus): Lead {
  const contact = contactForCustomer(quote.customer);
  return {
    id: existing?.id ?? `qlead-${quote.id}`,
    name: existing?.name ?? contact?.contact ?? quote.customer,
    company: quote.customer,
    phone: existing?.phone ?? contact?.phone ?? "",
    email: existing?.email ?? contact?.email ?? "",
    service: quote.service,
    city: quote.city,
    county: existing?.county ?? contact?.county ?? countyForCity(quote.city),
    status,
    value: quote.amount,
    source: existing?.source ?? "Website",
    createdAt: existing?.createdAt ?? todayIso(),
  };
}

export async function applyQuoteController(input: QuoteControllerInput) {
  const intent = parseIntent(input.intent);
  const quotes = await listQuotes();
  const existing = quotes.find((quote) => quote.id === input.id);
  if (!existing) throw new Error("Quote not found.");

  const parsedLines = parseLines(input.lines);
  const lines = parsedLines.length ? parsedLines : defaultQuoteLines(existing);
  const statuses = nextStatuses(intent, existing.status);
  const quote: Estimate = {
    ...existing,
    service: parseService(input.service),
    city: input.city.trim() || existing.city,
    notes: input.notes.trim(),
    validUntil: input.validUntil || existing.validUntil,
    lines,
    amount: quoteSubtotal(lines) || existing.amount,
    status: statuses.quote,
    sentAt: statuses.quote === "draft" ? existing.sentAt : existing.sentAt ?? todayIso(),
  };

  const leads = await listLeads();
  const lead = upsertLeadFromQuote(leadForQuote(leads, quote), quote, statuses.lead);

  const quoteOverlay = await readJson<Estimate>(quotesPath);
  await writeJson(quotesPath, mergeById(quoteOverlay, [quote]));
  const leadOverlay = await readJson<Lead>(leadsPath);
  await writeJson(leadsPath, mergeById(leadOverlay, [lead]));

  return { quote, lead, intent };
}

export function summarizePipeline(leads: Lead[], quotes: Estimate[]) {
  const open = leads.filter((lead) => lead.status !== "won" && lead.status !== "lost");
  const valueOf = (status: LeadStatus) =>
    leads.filter((lead) => lead.status === status).reduce((sum, lead) => sum + lead.value, 0);
  return {
    openLeads: open.length,
    pipelineValue: open.reduce((sum, lead) => sum + lead.value, 0),
    estimatesOut: quotes.filter((quote) => quote.status === "sent").length,
    leadMix: [
      { label: "New", value: leads.filter((lead) => lead.status === "new").length, color: "#0b2c6b" },
      { label: "Contacted", value: leads.filter((lead) => lead.status === "contacted").length, color: "#1c5bb8" },
      { label: "Quoted", value: leads.filter((lead) => lead.status === "quoted").length, color: "#d97706" },
    ],
    estimateMix: [
      { label: "Draft", value: quotes.filter((quote) => quote.status === "draft").length, color: "#94a3b8" },
      { label: "Sent", value: quotes.filter((quote) => quote.status === "sent").length, color: "#0b2c6b" },
      { label: "Approved", value: quotes.filter((quote) => quote.status === "approved").length, color: "#059669" },
      { label: "Declined", value: quotes.filter((quote) => quote.status === "declined").length, color: "#c8102e" },
    ],
    pipelineMix: [
      { label: "New", value: valueOf("new"), color: "#0b2c6b" },
      { label: "Contacted", value: valueOf("contacted"), color: "#1c5bb8" },
      { label: "Quoted", value: valueOf("quoted"), color: "#d97706" },
    ],
  };
}
