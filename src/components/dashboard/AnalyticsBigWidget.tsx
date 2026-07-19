"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
} from "recharts";
import {
  Calendar,
  ChevronDown,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

import { cn } from "@/lib/utils";

const BRAND = "#1313BA";
const SUCCESS = "#15A34A";
const DANGER = "#BE123C";
const BORDER = "#E8E8F8";
const MUTED = "#9090CE";
const BODY = "#6363C6";

type TrendDirection = "up" | "down";

type HeaderMetric = {
  id: string;
  label: string;
  value: string;
  trend: TrendDirection;
  trendLabel: string;
  comparison: string;
};

type SparkPoint = { t: string; v: number };

type SparkPanel = {
  id: string;
  title: string;
  value: string;
  trend: TrendDirection;
  trendLabel: string;
  color: string;
  data: SparkPoint[];
};

type DeviceSlice = {
  id: string;
  label: string;
  percent: number;
  count: number;
  color: string;
  icon: "desktop" | "mobile" | "tablet";
};

/** Sample analytics — replace with API wire-up later. */
const HEADER_METRICS: HeaderMetric[] = [
  {
    id: "live",
    label: "Live users",
    value: "1,284",
    trend: "up",
    trendLabel: "+12.4%",
    comparison: "vs last day",
  },
  {
    id: "visitors",
    label: "Visitors",
    value: "18,492",
    trend: "up",
    trendLabel: "+8.1%",
    comparison: "vs last day",
  },
  {
    id: "views",
    label: "Views",
    value: "42,917",
    trend: "down",
    trendLabel: "−3.2%",
    comparison: "vs last day",
  },
  {
    id: "avg",
    label: "Avg time",
    value: "3m 42s",
    trend: "up",
    trendLabel: "+0.8%",
    comparison: "vs last day",
  },
];

const SPARK_PANELS: SparkPanel[] = [
  {
    id: "visits",
    title: "Visits",
    value: "24,680",
    trend: "up",
    trendLabel: "+14%",
    color: BRAND,
    data: [
      { t: "Sen", v: 2100 },
      { t: "Sel", v: 2450 },
      { t: "Rab", v: 2280 },
      { t: "Kam", v: 3100 },
      { t: "Jum", v: 2900 },
      { t: "Sab", v: 3600 },
      { t: "Min", v: 3250 },
    ],
  },
  {
    id: "revenue",
    title: "Revenue",
    value: "$12,480",
    trend: "up",
    trendLabel: "+9%",
    color: SUCCESS,
    data: [
      { t: "Sen", v: 1200 },
      { t: "Sel", v: 1480 },
      { t: "Rab", v: 1320 },
      { t: "Kam", v: 1780 },
      { t: "Jum", v: 1650 },
      { t: "Sab", v: 2100 },
      { t: "Min", v: 1950 },
    ],
  },
  {
    id: "customers",
    title: "Customers",
    value: "3,142",
    trend: "down",
    trendLabel: "−2%",
    color: DANGER,
    data: [
      { t: "Sen", v: 480 },
      { t: "Sel", v: 520 },
      { t: "Rab", v: 495 },
      { t: "Kam", v: 460 },
      { t: "Jum", v: 440 },
      { t: "Sab", v: 410 },
      { t: "Min", v: 390 },
    ],
  },
];

const DEVICES: DeviceSlice[] = [
  {
    id: "desktop",
    label: "Desktop",
    percent: 54,
    count: 9_980,
    color: BRAND,
    icon: "desktop",
  },
  {
    id: "mobile",
    label: "Mobile",
    percent: 38,
    count: 7026,
    color: "#6363C6",
    icon: "mobile",
  },
  {
    id: "tablet",
    label: "Tablet",
    percent: 8,
    count: 1486,
    color: "#9090CE",
    icon: "tablet",
  },
];

function TrendBadge({
  trend,
  label,
}: {
  trend: TrendDirection;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-semibold tabular-nums",
        trend === "up"
          ? "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]"
          : "bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]",
      )}
    >
      {label}
    </span>
  );
}

function SparkTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  return (
    <div
      className="rounded-md border bg-[color:var(--color-surface)] px-2.5 py-1.5 text-xs shadow-sm"
      style={{ borderColor: BORDER }}
    >
      <p className="font-medium text-[color:var(--color-heading)]">{label}</p>
      <p className="tabular-nums text-[color:var(--color-body)]">
        {typeof point.value === "number"
          ? point.value.toLocaleString("en-US")
          : point.value}
      </p>
    </div>
  );
}

function DeviceIcon({
  kind,
  className,
}: {
  kind: DeviceSlice["icon"];
  className?: string;
}) {
  const props = { className: cn("size-4 shrink-0", className), "aria-hidden": true };
  if (kind === "desktop") return <Monitor {...props} />;
  if (kind === "mobile") return <Smartphone {...props} />;
  return <Tablet {...props} />;
}

