import { MessageInbox } from "@/components/crm/MessageInbox";
import { listCrmMessages } from "@/lib/crm/messages";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; id?: string }>;
}) {
  const [{ filter, id }, messages] = await Promise.all([searchParams, listCrmMessages()]);
  return (
    <div className="mx-auto max-w-7xl">
      <MessageInbox messages={messages} initialFilter={filter} initialId={id} />
    </div>
  );
}
