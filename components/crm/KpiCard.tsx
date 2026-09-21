import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ChartSegment = {
  label: string;
  value: number;
  color: string;
  display?: string;
};

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  iconClass,
  legend,
  children,
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  iconClass: string;
  legend?: ChartSegment[];
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-white py-4">
      <div className="flex items-start justify-between gap-3 px-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className={cn("flex size-9 items-center justify-center rounded-lg", iconClass)}>
              <Icon className="size-4" aria-hidden />
            </span>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
          </div>
          <p className="mt-3 font-heading text-3xl font-medium text-navy">{value}</p>
        </div>
        <div className="shrink-0">{children}</div>
      </div>
      {legend ? (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-4">
          {legend.map((item) => (
            <p key={item.label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label} {item.display ?? item.value}
            </p>
          ))}
        </div>
      ) : null}
      <p className="mt-2 px-4 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}

export function DonutChart({
  segments,
  size = 76,
  stroke = 9,
}: {
  segments: ChartSegment[];
  size?: number;
  stroke?: number;
}) {
  const total = segments.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e8ecf2" strokeWidth={stroke} />
      {segments.map((item) => {
        const length = (item.value / total) * circumference;
        const circle = (
          <circle
            key={item.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth={stroke}
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset}
          />
        );
        offset += length;
        return circle;
      })}
    </svg>
  );
}

export function ColumnChart({ segments }: { segments: ChartSegment[] }) {
  const max = Math.max(...segments.map((item) => item.value), 1);

  return (
    <div className="flex h-[76px] w-[88px] items-end gap-1.5" aria-hidden>
      {segments.map((item) => (
        <div key={item.label} className="flex h-full flex-1 flex-col justify-end">
          <div
            className="w-full rounded-sm"
            style={{
              height: `${Math.max((item.value / max) * 100, item.value > 0 ? 8 : 0)}%`,
              backgroundColor: item.color,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function ValueBars({ segments }: { segments: ChartSegment[] }) {
  const max = Math.max(...segments.map((item) => item.value), 1);

  return (
    <div className="flex h-[76px] w-[112px] flex-col justify-center gap-2" aria-hidden>
      {segments.map((item) => (
        <div key={item.label} className="h-2 overflow-hidden rounded-full bg-[#e8ecf2]">
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.max((item.value / max) * 100, 6)}%`, backgroundColor: item.color }}
          />
        </div>
      ))}
    </div>
  );
}
