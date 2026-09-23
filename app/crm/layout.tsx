import type { Metadata } from "next";
import { CrmSettingsProvider } from "@/components/crm/CrmSettingsProvider";
import { CrmShell } from "@/components/crm/CrmShell";
import { listUnreadAlerts } from "@/lib/crm/alerts";
import { listCrmMessages } from "@/lib/crm/messages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "CRM",
    template: "%s | All American CRM",
  },
  robots: { index: false, follow: false },
};

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const unreadMessages = listUnreadAlerts(await listCrmMessages());
  return (
    <CrmSettingsProvider>
      <CrmShell unreadMessages={unreadMessages}>{children}</CrmShell>
    </CrmSettingsProvider>
  );
}
