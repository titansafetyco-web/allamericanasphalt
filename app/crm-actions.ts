"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { markCrmMessageRead, updateCrmMessageStatus, type MessageStatus } from "@/lib/crm/messages";
import { applyQuoteController, type QuoteIntent } from "@/lib/crm/pipeline";
import type { EstimateLine } from "@/lib/crm/data";

export async function markMessageRead(id: string) {
  await markCrmMessageRead(id);
  revalidatePath("/crm/messages");
  revalidatePath("/crm", "layout");
}

export async function setMessageStatus(id: string, status: MessageStatus) {
  await updateCrmMessageStatus(id, status);
  revalidatePath("/crm/messages");
  revalidatePath("/crm/invoices");
  revalidatePath("/crm");
  revalidatePath("/crm", "layout");
  if (status === "accepted") redirect("/crm/invoices?tab=estimates");
}

function parseLines(value: FormDataEntryValue | null): EstimateLine[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value) as EstimateLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveQuoteEstimate(formData: FormData) {
  const intent = String(formData.get("intent") ?? "save") as QuoteIntent;
  await applyQuoteController({
    id: String(formData.get("id") ?? ""),
    service: String(formData.get("service") ?? ""),
    city: String(formData.get("city") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    validUntil: String(formData.get("validUntil") ?? ""),
    lines: parseLines(formData.get("lines")),
    intent,
  });
  revalidatePath("/crm");
  revalidatePath("/crm/invoices");
  revalidatePath("/crm/leads");
  if (intent === "approve") redirect("/crm");
}
