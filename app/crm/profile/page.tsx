import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { getAuthUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getAuthUser();
  const name =
    String(user?.user_metadata.full_name ?? user?.user_metadata.name ?? "").trim() || "Guest";
  const email = user?.email ?? "";

  return (
    <div className="mx-auto grid max-w-xl gap-4">
      <p className="text-sm text-muted-foreground">
        Account settings for this CRM session. Log off returns you to the public website.
      </p>
      <div className="rounded-xl bg-white p-6 ring-1 ring-foreground/10">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-red-flag">Signed in as</p>
        <h2 className="mt-1 font-heading text-2xl text-navy">{name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{email || "Guest session — no member account"}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <form action={signOut}>
            <Button type="submit" variant="destructive" className="h-10 px-4">
              <LogOut className="size-4" aria-hidden />
              Log off
            </Button>
          </form>
          {user ? (
            <Button asChild variant="outline" className="h-10 px-4">
              <Link href="/account">Member account</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="h-10 px-4">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
