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

export default function CrmOverviewPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
