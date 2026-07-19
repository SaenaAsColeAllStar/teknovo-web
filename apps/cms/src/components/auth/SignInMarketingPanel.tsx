import { FileText, Images, ShieldCheck } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { BRAND_SHORT, BRAND_WORDMARK_LINE1 } from "@/lib/branding";
import { cn } from "@/lib/utils";

const FEATURES: ReadonlyArray<{
  icon: ReactNode;
  title: string;
  description: string;
}> = [
  {
    icon: <FileText className="size-[18px]" aria-hidden />,
    title: "Kelola berita & artikel",
    description: "Tulis, sunting, dan terbitkan konten sekolah ke situs publik.",
  },
  {
    icon: <Images className="size-[18px]" aria-hidden />,
    title: "Pustaka media sekolah",
    description: "Unggah dan atur foto kegiatan, logo, serta aset visual.",
  },
  {
    icon: <ShieldCheck className="size-[18px]" aria-hidden />,
    title: "Akses sesuai peran",
    description: "Masuk dengan email undangan — Super Admin, Admin, Siswa, atau Viewer.",
  },
];

type SignInMarketingPanelProps = {
  className?: string;
};

/**
 * Left marketing column for CMS `/sign-in` — heading, copy, and feature rows.
 */
export function SignInMarketingPanel({ className }: SignInMarketingPanelProps): ReactElement {
  return (
    <div className={cn("w-full max-w-lg text-left", className)}>
      <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--color-heading)] sm:text-4xl xl:text-[2.75rem] xl:leading-[1.15]">
        {BRAND_WORDMARK_LINE1} {BRAND_SHORT}
        <br />
        CMS konten sekolah
      </h2>

      <p className="mt-4 max-w-md text-base leading-relaxed text-[color:var(--color-body)] sm:text-[1.05rem]">
        Ruang kerja editorial SMK {BRAND_SHORT} untuk guru dan staf — kelola berita,
        artikel, media, dan moderasi sebelum konten tayang di situs sekolah.
      </p>

      <ul className="mt-8 space-y-5 sm:mt-10">
        {FEATURES.map((feature) => (
          <li key={feature.title}>
            <div className="flex items-center gap-3">
              <span className="inline-flex shrink-0 text-[color:var(--color-brand)]">
                {feature.icon}
              </span>
              <p className="text-sm font-semibold text-[color:var(--color-heading)] sm:text-base">
                {feature.title}
              </p>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--color-body)]">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
