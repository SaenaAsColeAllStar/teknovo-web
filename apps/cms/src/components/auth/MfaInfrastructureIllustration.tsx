import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

type MfaInfrastructureIllustrationProps = {
  className?: string;
};

/**
 * Illustrative secure-infra scene (figure + servers + laptop) — not photographic.
 * Atlas brand strokes/fills for CMS MFA column.
 */
export function MfaInfrastructureIllustration({
  className,
}: MfaInfrastructureIllustrationProps): ReactElement {
  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-xl items-center justify-center",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 560 420"
        className="h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <title>Ilustrasi autentikasi aman</title>
        {/* Soft ground */}
        <ellipse cx="280" cy="372" rx="200" ry="18" fill="var(--color-border)" opacity="0.55" />

        {/* Server stack left */}
        <g transform="translate(48 110)">
          <rect width="140" height="220" rx="10" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
          <rect x="14" y="18" width="112" height="36" rx="4" fill="var(--color-neutral-soft)" stroke="var(--color-border)" />
          <rect x="14" y="66" width="112" height="36" rx="4" fill="var(--color-neutral-soft)" stroke="var(--color-border)" />
          <rect x="14" y="114" width="112" height="36" rx="4" fill="var(--color-neutral-soft)" stroke="var(--color-border)" />
          <rect x="14" y="162" width="112" height="36" rx="4" fill="var(--color-neutral-soft)" stroke="var(--color-border)" />
          <circle cx="28" cy="36" r="4" fill="var(--color-brand)" />
          <circle cx="28" cy="84" r="4" fill="var(--color-brand)" />
          <circle cx="28" cy="132" r="4" fill="#22c55e" />
          <circle cx="28" cy="180" r="4" fill="var(--color-brand)" />
        </g>

        {/* Storage boxes mid-back */}
        <g transform="translate(200 168)">
          <rect width="96" height="64" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
          <rect y="72" width="96" height="64" rx="6" fill="var(--color-neutral-soft)" stroke="var(--color-border)" strokeWidth="2" />
          <path d="M16 32h64M16 104h64" stroke="var(--color-border)" strokeWidth="2" />
        </g>

        {/* Person + laptop */}
        <g transform="translate(310 150)">
          {/* Seat / box */}
          <rect x="8" y="148" width="120" height="52" rx="8" fill="var(--color-brand)" opacity="0.12" stroke="var(--color-brand)" strokeWidth="2" />
          {/* Body */}
          <path
            d="M70 70c22 0 36 16 36 40v38H34v-38c0-24 14-40 36-40Z"
            fill="var(--color-brand)"
            opacity="0.9"
          />
          {/* Head */}
          <circle cx="70" cy="48" r="22" fill="var(--color-surface)" stroke="var(--color-brand)" strokeWidth="2.5" />
          {/* Laptop */}
          <rect x="28" y="118" width="84" height="52" rx="4" fill="var(--color-heading)" />
          <rect x="34" y="124" width="72" height="36" rx="2" fill="var(--color-surface)" />
          <rect x="20" y="168" width="100" height="8" rx="2" fill="var(--color-heading)" />
          {/* Lock glyph on screen */}
          <rect x="58" y="132" width="16" height="12" rx="2" fill="var(--color-brand)" />
          <path d="M62 132v-4a6 6 0 0 1 12 0v4" stroke="var(--color-brand)" strokeWidth="2" />
        </g>

        {/* Shield badge */}
        <g transform="translate(430 70)">
          <path
            d="M40 4 72 18v28c0 22-14 40-32 48C22 86 8 68 8 46V18L40 4Z"
            fill="var(--color-surface)"
            stroke="var(--color-brand)"
            strokeWidth="2.5"
          />
          <path d="M28 44 38 54 56 32" stroke="var(--color-brand)" strokeWidth="3" strokeLinecap="square" />
        </g>
      </svg>
    </div>
  );
}
