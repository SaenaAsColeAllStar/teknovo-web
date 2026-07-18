import type { ReactElement } from "react";

import { AkademikIconGlyph } from "@/components/features/landing/AkademikIconGlyph";
import { BlueprintIsometricArt } from "@/components/features/landing/blueprint/BlueprintIsometricArt";
import { CenteredCtaStack } from "@/components/features/landing/CenteredCtaStack";
import { CrosshairFeatureGrid } from "@/components/features/landing/CrosshairFeatureGrid";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  AKADEMIK_JURUSAN_ITEMS,
  formatJurusanKodeBadge,
  getJurusanLandingCover,
  JURUSAN_CTA_BODY,
  JURUSAN_CTA_EYEBROW,
  JURUSAN_CTA_TITLE,
  JURUSAN_PKL_BAND,
  JURUSAN_SECTION_INTRO,
  JURUSAN_SECTION_TITLE,
  JURUSAN_STAT_LABELS,
} from "@/lib/akademik-landing-content";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";
import { getAkademikJurusanPublikStats } from "@/services/akademik-publik-stats";
import { getJurusanPublikCards, type JurusanPublikCard } from "@/services/jurusan-publik";
import { cn } from "@/lib/utils";

function resolveJurusanCopy(card: JurusanPublikCard | undefined, index: number) {
  const fallback = AKADEMIK_JURUSAN_ITEMS[index] ?? AKADEMIK_JURUSAN_ITEMS[0];
  const kode = card?.kode ?? (index === 0 ? "TM" : "ULW");
  const nama = card?.nama ?? fallback.title;
  const deskripsi = card?.deskripsi ?? fallback.description;
  const coverSrc = getJurusanLandingCover(kode, index);
  const badge = formatJurusanKodeBadge(kode);
  return { kode, nama, deskripsi, coverSrc, badge };
}

function titleWithBrandTail(name: string): ReactElement {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) {
    return <>{name}</>;
  }
  const head = parts.slice(0, -1).join(" ");
  const tail = parts[parts.length - 1];
  return (
    <>
      {head}{" "}
      <span className="text-brand">{tail}</span>
    </>
  );
}

/**
 * `#jurusan` — 2×2 crosshair feature grid inside `.public-site-container`.
 *
 * Desktop checkerboard:
 * | TL media — TM cover           | TR text — Teknik Mesin        |
 * | BL text — ULW (+ PKL/UKK)     | BR media — ULW / PKL + iso    |
 */
export async function AkademikJurusanSection({
  standalone = false,
}: {
  standalone?: boolean;
} = {}): Promise<ReactElement> {
  const [jurusanCards, jurusanStats] = await Promise.all([
    getJurusanPublikCards(),
    getAkademikJurusanPublikStats(),
  ]);

  const primary = resolveJurusanCopy(jurusanCards[0], 0);
  const secondary = resolveJurusanCopy(jurusanCards[1] ?? jurusanCards[0], 1);
  const jurusanCount = jurusanStats.jurusanAktif;
  const hasDistinctSecondary =
    jurusanCards.length > 1 && secondary.kode !== primary.kode;

  return (
    <MotionInView
      as="section"
      id="jurusan"
      className={cn(standalone ? "mt-14 space-y-10" : "mt-16 scroll-mt-24 space-y-10")}
      delay={0.12}
    >
      {!standalone ? (
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Penjurusan</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-heading sm:text-3xl">
            {JURUSAN_SECTION_TITLE}
          </h2>
          <div className="mt-3 space-y-3">
            {JURUSAN_SECTION_INTRO.map((paragraph) => (
              <p
                key={paragraph}
                className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </header>
      ) : null}

      <CrosshairFeatureGrid
        aria-label="Program kejuruan SMK TEKNOVO"
        className={standalone ? undefined : "mt-10"}
        topLeft={{
          kind: "media",
          src: primary.coverSrc,
          alt: `${primary.nama} — praktik kejuruan SMK TEKNOVO`,
          priority: true,
        }}
        topRight={{
          kind: "text",
          badgeIcon: <AkademikIconGlyph iconKey="jurusan" className="size-3.5" />,
          badgeLabel: primary.badge,
          title: titleWithBrandTail(primary.nama),
          body: primary.deskripsi,
        }}
        bottomLeft={{
          kind: "text",
          badgeIcon: <AkademikIconGlyph iconKey="pathway" className="size-3.5" />,
          badgeLabel: hasDistinctSecondary
            ? `${jurusanCount} ${JURUSAN_STAT_LABELS.jurusan}`
            : JURUSAN_STAT_LABELS.pkl,
          title: hasDistinctSecondary ? (
            titleWithBrandTail(secondary.nama)
          ) : (
            <>
              PKL &amp; <span className="text-brand">UKK</span>
            </>
          ),
          body: hasDistinctSecondary
            ? `${secondary.deskripsi} Dilengkapi ${JURUSAN_STAT_LABELS.pkl.toLowerCase()} dan ${JURUSAN_STAT_LABELS.sertifikasi.toLowerCase()}.`
            : JURUSAN_PKL_BAND.description,
        }}
        bottomRight={{
          kind: "media",
          src: hasDistinctSecondary
            ? secondary.coverSrc
            : LANDING_MEDIA.akademik.pklKompetensiIndustriWebp,
          alt: hasDistinctSecondary
            ? `${secondary.nama} — praktik kejuruan SMK TEKNOVO`
            : "Praktik Kerja Lapangan dan kompetensi industri SMK TEKNOVO",
          overlay: hasDistinctSecondary ? undefined : (
            <BlueprintIsometricArt className="max-w-[14rem] text-brand sm:max-w-[16rem]" />
          ),
        }}
      />

      <CenteredCtaStack
        delay={0.18}
        eyebrow={JURUSAN_CTA_EYEBROW}
        title={JURUSAN_CTA_TITLE}
        body={JURUSAN_CTA_BODY}
        primary={{ href: PUBLIC_SITE_PPDB_HREF, label: "Daftar PPDB" }}
        secondary={{ href: "/profil/program-sekolah", label: "Program sekolah" }}
      />
    </MotionInView>
  );
}
