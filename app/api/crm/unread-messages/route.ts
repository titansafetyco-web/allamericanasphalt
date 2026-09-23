import { listCrmMessages } from "@/lib/crm/messages";
import { listUnreadAlerts } from "@/lib/crm/alerts";

export const dynamic = "force-dynamic";

export async function GET() {
  const unread = listUnreadAlerts(await listCrmMessages());
  return Response.json({ unread });
}
