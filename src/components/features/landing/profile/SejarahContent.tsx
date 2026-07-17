import type { ReactElement } from "react";

import {
  PublicSplitContentCard,
  publicSplitCardShellClassName,
} from "@/components/features/landing/PublicSplitContentCard";
import { ProfilPageShell } from "@/components/features/landing/profile/ProfilPageShell";
import { MotionInView } from "@/components/motion/MotionInView";
import { BRAND_SHORT } from "@/lib/branding";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import {
  SEJARAH_HERO_EYEBROW,
  SEJARAH_PAGE_LEDE,
  SEJARAH_PAGE_TITLE,
} from "@/lib/sejarah-content";
import { cn } from "@/lib/utils";

export function SejarahContent(): ReactElement {
  return (
    <ProfilPageShell eyebrow={SEJARAH_HERO_EYEBROW} title={SEJARAH_PAGE_TITLE} lede={SEJARAH_PAGE_LEDE}>
      <MotionInView
        as="article"
        className={cn(publicSplitCardShellClassName, "mt-10 min-h-[16rem] sm:min-h-[18rem]")}
        delay={0.06}
      >
        <PublicSplitContentCard
          tone="neutral"
          insetImage
          image={{
            src: LANDING_MEDIA.profil.sejarahSekolahWebp,
            alt: `Ilustrasi ${SEJARAH_PAGE_TITLE} ${BRAND_SHORT}`,
            quality: 70,
          }}
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Perjalanan {BRAND_SHORT}
            </h2>
            <p
              className={cn(
                "text-sm leading-relaxed text-slate-600 dark:text-slate-300",
                publicFormalBodyClassName,
              )}
            >
              {BRAND_SHORT} didirikan sebagai jawaban atas kebutuhan pendidikan menengah kejuruan yang
              mengintegrasikan karakter, akademik, dan penguasaan teknologi. Dari awal berdiri, sekolah
              membangun budaya disiplin digital — menghubungkan kelas dengan sistem informasi dan portal
              komunikasi bagi siswa serta orang tua. Perjalanan ini membentuk komunitas belajar yang adaptif
              terhadap perubahan zaman tanpa melupakan nilai luhur kebangsaan.
            </p>
          </div>
        </PublicSplitContentCard>
      </MotionInView>
    </ProfilPageShell>
  );
}
