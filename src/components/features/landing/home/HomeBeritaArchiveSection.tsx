import type { ReactElement } from "react";

import { artikelSiswaToBeritaItem } from "@/components/features/landing/berita/artikel-siswa-to-berita-item";
import { IcoArrowUpRight, IcoPenLine } from "@/components/icons/inline-glyphs";
import { beritaKegiatanToBeritaItem } from "@/components/features/landing/berita/berita-kegiatan-to-berita-item";
import { BERITA_TERBARU, type BeritaItem } from "@/components/features/landing/berita/berita-data";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import type { ArtikelSiswaPublikCard } from "@/services/artikel-berita-publik";
import type { BeritaKegiatanPublikCard } from "@/services/berita-kegiatan-publik";
import { cn } from "@/lib/utils";

export type HomeBeritaArchiveSectionProps = {
  artikelSiswa?: ArtikelSiswaPublikCard[];
  beritaKegiatan?: BeritaKegiatanPublikCard[];
};

const cardShellClass =
  "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-700";

function mergeBeritaItems(
  artikelSiswa: ArtikelSiswaPublikCard[],
  beritaKegiatan: BeritaKegiatanPublikCard[],
): BeritaItem[] {
  const dariSiswa = artikelSiswa.map(artikelSiswaToBeritaItem);
  const dariSekolah = beritaKegiatan.map(beritaKegiatanToBeritaItem);
  return [...dariSiswa, ...dariSekolah, ...BERITA_TERBARU].sort(
    (x, y) => new Date(y.tanggal).getTime() - new Date(x.tanggal).getTime(),
  );
}

function categoryLabel(item: BeritaItem): string {
  return item.source === "sekolah" ? "Berita sekolah" : "Artikel siswa";
}

function allocateArchiveSlots(items: BeritaItem[]): {
  featured: BeritaItem;
  compact: BeritaItem[];
  spotlight: BeritaItem | null;
} | null {
  if (items.length === 0) {
    return null;
  }

  const featured = items[0];
  const compact = items.slice(1, 3);
  const usedIds = new Set([featured.id, ...compact.map((item) => item.id)]);
  const spotlight =
    items.find((item) => item.source === "sekolah" && !usedIds.has(item.id)) ??
    items.find((item) => !usedIds.has(item.id)) ??
    null;

  return { featured, compact, spotlight };
}

function ArchiveFeaturedCard({ item }: { item: BeritaItem }): ReactElement {
  const href = item.detailHref ?? "/berita";

  return (
    <PublicSiteLink href={href} className={cn(cardShellClass, "group relative block min-h-[22rem] lg:min-h-full")}>
      <div className={cn("absolute inset-0", publicOptimizedImageContainerClassName)}>
        <PublicOptimizedImage
          src={item.coverSrc}
          alt={item.judul}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-slate-900/10" />
      </div>
      <span className="absolute left-5 top-5 rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
        Sorotan
      </span>
      <div className="absolute inset-x-5 bottom-5 rounded-xl border border-slate-200/80 bg-white/95 p-5 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/90">
        <div className="border-l-4 border-blue-600 pl-4">
          <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-white">{item.judul}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {item.ringkasan}
          </p>
          {item.creditLine ? (
            <p className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <IcoPenLine className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
              <span className="line-clamp-1">{item.creditLine}</span>
            </p>
          ) : null}
        </div>
      </div>
    </PublicSiteLink>
  );
}

function ArchiveCompactCard({ item }: { item: BeritaItem }): ReactElement {
  const href = item.detailHref ?? "/berita";

  return (
    <PublicSiteLink
      href={href}
      className={cn(cardShellClass, "flex h-full min-h-[12.5rem] flex-col justify-between p-6 sm:p-7")}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
          {categoryLabel(item)}
        </p>
        <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900 dark:text-white">{item.judul}</h3>
      </div>
      {item.creditLine ? (
        <p className="mt-6 text-xs font-medium text-slate-500 dark:text-slate-400">{item.creditLine}</p>
      ) : null}
    </PublicSiteLink>
  );
}

function ArchiveSpotlightCard({ item }: { item: BeritaItem }): ReactElement {
  const href = item.detailHref ?? "/berita";

  return (
    <PublicSiteLink
      href={href}
      className={cn(
        cardShellClass,
        "flex min-h-[11.5rem] items-center justify-between gap-6 border-transparent bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 p-6 sm:p-8",
        "hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-950/20",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200/90">
          {item.source === "sekolah" ? "Berita kegiatan" : "Sorotan siswa"}
        </p>
        <h3 className="mt-3 text-xl font-bold leading-snug text-white">{item.judul}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-blue-100/85">{item.ringkasan}</p>
      </div>
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white"
        aria-hidden
      >
        <IcoArrowUpRight className="size-5" />
      </span>
    </PublicSiteLink>
  );
}

export function HomeBeritaArchiveSection({
  artikelSiswa = [],
  beritaKegiatan = [],
}: HomeBeritaArchiveSectionProps): ReactElement {
  const slots = allocateArchiveSlots(mergeBeritaItems(artikelSiswa, beritaKegiatan));

  if (!slots) {
    return <></>;
  }

  const { featured, compact, spotlight } = slots;

  return (
    <MotionInView
      as="section"
      id="berita-terbaru"
      className="scroll-mt-20 border-b border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-slate-950 sm:py-16"
    >
      <div className="public-site-container">
        <MotionInView
          as="header"
          className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700 dark:text-blue-300">
              Arsip berita
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Blogger Club &amp; berita sekolah
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Tulisan siswa yang telah disetujui redaksi, berita kegiatan resmi, dan sorotan kegiatan dalam satu
              arsip editorial.
            </p>
          </div>
          <PublicSiteLink
            href="/berita/berita-terbaru"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Lihat semua berita
            <IcoArrowUpRight className="size-4" aria-hidden />
          </PublicSiteLink>
        </MotionInView>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-5">
          <MotionInView as="div" className="min-h-[22rem] lg:min-h-[28rem]" delay={0.05}>
            <ArchiveFeaturedCard item={featured} />
          </MotionInView>

          <div className="flex flex-col gap-4 lg:gap-5">
            {compact.length > 0 ? (
              <div className={cn("grid gap-4", compact.length > 1 ? "sm:grid-cols-2" : "grid-cols-1", "lg:gap-5")}>
                {compact.map((item, idx) => (
                  <MotionInView key={item.id} as="div" delay={0.08 + idx * 0.04}>
                    <ArchiveCompactCard item={item} />
                  </MotionInView>
                ))}
              </div>
            ) : null}
            {spotlight ? (
              <MotionInView as="div" delay={0.14}>
                <ArchiveSpotlightCard item={spotlight} />
              </MotionInView>
            ) : null}
          </div>
        </div>
      </div>
    </MotionInView>
  );
}
