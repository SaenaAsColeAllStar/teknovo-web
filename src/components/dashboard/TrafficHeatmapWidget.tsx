"use client";

import { useId, useMemo, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const BRAND = "#1313BA";
const BORDER = "#E8E8F8";
const MUTED = "#9090CE";
const BODY = "#6363C6";

/** Half-hour slots 09:00–13:00 → 9 columns. */
const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
] as const;

const DAY_LABELS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
] as const;

type HeatCell = {
  day: (typeof DAY_LABELS)[number];
  time: (typeof TIME_SLOTS)[number];
  /** Session density 0–100. */
  value: number;
};

/**
 * 7 × 9 sample density grid (days × half-hours).
 * Replace with analytics API later.
 */
const HEATMAP_VALUES: number[][] = [
  [12, 18, 28, 42, 55, 48, 36, 22, 14],
  [15, 24, 38, 58, 72, 65, 44, 28, 16],
  [18, 30, 48, 70, 88, 82, 56, 34, 20],
  [22, 36, 54, 78, 95, 90, 62, 40, 24],
  [20, 32, 50, 74, 86, 80, 58, 36, 22],
  [8, 12, 18, 26, 34, 30, 22, 14, 8],
  [5, 8, 12, 16, 20, 18, 12, 8, 4],
];

const SCALE_STOPS = [
  { t: 0, color: "#F7F7FC" },
  { t: 0.25, color: "#C5C5F0" },
  { t: 0.5, color: "#7A7AD6" },
  { t: 0.75, color: "#3A3AC4" },
  { t: 1, color: BRAND },
] as const;

