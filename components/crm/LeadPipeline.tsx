import Link from "next/link";
import { leads, money, type LeadStatus } from "@/lib/crm/data";
import { cn } from "@/lib/utils";

const stages = [
  { status: "new" as const, label: "New", color: "#0b2c6b" },
  { status: "contacted" as const, label: "Contacted", color: "#1c5bb8" },
  { status: "quoted" as const, label: "Quoted", color: "#d97706" },
  { status: "won" as const, label: "Won", color: "#059669" },
];

const sourceColors: Record<string, string> = {
  Website: "#0b2c6b",
  Phone: "#1c5bb8",
  Referral: "#d97706",
  Repeat: "#059669",
};

function stageColor(status: LeadStatus) {
  return stages.find((stage) => stage.status === status)?.color ?? "#94a3b8";
}

export function LeadPipeline() {
  const funnel = stages.map((stage) => {
    const items = leads.filter((lead) => lead.status === stage.status);
    return {
      ...stage,
      count: items.length,
      value: items.reduce((sum, lead) => sum + lead.value, 0),
    };
  });
  const maxValue = Math.max(...funnel.map((stage) => stage.value), 1);
  const maxCount = Math.max(...funnel.map((stage) => stage.count), 1);
  const ranked = leads
    .filter((lead) => stages.some((stage) => stage.status === lead.status))
    .slice()
    .sort((a, b) => b.value - a.value);
  const maxDeal = Math.max(...ranked.map((lead) => lead.value), 1);
  const sources = (["Website", "Phone", "Referral", "Repeat"] as const).map((source) => ({
    label: source,
    value: leads.filter((lead) => lead.source === source).length,
    color: sourceColors[source],
  }));
  const sourceTotal = sources.reduce((sum, item) => sum + item.value, 0) || 1;
  const won = funnel.find((stage) => stage.status === "won");
  const totalLeads = leads.length;

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {funnel.map((stage, index) => {
          const last = index === funnel.length - 1;
          return (
            <div
              key={stage.status}
              className={cn(
                "relative flex min-h-[108px] flex-col justify-center rounded-xl px-4 py-3 text-white md:rounded-none",
                index === 0 &&
                  "md:[clip-path:polygon(0_0,calc(100%-16px)_0,100%_50%,calc(100%-16px)_100%,0_100%)]",
                index > 0 &&
                  !last &&
                  "md:pl-6 md:[clip-path:polygon(0_0,calc(100%-16px)_0,100%_50%,calc(100%-16px)_100%,0_100%,16px_50%)]",
                last && "md:pl-6 md:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,16px_50%)]",
              )}
              style={{ backgroundColor: stage.color }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/75">{stage.label}</p>
              <p className="font-heading text-3xl leading-none">{stage.count}</p>
              <p className="mt-1 text-sm font-semibold text-white/90">{money(stage.value)}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${(stage.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Value by stage</p>
          <p className="text-xs text-muted-foreground">
            {won?.count ?? 0} of {totalLeads} won · {money(won?.value ?? 0)} closed
          </p>
        </div>
        <div className="grid gap-2">
          {funnel.map((stage) => (
            <div key={stage.status} className="grid grid-cols-[7rem_1fr_5.5rem] items-center gap-3 max-md:grid-cols-[5.5rem_1fr]">
              <p className="text-sm font-medium text-navy">{stage.label}</p>
              <div className="h-3 overflow-hidden rounded-full bg-[#e8ecf2]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max((stage.value / maxValue) * 100, 6)}%`,
                    backgroundColor: stage.color,
                  }}
                />
              </div>
              <p className="text-right text-sm font-semibold text-navy max-md:hidden">{money(stage.value)}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deals by value</p>
        <div className="grid gap-2.5">
          {ranked.map((lead) => (
            <Link key={lead.id} href="/crm/leads" className="grid gap-1 rounded-lg px-1 py-0.5 hover:bg-muted/50">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-semibold text-navy">{lead.company}</p>
                <p className="shrink-0 text-sm font-bold">{money(lead.value)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#e8ecf2]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max((lead.value / maxDeal) * 100, 6)}%`,
                      backgroundColor: stageColor(lead.status),
                    }}
                  />
                </div>
                <p className="w-20 shrink-0 text-right text-[11px] capitalize text-muted-foreground">{lead.status}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lead source</p>
        <div className="flex h-3 overflow-hidden rounded-full">
          {sources.map((source) => (
            <div
              key={source.label}
              className={cn("h-full")}
              style={{ width: `${(source.value / sourceTotal) * 100}%`, backgroundColor: source.color }}
              title={`${source.label}: ${source.value}`}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {sources.map((source) => (
            <p key={source.label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: source.color }} />
              {source.label} {source.value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
