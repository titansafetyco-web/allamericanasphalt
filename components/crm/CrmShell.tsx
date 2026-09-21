"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, LogOut, Menu, X } from "lucide-react";
import { signOut } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { crmNav } from "@/lib/crm/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/crm") return pathname === "/crm";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CrmShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = crmNav.find((item) => isActive(pathname, item.href))?.label ?? "CRM";

  return (
    <div className="flex h-dvh overflow-hidden bg-[#eef1f6]">
      <aside
        className={cn(
          "z-40 flex h-full w-64 shrink-0 flex-col overflow-y-auto bg-navy-deep text-white shadow-xl transition-transform max-md:fixed max-md:inset-y-0 max-md:left-0",
          open ? "translate-x-0" : "max-md:-translate-x-full",
        )}
      >
        <div className="relative shrink-0 border-b border-white/10 px-4 py-5">
          <Link href="/crm" className="flex flex-col items-start gap-1 pr-10 md:pr-0" onClick={() => setOpen(false)}>
            <Image
              src="/logo.png"
              alt="All American Asphalt"
              width={2000}
              height={760}
              className="h-20 w-auto max-w-full"
              unoptimized
            />
            <span className="font-heading text-sm tracking-[0.18em] text-white/80">CRM/ INVOICE</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-white hover:bg-white/10 md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto p-3">
          {crmNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                  active ? "bg-white text-navy" : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 grid gap-1 border-t border-white/10 pt-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to website
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" aria-hidden />
                Log off
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white/95 px-4 py-3 backdrop-blur md:px-6">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </Button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-flag">All American Asphalt</p>
            <h1 className="font-heading text-xl text-navy md:text-2xl">{current}</h1>
          </div>
        </header>
        <div className="flex-1 px-4 py-6 md:px-6">{children}</div>
      </div>
    </div>
  );
}
