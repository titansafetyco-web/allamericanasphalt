"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitAuth, type FormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [state, action, pending] = useActionState(submitAuth, initial);
  const isSignUp = mode === "signup";

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="mode" value={mode} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {isSignUp ? (
        <div className="grid gap-1.5">
          <label htmlFor="auth-name" className="text-sm font-medium">
            Name
          </label>
          <Input id="auth-name" name="name" required autoComplete="name" placeholder="Your name" className="h-11 bg-white" />
        </div>
      ) : null}

      <div className="grid gap-1.5">
        <label htmlFor="auth-email" className="text-sm font-medium">
          Email
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
            Phone
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
          Password
        </label>
        <Input
          id="auth-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          placeholder={isSignUp ? "At least 8 characters" : "Your password"}
          className="h-11 bg-white"
        />
      </div>

      <Button type="submit" disabled={pending} className="mt-1 h-12 bg-red-flag text-base font-bold text-white hover:bg-red-flag/90">
        {pending ? (isSignUp ? "Creating account…" : "Signing in…") : isSignUp ? "Create account" : "Sign in"}
      </Button>

      {state.message ? (
        <p className={cn("text-sm", state.ok ? "text-emerald-700" : "text-destructive")} role="status">
          {state.message}
        </p>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-navy hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Need an account?{" "}
            <Link href="/sign-up" className="font-semibold text-navy hover:underline">
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
