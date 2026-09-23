import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SupportWidget } from "@/components/site/SupportWidget";
import { getLocale, getPathname } from "@/lib/i18n/server";
import { getAuthUser } from "@/lib/supabase/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [user, locale, pathname] = await Promise.all([getAuthUser(), getLocale(), getPathname()]);
  const signedInName =
    (typeof user?.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    (typeof user?.user_metadata?.name === "string" && user.user_metadata.name) ||
    user?.email ||
    null;
  const displayName =
    signedInName ||
    (process.env.NODE_ENV === "development" && pathname === "/account" ? "Alex Rivera" : null);

  return (
    <>
      <Header memberName={displayName} locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer />
      <SupportWidget locale={locale} />
    </>
  );
}
