import type { ReactElement } from "react";

import { BrandLogoMark } from "@/components/brand/BrandLogoMark";
import { BRAND_SHORT } from "@/lib/branding";
import { cn } from "@/lib/utils";

type PublicNavMegaBrandWatermarkProps = {
  title: string;
  className?: string;
};

export function PublicNavMegaBrandWatermark({
  title,
  className,
}: PublicNavMegaBrandWatermarkProps): ReactElement {
  return (
    <div
      className={cn(
        "relative hidden min-h-[17.75rem] self-stretch overflow-hidden border-l border-slate-100 bg-white px-5 py-10 shadow-[inset_8px_0_24px_-20px_rgb(15_23_42/0.12)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[inset_8px_0_24px_-20px_rgb(0_0_0/0.35)] lg:flex lg:flex-col lg:items-center lg:justify-start",
        className,
      )}
      aria-hidden
    >
      <div className="pointer-events-none absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 opacity-[0.1] saturate-[0.85] dark:opacity-[0.14] dark:saturate-[0.7]">
        <BrandLogoMark pixelSize={220} shine roundedClassName="rounded-lg" />
      </div>
      <div className="relative z-10 max-w-[9rem] text-center">
        <p className="text-balance text-sm font-semibold leading-snug tracking-tight text-slate-900 dark:text-white">
          {title}
        </p>
        <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">SMK {BRAND_SHORT}</p>
      </div>
    </div>
  );
}
