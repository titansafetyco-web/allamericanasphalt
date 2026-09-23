export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";
export type EstimateStatus = "draft" | "sent" | "approved" | "declined";
export type EstimateLine = {
  id: string;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
};

export type JobStatus = "scheduled" | "in_progress" | "complete" | "on_hold";
export type ServiceType =
  | "Asphalt paving"
  | "Seal coating"
  | "Striping"
  | "Speed bumps & bollards"
  | "Road work";

export const serviceTypes: ServiceType[] = [
  "Asphalt paving",
  "Seal coating",
  "Striping",
  "Speed bumps & bollards",
  "Road work",
];

export const quoteUnits = ["LS", "SQFT", "SY", "LF", "EA", "HR"] as const;

export type Customer = {
  id: string;
  name: string;
  type: "HOA" | "Commercial" | "Residential" | "Municipal" | "Church";
  contact: string;
  phone: string;
  email: string;
  city: string;
  county: "Palm Beach" | "Broward" | "Martin";
  jobs: number;
  lifetimeValue: number;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  service: ServiceType;
  city: string;
  county: Customer["county"];
  status: LeadStatus;
  value: number;
  source: "Website" | "Phone" | "Referral" | "Repeat";
  createdAt: string;
};

export type Estimate = {
  id: string;
  number: string;
  customer: string;
  service: ServiceType;
  city: string;
  status: EstimateStatus;
  amount: number;
  sentAt: string | null;
  validUntil: string;
  notes?: string;
  lines?: EstimateLine[];
};

export type InvoiceStatus = "sent" | "paid" | "overdue";

export type Invoice = {
  id: string;
  number: string;
  customer: string;
  service: ServiceType;
  city: string;
  status: InvoiceStatus;
  amount: number;
  issuedAt: string;
  dueAt: string;
};

export type Job = {
  id: string;
  name: string;
  customer: string;
  service: ServiceType;
  city: string;
  status: JobStatus;
  startDate: string;
  crew: string;
  amount: number;
};

export type ScheduleItem = {
  id: string;
  title: string;
  city: string;
  date: string;
  window: string;
  crew: string;
  status: JobStatus;
};

export const customers: Customer[] = [
  {
    id: "c-1",
    name: "Palm Beach Shores HOA",
    type: "HOA",
    contact: "Linda Ortiz",
    phone: "(561) 555-0142",
    email: "board@pbshoreshoa.com",
    city: "West Palm Beach",
    county: "Palm Beach",
    jobs: 4,
    lifetimeValue: 186400,
  },
  {
    id: "c-2",
    name: "Riviera Plaza",
    type: "Commercial",
    contact: "Marcus Chen",
    phone: "(561) 555-0198",
    email: "mchen@rivieraplaza.com",
    city: "Riviera Beach",
    county: "Palm Beach",
    jobs: 2,
    lifetimeValue: 94000,
  },
  {
    id: "c-3",
    name: "Sunrise Baptist Church",
    type: "Church",
    contact: "Pastor James Hale",
    phone: "(954) 555-0117",
    email: "office@sunrisebaptist.org",
    city: "Fort Lauderdale",
    county: "Broward",
    jobs: 1,
    lifetimeValue: 41200,
  },
  {
    id: "c-4",
    name: "Wellington Commons",
    type: "HOA",
    contact: "Alicia Grant",
    phone: "(561) 555-0166",
    email: "manager@wellingtoncommons.org",
    city: "Wellington",
    county: "Palm Beach",
    jobs: 3,
    lifetimeValue: 228750,
  },
  {
    id: "c-5",
    name: "Fort Lauderdale Logistics",
    type: "Commercial",
    contact: "Derek Walsh",
    phone: "(954) 555-0184",
    email: "ops@fdllogistics.com",
    city: "Fort Lauderdale",
    county: "Broward",
    jobs: 2,
    lifetimeValue: 67300,
  },
  {
    id: "c-6",
    name: "City of Stuart Public Works",
    type: "Municipal",
    contact: "Nina Patel",
    phone: "(772) 555-0133",
    email: "npate@ci.stuart.fl.us",
    city: "Stuart",
    county: "Martin",
    jobs: 5,
    lifetimeValue: 410800,
  },
  {
    id: "c-7",
    name: "The Brennan Residence",
    type: "Residential",
    contact: "Tom Brennan",
    phone: "(561) 555-0104",
    email: "tom.brennan@email.com",
    city: "Delray Beach",
    county: "Palm Beach",
    jobs: 1,
    lifetimeValue: 9800,
  },
];

