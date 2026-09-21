"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale as persistLocale } from "@/app/locale-actions";
import { getUi } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

export function LanguageToggle({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(locale);
  const [pending, startTransition] = useTransition();
  const t = getUi(current);

  useEffect(() => {
    setCurrent(locale);
  }, [locale]);

  function select(next: Locale) {
    setCurrent(next);
    document.documentElement.lang = next;
    startTransition(() => {
      void persistLocale(next).then(() => router.refresh());
    });
  }

  return (
    <div
      role="group"
      aria-label={t.language}
      suppressHydrationWarning
      className={cn("inline-flex shrink-0 rounded-md border border-white/25 p-0.5 text-xs font-bold tracking-wide", className)}
    >
      <button
        type="button"
        disabled={pending}
        aria-pressed={current === "en"}
        suppressHydrationWarning
        onClick={() => select("en")}
        className={cn(
          "rounded px-2.5 py-1.5 transition-colors",
          current === "en" ? "bg-white text-navy" : "text-white/80 hover:text-white",
        )}
      >
        {t.english}
      </button>
      <button
        type="button"
        disabled={pending}
        aria-pressed={current === "es"}
        suppressHydrationWarning
        onClick={() => select("es")}
        className={cn(
          "rounded px-2.5 py-1.5 transition-colors",
          current === "es" ? "bg-white text-navy" : "text-white/80 hover:text-white",
        )}
      >
        {t.spanish}
      </button>
    </div>
  );
}
