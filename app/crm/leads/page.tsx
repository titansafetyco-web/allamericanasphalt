"use client";

import { FilterTable } from "@/components/crm/FilterTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { formatDate, leads, money } from "@/lib/crm/data";

export default function LeadsPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-4">
      <p className="text-sm text-muted-foreground">
        Incoming estimate requests and follow-ups. Sample data until the website form writes into this pipeline.
      </p>
      <FilterTable
        rows={leads}
        placeholder="Search leads"
        searchText={(lead) => `${lead.name} ${lead.company} ${lead.city} ${lead.service} ${lead.status}`}
        columns={[
          {
            header: "Lead",
            render: (lead) => (
              <div>
                <p className="font-semibold text-navy">{lead.company}</p>
                <p className="text-xs text-muted-foreground">{lead.name}</p>
              </div>
            ),
          },
          { header: "Service", render: (lead) => lead.service },
          { header: "City", render: (lead) => `${lead.city}, ${lead.county}` },
          { header: "Source", render: (lead) => lead.source },
          { header: "Value", className: "text-right", render: (lead) => money(lead.value) },
          { header: "Status", render: (lead) => <StatusBadge status={lead.status} /> },
          { header: "Opened", render: (lead) => formatDate(lead.createdAt) },
        ]}
      />
    </div>
  );
}