function lerpChannel(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

/** Brand monochrome scale from value 0–100. */
export function densityColor(value: number): string {
  const t = Math.min(1, Math.max(0, value / 100));
  let i = 0;
  while (i < SCALE_STOPS.length - 2 && t > SCALE_STOPS[i + 1].t) i += 1;
  const a = SCALE_STOPS[i];
  const b = SCALE_STOPS[i + 1];
  const local = (t - a.t) / (b.t - a.t || 1);
  const [ar, ag, ab] = hexToRgb(a.color);
  const [br, bg, bb] = hexToRgb(b.color);
  return `rgb(${lerpChannel(ar, br, local)}, ${lerpChannel(ag, bg, local)}, ${lerpChannel(ab, bb, local)})`;
}

function buildCells(): HeatCell[] {
  const cells: HeatCell[] = [];
  for (let r = 0; r < DAY_LABELS.length; r += 1) {
    for (let c = 0; c < TIME_SLOTS.length; c += 1) {
      cells.push({
        day: DAY_LABELS[r],
        time: TIME_SLOTS[c],
        value: HEATMAP_VALUES[r][c],
      });
    }
  }
  return cells;
}

type TrafficHeatmapWidgetProps = {
  className?: string;
  metricValue?: string;
  trendLabel?: string;
  metricLabel?: string;
  dateRangeLabel?: string;
  onDateRangeClick?: () => void;
};

/**
 * Self-contained traffic density heatmap (1024×640).
 * Sample data only — wire to analytics API later.
 */
export function TrafficHeatmapWidget({
  className,
  metricValue = "$3,560,890",
  trendLabel = "+18.2%",
  metricLabel = "Total revenue",
  dateRangeLabel = "7 hari terakhir",
  onDateRangeClick,
}: TrafficHeatmapWidgetProps) {
  const gradId = useId().replace(/:/g, "");
  const cells = useMemo(() => buildCells(), []);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const activeCell = activeKey
    ? cells.find((c) => `${c.day}-${c.time}` === activeKey) ?? null
    : null;

  return (
    <article
      className={cn(
        "box-border flex h-[640px] w-[1024px] shrink-0 flex-col rounded-md border border-[#E8E8F8] bg-[color:var(--color-surface)] p-6 shadow-[0_1px_3px_rgba(19,19,186,0.06)]",
        className,
      )}
      aria-label="Heatmap lalu lintas"
    >
      <header className="flex shrink-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-3xl font-bold tabular-nums tracking-tight text-[color:var(--color-heading)]">
              {metricValue}
            </p>
            <span className="inline-flex items-center rounded-sm bg-[color:var(--color-success)]/10 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-[color:var(--color-success)]">
              ↑ {trendLabel}
            </span>
          </div>
          <p className="mt-1 text-sm text-[color:var(--color-body-subtle)]">
            {metricLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={onDateRangeClick}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-[#E8E8F8] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--color-heading)] transition-colors hover:bg-[color:var(--color-neutral-soft)]"
          aria-haspopup="dialog"
        >
          <Calendar className="size-4" aria-hidden />
          <span style={{ color: BODY }}>{dateRangeLabel}</span>
          <ChevronDown className="size-4" style={{ color: MUTED }} aria-hidden />
        </button>
      </header>

      <div className="relative mt-5 min-h-0 flex-1">
        <div className="grid h-full grid-cols-[88px_1fr] grid-rows-[auto_1fr] gap-x-2 gap-y-2">
          <div aria-hidden />
          <div className="grid grid-cols-9 gap-1.5">
            {TIME_SLOTS.map((slot) => (
              <div
                key={slot}
                className="text-center text-[11px] tabular-nums text-[color:var(--color-body-subtle)]"
              >
                {slot}
              </div>
            ))}
          </div>

          <div className="grid grid-rows-7 gap-1.5">
            {DAY_LABELS.map((day) => (
              <div
                key={day}
                className="flex items-center text-xs text-[color:var(--color-body)]"
              >
                {day}
              </div>
            ))}
          </div>

          <div
            className="grid grid-cols-9 grid-rows-7 gap-1.5"
            role="grid"
            aria-label="Kepadatan sesi per jam"
          >
            {cells.map((cell) => {
              const key = `${cell.day}-${cell.time}`;
              const isActive = activeKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  tabIndex={0}
                  aria-label={`${cell.day} ${cell.time}: densitas ${cell.value}`}
                  className={cn(
                    "rounded-sm outline-none transition-[box-shadow,transform] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand)]/40",
                    isActive && "ring-2 ring-[color:var(--color-brand)]/50",
                  )}
                  style={{
                    backgroundColor: densityColor(cell.value),
                    border: `1px solid ${BORDER}`,
                  }}
                  onMouseEnter={() => setActiveKey(key)}
                  onMouseLeave={() => setActiveKey(null)}
                  onFocus={() => setActiveKey(key)}
                  onBlur={() => setActiveKey(null)}
                />
              );
            })}
          </div>
        </div>

        {activeCell ? (
          <div
            className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-md border bg-[color:var(--color-surface)] px-3 py-2 text-xs shadow-sm"
            style={{ borderColor: BORDER }}
            role="tooltip"
          >
            <p className="font-medium text-[color:var(--color-heading)]">
              {activeCell.day} · {activeCell.time}
            </p>
            <p className="mt-0.5 tabular-nums text-[color:var(--color-body)]">
              Densitas {activeCell.value}
            </p>
          </div>
        ) : null}
      </div>

      {/* Legend */}
      <div className="mt-5 flex shrink-0 flex-col items-center gap-2">
        <div className="flex w-full max-w-md items-center gap-3">
          <span className="shrink-0 text-[11px] tabular-nums text-[color:var(--color-body-subtle)]">
            Rendah
          </span>
          <div
            className="h-2.5 flex-1 rounded-sm border"
            style={{
              borderColor: BORDER,
              background: `linear-gradient(90deg, ${SCALE_STOPS.map((s) => s.color).join(", ")})`,
            }}
            role="img"
            aria-label="Skala warna densitas"
            id={`heat-scale-${gradId}`}
          />
          <span className="shrink-0 text-[11px] tabular-nums text-[color:var(--color-body-subtle)]">
            Tinggi
          </span>
        </div>
        <div className="flex w-full max-w-md justify-between px-10 text-[10px] tabular-nums text-[color:var(--color-body-subtle)]">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    </article>
  );
}
