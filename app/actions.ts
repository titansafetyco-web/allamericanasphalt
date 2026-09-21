"use server";

import { revalidatePath } from "next/cache";
import { saveCrmMessage } from "@/lib/crm/messages";

export type FormState = {
  ok: boolean;
  message: string;
};

const RECIPIENT = process.env.LEAD_EMAIL ?? "allamericanasph@aol.com";

export async function submitLead(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) {
    return { ok: true, message: "Thanks — we received your message." };
  }

  const payload = {
    type: String(formData.get("type") ?? "estimate"),
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    service: String(formData.get("service") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  if (!payload.name || !payload.phone) {
    return { ok: false, message: "Please add your name and phone number so we can reach you." };
  }

  const kind =
    payload.type === "contact" ? "contact" : payload.type === "feedback" ? "feedback" : "estimate";
  try {
    await saveCrmMessage({
      kind,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      service: payload.service,
      city: payload.city,
      body: payload.message,
    });
    revalidatePath("/crm/messages");
  } catch (error) {
    console.error("CRM message save failed", error);
  }

  const text = [
    `Type: ${payload.type}`,
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email || "n/a"}`,
    `Service: ${payload.service || "n/a"}`,
    `City: ${payload.city || "n/a"}`,
    "",
    payload.message,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "All American Asphalt Website <leads@allamericanasphaltpaving.com>",
          to: [RECIPIENT],
          subject: `${
            kind === "contact"
              ? "Website contact"
              : kind === "feedback"
                ? "Website feedback"
                : "Free estimate request"
          } from ${payload.name}`,
          text,
        }),
      });
      if (!res.ok) {
        console.error("Resend error", await res.text());
      }
    } catch (error) {
      console.error("Lead email failed", error);
    }
  } else {
    console.info("Lead submission (email not configured)", payload);
  }

  return {
    ok: true,
    message:
      kind === "feedback"
        ? "Thank you. We take every comment seriously and will follow up if we need more detail."
        : kind === "contact"
          ? "Thanks — we received your message. Call (561) 684-9183 if you need us sooner."
          : "Thanks — we received your request. Call (561) 684-9183 if you need us sooner.",
  };
}
