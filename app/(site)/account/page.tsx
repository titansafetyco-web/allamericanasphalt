import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountForm } from "@/components/site/AccountForm";
import { signOut } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { createClient, getAuthUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My account" };

const previewMember = {
  email: "alex.rivera@gmail.com",
  fullName: "Alex Rivera",
  phone: "(561) 555-0142",
  avatarUrl: null as string | null,
};

function AccountScreen({
  email,
  fullName,
  phone,
  avatarUrl,
}: {
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
}) {
  return (
    <section className="bg-navy-deep px-4 py-16 text-white md:py-20">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-foreground shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-flag">Member</p>
            <h1 className="mt-2 font-heading text-3xl text-navy">Your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Update your profile with All American Asphalt.
            </p>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline" className="h-10">
              Sign out
            </Button>
          </form>
        </div>
        <AccountForm email={email} fullName={fullName} phone={phone} avatarUrl={avatarUrl} />
      </div>
    </section>
  );
}

export default async function AccountPage() {
  const user = await getAuthUser();
  if (!user) {
    if (process.env.NODE_ENV !== "development") redirect("/sign-in");
    return <AccountScreen {...previewMember} />;
  }

  const supabase = await createClient();
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("full_name, phone, avatar_path, email")
    .eq("id", user.id)
    .maybeSingle();
  const membersReady = memberError?.code !== "PGRST205";

  const fullName =
    member?.full_name ||
    String(user.user_metadata.full_name ?? user.user_metadata.name ?? "");
  const phone = member?.phone || String(user.user_metadata.phone ?? "");
  const email = member?.email || user.email || "";
  const googleAvatar = String(user.user_metadata.avatar_url ?? user.user_metadata.picture ?? "") || null;

  if (membersReady && !member) {
    await supabase.from("members").upsert({
      id: user.id,
      email,
      full_name: fullName,
      phone,
      updated_at: new Date().toISOString(),
    });
  }

  let avatarUrl: string | null = googleAvatar;
  if (membersReady && member?.avatar_path) {
    const signed = await supabase.storage.from("members").createSignedUrl(member.avatar_path, 60 * 60 * 24);
    avatarUrl = signed.data?.signedUrl ?? googleAvatar;
  }

  return <AccountScreen email={email} fullName={fullName} phone={phone} avatarUrl={avatarUrl} />;
}
