"use client";

import { useMemo, useState } from "react";
import { markMessageRead } from "@/app/crm-actions";
import { Input } from "@/components/ui/input";
import type { CrmMessage, MessageKind } from "@/lib/crm/messages";
import { cn } from "@/lib/utils";

type FilterId = "all" | "estimate" | "contact";

const filters: { id: FilterId; label: string; hint: string; empty: string }[] = [
  {
    id: "all",
    label: "All",
    hint: "Estimate requests and contact form messages from the website land here.",
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
];

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
  return "Estimate request";
}

function kindHeading(kind: MessageKind) {
  if (kind === "contact") return "Website contact form";
  if (kind === "feedback") return "Website feedback";
  return "Website estimate request";
}

export function MessageInbox({ messages }: { messages: CrmMessage[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [selectedId, setSelectedId] = useState(messages[0]?.id ?? "");
  const [readIds, setReadIds] = useState<Record<string, boolean>>({});

  const withReadState = useMemo(
    () =>
      messages.map((message) => ({
        ...message,
        read: message.read || Boolean(readIds[message.id]),
      })),
    [messages, readIds],
  );

  const counts = useMemo(() => {
    const unreadOf = (kind?: MessageKind) =>
      withReadState.filter((message) => !message.read && (!kind || message.kind === kind)).length;
    return {
      all: withReadState.length,
      estimate: withReadState.filter((message) => message.kind === "estimate").length,
      contact: withReadState.filter((message) => message.kind === "contact").length,
      unreadAll: unreadOf(),
      unreadEstimate: unreadOf("estimate"),
      unreadContact: unreadOf("contact"),
    };
  }, [withReadState]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return withReadState.filter((message) => {
      if (filter === "estimate" && message.kind !== "estimate") return false;
      if (filter === "contact" && message.kind !== "contact") return false;
      if (!needle) return true;
      return `${message.name} ${message.phone} ${message.email} ${message.service} ${message.city} ${message.body} ${message.kind}`
        .toLowerCase()
        .includes(needle);
    });
  }, [filter, query, withReadState]);

  const selected = filtered.find((message) => message.id === selectedId) ?? filtered[0] ?? null;
  const activeFilter = filters.find((item) => item.id === filter) ?? filters[0];
  const unread =
    filter === "estimate" ? counts.unreadEstimate : filter === "contact" ? counts.unreadContact : counts.unreadAll;

  async function openMessage(id: string) {
    setSelectedId(id);
    const message = messages.find((item) => item.id === id);
    if (message && !message.read && !readIds[id]) {
      setReadIds((current) => ({ ...current, [id]: true }));
      await markMessageRead(id);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-1 rounded-lg bg-white p-1 ring-1 ring-foreground/10" role="tablist" aria-label="Message filters">
            {filters.map((item) => {
              const active = filter === item.id;
              const total = item.id === "estimate" ? counts.estimate : item.id === "contact" ? counts.contact : counts.all;
              const unreadCount =
                item.id === "estimate" ? counts.unreadEstimate : item.id === "contact" ? counts.unreadContact : counts.unreadAll;
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
                    <p className="mt-1 truncate text-xs text-muted-foreground">{message.body || message.service || message.city}</p>
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
                <h2 className="mt-1 font-heading text-2xl text-navy">{selected.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{when(selected.createdAt)}</p>
              </div>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</dt>
                  <dd>
                    <a className="font-medium text-navy hover:underline" href={`tel:${selected.phone.replace(/\D/g, "")}`}>
                      {selected.phone}
                    </a>
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
                {selected.kind === "estimate" ? (
                  <>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service</dt>
                      <dd className="font-medium">{selected.service || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">City</dt>
                      <dd className="font-medium">{selected.city || "—"}</dd>
                    </div>
                  </>
                ) : selected.city ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">City</dt>
                    <dd className="font-medium">{selected.city}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="rounded-lg bg-[#eef1f6] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-navy">
                  {selected.body || "No message was included."}
                </p>
              </div>
            </article>
          ) : null}
        </div>
      )}
    </div>
  );
}
