"use client";

import { FilterTable } from "@/components/crm/FilterTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { formatDate, jobs, money } from "@/lib/crm/data";

export default function JobsPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-4">
      <p className="text-sm text-muted-foreground">Work that has been awarded and assigned to a crew.</p>
      <FilterTable
        rows={jobs}
        placeholder="Search jobs"
        searchText={(job) => `${job.name} ${job.customer} ${job.city} ${job.service} ${job.status} ${job.crew}`}
        columns={[
          {
            header: "Job",
            render: (job) => (
              <div>
                <p className="font-semibold text-navy">{job.name}</p>
                <p className="text-xs text-muted-foreground">{job.customer}</p>
              </div>
            ),
          },
          { header: "Service", render: (job) => job.service },
          { header: "City", render: (job) => job.city },
          { header: "Crew", render: (job) => job.crew },
          { header: "Start", render: (job) => formatDate(job.startDate) },
          { header: "Amount", className: "text-right", render: (job) => money(job.amount) },
          { header: "Status", render: (job) => <StatusBadge status={job.status} /> },
        ]}
      />
    </div>
  );
}
