import { CrmSettingsForm } from "@/components/crm/CrmSettingsForm";
import { getAuthUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getAuthUser();
  const accountName =
    String(user?.user_metadata.full_name ?? user?.user_metadata.name ?? "").trim() || "Guest";
  const accountEmail = user?.email ?? "";

  return (
    <CrmSettingsForm accountName={accountName} accountEmail={accountEmail} signedIn={Boolean(user)} />
  );
}
