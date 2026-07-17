import type { ReactElement } from "react";

import { KesiswaanPageShell } from "@/components/features/landing/KesiswaanPageShell";
import { KesiswaanSectionClient } from "@/components/features/landing/KesiswaanSectionClient";
import { KESISWAAN_HUB_PAGE_LEDE, KESISWAAN_HUB_PAGE_TITLE } from "@/lib/kesiswaan-landing-content";
import { getEkskulPublikCards, getPrestasiPublikTerverifikasi } from "@/services/kesiswaan-publik";
import { getKesiswaanHubPublikStats } from "@/services/kesiswaan-publik-stats";

/**
 * Kesiswaan publik — data ekskul & prestasi terverifikasi dari Prisma (bukan statis).
 */
export async function KesiswaanSection(): Promise<ReactElement> {
  const [ekskulItems, prestasiItems, hubStats] = await Promise.all([
    getEkskulPublikCards(),
    getPrestasiPublikTerverifikasi(24),
    getKesiswaanHubPublikStats(),
  ]);

  return (
    <KesiswaanPageShell title={KESISWAAN_HUB_PAGE_TITLE} lede={KESISWAAN_HUB_PAGE_LEDE} showHubHero>
      <KesiswaanSectionClient
        ekskulItems={ekskulItems}
        prestasiItems={prestasiItems}
        ekskulAktifCount={hubStats.ekskulAktif}
      />
    </KesiswaanPageShell>
  );
}
