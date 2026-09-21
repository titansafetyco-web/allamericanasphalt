"use client";

import { FilterTable } from "@/components/crm/FilterTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { useCrmSettings } from "@/components/crm/CrmSettingsProvider";
import { estimates, formatDate, money } from "@/lib/crm/data";

export default function EstimatesPage() {
  const { settings } = useCrmSettings();

  return (
    <div className="mx-auto grid max-w-7xl gap-4">
      <p className="text-sm text-muted-foreground">
        Quotes sent from the office. Prefix {settings.invoicePrefix}, valid {settings.estimateValidDays} days, tax{" "}
        {settings.taxRate}%. {settings.paymentTerms}.
      </p>
      <FilterTable
        rows={estimates}
        placeholder="Search estimates"
        searchText={(estimate) => `${estimate.number} ${estimate.customer} ${estimate.city} ${estimate.service} ${estimate.status}`}
        columns={[
          { header: "Estimate", render: (estimate) => <span className="font-semibold text-navy">{estimate.number}</span> },
          { header: "Customer", render: (estimate) => estimate.customer },
          { header: "Service", render: (estimate) => estimate.service },
          { header: "City", render: (estimate) => estimate.city },
          { header: "Amount", className: "text-right", render: (estimate) => money(estimate.amount) },
          { header: "Status", render: (estimate) => <StatusBadge status={estimate.status} /> },
          {
            header: "Valid until",
            render: (estimate) => formatDate(estimate.validUntil),
          },
        ]}
      />
    </div>
  );
}
