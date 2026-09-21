"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { signOut } from "@/app/auth-actions";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { getPrimaryNav, getUi } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";

export function MobileMenu({
  memberName,
  locale,
}: {
  memberName?: string | null;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const signedIn = Boolean(memberName);
  const t = getUi(locale);
  const nav = getPrimaryNav(locale);

  useEffect(() => {
    setSlot(document.getElementById("mobile-menu-slot"));
  }, []);

  const panel = open ? (
    <div className="hidden border-t border-white/10 bg-navy-deep px-4 py-4 max-md:block">
      <div className="mx-auto flex max-w-7xl flex-col gap-1">
        <div className="mb-2">
          <LanguageToggle locale={locale} />
        </div>
        {nav.map((item) => (
          <div key={item.label}>
            <a href={item.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-base font-semibold">
              {item.label}
            </a>
            {"children" in item && item.children
              ? item.children.map((child) => (
                  <a
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-6 py-2 text-sm text-white/80"
                  >
                    {child.label}
                  </a>
                ))
              : null}
          </div>
        ))}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {signedIn ? (
            <>
              <a
                href="/account"
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/25 px-3 py-3 text-center font-semibold"
              >
                {t.account}
              </a>
              <form action={signOut}>
                <button type="submit" className="w-full rounded-md bg-white px-3 py-3 text-center font-bold text-navy">
                  {t.signOut}
                </button>
              </form>
            </>
          ) : (
            <>
              <a
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/25 px-3 py-3 text-center font-semibold"
              >
                {t.signIn}
              </a>
              <a
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="rounded-md bg-white px-3 py-3 text-center font-bold text-navy"
              >
                {t.signUp}
              </a>
            </>
          )}
        </div>
        <a
          href="/contact-us"
          onClick={() => setOpen(false)}
          className="mt-2 rounded-md bg-red-flag px-3 py-3 text-center font-bold"
        >
          {t.freeEstimate}
        </a>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        suppressHydrationWarning
        className="hidden size-10 items-center justify-center rounded-lg border border-white/30 bg-transparent text-white hover:bg-white/10 max-md:inline-flex"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <Menu />}
      </button>
      {slot && panel ? createPortal(panel, slot) : null}
    </>
  );
}
