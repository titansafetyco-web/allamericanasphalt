import { InvoicesBoard } from "@/components/crm/InvoicesBoard";
import { listCrmMessages } from "@/lib/crm/messages";
import { listQuotes } from "@/lib/crm/pipeline";

export const dynamic = "force-dynamic";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ tab }, messages, quotes] = await Promise.all([searchParams, listCrmMessages(), listQuotes()]);
  const estimateQueue = messages.filter((message) => message.status === "accepted");

  return <InvoicesBoard initialTab={tab} quotes={quotes} estimateQueue={estimateQueue} />;
}
