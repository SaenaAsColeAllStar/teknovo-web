import { BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { BRAND_SHORT } from "@/lib/branding";
import { cn } from "@/lib/utils";

const FEATURES: ReadonlyArray<{
  icon: ReactNode;
  title: string;
  description: string;
}> = [
  {
    icon: <GraduationCap className="size-5" aria-hidden />,
    title: "Portal siswa & guru",
    description: "Akses jadwal, materi, dan layanan sekolah dari satu akun.",
  },
  {
    icon: <BookOpen className="size-5" aria-hidden />,
    title: "Konten akademik terkini",
    description: "Ikuti berita kegiatan, pengumuman, dan progres pembelajaran.",
  },
  {
    icon: <ShieldCheck className="size-5" aria-hidden />,
    title: "Aman dengan Clerk",
    description: "Masuk dengan email atau penyedia SSO yang sudah dikonfigurasi.",
  },
];

type SignInMarketingPanelProps = {
  className?: string;
};

/**
 * Left marketing column for `/sign-in` — heading, copy, and feature rows.
 */
export function SignInMarketingPanel({ className }: SignInMarketingPanelProps): ReactElement {
  return (
    <div className={cn("w-full max-w-lg text-left", className)}>
      <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--color-heading)] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        Selamat datang di
        <br />
        portal {BRAND_SHORT}
      </h2>

      <p className="mt-4 max-w-md text-base leading-relaxed text-[color:var(--color-body)] sm:text-[1.05rem]">
        Masuk untuk membuka dashboard sekolah, mengelola aktivitas akademik, dan tetap terhubung
        dengan komunitas SMK Teknologi &amp; Vokasional.
      </p>

      <ul className="mt-8 space-y-5 sm:mt-10">
        {FEATURES.map((feature) => (
          <li key={feature.title}>
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center border border-[color:var(--color-border-default)] bg-white text-[color:var(--color-brand)]">
                {feature.icon}
              </span>
              <p className="text-sm font-semibold text-[color:var(--color-heading)] sm:text-base">
                {feature.title}
              </p>
            </div>
            <p className="mt-1.5 pl-12 text-sm leading-relaxed text-[color:var(--color-body)]">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
