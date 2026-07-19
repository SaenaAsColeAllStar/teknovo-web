import type { ReactElement } from "react";

import { KesiswaanPageShell } from "@/components/features/landing/KesiswaanPageShell";
import { KesiswaanSectionClient } from "@/components/features/landing/KesiswaanSectionClient";
import { KESISWAAN_HUB_PAGE_LEDE, KESISWAAN_HUB_PAGE_TITLE } from "@/lib/kesiswaan-landing-content";
import {
  getEkskulPublikCards,
  getPrestasiPublikTerverifikasi,
  type EkskulPublikCard,
  type PrestasiPublikCard,
} from "@/services/kesiswaan-publik";

type KesiswaanSectionProps = {
  ekskulItems?: EkskulPublikCard[];
  prestasiItems?: PrestasiPublikCard[];
};

/**
 * Kesiswaan publik — data ekskul & prestasi terverifikasi dari API/D1 (bukan mock).
 */
export async function KesiswaanSection({
  ekskulItems: ekskulProp,
  prestasiItems: prestasiProp,
}: KesiswaanSectionProps = {}): Promise<ReactElement> {
  const [ekskulItems, prestasiItems] = await Promise.all([
    ekskulProp ?? getEkskulPublikCards(),
    prestasiProp ?? getPrestasiPublikTerverifikasi(4),
  ]);

  return (
    <KesiswaanPageShell title={KESISWAAN_HUB_PAGE_TITLE} lede={KESISWAAN_HUB_PAGE_LEDE} showHubHero>
      <KesiswaanSectionClient
        ekskulItems={ekskulItems}
        prestasiItems={prestasiItems}
        ekskulAktifCount={ekskulItems.length}
      />
    </KesiswaanPageShell>
  );
}