type AnalyticsBigWidgetProps = {
  className?: string;
  onViewReport?: () => void;
  onDateRangeClick?: () => void;
  dateRangeLabel?: string;
};

/**
 * Self-contained analytics summary widget (1024px wide, auto height).
 * Sample data only — wire to analytics API later.
 */
export function AnalyticsBigWidget({
  className,
  onViewReport,
  onDateRangeClick,
  dateRangeLabel = "7 hari terakhir",
}: AnalyticsBigWidgetProps) {
  return (
    <article
      className={cn(
        "box-border h-auto w-[1024px] shrink-0 rounded-md border border-[#E8E8F8] bg-[color:var(--color-surface)] p-6 shadow-[0_1px_3px_rgba(19,19,186,0.06)]",
        className,
      )}
      aria-label="Ringkasan analitik"
    >
      {/* Header metrics */}
      <header className="grid grid-cols-4 gap-4 pb-5">
        {HEADER_METRICS.map((m) => (
          <div key={m.id} className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-2xl font-bold tabular-nums tracking-tight text-[color:var(--color-heading)]">
                {m.value}
              </p>
              <TrendBadge trend={m.trend} label={m.trendLabel} />
            </div>
            <p className="mt-1 text-xs text-[color:var(--color-body-subtle)]">
              {m.comparison}
            </p>
            <p className="mt-0.5 text-sm text-[color:var(--color-body)]">
              {m.label}
            </p>
          </div>
        ))}
      </header>

      <div className="h-px w-full bg-[#E8E8F8]" role="separator" />

      {/* Body: sparkline panels + devices */}
      <div className="grid grid-cols-4 divide-x divide-[#E8E8F8] py-5">
        {SPARK_PANELS.map((panel) => {
          const gradId = `spark-fill-${panel.id}`;
          return (
            <section key={panel.id} className="min-w-0 px-4 first:pl-0 last:pr-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-[color:var(--color-body)]">
                  {panel.title}
                </h3>
                <TrendBadge trend={panel.trend} label={panel.trendLabel} />
              </div>
              <p className="mt-1 text-xl font-bold tabular-nums text-[color:var(--color-heading)]">
                {panel.value}
              </p>
              <div className="mt-3 h-[72px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={panel.data}
                    margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={panel.color} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={panel.color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      content={SparkTooltip}
                      cursor={{ stroke: BORDER, strokeWidth: 1 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={panel.color}
                      strokeWidth={2}
                      fill={`url(#${gradId})`}
                      isAnimationActive={false}
                      activeDot={{ r: 3, fill: panel.color, stroke: "#fff", strokeWidth: 1 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          );
        })}

        {/* Device breakdown */}
        <section className="min-w-0 px-4 last:pr-0">
          <h3 className="text-sm font-medium text-[color:var(--color-body)]">
            Devices
          </h3>
          <ul className="mt-3 space-y-2.5">
            {DEVICES.map((d) => (
              <li key={d.id} className="flex items-center gap-2.5">
                <DeviceIcon kind={d.icon} className="text-[color:var(--color-heading)]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm text-[color:var(--color-heading)]">
                      {d.label}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-[color:var(--color-heading)]">
                      {d.percent}%
                    </span>
                  </div>
                  <p className="text-xs tabular-nums text-[color:var(--color-body-subtle)]">
                    {d.count.toLocaleString("en-US")}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div
            className="mt-4 flex h-2 w-full overflow-hidden rounded-sm"
            role="img"
            aria-label="Distribusi perangkat"
          >
            {DEVICES.map((d) => (
              <div
                key={d.id}
                style={{ width: `${d.percent}%`, backgroundColor: d.color }}
                title={`${d.label}: ${d.percent}%`}
              />
            ))}
          </div>

          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {DEVICES.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-1.5 text-xs text-[color:var(--color-body-subtle)]"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: d.color }}
                  aria-hidden
                />
                {d.label}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="h-px w-full bg-[#E8E8F8]" role="separator" />

      {/* Footer actions */}
      <footer className="flex items-center justify-between gap-3 pt-5">
        <button
          type="button"
          onClick={onViewReport}
          className="inline-flex items-center gap-2 rounded-md border border-[#E8E8F8] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--color-heading)] transition-colors hover:bg-[color:var(--color-neutral-soft)]"
        >
          <Eye className="size-4" aria-hidden />
          Lihat laporan
        </button>
        <button
          type="button"
          onClick={onDateRangeClick}
          className="inline-flex items-center gap-2 rounded-md border border-[#E8E8F8] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--color-heading)] transition-colors hover:bg-[color:var(--color-neutral-soft)]"
          aria-haspopup="dialog"
        >
          <Calendar className="size-4" aria-hidden />
          <span style={{ color: BODY }}>{dateRangeLabel}</span>
          <ChevronDown className="size-4" style={{ color: MUTED }} aria-hidden />
        </button>
      </footer>
    </article>
  );
}
