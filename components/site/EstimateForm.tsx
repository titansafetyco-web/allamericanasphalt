"use client";

import { useActionState } from "react";
import { submitLead, type FormState } from "@/app/actions";
import { serviceOptions } from "@/content/services";
import { extraServiceCities } from "@/content/areas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

export function EstimateForm({
  type = "estimate",
  compact = false,
  className,
}: {
  type?: "estimate" | "contact" | "feedback";
  compact?: boolean;
  className?: string;
}) {
  const [state, action, pending] = useActionState(submitLead, initial);

  return (
    <form action={action} className={cn("grid gap-2 md:gap-3", className)}>
      <input type="hidden" name="type" value={type} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <div className="grid gap-1 md:gap-1.5">
          <label htmlFor={`${type}-name`} className="text-xs font-medium md:text-sm">Name</label>
          <Input id={`${type}-name`} name="name" required placeholder="Your name" className="h-9 bg-white md:h-11" />
        </div>
        <div className="grid gap-1 md:gap-1.5">
          <label htmlFor={`${type}-phone`} className="text-xs font-medium md:text-sm">Phone</label>
          <Input id={`${type}-phone`} name="phone" required type="tel" placeholder="(561) 000-0000" className="h-9 bg-white md:h-11" />
        </div>
      </div>

      <div className="grid gap-1 md:gap-1.5">
        <label htmlFor={`${type}-email`} className="text-xs font-medium md:text-sm">Email</label>
        <Input id={`${type}-email`} name="email" type="email" placeholder="you@email.com" className="h-9 bg-white md:h-11" />
      </div>

      {type === "estimate" ? (
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <div className="grid gap-1 md:gap-1.5">
            <label htmlFor="service" className="text-xs font-medium md:text-sm">Service</label>
            <select
              id="service"
              name="service"
              className="h-9 rounded-lg border border-input bg-white px-2.5 text-sm md:h-11"
              defaultValue=""
            >
              <option value="">What do you need?</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1 md:gap-1.5">
            <label htmlFor="city" className="text-xs font-medium md:text-sm">City</label>
            <select id="city" name="city" className="h-9 rounded-lg border border-input bg-white px-2.5 text-sm md:h-11" defaultValue="">
              <option value="">Where is the job?</option>
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
        <label htmlFor={`${type}-message`} className="text-xs font-medium md:text-sm">
          {type === "feedback" ? "How did we do?" : type === "contact" ? "Your message" : "Project details"}
        </label>
        <Textarea
          id={`${type}-message`}
          name="message"
          rows={compact ? 2 : 5}
          placeholder={
            type === "feedback"
              ? "Compliment, complaint, or concern"
              : type === "contact"
                ? "How can we help?"
                : "Tell us about the driveway, lot, or road"
          }
          className="bg-white max-md:min-h-16 md:min-h-24"
        />
      </div>

      <Button type="submit" disabled={pending} className="h-10 bg-red-flag text-sm font-bold text-white hover:bg-red-flag/90 md:h-12 md:text-base">
        {pending
          ? "Sending…"
          : type === "feedback"
            ? "Send feedback"
            : type === "contact"
              ? "Send message"
              : "Request free estimate"}
      </Button>
      {state.message ? (
        <p className={cn("text-sm", state.ok ? "text-emerald-700" : "text-destructive")} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
