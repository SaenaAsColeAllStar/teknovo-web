import { FileText, Images, ShieldCheck } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { BRAND_SHORT } from "@/lib/branding";
import { cn } from "@/lib/utils";

const PROOF_POINTS: ReadonlyArray<{
  icon: ReactNode;
  metric: string;
  detail: string;
}> = [
  {
    icon: <FileText className="size-4" aria-hidden />,
    metric: "500+ publikasi konten",
    detail: "Berita dan artikel sekolah dikelola lewat CMS sebelum tayang publik.",
  },
  {
    icon: <Images className="size-4" aria-hidden />,
    metric: "Pustaka media terpusat",
    detail: "Foto kegiatan, logo, dan aset visual tersusun dalam satu ruang kerja.",
  },
  {
    icon: <ShieldCheck className="size-4" aria-hidden />,
    metric: "Akses berbasis peran",
    detail: "Admin, editor, dan viewer dengan batas yang jelas untuk tim sekolah.",
  },
];

export type AuthSocialProofPanelProps = {
  className?: string;
};

/**
 * Shared left social-proof column for CMS auth (forgot / reset password).
 * Trust metric heading, supporting copy, and three proof rows.
 */
export function AuthSocialProofPanel({ className }: AuthSocialProofPanelProps): ReactElement {
  return (
    <div className={cn("flex w-full flex-col items-start text-left", className)}>
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-[color:var(--color-heading)] sm:text-4xl xl:text-[2.75rem] xl:leading-[1.15]">
        Dipercaya 200+ guru &amp; staf di CMS {BRAND_SHORT}
      </h2>

      <p className="mt-4 max-w-md text-base leading-relaxed text-[color:var(--color-body)] sm:text-[1.05rem]">
        Platform editorial SMK {BRAND_SHORT} membantu tim sekolah mengelola berita, media, dan
        publikasi akademik dengan aman — terkoordinasi, dan siap tayang ke situs publik.
      </p>

      <ul className="mt-10 space-y-6 sm:mt-12">
        {PROOF_POINTS.map((point) => (
          <li key={point.metric} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-brand)]">
              {point.icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[color:var(--color-heading)] sm:text-base">
                {point.metric}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-body)]">
                {point.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
