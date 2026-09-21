import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { parseLocale } from "@/lib/i18n/locale";
import { fallbackSupportReply, supportInstructions } from "@/lib/support/prompt";
import { uiMessageText } from "@/lib/support/transcript";

export const maxDuration = 30;

function hasAiAuth() {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
}

export async function POST(req: Request) {
  const body = (await req.json()) as { messages?: UIMessage[]; locale?: string };
  const locale = parseLocale(body.locale);
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  const question = lastUser ? uiMessageText(lastUser) : "";
  const fallback = fallbackSupportReply(question, locale);

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      async execute({ writer }) {
        if (hasAiAuth()) {
          try {
            const result = streamText({
              model: "google/gemini-3.8-flash",
              instructions: supportInstructions(locale),
              messages: await convertToModelMessages(messages),
            });

            let streamed = "";
            writer.write({ type: "start" });
            writer.write({ type: "text-start", id: "support-reply" });
            for await (const delta of result.textStream) {
              streamed += delta;
              writer.write({ type: "text-delta", id: "support-reply", delta });
            }
            if (!streamed.trim()) {
              writer.write({ type: "text-delta", id: "support-reply", delta: fallback });
            }
            writer.write({ type: "text-end", id: "support-reply" });
            writer.write({ type: "finish" });
            return;
          } catch (error) {
            console.error("support chat failed", error);
          }
        }

        writer.write({ type: "start" });
        writer.write({ type: "text-start", id: "support-reply" });
        writer.write({ type: "text-delta", id: "support-reply", delta: fallback });
        writer.write({ type: "text-end", id: "support-reply" });
        writer.write({ type: "finish" });
      },
      onError: () => fallback,
    }),
  });
}
