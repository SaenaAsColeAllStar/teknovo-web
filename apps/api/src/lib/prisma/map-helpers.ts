import type { Prisma } from "@prisma/client";
import type {
  FasilitasExtras,
  SiteContentLayoutConfig,
  SiteContentStatus,
} from "@teknovo/shared";
import { DEFAULT_SITE_CONTENT_LAYOUT_CONFIG } from "@teknovo/shared";

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

/** Normalize layoutConfig Json → shared type (fills missing keys). */
export function asLayoutConfig(
  value: Prisma.JsonValue | null | undefined,
): SiteContentLayoutConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG };
  }
  const row = value as Record<string, unknown>;
  return {
    showHero:
      typeof row.showHero === "boolean"
        ? row.showHero
        : DEFAULT_SITE_CONTENT_LAYOUT_CONFIG.showHero,
    showFeatures:
      typeof row.showFeatures === "boolean"
        ? row.showFeatures
        : DEFAULT_SITE_CONTENT_LAYOUT_CONFIG.showFeatures,
    showHours:
      typeof row.showHours === "boolean"
        ? row.showHours
        : DEFAULT_SITE_CONTENT_LAYOUT_CONFIG.showHours,
    showStats:
      typeof row.showStats === "boolean"
        ? row.showStats
        : DEFAULT_SITE_CONTENT_LAYOUT_CONFIG.showStats,
    layoutTemplate:
      typeof row.layoutTemplate === "string" && row.layoutTemplate.length > 0
        ? row.layoutTemplate
        : DEFAULT_SITE_CONTENT_LAYOUT_CONFIG.layoutTemplate,
  };
}

export function layoutConfigJson(
  value: SiteContentLayoutConfig | undefined,
): Prisma.InputJsonValue {
  return (value ?? DEFAULT_SITE_CONTENT_LAYOUT_CONFIG) as Prisma.InputJsonValue;
}

/** Pass-through for optional Json columns (strukturKurikulum, etc.). */
export function asJsonUnknown(
  value: Prisma.JsonValue | null | undefined,
): unknown | null {
  return value === undefined || value === null ? null : value;
}

export function asStringRecord(
  value: Prisma.JsonValue | null | undefined,
): Record<string, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

/** Parse jam operasional JSON array `[{hari,buka,tutup}]`. */
export function asJamOperasional(
  value: Prisma.JsonValue | null | undefined,
): { hari: string; buka: string; tutup: string }[] | null {
  if (!Array.isArray(value)) return null;
  const out: { hari: string; buka: string; tutup: string }[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const row = item as Record<string, unknown>;
    if (
      typeof row.hari === "string" &&
      typeof row.buka === "string" &&
      typeof row.tutup === "string"
    ) {
      out.push({ hari: row.hari, buka: row.buka, tutup: row.tutup });
    }
  }
  return out.length ? out : null;
}

/** Resolve publishedAt when status changes (approval workflow aware). */
export function publishedAtForStatus(
  status: SiteContentStatus,
  previous: Date | null,
): Date | null {
  if (status === "PUBLISHED") return previous ?? new Date();
  if (
    status === "DRAFT" ||
    status === "PENDING_REVIEW" ||
    status === "REJECTED"
  ) {
    return null;
  }
  return previous;
}

export function mapReviewFields(row: {
  reviewedBy: string | null;
  reviewedAt: Date | null;
  reviewNote: string | null;
}): {
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
} {
  return {
    reviewedBy: row.reviewedBy,
    reviewedAt: toIso(row.reviewedAt),
    reviewNote: row.reviewNote,
  };
}
