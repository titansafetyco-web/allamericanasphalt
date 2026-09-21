import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getAuthUser } from "@/lib/supabase/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  const displayName =
    (typeof user?.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    (typeof user?.user_metadata?.name === "string" && user.user_metadata.name) ||
    user?.email ||
    null;

  return (
    <>
      <Header memberName={displayName} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
