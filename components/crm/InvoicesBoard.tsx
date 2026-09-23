"use client";

import { useMemo, useState } from "react";
import { FilterTable } from "@/components/crm/FilterTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { useCrmSettings } from "@/components/crm/CrmSettingsProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteController } from "@/components/crm/QuoteController";
import { formatDate, invoices, money, type Estimate, type Invoice } from "@/lib/crm/data";
import type { CrmMessage } from "@/lib/crm/messages";
import { cn } from "@/lib/utils";

type TabId = "invoices" | "quotes" | "estimates";
type Detail =
  | { type: "invoice"; row: Invoice }
  | { type: "quote"; row: Estimate }
  | { type: "request"; row: CrmMessage };

const tabs: { id: TabId; label: string }[] = [
  { id: "invoices", label: "Invoices" },
  { id: "quotes", label: "Quotes" },
  { id: "estimates", label: "Estimates" },
];

function isTabId(value: string | undefined): value is TabId {
  return value === "invoices" || value === "quotes" || value === "estimates";
}

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-navy">{children}</dd>
    </div>
  );
}

function OpenLink({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-semibold text-navy underline-offset-2 hover:underline"
    >
      {label}
    </button>
  );
}

export function InvoicesBoard({
  initialTab,
  quotes,
  estimateQueue,
}: {
  initialTab?: string;
  quotes: Estimate[];
  estimateQueue: CrmMessage[];
}) {
  const { settings } = useCrmSettings();
  const [tab, setTab] = useState<TabId>(isTabId(initialTab) ? initialTab : "invoices");
  const [detail, setDetail] = useState<Detail | null>(null);

  const counts = useMemo(
    () => ({
      invoices: invoices.length,
      quotes: quotes.length,
      estimates: estimateQueue.length,
    }),
    [estimateQueue.length, quotes.length],
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-4">
      <div className="flex flex-wrap gap-1 rounded-lg bg-white p-1 ring-1 ring-foreground/10" role="tablist" aria-label="Invoice filters">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
                active ? "bg-navy text-white" : "text-navy/75 hover:bg-muted",
              )}
            >
              {item.label}
              <span className={cn("rounded-full px-1.5 text-[11px]", active ? "bg-white/20" : "bg-[#eef1f6] text-navy")}>
                {counts[item.id]}
              </span>
            </button>
          );
        })}
      </div>

      {tab === "invoices" ? (
        <>
          <p className="text-sm text-muted-foreground">
            Billed work. Prefix {settings.invoicePrefix}. {settings.paymentTerms}.
          </p>
          <FilterTable
            rows={invoices}
            placeholder="Search invoices"
            empty="No invoices yet."
            searchText={(invoice) => `${invoice.number} ${invoice.customer} ${invoice.city} ${invoice.service} ${invoice.status}`}
            columns={[
              {
                header: "Invoice",
                render: (invoice) => (
                  <OpenLink label={invoice.number} onClick={() => setDetail({ type: "invoice", row: invoice })} />
                ),
              },
              { header: "Customer", render: (invoice) => invoice.customer },
              { header: "Service", render: (invoice) => invoice.service },
              { header: "City", render: (invoice) => invoice.city },
              { header: "Amount", className: "text-right", render: (invoice) => money(invoice.amount) },
              { header: "Status", render: (invoice) => <StatusBadge status={invoice.status} /> },
              { header: "Due", render: (invoice) => formatDate(invoice.dueAt) },
            ]}
          />
        </>
      ) : null}

      {tab === "quotes" ? (
        <>
          <p className="text-sm text-muted-foreground">
            Open a quote to price the job. Approve sends it into the dashboard pipeline. Prefix {settings.invoicePrefix},
            valid {settings.estimateValidDays} days, tax {settings.taxRate}%. {settings.paymentTerms}.
          </p>
          <FilterTable
            rows={quotes}
            placeholder="Search quotes"
            empty="No quotes yet."
            searchText={(estimate) => `${estimate.number} ${estimate.customer} ${estimate.city} ${estimate.service} ${estimate.status}`}
            columns={[
              {
                header: "Quote",
                render: (estimate) => (
                  <OpenLink label={estimate.number} onClick={() => setDetail({ type: "quote", row: estimate })} />
                ),
              },
              { header: "Customer", render: (estimate) => estimate.customer },
              { header: "Service", render: (estimate) => estimate.service },
              { header: "City", render: (estimate) => estimate.city },
              { header: "Amount", className: "text-right", render: (estimate) => money(estimate.amount) },
              { header: "Status", render: (estimate) => <StatusBadge status={estimate.status} /> },
              { header: "Valid until", render: (estimate) => formatDate(estimate.validUntil) },
            ]}
          />
        </>
      ) : null}

      {tab === "estimates" ? (
        <>
          <p className="text-sm text-muted-foreground">Accepted website requests waiting on a quote.</p>
          <FilterTable
            rows={estimateQueue}
            placeholder="Search estimate queue"
            empty="Accepted estimate requests will land here."
            searchText={(message) =>
              `${message.name} ${message.phone} ${message.email} ${message.service} ${message.city} ${message.body}`
            }
            columns={[
              {
                header: "Customer",
                render: (message) => (
                  <OpenLink label={message.name} onClick={() => setDetail({ type: "request", row: message })} />
                ),
              },
              { header: "Phone", render: (message) => message.phone || "—" },
              { header: "Email", render: (message) => message.email || "—" },
              { header: "Service", render: (message) => message.service || "—" },
              { header: "City", render: (message) => message.city || "—" },
              { header: "Received", render: (message) => formatDate(message.createdAt) },
              {
                header: "Message",
                render: (message) => <span className="line-clamp-2 max-w-xs text-muted-foreground">{message.body || "—"}</span>,
              },
            ]}
          />
        </>
      ) : null}

      <RecordDetailDialog
        detail={detail}
        quotes={quotes}
        taxRate={settings.taxRate}
        paymentTerms={settings.paymentTerms}
        onClose={() => setDetail(null)}
      />
    </div>
  );
}

