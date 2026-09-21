import type { Metadata } from "next";
import { CrmShell } from "@/components/crm/CrmShell";

export const metadata: Metadata = {
  title: {
    default: "CRM",
    template: "%s | All American CRM",
  },
  robots: { index: false, follow: false },
};

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <CrmShell>{children}</CrmShell>;
}
