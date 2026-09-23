"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Trash2 } from "lucide-react";
import { saveQuoteEstimate } from "@/app/crm-actions";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultQuoteLines,
  formatDate,
  lineTotal,
  money,
  quoteSubtotal,
  quoteUnits,
  serviceTypes,
  type Estimate,
  type EstimateLine,
} from "@/lib/crm/data";

function nextLine(quoteId: string): EstimateLine {
  return {
    id: `${quoteId}-${crypto.randomUUID().slice(0, 8)}`,
    description: "",
    qty: 1,
    unit: "LS",
    unitPrice: 0,
  };
}

function QuoteActions({ status }: { status: Estimate["status"] }) {
  const { pending } = useFormStatus();
  return (
    <DialogFooter className="-mx-6 -mb-6 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
      <Button type="submit" name="intent" value="save" variant="outline" disabled={pending} className="h-10 px-4 font-semibold">
        {pending ? "Saving…" : "Save"}
      </Button>
      <Button type="submit" name="intent" value="send" variant="secondary" disabled={pending} className="h-10 px-4 font-semibold">
        Send quote
      </Button>
      <Button type="submit" name="intent" value="decline" variant="outline" disabled={pending} className="h-10 px-4 font-semibold">
        Decline
      </Button>
      <Button
        type="submit"
        name="intent"
        value="approve"
        disabled={pending || status === "approved"}
        className="h-10 bg-navy px-4 font-bold text-white hover:bg-navy/90"
      >
        {status === "approved" ? "In pipeline" : "Approve job"}
      </Button>
    </DialogFooter>
  );
}

export function QuoteController({
  quote,
  taxRate,
  paymentTerms,
}: {
  quote: Estimate;
  taxRate: number;
  paymentTerms: string;
}) {
  const [service, setService] = useState(quote.service);
  const [city, setCity] = useState(quote.city);
  const [notes, setNotes] = useState(quote.notes ?? "");
  const [validUntil, setValidUntil] = useState(quote.validUntil);
  const [lines, setLines] = useState<EstimateLine[]>(() => defaultQuoteLines(quote));

  useEffect(() => {
    setService(quote.service);
    setCity(quote.city);
    setNotes(quote.notes ?? "");
    setValidUntil(quote.validUntil);
    setLines(defaultQuoteLines(quote));
  }, [quote]);

  const subtotal = useMemo(() => quoteSubtotal(lines), [lines]);
  const tax = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + tax;

  function updateLine(id: string, patch: Partial<EstimateLine>) {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  return (
    <form action={saveQuoteEstimate} className="grid gap-5">
      <input type="hidden" name="id" value={quote.id} />
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge status={quote.status} />
        <p className="text-xs text-muted-foreground">
          {quote.sentAt ? `Sent ${formatDate(quote.sentAt)}` : "Not sent"} · {paymentTerms}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="quote-customer">Customer</Label>
          <Input id="quote-customer" value={quote.customer} readOnly className="bg-[#eef1f6]" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="quote-city">City</Label>
          <Input id="quote-city" name="city" value={city} onChange={(event) => setCity(event.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="quote-service">Service</Label>
          <select
            id="quote-service"
            name="service"
            value={service}
            onChange={(event) => setService(event.target.value as Estimate["service"])}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {serviceTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="quote-valid">Valid until</Label>
          <Input id="quote-valid" name="validUntil" type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="quote-notes">Scope of work</Label>
        <Textarea
          id="quote-notes"
          name="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Parking lot layout, stalls, arrows, stop bars, materials, access notes…"
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Line items</p>
          <Button type="button" variant="outline" size="sm" onClick={() => setLines((current) => [...current, nextLine(quote.id)])}>
            <Plus />
            Add line
          </Button>
        </div>
        <div className="overflow-x-auto rounded-lg ring-1 ring-foreground/10">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-[#eef1f6] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-2.5 py-2 font-semibold">Description</th>
                <th className="w-20 px-2.5 py-2 font-semibold">Qty</th>
                <th className="w-24 px-2.5 py-2 font-semibold">Unit</th>
                <th className="w-28 px-2.5 py-2 font-semibold">Unit $</th>
                <th className="w-24 px-2.5 py-2 text-right font-semibold">Ext</th>
                <th className="w-10 px-1 py-2">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-t border-foreground/10">
                  <td className="px-2 py-1.5">
                    <Input
                      value={line.description}
                      onChange={(event) => updateLine(line.id, { description: event.target.value })}
                      placeholder="Work item"
                      aria-label="Line description"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      value={line.qty}
                      onChange={(event) => updateLine(line.id, { qty: Number(event.target.value) })}
                      aria-label="Quantity"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <select
                      value={line.unit}
                      onChange={(event) => updateLine(line.id, { unit: event.target.value })}
                      aria-label="Unit"
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none"
                    >
                      {quoteUnits.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <Input
                      type="number"
                      min={0}
                      step="1"
                      value={line.unitPrice}
                      onChange={(event) => updateLine(line.id, { unitPrice: Number(event.target.value) })}
                      aria-label="Unit price"
                    />
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-semibold text-navy">{money(lineTotal(line))}</td>
                  <td className="px-1 py-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={lines.length === 1}
                      onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))}
                      aria-label="Remove line"
                    >
                      <Trash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <dl className="grid gap-2 rounded-lg bg-[#eef1f6] p-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amount</dt>
          <dd className="mt-1 font-heading text-xl text-navy">{money(subtotal)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tax ({taxRate}%)</dt>
          <dd className="mt-1 font-heading text-xl text-navy">{money(tax)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</dt>
          <dd className="mt-1 font-heading text-xl text-navy">{money(total)}</dd>
        </div>
      </dl>

      <QuoteActions status={quote.status} />
    </form>
  );
}
