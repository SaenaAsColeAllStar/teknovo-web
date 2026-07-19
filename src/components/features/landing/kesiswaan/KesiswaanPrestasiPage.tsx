import type { ReactElement } from "react";

import { KesiswaanPageShell } from "@/components/features/landing/KesiswaanPageShell";
import { KesiswaanPrestasiClient } from "@/components/features/landing/kesiswaan/KesiswaanPrestasiClient";
import { KesiswaanIconGlyph } from "@/components/features/landing/kesiswaan/KesiswaanIconGlyph";
import {
  KESISWAAN_PRESTASI_GRID_INTRO,
  KESISWAAN_PRESTASI_HERO_EYEBROW,
  KESISWAAN_PRESTASI_PAGE_LEDE,
  KESISWAAN_PRESTASI_PAGE_TITLE,
} from "@/lib/kesiswaan-landing-content";
import { publicSectionIntroClassName } from "@/lib/public-section-styles";
import {
  getPrestasiPublikTerverifikasi,
  type PrestasiPublikCard,
} from "@/services/kesiswaan-publik";
import { cn } from "@/lib/utils";

type KesiswaanPrestasiPageProps = {
  prestasiItems?: PrestasiPublikCard[];
};

export async function KesiswaanPrestasiPage({
  prestasiItems: prestasiProp,
}: KesiswaanPrestasiPageProps = {}): Promise<ReactElement> {
  const prestasiItems = prestasiProp ?? (await getPrestasiPublikTerverifikasi(48));

  return (
    <KesiswaanPageShell
      eyebrow={KESISWAAN_PRESTASI_HERO_EYEBROW}
      title={KESISWAAN_PRESTASI_PAGE_TITLE}
      lede={KESISWAAN_PRESTASI_PAGE_LEDE}
      titleAdornment={
        <KesiswaanIconGlyph iconKey="prestasi" className="size-8 text-blue-600 dark:text-blue-400" />
      }
      heroChildren={
        <p className={cn("mx-auto mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-400", publicSectionIntroClassName)}>
          {KESISWAAN_PRESTASI_GRID_INTRO}
        </p>
      }
    >
      <KesiswaanPrestasiClient prestasiItems={prestasiItems} />
    </KesiswaanPageShell>
  );
}
