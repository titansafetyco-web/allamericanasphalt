"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { markMessageRead, setMessageStatus } from "@/app/crm-actions";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CrmMessage, MessageKind, MessageStatus } from "@/lib/crm/messages";
import { parseSupportTranscript } from "@/lib/support/transcript";
import { cn } from "@/lib/utils";

type FilterId = "all" | "estimate" | "contact" | "support" | "draft";

const filters: { id: FilterId; label: string; hint: string; empty: string }[] = [
  {
    id: "all",
    label: "All",
    hint: "Estimate requests, contact forms, and customer service chats from the website land here.",
    empty: "No website messages yet.",
  },
  {
    id: "estimate",
    label: "Estimates",
    hint: "Estimate requests from the website land here.",
    empty: "No estimate requests yet. Homepage estimate submissions will show up here.",
  },
  {
    id: "contact",
    label: "Inbox",
    hint: "Contact form messages from the website land here.",
    empty: "No contact form messages yet. Submissions from Contact Us will show up here.",
  },
  {
    id: "support",
    label: "Chat Support",
    hint: "Customer service conversations from the website chat bubble land here.",
    empty: "No customer service conversations yet. Website support chats, texts, and live-agent requests will show up here.",
  },
  {
    id: "draft",
    label: "Drafts",
    hint: "Estimate requests saved as drafts stay here until you accept or deny them.",
    empty: "No drafts yet. Use Draft on an estimate request to save it here.",
  },
];

function isFilterId(value: string | undefined): value is FilterId {
  return value === "all" || value === "estimate" || value === "contact" || value === "support" || value === "draft";
}

function when(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(new Date(value));
}

function kindLabel(kind: MessageKind) {
  if (kind === "contact") return "Contact form";
  if (kind === "feedback") return "Feedback";
  if (kind === "support") return "Customer service";
  return "Estimate request";
}

function kindHeading(kind: MessageKind) {
  if (kind === "contact") return "Website contact form";
  if (kind === "feedback") return "Website feedback";
  if (kind === "support") return "Website customer service";
  return "Website estimate request";
}

function supportPreview(message: CrmMessage) {
  const { turns, notes } = parseSupportTranscript(message.body);
  const last = turns.at(-1);
  if (notes.length) return notes[notes.length - 1].split("\n")[0];
  if (last) return last.text;
  return message.service || "Customer service chat";
}

function SupportThread({ body }: { body: string }) {
  const { turns, notes } = parseSupportTranscript(body);
  return (
    <div className="grid gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Conversation</p>
      <div className="grid gap-2 rounded-lg bg-[#eef1f6] p-4">
        {turns.length ? (
          turns.map((turn, index) => (
            <p
              key={`${turn.role}-${index}`}
              className={cn(
                "max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                turn.role === "customer" ? "ml-auto bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10",
              )}
            >
              {turn.text}
            </p>
          ))
        ) : (
          <p className="text-sm text-navy">No messages yet.</p>
        )}
      </div>
      {notes.map((note) => (
        <div key={note} className="whitespace-pre-wrap rounded-lg bg-red-flag/8 px-4 py-3 text-sm font-medium text-navy">
          {note}
        </div>
      ))}
    </div>
  );
}

function splitRating(body: string) {
  const match = body.match(/^Rating:\s*([1-5])\/5\s*(?:\n+)?([\s\S]*)$/i);
  if (!match) return { rating: 0, text: body };
  return { rating: Number(match[1]), text: match[2] };
}

