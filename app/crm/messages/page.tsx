import { MessageInbox } from "@/components/crm/MessageInbox";
import { listCrmMessages } from "@/lib/crm/messages";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await listCrmMessages();
  return (
    <div className="mx-auto max-w-7xl">
      <MessageInbox messages={messages} />
    </div>
  );
}
