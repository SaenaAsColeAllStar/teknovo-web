import type { ReactElement } from "react";

import { BrandLogoMark } from "@/components/brand/BrandLogoMark";
import { BRAND_SHORT } from "@/lib/branding";
import { cn } from "@/lib/utils";

const AVATARS = [
  { initials: "AR", tone: "bg-neutral-soft text-brand" },
  { initials: "DN", tone: "bg-body-subtle/35 text-brand" },
  { initials: "SF", tone: "bg-surface text-brand" },
  { initials: "RH", tone: "bg-body/25 text-brand" },
] as const;

/**
 * Branded value column for forgot-password bleed layout.
 * School-appropriate copy — not portfolio / App Store social proof.
 */
export function ForgotPasswordBrandPanel({ className }: { className?: string }): ReactElement {
  return (
    <div className={cn("flex flex-col items-start text-left", className)}>
      <div className="flex items-center gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center overflow-hidden border border-white/25 bg-white">
          <BrandLogoMark size="sm" shine={false} roundedClassName="rounded-none" priority />
        </span>
        <span className="text-base font-bold leading-none tracking-wide text-white">
          {BRAND_SHORT}
        </span>
      </div>

      <h2 className="mt-10 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
        Kompetensi vokasi yang siap kerja, komunitas yang saling jaga.
      </h2>

      <p className="mt-4 text-base leading-relaxed text-white/80">
        Portal {BRAND_SHORT} menghubungkan siswa, orang tua, dan guru dalam satu ekosistem
        sekolah kejuruan — transparan, aman, dan mudah diakses kapan saja.
      </p>

      <div className="mt-10 flex items-center gap-4">
        <div className="flex -space-x-3" aria-hidden>
          {AVATARS.map((avatar) => (
            <span
              key={avatar.initials}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border-2 border-brand text-xs font-bold",
                avatar.tone,
              )}
            >
              {avatar.initials}
            </span>
          ))}
        </div>
        <p className="text-sm leading-snug text-white/90">
          <span className="font-semibold text-white">Dipercaya orang tua &amp; alumni</span>
          <span className="mt-0.5 block text-white/75">
            Ribuan keluarga memantau PPDB, LMS, dan layanan sekolah lewat portal ini.
          </span>
        </p>
      </div>
    </div>
  );
}