export const leads: Lead[] = [
  {
    id: "l-1",
    name: "Linda Ortiz",
    company: "Palm Beach Shores HOA",
    phone: "(561) 555-0142",
    email: "board@pbshoreshoa.com",
    service: "Seal coating",
    city: "West Palm Beach",
    county: "Palm Beach",
    status: "new",
    value: 48500,
    source: "Website",
    createdAt: "2026-09-21",
  },
  {
    id: "l-2",
    name: "Marcus Chen",
    company: "Riviera Plaza",
    phone: "(561) 555-0198",
    email: "mchen@rivieraplaza.com",
    service: "Asphalt paving",
    city: "Riviera Beach",
    county: "Palm Beach",
    status: "contacted",
    value: 126000,
    source: "Phone",
    createdAt: "2026-09-19",
  },
  {
    id: "l-3",
    name: "Pastor James Hale",
    company: "Sunrise Baptist Church",
    phone: "(954) 555-0117",
    email: "office@sunrisebaptist.org",
    service: "Striping",
    city: "Fort Lauderdale",
    county: "Broward",
    status: "quoted",
    value: 18400,
    source: "Referral",
    createdAt: "2026-09-16",
  },
  {
    id: "l-4",
    name: "Alicia Grant",
    company: "Wellington Commons",
    phone: "(561) 555-0166",
    email: "manager@wellingtoncommons.org",
    service: "Road work",
    city: "Wellington",
    county: "Palm Beach",
    status: "quoted",
    value: 212000,
    source: "Repeat",
    createdAt: "2026-09-12",
  },
  {
    id: "l-5",
    name: "Derek Walsh",
    company: "Fort Lauderdale Logistics",
    phone: "(954) 555-0184",
    email: "ops@fdllogistics.com",
    service: "Speed bumps & bollards",
    city: "Fort Lauderdale",
    county: "Broward",
    status: "won",
    value: 27600,
    source: "Website",
    createdAt: "2026-09-08",
  },
  {
    id: "l-6",
    name: "Tom Brennan",
    company: "The Brennan Residence",
    phone: "(561) 555-0104",
    email: "tom.brennan@email.com",
    service: "Asphalt paving",
    city: "Delray Beach",
    county: "Palm Beach",
    status: "lost",
    value: 9800,
    source: "Website",
    createdAt: "2026-09-04",
  },
  {
    id: "l-7",
    name: "Nina Patel",
    company: "City of Stuart Public Works",
    phone: "(772) 555-0133",
    email: "npate@ci.stuart.fl.us",
    service: "Asphalt paving",
    city: "Stuart",
    county: "Martin",
    status: "new",
    value: 89000,
    source: "Phone",
    createdAt: "2026-09-20",
  },
  {
    id: "l-8",
    name: "Chris Alvarez",
    company: "Plantation Medical Plaza",
    phone: "(954) 555-0129",
    email: "calvarez@plantationmed.com",
    service: "Seal coating",
    city: "Plantation",
    county: "Broward",
    status: "contacted",
    value: 36200,
    source: "Website",
    createdAt: "2026-09-18",
  },
];

export const estimates: Estimate[] = [
  {
    id: "e-1",
    number: "EST-24091",
    customer: "Sunrise Baptist Church",
    service: "Striping",
    city: "Fort Lauderdale",
    status: "sent",
    amount: 18400,
    sentAt: "2026-09-16",
    validUntil: "2026-10-16",
  },
  {
    id: "e-2",
    number: "EST-24088",
    customer: "Wellington Commons",
    service: "Road work",
    city: "Wellington",
    status: "sent",
    amount: 212000,
    sentAt: "2026-09-13",
    validUntil: "2026-10-13",
  },
  {
    id: "e-3",
    number: "EST-24084",
    customer: "Fort Lauderdale Logistics",
    service: "Speed bumps & bollards",
    city: "Fort Lauderdale",
    status: "approved",
    amount: 27600,
    sentAt: "2026-09-08",
    validUntil: "2026-10-08",
  },
  {
    id: "e-4",
    number: "EST-24079",
    customer: "The Brennan Residence",
    service: "Asphalt paving",
    city: "Delray Beach",
    status: "declined",
    amount: 9800,
    sentAt: "2026-09-05",
    validUntil: "2026-10-05",
  },
  {
    id: "e-5",
    number: "EST-24093",
    customer: "Palm Beach Shores HOA",
    service: "Seal coating",
    city: "West Palm Beach",
    status: "draft",
    amount: 48500,
    sentAt: null,
    validUntil: "2026-10-21",
  },
  {
    id: "e-6",
    number: "EST-24090",
    customer: "Riviera Plaza",
    service: "Asphalt paving",
    city: "Riviera Beach",
    status: "draft",
    amount: 126000,
    sentAt: null,
    validUntil: "2026-10-19",
  },
];

