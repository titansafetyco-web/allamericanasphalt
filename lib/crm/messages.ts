import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type MessageKind = "estimate" | "contact" | "feedback";

export type CrmMessage = {
  id: string;
  createdAt: string;
  source: "website";
  kind: MessageKind;
  name: string;
  phone: string;
  email: string;
  service: string;
  city: string;
  body: string;
  read: boolean;
};

const filePath = path.join(process.cwd(), "data", "crm-messages.json");

const seed: CrmMessage[] = [
  {
    id: "seed-est-1",
    createdAt: "2026-09-21T14:12:00.000Z",
    source: "website",
    kind: "estimate",
    name: "Linda Ortiz",
    phone: "(561) 555-0142",
    email: "board@pbshoreshoa.com",
    service: "Seal coating",
    city: "West Palm Beach, FL",
    body: "Need a quote to seal coat the inner loop roads before the next HOA meeting.",
    read: false,
  },
  {
    id: "seed-est-2",
    createdAt: "2026-09-20T18:40:00.000Z",
    source: "website",
    kind: "estimate",
    name: "Nina Patel",
    phone: "(772) 555-0133",
    email: "npate@ci.stuart.fl.us",
    service: "Asphalt paving",
    city: "Stuart, FL",
    body: "Public Works wants an overlay quote for the campus lot entrance.",
    read: true,
  },
  {
    id: "seed-contact-1",
    createdAt: "2026-09-21T16:05:00.000Z",
    source: "website",
    kind: "contact",
    name: "James Whitaker",
    phone: "(954) 555-0176",
    email: "jwhitaker@harborplazallc.com",
    service: "",
    city: "Fort Lauderdale, FL",
    body: "Who should we send the vendor packet to? We manage Harbor Plaza and need a paving contractor on file.",
    read: false,
  },
  {
    id: "seed-contact-2",
    createdAt: "2026-09-19T20:18:00.000Z",
    source: "website",
    kind: "contact",
    name: "Angela Ruiz",
    phone: "(561) 555-0118",
    email: "angela.ruiz@email.com",
    service: "",
    city: "Lake Worth, FL",
    body: "Please call about office hours and whether you work on Saturday for a small driveway patch.",
    read: true,
  },
];

function sortMessages(messages: CrmMessage[]) {
  return messages.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function mergeMessages(...lists: CrmMessage[][]) {
  const byId = new Map<string, CrmMessage>();
  for (const list of lists) {
    for (const message of list) byId.set(message.id, message);
  }
  return sortMessages([...byId.values()]);
}

async function readFileMessages() {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as CrmMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeFileMessages(messages: CrmMessage[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(sortMessages(messages), null, 2)}\n`);
}

function fromRow(row: Record<string, unknown>): CrmMessage {
  return {
    id: String(row.id),
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
    source: "website",
    kind: row.kind === "contact" || row.kind === "feedback" ? row.kind : "estimate",
    name: String(row.name ?? ""),
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    service: String(row.service ?? ""),
    city: String(row.city ?? ""),
    body: String(row.body ?? ""),
    read: Boolean(row.read),
  };
}

async function listFromSupabase() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("crm_messages").select("*").order("created_at", { ascending: false });
    if (error) return null;
    return (data ?? []).map((row) => fromRow(row as Record<string, unknown>));
  } catch {
    return null;
  }
}

export async function listCrmMessages() {
  const fromDb = await listFromSupabase();
  const fromFile = await readFileMessages();
  return mergeMessages(fromDb ?? [], fromFile, seed);
}

export async function saveCrmMessage(input: Omit<CrmMessage, "id" | "createdAt" | "read" | "source"> & { id?: string }) {
  const message: CrmMessage = {
    id: input.id ?? crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source: "website",
    kind: input.kind,
    name: input.name,
    phone: input.phone,
    email: input.email,
    service: input.service,
    city: input.city,
    body: input.body,
    read: false,
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("crm_messages").insert({
        id: message.id,
        created_at: message.createdAt,
        source: message.source,
        kind: message.kind,
        name: message.name,
        phone: message.phone,
        email: message.email,
        service: message.service,
        city: message.city,
        body: message.body,
        read: false,
      });
      if (error) console.error("crm_messages insert", error.message);
    } catch (error) {
      console.error("crm_messages insert failed", error);
    }
  }

  const current = await readFileMessages();
  await writeFileMessages(mergeMessages(current, [message]));
  return message;
}

export async function markCrmMessageRead(id: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from("crm_messages").update({ read: true }).eq("id", id);
    } catch (error) {
      console.error("crm_messages update failed", error);
    }
  }

  const current = await readFileMessages();
  const next = current.map((message) => (message.id === id ? { ...message, read: true } : message));
  if (next.length) await writeFileMessages(next);
}
