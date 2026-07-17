"use client";

import type { ReactElement } from "react";

import { BrandLogoMark, type BrandLogoMarkSize } from "@/components/brand/BrandLogoMark";
import { BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { WhiteLightSweep } from "@/components/motion/WhiteLightSweep";
import { cn } from "@/lib/utils";

export type BrandLogoProps = {
  className?: string;
  /** `null` = tidak dibungkus link */
  href?: string | null;
  /** Navbar: ikon + judul singkat. Login: ikon + nama sekolah lengkap. */
  layout?: "compact" | "full" | "iconOnly";
  onNavigate?: () => void;
  /** Sapuan cahaya pada lambang (default aktif). */
  shine?: boolean;
};

function layoutToMarkSize(layout: BrandLogoProps["layout"]): BrandLogoMarkSize {
  if (layout === "full") {
    return "xl";
  }
  return "md";
}

/**
 * Logo + wordmark SMK — lambang di `public/brand/logo.png` (`BRAND_LOGO_SRC`).
 */
export function BrandLogo({
  className,
  href = "/",
  layout = "compact",
  onNavigate,
  shine = true,
}: BrandLogoProps): ReactElement {
  const iconNode = (
    <BrandLogoMark size={layoutToMarkSize(layout)} shine={shine} priority={layout === "full"} />
  );

  const compactWordmark = (
    <span className="min-w-0 truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white">
      SMK {BRAND_SHORT}
    </span>
  );

  const fullWordmark = (
    <span className="flex min-w-0 flex-col leading-tight">
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
        SMK {BRAND_SHORT}
      </span>
      <span className="mt-0.5 max-w-[20rem] text-xs font-medium text-slate-600 dark:text-slate-400">
        {BRAND_SCHOOL_FULL}
      </span>
    </span>
  );

  const wordmarkNode =
    layout === "iconOnly"
      ? null
      : shine
        ? (
            <span className="relative isolate min-w-0 overflow-hidden rounded-md bg-transparent">
              <span className="relative z-10 block min-w-0">
                {layout === "compact" ? compactWordmark : fullWordmark}
              </span>
              <WhiteLightSweep roundedClassName="rounded-md" placement="overlay" />
            </span>
          )
        : layout === "compact"
          ? compactWordmark
          : fullWordmark;

  const inner = (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-2.5",
        layout === "full" && "flex-col items-center text-center sm:flex-row sm:items-center sm:text-left",
        className,
      )}
    >
      {iconNode}
      {wordmarkNode}
    </span>
  );

  if (href === null) {
    return <span className="inline-flex">{inner}</span>;
  }

  return (
    <PublicSiteLink
      href={href}
      className="inline-flex min-w-0 shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
      onClick={onNavigate}
    >
      {inner}
    </PublicSiteLink>
  );
}
