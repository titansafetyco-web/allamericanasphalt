"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Building2, CircleUser, LogOut, Plus, Receipt, Trash2, Users } from "lucide-react";
import { signOut } from "@/app/auth-actions";
import { useCrmSettings } from "@/components/crm/CrmSettingsProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultCrmSettings, type CrmRole, type CrmSettings } from "@/lib/crm/settings";
import { cn } from "@/lib/utils";

type SectionId = "account" | "company" | "notifications" | "billing" | "crews";

const sections: { id: SectionId; label: string; icon: typeof CircleUser }[] = [
  { id: "account", label: "Account", icon: CircleUser },
  { id: "company", label: "Company", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Estimates & invoices", icon: Receipt },
  { id: "crews", label: "Crews", icon: Users },
];

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function Toggle({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border px-3 py-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 accent-[#0b2c6b]"
      />
      <span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
      </span>
    </label>
  );
}

export function CrmSettingsForm({
  accountName,
  accountEmail,
  signedIn,
}: {
  accountName: string;
  accountEmail: string;
  signedIn: boolean;
}) {
  const { settings, setSettings, saveSettings, resetSettings, savedAt } = useCrmSettings();
  const [section, setSection] = useState<SectionId>("account");
  const [crewDraft, setCrewDraft] = useState("");
  const [status, setStatus] = useState("");

  function patch(partial: Partial<CrmSettings>) {
    setSettings((current) => ({ ...current, ...partial }));
    setStatus("");
  }

  function save() {
    saveSettings();
    setStatus("Settings saved on this device.");
  }

  function reset() {
    resetSettings();
    setStatus("Restored All American Asphalt defaults.");
  }

  function addCrew() {
    const name = crewDraft.trim();
    if (!name) return;
    if (settings.crews.some((crew) => crew.toLowerCase() === name.toLowerCase())) {
      setCrewDraft("");
      return;
    }
    patch({ crews: [...settings.crews, name] });
    setCrewDraft("");
  }

  const savedLabel = savedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
      }).format(new Date(savedAt))
    : "Not saved yet";

  return (
    <div className="mx-auto grid max-w-5xl gap-4">
      <p className="text-sm text-muted-foreground">
        Configure how this CRM session works — company details, lead alerts, invoice defaults, and crews.
      </p>

      <div className="grid overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10 lg:grid-cols-[15rem_1fr]">
        <aside className="flex gap-1 overflow-x-auto border-b p-2 lg:flex-col lg:border-b-0 lg:border-r">
          {sections.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors",
                  active ? "bg-navy text-white" : "text-navy/75 hover:bg-muted",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </button>
            );
          })}
        </aside>

        <div className="grid gap-6 p-5">
          {section === "account" ? (
            <div className="grid gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-flag">Signed in as</p>
                <h2 className="mt-1 font-heading text-2xl text-navy">{accountName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {accountEmail || "Guest session — no member account"}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id="displayName" label="Display name">
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(event) => patch({ displayName: event.target.value })}
                    placeholder={accountName}
                    className="h-10 bg-[#eef1f6]"
                  />
                </Field>
                <Field id="role" label="Role">
                  <select
                    id="role"
                    value={settings.role}
                    onChange={(event) => patch({ role: event.target.value as CrmRole })}
                    className="h-10 rounded-lg border border-input bg-[#eef1f6] px-2.5 text-sm"
                  >
                    <option value="office">Office</option>
                    <option value="dispatcher">Dispatcher</option>
                    <option value="field">Field</option>
                  </select>
                </Field>
              </div>
              <div className="flex flex-wrap gap-2">
                <form action={signOut}>
                  <Button type="submit" variant="destructive" className="h-10 px-4">
                    <LogOut className="size-4" aria-hidden />
                    Log off
                  </Button>
                </form>
                <Button asChild variant="outline" className="h-10 px-4">
                  <Link href={signedIn ? "/account" : "/sign-in"}>{signedIn ? "Member account" : "Sign in"}</Link>
                </Button>
              </div>
            </div>
          ) : null}

          {section === "company" ? (
            <div className="grid gap-4">
              <div>
                <h2 className="font-heading text-2xl text-navy">Company</h2>
                <p className="mt-1 text-sm text-muted-foreground">Shown in the CRM sidebar and used on estimates.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id="companyName" label="Company name">
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(event) => patch({ companyName: event.target.value })}
                    className="h-10 bg-[#eef1f6]"
                  />
                </Field>
                <Field id="owner" label="Owner">
                  <Input
                    id="owner"
                    value={settings.owner}
                    onChange={(event) => patch({ owner: event.target.value })}
                    className="h-10 bg-[#eef1f6]"
                  />
                </Field>
                <Field id="email" label="Office email">
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(event) => patch({ email: event.target.value })}
                    className="h-10 bg-[#eef1f6]"
                  />
                </Field>
                <Field id="defaultCounty" label="Default county">
                  <select
                    id="defaultCounty"
                    value={settings.defaultCounty}
                    onChange={(event) =>
                      patch({ defaultCounty: event.target.value as CrmSettings["defaultCounty"] })
                    }
                    className="h-10 rounded-lg border border-input bg-[#eef1f6] px-2.5 text-sm"
                  >
                    <option value="Palm Beach">Palm Beach</option>
                    <option value="Broward">Broward</option>
                    <option value="Martin">Martin</option>
                  </select>
                </Field>
                <Field id="phoneWestPalm" label="West Palm Beach / Stuart">
                  <Input
                    id="phoneWestPalm"
                    value={settings.phoneWestPalm}
                    onChange={(event) => patch({ phoneWestPalm: event.target.value })}
                    className="h-10 bg-[#eef1f6]"
                  />
                </Field>
                <Field id="phoneFortLauderdale" label="Fort Lauderdale">
                  <Input
                    id="phoneFortLauderdale"
                    value={settings.phoneFortLauderdale}
                    onChange={(event) => patch({ phoneFortLauderdale: event.target.value })}
                    className="h-10 bg-[#eef1f6]"
                  />
                </Field>
              </div>
              <Field id="address" label="Office address">
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(event) => patch({ address: event.target.value })}
                  className="bg-[#eef1f6]"
                  rows={3}
                />
              </Field>
            </div>
          ) : null}

          {section === "notifications" ? (
            <div className="grid gap-4">
              <div>
                <h2 className="font-heading text-2xl text-navy">Notifications</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose which website forms alert the office inbox.
                </p>
              </div>
              <Field id="leadInboxEmail" label="Lead inbox email">
                <Input
                  id="leadInboxEmail"
                  type="email"
                  value={settings.leadInboxEmail}
                  onChange={(event) => patch({ leadInboxEmail: event.target.value })}
                  className="h-10 bg-[#eef1f6]"
                />
              </Field>
              <div className="grid gap-2">
                <Toggle
                  id="notifyEstimates"
                  label="New estimate requests"
                  hint="Homepage free-estimate form submissions."
                  checked={settings.notifyEstimates}
                  onChange={(value) => patch({ notifyEstimates: value })}
                />
                <Toggle
                  id="notifyContact"
                  label="Contact form messages"
                  hint="Inbox messages from the Contact Us page."
                  checked={settings.notifyContact}
                  onChange={(value) => patch({ notifyContact: value })}
                />
                <Toggle
                  id="notifyFeedback"
                  label="Customer feedback"
                  hint="Compliments and complaints from the feedback form."
                  checked={settings.notifyFeedback}
                  onChange={(value) => patch({ notifyFeedback: value })}
                />
              </div>
            </div>
          ) : null}

          {section === "billing" ? (
            <div className="grid gap-4">
              <div>
                <h2 className="font-heading text-2xl text-navy">Estimates & invoices</h2>
                <p className="mt-1 text-sm text-muted-foreground">Defaults used when a new quote or invoice is created.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field id="invoicePrefix" label="Number prefix">
                  <Input
                    id="invoicePrefix"
                    value={settings.invoicePrefix}
                    onChange={(event) => patch({ invoicePrefix: event.target.value.toUpperCase() })}
                    className="h-10 bg-[#eef1f6]"
                  />
                </Field>
                <Field id="estimateValidDays" label="Estimate valid (days)">
                  <Input
                    id="estimateValidDays"
                    type="number"
                    min={1}
                    value={settings.estimateValidDays}
                    onChange={(event) => patch({ estimateValidDays: Number(event.target.value) })}
                    className="h-10 bg-[#eef1f6]"
                  />
                </Field>
                <Field id="taxRate" label="Tax rate (%)">
                  <Input
                    id="taxRate"
                    type="number"
                    min={0}
                    step="0.01"
                    value={settings.taxRate}
                    onChange={(event) => patch({ taxRate: Number(event.target.value) })}
                    className="h-10 bg-[#eef1f6]"
                  />
                </Field>
              </div>
              <Field id="paymentTerms" label="Payment terms">
                <Input
                  id="paymentTerms"
                  value={settings.paymentTerms}
                  onChange={(event) => patch({ paymentTerms: event.target.value })}
                  className="h-10 bg-[#eef1f6]"
                />
              </Field>
              <p className="text-xs text-muted-foreground">
                Next number will look like {settings.invoicePrefix || defaultCrmSettings.invoicePrefix}-008. Tax {settings.taxRate}% ·{" "}
                {settings.paymentTerms}
              </p>
            </div>
          ) : null}

          {section === "crews" ? (
            <div className="grid gap-4">
              <div>
                <h2 className="font-heading text-2xl text-navy">Crews</h2>
                <p className="mt-1 text-sm text-muted-foreground">Used on the schedule and job board.</p>
              </div>
              <ul className="grid gap-2">
                {settings.crews.map((crew) => (
                  <li key={crew} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="text-sm font-medium text-navy">{crew}</span>
                    <button
                      type="button"
                      onClick={() => patch({ crews: settings.crews.filter((item) => item !== crew) })}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-red-flag"
                      aria-label={`Remove ${crew}`}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  value={crewDraft}
                  onChange={(event) => setCrewDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCrew();
                    }
                  }}
                  placeholder="Add a crew"
                  className="h-10 bg-[#eef1f6]"
                  aria-label="Crew name"
                />
                <Button type="button" variant="outline" className="h-10 px-3" onClick={addCrew}>
                  <Plus className="size-4" aria-hidden />
                  Add
                </Button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <p className="text-xs text-muted-foreground">Last saved {savedLabel}</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="h-10 px-4" onClick={reset}>
                Reset defaults
              </Button>
              <Button type="button" className="h-10 bg-navy px-4 text-white hover:bg-navy/90" onClick={save}>
                Save settings
              </Button>
            </div>
          </div>
          {status ? (
            <p className="text-sm text-emerald-700" role="status">
              {status}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
