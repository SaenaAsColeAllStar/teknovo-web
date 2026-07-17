import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

type SignInIllustrationProps = {
  className?: string;
};

/**
 * Decorative vector for the sign-in page — person + device + plants/shapes.
 * CSS/SVG only; no external assets.
 */
export function SignInIllustration({ className }: SignInIllustrationProps): ReactElement {
  return (
    <svg
      viewBox="0 0 480 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full max-w-md", className)}
      aria-hidden
    >
      {/* Soft ground blob */}
      <ellipse cx="240" cy="368" rx="168" ry="28" fill="#E8E8F8" />

      {/* Abstract shapes */}
      <circle cx="72" cy="96" r="36" fill="#1313BA" fillOpacity="0.08" />
      <circle cx="420" cy="140" r="48" fill="#1313BA" fillOpacity="0.06" />
      <rect
        x="390"
        y="280"
        width="44"
        height="44"
        rx="8"
        transform="rotate(18 412 302)"
        fill="#1313BA"
        fillOpacity="0.1"
      />

      {/* Left plant */}
      <path
        d="M118 340c0-42 18-78 28-96 2 20 10 48 8 72-14 8-28 16-36 24Z"
        fill="#15A34A"
        fillOpacity="0.35"
      />
      <path
        d="M146 340c-6-36 4-72 16-94-4 22 0 50-2 74-4 6-10 14-14 20Z"
        fill="#15A34A"
        fillOpacity="0.55"
      />
      <rect x="128" y="336" width="24" height="10" rx="2" fill="#6363C6" fillOpacity="0.35" />

      {/* Right plant */}
      <path
        d="M358 340c8-40 26-74 40-92-6 24-2 52-8 74-10 6-22 12-32 18Z"
        fill="#15A34A"
        fillOpacity="0.35"
      />
      <path
        d="M338 340c10-34 8-70 4-94 12 20 22 48 18 74-6 6-14 14-22 20Z"
        fill="#15A34A"
        fillOpacity="0.55"
      />
      <rect x="332" y="336" width="28" height="10" rx="2" fill="#6363C6" fillOpacity="0.35" />

      {/* Desk */}
      <rect x="120" y="278" width="240" height="14" rx="3" fill="#1313BA" fillOpacity="0.12" />
      <rect x="136" y="292" width="10" height="48" fill="#1313BA" fillOpacity="0.1" />
      <rect x="334" y="292" width="10" height="48" fill="#1313BA" fillOpacity="0.1" />

      {/* Monitor */}
      <rect x="168" y="168" width="144" height="96" rx="8" fill="#1313BA" />
      <rect x="176" y="176" width="128" height="72" rx="4" fill="#EEF0FA" />
      <rect x="188" y="190" width="56" height="8" rx="2" fill="#1313BA" fillOpacity="0.35" />
      <rect x="188" y="206" width="88" height="6" rx="2" fill="#9090CE" fillOpacity="0.55" />
      <rect x="188" y="218" width="72" height="6" rx="2" fill="#9090CE" fillOpacity="0.4" />
      <rect x="226" y="264" width="28" height="14" fill="#1313BA" fillOpacity="0.85" />
      <rect x="208" y="276" width="64" height="6" rx="2" fill="#1313BA" fillOpacity="0.25" />

      {/* Person — torso */}
      <ellipse cx="240" cy="148" rx="28" ry="30" fill="#F5D0B0" />
      <path
        d="M210 178c8-10 22-16 30-16s22 6 30 16c4 18-2 40-12 52h-36c-10-12-16-34-12-52Z"
        fill="#1313BA"
      />
      {/* Hair */}
      <path
        d="M214 136c4-22 22-34 40-30 10 2 18 10 22 20-8-4-16-4-24-2-12 4-22 12-28 24-4-4-8-8-10-12Z"
        fill="#1E1B4B"
      />
      {/* Arms on desk */}
      <path
        d="M210 210c-16 18-28 36-30 52h24c4-14 12-28 22-40l-16-12Z"
        fill="#1313BA"
        fillOpacity="0.9"
      />
      <path
        d="M270 210c16 18 28 36 30 52h-24c-4-14-12-28-22-40l16-12Z"
        fill="#1313BA"
        fillOpacity="0.9"
      />
      {/* Hands */}
      <ellipse cx="186" cy="262" rx="10" ry="7" fill="#F5D0B0" />
      <ellipse cx="294" cy="262" rx="10" ry="7" fill="#F5D0B0" />

      {/* Floating accent card */}
      <rect
        x="64"
        y="200"
        width="64"
        height="48"
        rx="8"
        fill="white"
        stroke="#E8E8F8"
        strokeWidth="2"
      />
      <rect x="74" y="212" width="28" height="6" rx="2" fill="#1313BA" fillOpacity="0.4" />
      <rect x="74" y="224" width="40" height="4" rx="2" fill="#9090CE" fillOpacity="0.5" />
      <rect x="74" y="232" width="32" height="4" rx="2" fill="#9090CE" fillOpacity="0.35" />
    </svg>
  );
}
