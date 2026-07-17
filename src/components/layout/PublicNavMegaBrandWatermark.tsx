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
        "relative hidden min-h-[17.75rem] self-stretch overflow-hidden border-l border-[color:var(--color-border-default)] bg-[color:var(--color-surface)] px-5 py-10 shadow-[inset_8px_0_24px_-20px_rgb(19_19_186/0.12)] lg:flex lg:flex-col lg:items-center lg:justify-start",
        className,
      )}
      aria-hidden
    >
      <div className="pointer-events-none absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 opacity-[0.1] saturate-[0.85]">
        <BrandLogoMark pixelSize={220} shine roundedClassName="rounded-none" />
      </div>
      <div className="relative z-10 max-w-[9rem] text-center">
        <p className="text-balance text-sm font-semibold leading-snug tracking-tight text-[color:var(--color-heading)]">
          {title}
        </p>
        <p className="mt-1.5 text-xs font-medium text-[color:var(--color-body-subtle)]">SMK {BRAND_SHORT}</p>
      </div>
    </div>
  );
}
