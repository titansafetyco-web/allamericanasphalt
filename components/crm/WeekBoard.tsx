import Link from "next/link";
import { schedule, type JobStatus } from "@/lib/crm/data";
import { cn } from "@/lib/utils";

const statusColor: Record<JobStatus, string> = {
  scheduled: "#0b2c6b",
  in_progress: "#d97706",
  complete: "#059669",
  on_hold: "#c8102e",
};

const crewColor: Record<string, string> = {
  "Crew A": "#0b2c6b",
  "Crew B": "#1c5bb8",
  "Crew C": "#d97706",
};

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayStart = 6;
const dayEnd = 18;

function startOfWeek(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  const weekday = date.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + offset);
  return date;
}

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseHour(part: string) {
  const match = part.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return hour + minutes / 60;
}

function parseWindow(window: string) {
  const [startText, endText] = window.split("–").map((part) => part.trim());
  if (!startText || !endText) return null;
  const start = parseHour(startText);
  const end = parseHour(endText);
  if (start == null || end == null) return null;
  return { start, end };
}

function shortJob(title: string) {
  return title.split("—")[0]?.trim() ?? title;
}

export function WeekBoard() {
  const weekStart = startOfWeek(schedule[0]?.date ?? "2026-09-21");
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const key = isoDate(date);
    return {
      key,
      label: dayNames[index],
      day: date.getDate(),
      items: schedule.filter((item) => item.date === key),
    };
  });
  const thisWeek = schedule.filter((item) => days.some((day) => day.key === item.date));
  const later = schedule.filter((item) => item.date > days[6].key);
  const crews = ["Crew A", "Crew B", "Crew C"].map((crew) => ({
    crew,
    color: crewColor[crew],
    count: thisWeek.filter((item) => item.crew === crew).length,
  }));
  const maxCrew = Math.max(...crews.map((item) => item.count), 1);
  const timed = thisWeek
    .map((item) => ({ item, hours: parseWindow(item.window) }))
    .filter((entry): entry is { item: (typeof schedule)[number]; hours: { start: number; end: number } } => Boolean(entry.hours));

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const item = day.items[0];
          return (
            <div
              key={day.key}
              className={cn(
                "flex min-h-[72px] flex-col items-center rounded-lg px-1 py-2 text-center",
                item ? "text-white" : "bg-[#eef1f6] text-muted-foreground",
              )}
              style={item ? { backgroundColor: statusColor[item.status] } : undefined}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{day.label}</p>
              <p className="font-heading text-lg leading-none">{day.day}</p>
              {item ? (
                <p className="mt-1 text-[10px] font-bold leading-tight">{item.crew.replace("Crew ", "")}</p>
              ) : (
                <p className="mt-1 text-[10px] opacity-50">—</p>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Work window</span>
          <span>6 AM – 6 PM</span>
        </div>
        <div className="grid gap-2">
          {timed.map(({ item, hours }) => {
            const left = ((hours.start - dayStart) / (dayEnd - dayStart)) * 100;
            const width = ((hours.end - hours.start) / (dayEnd - dayStart)) * 100;
            return (
              <Link key={item.id} href="/crm/schedule" className="grid gap-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-navy">{shortJob(item.title)}</p>
                  <p className="shrink-0 text-[11px] text-muted-foreground">{item.crew}</p>
                </div>
                <div className="relative h-6 overflow-hidden rounded-md bg-[#eef1f6]">
                  <div className="absolute inset-y-0 w-px bg-white" style={{ left: "50%" }} />
                  <div
                    className="absolute top-1 bottom-1 rounded-sm"
                    style={{
                      left: `${Math.max(left, 0)}%`,
                      width: `${Math.max(width, 8)}%`,
                      backgroundColor: statusColor[item.status],
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Crew load</p>
        <div className="grid gap-2">
          {crews.map((item) => (
            <div key={item.crew} className="grid grid-cols-[4.5rem_1fr_1.5rem] items-center gap-2">
              <p className="text-xs font-medium text-navy">{item.crew}</p>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#e8ecf2]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(item.count / maxCrew) * 100}%`, backgroundColor: item.color }}
                />
              </div>
              <p className="text-right text-xs font-semibold text-navy">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      {later.length > 0 ? (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Next week</p>
          <div className="grid gap-2">
            {later.map((item) => (
              <Link
                key={item.id}
                href="/crm/schedule"
                className="flex items-center justify-between gap-2 rounded-lg bg-[#eef1f6] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-navy">{shortJob(item.title)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.city} · {item.crew}
                  </p>
                </div>
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: statusColor[item.status] }}
                  aria-label={item.status.replaceAll("_", " ")}
                />
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {(
          [
            ["In progress", statusColor.in_progress],
            ["Scheduled", statusColor.scheduled],
            ["On hold", statusColor.on_hold],
          ] as const
        ).map(([label, color]) => (
          <p key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}
