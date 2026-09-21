"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, Phone, Shield, X } from "lucide-react";
import { company } from "@/content/company";
import { primaryNav } from "@/content/nav";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth-actions";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ memberName }: { memberName?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const signedIn = Boolean(memberName);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy-light text-white shadow-lg">
      <div className="border-b border-white/15 bg-navy-deep max-md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5">
            <Shield className="size-4 text-red-flag" aria-hidden />
            <p className="text-sm font-semibold text-white">
              Licensed in Broward, Palm Beach & Martin Counties
            </p>
          </div>
          <div className="flex items-center">
            {(
              [
                company.phones.fortLauderdale,
                company.phones.westPalmBeach,
                company.phones.stuart,
              ] as const
            ).map((phone, i) => (
              <a
                key={phone.label}
                href={phone.href}
                className={cn(
                  "group flex items-center gap-2.5 px-4 py-1 transition-colors hover:text-white",
                  i > 0 && "border-l border-white/20",
                )}
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-red-flag text-white transition-transform duration-200 group-hover:scale-110">
                  <Phone className="size-3.5" aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 group-hover:text-white/80">
                    {phone.label}
                  </span>
                  <span className="block text-base font-bold text-white group-hover:text-red-flag">
                    {phone.display}
                  </span>
                </span>
              </a>
            ))}
            <div className="ml-2 flex items-center gap-1.5 border-l border-white/20 pl-4">
              {signedIn ? (
                <>
                  <Link
                    href="/account"
                    className="max-w-40 truncate rounded-md px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white hover:text-navy"
                  >
                    {memberName}
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="rounded-md bg-red-flag px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-flag/90"
                    >
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="rounded-md px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white hover:text-navy"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="rounded-md bg-red-flag px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-flag/90"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="All American Asphalt, LLC — From Start to Finish"
            width={2000}
            height={760}
            className="h-32 w-auto"
            quality={100}
            unoptimized
            priority
          />
        </Link>

        <nav className="flex items-center gap-0.5 max-md:hidden">
          {primaryNav.map((item) =>
            "children" in item && item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "relative inline-flex items-center gap-1 px-5 py-3 text-lg font-semibold tracking-wide text-white/90 transition-colors duration-200 hover:text-white",
                    "after:absolute after:bottom-1 after:left-5 after:right-5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 hover:after:scale-x-100",
                    item.children.some((c) => isActive(pathname, c.href)) && "text-white after:scale-x-100 after:bg-red-flag",
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-5 transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 rounded-lg bg-white p-1.5 text-navy opacity-0 shadow-lg ring-1 ring-black/10 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-3 py-2.5 text-base font-medium transition-colors duration-150 hover:bg-navy hover:text-white"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-5 py-3 text-lg font-semibold tracking-wide text-white/90 transition-colors duration-200 hover:text-white",
                  "after:absolute after:bottom-1 after:left-5 after:right-5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 hover:after:scale-x-100",
                  isActive(pathname, item.href) && "text-white after:scale-x-100 after:bg-red-flag",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="inline-flex h-10 bg-red-flag px-4 text-white hover:bg-red-flag/90 max-md:hidden">
            <a href={company.phones.westPalmBeach.href}>
              <Phone className="size-4" />
              {company.phones.westPalmBeach.display}
            </a>
          </Button>
          <Button asChild className="inline-flex h-10 bg-white px-4 text-navy hover:bg-white/90 max-md:hidden">
            <Link href="/contact-us">Free Estimate</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden border-white/30 bg-transparent text-white hover:bg-white/10 max-md:inline-flex"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="hidden border-t border-white/10 bg-navy-deep px-4 py-4 max-md:block">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {primaryNav.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-semibold"
                >
                  {item.label}
                </Link>
                {"children" in item && item.children
                  ? item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-6 py-2 text-sm text-white/80"
                      >
                        {child.label}
                      </Link>
                    ))
                  : null}
              </div>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {signedIn ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-white/25 px-3 py-3 text-center font-semibold"
                  >
                    Account
                  </Link>
                  <form action={signOut}>
                    <button type="submit" className="w-full rounded-md bg-white px-3 py-3 text-center font-bold text-navy">
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-white/25 px-3 py-3 text-center font-semibold"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-white px-3 py-3 text-center font-bold text-navy"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <Link
              href="/contact-us"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-red-flag px-3 py-3 text-center font-bold"
            >
              Free Estimate
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
