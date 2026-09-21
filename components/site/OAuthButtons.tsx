"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Button } from "@/components/ui/button";
import { getUi } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M16.6 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8s-1.6-.7-2.7-.7c-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2 1 .1 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.2s-2.2-.8-2.2-3.4zM14.7 6.6c.6-.7 1-1.7.9-2.6-.8 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.5 1 .1 1.9-.5 2.5-1.2z" />
    </svg>
  );
}

export function OAuthButtons({ locale = "en" }: { locale?: Locale }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"google" | "apple" | null>(null);
  const t = getUi(locale);

  async function startOAuth(provider: "google" | "apple") {
    if (!isSupabaseConfigured()) {
      setError("Member accounts are not connected yet.");
      return;
    }
    setError("");
    setPending(provider);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setPending(null);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="relative my-1 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span className="bg-white px-2">{t.pages.orContinue}</span>
        <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={pending !== null}
        className="h-11 border-border bg-white text-foreground hover:bg-muted"
        onClick={() => startOAuth("google")}
      >
        <GoogleIcon />
        {pending === "google" ? t.pages.connecting : "Google"}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={pending !== null}
        className="h-11 border-border bg-navy text-white hover:bg-navy/90"
        onClick={() => startOAuth("apple")}
      >
        <AppleIcon />
        {pending === "apple" ? t.pages.connecting : "Apple"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
