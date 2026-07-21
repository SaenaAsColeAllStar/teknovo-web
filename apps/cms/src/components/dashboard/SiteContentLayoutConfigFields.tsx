"use client";

import { Label } from "@/components/ui/label";
import type { SiteContentLayoutConfig } from "@teknovo/shared";
import { DEFAULT_SITE_CONTENT_LAYOUT_CONFIG } from "@teknovo/shared";

const selectClassName =
  "flex h-10 w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20";

const LAYOUT_TEMPLATES = [
  { value: "default", label: "Default" },
] as const;

export type SiteContentLayoutConfigFieldsProps = {
  value: SiteContentLayoutConfig;
  onChange: (next: SiteContentLayoutConfig) => void;
  disabled?: boolean;
};

export function SiteContentLayoutConfigFields({
  value,
  onChange,
  disabled = false,
}: SiteContentLayoutConfigFieldsProps) {
  const cfg = value ?? DEFAULT_SITE_CONTENT_LAYOUT_CONFIG;

  function patch(partial: Partial<SiteContentLayoutConfig>) {
    onChange({ ...cfg, ...partial });
  }

  return (
    <fieldset className="space-y-3 border border-[color:var(--color-border)] p-4">
      <legend className="px-1 text-sm font-semibold text-[color:var(--color-heading)]">
        Layout
      </legend>
      <p className="text-xs text-[color:var(--color-body)]">
        Atur visibilitas section halaman publik. Template tambahan bisa ditambah
        nanti tanpa mengubah skema.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-[color:var(--color-heading)]">
          <input
            type="checkbox"
            checked={cfg.showHero}
            disabled={disabled}
            onChange={(e) => patch({ showHero: e.target.checked })}
          />
          Tampilkan hero
        </label>
        <label className="flex items-center gap-2 text-sm text-[color:var(--color-heading)]">
          <input
            type="checkbox"
            checked={cfg.showFeatures}
            disabled={disabled}
            onChange={(e) => patch({ showFeatures: e.target.checked })}
          />
          Tampilkan fitur
        </label>
        <label className="flex items-center gap-2 text-sm text-[color:var(--color-heading)]">
          <input
            type="checkbox"
            checked={cfg.showHours}
            disabled={disabled}
            onChange={(e) => patch({ showHours: e.target.checked })}
          />
          Tampilkan jam / jadwal
        </label>
        <label className="flex items-center gap-2 text-sm text-[color:var(--color-heading)]">
          <input
            type="checkbox"
            checked={cfg.showStats}
            disabled={disabled}
            onChange={(e) => patch({ showStats: e.target.checked })}
          />
          Tampilkan statistik
        </label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="layout-template">Template layout</Label>
        <select
          id="layout-template"
          className={selectClassName}
          value={cfg.layoutTemplate || "default"}
          disabled={disabled}
          onChange={(e) => patch({ layoutTemplate: e.target.value })}
        >
          {LAYOUT_TEMPLATES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
          {cfg.layoutTemplate &&
          !LAYOUT_TEMPLATES.some((t) => t.value === cfg.layoutTemplate) ? (
            <option value={cfg.layoutTemplate}>{cfg.layoutTemplate}</option>
          ) : null}
        </select>
      </div>
    </fieldset>
  );
}

export { DEFAULT_SITE_CONTENT_LAYOUT_CONFIG };
