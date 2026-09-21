import Link from "next/link";
import { FileText, HardHat, UserPlus, Wallet } from "lucide-react";
import { ColumnChart, DonutChart, KpiCard, ValueBars } from "@/components/crm/KpiCard";
import { LeadPipeline } from "@/components/crm/LeadPipeline";
import { WeekBoard } from "@/components/crm/WeekBoard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  activeJobs,
  estimates,
  estimatesOut,
  jobs,
  leads,
  money,
  openLeads,
  pipelineValue,
} from "@/lib/crm/data";
import { listCrmMessages } from "@/lib/crm/messages";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const leadMix = [
  { label: "New", value: leads.filter((lead) => lead.status === "new").length, color: "#0b2c6b" },
  { label: "Contacted", value: leads.filter((lead) => lead.status === "contacted").length, color: "#1c5bb8" },
  { label: "Quoted", value: leads.filter((lead) => lead.status === "quoted").length, color: "#d97706" },
];

const estimateMix = [
  { label: "Draft", value: estimates.filter((estimate) => estimate.status === "draft").length, color: "#94a3b8" },
  { label: "Sent", value: estimates.filter((estimate) => estimate.status === "sent").length, color: "#0b2c6b" },
  { label: "Approved", value: estimates.filter((estimate) => estimate.status === "approved").length, color: "#059669" },
  { label: "Declined", value: estimates.filter((estimate) => estimate.status === "declined").length, color: "#c8102e" },
];

const jobMix = [
  { label: "Scheduled", value: jobs.filter((job) => job.status === "scheduled").length, color: "#0b2c6b" },
  { label: "In progress", value: jobs.filter((job) => job.status === "in_progress").length, color: "#d97706" },
  { label: "Complete", value: jobs.filter((job) => job.status === "complete").length, color: "#059669" },
  { label: "On hold", value: jobs.filter((job) => job.status === "on_hold").length, color: "#c8102e" },
];

const pipelineMix = [
  {
    label: "New",
    value: leads.filter((lead) => lead.status === "new").reduce((sum, lead) => sum + lead.value, 0),
    color: "#0b2c6b",
  },
  {
    label: "Contacted",
    value: leads.filter((lead) => lead.status === "contacted").reduce((sum, lead) => sum + lead.value, 0),
    color: "#1c5bb8",
  },
  {
    label: "Quoted",
    value: leads.filter((lead) => lead.status === "quoted").reduce((sum, lead) => sum + lead.value, 0),
    color: "#d97706",
  },
];

const conversationFilters = [
  { id: "all", label: "All", href: "/crm/messages" },
  { id: "estimate", label: "Estimates", href: "/crm/messages?filter=estimate" },
  { id: "contact", label: "Inbox", href: "/crm/messages?filter=contact" },
  { id: "support", label: "Support", href: "/crm/messages?filter=support" },
] as const;

export default async function CrmOverviewPage() {
  const messages = await listCrmMessages();
  const supportCount = messages.filter((message) => message.kind === "support").length;
  const unreadSupport = messages.filter((message) => message.kind === "support" && !message.read).length;

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <section className="rounded-xl bg-white p-3 ring-1 ring-foreground/10 md:p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Website conversations</p>
            <p className="mt-1 text-sm text-navy">
              {supportCount} customer service {supportCount === 1 ? "conversation" : "conversations"}
              {unreadSupport ? ` · ${unreadSupport} unread` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 rounded-lg bg-[#eef1f6] p-1" role="navigation" aria-label="Conversation filters">
            {conversationFilters.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-semibold text-navy/75 hover:bg-white hover:text-navy",
                  item.id === "support" && "bg-navy text-white hover:bg-navy hover:text-white",
                )}
              >
                {item.label}
                {item.id === "support" ? (
                  <span className="ml-2 rounded-full bg-white/20 px-1.5 text-[11px]">{supportCount}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2 md:gap-4 xl:grid-cols-4">
        <KpiCard
          label="Open leads"
          value={String(openLeads)}
          hint="New, contacted, or quoted"
          icon={UserPlus}
          iconClass="bg-navy/10 text-navy"
          legend={leadMix}
        >
          <DonutChart segments={leadMix} />
        </KpiCard>
        <KpiCard
          label="Estimates out"
          value={String(estimatesOut)}
          hint="Waiting on customer approval"
          icon={FileText}
          iconClass="bg-sky-100 text-sky-800"
          legend={estimateMix}
        >
          <ColumnChart segments={estimateMix} />
        </KpiCard>
        <KpiCard
          label="Active jobs"
          value={String(activeJobs)}
          hint="Scheduled or in progress"
          icon={HardHat}
          iconClass="bg-amber-100 text-amber-800"
          legend={jobMix}
        >
          <DonutChart segments={jobMix} />
        </KpiCard>
        <KpiCard
          label="Pipeline"
          value={money(pipelineValue)}
          hint="Open lead value this month"
          icon={Wallet}
          iconClass="bg-emerald-100 text-emerald-800"
          legend={pipelineMix.map((item) => ({ ...item, display: money(item.value) }))}
        >
          <ValueBars segments={pipelineMix} />
        </KpiCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="bg-white">
          <CardHeader className="border-b">
            <CardTitle>Lead pipeline</CardTitle>
            <CardDescription>Website, phone, and repeat work moving toward a job.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <LeadPipeline />
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="border-b">
            <CardTitle>This week</CardTitle>
            <CardDescription>Crews on the calendar.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <WeekBoard />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
