"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitAuth } from "@/app/auth-actions";
import type { FormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthButtons } from "@/components/site/OAuthButtons";
import { getUi } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

export function AuthForm({
  mode,
  error,
  locale = "en",
}: {
  mode: "signin" | "signup";
  error?: string;
  locale?: Locale;
}) {
  const [state, action, pending] = useActionState(submitAuth, initial);
  const isSignUp = mode === "signup";
  const t = getUi(locale);

  return (
    <div className="grid gap-4">
      <form action={action} className="grid gap-3">
        <input type="hidden" name="mode" value={mode} />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        {isSignUp ? (
          <div className="grid gap-1.5">
            <label htmlFor="auth-name" className="text-sm font-medium">
            {t.pages.authName}
          </label>
          <Input id="auth-name" name="name" required autoComplete="name" placeholder={t.form.yourName} className="h-11 bg-white" />
          </div>
        ) : null}

        <div className="grid gap-1.5">
          <label htmlFor="auth-email" className="text-sm font-medium">
            {t.pages.authEmail}
          </label>
          <Input
            id="auth-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className="h-11 bg-white"
          />
        </div>

        {isSignUp ? (
          <div className="grid gap-1.5">
            <label htmlFor="auth-phone" className="text-sm font-medium">
              {t.pages.authPhone}
            </label>
            <Input
              id="auth-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(561) 000-0000"
              className="h-11 bg-white"
            />
          </div>
        ) : null}

        <div className="grid gap-1.5">
          <label htmlFor="auth-password" className="text-sm font-medium">
            {t.pages.authPassword}
          </label>
          <Input
            id="auth-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder={isSignUp ? t.pages.newPasswordPlaceholder : t.pages.passwordPlaceholder}
            className="h-11 bg-white"
          />
        </div>

        <Button type="submit" disabled={pending} className="mt-1 h-12 bg-red-flag text-base font-bold text-white hover:bg-red-flag/90">
          {pending ? (isSignUp ? t.pages.creating : t.pages.signingIn) : isSignUp ? t.pages.createAccount : t.signIn}
        </Button>

        {error ? (
          <p className="text-sm text-destructive" role="status">
            {t.pages.signInCancelled}
          </p>
        ) : null}
        {state.message ? (
          <p className={cn("text-sm", state.ok ? "text-emerald-700" : "text-destructive")} role="status">
            {state.message}
          </p>
        ) : null}
      </form>

      <OAuthButtons locale={locale} />

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? (
          <>
            {t.pages.haveAccount}{" "}
            <Link href="/sign-in" className="font-semibold text-navy hover:underline">
              {t.signIn}
            </Link>
          </>
        ) : (
          <>
            {t.pages.needAccount}{" "}
            <Link href="/sign-up" className="font-semibold text-navy hover:underline">
              {t.signUp}
            </Link>
          </>
        )}
      </p>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/crm" className="font-semibold text-navy hover:underline">
          {t.pages.continueGuest}
        </Link>
      </p>
    </div>
  );
}
