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
    <Card className="min-w-0 overflow-hidden bg-white py-3 md:py-4">
      <div className="flex items-start justify-between gap-2 px-2.5 md:gap-3 md:px-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 md:gap-2.5">
            <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-md md:size-9 md:rounded-lg", iconClass)}>
              <Icon className="size-3.5 md:size-4" aria-hidden />
            </span>
            <p className="truncate text-[11px] font-medium text-muted-foreground md:text-sm">{label}</p>
          </div>
          <p className="mt-2 font-heading text-xl font-medium leading-tight text-navy md:mt-3 md:text-3xl">{value}</p>
        </div>
        <div className="shrink-0">{children}</div>
      </div>
      {legend ? (
        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 px-2.5 md:mt-3 md:gap-x-3 md:gap-y-1 md:px-4">
          {legend.map((item) => (
            <p key={item.label} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground md:gap-1.5 md:text-[11px]">
              <span className="size-1.5 shrink-0 rounded-full md:size-2" style={{ backgroundColor: item.color }} />
              {item.label} {item.display ?? item.value}
            </p>
          ))}
        </div>
      ) : null}
      <p className="mt-1.5 truncate px-2.5 text-[10px] text-muted-foreground md:mt-2 md:px-4 md:text-xs">{hint}</p>
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
    <svg viewBox={`0 0 ${size} ${size}`} className="size-12 -rotate-90 md:size-[76px]" aria-hidden>
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
    <div className="flex h-12 w-14 items-end gap-1 md:h-[76px] md:w-[88px] md:gap-1.5" aria-hidden>
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
    <div className="flex h-12 w-16 flex-col justify-center gap-1 md:h-[76px] md:w-[112px] md:gap-2" aria-hidden>
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