export const invoices: Invoice[] = [
  {
    id: "inv-1",
    number: "INV-24084",
    customer: "Fort Lauderdale Logistics",
    service: "Speed bumps & bollards",
    city: "Fort Lauderdale",
    status: "sent",
    amount: 27600,
    issuedAt: "2026-09-12",
    dueAt: "2026-10-12",
  },
];

export const jobs: Job[] = [
  {
    id: "j-1",
    name: "Commons mill & overlay — Phase 2",
    customer: "Wellington Commons",
    service: "Road work",
    city: "Wellington",
    status: "in_progress",
    startDate: "2026-09-17",
    crew: "Crew A",
    amount: 96400,
  },
  {
    id: "j-2",
    name: "Yard speed control package",
    customer: "Fort Lauderdale Logistics",
    service: "Speed bumps & bollards",
    city: "Fort Lauderdale",
    status: "scheduled",
    startDate: "2026-09-24",
    crew: "Crew B",
    amount: 27600,
  },
  {
    id: "j-3",
    name: "Campus lot restripe",
    customer: "City of Stuart Public Works",
    service: "Striping",
    city: "Stuart",
    status: "scheduled",
    startDate: "2026-09-26",
    crew: "Crew C",
    amount: 22100,
  },
  {
    id: "j-4",
    name: "Shores inner loop seal coat",
    customer: "Palm Beach Shores HOA",
    service: "Seal coating",
    city: "West Palm Beach",
    status: "on_hold",
    startDate: "2026-09-29",
    crew: "Crew A",
    amount: 41200,
  },
  {
    id: "j-5",
    name: "North lot overlay",
    customer: "Riviera Plaza",
    service: "Asphalt paving",
    city: "Riviera Beach",
    status: "complete",
    startDate: "2026-08-28",
    crew: "Crew B",
    amount: 52800,
  },
];

export const schedule: ScheduleItem[] = [
  {
    id: "s-1",
    title: "Commons mill & overlay — Phase 2",
    city: "Wellington",
    date: "2026-09-22",
    window: "7:00 AM – 4:00 PM",
    crew: "Crew A",
    status: "in_progress",
  },
  {
    id: "s-2",
    title: "Yard speed control package",
    city: "Fort Lauderdale",
    date: "2026-09-24",
    window: "8:00 AM – 2:00 PM",
    crew: "Crew B",
    status: "scheduled",
  },
  {
    id: "s-3",
    title: "Campus lot restripe",
    city: "Stuart",
    date: "2026-09-26",
    window: "6:30 AM – 1:00 PM",
    crew: "Crew C",
    status: "scheduled",
  },
  {
    id: "s-4",
    title: "Shores inner loop seal coat",
    city: "West Palm Beach",
    date: "2026-09-29",
    window: "On hold — waiting on HOA vote",
    crew: "Crew A",
    status: "on_hold",
  },
];

export function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function lineTotal(line: EstimateLine) {
  const qty = Number(line.qty);
  const unitPrice = Number(line.unitPrice);
  if (!Number.isFinite(qty) || !Number.isFinite(unitPrice)) return 0;
  return Math.round(qty * unitPrice);
}

export function quoteSubtotal(lines: EstimateLine[]) {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export function defaultQuoteLines(estimate: Pick<Estimate, "id" | "service" | "amount" | "lines">): EstimateLine[] {
  if (estimate.lines?.length) return estimate.lines.map((line) => ({ ...line }));
  return [
    {
      id: `${estimate.id}-ls`,
      description: estimate.service,
      qty: 1,
      unit: "LS",
      unitPrice: estimate.amount,
    },
  ];
}

export function formatDate(value: string) {
  const date = value.includes("T") ? new Date(value) : new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export const pipelineValue = leads
  .filter((lead) => lead.status === "new" || lead.status === "contacted" || lead.status === "quoted")
  .reduce((sum, lead) => sum + lead.value, 0);

export const openLeads = leads.filter((lead) => lead.status !== "won" && lead.status !== "lost").length;
export const estimatesOut = estimates.filter((estimate) => estimate.status === "sent").length;
export const activeJobs = jobs.filter((job) => job.status === "in_progress" || job.status === "scheduled").length;
