import Image from "next/image";
import { ChevronDown, Phone, Shield } from "lucide-react";
import { company } from "@/content/company";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { MobileMenu } from "@/components/site/MobileMenu";
import { getPrimaryNav, getUi } from "@/lib/i18n/messages";
import { getPathname } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/locale";
import { signOut } from "@/app/auth-actions";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export async function Header({ memberName, locale }: { memberName?: string | null; locale: Locale }) {
  const pathname = await getPathname();
  const signedIn = Boolean(memberName);
  const t = getUi(locale);
  const nav = getPrimaryNav(locale);

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 self-start border-b border-white/10 bg-navy-light text-white shadow-lg">
      <div className="border-b border-white/15 bg-navy-deep max-md:hidden">
        <div className="flex w-full flex-nowrap items-center justify-between gap-3 px-4 py-2">
          <div className="inline-flex min-w-0 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
            <Shield className="size-4 shrink-0 text-red-flag" aria-hidden />
            <p className="truncate whitespace-nowrap text-sm font-semibold text-white">{t.licensedBar}</p>
          </div>
          <div className="flex shrink-0 flex-nowrap items-center justify-end">
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
                  "group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap px-2.5 py-1 transition-colors hover:text-white",
                  i > 0 && "border-l border-white/20",
                )}
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-red-flag text-white transition-transform duration-200 group-hover:scale-110">
                  <Phone className="size-3" aria-hidden />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60 group-hover:text-white/80">
                  {phone.label}
                </span>
                <span className="text-sm font-bold text-white group-hover:text-red-flag">{phone.display}</span>
              </a>
            ))}
            <div className="ml-2 flex shrink-0 flex-nowrap items-center gap-1.5 border-l border-white/20 pl-4">
              <LanguageToggle locale={locale} />
              {signedIn ? (
                <>
                  <a
                    href="/account"
                    className="max-w-40 truncate whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white hover:text-navy"
                  >
                    {memberName}
                  </a>
                  <form action={signOut} className="shrink-0">
                    <button
                      type="submit"
                      className="whitespace-nowrap rounded-md bg-red-flag px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-flag/90"
                    >
                      {t.signOut}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <a
                    href="/sign-in"
                    className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white hover:text-navy"
                  >
                    {t.signIn}
                  </a>
                  <a
                    href="/sign-up"
                    className="whitespace-nowrap rounded-md bg-red-flag px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-flag/90"
                  >
                    {t.signUp}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-4 px-4 py-3">
        <a href="/" className="shrink-0">
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
        </a>

        <nav className="flex items-center gap-0.5 max-md:hidden">
          {nav.map((item) =>
            "children" in item && item.children ? (
              <div key={item.label} className="group relative">
                <a
                  href={item.href}
                  className={cn(
                    "relative inline-flex items-center gap-1 px-5 py-3 text-lg font-semibold tracking-wide text-white/90 transition-colors duration-200 hover:text-white",
                    "after:absolute after:bottom-1 after:left-5 after:right-5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 hover:after:scale-x-100",
                    item.children.some((c) => isActive(pathname, c.href)) && "text-white after:scale-x-100 after:bg-red-flag",
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-5 transition-transform duration-200 group-hover:rotate-180" />
                </a>
                <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 rounded-lg bg-white p-1.5 text-navy opacity-0 shadow-lg ring-1 ring-black/10 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-3 py-2.5 text-base font-medium transition-colors duration-150 hover:bg-navy hover:text-white"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-5 py-3 text-lg font-semibold tracking-wide text-white/90 transition-colors duration-200 hover:text-white",
                  "after:absolute after:bottom-1 after:left-5 after:right-5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 hover:after:scale-x-100",
                  isActive(pathname, item.href) && "text-white after:scale-x-100 after:bg-red-flag",
                )}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle locale={locale} className="md:hidden" />
          <a
            href={company.phones.westPalmBeach.href}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-flag px-4 text-sm font-medium text-white hover:bg-red-flag/90 max-md:hidden"
          >
            <Phone className="size-4" />
            {company.phones.westPalmBeach.display}
          </a>
          <a
            href="/contact-us"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-navy hover:bg-white/90 max-md:hidden"
          >
            {t.freeEstimate}
          </a>
          <MobileMenu memberName={memberName} locale={locale} />
        </div>
      </div>
      <div id="mobile-menu-slot" />
    </header>
  );
}
