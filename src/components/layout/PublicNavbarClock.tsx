"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const jakartaDisplayFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
});

const jakartaIsoFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
});

function partValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function formatJakartaClockLabel(now: Date): string {
  const parts = jakartaDisplayFormatter.formatToParts(now);
  return `${partValue(parts, "weekday")}, ${partValue(parts, "day")} ${partValue(parts, "month")} ${partValue(parts, "year")}, ${partValue(parts, "hour")}:${partValue(parts, "minute")}:${partValue(parts, "second")}`;
}

function formatJakartaClockDateTime(now: Date): string {
  const parts = jakartaIsoFormatter.formatToParts(now);
  return `${partValue(parts, "year")}-${partValue(parts, "month")}-${partValue(parts, "day")}T${partValue(parts, "hour")}:${partValue(parts, "minute")}:${partValue(parts, "second")}+07:00`;
}

type ClockState = {
  label: string;
  dateTime: string;
};

type PublicNavbarClockProps = {
  className?: string;
};

export function PublicNavbarClock({ className }: PublicNavbarClockProps): ReactElement {
  const [clock, setClock] = useState<ClockState | null>(null);

  useEffect(() => {
    function tick(): void {
      const now = new Date();
      setClock({
        label: formatJakartaClockLabel(now),
        dateTime: formatJakartaClockDateTime(now),
      });
    }
    tick();
    const id = window.setInterval(tick, 1_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time
      dateTime={clock?.dateTime}
      className={cn(
        "hidden shrink-0 text-right text-[11px] font-medium tabular-nums leading-snug text-slate-600 lg:block lg:min-w-[11rem] xl:min-w-[15rem] xl:text-xs dark:text-slate-300",
        className,
      )}
      aria-live="polite"
      aria-label={clock ? `Waktu Jakarta: ${clock.label}` : "Memuat waktu"}
    >
      {clock?.label ?? "—"}
    </time>
  );
}
