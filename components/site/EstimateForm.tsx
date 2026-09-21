"use client";

import { useActionState } from "react";
import { submitLead, type FormState } from "@/app/actions";
import { extraServiceCities } from "@/content/areas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getServiceOptions, getUi } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

export function EstimateForm({
  type = "estimate",
  compact = false,
  className,
  locale = "en",
}: {
  type?: "estimate" | "contact" | "feedback";
  compact?: boolean;
  className?: string;
  locale?: Locale;
}) {
  const [state, action, pending] = useActionState(submitLead, initial);
  const t = getUi(locale);
  const options = getServiceOptions(locale);

  return (
    <form action={action} suppressHydrationWarning className={cn("grid gap-2 md:gap-3", className)}>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="locale" value={locale} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <div className="grid gap-1 md:gap-1.5">
          <label htmlFor={`${type}-name`} suppressHydrationWarning className="text-xs font-bold text-black md:text-sm">{t.form.name}</label>
          <Input id={`${type}-name`} name="name" required placeholder={t.form.yourName} className="h-9 bg-white md:h-11" suppressHydrationWarning />
        </div>
        <div className="grid gap-1 md:gap-1.5">
          <label htmlFor={`${type}-phone`} suppressHydrationWarning className="text-xs font-bold text-black md:text-sm">{t.form.phone}</label>
          <Input id={`${type}-phone`} name="phone" required type="tel" placeholder="(561) 000-0000" className="h-9 bg-white md:h-11" suppressHydrationWarning />
        </div>
      </div>

      <div className="grid gap-1 md:gap-1.5">
          <label htmlFor={`${type}-email`} suppressHydrationWarning className="text-xs font-bold text-black md:text-sm">{t.form.email}</label>
        <Input id={`${type}-email`} name="email" type="email" placeholder="you@email.com" className="h-9 bg-white md:h-11" suppressHydrationWarning />
      </div>

      {type === "estimate" ? (
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <div className="grid gap-1 md:gap-1.5">
            <label htmlFor="service" suppressHydrationWarning className="text-xs font-bold text-black md:text-sm">{t.form.service}</label>
            <select
              id="service"
              name="service"
              suppressHydrationWarning
              className="h-9 rounded-lg border border-input bg-white px-2.5 text-sm md:h-11"
              defaultValue=""
            >
              <option value="">{t.form.needPlaceholder}</option>
              {options.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1 md:gap-1.5">
            <label htmlFor="city" suppressHydrationWarning className="text-xs font-bold text-black md:text-sm">{t.form.city}</label>
            <select id="city" name="city" suppressHydrationWarning className="h-9 rounded-lg border border-input bg-white px-2.5 text-sm md:h-11" defaultValue="">
              <option value="">{t.form.cityPlaceholder}</option>
              {extraServiceCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div className="grid gap-1 md:gap-1.5">
        <label htmlFor={`${type}-message`} suppressHydrationWarning className="text-xs font-bold text-black md:text-sm">
          {type === "feedback" ? t.form.howDidWeDo : type === "contact" ? t.form.yourMessage : t.form.projectDetails}
        </label>
        <Textarea
          id={`${type}-message`}
          name="message"
          suppressHydrationWarning
          rows={compact ? 2 : 5}
          placeholder={
            type === "feedback"
              ? t.form.feedbackPlaceholder
              : type === "contact"
                ? t.form.helpPlaceholder
                : t.form.projectPlaceholder
          }
          className="bg-white max-md:min-h-16 md:min-h-24"
        />
      </div>

      <Button type="submit" disabled={pending} suppressHydrationWarning className="h-10 bg-red-flag text-sm font-bold text-white hover:bg-navy md:h-12 md:text-base">
        {pending
          ? t.form.sending
          : type === "feedback"
            ? t.form.sendFeedback
            : type === "contact"
              ? t.form.sendMessage
              : t.form.requestEstimate}
      </Button>
      {state.message ? (
        <p className={cn("text-sm", state.ok ? "text-emerald-700" : "text-destructive")} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
