"use server";

import { revalidatePath } from "next/cache";
import { upsertCrmMessage } from "@/lib/crm/messages";
import { appendSupportNote } from "@/lib/support/transcript";

export type SupportContact = {
  name: string;
  phone: string;
  email: string;
  city: string;
};

export async function saveSupportConversation(input: {
  id: string;
  contact?: Partial<SupportContact>;
  service?: string;
  body: string;
  note?: string;
}) {
  const name = input.contact?.name?.trim() || "Website visitor";
  const phone = input.contact?.phone?.trim() || "";
  const email = input.contact?.email?.trim() || "";
  const city = input.contact?.city?.trim() || "";
  const body = input.note ? appendSupportNote(input.body, input.note) : input.body;

  await upsertCrmMessage({
    id: input.id,
    kind: "support",
    name,
    phone,
    email,
    service: input.service ?? "AI chat",
    city,
    body,
  });
  revalidatePath("/crm/messages");
  revalidatePath("/crm");
  return { ok: true as const };
}

export async function requestSupportFollowUp(input: {
  id: string;
  contact: SupportContact;
  body: string;
  kind: "text" | "agent";
  message: string;
}) {
  const name = input.contact.name.trim();
  const phone = input.contact.phone.trim();
  if (!name || !phone) {
    return { ok: false as const, message: "missing" };
  }

  const note =
    input.kind === "agent"
      ? `Live agent requested\n${input.message.trim()}`
      : `Text message\n${input.message.trim()}`;

  await saveSupportConversation({
    id: input.id,
    contact: input.contact,
    service: input.kind === "agent" ? "Live agent" : "Text",
    body: input.body,
    note,
  });

  return { ok: true as const };
}
