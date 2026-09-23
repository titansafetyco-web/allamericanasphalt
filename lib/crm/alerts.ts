import type { CrmMessage, MessageKind, MessageStatus } from "@/lib/crm/messages";

export type MessageAlert = {
  id: string;
  createdAt: string;
  kind: MessageKind;
  status: MessageStatus;
  name: string;
  preview: string;
};

export function kindLabel(kind: MessageKind) {
  if (kind === "contact") return "Contact form";
  if (kind === "feedback") return "Feedback";
  if (kind === "support") return "Chat support";
  return "Estimate request";
}

export function messageInboxHref(id: string) {
  return `/crm/messages?id=${encodeURIComponent(id)}`;
}

export function messagePreview(message: Pick<CrmMessage, "kind" | "body" | "service" | "city">) {
  const body = message.body.replace(/^Rating:\s*[1-5]\/5\s*/i, "").trim();
  const last = body.split("\n").map((line) => line.trim()).filter(Boolean).at(-1) ?? "";
  const text = last.replace(/^(Customer|Assistant):\s*/i, "").trim();
  return text || message.service || message.city || "New website message";
}

export function toMessageAlert(message: CrmMessage): MessageAlert {
  return {
    id: message.id,
    createdAt: message.createdAt,
    kind: message.kind,
    status: message.status,
    name: message.name,
    preview: messagePreview(message),
  };
}

export function listUnreadAlerts(messages: CrmMessage[]) {
  return messages.filter((message) => !message.read).map(toMessageAlert);
}

export function formatAlertTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(new Date(value));
}
