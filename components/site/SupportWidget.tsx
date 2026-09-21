"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowLeft, MessageCircle, Phone, Send, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { requestSupportFollowUp, saveSupportConversation } from "@/app/support-actions";
import { company } from "@/content/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUi } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";
import { formatSupportTranscript, uiMessageText } from "@/lib/support/transcript";
import { cn } from "@/lib/utils";

type Panel = "home" | "chat" | "text" | "agent";

type Contact = {
  name: string;
  phone: string;
  email: string;
  city: string;
};

const emptyContact: Contact = { name: "", phone: "", email: "", city: "" };
const sessionKey = "aaa-support-id";
const contactKey = "aaa-support-contact";

function sessionId() {
  if (typeof window === "undefined") return "";
  const existing = window.sessionStorage.getItem(sessionKey);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(sessionKey, id);
  return id;
}

function readContact(): Contact {
  if (typeof window === "undefined") return emptyContact;
  try {
    const raw = window.sessionStorage.getItem(contactKey);
    return raw ? { ...emptyContact, ...(JSON.parse(raw) as Contact) } : emptyContact;
  } catch {
    return emptyContact;
  }
}

export function SupportWidget({ locale }: { locale: Locale }) {
  const t = getUi(locale).support;
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("home");
  const [threadId, setThreadId] = useState("");
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [note, setNote] = useState("");
  const [input, setInput] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef(contact);
  const [ready, setReady] = useState(false);
  contactRef.current = contact;

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/support/chat", body: { locale } }),
    [locale],
  );

  const { messages, sendMessage, status } = useChat({
    transport,
    onFinish: ({ messages: next }) => {
      const id = threadId || sessionId();
      void saveSupportConversation({
        id,
        contact: contactRef.current,
        service: "AI chat",
        body: formatSupportTranscript(next),
      });
    },
  });

  useEffect(() => {
    setThreadId(sessionId());
    setContact(readContact());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.sessionStorage.setItem(contactKey, JSON.stringify(contact));
  }, [contact, ready]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status, open, panel]);

  const busy = status === "submitted" || status === "streaming";

  function updateContact<K extends keyof Contact>(key: K, value: Contact[K]) {
    setContact((current) => ({ ...current, [key]: value }));
  }

  function openPanel(next: Panel) {
    setFormMessage("");
    setPanel(next);
    setOpen(true);
  }

  async function submitFollowUp(kind: "text" | "agent") {
    setPending(true);
    setFormMessage("");
    const result = await requestSupportFollowUp({
      id: threadId || sessionId(),
      contact,
      body: formatSupportTranscript(messages),
      kind,
      message: note,
    });
    setPending(false);
    if (!result.ok) {
      setFormMessage(t.missing);
      return;
    }
    setNote("");
    setFormMessage(kind === "agent" ? t.sentAgent : t.sentText);
  }

  return (
    <div className="fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-3 print:hidden md:right-6 md:bottom-6">
      {open ? (
        <section
          className="flex h-[min(34rem,calc(100dvh-6.5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_rgba(7,28,69,0.28)] ring-1 ring-navy/10"
          aria-label={t.title}
        >
          <header className="flex items-start justify-between gap-3 bg-navy px-4 py-3 text-white">
            <div className="min-w-0">
              {panel !== "home" ? (
                <button
                  type="button"
                  onClick={() => openPanel("home")}
                  className="mb-1 inline-flex items-center gap-1 text-[11px] font-semibold text-white/75 hover:text-white"
                >
                  <ArrowLeft className="size-3" aria-hidden />
                  {t.back}
                </button>
              ) : null}
              <p className="font-heading text-lg leading-tight">{t.title}</p>
              <p className="mt-0.5 text-xs text-white/75">{t.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label={t.close}
            >
              <X className="size-4" aria-hidden />
            </button>
          </header>

          {panel === "home" ? (
            <div className="grid flex-1 content-start gap-2 overflow-y-auto p-3">
              <HomeCard title={t.chat} hint={t.chatHint} onClick={() => openPanel("chat")} icon={MessageCircle} />
              <HomeCard title={t.text} hint={t.textHint} onClick={() => openPanel("text")} icon={Phone} />
              <HomeCard title={t.agent} hint={t.agentHint} onClick={() => openPanel("agent")} icon={UserRound} />
            </div>
          ) : null}

          {panel === "chat" ? (
            <>
              <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
                <ChatBubble role="assistant">{t.welcome}</ChatBubble>
                {messages.map((message) => {
                  const text = uiMessageText(message);
                  if (!text) return null;
                  return (
                    <ChatBubble key={message.id} role={message.role === "user" ? "user" : "assistant"}>
                      {text}
                    </ChatBubble>
                  );
                })}
                {busy ? <p className="px-1 text-xs text-muted-foreground">{t.typing}</p> : null}
              </div>
              <div className="grid gap-2 border-t px-3 py-3">
                <div className="flex gap-2">
                  <button type="button" onClick={() => openPanel("text")} className="flex-1 rounded-md bg-[#eef1f6] px-2 py-1.5 text-[11px] font-semibold text-navy hover:bg-navy/10">
                    {t.text}
                  </button>
                  <button type="button" onClick={() => openPanel("agent")} className="flex-1 rounded-md bg-[#eef1f6] px-2 py-1.5 text-[11px] font-semibold text-navy hover:bg-navy/10">
                    {t.agent}
                  </button>
                </div>
                <form
                  className="flex items-end gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const text = input.trim();
                    if (!text || busy) return;
                    void sendMessage({ text });
                    setInput("");
                  }}
                >
                  <Textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={t.placeholder}
                    rows={2}
                    className="min-h-11 flex-1 resize-none bg-[#eef1f6]"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                  <Button type="submit" disabled={busy || !input.trim()} className="h-11 bg-red-flag hover:bg-navy" aria-label={t.send}>
                    <Send className="size-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : null}

          {panel === "text" || panel === "agent" ? (
            <div className="grid flex-1 content-start gap-3 overflow-y-auto p-4">
              <p className="text-sm text-navy/80">{panel === "text" ? t.textIntro : t.agentIntro}</p>
              {panel === "text" ? (
                <div className="grid gap-2">
                  <a
                    href={`sms:${company.phones.westPalmBeach.href.replace("tel:", "")}`}
                    className="rounded-lg bg-navy px-3 py-2 text-center text-sm font-semibold text-white hover:bg-navy-light"
                  >
                    {t.textWpb}
                  </a>
                  <a
                    href={`sms:${company.phones.fortLauderdale.href.replace("tel:", "")}`}
                    className="rounded-lg bg-navy px-3 py-2 text-center text-sm font-semibold text-white hover:bg-navy-light"
                  >
                    {t.textFtl}
                  </a>
                </div>
              ) : null}
              <div className="grid gap-2">
                <Field label={t.name} value={contact.name} onChange={(value) => updateContact("name", value)} />
                <Field label={t.phone} value={contact.phone} onChange={(value) => updateContact("phone", value)} type="tel" />
                <Field label={t.email} value={contact.email} onChange={(value) => updateContact("email", value)} type="email" />
                <label className="grid gap-1 text-xs font-bold text-navy">
                  {t.yourMessage}
                  <Textarea value={note} onChange={(event) => setNote(event.target.value)} className="min-h-20 bg-[#eef1f6]" />
                </label>
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => void submitFollowUp(panel === "text" ? "text" : "agent")}
                  className="bg-red-flag hover:bg-navy"
                >
                  {pending ? t.sending : panel === "text" ? t.leaveText : t.agent}
                </Button>
                {formMessage ? <p className="text-sm font-medium text-navy">{formMessage}</p> : null}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex size-14 items-center justify-center rounded-full bg-red-flag text-white shadow-[0_10px_28px_rgba(200,16,46,0.35)] ring-4 ring-white transition hover:bg-navy"
        aria-expanded={open}
        aria-label={open ? t.close : t.open}
      >
        {open ? <X className="size-6" aria-hidden /> : <MessageCircle className="size-6" aria-hidden />}
      </button>
    </div>
  );
}

function HomeCard({
  title,
  hint,
  onClick,
  icon: Icon,
}: {
  title: string;
  hint: string;
  onClick: () => void;
  icon: typeof MessageCircle;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid gap-1 rounded-xl bg-[#eef1f6] px-3 py-3 text-left ring-1 ring-navy/8 transition hover:bg-navy/5"
    >
      <span className="inline-flex items-center gap-2 font-heading text-base text-navy">
        <Icon className="size-4 text-red-flag" aria-hidden />
        {title}
      </span>
      <span className="text-xs leading-relaxed text-muted-foreground">{hint}</span>
    </button>
  );
}

function ChatBubble({ role, children }: { role: "user" | "assistant"; children: string }) {
  return (
    <p
      className={cn(
        "max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
        role === "user" ? "ml-auto bg-navy text-white" : "bg-[#eef1f6] text-navy",
      )}
    >
      {children}
    </p>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-bold text-navy">
      {label}
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 bg-[#eef1f6]" />
    </label>
  );
}
