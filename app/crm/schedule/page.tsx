import { StatusBadge } from "@/components/crm/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, schedule } from "@/lib/crm/data";

export default function SchedulePage() {
  return (
    <div className="mx-auto grid max-w-4xl gap-4">
      <p className="text-sm text-muted-foreground">Upcoming crew days. We can turn this into a week view once jobs are live.</p>
      <div className="grid gap-3">
        {schedule.map((item) => (
          <Card key={item.id} className="bg-white">
            <CardContent className="flex flex-wrap items-start justify-between gap-4 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{formatDate(item.date)}</p>
                <h2 className="mt-1 font-heading text-xl text-navy">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.city} · {item.crew} · {item.window}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
