"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** WIB — weekday + long date for the marketing navbar top bar. */
const jakartaDateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const jakartaIsoDateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Jakarta",
});

function formatJakartaDateLabel(now: Date): string {
  // id-ID typically yields "Sabtu, 18 Juli 2026"
  return jakartaDateFormatter.format(now);
}

function formatJakartaDateIso(now: Date): string {
  // en-CA → YYYY-MM-DD
  return jakartaIsoDateFormatter.format(now);
}

type DateState = {
  label: string;
  dateTime: string;
};

type PublicNavbarClockProps = {
  className?: string;
};

/**
 * Client “today” for the public navbar — Asia/Jakarta calendar date in Indonesian.
 * Updates on mount and periodically so overnight sessions stay correct.
 */
export function PublicNavbarClock({ className }: PublicNavbarClockProps): ReactElement {
  const [date, setDate] = useState<DateState | null>(null);

  useEffect(() => {
    function sync(): void {
      const now = new Date();
      setDate({
        label: formatJakartaDateLabel(now),
        dateTime: formatJakartaDateIso(now),
      });
    }

    sync();
    const id = window.setInterval(sync, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time
      dateTime={date?.dateTime}
      className={cn(
        "truncate text-sm font-medium text-[color:var(--color-body-subtle)]",
        className,
      )}
      aria-live="polite"
      aria-label={date ? `Tanggal hari ini: ${date.label}` : "Memuat tanggal"}
    >
      {date?.label ?? "\u00a0"}
    </time>
  );
}
