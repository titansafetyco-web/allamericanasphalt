"use server";

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
          subject: `${payload.type === "feedback" ? "Website feedback" : "Free estimate request"} from ${payload.name}`,
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
      payload.type === "feedback"
        ? "Thank you. We take every comment seriously and will follow up if we need more detail."
        : "Thanks — we received your request. Call (561) 684-9183 if you need us sooner.",
  };
}

export async function submitAuth(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) {
    return { ok: true, message: "Thanks — we received your request." };
  }

  const mode = String(formData.get("mode") ?? "signin") === "signup" ? "signup" : "signin";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }
  if (mode === "signup" && !name) {
    return { ok: false, message: "Please add your name so we can set up the account." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && mode === "signup") {
    const text = [`Type: account request`, `Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "n/a"}`].join("\n");
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "All American Asphalt Website <leads@allamericanasphaltpaving.com>",
          to: [RECIPIENT],
          subject: `Account request from ${name}`,
          text,
        }),
      });
    } catch (error) {
      console.error("Account email failed", error);
    }
  } else {
    console.info("Auth submission", { mode, email, name: name || undefined });
  }

  return {
    ok: true,
    message:
      mode === "signup"
        ? "Thanks — we received your registration. We’ll follow up the same business day."
        : "If an account exists for that email, we’ll send a confirmation shortly.",
  };
}
