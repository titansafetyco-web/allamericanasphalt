"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatAlertTime,
  kindLabel,
  messageInboxHref,
  type MessageAlert,
} from "@/lib/crm/alerts";
import { crmNav } from "@/lib/crm/nav";
import { cn } from "@/lib/utils";

const messagesItem = crmNav.find((item) => item.href === "/crm/messages");

export function useUnreadMessages(initial: MessageAlert[]) {
  const [unread, setUnread] = useState(initial);
  const [toasts, setToasts] = useState<MessageAlert[]>([]);
  const knownIds = useRef(new Set(initial.map((message) => message.id)));

  useEffect(() => {
    setUnread(initial);
    for (const message of initial) knownIds.current.add(message.id);
  }, [initial]);

  useEffect(() => {
    async function refresh() {
      try {
        const response = await fetch("/api/crm/unread-messages", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { unread?: MessageAlert[] };
        const next = Array.isArray(data.unread) ? data.unread : [];
        const fresh = next.filter((message) => !knownIds.current.has(message.id));
        for (const message of fresh) knownIds.current.add(message.id);
        if (fresh.length) {
          setToasts((current) => [...fresh, ...current].slice(0, 3));
        }
        setUnread(next);
      } catch {
        // Keep the last known unread list if polling fails.
      }
    }

    const timer = window.setInterval(refresh, 12000);
    const onFocus = () => {
      void refresh();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((message) => message.id !== id));
  }, []);

  return { unread, toasts, dismissToast };
}

function AlertMenuItems({
  unread,
  onPick,
}: {
  unread: MessageAlert[];
  onPick?: () => void;
}) {
  const router = useRouter();

  return (
    <>
      <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {unread.length ? `${unread.length} new ${unread.length === 1 ? "message" : "messages"}` : "Notifications"}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {unread.length ? (
        unread.map((message) => (
          <DropdownMenuItem
            key={message.id}
            className="items-start gap-2 px-2 py-2"
            onSelect={() => {
              onPick?.();
              router.push(messageInboxHref(message.id));
            }}
          >
            <span className="mt-1 size-2 shrink-0 rounded-full bg-red-flag" />
            <span className="grid min-w-0 flex-1 gap-0.5">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate font-semibold text-navy">{message.name}</span>
                <span className="shrink-0 text-[11px] text-muted-foreground">{formatAlertTime(message.createdAt)}</span>
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {kindLabel(message.kind)}
              </span>
              <span className="line-clamp-2 text-xs text-muted-foreground">{message.preview}</span>
            </span>
          </DropdownMenuItem>
        ))
      ) : (
        <p className="px-2 py-3 text-sm text-muted-foreground">No new messages.</p>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="justify-center font-semibold text-navy"
        onSelect={() => {
          onPick?.();
          router.push("/crm/messages");
        }}
      >
        View all messages
      </DropdownMenuItem>
    </>
  );
}

export function MessageNavAlerts({
  active,
  unread,
  onNavigate,
}: {
  active: boolean;
  unread: MessageAlert[];
  onNavigate: () => void;
}) {
  const Icon = messagesItem?.icon ?? MessageSquare;
  const count = unread.length;

  return (
    <div
      className={cn(
        "flex items-center rounded-lg",
        active ? "bg-white text-navy" : "text-white/80 hover:bg-white/10 hover:text-white",
      )}
    >
      <Link
        href="/crm/messages"
        onClick={onNavigate}
        className="inline-flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-sm font-semibold"
      >
        <Icon className="size-4" aria-hidden />
        Messages
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "mr-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold leading-none transition-colors",
              count
                ? "bg-red-flag text-white hover:bg-red-flag/90"
                : active
                  ? "bg-navy/10 text-navy hover:bg-navy/15"
                  : "bg-white/10 text-white hover:bg-white/20",
            )}
            aria-label={count ? `${count} new messages` : "Message notifications"}
          >
            {count ? (count > 99 ? "99+" : count) : <Bell className="size-3.5" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-80 min-w-80">
          <AlertMenuItems unread={unread} onPick={onNavigate} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function HeaderMessageBell({ unread }: { unread: MessageAlert[] }) {
  const count = unread.length;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative ml-auto inline-flex size-9 items-center justify-center rounded-lg text-navy hover:bg-muted"
          aria-label={count ? `${count} new messages` : "Message notifications"}
        >
          <Bell className="size-5" />
          {count ? (
            <span className="absolute top-0.5 right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-flag px-1 text-[10px] font-bold leading-none text-white">
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 min-w-80">
        <AlertMenuItems unread={unread} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function IncomingMessageToasts({
  toasts,
  onDismiss,
}: {
  toasts: MessageAlert[];
  onDismiss: (id: string) => void;
}) {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) => window.setTimeout(() => onDismissRef.current(toast.id), 7000));
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [toasts]);

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed top-16 right-4 z-50 grid w-[min(20rem,calc(100vw-2rem))] gap-2">
      {toasts.map((toast) => (
        <Link
          key={toast.id}
          href={messageInboxHref(toast.id)}
          onClick={() => onDismiss(toast.id)}
          className="pointer-events-auto animate-in slide-in-from-top-3 fade-in rounded-xl bg-white p-3 shadow-lg ring-1 ring-foreground/10 duration-200"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-red-flag">New message</p>
          <p className="mt-1 truncate text-sm font-bold text-navy">{toast.name}</p>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {kindLabel(toast.kind)}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{toast.preview}</p>
        </Link>
      ))}
    </div>
  );
}
