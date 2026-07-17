import { ArrowRight, ImageIcon } from "lucide-react";
import type { ReactElement } from "react";

import { artikelSiswaToBeritaItem } from "@/components/features/landing/berita/artikel-siswa-to-berita-item";
import { beritaKegiatanToBeritaItem } from "@/components/features/landing/berita/berita-kegiatan-to-berita-item";
import { BERITA_TERBARU, type BeritaItem } from "@/components/features/landing/berita/berita-data";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import {
  BERITA_HOME_ARCHIVE_LEDE,
  BERITA_HOME_ARCHIVE_TITLE,
  BERITA_HOME_READ_MORE_LABEL,
} from "@/lib/berita-landing-content";
import type { ArtikelSiswaPublikCard } from "@/services/artikel-berita-publik";
import type { BeritaKegiatanPublikCard } from "@/services/berita-kegiatan-publik";
import { cn } from "@/lib/utils";

export type HomeBeritaArchiveSectionProps = {
  artikelSiswa?: ArtikelSiswaPublikCard[];
  beritaKegiatan?: BeritaKegiatanPublikCard[];
};

const HOME_BERITA_COUNT = 7;

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

function pickHomeBerita(items: BeritaItem[]): BeritaItem[] {
  return items.slice(0, HOME_BERITA_COUNT);
}

function BacaSelengkapnya({ className }: { className?: string }): ReactElement {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 border border-border-default bg-transparent px-3 py-1.5 text-sm font-medium text-brand transition-colors group-hover:border-brand/40 group-hover:bg-border-default/60",
        className,
      )}
    >
      {BERITA_HOME_READ_MORE_LABEL}
      <ArrowRight className="size-3.5 shrink-0" aria-hidden />
    </span>
  );
}

function BlogFeaturedCard({ item }: { item: BeritaItem }): ReactElement {
  const href = item.detailHref ?? "/berita/berita-terbaru";
  const hasCover = Boolean(item.coverSrc?.trim());

  return (
    <article className="flex h-full min-h-[28rem] flex-col lg:min-h-0">
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden rounded-lg",
          "aspect-[4/3] sm:aspect-[5/4] lg:aspect-auto lg:h-[48%] lg:min-h-[12rem]",
          hasCover ? publicOptimizedImageContainerClassName : "bg-brand",
        )}
      >
        {hasCover ? (
          <PublicOptimizedImage
            src={item.coverSrc}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-white/80" aria-hidden>
            <ImageIcon className="size-12 stroke-[1.25]" />
          </div>
        )}
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        <h3 className="text-left text-xl font-bold leading-snug tracking-tight text-heading sm:text-2xl">
          <PublicSiteLink
            href={href}
            className="transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          >
            {item.judul}
          </PublicSiteLink>
        </h3>

        <p className="mt-3 line-clamp-4 text-left text-sm leading-relaxed text-body sm:text-[15px]">
          {item.ringkasan}
        </p>

        <PublicSiteLink
          href={href}
          className="group mt-auto inline-flex pt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        >
          <BacaSelengkapnya />
        </PublicSiteLink>
      </div>
    </article>
  );
}

function BlogStandardCard({ item }: { item: BeritaItem }): ReactElement {
  const href = item.detailHref ?? "/berita/berita-terbaru";

  return (
    <article className="flex h-full min-h-0 flex-col border border-border-default bg-surface p-5 sm:p-6">
      <h3 className="text-left text-base font-bold leading-snug tracking-tight text-heading sm:text-lg">
        <PublicSiteLink
          href={href}
          className="transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        >
          {item.judul}
        </PublicSiteLink>
      </h3>

      <p className="mt-2 line-clamp-3 text-left text-sm leading-relaxed text-body">{item.ringkasan}</p>

      <PublicSiteLink
        href={href}
        className="group mt-auto inline-flex pt-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
      >
        <BacaSelengkapnya />
      </PublicSiteLink>
    </article>
  );
}

export function HomeBeritaArchiveSection({
  artikelSiswa = [],
  beritaKegiatan = [],
}: HomeBeritaArchiveSectionProps): ReactElement {
  const items = pickHomeBerita(mergeBeritaItems(artikelSiswa, beritaKegiatan));

  if (items.length === 0) {
    return <></>;
  }

  const [featured, ...rest] = items;
  const standard = rest.slice(0, 6);

  return (
    <MotionInView
      as="section"
      id="berita-terbaru"
      aria-labelledby="berita-terbaru-heading"
      className="scroll-mt-20 border-b border-border-default bg-surface py-14 sm:py-16 lg:py-20"
    >
      <div className="public-site-container">
        <div className="mx-auto max-w-6xl">
          <MotionInView as="header" className="mx-auto max-w-2xl text-center">
            <h2
              id="berita-terbaru-heading"
              className="text-3xl font-bold tracking-tight text-heading sm:text-4xl"
            >
              {BERITA_HOME_ARCHIVE_TITLE}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-body sm:text-base">
              {BERITA_HOME_ARCHIVE_LEDE}
            </p>
          </MotionInView>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-3 lg:grid-rows-3 lg:gap-6">
            <MotionInView as="div" className="h-full lg:row-span-3" delay={0.04}>
              <BlogFeaturedCard item={featured} />
            </MotionInView>

            {standard.map((item, idx) => (
              <MotionInView key={item.id} as="div" className="h-full min-h-0" delay={0.08 + idx * 0.03}>
                <BlogStandardCard item={item} />
              </MotionInView>
            ))}
          </div>
        </div>
      </div>
    </MotionInView>
  );
}
