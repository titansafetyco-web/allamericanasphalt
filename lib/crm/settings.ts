import { company } from "@/content/company";

export const CRM_SETTINGS_KEY = "aaa-crm-settings";

export type CrmRole = "office" | "dispatcher" | "field";

export type CrmSettings = {
  displayName: string;
  role: CrmRole;
  companyName: string;
  owner: string;
  email: string;
  phoneWestPalm: string;
  phoneFortLauderdale: string;
  address: string;
  leadInboxEmail: string;
  notifyEstimates: boolean;
  notifyContact: boolean;
  notifyFeedback: boolean;
  estimateValidDays: number;
  invoicePrefix: string;
  taxRate: number;
  paymentTerms: string;
  defaultCounty: "Palm Beach" | "Broward" | "Martin";
  crews: string[];
};

export const defaultCrmSettings: CrmSettings = {
  displayName: "",
  role: "office",
  companyName: company.shortName,
  owner: company.owner,
  email: company.email,
  phoneWestPalm: company.phones.westPalmBeach.display,
  phoneFortLauderdale: company.phones.fortLauderdale.display,
  address: `${company.address.line1} ${company.address.line2}, ${company.address.city}, ${company.address.state} ${company.address.zip}`,
  leadInboxEmail: company.email,
  notifyEstimates: true,
  notifyContact: true,
  notifyFeedback: false,
  estimateValidDays: 30,
  invoicePrefix: "AAA",
  taxRate: 7,
  paymentTerms: "Due on completion",
  defaultCounty: "Palm Beach",
  crews: ["Crew A", "Crew B", "Crew C"],
};

export function parseCrmSettings(value: unknown): CrmSettings {
  if (!value || typeof value !== "object") return defaultCrmSettings;
  const row = value as Partial<CrmSettings>;
  const crews = Array.isArray(row.crews)
    ? row.crews.map((crew) => String(crew).trim()).filter(Boolean)
    : defaultCrmSettings.crews;
  return {
    ...defaultCrmSettings,
    ...row,
    role: row.role === "dispatcher" || row.role === "field" ? row.role : "office",
    defaultCounty:
      row.defaultCounty === "Broward" || row.defaultCounty === "Martin" ? row.defaultCounty : "Palm Beach",
    estimateValidDays: Number(row.estimateValidDays) || defaultCrmSettings.estimateValidDays,
    taxRate: Number(row.taxRate) || 0,
    crews: crews.length ? crews : defaultCrmSettings.crews,
    notifyEstimates: typeof row.notifyEstimates === "boolean" ? row.notifyEstimates : defaultCrmSettings.notifyEstimates,
    notifyContact: typeof row.notifyContact === "boolean" ? row.notifyContact : defaultCrmSettings.notifyContact,
    notifyFeedback: typeof row.notifyFeedback === "boolean" ? row.notifyFeedback : defaultCrmSettings.notifyFeedback,
  };
}
