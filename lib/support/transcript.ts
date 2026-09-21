import type { UIMessage } from "ai";

export type SupportTurn = {
  role: "customer" | "assistant";
  text: string;
};

export function uiMessageText(message: UIMessage) {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("")
    .trim();
}

export function formatSupportTranscript(messages: UIMessage[]) {
  return messages
    .map((message) => {
      const text = uiMessageText(message);
      if (!text) return "";
      return `${message.role === "user" ? "Customer" : "Assistant"}: ${text}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

export function parseSupportTranscript(body: string) {
  const [main = "", ...rest] = body.split(/\n---+\n/);
  const notes = rest.map((note) => note.trim()).filter(Boolean);
  const turns: SupportTurn[] = [];

  for (const block of main.split(/\n{2,}/)) {
    const match = block.trim().match(/^(Customer|Assistant):\s*([\s\S]*)$/);
    if (!match) continue;
    turns.push({
      role: match[1] === "Customer" ? "customer" : "assistant",
      text: match[2].trim(),
    });
  }

  if (!turns.length && main.trim()) {
    turns.push({ role: "customer", text: main.trim() });
  }

  return { turns, notes };
}

export function appendSupportNote(body: string, note: string) {
  const trimmed = body.trim();
  const line = note.trim();
  if (!line) return trimmed;
  if (trimmed.includes(line)) return trimmed;
  return trimmed ? `${trimmed}\n---\n${line}` : line;
}