export function MessageInbox({
  messages,
  initialFilter,
  initialId,
}: {
  messages: CrmMessage[];
  initialFilter?: string;
  initialId?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>(
    initialId ? "all" : isFilterId(initialFilter) ? initialFilter : "all",
  );
  const [selectedId, setSelectedId] = useState(initialId || messages[0]?.id || "");
  const [readIds, setReadIds] = useState<Record<string, boolean>>({});
  const [statuses, setStatuses] = useState<Record<string, MessageStatus>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);

  const withLocalState = useMemo(
    () =>
      messages.map((message) => ({
        ...message,
        read: message.read || Boolean(readIds[message.id]),
        status: statuses[message.id] ?? message.status,
      })),
    [messages, readIds, statuses],
  );

  const counts = useMemo(() => {
    const openOf = (kind: MessageKind) =>
      withLocalState.filter((message) => message.status === "open" && message.kind === kind);
    const unreadOf = (list: typeof withLocalState) => list.filter((message) => !message.read).length;
    const drafts = withLocalState.filter((message) => message.status === "draft");
    const estimates = openOf("estimate");
    const contacts = openOf("contact");
    const support = openOf("support");
    return {
      all: withLocalState.length,
      estimate: estimates.length,
      contact: contacts.length,
      support: support.length,
      draft: drafts.length,
      unreadAll: unreadOf(withLocalState),
      unreadEstimate: unreadOf(estimates),
      unreadContact: unreadOf(contacts),
      unreadSupport: unreadOf(support),
      unreadDraft: unreadOf(drafts),
    };
  }, [withLocalState]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return withLocalState.filter((message) => {
      if (filter === "draft") {
        if (message.status !== "draft") return false;
      } else if (filter !== "all") {
        if (message.status !== "open" || message.kind !== filter) return false;
      }
      if (!needle) return true;
      return `${message.name} ${message.phone} ${message.email} ${message.service} ${message.city} ${message.body} ${message.kind} ${message.status}`
        .toLowerCase()
        .includes(needle);
    });
  }, [filter, query, withLocalState]);

  const selected = withLocalState.find((message) => message.id === selectedId) ?? filtered[0] ?? null;
  const selectedRating = selected ? splitRating(selected.body) : null;
  const activeFilter = filters.find((item) => item.id === filter) ?? filters[0];
  const unread =
    filter === "estimate"
      ? counts.unreadEstimate
      : filter === "contact"
        ? counts.unreadContact
        : filter === "support"
          ? counts.unreadSupport
          : filter === "draft"
            ? counts.unreadDraft
            : counts.unreadAll;
  const locked = selected?.status === "accepted" || selected?.status === "denied";

  async function openMessage(id: string) {
    setSelectedId(id);
    const message = messages.find((item) => item.id === id);
    if (message && !message.read && !readIds[id]) {
      setReadIds((current) => ({ ...current, [id]: true }));
      await markMessageRead(id);
      router.refresh();
    }
  }

  useEffect(() => {
    if (!initialId) return;
    setFilter("all");
    setSelectedId(initialId);
    const message = messages.find((item) => item.id === initialId);
    if (!message || message.read) return;
    setReadIds((current) => (current[initialId] ? current : { ...current, [initialId]: true }));
    void markMessageRead(initialId).then(() => router.refresh());
    // Open this message once when the notification link lands here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  async function decide(status: MessageStatus) {
    if (!selected || locked || selected.kind !== "estimate") return;
    setPendingId(selected.id);
    setStatuses((current) => ({ ...current, [selected.id]: status }));
    setReadIds((current) => ({ ...current, [selected.id]: true }));
    if (status === "draft") setFilter("draft");
    try {
      await setMessageStatus(selected.id, status);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-1 rounded-lg bg-white p-1 ring-1 ring-foreground/10" role="tablist" aria-label="Message filters">
            {filters.map((item) => {
              const active = filter === item.id;
              const total =
                item.id === "estimate"
                  ? counts.estimate
                  : item.id === "contact"
                    ? counts.contact
                    : item.id === "support"
                      ? counts.support
                      : item.id === "draft"
                        ? counts.draft
                        : counts.all;
              const unreadCount =
                item.id === "estimate"
                  ? counts.unreadEstimate
                  : item.id === "contact"
                    ? counts.unreadContact
                    : item.id === "support"
                      ? counts.unreadSupport
                      : item.id === "draft"
                        ? counts.unreadDraft
                        : counts.unreadAll;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
                    active ? "bg-navy text-white" : "text-navy/75 hover:bg-muted",
                  )}
                >
                  {item.label}
                  <span className={cn("rounded-full px-1.5 text-[11px]", active ? "bg-white/20" : "bg-[#eef1f6] text-navy")}>
                    {total}
                  </span>
                  {unreadCount > 0 ? <span className="size-1.5 rounded-full bg-red-flag" /> : null}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground">
            {activeFilter.hint} {unread} unread.
          </p>
        </div>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search messages"
          className="h-10 max-w-xs bg-white"
          aria-label="Search messages"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white px-6 py-12 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
          {activeFilter.empty}
        </div>
      ) : (
        <div className="grid overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10 lg:grid-cols-[20rem_1fr]">
          <ul className="divide-y border-b lg:max-h-[70vh] lg:overflow-y-auto lg:border-b-0 lg:border-r">
            {filtered.map((message) => {
              const active = selected?.id === message.id;
              const preview = splitRating(message.body);
              return (
                <li key={message.id}>
                  <button
                    type="button"
                    onClick={() => openMessage(message.id)}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors",
                      active ? "bg-navy/5" : "hover:bg-muted/60",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("truncate text-sm", message.read ? "font-medium text-navy" : "font-bold text-navy")}>
                        {message.name}
                      </p>
                      {!message.read ? <span className="size-2 shrink-0 rounded-full bg-red-flag" /> : null}
                    </div>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {kindLabel(message.kind)}
                    </p>
                    {message.status !== "open" ? (
                      <div className="mt-1">
                        <StatusBadge status={message.status} />
                      </div>
                    ) : null}
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {message.kind === "support"
                        ? supportPreview(message)
                        : preview.rating
                          ? `${"★".repeat(preview.rating)} ${preview.text || `${preview.rating}/5`}`
                          : message.body || message.service || message.city}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{when(message.createdAt)}</p>
                  </button>
                </li>
              );
            })}
          </ul>

          {selected ? (
            <article className="grid content-start gap-4 p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-flag">{kindHeading(selected.kind)}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-2xl text-navy">{selected.name}</h2>
                  {selected.status !== "open" ? <StatusBadge status={selected.status} /> : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{when(selected.createdAt)}</p>
              </div>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</dt>
                  <dd>
                    {selected.phone ? (
                      <a className="font-medium text-navy hover:underline" href={`tel:${selected.phone.replace(/\D/g, "")}`}>
                        {selected.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</dt>
                  <dd>
                    {selected.email ? (
                      <a className="font-medium text-navy hover:underline" href={`mailto:${selected.email}`}>
                        {selected.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                {selected.kind === "estimate" || selected.kind === "support" ? (
                  <>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {selected.kind === "support" ? "Channel" : "Service"}
                      </dt>
                      <dd className="font-medium">{selected.service || "—"}</dd>
                    </div>
                    {selected.city ? (
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">City</dt>
                        <dd className="font-medium">{selected.city}</dd>
                      </div>
                    ) : null}
                  </>
                ) : selected.city ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">City</dt>
                    <dd className="font-medium">{selected.city}</dd>
                  </div>
                ) : null}
              </dl>
              {selectedRating?.rating ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rating</p>
                  <p className="mt-1 text-lg tracking-wide text-amber-500" aria-label={`${selectedRating.rating} out of 5 stars`}>
                    {"★".repeat(selectedRating.rating)}
                    <span className="text-black/20">{"★".repeat(5 - selectedRating.rating)}</span>
                    <span className="ml-2 align-middle text-sm font-semibold text-navy">{selectedRating.rating}/5</span>
                  </p>
                </div>
              ) : null}
              {selected.kind === "support" ? (
                <SupportThread body={selected.body} />
              ) : (
                <div className="rounded-lg bg-[#eef1f6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-navy">
                    {selectedRating?.text || "No message was included."}
                  </p>
                </div>
              )}
              {selected.kind === "estimate" ? (
                <div className="flex flex-wrap gap-2 border-t pt-4">
                  <Button
                    type="button"
                    disabled={locked || pendingId === selected.id}
                    onClick={() => decide("accepted")}
                    className="h-10 bg-navy px-4 font-bold text-white hover:bg-navy/90"
                  >
                    Accept
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={locked || pendingId === selected.id}
                    onClick={() => decide("denied")}
                    className="h-10 px-4 font-semibold"
                  >
                    Deny
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={locked || pendingId === selected.id || selected.status === "draft"}
                    onClick={() => decide("draft")}
                    className="h-10 px-4 font-semibold"
                  >
                    Draft
                  </Button>
                </div>
              ) : null}
            </article>
          ) : null}
        </div>
      )}
    </div>
  );
}
