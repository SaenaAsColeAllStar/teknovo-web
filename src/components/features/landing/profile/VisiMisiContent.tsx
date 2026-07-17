import type { ReactElement } from "react";

import { PublicTextContentCard } from "@/components/features/landing/PublicSplitContentCard";
import { ProfilPageShell } from "@/components/features/landing/profile/ProfilPageShell";
import { MotionInView } from "@/components/motion/MotionInView";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import {
  VISI_MISI_HERO_EYEBROW,
  VISI_MISI_PAGE_LEDE,
  VISI_MISI_PAGE_TITLE,
} from "@/lib/visi-misi-content";
import { cn } from "@/lib/utils";

const misiItems = [
  "Menyelenggarakan pembelajaran berbasis kurikulum nasional dan penguatan jurusan.",
  "Mengintegrasikan teknologi informasi dan literasi digital dalam proses belajar.",
  "Membangun kerja sama dengan industri dan dunia usaha untuk pengembangan kompetensi.",
  "Menumbuhkan kepemimpinan, tanggung jawab sosial, dan jiwa nasionalisme.",
] as const;

export function VisiMisiContent(): ReactElement {
  return (
    <ProfilPageShell eyebrow={VISI_MISI_HERO_EYEBROW} title={VISI_MISI_PAGE_TITLE} lede={VISI_MISI_PAGE_LEDE}>
      <ul className="mt-10 grid gap-4 lg:grid-cols-2">
        <MotionInView as="li" delay={0.06}>
          <PublicTextContentCard tone="neutral">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Visi</h2>
              <p
                className={cn(
                  "text-sm leading-relaxed text-slate-600 dark:text-slate-300",
                  publicFormalBodyClassName,
                )}
              >
                Menjadi SMK unggulan yang melahirkan lulusan berkarakter, berprestasi, dan mampu memanfaatkan
                teknologi secara etis untuk kemajuan bangsa.
              </p>
            </div>
          </PublicTextContentCard>
        </MotionInView>

        <MotionInView as="li" delay={0.09}>
          <PublicTextContentCard tone="neutral">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Misi</h2>
              <ul
                className={cn(
                  "space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300",
                  publicFormalBodyClassName,
                )}
              >
                {misiItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </PublicTextContentCard>
        </MotionInView>
      </ul>
    </ProfilPageShell>
  );
}
