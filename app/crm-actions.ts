"use server";

import { revalidatePath } from "next/cache";
import { markCrmMessageRead } from "@/lib/crm/messages";

export async function markMessageRead(id: string) {
  await markCrmMessageRead(id);
  revalidatePath("/crm/messages");
}
