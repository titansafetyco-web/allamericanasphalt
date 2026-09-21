"use client";

import { FilterTable } from "@/components/crm/FilterTable";
import { customers, money } from "@/lib/crm/data";

export default function CustomersPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-4">
      <p className="text-sm text-muted-foreground">HOAs, commercial properties, municipalities, and homeowners we have on file.</p>
      <FilterTable
        rows={customers}
        placeholder="Search customers"
        searchText={(customer) => `${customer.name} ${customer.contact} ${customer.city} ${customer.type} ${customer.county}`}
        columns={[
          {
            header: "Customer",
            render: (customer) => (
              <div>
                <p className="font-semibold text-navy">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.contact}</p>
              </div>
            ),
          },
          { header: "Type", render: (customer) => customer.type },
          { header: "City", render: (customer) => `${customer.city}, ${customer.county}` },
          { header: "Phone", render: (customer) => customer.phone },
          { header: "Jobs", className: "text-right", render: (customer) => customer.jobs },
          { header: "Lifetime", className: "text-right", render: (customer) => money(customer.lifetimeValue) },
        ]}
      />
    </div>
  );
}
