import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  new: "border-transparent bg-navy/10 text-navy",
  contacted: "border-transparent bg-sky-100 text-sky-800",
  quoted: "border-transparent bg-amber-100 text-amber-800",
  won: "border-transparent bg-emerald-100 text-emerald-800",
  lost: "border-transparent bg-muted text-muted-foreground",
  draft: "border-transparent bg-muted text-muted-foreground",
  sent: "border-transparent bg-sky-100 text-sky-800",
  approved: "border-transparent bg-emerald-100 text-emerald-800",
  declined: "border-transparent bg-red-flag/10 text-red-flag",
  paid: "border-transparent bg-emerald-100 text-emerald-800",
  overdue: "border-transparent bg-red-flag/10 text-red-flag",
  accepted: "border-transparent bg-navy/10 text-navy",
  denied: "border-transparent bg-red-flag/10 text-red-flag",
  open: "border-transparent bg-muted text-muted-foreground",
  scheduled: "border-transparent bg-navy/10 text-navy",
  in_progress: "border-transparent bg-amber-100 text-amber-800",
  complete: "border-transparent bg-emerald-100 text-emerald-800",
  on_hold: "border-transparent bg-red-flag/10 text-red-flag",
};

const labels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
  draft: "Draft",
  sent: "Sent",
  approved: "Approved",
  declined: "Declined",
  paid: "Paid",
  overdue: "Overdue",
  accepted: "Accepted",
  denied: "Denied",
  open: "Open",
  scheduled: "Scheduled",
  in_progress: "In progress",
  complete: "Complete",
  on_hold: "On hold",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("capitalize", styles[status])}>
      {labels[status] ?? status.replaceAll("_", " ")}
    </Badge>
  );
}
