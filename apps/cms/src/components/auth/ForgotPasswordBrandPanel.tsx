import type { ReactElement } from "react";

import { BRAND_LOGO_SRC, BRAND_SHORT } from "@/lib/branding";
import { cn } from "@/lib/utils";

const AVATARS = [
  { initials: "AR", tone: "bg-[color:var(--color-neutral-soft)] text-[color:var(--color-brand)]" },
  { initials: "DN", tone: "bg-white/90 text-[color:var(--color-brand)]" },
  { initials: "SF", tone: "bg-white text-[color:var(--color-brand)]" },
  { initials: "RH", tone: "bg-white/80 text-[color:var(--color-brand)]" },
] as const;

/**
 * Branded value column for CMS forgot-password bleed layout.
 */
export function ForgotPasswordBrandPanel({ className }: { className?: string }): ReactElement {
  return (
    <div className={cn("flex flex-col items-start text-left", className)}>
      <div className="flex items-center gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center overflow-hidden border border-white/25 bg-white">
          <img
            src={BRAND_LOGO_SRC}
            alt={`Lambang ${BRAND_SHORT}`}
            width={36}
            height={36}
            className="size-9 object-contain"
          />
        </span>
        <span className="text-base font-bold leading-none tracking-wide text-white">
          {BRAND_SHORT}
        </span>
      </div>

      <h2 className="mt-10 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
        CMS sekolah untuk konten vokasi yang rapi dan terpercaya.
      </h2>

      <p className="mt-4 text-base leading-relaxed text-white/80">
        Platform digital {BRAND_SHORT} membantu guru dan staf mengelola berita, media, dan
        publikasi akademik dalam satu ruang yang aman.
      </p>

      <div className="mt-10 flex items-center gap-4">
        <div className="flex -space-x-3" aria-hidden>
          {AVATARS.map((avatar) => (
            <span
              key={avatar.initials}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border-2 border-[color:var(--color-brand)] text-xs font-bold",
                avatar.tone,
              )}
            >
              {avatar.initials}
            </span>
          ))}
        </div>
        <p className="text-sm leading-snug text-white/90">
          <span className="font-semibold text-white">Guru &amp; staf aktif</span>
          <span className="mt-0.5 block text-white/75">
            Tim sekolah memakai CMS untuk menjaga situs tetap mutakhir.
          </span>
        </p>
      </div>
    </div>
  );
}
