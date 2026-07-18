import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan class Tailwind tanpa konflik (pola Shadcn UI). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Helper format Rupiah untuk modul keuangan (boleh dipakai lintas fitur). */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format nilai uang dari string desimal API / Prisma. */
export function formatRupiahDecimal(amount: string | number): string {
  const n = typeof amount === "number" ? amount : Number.parseFloat(amount);
  if (!Number.isFinite(n)) {
    return "—";
  }
  return formatRupiah(n);
}

/** Sumbu grafik / tooltip ringkas (nilai nominal besar). */
export function formatRupiahCompact(amount: number): string {
  const n = Math.abs(amount);
  if (n >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} M`;
  if (n >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} jt`;
  if (n >= 1_000) return `${(amount / 1_000).toFixed(0)} rb`;
  return String(Math.round(amount));
}

/** Format tanggal singkat locale Indonesia. */
export function formatDateId(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
}

/** Label waktu relatif singkat (locale Indonesia). */
export function formatRelativeTimeId(date: Date, now = new Date()): string {
  const diffMs = date.getTime() - now.getTime();
  const absSec = Math.round(Math.abs(diffMs) / 1000);
  const sign = diffMs < 0 ? -1 : 1;
  const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

  if (absSec < 60) return rtf.format(sign * absSec, "second");
  const absMin = Math.round(absSec / 60);
  if (absMin < 60) return rtf.format(sign * absMin, "minute");
  const absHour = Math.round(absMin / 60);
  if (absHour < 24) return rtf.format(sign * absHour, "hour");
  const absDay = Math.round(absHour / 24);
  if (absDay < 30) return rtf.format(sign * absDay, "day");
  const absMonth = Math.round(absDay / 30);
  if (absMonth < 12) return rtf.format(sign * absMonth, "month");
  return rtf.format(sign * Math.round(absMonth / 12), "year");
}
