import type { Prisma } from "@prisma/client";
import type { FasilitasExtras } from "@teknovo/shared";

/** ISO-8601 string for API payloads (D1 stored text timestamps). */
export function toIso(d: Date | null | undefined): string | null {
  if (!d) return null;
  return d.toISOString();
}

export function toIsoRequired(d: Date): string {
  return d.toISOString();
}

/** YYYY-MM-DD from Prisma `@db.Date` (UTC calendar day). */
export function toDateOnly(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse API date-only string into a UTC Date for Prisma `@db.Date`. */
export function parseDateOnly(isoDate: string): Date {
  return new Date(`${isoDate.slice(0, 10)}T00:00:00.000Z`);
}

export function asStringArray(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string");
}

export function asExtras(value: Prisma.JsonValue): FasilitasExtras {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as FasilitasExtras;
}
