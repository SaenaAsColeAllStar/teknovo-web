import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

type SignInLoginIllustrationProps = {
  className?: string;
};

/**
 * Login-column vector: person at a device, plants, and a soft screen silhouette.
 * Atlas brand strokes/fills — not photographic.
 */
export function SignInLoginIllustration({
  className,
}: SignInLoginIllustrationProps): ReactElement {
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
        <title>Ilustrasi masuk ke CMS</title>

        {/* Soft ground */}
        <ellipse cx="280" cy="378" rx="210" ry="16" fill="var(--color-border)" opacity="0.55" />

        {/* Large screen silhouette (back) */}
        <g transform="translate(88 56)">
          <rect
            width="280"
            height="200"
            rx="14"
            fill="var(--color-surface)"
            stroke="var(--color-border)"
            strokeWidth="2"
          />
          <rect
            x="16"
            y="16"
            width="248"
            height="148"
            rx="8"
            fill="var(--color-neutral-soft)"
            stroke="var(--color-border)"
            strokeWidth="1.5"
          />
          {/* Soft UI blocks on screen */}
          <rect x="36" y="40" width="88" height="10" rx="2" fill="var(--color-brand)" opacity="0.35" />
          <rect x="36" y="62" width="160" height="8" rx="2" fill="var(--color-border)" />
          <rect x="36" y="82" width="132" height="8" rx="2" fill="var(--color-border)" />
          <rect
            x="36"
            y="110"
            width="72"
            height="28"
            rx="4"
            fill="var(--color-brand)"
            opacity="0.85"
          />
          <rect
            x="120"
            y="110"
            width="72"
            height="28"
            rx="4"
            fill="var(--color-surface)"
            stroke="var(--color-brand)"
            strokeWidth="2"
          />
          {/* Stand */}
          <path d="M110 200h60l12 36H98l12-36Z" fill="var(--color-border)" opacity="0.7" />
          <rect x="88" y="236" width="104" height="8" rx="2" fill="var(--color-heading)" opacity="0.55" />
        </g>

        {/* Left plant */}
        <g transform="translate(42 250)">
          <rect x="28" y="72" width="36" height="48" rx="4" fill="var(--color-brand)" opacity="0.12" stroke="var(--color-brand)" strokeWidth="1.5" />
          <path
            d="M46 72c-18-28-8-52 4-60 4 14 2 28-4 40Z"
            fill="var(--color-brand)"
            opacity="0.55"
          />
          <path
            d="M46 72c18-26 10-50-2-58-2 16 0 30 2 42Z"
            fill="var(--color-brand)"
            opacity="0.75"
          />
          <path
            d="M46 68c0-22 14-38 28-42-8 18-14 30-20 42"
            fill="var(--color-brand)"
            opacity="0.4"
          />
        </g>

        {/* Right plant */}
        <g transform="translate(430 236)">
          <rect x="22" y="80" width="40" height="56" rx="4" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
          <path
            d="M42 80c-14-24-6-46 6-54 2 12 0 26-4 40Z"
            fill="var(--color-brand)"
            opacity="0.5"
          />
          <path
            d="M42 80c16-22 8-44-4-52 0 14 2 28 4 40Z"
            fill="var(--color-brand)"
            opacity="0.7"
          />
          <circle cx="42" cy="28" r="6" fill="var(--color-brand)" opacity="0.35" />
        </g>

        {/* Person + device (foreground) */}
        <g transform="translate(300 168)">
          {/* Seat */}
          <rect
            x="4"
            y="156"
            width="128"
            height="48"
            rx="10"
            fill="var(--color-brand)"
            opacity="0.1"
            stroke="var(--color-brand)"
            strokeWidth="2"
          />
          {/* Body */}
          <path
            d="M68 78c24 0 40 18 40 44v40H28v-40c0-26 16-44 40-44Z"
            fill="var(--color-brand)"
            opacity="0.9"
          />
          {/* Head */}
          <circle
            cx="68"
            cy="52"
            r="24"
            fill="var(--color-surface)"
            stroke="var(--color-brand)"
            strokeWidth="2.5"
          />
          {/* Laptop / tablet */}
          <rect x="24" y="128" width="88" height="54" rx="5" fill="var(--color-heading)" />
          <rect x="30" y="134" width="76" height="38" rx="3" fill="var(--color-surface)" />
          <rect x="16" y="180" width="104" height="8" rx="2" fill="var(--color-heading)" />
          {/* Cursor / focus on screen */}
          <rect x="44" y="148" width="40" height="6" rx="1.5" fill="var(--color-brand)" opacity="0.45" />
          <circle cx="68" cy="162" r="4" fill="var(--color-brand)" />
        </g>

        {/* Floating card accent */}
        <g transform="translate(400 72)">
          <rect
            width="88"
            height="64"
            rx="10"
            fill="var(--color-surface)"
            stroke="var(--color-border)"
            strokeWidth="2"
          />
          <circle cx="28" cy="28" r="10" fill="var(--color-brand)" opacity="0.15" stroke="var(--color-brand)" strokeWidth="2" />
          <path d="M24 28h8M28 24v8" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="square" />
          <rect x="48" y="22" width="28" height="6" rx="1.5" fill="var(--color-border)" />
          <rect x="48" y="36" width="22" height="6" rx="1.5" fill="var(--color-border)" />
        </g>
      </svg>
    </div>
  );
}