function RecordDetailDialog({
  detail,
  quotes,
  taxRate,
  paymentTerms,
  onClose,
}: {
  detail: Detail | null;
  quotes: Estimate[];
  taxRate: number;
  paymentTerms: string;
  onClose: () => void;
}) {
  const liveQuote =
    detail?.type === "quote" ? (quotes.find((quote) => quote.id === detail.row.id) ?? detail.row) : null;
  const title =
    detail?.type === "invoice" ? detail.row.number : detail?.type === "quote" ? detail.row.number : detail?.row.name;
  const description =
    detail?.type === "invoice"
      ? "Invoice details"
      : detail?.type === "quote"
        ? "Build the job estimate. Approve it to send this work into the dashboard pipeline."
        : "Estimate request details";
  const tax = detail?.type === "invoice" ? Math.round(detail.row.amount * (taxRate / 100)) : 0;
  const total = detail?.type === "invoice" ? detail.row.amount + tax : 0;

  return (
    <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "max-h-[min(90vh,840px)] max-w-[calc(100%-2rem)] gap-5 overflow-y-auto p-6",
          detail?.type === "quote" ? "sm:max-w-2xl" : "sm:max-w-lg",
        )}
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-navy">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {detail?.type === "quote" && liveQuote ? (
          <QuoteController key={liveQuote.id} quote={liveQuote} taxRate={taxRate} paymentTerms={paymentTerms} />
        ) : null}
        {detail?.type === "invoice" ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            <DetailField label="Status">
              <StatusBadge status={detail.row.status} />
            </DetailField>
            <DetailField label="Customer">{detail.row.customer}</DetailField>
            <DetailField label="Service">{detail.row.service}</DetailField>
            <DetailField label="City">{detail.row.city}</DetailField>
            <DetailField label="Amount">{money(detail.row.amount)}</DetailField>
            <DetailField label={`Tax (${taxRate}%)`}>{money(tax)}</DetailField>
            <DetailField label="Total">{money(total)}</DetailField>
            <DetailField label="Issued">{formatDate(detail.row.issuedAt)}</DetailField>
            <DetailField label="Due">{formatDate(detail.row.dueAt)}</DetailField>
            <DetailField label="Terms">{paymentTerms}</DetailField>
          </dl>
        ) : null}
        {detail?.type === "request" ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            <DetailField label="Phone">
              {detail.row.phone ? (
                <a className="hover:underline" href={`tel:${detail.row.phone.replace(/\D/g, "")}`}>
                  {detail.row.phone}
                </a>
              ) : (
                "—"
              )}
            </DetailField>
            <DetailField label="Email">
              {detail.row.email ? (
                <a className="hover:underline" href={`mailto:${detail.row.email}`}>
                  {detail.row.email}
                </a>
              ) : (
                "—"
              )}
            </DetailField>
            <DetailField label="Service">{detail.row.service || "—"}</DetailField>
            <DetailField label="City">{detail.row.city || "—"}</DetailField>
            <DetailField label="Received">{formatDate(detail.row.createdAt)}</DetailField>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</dt>
              <dd className="mt-1 whitespace-pre-wrap rounded-lg bg-[#eef1f6] p-3 text-sm font-medium text-navy">
                {detail.row.body || "—"}
              </dd>
            </div>
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
