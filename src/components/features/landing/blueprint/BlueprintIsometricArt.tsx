import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export type BlueprintIsometricArtProps = {
  className?: string;
};

/**
 * Isometric exploded-view line art for blueprint heroes (vector only — no photo).
 * Motif: stacked program layers (kurikulum → praktik → sertifikasi → digital).
 */
export function BlueprintIsometricArt({ className }: BlueprintIsometricArtProps): ReactElement {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("relative z-[1] h-auto w-full max-w-[18rem] text-heading sm:max-w-[20rem]", className)}
      aria-hidden
    >
      {/* Base plate */}
      <path
        d="M160 232 L64 184 L160 136 L256 184 Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
        opacity="0.35"
      />
      <path d="M64 184 V208 L160 256 L256 208 V184" stroke="currentColor" strokeWidth="1.15" opacity="0.28" />

      {/* Layer 1 — kurikulum slab (lowest exploded) */}
      <g transform="translate(0 18)" opacity="0.9">
        <path
          d="M160 168 L88 132 L160 96 L232 132 Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path d="M88 132 V148 L160 184 L232 148 V132" stroke="currentColor" strokeWidth="1.25" />
        <path d="M112 140 L160 116 L208 140" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        <path d="M120 152 L160 132 L200 152" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </g>

      {/* Layer 2 — PKL / workshop block */}
      <g transform="translate(0 -8)" opacity="0.95">
        <path
          d="M160 128 L100 98 L160 68 L220 98 Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path d="M100 98 V114 L160 144 L220 114 V98" stroke="currentColor" strokeWidth="1.25" />
        {/* small tool upright */}
        <path d="M148 108 L160 90 L172 108" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M160 90 V118" stroke="currentColor" strokeWidth="1.1" />
      </g>

      {/* Layer 3 — sertifikasi badge (floating) */}
      <g transform="translate(0 -36)">
        <path
          d="M160 88 L124 70 L160 52 L196 70 Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path d="M124 70 V82 L160 100 L196 82 V70" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="160" cy="74" r="10" stroke="currentColor" strokeWidth="1.15" />
        <path d="M155 74 L158 77 L166 69" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Layer 4 — literasi digital (top screen) */}
      <g transform="translate(0 -62)">
        <path
          d="M160 56 L128 40 L160 24 L192 40 Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path d="M128 40 V50 L160 66 L192 50 V40" stroke="currentColor" strokeWidth="1.25" />
        <path d="M140 44 H180" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        <path d="M144 50 H176" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M148 56 H172" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </g>

      {/* Explode guides */}
      <path d="M160 210 V248" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 3" opacity="0.35" />
      <path d="M96 150 L72 138" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 3" opacity="0.3" />
      <path d="M224 150 L248 138" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 3" opacity="0.3" />
    </svg>
  );
}
